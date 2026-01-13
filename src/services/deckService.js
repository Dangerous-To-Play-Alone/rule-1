/**
 * DeckService
 * Wrapper service for using the @rulezero/core library in CommonJS Discord bot
 * 
 * This service provides a bridge between the CommonJS Discord bot and
 * the ES module shared library.
 */

const configManager = require('../config/configManager');

// Dynamic import for ES module
let coreModule = null;

async function loadCore() {
  if (!coreModule) {
    coreModule = await import('@rulezero/core');
  }
  return coreModule;
}

class DeckService {
  /**
   * Fetch and analyze a deck from a URL
   * @param {string} url - Deck URL from Moxfield or Archidekt
   * @returns {Promise<{deck: Object, analysis: Object}>}
   */
  async fetchAndAnalyzeDeck(url) {
    const core = await loadCore();
    const useCase = new core.FetchDeckBracketUseCase();
    
    // Get configuration from configManager
    const config = {
      brackets: configManager.getBrackets(),
      globalBans: configManager.getGlobalBans(),
      cardCategories: configManager.getCardCategories(),
    };

    // Execute use case
    const result = await useCase.execute(url, config);
    
    // Convert domain objects to plain objects for compatibility
    return {
      deck: {
        name: result.deck.name,
        commanders: result.deck.commanders,
        cards: result.deck.cards,
        source: result.deck.source,
        sourceBracket: result.deck.sourceBracket,
      },
      analysis: {
        bracket: result.analysis.bracket,
        bracketName: result.analysis.bracketName,
        reason: result.analysis.reason,
        bannedCards: result.analysis.bannedCards,
        violations: result.analysis.violations,
        details: {
          counts: result.analysis.cardCounts,
          foundCards: result.analysis.foundCards,
        },
      },
    };
  }

  /**
   * Format analysis result for Discord display
   * @param {Object} result - Result from fetchAndAnalyzeDeck
   * @returns {string} Formatted message
   */
  formatAnalysisResult(result) {
    const { deck, analysis } = result;
    
    let message = `**Deck: ${deck.name}**\n`;
    message += `**Commander(s):** ${deck.commanders.join(', ')}\n`;
    message += `**Source:** ${deck.source}\n\n`;
    
    if (analysis.bracket !== null) {
      message += `✅ **Bracket ${analysis.bracket}: ${analysis.bracketName}**\n\n`;
      
      if (analysis.details) {
        message += `**Card Counts:**\n`;
        message += `• Tutors: ${analysis.details.counts.tutors}\n`;
        message += `• Two-Card Combos: ${analysis.details.counts.twoCardCombos}\n`;
        message += `• Game Changers: ${analysis.details.counts.gameChangers}\n`;
        message += `• Land Denial: ${analysis.details.counts.landDenial}\n`;
        
        // Show found cards if any
        for (const [category, cards] of Object.entries(analysis.details.foundCards)) {
          if (cards.length > 0) {
            message += `\n**${this.formatCategoryName(category)} found:**\n`;
            message += cards.map(card => `• ${card}`).join('\n') + '\n';
          }
        }
      }
    } else {
      message += `❌ **No Valid Bracket**\n`;
      message += `**Reason:** ${analysis.reason}\n`;
      
      if (analysis.bannedCards.length > 0) {
        message += `\n**Banned Cards:**\n`;
        message += analysis.bannedCards.map(card => `• ${card}`).join('\n');
      }
      
      if (analysis.violations.length > 0) {
        message += `\n**Violations:**\n`;
        message += analysis.violations.map(v => `• ${v}`).join('\n');
      }
      
      if (analysis.details) {
        message += `\n**Card Counts:**\n`;
        message += `• Tutors: ${analysis.details.counts.tutors}\n`;
        message += `• Two-Card Combos: ${analysis.details.counts.twoCardCombos}\n`;
        message += `• Game Changers: ${analysis.details.counts.gameChangers}\n`;
        message += `• Land Denial: ${analysis.details.counts.landDenial}\n`;
      }
    }
    
    return message;
  }

  formatCategoryName(category) {
    return category
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase());
  }
}

module.exports = new DeckService();
