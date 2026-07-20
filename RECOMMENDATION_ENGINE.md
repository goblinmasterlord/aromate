# Recommendation Engine Documentation

**File:** `src/utils/recommendationEngine.js`
**Note matching:** `src/utils/noteMatching.js`
**Note taxonomy:** `src/data/fragranceNotes.js`

This document explains how the perfume recommendation algorithm works.

---

## Algorithm Overview

```
User Preferences → Score All Perfumes → Split by Disliked Notes →
Threshold Filter → Sort → Top 3 (backfilled if needed) → Honesty Labels
```

### Entry Point
```javascript
getRecommendations(preferences, options?) → top 3 perfumes with score (0-100) and matchReasons
```

`options.emphasis === 'type'` restricts the pool to the requested fragrance
type and ranks within it, waiving season penalties. Out-of-season picks get an
honest label ("A true spicy pick, though not a typical summer scent — best
saved for cooler evenings"). Used by the Results page's thin-path toggle.

Preferences shape (all fields optional):
```javascript
{
  gender: 'feminine' | 'masculine' | 'unisex',
  type: 'fresh' | 'floral' | 'woody' | 'oriental' | 'spicy' | 'leather',
  season: 'spring' | 'summer' | 'fall' | 'winter',
  occasion: string[],                       // quiz ids, e.g. ['daily', 'work']
  notes: { liked: string[], disliked: string[] }  // labels from fragranceNotes.js
}
```

---

## Weight Systems

Two weight sets, chosen by whether the user picked **any** liked notes.
Each set sums to 100 and every dimension score is capped at its weight,
so a perfume's score is a true 0–100 percentage.

### WITH_NOTES (liked notes ≥ 1)
| Dimension | Weight |
|-----------|--------|
| NOTES | 30 |
| TYPE | 20 |
| GENDER | 20 |
| SEASON | 15 |
| OCCASION | 15 |

### WITHOUT_NOTES
| Dimension | Weight |
|-----------|--------|
| TYPE | 35 |
| GENDER | 25 |
| SEASON | 20 |
| OCCASION | 20 |

Characteristics (longevity/sillage/intensity) are **not** scored as
preferences: the quiz never asks for them, and scoring them against a fixed
default just rewarded perfumes with average stats. Perfume `rating` is used
only as a sort tiebreaker.

**Wearability guard:** intensity IS used as a season-context penalty —
summer penalizes intensity ≥ 8 by `(intensity − 7) × 4`, winter penalizes
intensity ≤ 3 by `(4 − intensity) × 3`. This keeps "beast mode" scents out
of summer results without asking the user anything.

---

## Note Matching (`noteMatching.js`)

User-selectable notes are defined in `src/data/fragranceNotes.js`. Each label
carries `match` terms compared **token-wise** against DB note names:

- A term matches a perfume note when *every token* of the term appears among
  the note's tokens: `"lemon"` matches `"sicilian lemon"`.
- No substring false positives: `"Rose"` does not match `"rosemary"`,
  `"Apple"` does not match `"pineapple"`.
- Synonyms live in the taxonomy (`Cedar` → `['cedar', 'cedarwood']`,
  `Moss` → `['moss', 'oakmoss']`).

Family (partial) credit uses the label's category: liking `Rose` gives a
small boost to perfumes with other Floral-category notes.

---

## Scoring Functions

### Gender
| Scenario | Score |
|----------|-------|
| Direct match | weight × 1.0 |
| Perfume is unisex | weight × 0.8 |
| User prefers unisex, perfume is gendered | weight × 0.6 |
| Opposite gender | 0 (plus −20 penalty) |

### Type
| Scenario | Score |
|----------|-------|
| Direct match | weight × 1.0 |
| Neighbour on the fragrance wheel (`TYPE_NEIGHBORS`) | weight × 0.5 |
| Otherwise | 0 |

Wheel: fresh ↔ floral ↔ oriental ↔ spicy ↔ woody ↔ leather.

### Season
| Scenario | Score |
|----------|-------|
| Season listed | weight × 1.0 |
| `'all'` seasons | weight × 0.75 |
| Adjacent season | weight × 0.4 |
| Opposite season (and preferred not listed) | 0 (plus −15 penalty) |

### Occasion
Quiz ids **and** DB tags are both mapped onto one canonical set
(`OCCASION_SYNONYMS`): casual, work, evening, special, date, outdoor.
DB tags like `office`, `business`, `formal`, `beach`, `sport` all resolve.
Score = (matched canonical occasions / requested) × weight.

### Notes
Each liked note contributes its best match:
- direct hit: 1.0 (top), 0.95 (middle), 0.85 (base)
- family-only match: 0.4
- nothing: 0

Score = average across liked notes × weight (so it can never exceed the
dimension weight).

---

## Filtering & Results

1. **Disliked notes** are a hard filter (token matching, so `Rose` no longer
   removes rosemary perfumes).
2. **Threshold:** results need score > 20.
3. **Top 3** by score (rating breaks ties).
4. **Backfill:** if fewer than 3 remain, fill first from clean perfumes below
   the threshold, then from disliked-note perfumes with a −25 penalty and an
   explicit "contains a note you asked to avoid" match reason. The user
   always gets 3 results.
5. **Honesty labels:** when a result's type differs from the requested type
   (thin paths, e.g. orientals in summer), the first match reason says so
   instead of pretending it was a perfect fit.

---

## Debugging

Search the browser console for `[Recommendation Engine]` — it logs the merged
preferences, the active weight set, and the final results.
