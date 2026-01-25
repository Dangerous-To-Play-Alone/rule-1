# Rule Minus One

A comprehensive toolkit for analyzing Magic: The Gathering Commander decks from Moxfield and Archidekt, determining which bracket they belong to based on configurable rules.

## Components

1. **Discord Bot** - Full-featured bot with slash commands for server-based bracket management
2. **Web Application** - Frontend-only React app deployable to GitHub Pages

## Features

- **Deck Analysis**: Fetch and analyze decks from Moxfield and Archidekt URLs
- **Bracket Classification**: Automatically classify decks into brackets based on card categories (tutors, combos, game changers, land denial)
- **Configurable Brackets**: Admins can add, remove, or modify bracket definitions
- **Global Ban List**: Manage globally banned cards across all brackets
- **Category Management**: Add or remove cards from categories (tutors, two-card combos, game changers, land denial)
- **Default Configuration**: Pre-configured with official MTG Commander bracket rules

## Setup

### Prerequisites

- Node.js (v16 or higher)
- A Discord Bot Token
- Discord Application Client ID

### Installation

1. Clone the repository and install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

3. Edit `.env` and add your Discord credentials:
```
DISCORD_TOKEN=your_discord_bot_token_here
DISCORD_CLIENT_ID=your_client_id_here
```

### Creating a Discord Bot

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" and give it a name
3. Go to the "Bot" section and click "Add Bot"
4. Copy the bot token and add it to your `.env` file
5. Go to the "OAuth2" section, copy the Client ID and add it to your `.env` file
6. Under OAuth2 > URL Generator, select:
   - Scopes: `bot`, `applications.commands`
   - Bot Permissions: `Send Messages`, `Use Slash Commands`
7. Use the generated URL to invite the bot to your server

### Deploy Commands

Before running the bot for the first time, deploy the slash commands:

```bash
npm run deploy
```

### Start the Bot

```bash
npm start
```

## Commands

### User Commands

- `/analyze <url>` - Analyze a deck from Moxfield or Archidekt and determine its bracket
- `/brackets` - List all configured brackets and their limits
- `/bracket <id>` - View detailed information about a specific bracket
- `/banlist` - View the global ban list
- `/category <category>` - View cards in a specific category (tutors, twoCardCombos, gameChangers, landDenial)

### Admin Commands

#### Bracket Management
- `/bracket-add <id> <name> <description> <tutors> <combos> <gamechangers> <landdenial>` - Add a new bracket (use -1 for unlimited)
- `/bracket-update <id> [tutors] [combos] [gamechangers] [landdenial]` - Update bracket limits
- `/bracket-remove <id>` - Remove a bracket

#### Ban List Management
- `/ban <card>` - Add a card to the global ban list
- `/unban <card>` - Remove a card from the global ban list

#### Category Management
- `/category-add <category> <card>` - Add a card to a category
- `/category-remove <category> <card>` - Remove a card from a category

#### System
- `/reset` - Reset all brackets and bans to default configuration

## Default Brackets

### Bracket 1
- **Description**: Precon power level with minimal fast mana and interaction
- **Limits**: No tutors, combos, game changers, or land denial

### Bracket 2
- **Description**: Upgraded casual with some tutors and interaction
- **Limits**: 2 tutors, 0 combos, 1 game changer, 0 land denial

### Bracket 3
- **Description**: Optimized casual with multiple tutors and combos
- **Limits**: 5 tutors, 1 combo, 3 game changers, 1 land denial

### Bracket 4
- **Description**: High power with unlimited tutors and combos
- **Limits**: Unlimited everything

## Card Categories

The bot tracks four categories of cards to determine bracket classification:

- **Tutors**: Cards that search your library for specific cards (e.g., Demonic Tutor, Vampiric Tutor)
- **Two-Card Combos**: Cards that form infinite combos with one other card (e.g., Thassa's Oracle + Demonic Consultation)
- **Game Changers**: High-impact cards that can win games (e.g., Cyclonic Rift, Rhystic Study)
- **Land Denial**: Cards that destroy or restrict lands (e.g., Armageddon, Blood Moon)

## Configuration

The bot stores its configuration in `data/config.json`. This file is automatically created on first run with default settings. You can modify brackets, bans, and card categories through Discord commands or by editing this file directly (requires bot restart).

## Example Usage

```
/analyze https://moxfield.com/decks/yGOwOIUYzEehNpR5nnym1A
```

The bot will:
1. Fetch the deck from Moxfield
2. Check for banned cards
3. Count cards in each category
4. Determine the appropriate bracket
5. Display detailed results including commander, bracket classification, and found cards

## Project Structure

```
rulezero/
├── packages/core/                  # Shared business logic library (ES Modules)
│   └── src/
│       ├── domain/                # Pure business entities
│       │   ├── Deck.js
│       │   ├── BracketAnalysisResult.js
│       │   └── CardCategory.js
│       ├── usecases/              # Application business rules
│       │   └── FetchDeckBracketUseCase.js
│       └── infrastructure/        # External adapters
│           ├── MoxfieldRepository.js
│           ├── ArchidektRepository.js
│           └── BracketAnalyzer.js
├── src/                            # Discord Bot (CommonJS)
│   ├── bot.js                     # Main bot file
│   ├── deploy-commands.js         # Command deployment script
│   ├── commands/
│   │   └── index.js               # Slash command definitions
│   ├── config/
│   │   ├── defaultBrackets.js     # Default bracket configuration
│   │   └── configManager.js       # Configuration management
│   ├── handlers/
│   │   └── commandHandler.js      # Command logic handlers
│   └── services/
│       └── deckService.js         # Wrapper for shared library
├── web/                            # React Web App (ES Modules)
│   └── src/
│       ├── services/
│       │   ├── deckService.js     # Wrapper for shared library
│       │   └── configManager.js   # Configuration (localStorage)
│       └── components/
├── data/
│   └── config.json                # Runtime configuration (auto-generated)
├── .env                            # Environment variables
├── ARCHITECTURE.md                 # Architecture documentation
└── package.json                    # Workspace configuration
```

## Web Application

The web application is a frontend-only React app that can be deployed to GitHub Pages. It provides the same functionality as the Discord bot but in a web interface.

### Quick Start

```bash
cd web
npm install
npm start
```

### Deploy to GitHub Pages

```bash
cd web
npm run deploy
```

See the [web/README.md](web/README.md) for detailed instructions.

## Architecture

This project follows **CLEAN Architecture** principles with a shared business logic library (`@rulezero/core`) that is consumed by both the Discord bot and web application.

### Key Benefits
- **Single Source of Truth**: Business logic lives in one place
- **Consistency**: Both platforms use identical logic
- **Maintainability**: Changes propagate automatically
- **Testability**: Clear separation enables easy testing

### Layers
1. **Domain Layer**: Pure business entities (Deck, BracketAnalysisResult, CardCategory)
2. **Use Cases Layer**: Application business rules (FetchDeckBracketUseCase)
3. **Infrastructure Layer**: External adapters (MoxfieldRepository, ArchidektRepository, BracketAnalyzer)

For detailed architecture documentation, see [ARCHITECTURE.md](ARCHITECTURE.md).

For usage examples, see [packages/core/EXAMPLES.md](packages/core/EXAMPLES.md).

## License

ISC
