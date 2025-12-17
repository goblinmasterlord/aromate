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
│   └── preferencesMapper.js     # Maps quiz answers to preferences
├── data/
│   ├── perfumes.js              # Perfume database (65 entries)
│   ├── quizQuestions.jsx        # Quiz structure + fragranceNotes
│   ├── preferenceDetails.js     # Educational text for preferences
│   ├── fragranceNotes.js        # Note categories (unused, see quizQuestions)
│   └── noteIcons.js             # Icon mappings for notes
├── components/
│   ├── quiz/
│   │   ├── NotesPreferences.jsx # Note selection UI (liked/disliked)
│   │   ├── QuizOption.jsx       # Single/multi select option
│   │   └── QuizNavigation.jsx   # Prev/Next controls
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

**Two weight systems:** WITH_NOTES (2+ liked notes) vs WITHOUT_NOTES
**Key difference:** Without notes, TYPE weight jumps from 15→30

### Scoring Flow
1. Score each perfume across: gender, type, season, occasion, notes, characteristics
2. Apply penalties: opposite season (-15), wrong gender (-25)
3. Bonus +5 for 4+ matching dimensions
4. Hard filter: remove perfumes with disliked notes
5. Threshold filter: score > 20
6. Return top 3

### Critical Details
- `daily` in quiz maps to `casual` in database
- Notes use position weights: top (1.2×), middle (1.0×), base (0.8×)
- Family matching gives partial credit (e.g., "rose" matches any floral perfume)
- Characteristics default to 5/5/5 (quiz doesn't ask)

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
  occasion: string[],     // ['casual', 'evening', 'special', etc.]
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
  type: 'fresh' | 'floral' | 'woody' | 'oriental',
  season: 'spring' | 'summer' | 'fall' | 'winter',
  occasion: string[],     // Up to 3: ['daily', 'work', 'evening', etc.]
  notes: {
    liked: string[],      // Max 3
    disliked: string[]    // Unlimited
  }
}
```

---

## Quiz Structure (`src/data/quizQuestions.jsx`)

| Step | ID | Type | Options |
|------|-----|------|---------|
| 1 | gender | single-select | feminine, masculine, unisex |
| 2 | type | single-select | fresh, floral, woody, oriental |
| 3 | season | single-select | spring, summer, fall, winter |
| 4 | occasion | multi-select (max 3) | daily, work, evening, special, date, outdoor |
| 5 | notes | notes-preference | Custom UI via NotesPreferences.jsx |

### Note Categories (in quizQuestions.jsx:fragranceNotes)
Citrus, Floral, Woody, Oriental, Spicy, Fruity, Green, Gourmand, Marine, Earthy

---

## Important Implementation Details

### Occasion Mapping
Quiz uses 'daily' → Database uses 'casual'
```javascript
// In calculateOccasionScore()
const occasionMap = { 'daily': 'casual', ... }
```

### Notes Preference Constraints
- Max 3 liked notes (enforced in NotesPreferences.jsx)
- Has conflict detection (e.g., Vanilla conflicts with Marine Notes)
- Disliked notes filter out perfumes entirely (not scored)

### Score Threshold
Results only show perfumes with score > 20 (line 112 in recommendationEngine.js)

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
2. Add to `typeFamilies` in `recommendationEngine.js:calculateTypeScore()`
3. Add perfumes with that type in `perfumes.js`

### Modify scoring weights
Edit `WEIGHTS` object at top of `recommendationEngine.js`

### Add new quiz question
1. Add question object to `quizQuestions.jsx`
2. Handle in `Quiz.jsx` (may need custom component)
3. Update `preferencesMapper.js` to map answer
4. Add scoring logic in `recommendationEngine.js`

### Debug recommendations
Check console logs in `recommendationEngine.js` - search for `[Recommendation Engine]`

---

## Known Quirks
- `fragranceNotes.js` and `quizQuestions.jsx` both define note lists (quizQuestions is the one used)
- Admin page doesn't persist changes (local state only)
- Duplicate perfume: Oud Wood appears twice (id 11 and 22) with slightly different data
- characteristics defaults to 5/5/5 if not provided in quiz
