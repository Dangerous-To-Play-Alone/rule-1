import { HttpClient } from '../infrastructure/HttpClient.js';

/**
 * FetchDefaultBracketsUseCase
 * Fetches default MTG Commander bracket data from CommanderSpellbook API
 *
 * This use case fetches:
 * 1. Global Commander bans (cards banned in Commander format)
 * 2. Card categories:
 *    - Tutors: Cards that search library for specific cards
 *    - Two Card Combos: Cards that form 2-card infinite combos (high-power brackets)
 *    - Game Changers: High-impact cards that drastically affect gameplay
 *    - Land Denial: Cards that destroy or prevent lands
 *
 * @param {HttpClient} httpClient - Optional HTTP client for platform-specific needs (e.g., CORS proxy)
 */
export class FetchDefaultBracketsUseCase {
  constructor(httpClient = null) {
    this.httpClient = httpClient || new HttpClient();
  }

  /**
   * Execute the use case to fetch all default bracket information
   * @returns {Promise<Object>} Object containing globalBans and cardCategories
   */
  async execute() {
    try {
      // Fetch all data in parallel
      const [globalBans, tutors, twoCardCombos, gameChangers, landDenial] = await Promise.all([
        this.fetchGlobalBans(),
        this.fetchTutors(),
        this.fetchTwoCardCombos(),
        this.fetchGameChangers(),
        this.fetchLandDenial()
      ]);

      return {
        globalBans,
        cardCategories: {
          tutors,
          twoCardCombos,
          gameChangers,
          landDenial
        }
      };
    } catch (error) {
      throw new Error(`Failed to fetch default brackets: ${error.message}`);
    }
  }

  /**
   * Fetch cards that are banned in Commander format
   * @returns {Promise<string[]>} Array of banned card names
   */
  async fetchGlobalBans() {
    try {
      const bannedCards = [];
      let offset = 0;
      const limit = 100;
      let hasMore = true;

      while (hasMore) {
        const url = `https://backend.commanderspellbook.com/cards?legalities__commander=false&limit=${limit}&offset=${offset}`;
        const data = await this.httpClient.get(url);
        
        // Extract card names
        const cardNames = data.results.map(card => card.name);
        bannedCards.push(...cardNames);

        // Check if there are more results
        hasMore = data.next !== null;
        offset += limit;
      }

      return bannedCards;
    } catch (error) {
      throw new Error(`Failed to fetch global bans: ${error.message}`);
    }
  }

  /**
   * Fetch cards categorized as tutors
   * @returns {Promise<string[]>} Array of tutor card names
   */
  async fetchTutors() {
    try {
      const tutorCards = [];
      let offset = 0;
      const limit = 100;
      let hasMore = true;

      while (hasMore) {
        const url = `https://backend.commanderspellbook.com/cards?tutor=true&legalities__commander=true&limit=${limit}&offset=${offset}`;
        const data = await this.httpClient.get(url);
        
        const cardNames = data.results.map(card => card.name);
        tutorCards.push(...cardNames);

        hasMore = data.next !== null;
        offset += limit;
      }

      return tutorCards;
    } catch (error) {
      throw new Error(`Failed to fetch tutors: ${error.message}`);
    }
  }

  /**
   * Fetch cards that are part of powerful 2-card combos (Ruthless/Spicy brackets 4-5)
   * @returns {Promise<string[]>} Array of combo card names
   */
  async fetchTwoCardCombos() {
    try {
      const comboCards = new Set();
      let offset = 0;
      const limit = 100;
      let hasMore = true;

      // Fetch 2-card combos from high-power brackets (4=Ruthless, 5=Spicy)
      while (hasMore) {
        const url = `https://backend.commanderspellbook.com/variants?card_count=2&commander_bracket=4,5&limit=${limit}&offset=${offset}`;
        const data = await this.httpClient.get(url);
        
        // Extract unique card names from combos
        data.results.forEach(variant => {
          variant.uses.forEach(use => {
            if (use.card && use.card.name) {
              comboCards.add(use.card.name);
            }
          });
        });

        hasMore = data.next !== null;
        offset += limit;
      }

      return Array.from(comboCards);
    } catch (error) {
      throw new Error(`Failed to fetch two-card combos: ${error.message}`);
    }
  }

  /**
   * Fetch cards categorized as game changers
   * @returns {Promise<string[]>} Array of game changer card names
   */
  async fetchGameChangers() {
    try {
      const gameChangerCards = [];
      let offset = 0;
      const limit = 100;
      let hasMore = true;

      while (hasMore) {
        const url = `https://backend.commanderspellbook.com/cards?gameChanger=true&legalities__commander=true&limit=${limit}&offset=${offset}`;
        const data = await this.httpClient.get(url);
        
        const cardNames = data.results.map(card => card.name);
        gameChangerCards.push(...cardNames);

        hasMore = data.next !== null;
        offset += limit;
      }

      return gameChangerCards;
    } catch (error) {
      throw new Error(`Failed to fetch game changers: ${error.message}`);
    }
  }

  /**
   * Fetch cards that provide mass land denial
   * @returns {Promise<string[]>} Array of land denial card names
   */
  async fetchLandDenial() {
    try {
      const landDenialCards = [];
      let offset = 0;
      const limit = 100;
      let hasMore = true;

      while (hasMore) {
        const url = `https://backend.commanderspellbook.com/cards?massLandDenial=true&legalities__commander=true&limit=${limit}&offset=${offset}`;
        const data = await this.httpClient.get(url);
        
        const cardNames = data.results.map(card => card.name);
        landDenialCards.push(...cardNames);

        hasMore = data.next !== null;
        offset += limit;
      }

      return landDenialCards;
    } catch (error) {
      throw new Error(`Failed to fetch land denial cards: ${error.message}`);
    }
  }
}
