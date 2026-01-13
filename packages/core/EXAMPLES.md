# Usage Examples

This document provides practical examples of using the @rulezero/core library.

## Basic Usage

### Analyzing a Deck

```javascript
import { FetchDeckBracketUseCase } from '@rulezero/core';

const useCase = new FetchDeckBracketUseCase();

// Configuration (typically loaded from configManager)
const config = {
  brackets: {
    1: {
      name: 'Bracket 1',
      description: 'Precon power level',
      limits: {
        tutors: 0,
        twoCardCombos: 0,
        gameChangers: 0,
        landDenial: 0
      },
      bannedCards: []
    },
    2: {
      name: 'Bracket 2',
      description: 'Upgraded casual',
      limits: {
        tutors: 2,
        twoCardCombos: 0,
        gameChangers: 1,
        landDenial: 0
      },
      bannedCards: []
    }
  },
  globalBans: [
    'Black Lotus',
    'Ancestral Recall',
    'Time Walk',
    'Mox Pearl',
    'Mox Sapphire',
    'Mox Jet',
    'Mox Ruby',
    'Mox Emerald'
  ],
  cardCategories: {
    tutors: [
      'Demonic Tutor',
      'Vampiric Tutor',
      'Imperial Seal',
      'Mystical Tutor',
      'Enlightened Tutor'
    ],
    twoCardCombos: [
      "Thassa's Oracle",
      'Demonic Consultation',
      'Tainted Pact'
    ],
    gameChangers: [
      'Cyclonic Rift',
      'Rhystic Study',
      'Smothering Tithe',
      'Dockside Extortionist'
    ],
    landDenial: [
      'Armageddon',
      'Ravages of War',
      'Blood Moon',
      'Magus of the Moon'
    ]
  }
};

// Analyze a Moxfield deck
try {
  const result = await useCase.execute(
    'https://moxfield.com/decks/yGOwOIUYzEehNpR5nnym1A',
    config
  );
  
  console.log('Deck:', result.deck.name);
  console.log('Commander:', result.deck.commanders[0]);
  console.log('Bracket:', result.analysis.bracket);
  console.log('Valid:', result.analysis.isValid());
} catch (error) {
  console.error('Error:', error.message);
}
```

## Working with Domain Models

### Deck Entity

```javascript
import { Deck } from '@rulezero/core';

// Create a deck
const deck = new Deck({
  name: 'My Commander Deck',
  commanders: ['Atraxa, Praetors\' Voice'],
  cards: [
    'Sol Ring',
    'Demonic Tutor',
    'Cyclonic Rift',
    // ... more cards
  ],
  source: 'Moxfield',
  sourceBracket: 2
});

// Use deck methods
console.log('Total cards:', deck.getAllCards().length);
console.log('Has Sol Ring:', deck.hasCard('Sol Ring'));
console.log('Card count (no commanders):', deck.getCardCount());
console.log('Commander count:', deck.getCommanderCount());
```

### BracketAnalysisResult Entity

```javascript
import { BracketAnalysisResult } from '@rulezero/core';

// Typically returned from analyzeDeck, but can be created manually
const result = new BracketAnalysisResult({
  bracket: 2,
  bracketName: 'Bracket 2',
  reason: 'Fits bracket requirements',
  bannedCards: [],
  violations: [],
  cardCounts: {
    tutors: 2,
    twoCardCombos: 0,
    gameChangers: 1,
    landDenial: 0
  },
  foundCards: {
    tutors: ['Demonic Tutor', 'Vampiric Tutor'],
    twoCardCombos: [],
    gameChangers: ['Cyclonic Rift'],
    landDenial: []
  }
});

// Use result methods
console.log('Valid bracket:', result.isValid());
console.log('Has banned cards:', result.hasBannedCards());
console.log('Has violations:', result.hasViolations());
console.log('Total flagged cards:', result.getTotalFlaggedCards());
```

### CardCategory Value Object

