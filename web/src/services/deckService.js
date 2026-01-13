/**
 * DeckService
 * Wrapper service for using the @rulezero/core library in React web app
 */

import { FetchDeckBracketUseCase, CorsProxyHttpClient } from '@rulezero/core';
import configManager from './configManager';

class DeckService {
  constructor() {
    // Use CORS proxy for browser compatibility
    const httpClient = new CorsProxyHttpClient();
    this.useCase = new FetchDeckBracketUseCase(httpClient);
  }

  /**
   * Fetch and analyze a deck from a URL
   * @param {string} url - Deck URL from Moxfield or Archidekt
   * @returns {Promise<{deck: Object, analysis: Object}>}
   */
  async fetchAndAnalyzeDeck(url) {
    // Get configuration from configManager
    const config = {
      brackets: configManager.getBrackets(),
      globalBans: configManager.getGlobalBans(),
      cardCategories: configManager.getCardCategories(),
    };

    // Execute use case
    const result = await this.useCase.execute(url, config);

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
}

export default new DeckService();
