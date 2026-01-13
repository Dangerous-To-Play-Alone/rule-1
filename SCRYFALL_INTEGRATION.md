# Scryfall ID Integration

## Overview

The system now supports Scryfall IDs for card storage, making it more robust and language-independent while maintaining backward compatibility with legacy name-only storage.

## Key Features

### 1. Card Domain Entity (`packages/core/src/domain/Card.js`)

New domain entity that represents cards with Scryfall IDs:

```javascript
const card = new Card({
  id: '3ed7f8cc-d023-4cce-8fc1-0e69d99f4e6f',  // Scryfall ID
  name: 'Demonic Tutor',
  scryfallId: '3ed7f8cc-d023-4cce-8fc1-0e69d99f4e6f'
});
```

**Features:**
- Matches cards by Scryfall ID (most reliable)
- Falls back to name matching (case-insensitive)
- Supports legacy string-only format
- Provides storage serialization

### 2. Scryfall Adapter (`packages/core/src/infrastructure/ScryfallAdapter.js`)

Handles all Scryfall API interactions:

```javascript
const scryfallAdapter = new ScryfallAdapter(httpClient);

// Search for cards
const results = await scryfallAdapter.searchCards('demonic');

// Get card by exact name
const card = await scryfallAdapter.getCardByName('Demonic Tutor');

// Get card by ID
const card = await scryfallAdapter.getCardById('3ed7f8cc...');

// Autocomplete
const suggestions = await scryfallAdapter.autocomplete('dem');

// Enrich legacy cards with IDs
const cards = await scryfallAdapter.enrichCards(['Demonic Tutor', 'Sol Ring']);
```

### 3. Card Category Manager UI

New React component for managing card categories:

**Features:**
- Search cards via Scryfall API
- Add cards with Scryfall IDs
- Remove cards from categories
- Visual indicator for cards with Scryfall IDs (✓ badge)
- Works with both legacy (string) and new (object) formats

## Storage Format

### New Format (with Scryfall ID)
```json
{
  "cardCategories": {
    "tutors": [
      {
        "id": "3ed7f8cc-d023-4cce-8fc1-0e69d99f4e6f",
        "name": "Demonic Tutor"
      },
      {
        "id": "6284e3c6-e2d6-4f3e-b41f-a85c021f0c2b",
        "name": "Vampiric Tutor"
      }
    ]
  }
}
```

### Legacy Format (backward compatible)
```json
{
  "cardCategories": {
    "tutors": [
      "Demonic Tutor",
      "Vampiric Tutor"
    ]
  }
}
```

The system seamlessly handles both formats!

## Benefits

### 1. Language Independence
Scryfall IDs work across all languages:
```javascript
// Same card, different languages - same ID
{ id: '3ed7...', name: 'Demonic Tutor' }      // English
{ id: '3ed7...', name: 'Tuteur démoniaque' }  // French
{ id: '3ed7...', name: 'Dämonischer Lehrmeister' } // German
```

### 2. Print Variations
Handles different printings of the same card:
- Resolves to the same oracle card
- Works across Moxfield, Archidekt, and other platforms
- No confusion with similarly-named cards

### 3. Exact Matching
No more issues with:
- Typos
- Special characters
- Punctuation variations
- Case sensitivity

### 4. Future-Proof
- Scryfall is the de facto standard for MTG data
- Both APIs (Moxfield & Archidekt) use Scryfall internally
- Easy to extend to other deck platforms

## Migration Path

### Automatic Migration
The system automatically migrates legacy data:

1. User adds a card via search → stored with Scryfall ID
2. User loads legacy config → works seamlessly
3. User edits categories → new cards get IDs, old cards remain

### Manual Migration (Optional)
```javascript
import { ScryfallAdapter } from '@rulezero/core';

const adapter = new ScryfallAdapter();
const legacy = ['Demonic Tutor', 'Sol Ring'];
const enriched = await adapter.enrichCards(legacy);
// Returns Card objects with Scryfall IDs
```

## Usage in Web App

### Adding Cards
1. Navigate to "Manage Cards" tab
2. Select category (Tutors, Combos, etc.)
3. Search for a card
4. Click "Add" on search result
5. Card is stored with Scryfall ID automatically

### Removing Cards
1. Select category
2. Click "Remove" on any card
3. Works for both legacy and ID-based cards

### Visual Indicators
- ✓ Green badge = Card has Scryfall ID
- No badge = Legacy string-only format

## Implementation Details

### Card Matching Logic
```javascript
card.matches(other) {
  // 1. Try Scryfall ID match (most reliable)
  if (this.scryfallId && other.scryfallId) {
    return this.scryfallId === other.scryfallId;
  }
  
  // 2. Fall back to name matching (case-insensitive)
  if (this.name && other.name) {
    return this.name.toLowerCase() === other.name.toLowerCase();
  }
  
  // 3. Support legacy string format
  if (typeof other === 'string') {
    return this.name.toLowerCase() === other.toLowerCase();
  }
}
```

### ConfigManager Updates
- `addCardToCategory()` - Accepts both string and object
- `removeCardFromCategory()` - Matches by ID or name
- Backward compatible with existing configs

## API Rate Limiting

Scryfall API is generous but has limits:
- 10 requests per second
- Requests should be spaced 50-100ms apart

The adapter doesn't currently implement rate limiting, but it can be added:

```javascript
// Future enhancement
class RateLimitedScryfallAdapter extends ScryfallAdapter {
  async get(url, options) {
    await this.waitForRateLimit();
    return super.get(url, options);
  }
}
```

## Testing

### Test Card Search
```bash
cd web
npm start
# Navigate to "Manage Cards" tab
# Search for "demonic" - should return results
# Add "Demonic Tutor" - should show ✓ badge
```

### Test Legacy Compatibility
```javascript
// In browser console
const configManager = require('./services/configManager');
configManager.addCardToCategory('tutors', 'Sol Ring'); // Legacy format
configManager.addCardToCategory('tutors', { id: 'abc123', name: 'Mana Crypt' }); // New format
// Both should work!
```

## Future Enhancements

1. **Card Images**: Display card images from Scryfall
2. **Card Prices**: Show card prices
3. **Set Information**: Display which set a card is from
4. **Bulk Import**: Import card lists with auto-enrichment
5. **Export**: Export categories with Scryfall IDs
6. **Validation**: Validate that stored IDs are still valid
7. **Cache**: Cache Scryfall responses to reduce API calls

## Error Handling

### Card Not Found
```javascript
try {
  const card = await scryfallAdapter.getCardByName('Invalid Card');
} catch (error) {
  // Falls back to storing name-only
  console.warn('Card not found, storing as legacy format');
  const card = Card.fromName('Invalid Card');
}
```

### Network Errors
CORS proxy handles network issues automatically (see CORS_SOLUTION.md)

## Documentation

- [Scryfall API Docs](https://scryfall.com/docs/api)
- [Card Domain Entity](packages/core/src/domain/Card.js)
- [ScryfallAdapter](packages/core/src/infrastructure/ScryfallAdapter.js)
- [CardCategoryManager UI](web/src/components/CardCategoryManager.js)

## Summary

The Scryfall ID integration makes the card category system:
- ✅ More reliable (ID-based matching)
- ✅ Language-independent
- ✅ Future-proof
- ✅ Backward compatible
- ✅ User-friendly (search UI)

All while maintaining CLEAN Architecture principles with proper domain modeling and dependency injection!
