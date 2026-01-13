import { HttpClient } from './HttpClient.js';
import { Card } from '../domain/Card.js';

/**
 * ScryfallAdapter
 * Handles card searches and lookups using the Scryfall API
 */
export class ScryfallAdapter {
  constructor(httpClient = null) {
    this.httpClient = httpClient || new HttpClient();
    this.baseUrl = 'https://api.scryfall.com';
  }

  /**
   * Search for cards by name
   * @param {string} query - Search query
   * @returns {Promise<Card[]>} - Array of matching cards
   */
  async searchCards(query) {
    if (!query || query.trim().length === 0) {
      return [];
    }

    try {
      const url = `${this.baseUrl}/cards/search?q=${encodeURIComponent(query)}`;
      const data = await this.httpClient.get(url);
      
      return data.data.slice(0, 20).map(cardData => new Card({
        id: cardData.id,
        name: cardData.name,
        scryfallId: cardData.id
      }));
    } catch (error) {
      if (error.message.includes('404')) {
        return []; // No cards found
      }
      throw new Error(`Failed to search Scryfall: ${error.message}`);
    }
  }

  /**
   * Get card by exact name
   * @param {string} name - Exact card name
   * @returns {Promise<Card>} - Card with Scryfall ID
   */
  async getCardByName(name) {
    try {
      const url = `${this.baseUrl}/cards/named?exact=${encodeURIComponent(name)}`;
      const data = await this.httpClient.get(url);
      
      return new Card({
        id: data.id,
        name: data.name,
        scryfallId: data.id
      });
    } catch (error) {
      throw new Error(`Failed to find card "${name}": ${error.message}`);
    }
  }

  /**
   * Get card by Scryfall ID
   * @param {string} id - Scryfall ID
   * @returns {Promise<Card>} - Card data
   */
  async getCardById(id) {
    try {
      const url = `${this.baseUrl}/cards/${id}`;
      const data = await this.httpClient.get(url);
      
      return new Card({
        id: data.id,
        name: data.name,
        scryfallId: data.id
      });
    } catch (error) {
      throw new Error(`Failed to find card with ID "${id}": ${error.message}`);
    }
  }

  /**
   * Autocomplete card names (fuzzy search)
   * @param {string} query - Partial card name
   * @returns {Promise<string[]>} - Array of card name suggestions
   */
  async autocomplete(query) {
    if (!query || query.trim().length < 2) {
      return [];
    }

    try {
      const url = `${this.baseUrl}/cards/autocomplete?q=${encodeURIComponent(query)}`;
      const data = await this.httpClient.get(url);
      
      return data.data || [];
    } catch (error) {
      return [];
    }
  }

  /**
   * Enrich card names with Scryfall IDs
   * Converts legacy string-based card names to Card objects with IDs
   * @param {string[]} cardNames - Array of card names
   * @returns {Promise<Card[]>} - Array of Card objects with Scryfall IDs
   */
  async enrichCards(cardNames) {
    const cards = [];
    
    for (const name of cardNames) {
      try {
        const card = await this.getCardByName(name);
        cards.push(card);
      } catch (error) {
        // If card not found, store as name-only (legacy format)
        console.warn(`Could not find Scryfall ID for card: ${name}`);
        cards.push(Card.fromName(name));
      }
    }
    
    return cards;
  }
}
