# Rule Minus One - Web App

A frontend-only React application that analyzes Magic: The Gathering Commander decks from Moxfield and Archidekt, determining which bracket they belong to based on configurable rules.

## Features

- **Deck Analysis**: Fetch and analyze decks from Moxfield and Archidekt URLs
- **Bracket Management**: View, add, edit, and delete bracket configurations
- **Local Storage**: All configuration stored in your browser (no server required!)
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **GitHub Pages Ready**: Deploy to GitHub Pages with one command

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install
```

### Development

Run the development server:

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### Build

Create a production build:

```bash
npm run build
```

The build folder will contain optimized static files ready for deployment.

## Deployment to GitHub Pages

### Initial Setup

1. Create a new GitHub repository
2. Initialize git in your project (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

3. Add your GitHub repository as remote:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git branch -M main
   git push -u origin main
   ```

### Deploy

Deploy to GitHub Pages with one command:

```bash
npm run deploy
```

This will:
1. Build your app for production
2. Create a `gh-pages` branch
3. Push the build to that branch

Your site will be available at: `https://YOUR_USERNAME.github.io/YOUR_REPO/`

### GitHub Pages Configuration

After deploying, make sure GitHub Pages is enabled:

1. Go to your repository on GitHub
2. Click Settings > Pages
3. Under "Source", ensure it's set to deploy from the `gh-pages` branch
4. Your site should be live within a few minutes

## How It Works

### Local Storage

All bracket configuration and rules are stored in your browser's localStorage. This means:
- ✅ No server required
- ✅ Works offline (after first load)
- ✅ Fast and responsive
- ⚠️ Data is browser-specific (not synced across devices)
- ⚠️ Clearing browser data will reset to defaults

### Architecture

```
src/
├── components/
│   ├── DeckAnalyzer.js      # Deck analysis interface
│   ├── BracketManager.js    # Bracket management interface
│   └── *.css                # Component styles
├── services/
│   ├── deckFetcher.js       # Fetches decks from Moxfield/Archidekt
│   ├── bracketAnalyzer.js   # Analyzes decks against bracket rules
│   └── configManager.js     # Manages localStorage configuration
├── config/
│   └── defaultBrackets.js   # Default bracket configuration
└── App.js                   # Main application
```

## Usage

### Analyzing a Deck

1. Go to the "Analyze Deck" tab
2. Paste a Moxfield or Archidekt URL
3. Click "Analyze Deck"
4. View the bracket classification and card breakdown

### Managing Brackets

1. Go to the "Manage Brackets" tab
2. View all existing brackets
3. Click "Edit" to modify bracket limits
4. Click "+ Add Bracket" to create a new bracket
5. Click "Delete" to remove a bracket
6. Click "Reset to Defaults" to restore original configuration

### Bracket Limits

For each bracket, you can set limits for:
- **Tutors**: Cards that search your library
- **Two-Card Combos**: Cards that form infinite combos
- **Game Changers**: High-impact game-winning cards
- **Land Denial**: Cards that destroy or restrict lands

Use `-1` to set unlimited for any category.

## Default Brackets

### Bracket 1
Precon power level
- 0 tutors, 0 combos, 0 game changers, 0 land denial

### Bracket 2
Upgraded casual
- 2 tutors, 0 combos, 1 game changer, 0 land denial

### Bracket 3
Optimized casual
- 5 tutors, 1 combo, 3 game changers, 1 land denial

### Bracket 4
High power
- Unlimited everything

## Troubleshooting

### Deck Not Loading
- Check that the URL is from Moxfield or Archidekt
- Ensure you have an internet connection
- Try the deck URL in your browser to verify it's accessible

### Configuration Lost
- Configuration is stored in localStorage
- Clearing browser data will reset to defaults

### GitHub Pages 404
- Ensure the `homepage` field in package.json is correct
- Wait a few minutes after deploying
- Check GitHub Pages settings in your repository

## Technologies Used

- **React**: UI framework
- **Axios**: HTTP client for deck fetching
- **localStorage**: Browser storage for configuration
- **GitHub Pages**: Static site hosting

## License

ISC
