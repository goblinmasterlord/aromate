# Recommendation Engine Documentation

**File:** `src/utils/recommendationEngine.js`

This document explains how the perfume recommendation algorithm works in detail.

---

## Algorithm Overview

```
User Preferences → Score All Perfumes → Filter Disliked Notes → Filter by Threshold → Sort → Top 3
```

### Entry Point
```javascript
getRecommendations(preferences) → returns top 3 perfumes with scores and matchReasons
```

---

## Weight Systems

The algorithm uses two different weight systems depending on whether the user selected notes.

### WITH_NOTES (when liked notes >= 2)
| Dimension | Weight | Total Possible |
|-----------|--------|----------------|
| NOTES | 25 | 25 |
| GENDER | 20 | 20 |
| TYPE | 15 | 15 |
| SEASON | 15 | 15 |
| OCCASION | 15 | 15 |
| CHARACTERISTICS | 10 | 10 |
| **Total** | **100** | |

### WITHOUT_NOTES (when liked notes < 2)
| Dimension | Weight | Total Possible |
|-----------|--------|----------------|
| TYPE | 30 | 30 |
| GENDER | 20 | 20 |
| OCCASION | 20 | 20 |
| SEASON | 15 | 15 |
| CHARACTERISTICS | 15 | 15 |
| **Total** | **100** | |

**Key insight:** Without notes, TYPE becomes the dominant factor (30 vs 15).

---

## Scoring Functions

### 1. Gender Score (`calculateGenderScore`)

| Scenario | Score | Reason |
|----------|-------|--------|
| Direct match (e.g., feminine→feminine) | weight × 1.0 | "Perfect match for {gender} preferences" |
| User prefers unisex | weight × 0.8 | "Suitable for all preferences" |
| Perfume is unisex | weight × 0.7 | "Versatile unisex fragrance" |
| Opposite gender | weight × 0.1 | null |

---

### 2. Type Score (`calculateTypeScore`)

**Direct match:** Full weight

**Family match (70% weight):** Uses type families:
```javascript
typeFamilies = {
  floral: ['floral', 'floral fresh', 'floral woody', 'floral oriental'],
  fresh: ['fresh', 'citrus', 'aquatic', 'aromatic', 'green'],
  woody: ['woody', 'floral woody', 'spicy woody', 'oriental woody', 'cedar'],
  oriental: ['oriental', 'spicy oriental', 'floral oriental', 'oriental woody'],
  spicy: ['spicy', 'spicy woody', 'spicy oriental']
}
```

**Woody fallback (50% weight):** If user prefers woody and perfume contains woody notes (cedar, sandalwood, oud, vetiver, patchouli), gives partial credit even if type doesn't match.

---

### 3. Season Score (`calculateSeasonScore`)

| Scenario | Score |
|----------|-------|
| Direct match | weight × 1.0 |
| Perfume is "all seasons" | weight × 0.7 |
| Adjacent season match | weight × 0.5 |
| No match | 0 |

**Adjacent seasons:**
- winter ↔ spring ↔ summer ↔ fall ↔ winter (circular)

---

### 4. Occasion Score (`calculateOccasionScore`)

**Important mapping (quiz → database):**
```javascript
occasionMap = {
  'daily': 'casual',  // KEY: Quiz says "daily", DB says "casual"
  'work': 'work',
  'evening': 'evening',
  'special': 'special',
  'date': 'date',
  'outdoor': 'outdoor'
}
```

**Scoring formula:**
```
totalScore = (directScore × 0.8 + groupScore × 0.2) × weight
```

**Occasion groups for partial matching:**
```javascript
occasionGroups = {
  casual: ['daily', 'casual', 'work', 'office'],
  formal: ['evening', 'formal', 'special'],
  outdoor: ['sport', 'beach', 'vacation', 'outdoor']
}
```

---

### 5. Notes Score (`calculateNotesScore`)

Most complex scoring function. Uses two matching strategies:

#### A. Direct Matching (70% of notes weight)
Checks if user's liked note appears in perfume's notes (case-insensitive substring match).

**Note position weights:**
- Top notes: 1.2×
- Middle notes: 1.0×
- Base notes: 0.8×

#### B. Family Matching (30% of notes weight)
If user's liked note belongs to a note group, checks if perfume has ANY note from that group.

