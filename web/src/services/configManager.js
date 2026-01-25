import defaultBrackets from '../config/defaultBrackets';
import { FetchDefaultBracketsUseCase, CorsProxyHttpClient } from '@rulezero/core';

class ConfigManager {
  constructor() {
    this.storageKey = 'mtg-bracket-config';
    this.defaultsStorageKey = 'mtg-bracket-defaults';
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
    // Try to use fetched defaults, otherwise fall back to hardcoded defaults
    const fetchedDefaults = this.getFetchedDefaults();
    if (fetchedDefaults) {
      this.config = JSON.parse(JSON.stringify(fetchedDefaults));
    } else {
      this.config = JSON.parse(JSON.stringify(defaultBrackets));
    }
    this.saveConfig();
  }

  /**
   * Fetch default brackets from CommanderSpellbook API and store them locally
   * @returns {Promise<Object>} The fetched defaults
   */
  async fetchDefaultsFromAPI() {
    try {
      console.log('Fetching default brackets from CommanderSpellbook...');
      const httpClient = new CorsProxyHttpClient();
      const useCase = new FetchDefaultBracketsUseCase(httpClient);
      
      const { globalBans, cardCategories } = await useCase.execute();
      
      // Create the defaults object with the same structure as defaultBrackets
      const fetchedDefaults = {
        brackets: defaultBrackets.brackets, // Keep bracket definitions
        globalBans,
        cardCategories
      };
      
      // Store the fetched defaults
      localStorage.setItem(this.defaultsStorageKey, JSON.stringify(fetchedDefaults));
      console.log('Successfully fetched and stored default brackets');
      
      return fetchedDefaults;
    } catch (error) {
      console.error('Failed to fetch defaults from API:', error);
      throw error;
    }
  }

  /**
   * Get the fetched defaults from local storage
   * @returns {Object|null} The fetched defaults or null if not available
   */
  getFetchedDefaults() {
    try {
      const stored = localStorage.getItem(this.defaultsStorageKey);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error loading fetched defaults:', error);
      return null;
    }
  }

  /**
   * Check if fetched defaults exist in storage
   * @returns {boolean}
   */
  hasFetchedDefaults() {
    return localStorage.getItem(this.defaultsStorageKey) !== null;
  }

  /**
   * Export current configuration as a JSON backup
   * @returns {Object} Backup object with metadata and configuration
   */
  exportBackup() {
    const backup = {
      version: '1.0.0',
      exportDate: new Date().toISOString(),
      appName: 'Rule Minus One',
      config: {
        brackets: this.config.brackets,
        globalBans: this.config.globalBans,
        cardCategories: this.config.cardCategories
      }
    };
    
    return backup;
  }

  /**
   * Download configuration as a JSON file
   * @param {string} filename - Optional filename (defaults to timestamped name)
   */
  downloadBackup(filename = null) {
    const backup = this.exportBackup();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const defaultFilename = `rulezero-backup-${timestamp}.json`;
    
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || defaultFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    
    console.log(`Backup downloaded as ${filename || defaultFilename}`);
  }

  /**
   * Import and restore configuration from a backup object
   * @param {Object} backup - Backup object to restore
   * @param {boolean} merge - If true, merge with existing config; if false, replace entirely
   * @throws {Error} If backup is invalid
   */
  importBackup(backup, merge = false) {
    // Validate backup structure
    if (!backup || typeof backup !== 'object') {
      throw new Error('Invalid backup: Must be a valid object');
    }
    
    if (!backup.config) {
      throw new Error('Invalid backup: Missing config data');
    }
    
    if (!backup.config.brackets || !backup.config.globalBans || !backup.config.cardCategories) {
      throw new Error('Invalid backup: Missing required config fields (brackets, globalBans, or cardCategories)');
    }
    
    // Log backup metadata
    console.log('Importing backup:', {
      version: backup.version,
      exportDate: backup.exportDate,
      appName: backup.appName
    });
    
    if (merge) {
      // Merge mode: Add to existing config without replacing
      this.mergeConfig(backup.config);
    } else {
      // Replace mode: Completely replace current config
      this.config = {
        brackets: backup.config.brackets,
        globalBans: backup.config.globalBans,
        cardCategories: backup.config.cardCategories
      };
    }
    
    this.saveConfig();
    console.log('Backup imported successfully');
  }

  /**
   * Merge backup config with existing config
   * @private
   * @param {Object} backupConfig - Config to merge
   */
  mergeConfig(backupConfig) {
    // Merge brackets
    if (backupConfig.brackets) {
      this.config.brackets = {
        ...this.config.brackets,
        ...backupConfig.brackets
      };
    }
    
    // Merge global bans (add new ones, keep existing)
    if (backupConfig.globalBans) {
      const existingBans = new Set(this.config.globalBans);
      backupConfig.globalBans.forEach(ban => existingBans.add(ban));
      this.config.globalBans = Array.from(existingBans);
    }
    
    // Merge card categories
    if (backupConfig.cardCategories) {
      Object.keys(backupConfig.cardCategories).forEach(category => {
        if (!this.config.cardCategories[category]) {
          // New category: add it
          this.config.cardCategories[category] = backupConfig.cardCategories[category];
        } else {
          // Existing category: merge cards
          const existingCards = new Set(
            this.config.cardCategories[category].map(card => 
              typeof card === 'string' ? card.toLowerCase() : card.name.toLowerCase()
            )
          );
          
          backupConfig.cardCategories[category].forEach(card => {
            const cardName = typeof card === 'string' ? card.toLowerCase() : card.name.toLowerCase();
            if (!existingCards.has(cardName)) {
              this.config.cardCategories[category].push(card);
            }
          });
        }
      });
    }
  }

  /**
   * Restore configuration from a JSON file
   * @param {File} file - JSON file to restore from
   * @param {boolean} merge - If true, merge with existing config; if false, replace entirely
   * @returns {Promise<void>}
   */
  async restoreFromFile(file, merge = false) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const backup = JSON.parse(event.target.result);
          this.importBackup(backup, merge);
          resolve();
        } catch (error) {
          reject(new Error(`Failed to parse backup file: ${error.message}`));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read backup file'));
      };
      
      reader.readAsText(file);
    });
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
