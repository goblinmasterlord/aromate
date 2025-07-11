export const mapQuizAnswersToPreferences = (answers) => {
  console.log('Mapping answers:', answers);
  
  if (!answers) {
    throw new Error('No answers provided to mapper');
  }

  return {
    type: answers.type || '',  // Single value, not array
    season: answers.season || '',  // Single value, not array
    occasion: answers.occasion || [],  // This is correctly an array
    characteristics: {
      intensity: 5,  // Default middle value - no quiz question for this yet
      longevity: 5,  // Default middle value - no quiz question for this yet
      sillage: 5    // Default middle value - was missing entirely
    },
    notes: answers.notes || { liked: [], disliked: [] },
    gender: 'unisex' // default - no quiz question for this yet
  };
};