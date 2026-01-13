# Quick Start Guide

## Web Application (Recommended for GitHub Pages)

The web app is a frontend-only React application that requires no server and can be easily deployed to GitHub Pages.

### Run Locally

```bash
cd web
npm install
npm start
```

Visit http://localhost:3000

### Deploy to GitHub Pages

```bash
cd web
npm run deploy
```

Your site will be available at `https://YOUR_USERNAME.github.io/YOUR_REPO/`

### Features
- ✅ No server required
- ✅ Deploy to GitHub Pages with one command
- ✅ Configuration stored in browser localStorage
- ✅ Analyze decks from Moxfield and Archidekt
- ✅ Full bracket management interface

---

## Discord Bot

The Discord bot provides the same functionality but integrated into Discord servers.

### Setup

1. Create `.env` file:
```bash
cp .env.example .env
```

2. Add your Discord credentials to `.env`:
```
DISCORD_TOKEN=your_token_here
DISCORD_CLIENT_ID=your_client_id_here
```

3. Deploy commands:
```bash
npm run deploy
```

4. Start the bot:
```bash
npm start
```

### Features
- ✅ Slash commands for all operations
- ✅ Server-specific configuration
- ✅ Admin-only bracket management
- ✅ Persistent configuration in JSON file

---

## Which Should You Use?

### Use the Web App if you want:
- A simple, no-setup solution
- To host on GitHub Pages for free
- Individual users to manage their own brackets
- A visual interface

### Use the Discord Bot if you want:
- Integration with your Discord server
- Shared bracket configuration across your community
- Admin controls and permissions
- Server-wide ban lists and rules

---

## Both Use the Same Business Logic!

Both the web app and Discord bot share the same core logic via the `@rulezero/core` library:
- Fetching decks from Moxfield and Archidekt
- Analyzing card categories (tutors, combos, game changers, land denial)
- Determining bracket classification
- Managing bracket rules and limits

The shared library follows **CLEAN Architecture** principles with:
- **Domain Layer**: Pure business entities (Deck, BracketAnalysisResult)
- **Use Cases Layer**: Application business rules (FetchDeckBracketUseCase)
- **Infrastructure Layer**: External adapters (MoxfieldAdapter, ArchidektAdapter)

For detailed documentation, see:
- [ARCHITECTURE.md](ARCHITECTURE.md) - Architecture overview
- [packages/core/README.md](packages/core/README.md) - Library documentation
- [packages/core/EXAMPLES.md](packages/core/EXAMPLES.md) - Usage examples
