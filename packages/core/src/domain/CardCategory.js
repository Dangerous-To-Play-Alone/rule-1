/**
 * CardCategory value object
 * Defines the categories used for bracket analysis
 * Supports both built-in and custom categories
 */
export class CardCategory {
  // Built-in categories (always present)
  static TUTORS = 'tutors';
  static TWO_CARD_COMBOS = 'twoCardCombos';
  static GAME_CHANGERS = 'gameChangers';
  static LAND_DENIAL = 'landDenial';

  static BUILT_IN_CATEGORIES = [
    CardCategory.TUTORS,
    CardCategory.TWO_CARD_COMBOS,
    CardCategory.GAME_CHANGERS,
    CardCategory.LAND_DENIAL,
  ];

  // Deprecated: use getCategories() instead
  static ALL_CATEGORIES = CardCategory.BUILT_IN_CATEGORIES;

  /**
   * Get human-readable name for a category
   */
  static formatCategoryName(category) {
    return category
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase());
  }

  /**
   * Get all categories from configuration
   * @param {Object} config - Configuration object with cardCategories
   * @returns {string[]} - Array of all category keys
   */
  static getCategories(config) {
    if (!config || !config.cardCategories) {
      return CardCategory.BUILT_IN_CATEGORIES;
    }
    return Object.keys(config.cardCategories);
  }

  /**
   * Validate if a string is a valid category
   * @param {string} category - Category to validate
   * @param {Object} config - Optional configuration to check custom categories
   */
  static isValid(category, config = null) {
    if (CardCategory.BUILT_IN_CATEGORIES.includes(category)) {
      return true;
    }
    if (config && config.cardCategories) {
      return category in config.cardCategories;
    }
    return CardCategory.BUILT_IN_CATEGORIES.includes(category);
  }

  /**
   * Create an empty card counts object
   */
  static createEmptyCounts() {
    return {
      [CardCategory.TUTORS]: 0,
      [CardCategory.TWO_CARD_COMBOS]: 0,
      [CardCategory.GAME_CHANGERS]: 0,
      [CardCategory.LAND_DENIAL]: 0,
    };
  }

  /**
   * Create an empty found cards object
   * @param {Object} config - Optional configuration for custom categories
   */
  static createEmptyFoundCards(config = null) {
    const foundCards = {
      [CardCategory.TUTORS]: [],
      [CardCategory.TWO_CARD_COMBOS]: [],
      [CardCategory.GAME_CHANGERS]: [],
      [CardCategory.LAND_DENIAL]: [],
    };

    // Add custom categories
    if (config && config.cardCategories) {
      Object.keys(config.cardCategories).forEach(category => {
        if (!(category in foundCards)) {
          foundCards[category] = [];
        }
      });
    }

    return foundCards;
  }

  /**
   * Check if a category is built-in (not custom)
   */
  static isBuiltIn(category) {
    return CardCategory.BUILT_IN_CATEGORIES.includes(category);
  }

  /**
   * Get display name for a category (convert camelCase to Title Case)
   */
  static toCamelCase(name) {
    return name
      .replace(/[^a-zA-Z0-9]+(.)/g, (match, chr) => chr.toUpperCase())
      .replace(/^./, str => str.toLowerCase());
  }
}
