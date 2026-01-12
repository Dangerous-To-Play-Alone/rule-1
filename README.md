# MTG Commander Bracket Bot

A Discord bot that analyzes Magic: The Gathering Commander decks from Moxfield and Archidekt, determining which bracket they belong to based on configurable rules.

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
├── src/
│   ├── bot.js                      # Main bot file
│   ├── deploy-commands.js          # Command deployment script
│   ├── commands/
│   │   └── index.js                # Slash command definitions
│   ├── config/
│   │   ├── defaultBrackets.js      # Default bracket configuration
│   │   └── configManager.js        # Configuration management
│   ├── handlers/
│   │   └── commandHandler.js       # Command logic handlers
│   └── services/
│       ├── deckFetcher.js          # Deck fetching from Moxfield/Archidekt
│       └── bracketAnalyzer.js      # Bracket analysis logic
├── data/
│   └── config.json                 # Runtime configuration (auto-generated)
├── .env                            # Environment variables
├── package.json
└── README.md
```

## License

ISC
