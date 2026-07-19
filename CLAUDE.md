# CLAUDE.md - Aromate Project Guide

## Project Overview
Aromate is a perfume recommendation web app. Users complete a quiz about fragrance preferences and receive personalized perfume recommendations based on a weighted scoring algorithm.

## Tech Stack
- **React 18** + Vite
- **Tailwind CSS** with custom theme (see `tailwind.config.js`)
- **Framer Motion** for animations
- **React Router** for routing
- **No backend** - all data is static in `/src/data/perfumes.js`

## Core User Flow
```
Home (/) → Quiz (/quiz) → Results (/results) → [Optional: Retake]
```

Admin panel at `/admin` for managing perfume data (local state only, no persistence).

---

## File Structure

```
src/
├── pages/
│   ├── Home.jsx          # Landing page
│   ├── Quiz.jsx          # Multi-step quiz (5 questions)
│   ├── Results.jsx       # Displays top 3 recommendations
│   └── Admin.jsx         # CRUD interface for perfumes
├── utils/
│   ├── recommendationEngine.js  # CORE: Scoring algorithm
│   └── noteMatching.js          # Token-based note matching helpers
├── data/
│   ├── perfumes.js              # Perfume database (70 entries)
│   ├── quizQuestions.jsx        # Quiz structure
│   ├── fragranceNotes.js        # SOURCE OF TRUTH: note taxonomy + match terms
│   ├── preferenceDetails.js     # Educational text for preferences
│   └── noteIcons.js             # Icon mappings for notes
├── components/
│   ├── quiz/
│   │   ├── NotesPreferences.jsx # Note selection UI (liked/disliked)
│   │   ├── QuizOption.jsx       # Single/multi select option
│   │   └── QuizInfoPanel.jsx    # Educational panel per step
│   ├── results/
│   │   ├── PerfumeCard.jsx      # Recommendation card with match reasons
│   │   └── PreferenceTooltip.jsx
│   ├── admin/
│   │   └── PerfumeForm.jsx      # Add/edit perfume form
│   ├── layout/
│   │   └── Layout.jsx, Navbar.jsx, etc.
│   └── EmailCollector.jsx       # Coming soon signup
└── App.jsx                      # Routes + lazy loading
```

---

## The Recommendation Algorithm

**Location:** `src/utils/recommendationEngine.js`
**Full documentation:** [`RECOMMENDATION_ENGINE.md`](./RECOMMENDATION_ENGINE.md)

### Quick Reference

**Two weight systems:** WITH_NOTES (1+ liked notes: NOTES 30/TYPE 20/GENDER 20/SEASON 15/OCCASION 15) vs WITHOUT_NOTES (TYPE 35/GENDER 25/SEASON 20/OCCASION 20). Each sums to 100; every dimension score is capped at its weight, so scores are real 0-100 percentages.

### Scoring Flow
1. Score each perfume across: gender, type, season, occasion, notes
2. Penalties: opposite season (-15), opposite gender (-20)
3. Hard filter: remove perfumes matching disliked notes
4. Threshold filter: score > 20, top 3 by score (rating breaks ties)
5. Backfill to 3 results if the dislike filter left too few (flagged in matchReasons)
6. Wrong-type results get an honest matchReason ("A fresh fragrance rather than oriental — ...")

### Critical Details
- Note matching is **token-based** via `src/utils/noteMatching.js` — "Rose" matches "turkish rose" but NOT "rosemary". Synonyms live in `fragranceNotes.js` `match` arrays (e.g. Cedar → cedar, cedarwood).
- Quiz occasion ids AND database occasion tags are both mapped to one canonical set (casual/work/evening/special/date/outdoor) via `OCCASION_SYNONYMS` — DB tags like `office`, `formal`, `beach`, `sport` resolve correctly.
- Family matching gives 0.4 partial credit (a liked Floral note boosts perfumes with other floral notes).
- Characteristics (longevity/sillage/intensity) are NOT scored — the quiz doesn't ask for them. Perfume `rating` is only a sort tiebreaker.

---

## Data Structures

### Perfume Object (`src/data/perfumes.js`)
```javascript
{
  id: number,
  name: string,
  brand: string,
  type: 'fresh' | 'floral' | 'woody' | 'oriental' | 'spicy' | 'leather',
  concentration: string,  // e.g., "Eau de Parfum"
  gender: 'feminine' | 'masculine' | 'unisex',
  price: number,
  size: string,
  year: number,
  season: string[],       // ['spring', 'summer'] or ['all']
  occasion: string[],     // free-form; canonicalized by the engine
  notes: {
    top: string[],
    middle: string[],
    base: string[]
  },
  characteristics: {
    longevity: 1-10,
    sillage: 1-10,
    intensity: 1-10
  },
  tags: string[],
  rating: number
}
```

