import { Deck } from '../domain/Deck.js';
import { HttpClient } from './HttpClient.js';

/**
 * MoxfieldAdapter
 * Handles fetching and mapping deck data from Moxfield API to domain model
 */
export class MoxfieldRepository {
  constructor(httpClient = null) {
    this.httpClient = httpClient || new HttpClient();
  }
  /**
   * Fetch a deck from Moxfield by URL
   * @param {string} url - Moxfield deck URL
   * @returns {Promise<Deck>} - Domain Deck entity
   */
  async fetchDeck(url) {
    const deckId = this.extractDeckId(url);
    const apiUrl = `https://api.moxfield.com/v2/decks/all/${deckId}`;

    try {
      const data = await this.httpClient.get(apiUrl);
      return this.mapToDomain(data);
    } catch (error) {
      throw new Error(`Failed to fetch Moxfield deck: ${error.message}`);
    }
  }

  /**
   * Extract deck ID from Moxfield URL
   * @param {string} url - Moxfield deck URL
   * @returns {string} - Deck ID
   */
  extractDeckId(url) {
    const deckId = url.split('/decks/')[1]?.split(/[?#]/)[0];
    if (!deckId) {
      throw new Error('Invalid Moxfield URL');
    }
    return deckId;
  }

  /**
   * Map Moxfield API response to Deck domain entity
   * @param {Object} moxfieldData - Raw data from Moxfield API
   * @returns {Deck} - Domain Deck entity
   */
  mapToDomain(moxfieldData) {
    const commanders = [];
    const cards = [];

    // Extract commander(s)
    if (moxfieldData.main?.name) {
      commanders.push(moxfieldData.main.name);
    }

    // Extract all cards from mainboard
    if (moxfieldData.mainboard) {
      for (const card of Object.values(moxfieldData.mainboard)) {
        if (card.card?.name) {
          cards.push(card.card.name);
        }
      }
    }

    return new Deck({
      name: moxfieldData.name,
      commanders,
      cards,
      source: 'Moxfield',
      sourceBracket: moxfieldData.bracket || null,
    });
  }

  /**
   * Check if a URL is a Moxfield URL
   * @param {string} url - URL to check
   * @returns {boolean}
   */
  static canHandle(url) {
    return url.includes('moxfield.com');
  }
}
