# MTG Commander Bracket Analyzer - Complete Summary

## 🎯 What This Project Does

Analyzes Magic: The Gathering Commander decks from Moxfield and Archidekt to determine which power level bracket they belong to based on configurable rules for:
- Tutors (cards that search your library)
- Two-Card Combos (infinite combo pieces)
- Game Changers (high-impact cards)
- Land Denial (cards that destroy/restrict lands)

## 📦 Two Applications, One Codebase

### 1. Discord Bot
**Location:** Root directory (`src/`)

**Use Case:** Discord server communities that want shared bracket rules

**Features:**
- Slash commands (`/analyze`, `/brackets`, `/bracket-add`, etc.)
- Admin-only bracket management
- Server-wide configuration stored in JSON file
- Supports Moxfield & Archidekt deck URLs

**Quick Start:**
```bash
# Setup
cp .env.example .env
# Add DISCORD_TOKEN and DISCORD_CLIENT_ID to .env
npm install
npm run deploy  # Deploy commands to Discord
npm start       # Start bot
```

### 2. React Web App
**Location:** `web/` directory

**Use Case:** Individual users or easy GitHub Pages hosting

**Features:**
- Modern React UI with two tabs (Analyze & Manage)
- Per-user configuration in localStorage
- No server required - runs entirely in browser
- One-command deployment to GitHub Pages

**Quick Start:**
```bash
cd web
npm install
npm start       # Run locally

# OR deploy to GitHub Pages
npm run deploy
```

## 🏗️ Architecture

### Shared Business Logic
Both apps use identical core logic:

1. **Deck Fetcher** - Fetches decks from Moxfield/Archidekt APIs
2. **Bracket Analyzer** - Counts card categories and determines bracket
3. **Config Manager** - Manages bracket rules and bans
4. **Default Brackets** - 4 brackets based on MTG Commander standards

### Key Differences

| Feature | Discord Bot | Web App |
|---------|-------------|---------|
| Storage | File system (JSON) | localStorage |
| Deployment | Node.js server | Static files (GitHub Pages) |
| Configuration | Server-wide | Per-user |
| Permissions | Admin-only editing | Everyone can edit their own |
| Interface | Slash commands | React UI |

## 🚀 Available Commands

### Root Directory (Bot)
```bash
npm start          # Start Discord bot
npm run deploy     # Deploy bot commands to Discord
npm run web        # Run web app locally
npm run web:build  # Build web app for production
npm run web:deploy # Deploy web app to GitHub Pages
```

### Web Directory
```bash
cd web
npm start          # Development server
npm run build      # Production build
npm run deploy     # Deploy to GitHub Pages
```

## 📋 Default Configuration

### Brackets
- **Bracket 1**: Precon level (0 tutors, 0 combos, 0 changers, 0 denial)
- **Bracket 2**: Upgraded casual (2 tutors, 0 combos, 1 changer, 0 denial)
- **Bracket 3**: Optimized (5 tutors, 1 combo, 3 changers, 1 denial)
- **Bracket 4**: High power (unlimited everything)

### Global Ban List
Includes 48 cards from the official Commander ban list (as of 2026):
- Power Nine (Black Lotus, Moxen, etc.)
- Fast mana (Mana Crypt, Jeweled Lotus)
- Banned commanders (Golos, Lutri, etc.)
- Broken cards (Flash, Tinker, etc.)

## 🎨 Web App Features

### Analyze Deck Tab
- Paste Moxfield or Archidekt URL
- Click "Analyze Deck"
- See bracket classification with detailed breakdown
- View found cards by category

### Manage Brackets Tab
- View all brackets with limits
- Edit existing brackets
- Add new brackets (e.g., Bracket 0 or 6)
- Delete custom brackets
- Reset to defaults

## 📱 Responsive Design

The web app is fully responsive:
- **Desktop**: Two-column layouts, hover effects
- **Tablet**: Adaptive grid layouts
- **Mobile**: Single column, full-width buttons

## 🔒 Data Persistence

### Discord Bot
- Configuration stored in `data/config.json`
- Automatically created on first run
- Persists across bot restarts
- Shared across all server users

### Web App
- Configuration stored in browser localStorage
- Per-browser, per-user
- Not synced across devices
- Survives page refreshes but not browser data clearing

## 🌐 GitHub Pages Deployment

The web app is configured for easy GitHub Pages deployment:

1. Push code to GitHub
2. Run `npm run deploy` (from web directory)
3. Enable GitHub Pages in repository settings
4. Site live at `https://username.github.io/repo/`

The `homepage: "."` setting ensures it works in subdirectories.

## 📚 Documentation

- **README.md** - Main project documentation
- **web/README.md** - Web app specific guide
- **QUICKSTART.md** - Quick start guide for both apps
- **PROJECT_STRUCTURE.md** - Detailed architecture
- **SUMMARY.md** - This file

## 🔧 Customization

Both apps support full customization:

### Add New Brackets
- Discord: `/bracket-add` command
- Web: Click "+ Add Bracket" button

### Modify Limits
- Discord: `/bracket-update` command
- Web: Click "Edit" on any bracket

### Manage Bans
- Discord: `/ban` and `/unban` commands
- Web: (Managed via Discord bot currently)

### Add Cards to Categories
- Discord: `/category-add` and `/category-remove`
- Web: (Managed via Discord bot currently)

## 🎯 Use Cases

### For Individuals
Use the **web app** to:
- Quickly check your deck's bracket
- Experiment with different bracket rules
- Host your own rules on GitHub Pages

### For Communities
Use the **Discord bot** to:
- Establish server-wide bracket rules
- Let anyone check decks against community standards
- Admins control and customize rules

### For Both
- Analyze decks before games
- Ensure fair matchups
- Discover powerful cards in your deck
- Learn about card categories

## 🚦 Getting Started

**Quickest start (Web App):**
```bash
cd web
npm install
npm start
```
Then open http://localhost:3000

**For Discord (requires bot token):**
```bash
cp .env.example .env
# Edit .env with your Discord credentials
npm install
npm run deploy
npm start
```

## 📊 Technology Stack

### Discord Bot
- Node.js
- discord.js v14
- axios (for API calls)
- dotenv (environment variables)

### Web App
- React 19
- axios (for API calls)
- localStorage (data persistence)
- CSS3 (styling with gradients & animations)

### Deployment
- Discord Bot: Any Node.js hosting (VPS, Heroku, etc.)
- Web App: GitHub Pages (free static hosting)

## 🤝 Contributing

Both applications share business logic, so:
1. Update logic in both `src/services/` and `web/src/services/`
2. Keep configuration schemas identical
3. Test both applications after changes

## 📄 License

ISC
