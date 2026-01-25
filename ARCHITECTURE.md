# Architecture Documentation

## Overview

This project follows **CLEAN Architecture** principles with a shared business logic library that is consumed by both the Discord bot and web application.

## Structure

```
rulezero/
├── packages/core/              # Shared business logic library
│   └── src/
│       ├── domain/            # Pure business entities
│       ├── usecases/          # Application business rules
│       └── infrastructure/    # External adapters
├── src/                       # Discord Bot (CommonJS)
│   ├── services/
│   │   └── deckService.js    # Wrapper for shared library
│   └── ...
└── web/                       # React Web App (ES Modules)
    └── src/
        ├── services/
        │   └── deckService.js # Wrapper for shared library
        └── ...
```

## CLEAN Architecture Layers

### 1. Domain Layer (`packages/core/src/domain/`)

Pure business entities with no external dependencies. These represent the core business concepts.

**Entities:**
- **Deck**: Represents a Commander deck with cards, commanders, and metadata
- **BracketAnalysisResult**: Result of analyzing a deck against bracket rules
- **CardCategory**: Value object for card category constants

**Characteristics:**
- No dependencies on external libraries (except for language features)
- No knowledge of UI, databases, or external APIs
- Contains only business logic and data structures
- Fully unit testable

### 2. Use Cases Layer (`packages/core/src/usecases/`)

Application-specific business rules that orchestrate the flow of data between layers.

**Use Cases:**
- **FetchDeckBracketUseCase**: Main use case that:
  1. Accepts a deck URL and configuration
  2. Determines the appropriate deck provider
  3. Fetches the deck via infrastructure adapters
  4. Analyzes the deck against bracket rules
  5. Returns domain entities

**Characteristics:**
- Coordinates between domain and infrastructure
- Independent of UI concerns
- Can be easily tested with mock adapters
- Defines the application's business workflows

### 3. Infrastructure Layer (`packages/core/src/infrastructure/`)

Handles external concerns like API calls and data transformation.

**Adapters:**
- **MoxfieldRepository**: Fetches from Moxfield API, maps to domain model
- **ArchidektRepository**: Fetches from Archidekt API, maps to domain model
- **BracketAnalyzer**: Analyzes decks against configuration rules

**Characteristics:**
- Depends on external libraries (axios)
- Implements specific technical details
- Maps external data to domain models
- Can be swapped with alternative implementations

## Dependency Flow

```
┌─────────────────────────────────────────────────┐
│           Presentation Layer                    │
│  (Discord Bot, React Web App)                   │
└──────────────────┬──────────────────────────────┘
                   │
                   │ uses
                   ▼
┌─────────────────────────────────────────────────┐
│          Application Services                   │
│  (deckService.js - Platform-specific wrappers)  │
└──────────────────┬──────────────────────────────┘
                   │
                   │ depends on
                   ▼
┌─────────────────────────────────────────────────┐
│              Use Cases Layer                    │
│       (FetchDeckBracketUseCase)                 │
└──────────────────┬──────────────────────────────┘
                   │
         ┌─────────┴─────────┐
         │                   │
         ▼                   ▼
┌────────────────┐  ┌────────────────────┐
│  Domain Layer  │  │ Infrastructure     │
│  (Entities)    │  │ (Adapters)         │
└────────────────┘  └────────────────────┘
```

**Key Points:**
- Inner layers don't know about outer layers
- Dependencies point inward
- Domain layer has zero dependencies
- Infrastructure adapters depend on domain entities

## Configuration Management

Configuration is **not** part of the shared library because it's platform-specific:

- **Discord Bot**: Uses filesystem (`data/config.json`)
- **Web App**: Uses browser localStorage

Both applications implement the same configuration interface:
- `getBrackets()`
- `getGlobalBans()`
- `getCardCategories()`

## Platform Integration

### Discord Bot (CommonJS)

The bot uses a wrapper service that bridges CommonJS and ES modules:

