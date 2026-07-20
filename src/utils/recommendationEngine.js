// recommendationEngine.js
import { perfumes } from '../data/perfumes';
import { noteMatchesLabel, noteMatchesFamily } from './noteMatching';

// Each weight set sums to 100, and every dimension score is capped at its
// weight, so a perfume's score is a real 0-100 percentage.
const WEIGHTS = {
  WITH_NOTES: {
    NOTES: 30,
    TYPE: 20,
    GENDER: 20,
    SEASON: 15,
    OCCASION: 15
  },
  WITHOUT_NOTES: {
    TYPE: 35,
    GENDER: 25,
    SEASON: 20,
    OCCASION: 20
  }
};

const RESULT_COUNT = 3;
const SCORE_THRESHOLD = 20;
const DISLIKED_BACKFILL_PENALTY = 25;

export const getRecommendations = (preferences = {}) => {
  const merged = {
    gender: preferences.gender || 'unisex',
    type: preferences.type || '',
    season: preferences.season || '',
    occasion: preferences.occasion || [],
    notes: {
      liked: preferences.notes?.liked || [],
      disliked: preferences.notes?.disliked || []
    }
  };

  const activeWeights = merged.notes.liked.length > 0
    ? WEIGHTS.WITH_NOTES
    : WEIGHTS.WITHOUT_NOTES;

  console.log('[Recommendation Engine] Preferences:', merged,
    '| weights:', merged.notes.liked.length > 0 ? 'WITH_NOTES' : 'WITHOUT_NOTES');

  const scored = perfumes.map(perfume => {
    const { score, matchReasons } = calculatePerfumeScore(perfume, merged, activeWeights);
    return { ...perfume, score, matchReasons };
  });

  const hasDislikedNote = (perfume) => {
    const allNotes = [...perfume.notes.top, ...perfume.notes.middle, ...perfume.notes.base];
    return merged.notes.disliked.some(label =>
      allNotes.some(note => noteMatchesLabel(note, label))
    );
  };

  const clean = scored.filter(p => !hasDislikedNote(p));
  const excluded = scored.filter(p => hasDislikedNote(p));

  const results = clean
    .filter(p => p.score > SCORE_THRESHOLD)
    .sort((a, b) => b.score - a.score || b.rating - a.rating)
    .slice(0, RESULT_COUNT);

  // Backfill so heavy dislike lists can't leave the user with an empty page.
  // First from clean-but-low-scoring perfumes, then (clearly flagged) from
  // perfumes containing a disliked note.
  if (results.length < RESULT_COUNT) {
    const belowThreshold = clean
      .filter(p => p.score <= SCORE_THRESHOLD)
      .sort((a, b) => b.score - a.score || b.rating - a.rating);
    for (const p of belowThreshold) {
      if (results.length >= RESULT_COUNT) break;
      results.push(p);
    }
  }
  if (results.length < RESULT_COUNT) {
    const penalized = excluded
      .map(p => ({
        ...p,
        score: Math.max(0, p.score - DISLIKED_BACKFILL_PENALTY),
        matchReasons: [
          'Contains a note you asked to avoid — shown because few perfumes matched everything else',
          ...p.matchReasons
        ]
      }))
      .sort((a, b) => b.score - a.score || b.rating - a.rating);
    for (const p of penalized) {
      if (results.length >= RESULT_COUNT) break;
      results.push(p);
    }
  }

  // Be honest when a result isn't the fragrance family the user asked for
  // (this happens on thin paths, e.g. orientals in summer).
  const final = results.map(p =>
    merged.type && p.type !== merged.type
      ? {
          ...p,
          matchReasons: [
            `A ${p.type} fragrance rather than ${merged.type} — recommended for its strong match on your other preferences`,
            ...p.matchReasons.filter(r => !r.startsWith('Matches your preferred'))
          ]
        }
      : p
  );

  console.log('[Recommendation Engine] Results:',
    final.map(r => `${r.name} (${r.score})`).join(', '));

  return final;
};

const calculatePerfumeScore = (perfume, preferences, weights) => {
  let score = 0;
  const matchReasons = [];

  const add = ({ score: s, reason }) => {
    score += s;
    if (reason) matchReasons.push(reason);
  };

  if (weights.GENDER) add(calculateGenderScore(perfume, preferences.gender, weights.GENDER));
  if (preferences.type && weights.TYPE) add(calculateTypeScore(perfume, preferences.type, weights.TYPE));
  if (preferences.season && weights.SEASON) add(calculateSeasonScore(perfume, preferences.season, weights.SEASON));
  if (preferences.occasion.length > 0 && weights.OCCASION) {
    add(calculateOccasionScore(perfume, preferences.occasion, weights.OCCASION));
  }
  if (preferences.notes.liked.length > 0 && weights.NOTES) {
    add(calculateNotesScore(perfume, preferences.notes.liked, weights.NOTES));
  }

  // Penalties for hard mismatches
  let penalties = 0;

  if (preferences.season) {
    const oppositeSeasons = { summer: 'winter', winter: 'summer', spring: 'fall', fall: 'spring' };
    if (perfume.season.includes(oppositeSeasons[preferences.season]) &&
        !perfume.season.includes(preferences.season) &&
        !perfume.season.includes('all')) {
      penalties += 15;
    }
  }

  if (preferences.gender !== 'unisex' && perfume.gender !== 'unisex' &&
      preferences.gender !== perfume.gender) {
    penalties += 20;
  }

  return {
    score: Math.round(Math.max(0, score - penalties)),
    matchReasons
  };
};