### Quiz Answers (passed to recommendationEngine)
```javascript
{
  gender: 'feminine' | 'masculine' | 'unisex',
  type: 'fresh' | 'floral' | 'woody' | 'oriental' | 'spicy' | 'leather',
  season: 'spring' | 'summer' | 'fall' | 'winter',
  occasion: string[],     // Up to 3: ['daily', 'work', 'evening', etc.]
  notes: {
    liked: string[],      // Max 3, labels from fragranceNotes.js
    disliked: string[]    // Unlimited
  }
}
```

---

## Quiz Structure (`src/data/quizQuestions.jsx`)

| Step | ID | Type | Options |
|------|-----|------|---------|
| 1 | gender | single-select | feminine, masculine, unisex |
| 2 | type | single-select | fresh, floral, woody, oriental, spicy, leather |
| 3 | season | single-select | spring, summer, fall, winter |
| 4 | occasion | multi-select (max 3) | daily, work, evening, special, date, outdoor |
| 5 | notes | notes-preference | Custom UI via NotesPreferences.jsx (optional step) |

### Note Taxonomy (`src/data/fragranceNotes.js`)
Categories: Popular, Citrus, Floral, Woody, Oriental, Spicy, Fruity, Fresh, Gourmand, Leather & Tobacco.
Every selectable note carries `match` terms verified against the perfume DB — the picker, the admin form, and the engine all read this one file. When adding a note, make sure its match terms hit at least one perfume.

---

## Important Implementation Details

### Notes Preference Constraints
- Max 3 liked notes (enforced in NotesPreferences.jsx)
- Conflict detection (e.g., Vanilla conflicts with Marine Notes) — only labels that exist in fragranceNotes.js
- Disliked notes hard-filter perfumes; the engine backfills (with a flag) if too few remain
- The notes step is optional: Complete is always enabled there

### Navigation
- Routes are NOT wrapped in AnimatePresence — combining mode="wait" exits with lazy routes caused intermittent blank screens. Pages animate themselves on mount.
- Quiz steps animate inside ONE AnimatePresence container keyed by step.
- `NotesPreferences` calls `onChange` from an effect that depends on it — Quiz.jsx must pass a stable (useCallback) handler or the notes step enters an infinite update loop.

### State Management
- Quiz state lives in Quiz.jsx (`useState`)
- Results passed via `navigate('/results', { state: { recommendations, answers } })`
- Admin changes are local state only (no persistence)

---

## Styling

### Color Palette (tailwind.config.js)
- **Background:** 900=#09090b, 800=#18181b, 700=#27272a
- **Primary (violet/fuchsia):** 400=#e879f9, 500=#d946ef
- **Accent:** Same as primary
- **Neutral:** Standard gray scale

### Common Patterns
- Cards: `bg-background-800/50 border border-neutral-800 rounded-xl`
- Gradient text: `bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent`
- Hover states: `hover:border-violet-400/20 transition-all duration-300`

---

## Development Commands
```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # ESLint
```

---

## Common Tasks Reference

### Add a new perfume type
1. Add option in `quizQuestions.jsx` (type question)
2. Add to `TYPE_NEIGHBORS` in `recommendationEngine.js`
3. Add to `perfumeTypes` in `components/admin/PerfumeForm.jsx`
4. Add perfumes with that type in `perfumes.js`

### Add a new selectable note
1. Add `{ label, match }` to the right category in `fragranceNotes.js`
2. Verify the match terms hit at least one perfume in `perfumes.js` (token matching!)

### Modify scoring weights
Edit `WEIGHTS` object at top of `recommendationEngine.js` (keep each set summing to 100)

### Add new quiz question
1. Add question object to `quizQuestions.jsx`
2. Handle in `Quiz.jsx` (may need custom component + `isAnswered` case)
3. Add scoring logic in `recommendationEngine.js`

### Debug recommendations
Check console logs in `recommendationEngine.js` - search for `[Recommendation Engine]`

---

## Known Quirks
- Admin page doesn't persist changes (local state only)
- The database's `occasion` tags are free-form (e.g. `beach`, `formal`, `office`); the engine canonicalizes them, so new entries don't need to use exact quiz ids
- `SearchableSelect.jsx` and `noteIcons.js` are currently unused
- Lint has pre-existing debt (prop-types, unescaped entities) across most components
