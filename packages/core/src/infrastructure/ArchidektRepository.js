import { Deck } from '../domain/Deck.js';
import { HttpClient } from './HttpClient.js';

/**
 * ArchidektAdapter
 * Handles fetching and mapping deck data from Archidekt API to domain model
 */
export class ArchidektAdapter {
  constructor(httpClient = null) {
    this.httpClient = httpClient || new HttpClient();
  }
  /**
   * Fetch a deck from Archidekt by URL
   * @param {string} url - Archidekt deck URL
   * @returns {Promise<Deck>} - Domain Deck entity
   */
  async fetchDeck(url) {
    const deckId = this.extractDeckId(url);
    const apiUrl = `https://archidekt.com/api/decks/${deckId}/`;

    try {
      const data = await this.httpClient.get(apiUrl);
      return this.mapToDomain(data);
    } catch (error) {
      throw new Error(`Failed to fetch Archidekt deck: ${error.message}`);
    }
  }

  /**
   * Extract deck ID from Archidekt URL
   * @param {string} url - Archidekt deck URL
   * @returns {string} - Deck ID
   */
  extractDeckId(url) {
    const deckId = url.split('/decks/')[1]?.split('/')[0];
    if (!deckId) {
      throw new Error('Invalid Archidekt URL');
    }
    return deckId;
  }

  /**
   * Map Archidekt API response to Deck domain entity
   * @param {Object} archidektData - Raw data from Archidekt API
   * @returns {Deck} - Domain Deck entity
   */
  mapToDomain(archidektData) {
    const commanders = [];
    const cards = [];

    // Extract cards
    if (archidektData.cards) {
      for (const card of archidektData.cards) {
        const cardName = card.card?.oracleCard?.name;
        if (!cardName) continue;

        // Check if it's a commander
        if (card.categories && card.categories.includes('Commander')) {
          commanders.push(cardName);
        } else {
          cards.push(cardName);
        }
      }
    }

    return new Deck({
      name: archidektData.name,
      commanders,
      cards,
      source: 'Archidekt',
      sourceBracket: null,
    });
  }

  /**
   * Check if a URL is an Archidekt URL
   * @param {string} url - URL to check
   * @returns {boolean}
   */
  static canHandle(url) {
    return url.includes('archidekt.com');
  }
}
