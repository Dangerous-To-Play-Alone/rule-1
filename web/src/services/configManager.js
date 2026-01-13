import defaultBrackets from '../config/defaultBrackets';

class ConfigManager {
  constructor() {
    this.storageKey = 'mtg-bracket-config';
    this.loadConfig();
  }

  loadConfig() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        this.config = JSON.parse(stored);
      } else {
        this.config = JSON.parse(JSON.stringify(defaultBrackets));
        this.saveConfig();
      }
    } catch (error) {
      console.error('Error loading config, using defaults:', error);
      this.config = JSON.parse(JSON.stringify(defaultBrackets));
      this.saveConfig();
    }
  }

  saveConfig() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.config));
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

  addCardToCategory(category, cardData) {
    if (!this.config.cardCategories[category]) {
      this.config.cardCategories[category] = [];
    }
    
    // Support both string (legacy) and object (with Scryfall ID) formats
    const cardToAdd = typeof cardData === 'string' ? cardData : cardData;
    
    // Check if card already exists (by ID or name)
    const exists = this.config.cardCategories[category].some(existing => {
      if (typeof existing === 'string' && typeof cardToAdd === 'string') {
        return existing.toLowerCase() === cardToAdd.toLowerCase();
      }
      if (typeof existing === 'object' && typeof cardToAdd === 'object') {
        return existing.id === cardToAdd.id || 
               existing.name.toLowerCase() === cardToAdd.name.toLowerCase();
      }
      if (typeof existing === 'string' && typeof cardToAdd === 'object') {
        return existing.toLowerCase() === cardToAdd.name.toLowerCase();
      }
      if (typeof existing === 'object' && typeof cardToAdd === 'string') {
        return existing.name.toLowerCase() === cardToAdd.toLowerCase();
      }
      return false;
    });
    
    if (!exists) {
      this.config.cardCategories[category].push(cardToAdd);
      this.saveConfig();
    }
  }

  removeCardFromCategory(category, cardIdentifier) {
    if (this.config.cardCategories[category]) {
      // Find index by ID or name
      const index = this.config.cardCategories[category].findIndex(card => {
        if (typeof card === 'string' && typeof cardIdentifier === 'string') {
          return card.toLowerCase() === cardIdentifier.toLowerCase();
        }
        if (typeof card === 'object') {
          return card.id === cardIdentifier || 
                 card.name.toLowerCase() === cardIdentifier.toLowerCase();
        }
        if (typeof card === 'string' && typeof cardIdentifier === 'object') {
          return card.toLowerCase() === cardIdentifier.name.toLowerCase();
        }
        return false;
      });
      
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

  // Category management
  addCategory(categoryId, categoryName) {
    const camelCaseId = categoryId.replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase())
                                   .replace(/^./, str => str.toLowerCase());
    
    if (this.config.cardCategories[camelCaseId]) {
      throw new Error(`Category "${camelCaseId}" already exists`);
    }
    
    this.config.cardCategories[camelCaseId] = [];
    
    // Add limit to all existing brackets
    Object.keys(this.config.brackets).forEach(bracketId => {
      this.config.brackets[bracketId].limits[camelCaseId] = Infinity;
    });
    
    this.saveConfig();
    return camelCaseId;
  }

  removeCategory(categoryId) {
    // Can't remove built-in categories
    const builtIn = ['tutors', 'twoCardCombos', 'gameChangers', 'landDenial'];
    if (builtIn.includes(categoryId)) {
      throw new Error(`Cannot remove built-in category "${categoryId}"`);
    }
    
    if (!this.config.cardCategories[categoryId]) {
      throw new Error(`Category "${categoryId}" does not exist`);
    }
    
    // Remove from cardCategories
    delete this.config.cardCategories[categoryId];
    
    // Remove from all bracket limits
    Object.keys(this.config.brackets).forEach(bracketId => {
      if (this.config.brackets[bracketId].limits[categoryId]) {
        delete this.config.brackets[bracketId].limits[categoryId];
      }
    });
    
    this.saveConfig();
  }

  getCategoryName(categoryId) {
    // Convert camelCase to Title Case
    return categoryId.replace(/([A-Z])/g, ' $1')
                     .replace(/^./, str => str.toUpperCase());
  }
}

export default new ConfigManager();
