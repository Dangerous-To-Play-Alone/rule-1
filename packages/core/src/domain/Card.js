/**
 * Card domain entity
 * Represents a Magic: The Gathering card with Scryfall ID and name
 */
export class Card {
  constructor({ id, name, scryfallId = null }) {
    // For backward compatibility, support both name-only and ID-based cards
    this.id = id || scryfallId;
    this.name = name;
    this.scryfallId = scryfallId || id;
  }

  /**
   * Check if this card matches another by ID or name (case-insensitive)
   */
  matches(other) {
    // If we have Scryfall IDs, use those for comparison (most reliable)
    if (this.scryfallId && other.scryfallId) {
      return this.scryfallId === other.scryfallId;
    }
    
    // If either has a Scryfall ID and the other has that as ID, match
    if (this.scryfallId && other.id === this.scryfallId) {
      return true;
    }
    if (other.scryfallId && this.id === other.scryfallId) {
      return true;
    }
    
    // Fall back to name comparison (case-insensitive)
    if (this.name && other.name) {
      return this.name.toLowerCase() === other.name.toLowerCase();
    }
    
    // Check if name matches the ID/scryfallId (for legacy string-only data)
    if (typeof other === 'string') {
      return this.name.toLowerCase() === other.toLowerCase();
    }
    
    return false;
  }

  /**
   * Get a normalized representation for storage
   */
  toStorage() {
    return {
      id: this.scryfallId || this.id,
      name: this.name
    };
  }

  /**
   * Create from legacy string format (card name only)
   */
  static fromName(name) {
    return new Card({ name, id: null, scryfallId: null });
  }

  /**
   * Create from storage format
   */
  static fromStorage(data) {
    if (typeof data === 'string') {
      // Legacy format: just card name
      return Card.fromName(data);
    }
    return new Card({
      id: data.id || data.scryfallId,
      name: data.name,
      scryfallId: data.scryfallId || data.id
    });
  }
}
