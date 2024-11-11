export const mapQuizAnswersToPreferences = (answers) => {
  console.log('Mapping answers:', answers);
  
  if (!answers) {
    throw new Error('No answers provided to mapper');
  }

  return {
    type: answers.type || [],
    season: answers.season || [],
    occasion: answers.occasion || [],
    characteristics: {
      intensity: answers.importance?.[0] || 5,
      longevity: answers.importance?.[0] || 5
    },
    notes: answers.notes || { liked: [], disliked: [] },
    gender: 'unisex' // default
  };
};