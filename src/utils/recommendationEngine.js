// recommendationEngine.js
import { perfumes } from '../data/perfumes';

const WEIGHTS = {
  NOTES: 25,          // Decreased from 35
  SEASON: 25,         // Increased from 20
  CHARACTERISTICS: 25, // Same
  OCCASION: 20,       // Increased from 15
  TYPE: 5             // Same
};

export const getRecommendations = (preferences = {}) => {
  const defaultPreferences = {
    characteristics: {
      intensity: 5,
      longevity: 5,
      sillage: 5
    },
    notes: {
      liked: [],
      disliked: []
    },
    type: '',
    season: '',
    occasion: [],
    gender: 'unisex'
  };

  const mergedPreferences = {
    ...defaultPreferences,
    ...preferences,
    characteristics: {
      ...defaultPreferences.characteristics,
      ...(preferences.characteristics || {})
    },
    notes: {
      ...defaultPreferences.notes,
      ...(preferences.notes || {})
    }
  };

  const recommendations = perfumes.map(perfume => {
    const score = calculatePerfumeScore(perfume, mergedPreferences);
    return {
      ...perfume,
      score: score.score,
      matchReasons: score.matchReasons
    };
  });

  // Filter out perfumes with disliked notes first
  const filteredRecommendations = recommendations.filter(perfume => {
    const allPerfumeNotes = [...perfume.notes.top, ...perfume.notes.middle, ...perfume.notes.base];
    return !mergedPreferences.notes.disliked.some(note => 
      allPerfumeNotes.some(perfumeNote => 
        perfumeNote.toLowerCase().includes(note.toLowerCase())
      )
    );
  });

  return filteredRecommendations
    .filter(p => p.score > 40) // Increased threshold for better matches
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
};

const calculatePerfumeScore = (perfume, preferences) => {
  let score = 0;
  const matchReasons = [];
  
  // Notes matching with improved algorithm
  if (preferences.notes?.liked?.length > 0) {
    const notesScore = calculateNotesScore(perfume, preferences.notes);
    score += notesScore.score;
    if (notesScore.reason) matchReasons.push(notesScore.reason);
  }

  // Season matching with weighted scoring
  if (preferences.season) {
    const seasonScore = calculateSeasonScore(perfume, preferences.season);
    score += seasonScore.score;
    if (seasonScore.reason) matchReasons.push(seasonScore.reason);
  }

  // Characteristics matching with improved accuracy
  const characteristicsScore = calculateCharacteristicsScore(perfume, preferences.characteristics);
  score += characteristicsScore.score;
  if (characteristicsScore.reason) matchReasons.push(characteristicsScore.reason);

  // Occasion matching (new)
  if (preferences.occasion?.length > 0) {
    const occasionScore = calculateOccasionScore(perfume, preferences.occasion);
    score += occasionScore.score;
    if (occasionScore.reason) matchReasons.push(occasionScore.reason);
  }

  // Type matching (new)
  if (preferences.type) {
    const typeScore = calculateTypeScore(perfume, preferences.type);
    score += typeScore.score;
    if (typeScore.reason) matchReasons.push(typeScore.reason);
  }

  return {
    score: Math.round(score),
    matchReasons: matchReasons.filter(reason => reason)
  };
};

const calculateNotesScore = (perfume, preferredNotes) => {
  const ADJUSTED_NOTES_WEIGHT = WEIGHTS.NOTES * 0.7; // Reducing direct note matching importance

  const allPerfumeNotes = [
    ...perfume.notes.top.map(note => ({ note, weight: 1.2 })),
    ...perfume.notes.middle.map(note => ({ note, weight: 1.0 })),
    ...perfume.notes.base.map(note => ({ note, weight: 0.8 }))
  ];

  const noteFamilies = {
    citrus: ['lemon', 'orange', 'bergamot', 'grapefruit', 'lime'],
    floral: ['rose', 'jasmine', 'lily', 'lavender', 'orange blossom'],
    woody: ['cedar', 'sandalwood', 'vetiver', 'pine'],
    fresh: ['mint', 'eucalyptus', 'sea notes', 'marine'],
    sweet: ['vanilla', 'caramel', 'chocolate', 'praline'],
    spicy: ['pepper', 'cardamom', 'cinnamon', 'ginger'],
    fruity: ['apple', 'pear', 'peach', 'berry', 'coconut'],
    green: ['grass', 'leaves', 'moss', 'tea'],
  };

  let familyScore = 0;
  let directScore = 0;
  let matchedNotes = [];

  preferredNotes.liked.forEach(preferredNote => {
    allPerfumeNotes.forEach(({ note, weight }) => {
      if (note.toLowerCase().includes(preferredNote.toLowerCase())) {
        matchedNotes.push(note);
        directScore += weight;
      }
    });

    Object.entries(noteFamilies).forEach(([family, notes]) => {
      if (notes.some(n => n.includes(preferredNote.toLowerCase()))) {
        const familyMatches = allPerfumeNotes.filter(({ note }) =>
          notes.some(n => note.toLowerCase().includes(n))
        );
        if (familyMatches.length > 0) {
          familyScore += 0.5 * familyMatches.length; // Partial credit for family matches
        }
      }
    });
  });

  const normalizedScore = (
    (directScore / Math.max(1, preferredNotes.liked.length) * 0.6 + 
    familyScore / Math.max(1, preferredNotes.liked.length) * 0.4) * 
    ADJUSTED_NOTES_WEIGHT
  );

  return {
    score: normalizedScore,
    reason: matchedNotes.length > 0 
      ? `Contains notes similar to your preferences: ${[...new Set(matchedNotes)].join(', ')}`
      : null
  };
};

