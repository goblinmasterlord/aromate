// fragranceNotes.js
// Single source of truth for the notes users can pick in the quiz.
//
// Every selectable note carries `match` terms that are compared token-wise
// against the perfume database's note names (see utils/noteMatching.js).
// The picker UI, the admin form, and the recommendation engine all read
// from this file, so a note shown to the user is guaranteed to mean the
// same thing to the scoring code.

export const noteCategories = {
  Citrus: [
    { label: 'Bergamot', match: ['bergamot'] },
    { label: 'Lemon', match: ['lemon'] },
    { label: 'Grapefruit', match: ['grapefruit'] },
    { label: 'Mandarin', match: ['mandarin', 'citron'] },
    { label: 'Neroli', match: ['neroli'] }
  ],
  Floral: [
    { label: 'Rose', match: ['rose'] },
    { label: 'Jasmine', match: ['jasmine'] },
    { label: 'Lavender', match: ['lavender'] },
    { label: 'Iris', match: ['iris', 'orris'] },
    { label: 'Orange Blossom', match: ['orange blossom', 'orange flower'] },
    { label: 'Geranium', match: ['geranium'] },
    { label: 'Ylang-Ylang', match: ['ylang'] },
    { label: 'Violet', match: ['violet'] }
  ],
  Woody: [
    { label: 'Cedar', match: ['cedar', 'cedarwood'] },
    { label: 'Sandalwood', match: ['sandalwood'] },
    { label: 'Vetiver', match: ['vetiver'] },
    { label: 'Patchouli', match: ['patchouli'] },
    { label: 'Oud', match: ['oud'] },
    { label: 'Birch', match: ['birch'] }
  ],
  Oriental: [
    { label: 'Vanilla', match: ['vanilla'] },
    { label: 'Amber', match: ['amber', 'ambergris'] },
    { label: 'Musk', match: ['musk'] },
    { label: 'Tonka Bean', match: ['tonka'] },
    { label: 'Benzoin', match: ['benzoin'] },
    { label: 'Incense', match: ['incense', 'olibanum', 'frankincense'] }
  ],
  Spicy: [
    { label: 'Pink Pepper', match: ['pink pepper'] },
    { label: 'Black Pepper', match: ['black pepper', 'pepper'] },
    { label: 'Cinnamon', match: ['cinnamon', 'cassia'] },
    { label: 'Cardamom', match: ['cardamom'] },
    { label: 'Saffron', match: ['saffron'] },
    { label: 'Ginger', match: ['ginger'] },
    { label: 'Clove', match: ['clove'] },
    { label: 'Nutmeg', match: ['nutmeg'] }
  ],
  Fruity: [
    { label: 'Black Currant', match: ['black currant', 'blackcurrant'] },
    { label: 'Apple', match: ['apple'] },
    { label: 'Pear', match: ['pear'] },
    { label: 'Fig', match: ['fig'] },
    { label: 'Coconut', match: ['coconut'] },
    { label: 'Plum', match: ['plum'] },
    { label: 'Raspberry', match: ['raspberry'] },
    { label: 'Melon', match: ['melon', 'watermelon'] }
  ],
  Fresh: [
    { label: 'Mint', match: ['mint'] },
    { label: 'Marine Notes', match: ['marine', 'aquatic', 'sea notes', 'calone', 'seaweed'] },
    { label: 'Sea Salt', match: ['sea salt'] },
    { label: 'Green Tea', match: ['green tea'] },
    { label: 'Rosemary', match: ['rosemary'] },
    { label: 'Sage', match: ['sage'] },
    { label: 'Basil', match: ['basil'] },
    { label: 'Moss', match: ['moss', 'oakmoss'] }
  ],
  Gourmand: [
    { label: 'Caramel', match: ['caramel'] },
    { label: 'Chocolate', match: ['chocolate', 'cacao', 'cocoa'] },
    { label: 'Honey', match: ['honey'] },
    { label: 'Praline', match: ['praline'] },
    { label: 'Coffee', match: ['coffee'] },
    { label: 'Rum', match: ['rum'] }
  ],
  'Leather & Tobacco': [
    { label: 'Leather', match: ['leather'] },
    { label: 'Tobacco', match: ['tobacco'] },
    { label: 'Suede', match: ['suede'] }
  ]
};

// The Popular shelf re-lists the most common notes in the database.
// These labels must exist in a category above.
export const popularNotes = [
  'Vanilla', 'Musk', 'Bergamot', 'Jasmine', 'Rose', 'Cedar', 'Amber', 'Sandalwood'
];

// category -> [labels], with Popular first — the shape the picker renders.
export const fragranceNotes = {
  Popular: popularNotes,
  ...Object.fromEntries(
    Object.entries(noteCategories).map(([category, notes]) => [
      category,
      notes.map(n => n.label)
    ])
  )
};

// label -> match terms
export const noteMatchTerms = Object.fromEntries(
  Object.values(noteCategories).flat().map(n => [n.label, n.match])
);

// label -> category name (Popular excluded; every note has one real category)
export const noteCategoryOf = Object.fromEntries(
  Object.entries(noteCategories).flatMap(([category, notes]) =>
    notes.map(n => [n.label, category])
  )
);
