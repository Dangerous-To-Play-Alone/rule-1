# Fetch Default Brackets Feature

## Overview

The app now fetches default MTG Commander bracket information from [CommanderSpellbook API](https://backend.commanderspellbook.com/) instead of using only hardcoded data.

## Implementation

### Core Package

**New Use Case: `FetchDefaultBracketsUseCase`**
- Location: `packages/core/src/usecases/FetchDefaultBracketsUseCase.js`
- Fetches from CommanderSpellbook API:
  - **Global Bans**: Cards banned in Commander format
  - **Tutors**: Cards flagged as tutors
  - **Two Card Combos**: Cards from 2-card combos in high-power brackets (Ruthless/Spicy)
  - **Game Changers**: High-impact cards
  - **Land Denial**: Mass land destruction cards

**Features:**
- Automatic pagination to fetch all results
- Parallel fetching for efficiency
- CORS proxy support for browser environments
- Proper error handling

### Web Application

**ConfigManager Updates**
- `fetchDefaultsFromAPI()`: Fetches and stores defaults from CommanderSpellbook
- `getFetchedDefaults()`: Retrieves stored defaults from localStorage
- `hasFetchedDefaults()`: Checks if defaults exist in storage
- `resetToDefaults()`: Now uses fetched defaults when available

**App.js Updates**
1. **Initialization on Launch**: Automatically fetches defaults on first load
   - Only fetches if not already stored
   - Shows status indicator in header
   - Falls back to hardcoded defaults on error

2. **Reset Button**: New "Reset to Bracket Defaults" button on homepage
   - Fetches fresh data from CommanderSpellbook
   - Replaces all current settings
   - Requires user confirmation

**UI Components:**
- Initialization status indicator (loading/error states)
- Reset section with button and help text
- Error message display

## User Experience

### First Launch
1. App loads with hardcoded defaults
2. Background fetch from CommanderSpellbook begins
3. Status indicator shows "Initializing default brackets from CommanderSpellbook..."
4. On success: Defaults are stored in localStorage for future use
5. On error: App continues with hardcoded defaults

### Reset to Defaults
1. User clicks "🔄 Reset to Bracket Defaults" button
2. Confirmation dialog appears
3. Fresh data is fetched from CommanderSpellbook
4. All settings (brackets, bans, categories) are replaced
5. Success/error message shown

## Data Storage

- **Key**: `mtg-bracket-defaults` in localStorage
- **Format**: JSON object with structure:
  ```json
  {
    "brackets": { ... },
    "globalBans": ["card1", "card2", ...],
    "cardCategories": {
      "tutors": [...],
      "twoCardCombos": [...],
      "gameChangers": [...],
      "landDenial": [...]
    }
  }
  ```

## API Endpoints Used

- Global Bans: `GET /cards?legalities__commander=false`
- Tutors: `GET /cards?tutor=true&legalities__commander=true`
- Game Changers: `GET /cards?gameChanger=true&legalities__commander=true`
- Land Denial: `GET /cards?massLandDenial=true&legalities__commander=true`
- Two Card Combos: `GET /variants?card_count=2&commander_bracket=4,5`

## Error Handling

- Network errors: App falls back to hardcoded defaults
- CORS issues: Automatically uses CORS proxy
- API errors: User is notified, hardcoded defaults remain active
- All errors are logged to console for debugging

## Testing

Build the web app to verify:
```bash
cd web
npm run build
```

Run the web app:
```bash
cd web
npm start
```

## Future Improvements

1. Add caching with expiration (e.g., refresh weekly)
2. Show timestamp of last fetch
3. Add manual refresh option without resetting
4. Display loading progress (e.g., "Fetching tutors...")
5. Add diff view before resetting to defaults
