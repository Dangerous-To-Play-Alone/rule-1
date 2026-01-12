const fs = require('fs');
const path = require('path');
const defaultBrackets = require('./defaultBrackets');

class ConfigManager {
  constructor() {
    this.configPath = path.join(__dirname, '../../data/config.json');
    this.ensureDataDirectory();
    this.loadConfig();
  }

  ensureDataDirectory() {
    const dataDir = path.dirname(this.configPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
  }

  loadConfig() {
    if (fs.existsSync(this.configPath)) {
      try {
        const data = fs.readFileSync(this.configPath, 'utf8');
        this.config = JSON.parse(data);
      } catch (error) {
        console.error('Error loading config, using defaults:', error);
        this.config = JSON.parse(JSON.stringify(defaultBrackets));
        this.saveConfig();
      }
    } else {
      this.config = JSON.parse(JSON.stringify(defaultBrackets));
      this.saveConfig();
    }
  }

  saveConfig() {
    try {
      fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2));
    } catch (error) {
      console.error('Error saving config:', error);
      throw error;
    }
  }

  getBrackets() {
    return this.config.brackets;
  }

  getBracket(bracketId) {
    return this.config.brackets[bracketId];
  }

  addBracket(bracketId, bracketData) {
    this.config.brackets[bracketId] = bracketData;
    this.saveConfig();
  }

  updateBracket(bracketId, updates) {
    if (!this.config.brackets[bracketId]) {
      throw new Error(`Bracket ${bracketId} does not exist`);
    }
    this.config.brackets[bracketId] = { ...this.config.brackets[bracketId], ...updates };
    this.saveConfig();
  }

  removeBracket(bracketId) {
    delete this.config.brackets[bracketId];
    this.saveConfig();
  }

  getGlobalBans() {
    return this.config.globalBans;
  }

  addGlobalBan(cardName) {
    if (!this.config.globalBans.includes(cardName)) {
      this.config.globalBans.push(cardName);
      this.saveConfig();
    }
  }

  removeGlobalBan(cardName) {
    const index = this.config.globalBans.indexOf(cardName);
    if (index > -1) {
      this.config.globalBans.splice(index, 1);
      this.saveConfig();
    }
  }

  getCardCategories() {
    return this.config.cardCategories;
  }

  addCardToCategory(category, cardName) {
    if (!this.config.cardCategories[category]) {
      this.config.cardCategories[category] = [];
    }
    if (!this.config.cardCategories[category].includes(cardName)) {
      this.config.cardCategories[category].push(cardName);
      this.saveConfig();
    }
  }

  removeCardFromCategory(category, cardName) {
    if (this.config.cardCategories[category]) {
      const index = this.config.cardCategories[category].indexOf(cardName);
      if (index > -1) {
        this.config.cardCategories[category].splice(index, 1);
        this.saveConfig();
      }
    }
  }

  resetToDefaults() {
    this.config = JSON.parse(JSON.stringify(defaultBrackets));
    this.saveConfig();
  }
}

module.exports = new ConfigManager();
