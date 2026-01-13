import React, { useState, useEffect } from 'react';
import configManager from '../services/configManager';
import './BracketManager.css';

function BracketManager({ onConfigChange }) {
  const [brackets, setBrackets] = useState({});
  const [editingBracket, setEditingBracket] = useState(null);
  const [showAddBracket, setShowAddBracket] = useState(false);

  useEffect(() => {
    loadBrackets();
  }, []);

  const loadBrackets = () => {
    setBrackets(configManager.getBrackets());
  };

  const handleUpdateBracket = (bracketId, updates) => {
    try {
      configManager.updateBracket(parseInt(bracketId), updates);
      loadBrackets();
      setEditingBracket(null);
      onConfigChange();
      alert('Bracket updated successfully!');
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleAddBracket = (bracketData) => {
    try {
      configManager.addBracket(parseInt(bracketData.id), {
        name: bracketData.name,
        description: bracketData.description,
        limits: {
          tutors: bracketData.tutors === -1 ? Infinity : bracketData.tutors,
          twoCardCombos: bracketData.twoCardCombos === -1 ? Infinity : bracketData.twoCardCombos,
          gameChangers: bracketData.gameChangers === -1 ? Infinity : bracketData.gameChangers,
          landDenial: bracketData.landDenial === -1 ? Infinity : bracketData.landDenial
        },
        bannedCards: []
      });
      loadBrackets();
      setShowAddBracket(false);
      onConfigChange();
      alert('Bracket added successfully!');
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleDeleteBracket = (bracketId) => {
    if (window.confirm(`Are you sure you want to delete Bracket ${bracketId}?`)) {
      try {
        configManager.removeBracket(parseInt(bracketId));
        loadBrackets();
        onConfigChange();
        alert('Bracket deleted successfully!');
      } catch (error) {
        alert(`Error: ${error.message}`);
      }
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all brackets to defaults? This cannot be undone.')) {
      try {
        configManager.resetToDefaults();
        loadBrackets();
        onConfigChange();
        alert('Reset to defaults successfully!');
      } catch (error) {
        alert(`Error: ${error.message}`);
      }
    }
  };

  const formatLimit = (limit) => {
    return limit === Infinity ? '∞' : limit;
  };

  const sortedBracketIds = Object.keys(brackets).map(Number).sort((a, b) => a - b);

  return (
    <div className="bracket-manager">
      <div className="manager-header">
        <h2>Bracket Configuration</h2>
        <div className="header-actions">
          <button onClick={() => setShowAddBracket(true)} className="btn-primary">
            + Add Bracket
          </button>
          <button onClick={handleReset} className="btn-danger">
            Reset to Defaults
          </button>
        </div>
      </div>

      <div className="brackets-list">
        {sortedBracketIds.map(id => (
          <div key={id} className="bracket-card">
            {editingBracket === id ? (
              <BracketEditForm
                bracket={{ id, ...brackets[id] }}
                onSave={(updates) => handleUpdateBracket(id, updates)}
                onCancel={() => setEditingBracket(null)}
              />
            ) : (
              <>
                <div className="bracket-header">
                  <div>
                    <h3>Bracket {id}: {brackets[id].name}</h3>
                    <p className="bracket-description">{brackets[id].description}</p>
                  </div>
                  <div className="bracket-actions">
                    <button onClick={() => setEditingBracket(id)} className="btn-secondary">
                      Edit
                    </button>
                    <button onClick={() => handleDeleteBracket(id)} className="btn-danger">
                      Delete
                    </button>
                  </div>
                </div>
                <div className="bracket-limits">
                  {Object.entries(brackets[id].limits).map(([category, limit]) => (
                    <div key={category} className="limit-item">
                      <span className="limit-label">{configManager.getCategoryName(category)}:</span>
                      <span className="limit-value">{formatLimit(limit)}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {showAddBracket && (
        <BracketAddForm
          onAdd={handleAddBracket}
          onCancel={() => setShowAddBracket(false)}
        />
      )}
    </div>
  );
}

function BracketEditForm({ bracket, onSave, onCancel }) {
  const [name, setName] = useState(bracket.name);
  const [description, setDescription] = useState(bracket.description);
  const [tutors, setTutors] = useState(bracket.limits.tutors === Infinity ? -1 : bracket.limits.tutors);
  const [twoCardCombos, setTwoCardCombos] = useState(bracket.limits.twoCardCombos === Infinity ? -1 : bracket.limits.twoCardCombos);
  const [gameChangers, setGameChangers] = useState(bracket.limits.gameChangers === Infinity ? -1 : bracket.limits.gameChangers);
  const [landDenial, setLandDenial] = useState(bracket.limits.landDenial === Infinity ? -1 : bracket.limits.landDenial);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      name,
      description,
      limits: {
        tutors: tutors === -1 ? Infinity : parseInt(tutors),
        twoCardCombos: twoCardCombos === -1 ? Infinity : parseInt(twoCardCombos),
        gameChangers: gameChangers === -1 ? Infinity : parseInt(gameChangers),
        landDenial: landDenial === -1 ? Infinity : parseInt(landDenial)
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bracket-form">
      <div className="form-group">
        <label>Name</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="form-group">
        <label>Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
      </div>
      <div className="limits-form">
        <div className="form-group">
          <label>Tutors (-1 for unlimited)</label>
          <input type="number" value={tutors} onChange={(e) => setTutors(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Two-Card Combos (-1 for unlimited)</label>
          <input type="number" value={twoCardCombos} onChange={(e) => setTwoCardCombos(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Game Changers (-1 for unlimited)</label>
          <input type="number" value={gameChangers} onChange={(e) => setGameChangers(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Land Denial (-1 for unlimited)</label>
          <input type="number" value={landDenial} onChange={(e) => setLandDenial(e.target.value)} required />
        </div>
      </div>
      <div className="form-actions">
        <button type="submit" className="btn-primary">Save</button>
        <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
      </div>
    </form>
  );
}

function BracketAddForm({ onAdd, onCancel }) {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tutors, setTutors] = useState(0);
  const [twoCardCombos, setTwoCardCombos] = useState(0);
  const [gameChangers, setGameChangers] = useState(0);
  const [landDenial, setLandDenial] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({
      id: parseInt(id),
      name,
      description,
      tutors: parseInt(tutors),
      twoCardCombos: parseInt(twoCardCombos),
      gameChangers: parseInt(gameChangers),
      landDenial: parseInt(landDenial)
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Add New Bracket</h3>
        <form onSubmit={handleSubmit} className="bracket-form">
          <div className="form-group">
            <label>Bracket ID</label>
            <input type="number" value={id} onChange={(e) => setId(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
          </div>
          <div className="limits-form">
            <div className="form-group">
              <label>Tutors (-1 for unlimited)</label>
              <input type="number" value={tutors} onChange={(e) => setTutors(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Two-Card Combos (-1 for unlimited)</label>
              <input type="number" value={twoCardCombos} onChange={(e) => setTwoCardCombos(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Game Changers (-1 for unlimited)</label>
              <input type="number" value={gameChangers} onChange={(e) => setGameChangers(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Land Denial (-1 for unlimited)</label>
              <input type="number" value={landDenial} onChange={(e) => setLandDenial(e.target.value)} required />
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-primary">Add Bracket</button>
            <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BracketManager;
