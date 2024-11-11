export const perfumes = [
    {
      id: 1,
      name: "Light Blue",
      brand: "Dolce & Gabbana",
      type: "Eau de Toilette",
      gender: "feminine", // can be: feminine, masculine, unisex
      price: 89.99,
      size: "100ml",
      year: 2001,
      season: ["spring", "summer"],
      occasion: ["casual", "day", "beach"],
      notes: {
        top: ["sicilian lemon", "green apple", "cedar"],
        middle: ["bamboo", "jasmine", "white rose"],
        base: ["cedar", "musk", "amber"]
      },
      characteristics: {
        longevity: 6, // 1-10 scale
        sillage: 5,   // 1-10 scale
        intensity: 4  // 1-10 scale
      },
      tags: ["fresh", "citrus", "light", "clean"],
      rating: 4.5
    },
    {
      id: 2,
      name: "Black Orchid",
      brand: "Tom Ford",
      type: "Eau de Parfum",
      gender: "unisex",
      price: 150.00,
      size: "100ml",
      year: 2006,
      season: ["fall", "winter"],
      occasion: ["evening", "formal", "special"],
      notes: {
        top: ["black truffle", "ylang-ylang", "bergamot"],
        middle: ["black orchid", "spicy notes", "lotus wood"],
        base: ["vanilla", "sandalwood", "dark chocolate", "patchouli"]
      },
      characteristics: {
        longevity: 9,
        sillage: 8,
        intensity: 9
      },
      tags: ["oriental", "spicy", "rich", "luxurious"],
      rating: 4.7
    },
    {
      id: 3,
      name: "Acqua di Gio",
      brand: "Giorgio Armani",
      type: "Eau de Toilette",
      gender: "masculine",
      price: 95.00,
      size: "100ml",
      year: 1996,
      season: ["spring", "summer"],
      occasion: ["casual", "office", "sport"],
      notes: {
        top: ["marine notes", "bergamot", "neroli"],
        middle: ["jasmine", "rock rose", "persimmon"],
        base: ["cedar", "patchouli", "white musk"]
      },
      characteristics: {
        longevity: 7,
        sillage: 6,
        intensity: 5
      },
      tags: ["fresh", "aquatic", "citrus", "clean"],
      rating: 4.4
    },
    {
      id: 4,
      name: "La Vie Est Belle",
      brand: "Lancôme",
      type: "Eau de Parfum",
      gender: "feminine",
      price: 120.00,
      size: "75ml",
      year: 2012,
      season: ["fall", "winter", "spring"],
      occasion: ["daily", "office", "evening"],
      notes: {
        top: ["black currant", "pear"],
        middle: ["iris", "jasmine", "orange blossom"],
        base: ["praline", "vanilla", "patchouli", "tonka bean"]
      },
      characteristics: {
        longevity: 8,
        sillage: 7,
        intensity: 7
      },
      tags: ["sweet", "gourmand", "warm", "elegant"],
      rating: 4.6
    },
    {
      id: 5,
      name: "Aventus",
      brand: "Creed",
      type: "Eau de Parfum",
      gender: "masculine",
      price: 435.00,
      size: "100ml",
      year: 2010,
      season: ["all"],
      occasion: ["special", "business", "evening"],
      notes: {
        top: ["bergamot", "black currant", "apple", "pineapple"],
        middle: ["birch", "patchouli", "moroccan jasmine", "rose"],
        base: ["musk", "oak moss", "ambergris", "vanilla"]
      },
      characteristics: {
        longevity: 9,
        sillage: 8,
        intensity: 8
      },
      tags: ["fruity", "woody", "fresh", "prestigious"],
      rating: 4.8
    },
    {
      id: 6,
      name: "Shalimar",
      brand: "Guerlain",
      type: "Eau de Parfum",
      gender: "feminine",
      price: 135.00,
      size: "90ml",
      year: 1925,
      season: ["fall", "winter"],
      occasion: ["evening", "formal", "special"],
      notes: {
        top: ["bergamot", "lemon", "cedar"],
        middle: ["jasmine", "rose", "iris", "vetiver"],
        base: ["vanilla", "tonka bean", "leather", "opoponax"]
      },
      characteristics: {
        longevity: 10,
        sillage: 9,
        intensity: 8
      },
      tags: ["oriental", "vanilla", "powdery", "classic"],
      rating: 4.5
    },
    {
      id: 7,
      name: "Y",
      brand: "Yves Saint Laurent",
      type: "Eau de Parfum",
      gender: "masculine",
      price: 115.00,
      size: "100ml",
      year: 2018,
      season: ["spring", "summer", "fall"],
      occasion: ["office", "casual", "date"],
      notes: {
        top: ["bergamot", "ginger", "apple"],
        middle: ["sage", "juniper berries", "geranium"],
        base: ["amber wood", "tonka bean", "cedar"]
      },
      characteristics: {
        longevity: 7,
        sillage: 6,
        intensity: 6
      },
      tags: ["fresh", "woody", "modern", "versatile"],
      rating: 4.3
    },
    {
      id: 8,
      name: "Molecule 01",
      brand: "Escentric Molecules",
      type: "Eau de Toilette",
      gender: "unisex",
      price: 95.00,
      size: "100ml",
      year: 2006,
      season: ["all"],
      occasion: ["daily", "office", "casual"],
      notes: {
        top: ["iso e super"],
        middle: ["iso e super"],
        base: ["iso e super"]
      },
      characteristics: {
        longevity: 8,
        sillage: 5,
        intensity: 3
      },
      tags: ["minimal", "clean", "subtle", "unique"],
      rating: 4.2
    },
    {
      id: 9,
      name: "Angel",
      brand: "Mugler",
      type: "Eau de Parfum",
      gender: "feminine",
      price: 115.00,
      size: "50ml",
      year: 1992,
      season: ["fall", "winter"],
      occasion: ["evening", "special", "party"],
      notes: {
        top: ["melon", "coconut", "mandarin orange", "cassia"],
        middle: ["honey", "apricot", "blackberry", "plum"],
        base: ["tonka bean", "vanilla", "chocolate", "caramel", "patchouli"]
      },
      characteristics: {
        longevity: 10,
        sillage: 10,
        intensity: 10
      },
      tags: ["sweet", "gourmand", "strong", "unique"],
      rating: 4.4
    },
    {
      id: 10,
      name: "L'Eau d'Issey",
      brand: "Issey Miyake",
      type: "Eau de Toilette",
      gender: "feminine",
      price: 76.00,
      size: "100ml",
      year: 1992,
      season: ["spring", "summer"],
      occasion: ["daily", "office", "casual"],
      notes: {
        top: ["lotus", "melon", "rose water"],
        middle: ["lily", "fresh flowers"],
        base: ["precious woods", "exotic woods", "musk"]
      },
      characteristics: {
        longevity: 5,
        sillage: 4,
        intensity: 3
      },
      tags: ["fresh", "floral", "aquatic", "light"],
      rating: 4.3
    },
    {
      id: 11,
      name: "Oud Wood",
      brand: "Tom Ford",
      type: "Eau de Parfum",
      gender: "unisex",
      price: 250.00,
      size: "50ml",
      year: 2007,
      season: ["fall", "winter"],
      occasion: ["evening", "formal", "special"],
      notes: {
        top: ["rosewood", "cardamom", "chinese pepper"],
        middle: ["oud wood", "sandalwood", "vetiver"],
        base: ["tonka bean", "vanilla", "amber"]
      },
      characteristics: {
        longevity: 9,
        sillage: 7,
        intensity: 8
      },
      tags: ["woody", "oriental", "luxurious"],
      rating: 4.7
    },
    {
      id: 12,
      name: "Pure Grace",
      brand: "Philosophy",
      type: "Eau de Toilette",
      gender: "feminine",
      price: 52.00,
      size: "60ml",
      year: 2003,
      season: ["spring", "summer"],
      occasion: ["daily", "work", "casual"],
      notes: {
        top: ["bergamot", "water lily", "lavender"],
        middle: ["jasmine", "white rose", "fresh mint"],
        base: ["musk", "clean soap", "fresh cotton"]
      },
      characteristics: {
        longevity: 5,
        sillage: 4,
        intensity: 3
      },
      tags: ["fresh", "clean", "light"],
      rating: 4.2
    },
    {
      id: 13,
      name: "Jazz Club",
      brand: "Maison Margiela",
      type: "Eau de Toilette",
      gender: "masculine",
      price: 135.00,
      size: "100ml",
      year: 2013,
      season: ["fall", "winter"],
      occasion: ["evening", "date", "special"],
      notes: {
        top: ["pink pepper", "lemon", "neroli"],
        middle: ["rum", "vanilla", "vetiver"],
        base: ["tobacco leaf", "styrax", "tonka bean"]
      },
      characteristics: {
        longevity: 8,
        sillage: 7,
        intensity: 7
      },
      tags: ["warm", "spicy", "tobacco"],
      rating: 4.5
    },
    {
      id: 14,
      name: "Cloud",
      brand: "Ariana Grande",
      type: "Eau de Parfum",
      gender: "feminine",
      price: 65.00,
      size: "100ml",
      year: 2018,
      season: ["spring", "fall"],
      occasion: ["daily", "casual", "date"],
      notes: {
        top: ["lavender", "pear", "bergamot"],
        middle: ["coconut cream", "praline", "vanilla orchid"],
        base: ["musk", "woodsy notes", "caramel"]
      },
      characteristics: {
        longevity: 7,
        sillage: 6,
        intensity: 6
      },
      tags: ["sweet", "gourmand", "cozy"],
      rating: 4.4
    },
    {
      id: 15,
      name: "Not a Perfume",
      brand: "Juliette Has a Gun",
      type: "Eau de Parfum",
      gender: "unisex",
      price: 135.00,
      size: "100ml",
      year: 2010,
      season: ["all"],
      occasion: ["daily", "work", "casual"],
      notes: {
        top: ["cetalox"],
        middle: ["cetalox"],
        base: ["cetalox"]
      },
      characteristics: {
        longevity: 8,
        sillage: 5,
        intensity: 4
      },
      tags: ["minimal", "clean", "subtle"],
      rating: 4.1
    },
    {
      id: 16,
      name: "By the Fireplace",
      brand: "Maison Margiela",
      type: "Eau de Toilette",
      gender: "unisex",
      price: 135.00,
      size: "100ml",
      year: 2015,
      season: ["fall", "winter"],
      occasion: ["evening", "casual", "cozy"],
      notes: {
        top: ["pink pepper", "orange flower", "clove"],
        middle: ["chestnut", "guaiac wood", "juniper"],
        base: ["vanilla", "peru balsam", "cashmeran"]
      },
      characteristics: {
        longevity: 8,
        sillage: 7,
        intensity: 7
      },
      tags: ["warm", "smoky", "sweet"],
      rating: 4.6
    },
    {
      id: 17,
      name: "Wood Sage & Sea Salt",
      brand: "Jo Malone",
      type: "Cologne",
      gender: "unisex",
      price: 142.00,
      size: "100ml",
      year: 2014,
      season: ["spring", "summer"],
      occasion: ["daily", "beach", "casual"],
      notes: {
        top: ["ambrette seeds", "sea salt"],
        middle: ["sage", "seaweed"],
        base: ["driftwood", "white musk", "grapefruit"]
      },
      characteristics: {
        longevity: 5,
        sillage: 4,
        intensity: 4
      },
      tags: ["fresh", "marine", "natural"],
      rating: 4.3
    },
    {
      id: 18,
      name: "Lost Cherry",
      brand: "Tom Ford",
      type: "Eau de Parfum",
      gender: "unisex",
      price: 375.00,
      size: "50ml",
      year: 2018,
      season: ["fall", "winter", "spring"],
      occasion: ["evening", "date", "special"],
      notes: {
        top: ["bitter almond", "cherry", "liquor"],
        middle: ["turkish rose", "jasmine sambac", "plum"],
        base: ["peru balsam", "tonka bean", "vanilla", "cinnamon"]
      },
      characteristics: {
        longevity: 7,
        sillage: 6,
        intensity: 7
      },
      tags: ["fruity", "sweet", "luxurious"],
      rating: 4.5
    },
    {
      id: 19,
      name: "Another 13",
      brand: "Le Labo",
      type: "Eau de Parfum",
      gender: "unisex",
      price: 215.00,
      size: "100ml",
      year: 2010,
      season: ["all"],
      occasion: ["daily", "work", "evening"],
      notes: {
        top: ["ambroxan", "jasmine"],
        middle: ["moss", "ambrette seeds"],
        base: ["musk", "woody notes"]
      },
      characteristics: {
        longevity: 8,
        sillage: 6,
        intensity: 5
      },
      tags: ["musky", "clean", "modern"],
      rating: 4.4
    },
    {
      id: 20,
      name: "Gris Charnel",
      brand: "BDK Parfums",
      type: "Eau de Parfum",
      gender: "unisex",
      price: 185.00,
      size: "100ml",
      year: 2019,
      season: ["fall", "winter", "spring"],
      occasion: ["daily", "work", "evening"],
      notes: {
        top: ["cardamom", "fig", "iris"],
        middle: ["black tea", "bourbon vetiver", "papyrus"],
        base: ["tonka bean", "sandalwood", "vanilla"]
      },
      characteristics: {
        longevity: 8,
        sillage: 7,
        intensity: 6
      },
      tags: ["woody", "spicy", "elegant"],
      rating: 4.6
    },
    {
      id: 21,
      name: "Tuscan Leather",
      brand: "Tom Ford",
      type: "Eau de Parfum",
      gender: "unisex",
      price: 450.00,
      size: "100ml",
      year: 2007,
      season: ["fall", "winter"],
      occasion: ["evening", "special"],
      notes: {
        top: ["saffron", "raspberry", "thyme"],
        middle: ["olibanum", "jasmine"],
        base: ["leather", "suede", "amber", "woody notes"]
      },
      characteristics: {
        longevity: 9,
        sillage: 8,
        intensity: 8
      },
      tags: ["leathery", "rich", "luxurious"],
      rating: 4.7
    },
    {
      id: 22,
      name: "Oud Wood",
      brand: "Tom Ford",
      type: "Eau de Parfum",
      gender: "unisex",
      price: 300.00,
      size: "100ml",
      year: 2009,
      season: ["all"],
      occasion: ["any"],
      notes: {
        top: ["oud", "Brazilian rosewood", "cardamom"],
        middle: ["sichuan pepper", "sandalwood", "vetiver"],
        base: ["tonka bean", "vanilla", "amber"]
      },
      characteristics: {
        longevity: 8,
        sillage: 7,
        intensity: 7
      },
      tags: ["oudy", "spicy", "warm"],
      rating: 4.8
    },
    {
      id: 23,
      name: "Tobacco Vanille",
      brand: "Tom Ford",
      type: "Eau de Parfum",
      gender: "unisex",
      price: 320.00,
      size: "100ml",
      year: 2007,
      season: ["winter", "fall"],
      occasion: ["evening", "casual"],
      notes: {
        top: ["tobacco leaf", "spicy notes"],
        middle: ["vanilla", "cacao", "tonka bean"],
        base: ["dried fruits", "woody notes"]
      },
      characteristics: {
        longevity: 9,
        sillage: 8,
        intensity: 8
      },
      tags: ["tobacco", "sweet", "opulent"],
      rating: 4.9
    },
    {
      id: 24,
      name: "Santal 33",
      brand: "Le Labo",
      type: "Eau de Parfum",
      gender: "unisex",
      price: 240.00,
      size: "100ml",
      year: 2011,
      season: ["all"],
      occasion: ["any"],
      notes: {
        top: ["cardamom", "iris", "violet"],
        middle: ["ambrox", "Australian sandalwood", "papyrus"],
        base: ["cedarwood", "leather", "sandalwood"]
      },
      characteristics: {
        longevity: 7,
        sillage: 6,
        intensity: 6
      },
      tags: ["woody", "leathery", "smooth"],
      rating: 4.6
    },
    {
      id: 25,
      name: "Light Blue Light Sun",
      brand: "Dolce & Gabbana",
      type: "Eau de Toilette",
      gender: "feminine",
      price: 84.00,
      size: "100ml",
      year: 2023,
      season: ["spring", "summer"],
      occasion: ["beach", "casual", "day"],
      notes: {
        top: ["lemon", "grapefruit", "coconut water"],
        middle: ["jasmine", "frangipani", "orange blossom"],
        base: ["vanilla", "musk", "amber"]
      },
      characteristics: {
        longevity: 5,
        sillage: 4,
        intensity: 4
      },
      tags: ["fresh", "citrus", "tropical", "summer"],
      rating: 4.2
    },
    {
      id: 26,
      name: "CK One Summer",
      brand: "Calvin Klein",
      type: "Eau de Toilette",
      gender: "unisex",
      price: 65.00,
      size: "100ml",
      year: 2023,
      season: ["summer"],
      occasion: ["casual", "beach", "day"],
      notes: {
        top: ["citrus", "watermelon", "sea notes"],
        middle: ["green tea", "eucalyptus", "mint"],
        base: ["musk", "driftwood", "amber"]
      },
      characteristics: {
        longevity: 4,
        sillage: 3,
        intensity: 3
      },
      tags: ["fresh", "aquatic", "summer", "light"],
      rating: 4.0
    },
    {
      id: 27,
      name: "L'Eau d'Issey Summer",
      brand: "Issey Miyake",
      type: "Eau de Toilette",
      gender: "feminine",
      price: 72.00,
      size: "100ml",
      year: 2023,
      season: ["summer", "spring"],
      occasion: ["casual", "day", "beach"],
      notes: {
        top: ["grapefruit", "lychee", "passion fruit"],
        middle: ["water lily", "rose", "aquatic notes"],
        base: ["woody notes", "vanilla", "musk"]
      },
      characteristics: {
        longevity: 5,
        sillage: 4,
        intensity: 4
      },
      tags: ["fresh", "aquatic", "fruity", "summer"],
      rating: 4.1
    },
    {
      id: 28,
      name: "Fico di Amalfi",
      brand: "Acqua di Parma",
      type: "Eau de Toilette",
      gender: "unisex",
      price: 175.00,
      size: "150ml",
      year: 2006,
      season: ["spring", "summer"],
      occasion: ["casual", "day", "vacation"],
      notes: {
        top: ["bergamot", "lemon", "grapefruit", "citron"],
        middle: ["fig nectar", "pink pepper", "jasmine"],
        base: ["fig wood", "cedar", "benzoin"]
      },
      characteristics: {
        longevity: 6,
        sillage: 5,
        intensity: 5
      },
      tags: ["fresh", "fruity", "mediterranean", "fig"],
      rating: 4.3
    },
    {
      id: 29,
      name: "Bleu de Chanel Sport",
      brand: "Chanel",
      type: "Eau de Toilette",
      gender: "masculine",
      price: 102.00,
      size: "100ml",
      year: 2022,
      season: ["spring", "summer"],
      occasion: ["sport", "casual", "day"],
      notes: {
        top: ["grapefruit", "lemon", "mint"],
        middle: ["lavender", "iso e super", "ginger"],
        base: ["cedar", "sandalwood", "white musk"]
      },
      characteristics: {
        longevity: 7,
        sillage: 6,
        intensity: 6
      },
      tags: ["fresh", "sporty", "clean", "energetic"],
      rating: 4.4
    },
    {
      id: 30,
      name: "Versace Pour Homme",
      brand: "Versace",
      type: "Eau de Toilette",
      gender: "masculine",
      price: 88.00,
      size: "100ml",
      year: 2008,
      season: ["spring", "summer"],
      occasion: ["sport", "office", "casual"],
      notes: {
        top: ["bergamot", "neroli", "citron"],
        middle: ["hyacinth", "clary sage", "cedar"],
        base: ["tonka bean", "musk", "amber"]
      },
      characteristics: {
        longevity: 6,
        sillage: 5,
        intensity: 5
      },
      tags: ["fresh", "aquatic", "clean", "versatile"],
      rating: 4.3
    },
    {
      id: 31,
      name: "Dior Homme Sport",
      brand: "Dior",
      type: "Eau de Toilette",
      gender: "masculine",
      price: 112.00,
      size: "100ml",
      year: 2021,
      season: ["spring", "summer"],
      occasion: ["sport", "casual", "day"],
      notes: {
        top: ["citrus", "bergamot", "pink pepper"],
        middle: ["iris", "elemi", "ginger"],
        base: ["sandalwood", "olibanum", "woody notes"]
      },
      characteristics: {
        longevity: 7,
        sillage: 6,
        intensity: 6
      },
      tags: ["fresh", "sporty", "elegant", "citrus"],
      rating: 4.4
    },
    {
      id: 32,
      name: "Green Tea",
      brand: "Elizabeth Arden",
      type: "Eau de Parfum",
      gender: "feminine",
      price: 39.99,
      size: "100ml",
      year: 1999,
      season: ["spring", "summer"],
      occasion: ["daily", "work", "casual"],
      notes: {
        top: ["rhubarb", "mint", "orange peel", "bergamot"],
        middle: ["green tea", "jasmine", "oakmoss", "carnation"],
        base: ["musk", "amber", "fennel", "celery seeds"]
      },
      characteristics: {
        longevity: 4,
        sillage: 3,
        intensity: 3
      },
      tags: ["fresh", "green", "tea", "affordable"],
      rating: 4.1
    },
    {
      id: 33,
      name: "Wild Bluebell",
      brand: "Jo Malone",
      type: "Cologne",
      gender: "feminine",
      price: 144.00,
      size: "100ml",
      year: 2011,
      season: ["spring", "summer"],
      occasion: ["daily", "casual", "outdoor"],
      notes: {
        top: ["bluebell", "clove"],
        middle: ["lily of the valley", "jasmine", "rose"],
        base: ["white amber", "musk"]
      },
      characteristics: {
        longevity: 5,
        sillage: 4,
        intensity: 4
      },
      tags: ["floral", "fresh", "light", "natural"],
      rating: 4.2
    },
    {
      id: 34,
      name: "Orange Sanguine",
      brand: "Atelier Cologne",
      type: "Cologne Absolue",
      gender: "unisex",
      price: 135.00,
      size: "100ml",
      year: 2010,
      season: ["spring", "summer"],
      occasion: ["daily", "casual", "beach"],
      notes: {
        top: ["blood orange", "bitter orange", "red mandarin"],
        middle: ["jasmine", "geranium", "black pepper"],
        base: ["tonka bean", "sandalwood", "cedarwood"]
      },
      characteristics: {
        longevity: 6,
        sillage: 5,
        intensity: 5
      },
      tags: ["citrus", "fresh", "bright", "natural"],
      rating: 4.3
    }
  ];