```javascript
import { CardCategory } from '@rulezero/core';

// Access category constants
console.log(CardCategory.TUTORS);           // 'tutors'
console.log(CardCategory.TWO_CARD_COMBOS);  // 'twoCardCombos'
console.log(CardCategory.GAME_CHANGERS);    // 'gameChangers'
console.log(CardCategory.LAND_DENIAL);      // 'landDenial'

// Get all categories
console.log(CardCategory.ALL_CATEGORIES);
// ['tutors', 'twoCardCombos', 'gameChangers', 'landDenial']

// Format category names
console.log(CardCategory.formatCategoryName('tutors'));
// 'Tutors'
console.log(CardCategory.formatCategoryName('twoCardCombos'));
// 'Two Card Combos'

// Validate categories
console.log(CardCategory.isValid('tutors'));      // true
console.log(CardCategory.isValid('invalid'));     // false

// Create empty structures
const counts = CardCategory.createEmptyCounts();
// { tutors: 0, twoCardCombos: 0, gameChangers: 0, landDenial: 0 }

const foundCards = CardCategory.createEmptyFoundCards();
// { tutors: [], twoCardCombos: [], gameChangers: [], landDenial: [] }
```

## Advanced Usage

### Using Individual Adapters

```javascript
import { MoxfieldAdapter, ArchidektAdapter } from '@rulezero/core';

// Fetch from Moxfield
const moxfieldAdapter = new MoxfieldAdapter();
const moxfieldDeck = await moxfieldAdapter.fetchDeck(
  'https://moxfield.com/decks/abc123'
);

// Fetch from Archidekt
const archidektAdapter = new ArchidektAdapter();
const archidektDeck = await archidektAdapter.fetchDeck(
  'https://archidekt.com/decks/123456'
);

// Check if adapter can handle URL
console.log(MoxfieldAdapter.canHandle('https://moxfield.com/decks/abc'));
// true
console.log(ArchidektAdapter.canHandle('https://moxfield.com/decks/abc'));
// false
```

### Using BracketAnalyzer Directly

```javascript
import { BracketAnalyzer, Deck } from '@rulezero/core';

const analyzer = new BracketAnalyzer();

const deck = new Deck({
  name: 'Test Deck',
  commanders: ['Commander'],
  cards: ['Sol Ring', 'Demonic Tutor', 'Cyclonic Rift'],
  source: 'Manual'
});

const config = {
  brackets: { /* ... */ },
  globalBans: ['Black Lotus'],
  cardCategories: { /* ... */ }
};

const result = analyzer.analyze(deck, config);
console.log('Bracket:', result.bracket);
```

## Error Handling

```javascript
import { FetchDeckBracketUseCase } from '@rulezero/core';

const useCase = new FetchDeckBracketUseCase();

try {
  const result = await useCase.execute(invalidUrl, config);
} catch (error) {
  if (error.message.includes('Invalid URL')) {
    console.error('Please provide a valid Moxfield or Archidekt URL');
  } else if (error.message.includes('Failed to fetch')) {
    console.error('Network error or deck not found');
  } else if (error.message.includes('Invalid configuration')) {
    console.error('Configuration is missing required fields');
  } else {
    console.error('Unexpected error:', error.message);
  }
}
```

## Integration Examples

### Discord Bot (CommonJS)

```javascript
// src/services/deckService.js
const configManager = require('../config/configManager');

let coreModule = null;

async function loadCore() {
  if (!coreModule) {
    coreModule = await import('@rulezero/core');
  }
  return coreModule;
}

class DeckService {
  async analyzeDeck(url) {
    const core = await loadCore();
    const useCase = new core.FetchDeckBracketUseCase();
    
    const config = {
      brackets: configManager.getBrackets(),
      globalBans: configManager.getGlobalBans(),
      cardCategories: configManager.getCardCategories(),
    };
    
    return await useCase.execute(url, config);
  }
}

module.exports = new DeckService();
```

### React Web App

```javascript
// web/src/services/deckService.js
import { FetchDeckBracketUseCase } from '@rulezero/core';
import configManager from './configManager';

class DeckService {
  constructor() {
    this.useCase = new FetchDeckBracketUseCase();
  }

  async analyzeDeck(url) {
    const config = {
      brackets: configManager.getBrackets(),
      globalBans: configManager.getGlobalBans(),
      cardCategories: configManager.getCardCategories(),
    };
    
    return await this.useCase.execute(url, config);
  }
}

export default new DeckService();
```

