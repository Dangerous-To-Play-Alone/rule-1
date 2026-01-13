import { BracketAnalysisResult } from '../domain/BracketAnalysisResult.js';
import { CardCategory } from '../domain/CardCategory.js';

/**
 * BracketAnalyzer
 * Analyzes decks against bracket configuration and determines bracket classification
 */
export class BracketAnalyzer {
  /**
   * Analyze a deck against bracket rules
   * @param {Deck} deck - Domain Deck entity
   * @param {Object} config - Configuration object with brackets, globalBans, and cardCategories
   * @returns {BracketAnalysisResult} - Analysis result
   */
  analyze(deck, config) {
    const allCards = deck.getAllCards();
    const globalBans = config.globalBans || [];
    const categories = config.cardCategories || {};

    // Check for globally banned cards
    const bannedCardsFound = this.findBannedCards(allCards, globalBans);
    if (bannedCardsFound.length > 0) {
      return new BracketAnalysisResult({
        bracket: null,
        reason: 'Contains globally banned cards',
        bannedCards: bannedCardsFound,
      });
    }

    // Count cards by category
    const { counts, foundCards } = this.categorizeCards(allCards, categories, config);

    // Find the highest bracket the deck fits into
    const { fittingBracket, violations } = this.findFittingBracket(
      allCards,
      counts,
      config.brackets || {}
    );

    if (fittingBracket === null) {
      return new BracketAnalysisResult({
        bracket: null,
        reason: 'Exceeds all bracket limits',
        violations,
        cardCounts: counts,
        foundCards,
      });
    }

    const bracket = config.brackets[fittingBracket];
    return new BracketAnalysisResult({
      bracket: fittingBracket,
      bracketName: bracket.name,
      reason: 'Fits bracket requirements',
      cardCounts: counts,
      foundCards,
    });
  }

  /**
   * Find banned cards in the deck
   * @private
   */
  findBannedCards(cards, bannedList) {
    return cards.filter(card =>
      bannedList.some(banned => banned.toLowerCase() === card.toLowerCase())
    );
  }

  /**
   * Categorize and count cards (supports dynamic categories)
   * @private
   */
  categorizeCards(cards, categories, config) {
    // Initialize counts and foundCards for all categories in config
    const counts = {};
    const foundCards = {};
    
    Object.keys(categories).forEach(category => {
      counts[category] = 0;
      foundCards[category] = [];
    });

    // Categorize cards
    for (const card of cards) {
      for (const [category, categoryCards] of Object.entries(categories)) {
        // Support both string (legacy) and object (Scryfall ID) formats
        const hasCard = categoryCards.some(catCard => {
          if (typeof catCard === 'string') {
            return catCard.toLowerCase() === card.toLowerCase();
          }
          if (typeof catCard === 'object' && catCard.name) {
            return catCard.name.toLowerCase() === card.toLowerCase();
          }
          return false;
        });

        if (hasCard) {
          counts[category]++;
          foundCards[category].push(card);
        }
      }
    }

    return { counts, foundCards };
  }


  /**
   * Find the fitting bracket for the deck
   * @private
   */
  findFittingBracket(allCards, counts, brackets) {
    const sortedBracketIds = Object.keys(brackets)
      .map(Number)
      .sort((a, b) => a - b);

    let fittingBracket = null;
    let violations = [];

    for (const bracketId of sortedBracketIds) {
      const bracket = brackets[bracketId];
      const currentViolations = [];

      // Check bracket-specific bans
      if (bracket.bannedCards && bracket.bannedCards.length > 0) {
        const bracketBannedFound = this.findBannedCards(allCards, bracket.bannedCards);
        if (bracketBannedFound.length > 0) {
          currentViolations.push(
            `Banned in bracket ${bracketId}: ${bracketBannedFound.join(', ')}`
          );
          continue;
        }
      }

      // Check limits for all categories
      let limitsOk = true;
      for (const [category, limit] of Object.entries(bracket.limits)) {
        // Check if category exists in counts
        const count = counts[category] || 0;
        
        if (count > limit) {
          currentViolations.push(
            `${category}: ${count} (limit: ${limit === Infinity ? 'unlimited' : limit})`
          );
          limitsOk = false;
        }
      }

      if (limitsOk) {
        fittingBracket = bracketId;
      } else {
        violations = currentViolations;
      }
    }

    return { fittingBracket, violations };
  }
}
