# @rulezero/core

Shared business logic library for Rule Minus One, following CLEAN Architecture principles.

## Architecture

This library follows CLEAN Architecture with clear separation of concerns:

### Domain Layer (`src/domain/`)
Pure business entities and value objects with no external dependencies:
- **Deck**: Represents a Commander deck with cards and metadata
- **BracketAnalysisResult**: Analysis result with bracket classification
- **CardCategory**: Value object for card category constants and utilities

### Use Cases Layer (`src/usecases/`)
Application business rules and orchestration:
- **FetchDeckBracketUseCase**: Main use case for fetching and analyzing decks

### Infrastructure Layer (`src/infrastructure/`)
External interfaces and adapters:
- **MoxfieldRepository**: Fetches decks from Moxfield API
- **ArchidektRepository**: Fetches decks from Archidekt API
- **BracketAnalyzer**: Analyzes decks against bracket configuration

## Usage

### Basic Usage

```javascript
import { FetchDeckBracketUseCase } from '@rulezero/core';

const useCase = new FetchDeckBracketUseCase();

// Or for browser environments with CORS issues:
import { FetchDeckBracketUseCase, CorsProxyHttpClient } from '@rulezero/core';

const httpClient = new CorsProxyHttpClient();
const useCase = new FetchDeckBracketUseCase(httpClient);

// Configuration should include brackets, globalBans, and cardCategories
const config = {
  brackets: {
    1: {
      name: 'Bracket 1',
      limits: { tutors: 0, twoCardCombos: 0, gameChangers: 0, landDenial: 0 },
      bannedCards: []
    },
    // ... more brackets
  },
  globalBans: ['Black Lotus', 'Ancestral Recall', /* ... */],
  cardCategories: {
    tutors: ['Demonic Tutor', 'Vampiric Tutor', /* ... */],
    twoCardCombos: ['Thassa\'s Oracle', /* ... */],
    gameChangers: ['Cyclonic Rift', /* ... */],
    landDenial: ['Armageddon', /* ... */]
  }
};

// Fetch and analyze a deck
const { deck, analysis } = await useCase.execute(
  'https://moxfield.com/decks/...',
  config
);

console.log(deck.name);
console.log(deck.commanders);
console.log(analysis.bracket);
console.log(analysis.isValid());
```

### Advanced Usage

You can also use individual components:

```javascript
import { 
  MoxfieldRepository, 
  BracketAnalyzer,
  Deck 
} from '@rulezero/core';

const adapter = new MoxfieldRepository();
const deck = await adapter.fetchDeck('https://moxfield.com/decks/...');

const analyzer = new BracketAnalyzer();
const result = analyzer.analyze(deck, config);
```

## Domain Models

### Deck
```javascript
const deck = new Deck({
  name: 'My Commander Deck',
  commanders: ['Commander Name'],
  cards: ['Card 1', 'Card 2', ...],
  source: 'Moxfield',
  sourceBracket: 2
});

deck.getAllCards(); // Returns commanders + cards
deck.hasCard('Card Name'); // Check if deck contains card
deck.getCardCount(); // Get card count (excluding commanders)
```

### BracketAnalysisResult
```javascript
const result = new BracketAnalysisResult({
  bracket: 2,
  bracketName: 'Bracket 2',
  reason: 'Fits bracket requirements',
  cardCounts: { tutors: 2, twoCardCombos: 0, gameChangers: 1, landDenial: 0 },
  foundCards: { tutors: ['Demonic Tutor', 'Vampiric Tutor'], ... }
});

result.isValid(); // true if bracket is not null
result.hasBannedCards(); // Check for banned cards
result.hasViolations(); // Check for violations
result.getTotalFlaggedCards(); // Total count of flagged cards
```

### CardCategory
```javascript
CardCategory.TUTORS; // 'tutors'
CardCategory.TWO_CARD_COMBOS; // 'twoCardCombos'
CardCategory.GAME_CHANGERS; // 'gameChangers'
CardCategory.LAND_DENIAL; // 'landDenial'

CardCategory.formatCategoryName('tutors'); // 'Tutors'
CardCategory.isValid('tutors'); // true
CardCategory.createEmptyCounts(); // { tutors: 0, ... }
```

## Configuration Format

The library expects configuration in this format:

```javascript
{
  brackets: {
    [bracketId: number]: {
      name: string,
      description: string,
      limits: {
        tutors: number | Infinity,
        twoCardCombos: number | Infinity,
        gameChangers: number | Infinity,
        landDenial: number | Infinity
      },
      bannedCards: string[]
    }
  },
  globalBans: string[],
  cardCategories: {
    tutors: string[],
    twoCardCombos: string[],
    gameChangers: string[],
    landDenial: string[]
  }
}
```

## HTTP Client & CORS Handling

The library uses dependency injection for HTTP requests, allowing platform-specific handling:

### HttpClient (Default)
Direct HTTP requests - works in Node.js and servers:
```javascript
import { FetchDeckBracketUseCase, HttpClient } from '@rulezero/core';

const useCase = new FetchDeckBracketUseCase(new HttpClient());
// Or just: new FetchDeckBracketUseCase() (uses HttpClient by default)
```

### CorsProxyHttpClient (Browser)
Automatically routes requests through a CORS proxy when needed:
```javascript
import { FetchDeckBracketUseCase, CorsProxyHttpClient } from '@rulezero/core';

// Uses corsproxy.io by default
const useCase = new FetchDeckBracketUseCase(new CorsProxyHttpClient());

// Or specify a custom proxy
const customProxy = new CorsProxyHttpClient('https://your-proxy.com/?url=');
const useCase = new FetchDeckBracketUseCase(customProxy);
```

The `CorsProxyHttpClient` tries direct requests first, then falls back to the proxy if CORS errors occur.

## Dependency Injection

The use case and infrastructure components are designed for easy testing and dependency injection:

```javascript
// Custom HTTP client for testing
class MockHttpClient {
  async get(url) {
    return { name: 'Mock Deck', mainboard: {} };
  }
}

const useCase = new FetchDeckBracketUseCase(new MockHttpClient());
```

## Error Handling

All methods throw descriptive errors:

```javascript
try {
  const result = await useCase.execute(url, config);
} catch (error) {
  // Error messages include context:
  // "Failed to fetch Moxfield deck: ..."
  // "Invalid URL provided"
  // "Unsupported deck URL. Only Moxfield and Archidekt are supported."
}
```
