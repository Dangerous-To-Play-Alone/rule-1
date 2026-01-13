/**
 * BracketAnalysisResult domain entity
 * Represents the result of analyzing a deck against bracket rules
 */
export class BracketAnalysisResult {
  constructor({
    bracket,
    bracketName = null,
    reason,
    bannedCards = [],
    violations = [],
    cardCounts = null,
    foundCards = null,
  }) {
    this.bracket = bracket; // null if no valid bracket
    this.bracketName = bracketName;
    this.reason = reason;
    this.bannedCards = bannedCards;
    this.violations = violations;
    this.cardCounts = cardCounts; // { tutors, twoCardCombos, gameChangers, landDenial }
    this.foundCards = foundCards; // { tutors: [], twoCardCombos: [], ... }
  }

  /**
   * Check if the deck fits in a valid bracket
   */
  isValid() {
    return this.bracket !== null;
  }

  /**
   * Check if the deck has any banned cards
   */
  hasBannedCards() {
    return this.bannedCards.length > 0;
  }

  /**
   * Check if the deck has any violations
   */
  hasViolations() {
    return this.violations.length > 0;
  }

  /**
   * Get total count of flagged cards across all categories
   */
  getTotalFlaggedCards() {
    if (!this.cardCounts) return 0;
    return Object.values(this.cardCounts).reduce((sum, count) => sum + count, 0);
  }
}
