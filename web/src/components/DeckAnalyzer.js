import React, { useState } from 'react';
import deckService from '../services/deckService';
import './DeckAnalyzer.css';

function DeckAnalyzer() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const analysisResult = await deckService.fetchAndAnalyzeDeck(url);
      setResult(analysisResult);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatCategoryName = (category) => {
    return category.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  };

  return (
    <div className="deck-analyzer">
      <div className="analyzer-card">
        <h2>Analyze Your Deck</h2>
        <form onSubmit={handleAnalyze}>
          <div className="form-group">
            <label htmlFor="deck-url">Deck URL</label>
            <input
              id="deck-url"
              type="text"
              placeholder="https://moxfield.com/decks/... or https://archidekt.com/decks/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Analyzing...' : 'Analyze Deck'}
          </button>
        </form>

        {error && (
          <div className="error-message">
            <strong>Error:</strong> {error}
          </div>
        )}

        {result && (
          <div className="analysis-result">
            <div className="deck-info">
              <h3>{result.deck.name}</h3>
              <p className="deck-meta">
                <strong>Commander(s):</strong> {result.deck.commanders.join(', ')}
              </p>
              <p className="deck-meta">
                <strong>Source:</strong> {result.deck.source}
              </p>
            </div>

            {result.analysis.bracket !== null ? (
              <div className="bracket-result success">
                <div className="bracket-badge">
                  <span className="bracket-number">{result.analysis.bracket}</span>
                  <span className="bracket-name">{result.analysis.bracketName}</span>
                </div>
                
                <div className="card-counts">
                  <h4>Card Counts</h4>
                  <div className="counts-grid">
                    <div className="count-item">
                      <span className="count-label">Tutors:</span>
                      <span className="count-value">{result.analysis.details.counts.tutors}</span>
                    </div>
                    <div className="count-item">
                      <span className="count-label">Two-Card Combos:</span>
                      <span className="count-value">{result.analysis.details.counts.twoCardCombos}</span>
                    </div>
                    <div className="count-item">
                      <span className="count-label">Game Changers:</span>
                      <span className="count-value">{result.analysis.details.counts.gameChangers}</span>
                    </div>
                    <div className="count-item">
                      <span className="count-label">Land Denial:</span>
                      <span className="count-value">{result.analysis.details.counts.landDenial}</span>
                    </div>
                  </div>
                </div>

                {Object.entries(result.analysis.details.foundCards).map(([category, cards]) => 
                  cards.length > 0 && (
                    <div key={category} className="found-cards">
                      <h4>{formatCategoryName(category)} Found:</h4>
                      <ul>
                        {cards.map((card, idx) => (
                          <li key={idx}>{card}</li>
                        ))}
                      </ul>
                    </div>
                  )
                )}
              </div>
            ) : (
              <div className="bracket-result error">
                <h3>❌ No Valid Bracket</h3>
                <p><strong>Reason:</strong> {result.analysis.reason}</p>

                {result.analysis.bannedCards && (
                  <div className="banned-cards">
                    <h4>Banned Cards:</h4>
                    <ul>
                      {result.analysis.bannedCards.map((card, idx) => (
                        <li key={idx}>{card}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.analysis.violations && (
                  <div className="violations">
                    <h4>Violations:</h4>
                    <ul>
                      {result.analysis.violations.map((violation, idx) => (
                        <li key={idx}>{violation}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.analysis.details && (
                  <div className="card-counts">
                    <h4>Card Counts</h4>
                    <div className="counts-grid">
                      <div className="count-item">
                        <span className="count-label">Tutors:</span>
                        <span className="count-value">{result.analysis.details.counts.tutors}</span>
                      </div>
                      <div className="count-item">
                        <span className="count-label">Two-Card Combos:</span>
                        <span className="count-value">{result.analysis.details.counts.twoCardCombos}</span>
                      </div>
                      <div className="count-item">
                        <span className="count-label">Game Changers:</span>
                        <span className="count-value">{result.analysis.details.counts.gameChangers}</span>
                      </div>
                      <div className="count-item">
                        <span className="count-label">Land Denial:</span>
                        <span className="count-value">{result.analysis.details.counts.landDenial}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default DeckAnalyzer;