```javascript
// src/services/deckService.js
const configManager = require('../config/configManager');

async function loadCore() {
  // Dynamic import for ES module
  return await import('@rulezero/core');
}

class DeckService {
  async fetchAndAnalyzeDeck(url) {
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
```

### Web App (ES Modules)

The web app directly imports and uses the shared library:

```javascript
// web/src/services/deckService.js
import { FetchDeckBracketUseCase } from '@rulezero/core';
import configManager from './configManager';

class DeckService {
  constructor() {
    this.useCase = new FetchDeckBracketUseCase();
  }

  async fetchAndAnalyzeDeck(url) {
    const config = {
      brackets: configManager.getBrackets(),
      globalBans: configManager.getGlobalBans(),
      cardCategories: configManager.getCardCategories(),
    };
    
    return await this.useCase.execute(url, config);
  }
}
```

## Benefits of This Architecture

### 1. Separation of Concerns
- Business logic is isolated from UI and platform concerns
- Each layer has a single, well-defined responsibility

### 2. Testability
- Domain entities can be tested without any mocks
- Use cases can be tested with mock adapters
- Infrastructure adapters can be tested in isolation

### 3. Maintainability
- Changes to business rules only affect the core library
- Platform-specific concerns are isolated
- Easy to understand where each piece of logic belongs

### 4. Flexibility
- Can add new deck providers by creating new adapters
- Can add new platforms (CLI, mobile app) without changing core logic
- Can swap implementations (e.g., different APIs) easily

### 5. Code Reuse
- Single source of truth for business logic
- No duplication between Discord bot and web app
- Consistent behavior across platforms

## Extending the System

### Adding a New Deck Provider

1. Create a new adapter in `packages/core/src/infrastructure/`:

```javascript
export class NewProviderAdapter {
  static canHandle(url) {
    return url.includes('newprovider.com');
  }
  
  async fetchDeck(url) {
    // Fetch from API
    // Map to Deck domain entity
    return new Deck({...});
  }
}
```

2. Update the use case to use the new adapter:

```javascript
async fetchDeck(url) {
  if (NewProviderAdapter.canHandle(url)) {
    return await new NewProviderAdapter().fetchDeck(url);
  }
  // ... existing logic
}
```

### Adding a New Use Case

1. Create a new use case in `packages/core/src/usecases/`:

```javascript
export class ExportDeckToFileUseCase {
  async execute(deck, format) {
    // Orchestrate business logic
  }
}
```

2. Export it from `packages/core/src/index.js`
3. Use it in your application services

### Adding Business Rules

Add logic to domain entities:

```javascript
export class Deck {
  isCompetitive() {
    // Business rule: competitive if has many expensive cards
    return this.getTotalValue() > 1000;
  }
}
```

## Testing Strategy

### Domain Layer
- Unit tests with no mocks
- Test pure business logic
- Fast and reliable

### Use Cases Layer
- Integration tests with mock adapters
- Test business workflows
- Verify adapter interactions

### Infrastructure Layer
- Integration tests with real APIs (or mocked HTTP)
- Test data mapping
- Verify error handling

### Application Layer
- End-to-end tests for each platform
- Test platform-specific concerns
- Verify integration with core library

## Migration Notes

### Before (Duplicated Logic)
- Business logic copied between `src/services/` and `web/src/services/`
- Changes needed in multiple places
- Inconsistencies between platforms
- No clear boundaries

### After (Shared Library)
- Single source of truth in `packages/core/`
- Changes propagate automatically
- Consistent behavior guaranteed
- Clear architectural layers

## Future Improvements

1. **Add TypeScript**: Strong typing across all layers
2. **Add Unit Tests**: Comprehensive test coverage
3. **Add Validation Layer**: Input validation in use cases
4. **Add Event System**: Publish domain events for analytics
5. **Add Caching**: Cache deck data in infrastructure layer
6. **Add Rate Limiting**: Respect API rate limits in adapters