**Note Groups:**
```javascript
noteGroups = {
  citrus: ['bergamot', 'lemon', 'orange', 'grapefruit', 'lime', 'mandarin', 'yuzu'],
  floral: ['rose', 'jasmine', 'lavender', 'violet', 'iris', 'lily', 'orange blossom'],
  woody: ['sandalwood', 'cedar', 'oud', 'vetiver', 'patchouli', 'pine'],
  oriental: ['vanilla', 'amber', 'musk', 'incense', 'benzoin', 'myrrh'],
  fresh: ['mint', 'marine notes', 'aquatic', 'ocean', 'sea salt', 'cucumber'],
  fruity: ['apple', 'pear', 'peach', 'berry', 'coconut', 'fig'],
  spicy: ['cinnamon', 'cardamom', 'pepper', 'clove', 'nutmeg'],
  gourmand: ['chocolate', 'coffee', 'caramel', 'honey', 'almond'],
  green: ['grass', 'tea', 'bamboo', 'leaf', 'moss'],
  leather: ['leather', 'suede', 'tobacco']
}
```

**Formula:**
```javascript
normalizedScore = (
  (directScore / likedNotesCount) × 0.7 +
  (familyScore / likedNotesCount) × 0.3
) × NOTES_WEIGHT
```

---

### 6. Characteristics Score (`calculateCharacteristicsScore`)

Compares intensity, longevity, sillage (each 1-10 scale).

| Difference | Score per characteristic |
|------------|-------------------------|
| ≤ 1 | weight/3 × 1.0 |
| ≤ 2 | weight/3 × 0.5 |
| > 2 | 0 |

**Default user preferences:** 5/5/5 (middle values) - quiz doesn't ask about these yet.

---

## Penalties

Applied AFTER all positive scores are calculated.

### Season Mismatch Penalties
| Condition | Penalty |
|-----------|---------|
| Perfume has opposite season (summer↔winter, spring↔fall) | -15 |
| Perfume missing preferred season entirely | -5 |
| Exception: Perfume is "all seasons" | No penalty |

### Gender Mismatch Penalty
| Condition | Penalty |
|-----------|---------|
| User is specific gender AND perfume is opposite specific gender | -25 |
| Either is unisex | No penalty |

---

## Bonuses

| Condition | Bonus |
|-----------|-------|
| 4+ dimensions have positive scores | +5 ("Well-rounded match") |

---

## Filtering

### 1. Disliked Notes Filter (Hard filter)
Perfumes are COMPLETELY EXCLUDED if any of their notes (top/middle/base) contain a user's disliked note (case-insensitive substring match).

```javascript
// This perfume is filtered out:
perfume.notes.base = ['vanilla', 'musk']
user.disliked = ['Vanilla']  // Match!
```

### 2. Score Threshold
Only perfumes with `score > 20` pass to final results.

**Note:** This was lowered from 30 to be more inclusive.

---

## Final Output

```javascript
{
  ...perfumeData,
  score: number,        // 0-100 (rounded)
  matchReasons: string[] // Human-readable reasons shown in UI
}
```

Returns top 3 perfumes sorted by score descending.

---

## Debugging

Console logs are built in. Search for `[Recommendation Engine]` in console:
- Starting preferences summary
- Weight system being used
- First 10 scores before filtering
- Count of scores above threshold
- Final matches with scores

---

## Tuning Guide

### To make notes more/less important:
Edit `WEIGHTS.WITH_NOTES.NOTES` (currently 25)

### To change minimum match quality:
Edit `scoreThreshold` on line 112 (currently 20)

### To add a new fragrance type:
1. Add to `typeFamilies` object in `calculateTypeScore()`
2. Add perfumes with that type to `perfumes.js`

### To add a new note family:
Add to `noteGroups` object at top of file

### To change how strict gender matching is:
- Adjust multipliers in `calculateGenderScore()` (0.8, 0.7, 0.1)
- Adjust gender penalty (currently -25)

### To change seasonal tolerance:
- Adjust adjacent season multiplier (currently 0.5)
- Adjust opposite season penalty (currently -15)
- Adjust missing season penalty (currently -5)

---

## Edge Cases

1. **User skips notes:** Uses WITHOUT_NOTES weights, notes scoring is skipped entirely

2. **User selects only 1 note:** Still uses WITHOUT_NOTES weights (requires >= 2)

3. **All perfumes filtered out:** Returns empty array (Results.jsx redirects to quiz)

4. **Perfume has season: ['all']:** Gets 70% of season score, immune to season penalties

5. **No occasions selected:** Occasion scoring is skipped (weight redistributed implicitly)

6. **Characteristics not in quiz:** Defaults to 5/5/5, most perfumes will partially match
