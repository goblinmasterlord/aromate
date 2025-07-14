import React from 'react';

export const quizQuestions = [
  {
    id: 'gender',
    title: 'What fragrance style do you prefer?',
    type: 'single-select',
    description: 'This helps us match you with the right fragrance character',
    options: [
      { id: 'feminine', label: 'Feminine', icon: '🌺', description: 'Soft, elegant, and graceful compositions' },
      { id: 'masculine', label: 'Masculine', icon: '🌲', description: 'Bold, strong, and confident fragrances' },
      { id: 'unisex', label: 'Unisex', icon: '✨', description: 'Versatile scents that transcend gender' }
    ]
  },
  {
    id: 'type',
    title: 'What kind of fragrance are you looking for?',
    type: 'single-select',
    options: [
      { id: 'fresh', label: 'Fresh & Light', icon: '🌱', description: 'Clean, crisp, and energizing scents' },
      { id: 'floral', label: 'Floral', icon: '🌸', description: 'Beautiful blooming flower scents' },
      { id: 'woody', label: 'Woody', icon: '🌳', description: 'Warm and natural wood-based scents' },
      { id: 'oriental', label: 'Oriental', icon: '✨', description: 'Rich, warm, and exotic scents' }
    ]
  },
  {
    id: 'season',
    title: 'For which season?',
    type: 'single-select',
    options: [
      { id: 'spring', label: 'Spring', icon: '🌱', description: 'Light and fresh fragrances' },
      { id: 'summer', label: 'Summer', icon: '☀️', description: 'Bright and citrusy scents' },
      { id: 'fall', label: 'Fall', icon: '🍂', description: 'Warm and spicy fragrances' },
      { id: 'winter', label: 'Winter', icon: '❄️', description: 'Rich and intense scents' }
    ]
  },
  {
    id: 'occasion',
    title: 'For what kind of occasions would you wear this fragrance?',
    type: 'multi-select',
    description: 'Select all that apply',
    maxSelections: 3,
    options: [
      { id: 'daily', label: 'Daily Wear', icon: '📅', description: 'Versatile and comfortable' },
      { id: 'work', label: 'Work', icon: '💼', description: 'Professional and subtle' },
      { id: 'evening', label: 'Evening Out', icon: '🌙', description: 'Sophisticated and memorable' },
      { id: 'special', label: 'Special Occasions', icon: '✨', description: 'Unique and striking' },
      { id: 'date', label: 'Date Night', icon: '❤️', description: 'Romantic and alluring' },
      { id: 'outdoor', label: 'Outdoor Activities', icon: '🌿', description: 'Fresh and energetic' }
    ]
  },
  {
    id: 'notes',
    title: 'Select your fragrance preferences',
    description: 'Choose notes you love and those you\'d rather avoid',
    type: 'notes-preference',
    maxSelections: 5
  }
];

export const fragranceNotes = {
  Citrus: [
    "Bergamot",
    "Lemon",
    "Orange",
    "Grapefruit",
    "Lime",
    "Mandarin",
    "Yuzu"
  ],
  Floral: [
    "Rose",
    "Jasmine",
    "Lavender",
    "Violet",
    "Iris",
    "Lily",
    "Orange Blossom",
    "Peony",
    "Tuberose"
  ],
  Woody: [
    "Sandalwood",
    "Cedar",
    "Vetiver",
    "Oud",
    "Patchouli",
    "Pine",
    "Cypress"
  ],
  Oriental: [
    "Vanilla",
    "Amber",
    "Musk",
    "Incense",
    "Myrrh",
    "Benzoin"
  ],
  Spicy: [
    "Cinnamon",
    "Cardamom",
    "Black Pepper",
    "Clove",
    "Nutmeg",
    "Saffron"
  ],
  Fruity: [
    "Apple",
    "Pear",
    "Peach",
    "Plum",
    "Berry",
    "Coconut",
    "Fig"
  ],
  Green: [
    "Grass",
    "Mint",
    "Basil",
    "Tea",
    "Bamboo",
    "Green Apple",
    "Sage"
  ],
  Gourmand: [
    "Chocolate",
    "Coffee",
    "Caramel",
    "Honey",
    "Almond",
    "Praline"
  ],
  Marine: [
    "Sea Salt",
    "Ocean Breeze",
    "Seaweed",
    "Aquatic Notes"
  ],
  Earthy: [
    "Moss",
    "Soil",
    "Leather",
    "Tobacco",
    "Mushroom"
  ]
}; 