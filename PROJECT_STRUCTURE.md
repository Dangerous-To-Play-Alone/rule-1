# Project Structure

This project contains two applications that share the same business logic:

## Root Directory

```
rulezero/
├── src/                    # Discord Bot
│   ├── bot.js             # Main bot application
│   ├── deploy-commands.js # Command deployment script
│   ├── commands/          # Slash command definitions
│   ├── config/            # Configuration management
│   │   ├── defaultBrackets.js
│   │   └── configManager.js
│   ├── handlers/          # Command handlers
│   └── services/          # Business logic
│       ├── deckFetcher.js
│       └── bracketAnalyzer.js
├── web/                   # React Web App
│   ├── public/            # Static assets
│   └── src/
│       ├── App.js         # Main application
│       ├── components/    # React components
│       │   ├── DeckAnalyzer.js
│       │   └── BracketManager.js
│       ├── config/        # Configuration
│       │   └── defaultBrackets.js
│       └── services/      # Business logic (browser-compatible)
│           ├── deckFetcher.js
│           ├── bracketAnalyzer.js
│           └── configManager.js
├── data/                  # Bot's persistent data
│   └── config.json        # Auto-generated configuration
├── .env                   # Bot environment variables
├── package.json           # Bot dependencies
└── README.md              # Main documentation
```

## Shared Business Logic

Both applications use identical logic for:

### 1. Deck Fetching (`deckFetcher.js`)
- Fetches decks from Moxfield API
- Fetches decks from Archidekt API
- Extracts commanders and mainboard cards

### 2. Bracket Analysis (`bracketAnalyzer.js`)
- Counts cards by category (tutors, combos, game changers, land denial)
- Checks against global ban list
- Determines bracket classification
- Validates against bracket limits

### 3. Configuration Management (`configManager.js`)
- **Bot**: Uses file system (data/config.json)
- **Web**: Uses localStorage
- Same interface for both:
  - `getBrackets()`
  - `addBracket(id, data)`
  - `updateBracket(id, updates)`
  - `removeBracket(id)`
  - `getGlobalBans()`
  - `addGlobalBan(card)`
  - `removeGlobalBan(card)`

### 4. Default Configuration (`defaultBrackets.js`)
- 4 default brackets
- Official Commander ban list
- Card categorization lists

## Key Differences

### Discord Bot
- **Storage**: File system (data/config.json)
- **Interface**: Discord slash commands
- **Deployment**: Node.js server
- **Scope**: Server-wide configuration
- **Permissions**: Admin-only bracket management

### Web Application
- **Storage**: Browser localStorage
- **Interface**: React UI
- **Deployment**: Static files (GitHub Pages)
- **Scope**: Per-user configuration
- **Permissions**: All users can manage their own brackets

## Data Flow

### Deck Analysis Flow
```
User Input (URL)
    ↓
deckFetcher.fetchDeck(url)
    ↓
Extract commanders & cards
    ↓
bracketAnalyzer.analyzeDeck(deck)
    ↓
Check global bans
    ↓
Count card categories
    ↓
Compare against bracket limits
    ↓
Return bracket classification
```

### Configuration Management Flow
```
User Action (add/edit/delete)
    ↓
configManager.method()
    ↓
Update in-memory config
    ↓
Persist to storage:
  - Bot: data/config.json
  - Web: localStorage
    ↓
Refresh UI/Send response
```

## Adding New Features

To add a feature that works in both apps:

1. **Add business logic** to the appropriate service file
2. **Update both versions** of the service (src/ and web/src/)
3. **Add UI** in Discord bot commands (src/commands/ and src/handlers/)
4. **Add UI** in React components (web/src/components/)
5. **Test both** implementations

## Configuration Schema

Both apps use the same configuration structure:

```javascript
{
  brackets: {
    [id]: {
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