const calculateSeasonScore = (perfume, preferredSeason) => {
  // Give more weight to season matching since it's more intuitive for users
  if (perfume.season.includes('all')) {
    return {
      score: WEIGHTS.SEASON * 0.9, // Increased from 0.8
      reason: 'Versatile fragrance suitable for all seasons'
    };
  }

  if (perfume.season.includes(preferredSeason)) {
    return {
      score: WEIGHTS.SEASON,
      reason: `Perfect for ${preferredSeason}`
    };
  }

  // More forgiving adjacent season matching
  const seasons = ['winter', 'spring', 'summer', 'fall'];
  const preferredIndex = seasons.indexOf(preferredSeason);
  const adjacentSeasons = [
    seasons[(preferredIndex - 1 + 4) % 4],
    seasons[(preferredIndex + 1) % 4]
  ];

  if (perfume.season.some(s => adjacentSeasons.includes(s))) {
    return {
      score: WEIGHTS.SEASON * 0.7, // Increased from 0.5
      reason: 'Adaptable to your preferred season'
    };
  }

  return { score: 0, reason: null };
};

const calculateCharacteristicsScore = (perfume, characteristics) => {
  const { intensity = 5, longevity = 5, sillage = 5 } = characteristics || {};
  
  let score = 0;
  let matchedCharacteristics = [];

  // Intensity match
  const intensityDiff = Math.abs(perfume.characteristics.intensity - intensity);
  if (intensityDiff <= 1) {
    score += WEIGHTS.CHARACTERISTICS / 3;
    matchedCharacteristics.push('intensity');
  } else if (intensityDiff <= 2) {
    score += (WEIGHTS.CHARACTERISTICS / 3) * 0.5;
  }

  // Longevity match
  const longevityDiff = Math.abs(perfume.characteristics.longevity - longevity);
  if (longevityDiff <= 1) {
    score += WEIGHTS.CHARACTERISTICS / 3;
    matchedCharacteristics.push('longevity');
  } else if (longevityDiff <= 2) {
    score += (WEIGHTS.CHARACTERISTICS / 3) * 0.5;
  }

  // Sillage match
  const sillageDiff = Math.abs(perfume.characteristics.sillage - sillage);
  if (sillageDiff <= 1) {
    score += WEIGHTS.CHARACTERISTICS / 3;
    matchedCharacteristics.push('sillage');
  } else if (sillageDiff <= 2) {
    score += (WEIGHTS.CHARACTERISTICS / 3) * 0.5;
  }

  let reason = null;
  if (matchedCharacteristics.length > 0) {
    reason = `Matches your preferred ${matchedCharacteristics.join(' and ')}`;
  }

  return { score, reason };
};

const calculateOccasionScore = (perfume, preferredOccasions) => {
  // Give more weight to occasion matching as it's more intuitive
  const matches = preferredOccasions.filter(occasion => 
    perfume.occasion.includes(occasion)
  );

  // Group similar occasions
  const occasionGroups = {
    casual: ['daily', 'casual', 'work', 'office'],
    formal: ['evening', 'formal', 'special'],
    outdoor: ['sport', 'beach', 'vacation', 'outdoor'],
  };

  let groupMatches = 0;
  Object.values(occasionGroups).forEach(group => {
    if (preferredOccasions.some(po => group.includes(po)) &&
        perfume.occasion.some(po => group.includes(po))) {
      groupMatches++;
    }
  });

  const directScore = (matches.length / preferredOccasions.length) * 0.7;
  const groupScore = (groupMatches / Object.keys(occasionGroups).length) * 0.3;
  const totalScore = (directScore + groupScore) * WEIGHTS.OCCASION;

  return {
    score: totalScore,
    reason: matches.length > 0 
      ? `Suitable for ${matches.join(' and ')}` 
      : groupMatches > 0 
        ? 'Suitable for similar occasions'
        : null
  };
};

const calculateTypeScore = (perfume, preferredType) => {
  if (perfume.tags.includes(preferredType)) {
    return {
      score: WEIGHTS.TYPE,
      reason: `Matches your preferred ${preferredType} fragrance type`
    };
  }
  return { score: 0, reason: null };
};