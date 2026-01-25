// Default MTG Commander bracket definitions
module.exports = {
  brackets: {
    1: {
      name: "Bracket 1",
      description: "Precon power level with minimal fast mana and interaction",
      limits: {
        tutors: 0,
        twoCardCombos: 0,
        gameChangers: 0,
        landDenial: 0
      },
      bannedCards: []
    },
    2: {
      name: "Bracket 2",
      description: "Upgraded casual with some tutors and interaction",
      limits: {
        tutors: 2,
        twoCardCombos: 0,
        gameChangers: 1,
        landDenial: 0
      },
      bannedCards: []
    },
    3: {
      name: "Bracket 3",
      description: "Optimized casual with multiple tutors and combos",
      limits: {
        tutors: 5,
        twoCardCombos: 1,
        gameChangers: 3,
        landDenial: 1
      },
      bannedCards: []
    },
    4: {
      name: "Bracket 4",
      description: "High power with unlimited tutors and combos",
      limits: {
        tutors: Infinity,
        twoCardCombos: Infinity,
        gameChangers: Infinity,
        landDenial: Infinity
      },
      bannedCards: []
    }
  },
  globalBans: [
    // Official Commander banlist
    "Ancestral Recall",
    "Balance",
    "Biorhythm",
    "Black Lotus",
    "Braids, Cabal Minion",
    "Chaos Orb",
    "Coalition Victory",
    "Channel",
    "Dockside Extortionist",
    "Emrakul, the Aeons Torn",
    "Erayo, Soratami Ascendant",
    "Falling Star",
    "Fastbond",
    "Flash",
    "Gifts Ungiven",
    "Golos, Tireless Pilgrim",
    "Griselbrand",
    "Hullbreacher",
    "Iona, Shield of Emeria",
    "Jeweled Lotus",
    "Karakas",
    "Leovold, Emissary of Trest",
    "Library of Alexandria",
    "Limited Resources",
    "Lutri, the Spellchaser",
    "Mana Crypt",
    "Mox Emerald",
    "Mox Jet",
    "Mox Pearl",
    "Mox Ruby",
    "Mox Sapphire",
    "Nadu, Winged Wisdom",
    "Panoptic Mirror",
    "Paradox Engine",
    "Primeval Titan",
    "Prophet of Kruphix",
    "Recurring Nightmare",
    "Rofellos, Llanowar Emissary",
    "Shahrazad",
    "Sundering Titan",
    "Sway of the Stars",
    "Sylvan Primordial",
    "Time Vault",
    "Time Walk",
    "Tinker",
    "Tolarian Academy",
    "Trade Secrets",
    "Upheaval",
    "Worldfire",
    "Yawgmoth's Bargain"
  ],
  // Card categorization for bracket analysis
  cardCategories: {
    tutors: [
      "Demonic Tutor",
      "Vampiric Tutor",
      "Mystical Tutor",
      "Enlightened Tutor",
      "Worldly Tutor",
      "Imperial Seal",
      "Grim Tutor",
      "Cruel Tutor",
      "Idyllic Tutor",
      "Diabolic Intent",
      "Gamble",
      "Demonic Consultation",
      "Tainted Pact",
      "Eladamri's Call",
      "Chord of Calling",
      "Tooth and Nail",
      "Green Sun's Zenith",
      "Eldritch Evolution"
    ],
    twoCardCombos: [
      "Thassa's Oracle",
      "Demonic Consultation",
      "Tainted Pact",
      "Hermit Druid",
      "Isochron Scepter",
      "Dramatic Reversal",
      "Kiki-Jiki, Mirror Breaker",
      "Splinter Twin",
      "Exquisite Blood",
      "Sanguine Bond",
      "Heliod, Sun-Crowned",
      "Walking Ballista"
    ],
    gameChangers: [
      "Cyclonic Rift",
      "Expropriate",
      "Fierce Guardianship",
      "Time Warp",
      "Temporal Manipulation",
      "Capture of Jingzhou",
      "Mana Drain",
      "Force of Will",
      "Force of Negation",
      "Pact of Negation",
      "Rhystic Study",
      "Smothering Tithe",
      "Dockside Extortionist",
      "Ad Nauseam",
      "Necropotence"
    ],
    landDenial: [
      "Armageddon",
      "Ravages of War",
      "Catastrophe",
      "Obliterate",
      "Jokulhaups",
      "Worldslayer",
      "Strip Mine",
      "Wasteland",
      "Blood Moon",
      "Magus of the Moon",
      "Back to Basics",
      "Ruination",
      "Price of Progress"
    ]
  }
};
