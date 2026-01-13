import configManager from './configManager';

class BracketAnalyzer {
  analyzeDeck(deck) {
    const allCards = [...deck.commanders, ...deck.cards];
    const globalBans = configManager.getGlobalBans();
    const categories = configManager.getCardCategories();
    
    // Check for globally banned cards
    const bannedCardsFound = allCards.filter(card => 
      globalBans.some(banned => banned.toLowerCase() === card.toLowerCase())
    );
    
    if (bannedCardsFound.length > 0) {
      return {
        bracket: null,
        reason: 'Contains globally banned cards',
        bannedCards: bannedCardsFound,
        details: null
      };
    }
    
    // Count cards by category
    const counts = {
      tutors: 0,
      twoCardCombos: 0,
      gameChangers: 0,
      landDenial: 0
    };
    
    const foundCards = {
      tutors: [],
      twoCardCombos: [],
      gameChangers: [],
      landDenial: []
    };
    
    for (const card of allCards) {
      for (const [category, categoryCards] of Object.entries(categories)) {
        if (categoryCards.some(catCard => catCard.toLowerCase() === card.toLowerCase())) {
          counts[category]++;
          foundCards[category].push(card);
        }
      }
    }
    
    // Find the highest bracket the deck fits into
    const brackets = configManager.getBrackets();
    const sortedBracketIds = Object.keys(brackets).map(Number).sort((a, b) => a - b);
    
    let fittingBracket = null;
    let violations = [];
    
    for (const bracketId of sortedBracketIds) {
      const bracket = brackets[bracketId];
      const currentViolations = [];
      
      // Check bracket-specific bans
      if (bracket.bannedCards) {
        const bracketBannedFound = allCards.filter(card =>
          bracket.bannedCards.some(banned => banned.toLowerCase() === card.toLowerCase())
        );
        if (bracketBannedFound.length > 0) {
          currentViolations.push(`Banned in bracket ${bracketId}: ${bracketBannedFound.join(', ')}`);
          continue;
        }
      }
      
      // Check limits
      let limitsOk = true;
      for (const [category, limit] of Object.entries(bracket.limits)) {
        if (counts[category] > limit) {
          currentViolations.push(
            `${category}: ${counts[category]} (limit: ${limit === Infinity ? 'unlimited' : limit})`
          );
          limitsOk = false;
        }
      }
      
      if (limitsOk) {
        fittingBracket = bracketId;
      } else {
        violations = currentViolations;
      }
    }
    
    if (fittingBracket === null) {
      return {
        bracket: null,
        reason: 'Exceeds all bracket limits',
        violations,
        details: { counts, foundCards }
      };
    }
    
    return {
      bracket: fittingBracket,
      bracketName: brackets[fittingBracket].name,
      reason: 'Fits bracket requirements',
      details: { counts, foundCards }
    };
  }
}

export default new BracketAnalyzer();
