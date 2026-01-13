/**
 * Deck domain entity
 * Represents a Commander deck with its cards and metadata
 */
export class Deck {
  constructor({ name, commanders, cards, source, sourceBracket = null }) {
    this.name = name;
    this.commanders = commanders || [];
    this.cards = cards || [];
    this.source = source;
    this.sourceBracket = sourceBracket;
  }

  /**
   * Get all cards including commanders
   */
  getAllCards() {
    return [...this.commanders, ...this.cards];
  }

  /**
   * Check if deck contains a specific card (case-insensitive)
   */
  hasCard(cardName) {
    const normalizedName = cardName.toLowerCase();
    return this.getAllCards().some(
      card => card.toLowerCase() === normalizedName
    );
  }

  /**
   * Get card count (excluding commanders)
   */
  getCardCount() {
    return this.cards.length;
  }

  /**
   * Get commander count
   */
  getCommanderCount() {
    return this.commanders.length;
  }
}