### React Component

```javascript
import React, { useState } from 'react';
import deckService from '../services/deckService';

function DeckAnalyzer() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    try {
      const analysis = await deckService.analyzeDeck(url);
      setResult(analysis);
      setError(null);
    } catch (err) {
      setError(err.message);
      setResult(null);
    }
  };

  return (
    <div>
      <input 
        value={url} 
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter deck URL"
      />
      <button onClick={handleAnalyze}>Analyze</button>
      
      {error && <div>Error: {error}</div>}
      
      {result && (
        <div>
          <h3>{result.deck.name}</h3>
          <p>Bracket: {result.analysis.bracket}</p>
          <p>Commander: {result.deck.commanders.join(', ')}</p>
        </div>
      )}
    </div>
  );
}
```

## Testing Examples

### Unit Testing Domain Entities

```javascript
import { Deck, CardCategory } from '@rulezero/core';

describe('Deck', () => {
  test('should get all cards including commanders', () => {
    const deck = new Deck({
      name: 'Test',
      commanders: ['Commander 1'],
      cards: ['Card 1', 'Card 2'],
      source: 'Test'
    });
    
    expect(deck.getAllCards()).toEqual([
      'Commander 1',
      'Card 1',
      'Card 2'
    ]);
  });
  
  test('should check if deck has card (case-insensitive)', () => {
    const deck = new Deck({
      name: 'Test',
      commanders: [],
      cards: ['Sol Ring'],
      source: 'Test'
    });
    
    expect(deck.hasCard('Sol Ring')).toBe(true);
    expect(deck.hasCard('sol ring')).toBe(true);
    expect(deck.hasCard('SOL RING')).toBe(true);
    expect(deck.hasCard('Mana Crypt')).toBe(false);
  });
});
```

### Integration Testing Use Cases

```javascript
import { FetchDeckBracketUseCase, MoxfieldAdapter } from '@rulezero/core';

// Mock the adapter
jest.mock('@rulezero/core', () => ({
  ...jest.requireActual('@rulezero/core'),
  MoxfieldAdapter: jest.fn()
}));

describe('FetchDeckBracketUseCase', () => {
  test('should fetch and analyze deck', async () => {
    // Setup mock
    const mockDeck = {
      name: 'Test Deck',
      commanders: ['Test Commander'],
      cards: ['Sol Ring'],
      source: 'Moxfield'
    };
    
    MoxfieldAdapter.prototype.fetchDeck = jest.fn()
      .mockResolvedValue(mockDeck);
    
    const useCase = new FetchDeckBracketUseCase();
    const result = await useCase.execute(
      'https://moxfield.com/decks/test',
      mockConfig
    );
    
    expect(result.deck.name).toBe('Test Deck');
    expect(result.analysis).toBeDefined();
  });
});
```

## Performance Optimization

### Reusing Use Case Instances

```javascript
// Good: Reuse instance
class DeckService {
  constructor() {
    this.useCase = new FetchDeckBracketUseCase();
  }
  
  async analyze(url, config) {
    return await this.useCase.execute(url, config);
  }
}

// Avoid: Creating new instance each time
async function analyze(url, config) {
  const useCase = new FetchDeckBracketUseCase(); // Wasteful
  return await useCase.execute(url, config);
}
```

### Caching Configuration

```javascript
class DeckService {
  constructor() {
    this.useCase = new FetchDeckBracketUseCase();
    this.cachedConfig = null;
  }
  
  getConfig() {
    if (!this.cachedConfig) {
      this.cachedConfig = {
        brackets: configManager.getBrackets(),
        globalBans: configManager.getGlobalBans(),
        cardCategories: configManager.getCardCategories(),
      };
    }
    return this.cachedConfig;
  }
  
  invalidateCache() {
    this.cachedConfig = null;
  }
  
  async analyze(url) {
    return await this.useCase.execute(url, this.getConfig());
  }
}
```
