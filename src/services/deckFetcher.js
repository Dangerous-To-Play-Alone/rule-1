const axios = require('axios');

class DeckFetcher {
  async fetchDeck(url) {
    if (url.includes('moxfield.com')) {
      return this.fetchMoxfieldDeck(url);
    } else if (url.includes('archidekt.com')) {
      return this.fetchArchidektDeck(url);
    } else {
      throw new Error('Unsupported deck URL. Only Moxfield and Archidekt are supported.');
    }
  }

  async fetchMoxfieldDeck(url) {
    try {
      // Extract deck ID from URL
      const deckId = url.split('/decks/')[1]?.split(/[?#]/)[0];
      if (!deckId) {
        throw new Error('Invalid Moxfield URL');
      }

      // Moxfield API endpoint
      const apiUrl = `https://api2.moxfield.com/v3/decks/all/${deckId}`;
      const response = await axios.get(apiUrl);
      
      const deck = response.data;
      const cards = [];
      
      // Extract commander(s)
      const commanders = [];
      if (deck.commanders) {
        for (const card of Object.values(deck.commanders)) {
          commanders.push(card.card.name);
        }
      }
      
      // Extract all cards from mainboard
      if (deck.mainboard) {
        for (const card of Object.values(deck.mainboard)) {
          cards.push(card.card.name);
        }
      }
      
      return {
        name: deck.name,
        commanders,
        cards,
        source: 'Moxfield'
      };
    } catch (error) {
      console.error('Error fetching Moxfield deck:', error.message);
      throw new Error(`Failed to fetch Moxfield deck: ${error.message}`);
    }
  }

  async fetchArchidektDeck(url) {
    try {
      // Extract deck ID from URL
      const deckId = url.split('/decks/')[1]?.split('/')[0];
      if (!deckId) {
        throw new Error('Invalid Archidekt URL');
      }

      // Archidekt API endpoint
      const apiUrl = `https://archidekt.com/api/decks/${deckId}/`;
      const response = await axios.get(apiUrl);
      
      const deck = response.data;
      const cards = [];
      const commanders = [];
      
      // Extract cards
      if (deck.cards) {
        for (const card of deck.cards) {
          const cardName = card.card.oracleCard.name;
          
          // Check if it's a commander
          if (card.categories && card.categories.includes('Commander')) {
            commanders.push(cardName);
          } else {
            cards.push(cardName);
          }
        }
      }
      
      return {
        name: deck.name,
        commanders,
        cards,
        source: 'Archidekt'
      };
    } catch (error) {
      console.error('Error fetching Archidekt deck:', error.message);
      throw new Error(`Failed to fetch Archidekt deck: ${error.message}`);
    }
  }
}

module.exports = new DeckFetcher();
