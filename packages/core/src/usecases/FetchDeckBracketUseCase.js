import { MoxfieldAdapter } from '../infrastructure/MoxfieldAdapter.js';
import { ArchidektAdapter } from '../infrastructure/ArchidektAdapter.js';
import { BracketAnalyzer } from '../infrastructure/BracketAnalyzer.js';
import { HttpClient } from '../infrastructure/HttpClient.js';

/**
 * FetchDeckBracketUseCase
 * Main use case for fetching a deck and analyzing its bracket
 * 
 * This use case orchestrates:
 * 1. Determining the deck provider from URL
 * 2. Fetching the deck via the appropriate adapter
 * 3. Analyzing the deck against bracket configuration
 * 4. Returning a complete analysis result
 * 
 * @param {HttpClient} httpClient - Optional HTTP client for platform-specific needs (e.g., CORS proxy)
 */
export class FetchDeckBracketUseCase {
  constructor(httpClient = null) {
    const client = httpClient || new HttpClient();
    this.moxfieldAdapter = new MoxfieldAdapter(client);
    this.archidektAdapter = new ArchidektAdapter(client);
    this.bracketAnalyzer = new BracketAnalyzer();
  }

  /**
   * Execute the use case
   * @param {string} url - Deck URL from Moxfield or Archidekt
   * @param {Object} config - Configuration object with brackets, globalBans, and cardCategories
   * @returns {Promise<{deck: Deck, analysis: BracketAnalysisResult}>}
   */
  async execute(url, config) {
    // Validate inputs
    if (!url || typeof url !== 'string') {
      throw new Error('Invalid URL provided');
    }

    if (!config || !config.brackets || !config.globalBans || !config.cardCategories) {
      throw new Error('Invalid configuration provided. Must include brackets, globalBans, and cardCategories');
    }

    // Fetch deck from appropriate provider
    const deck = await this.fetchDeck(url);

    // Analyze deck against bracket rules
    const analysis = this.bracketAnalyzer.analyze(deck, config);

    return {
      deck,
      analysis,
    };
  }

  /**
   * Fetch deck from the appropriate provider
   * @private
   * @param {string} url - Deck URL
   * @returns {Promise<Deck>}
   */
  async fetchDeck(url) {
    if (MoxfieldAdapter.canHandle(url)) {
      return await this.moxfieldAdapter.fetchDeck(url);
    } else if (ArchidektAdapter.canHandle(url)) {
      return await this.archidektAdapter.fetchDeck(url);
    } else {
      throw new Error('Unsupported deck URL. Only Moxfield and Archidekt are supported.');
    }
  }
}
