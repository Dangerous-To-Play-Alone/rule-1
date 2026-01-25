import { Deck } from '../domain/Deck.js';
import { HttpClient } from './HttpClient.js';

/**
 * MoxfieldAdapter
 * Handles fetching and mapping deck data from Moxfield API to domain model
 */
export class BracketRepository {
  constructor(httpClient = null) {
    this.httpClient = httpClient || new HttpClient();
  }
}