const calculateGenderScore = (perfume, preferredGender, weight) => {
  if (perfume.gender === preferredGender) {
    return { score: weight, reason: `Perfect match for ${preferredGender} preferences` };
  }
  if (perfume.gender === 'unisex') {
    return { score: weight * 0.8, reason: 'Versatile unisex fragrance' };
  }
  if (preferredGender === 'unisex') {
    // User wants unisex but the perfume is gendered
    return { score: weight * 0.6, reason: null };
  }
  return { score: 0, reason: null };
};

// Neighbours on the fragrance wheel get partial credit.
const TYPE_NEIGHBORS = {
  fresh: ['floral'],
  floral: ['fresh', 'oriental'],
  oriental: ['floral', 'spicy'],
  spicy: ['oriental', 'woody'],
  woody: ['spicy', 'leather'],
  leather: ['woody', 'spicy']
};

const calculateTypeScore = (perfume, preferredType, weight) => {
  const perfumeType = perfume.type?.toLowerCase() || '';
  const preferred = preferredType.toLowerCase();

  if (perfumeType === preferred) {
    return { score: weight, reason: `Matches your preferred ${preferredType} fragrance type` };
  }
  if (TYPE_NEIGHBORS[preferred]?.includes(perfumeType)) {
    return { score: weight * 0.5, reason: `A ${perfumeType} fragrance, close to your ${preferredType} preference` };
  }
  return { score: 0, reason: null };
};

const calculateSeasonScore = (perfume, preferredSeason, weight) => {
  if (perfume.season.includes(preferredSeason)) {
    return { score: weight, reason: `Perfect for ${preferredSeason}` };
  }
  if (perfume.season.includes('all')) {
    return { score: weight * 0.75, reason: 'Versatile fragrance suitable for all seasons' };
  }

  const seasons = ['winter', 'spring', 'summer', 'fall'];
  const i = seasons.indexOf(preferredSeason);
  const adjacent = [seasons[(i + 3) % 4], seasons[(i + 1) % 4]];
  if (perfume.season.some(s => adjacent.includes(s))) {
    return { score: weight * 0.4, reason: null };
  }
  return { score: 0, reason: null };
};

// Both the quiz's occasion ids and the database's free-form occasion tags
// are mapped onto one canonical set before comparing.
const OCCASION_SYNONYMS = {
  casual: ['casual', 'daily', 'day', 'everyday'],
  work: ['work', 'office', 'business', 'professional'],
  evening: ['evening', 'night', 'party', 'formal'],
  special: ['special', 'formal', 'wedding', 'celebration'],
  date: ['date', 'romantic', 'cozy'],
  outdoor: ['outdoor', 'sport', 'beach', 'vacation', 'active']
};

const toCanonicalOccasions = (values) => {
  const canonical = new Set();
  values.forEach(value => {
    const v = String(value).toLowerCase();
    Object.entries(OCCASION_SYNONYMS).forEach(([key, synonyms]) => {
      if (synonyms.includes(v)) canonical.add(key);
    });
  });
  return canonical;
};

const calculateOccasionScore = (perfume, preferredOccasions, weight) => {
  const wanted = toCanonicalOccasions(preferredOccasions);
  const offered = toCanonicalOccasions(perfume.occasion);
  if (wanted.size === 0) return { score: 0, reason: null };

  const matched = [...wanted].filter(o => offered.has(o));
  return {
    score: (matched.length / wanted.size) * weight,
    reason: matched.length > 0 ? `Suitable for ${matched.join(' and ')}` : null
  };
};

const calculateNotesScore = (perfume, likedLabels, weight) => {
  const allNotes = [
    ...perfume.notes.top.map(note => ({ note, position: 1.0 })),
    ...perfume.notes.middle.map(note => ({ note, position: 0.95 })),
    ...perfume.notes.base.map(note => ({ note, position: 0.85 }))
  ];

  const matchedNotes = [];
  let total = 0;

  // Each liked note contributes its single best match: full credit for a
  // direct hit (scaled slightly by pyramid position), partial credit when
  // the perfume only has something from the same family. Averaging over
  // liked notes keeps the score capped at the dimension weight.
  likedLabels.forEach(label => {
    let best = 0;
    allNotes.forEach(({ note, position }) => {
      if (noteMatchesLabel(note, label)) {
        if (position > best) best = position;
        if (!matchedNotes.includes(note)) matchedNotes.push(note);
      }
    });
    if (best === 0 && allNotes.some(({ note }) => noteMatchesFamily(note, label))) {
      best = 0.4;
    }
    total += best;
  });

  return {
    score: (total / likedLabels.length) * weight,
    reason: matchedNotes.length > 0
      ? `Contains notes you love: ${matchedNotes.slice(0, 4).join(', ')}`
      : null
  };
};
