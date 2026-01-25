import React, { useState, useEffect } from 'react';
import { ScryfallRepository, CorsProxyHttpClient, CardCategory } from '@rulezero/core';
import configManager from '../services/configManager';
import './CardCategoryManager.css';

function CardCategoryManager({ onConfigChange }) {
  const [selectedCategory, setSelectedCategory] = useState(CardCategory.TUTORS);
  const [cards, setCards] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [scryfallAdapter] = useState(() => new ScryfallRepository(new CorsProxyHttpClient()));

  // Load categories on mount
  useEffect(() => {
    loadCategories();
  }, []);

  // Load cards for selected category
  useEffect(() => {
    loadCards();
  }, [selectedCategory]);

  const loadCategories = () => {
    const allCategories = configManager.getCardCategories();
    setCategories(Object.keys(allCategories));
  };

  const loadCards = () => {
    const allCategories = configManager.getCardCategories();
    const categoryCards = allCategories[selectedCategory] || [];
    setCards(categoryCards);
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      alert('Please enter a category name');
      return;
    }
    
    try {
      const categoryId = configManager.addCategory(newCategoryName, newCategoryName);
      loadCategories();
      setSelectedCategory(categoryId);
      setNewCategoryName('');
      setShowAddCategory(false);
      if (onConfigChange) onConfigChange();
      alert(`Category "${newCategoryName}" added successfully!`);
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleRemoveCategory = () => {
    if (CardCategory.BUILT_IN_CATEGORIES.includes(selectedCategory)) {
      alert('Cannot remove built-in categories');
      return;
    }
    
    if (!window.confirm(`Are you sure you want to delete the "${getCategoryDisplayName(selectedCategory)}" category?`)) {
      return;
    }
    
    try {
      configManager.removeCategory(selectedCategory);
      loadCategories();
      setSelectedCategory(CardCategory.TUTORS);
      if (onConfigChange) onConfigChange();
      alert('Category removed successfully!');
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  // Search for cards
  const handleSearch = async (query) => {
    setSearchQuery(query);
    
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await scryfallAdapter.searchCards(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Add card to category
  const handleAddCard = (card) => {
    try {
      // Convert card name to Scryfall format if needed
      const cardData = typeof card === 'string' 
        ? { name: card, id: null } 
        : { name: card.name, id: card.scryfallId || card.id };

      configManager.addCardToCategory(selectedCategory, cardData);
      loadCards();
      setSearchQuery('');
      setSearchResults([]);
    } catch (error) {
      alert(`Error adding card: ${error.message}`);
    }
  };

  // Remove card from category
  const handleRemoveCard = (cardToRemove) => {
    try {
      // Support both legacy (string) and new (object) formats
      const cardIdentifier = typeof cardToRemove === 'string' 
        ? cardToRemove 
        : (cardToRemove.id || cardToRemove.name);

      configManager.removeCardFromCategory(selectedCategory, cardIdentifier);
      loadCards();
    } catch (error) {
      alert(`Error removing card: ${error.message}`);
    }
  };

  const getCategoryDisplayName = (category) => {
    return CardCategory.formatCategoryName(category);
  };

  const getCardDisplayName = (card) => {
    return typeof card === 'string' ? card : card.name;
  };

  return (
    <div className="card-category-manager">
      <div className="manager-header">
        <h2>Manage Card Categories</h2>
        <button 
          className="btn-add-category"
          onClick={() => setShowAddCategory(!showAddCategory)}
        >
          + Add Category
        </button>
      </div>

      {showAddCategory && (
        <div className="add-category-form">
          <input
            type="text"
            placeholder="Category name (e.g., Stax, Fast Mana)"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
          />
          <button className="btn-confirm" onClick={handleAddCategory}>Add</button>
          <button className="btn-cancel" onClick={() => { setShowAddCategory(false); setNewCategoryName(''); }}>Cancel</button>
        </div>
      )}
      
      {/* Category Selector */}
      <div className="category-selector">
        <label htmlFor="category">Category:</label>
        <select 
          id="category"
          value={selectedCategory} 
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {getCategoryDisplayName(cat)}
              {!CardCategory.BUILT_IN_CATEGORIES.includes(cat) && ' (Custom)'}
            </option>
          ))}
        </select>
        <span className="card-count">({cards.length} cards)</span>
        {!CardCategory.BUILT_IN_CATEGORIES.includes(selectedCategory) && (
          <button 
            className="btn-delete-category"
            onClick={handleRemoveCategory}
            title="Delete this category"
          >
            Delete Category
          </button>
        )}
      </div>

      {/* Add Card Section */}
      <div className="add-card-section">
        <h3>Add Card</h3>
        <div className="search-box">
          <input
            type="text"
            placeholder="Search for a card..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
          {isSearching && <span className="searching">Searching...</span>}
        </div>

        {searchResults.length > 0 && (
          <div className="search-results">
            {searchResults.map((card, idx) => (
              <div 
                key={card.scryfallId || idx} 
                className="search-result-item"
                onClick={() => handleAddCard(card)}
              >
                <span className="card-name">{card.name}</span>
                <button className="btn-add">Add</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Current Cards List */}
      <div className="cards-list">
        <h3>Cards in {getCategoryDisplayName(selectedCategory)}</h3>
        {cards.length === 0 ? (
          <p className="empty-message">No cards in this category</p>
        ) : (
          <ul>
            {cards.map((card, idx) => {
              const displayName = getCardDisplayName(card);
              const cardId = typeof card === 'string' ? card : (card.id || card.name);
              
              return (
                <li key={cardId || idx} className="card-item">
                  <span className="card-name">{displayName}</span>
                  {typeof card === 'object' && card.id && (
                    <span className="scryfall-badge">✓</span>
                  )}
                  <button 
                    className="btn-remove"
                    onClick={() => handleRemoveCard(card)}
                  >
                    Remove
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export default CardCategoryManager;
