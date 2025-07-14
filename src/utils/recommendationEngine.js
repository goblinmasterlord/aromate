// recommendationEngine.js
import { perfumes } from '../data/perfumes';

const WEIGHTS = {
  WITH_NOTES: {
    NOTES: 25,      // Adjusted to make room for gender
    SEASON: 15,     // Adjusted
    OCCASION: 15,   // Adjusted
    TYPE: 15,       // Type preference
    GENDER: 20,     // Gender is important for personal preference
    CHARACTERISTICS: 10
  },
  WITHOUT_NOTES: {
    SEASON: 15,
    OCCASION: 20,
    TYPE: 30,
    GENDER: 20,     // Gender is important even without notes
    CHARACTERISTICS: 15
  }
};

// Add comprehensive note groups at the top of the file
const noteGroups = {
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
};

export const getRecommendations = (preferences = {}) => {
  console.log('[Recommendation Engine] Starting with preferences:', {
    gender: preferences.gender || 'unisex',
    type: preferences.type,
    season: preferences.season,
    occasionCount: preferences.occasion?.length || 0,
    likedNotes: preferences.notes?.liked?.length || 0,
    dislikedNotes: preferences.notes?.disliked?.length || 0
  });

  // Determine which weight system to use - require at least 2 liked notes
  const activeWeights = preferences.notes?.liked?.length > 1 
    ? WEIGHTS.WITH_NOTES 
    : WEIGHTS.WITHOUT_NOTES;
  
  console.log('[Recommendation Engine] Weight system:', preferences.notes?.liked?.length > 1 ? 'WITH_NOTES' : 'WITHOUT_NOTES');

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

  // Removed verbose merged preferences log

  const recommendations = perfumes.map(perfume => {
    // Scoring each perfume
    const score = calculatePerfumeScore(perfume, mergedPreferences, activeWeights);
    
    // Score is already out of 100, no normalization needed
    const normalizedScore = score.score;
    
    return {
      ...perfume,
      score: normalizedScore,
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

  console.log('[Recommendation Engine] Scores before filtering:', 
    recommendations.map(r => `${r.name}: ${r.score}`).slice(0, 10).join(', '));

  // Log filtered recommendations
  const scoreThreshold = 20; // Lowered from 30 to be more inclusive
  const finalRecommendations = filteredRecommendations
    .filter(p => p.score > scoreThreshold)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
  
  console.log(`[Recommendation Engine] Scores > ${scoreThreshold}:`, filteredRecommendations.filter(p => p.score > scoreThreshold).length);

  console.log(`[Recommendation Engine] Found ${finalRecommendations.length} matches:`, 
    finalRecommendations.map(r => `${r.name} (${r.score}%)`).join(', '));

  return finalRecommendations;
};

const calculatePerfumeScore = (perfume, preferences, weights) => {
  // Calculate score for each perfume
  
  let score = 0;
  const matchReasons = [];
  const scoreBreakdown = {};

  // Gender matching - CRITICAL for personalization
  if (preferences.gender && weights.GENDER) {
    const genderScore = calculateGenderScore(perfume, preferences.gender, weights.GENDER);
    score += genderScore.score;
    scoreBreakdown.gender = genderScore.score;
    if (genderScore.reason) matchReasons.push(genderScore.reason);
  }

  // Type matching (moved up for priority)
  if (preferences.type) {
    const typeScore = calculateTypeScore(perfume, preferences.type, weights.TYPE);
    score += typeScore.score;
    scoreBreakdown.type = typeScore.score;
    if (typeScore.reason) matchReasons.push(typeScore.reason);
    // Type score calculated
  }

  // Season matching
  if (preferences.season) {
    const seasonScore = calculateSeasonScore(perfume, preferences.season, weights.SEASON);
    score += seasonScore.score;
    scoreBreakdown.season = seasonScore.score;
    if (seasonScore.reason) matchReasons.push(seasonScore.reason);
  }

  // Characteristics matching
  const characteristicsScore = calculateCharacteristicsScore(
    perfume, 
    preferences.characteristics,
    weights.CHARACTERISTICS
  );
  score += characteristicsScore.score;
  scoreBreakdown.characteristics = characteristicsScore.score;
  if (characteristicsScore.reason) matchReasons.push(characteristicsScore.reason);

  // Occasion matching
  if (preferences.occasion?.length > 0) {
    const occasionScore = calculateOccasionScore(
      perfume, 
      preferences.occasion,
      weights.OCCASION
    );
    score += occasionScore.score;
    scoreBreakdown.occasion = occasionScore.score;
    if (occasionScore.reason) matchReasons.push(occasionScore.reason);
  }

  // Notes matching - CRITICAL FIX: This was missing!
  if (preferences.notes?.liked?.length > 0 && weights.NOTES) {
    const notesScore = calculateNotesScore(perfume, preferences.notes, weights.NOTES);
    score += notesScore.score;
    scoreBreakdown.notes = notesScore.score;
    if (notesScore.reason) matchReasons.push(notesScore.reason);
    // Notes score calculated
  }

  // Apply penalties for mismatches
  let penalties = 0;
  
  // Penalty for wrong season (opposite seasons)
  if (preferences.season) {
    const oppositeSeasons = {
      'summer': 'winter',
      'winter': 'summer',
      'spring': 'fall',
      'fall': 'spring'
    };
    if (perfume.season.includes(oppositeSeasons[preferences.season]) && 
        !perfume.season.includes('all')) {
      penalties += 15; // Increased from 10 - stronger seasonal mismatch penalty
    }
    
    // Additional penalty if perfume doesn't include the preferred season at all
    if (!perfume.season.includes(preferences.season) && !perfume.season.includes('all')) {
      penalties += 5; // Missing preferred season penalty
    }
  }

  // Gender mismatch penalty - only for strong opposite preferences
  if (preferences.gender && preferences.gender !== 'unisex' && perfume.gender !== 'unisex') {
    if (preferences.gender !== perfume.gender) {
      penalties += 25; // Strong penalty for opposite gender when both have specific gender
    }
  }

  // Apply penalties
  score = Math.max(0, score - penalties);
  
  // Bonus for matching multiple dimensions well
  const dimensionsMatched = Object.values(scoreBreakdown).filter(s => s > 0).length;
  if (dimensionsMatched >= 4) {
    score += 5; // Bonus for well-rounded match
    matchReasons.push('Well-rounded match across preferences');
  }

  // Return final score
  return {
    score: Math.round(score),
    matchReasons: matchReasons.filter(reason => reason)
  };
};

const calculateGenderScore = (perfume, preferredGender, weight) => {
  // Direct match
  if (perfume.gender === preferredGender) {
    return {
      score: weight,
      reason: `Perfect match for ${preferredGender} preferences`
    };
  }

  // Unisex preference matches all
  if (preferredGender === 'unisex') {
    return {
      score: weight * 0.8, // Slight reduction as some people prefer specifically gendered scents
      reason: 'Suitable for all preferences'
    };
  }

  // Unisex perfume matches any preference moderately well
  if (perfume.gender === 'unisex') {
    return {
      score: weight * 0.7,
      reason: 'Versatile unisex fragrance'
    };
  }

  // Opposite gender is heavily penalized
  return {
    score: weight * 0.1, // Very low score but not zero
    reason: null
  };
};

const calculateNotesScore = (perfume, preferredNotes, weight) => {
  // Use full weight, not adjusted
  const NOTES_WEIGHT = weight;

  // Logging object to track scoring details
  const scoring = {
    perfume: perfume.name,
    directMatches: [],
    familyMatches: [],
    weights: {
      direct: 0,
      family: 0
    }
  };

  const allPerfumeNotes = [
    ...perfume.notes.top.map(note => ({ note, weight: 1.2, type: 'top' })),
    ...perfume.notes.middle.map(note => ({ note, weight: 1.0, type: 'middle' })),
    ...perfume.notes.base.map(note => ({ note, weight: 0.8, type: 'base' }))
  ];

  let familyScore = 0;
  let directScore = 0;
  let matchedNotes = [];

  preferredNotes.liked.forEach(preferredNote => {
    // Direct matching
    allPerfumeNotes.forEach(({ note, weight, type }) => {
      if (note.toLowerCase().includes(preferredNote.toLowerCase())) {
        directScore += weight;
        matchedNotes.push(note);
        scoring.directMatches.push({
          preferred: preferredNote,
          matched: note,
          weight,
          type
        });
      }
    });

    // Family matching - replace the existing noteFamilies logic
    Object.entries(noteGroups).forEach(([family, notes]) => {
      const preferredNoteInFamily = notes.some(n => 
        n.toLowerCase().includes(preferredNote.toLowerCase())
      );
      
      if (preferredNoteInFamily) {
        const familyMatches = allPerfumeNotes.filter(({ note }) =>
          notes.some(n => note.toLowerCase().includes(n.toLowerCase()))
        );
        
        if (familyMatches.length > 0) {
          familyScore += 0.5 * familyMatches.length;
          scoring.familyMatches.push({
            family,
            preferredNote,
            matches: familyMatches.map(m => m.note)
          });
        }
      }
    });
  });

  const normalizedScore = (
    (directScore / Math.max(1, preferredNotes.liked.length) * 0.7 +  // Increased direct match importance
    familyScore / Math.max(1, preferredNotes.liked.length) * 0.3) *   // Reduced family match importance
    NOTES_WEIGHT
  );

  scoring.weights.direct = directScore;
  scoring.weights.family = familyScore;
  scoring.finalScore = normalizedScore;

  // Note matching completed

  return {
    score: normalizedScore,
    reason: matchedNotes.length > 0 
      ? `Contains notes similar to your preferences: ${[...new Set(matchedNotes)].join(', ')}`
      : null
  };
};

const calculateSeasonScore = (perfume, preferredSeason, weight) => {
  if (perfume.season.includes(preferredSeason)) {
    return {
      score: weight,
      reason: `Perfect for ${preferredSeason}`
    };
  }

  if (perfume.season.includes('all')) {
    return {
      score: weight * 0.7,
      reason: 'Versatile fragrance suitable for all seasons'
    };
  }

  // Adjacent season matching with reduced score
  const seasons = ['winter', 'spring', 'summer', 'fall'];
  const preferredIndex = seasons.indexOf(preferredSeason);
  const adjacentSeasons = [
    seasons[(preferredIndex - 1 + 4) % 4],
    seasons[(preferredIndex + 1) % 4]
  ];

  if (perfume.season.some(s => adjacentSeasons.includes(s))) {
    return {
      score: weight * 0.5,
      reason: 'Adaptable to your preferred season'
    };
  }

  return { score: 0, reason: null };
};

const calculateCharacteristicsScore = (perfume, characteristics, weight) => {
  const { intensity = 5, longevity = 5, sillage = 5 } = characteristics || {};
  
  let score = 0;
  let matchedCharacteristics = [];

  // Intensity match
  const intensityDiff = Math.abs(perfume.characteristics.intensity - intensity);
  if (intensityDiff <= 1) {
    score += weight / 3;
    matchedCharacteristics.push('intensity');
  } else if (intensityDiff <= 2) {
    score += (weight / 3) * 0.5;
  }

  // Longevity match
  const longevityDiff = Math.abs(perfume.characteristics.longevity - longevity);
  if (longevityDiff <= 1) {
    score += weight / 3;
    matchedCharacteristics.push('longevity');
  } else if (longevityDiff <= 2) {
    score += (weight / 3) * 0.5;
  }

  // Sillage match
  const sillageDiff = Math.abs(perfume.characteristics.sillage - sillage);
  if (sillageDiff <= 1) {
    score += weight / 3;
    matchedCharacteristics.push('sillage');
  } else if (sillageDiff <= 2) {
    score += (weight / 3) * 0.5;
  }

  let reason = null;
  if (matchedCharacteristics.length > 0) {
    reason = `Matches your preferred ${matchedCharacteristics.join(' and ')}`;
  }

  return { score, reason };
};

const calculateOccasionScore = (perfume, preferredOccasions, weight) => {
  // Map quiz occasions to database occasions
  const occasionMap = {
    'daily': 'casual',  // Quiz uses 'daily', database uses 'casual'
    'work': 'work',
    'evening': 'evening',
    'special': 'special',
    'date': 'date',
    'outdoor': 'outdoor'
  };

  // Map preferences to database terms
  const mappedPreferences = preferredOccasions.map(occ => occasionMap[occ] || occ);
  
  // Count direct matches
  const matches = mappedPreferences.filter(occasion => 
    perfume.occasion.includes(occasion)
  );

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

  const directScore = (matches.length / preferredOccasions.length) * 0.8;
  const groupScore = (groupMatches / Object.keys(occasionGroups).length) * 0.2;
  const totalScore = (directScore + groupScore) * weight;

  return {
    score: totalScore,
    reason: matches.length > 0 
      ? `Suitable for ${matches.join(' and ')}` 
      : groupMatches > 0 
        ? 'Suitable for similar occasions'
        : null
  };
};

const calculateTypeScore = (perfume, preferredType, weight) => {
  // Check type match
  
  // Direct match
  if (perfume.type?.toLowerCase() === preferredType.toLowerCase()) {
    return {
      score: weight,
      reason: `Matches your preferred ${preferredType} fragrance type`
    };
  }

  // Type families for partial matching
  const typeFamilies = {
    floral: ['floral', 'floral fresh', 'floral woody', 'floral oriental'],
    fresh: ['fresh', 'citrus', 'aquatic', 'aromatic', 'green'],
    woody: ['woody', 'floral woody', 'spicy woody', 'oriental woody', 'cedar'],
    oriental: ['oriental', 'spicy oriental', 'floral oriental', 'oriental woody'],
    spicy: ['spicy', 'spicy woody', 'spicy oriental']
  };

  // Check for family match
  const family = Object.entries(typeFamilies).find(([key, types]) => 
    types.includes(preferredType.toLowerCase())
  );

  if (family && typeFamilies[family[0]].some(type => 
    perfume.type?.toLowerCase().includes(type)
  )) {
    return {
      score: weight * 0.7,
      reason: `Similar to your preferred ${preferredType} fragrance type`
    };
  }

  // Additional check for woody perfumes based on notes
  if (preferredType.toLowerCase() === 'woody') {
    const allNotes = [
      ...perfume.notes.top || [],
      ...perfume.notes.middle || [],
      ...perfume.notes.base || []
    ].map(note => note.toLowerCase());

    const woodyNotes = ['cedar', 'sandalwood', 'oud', 'vetiver', 'patchouli'];
    if (woodyNotes.some(note => allNotes.includes(note))) {
      return {
        score: weight * 0.5,
        reason: 'Contains woody notes'
      };
    }
  }

  return { score: 0, reason: null };
};