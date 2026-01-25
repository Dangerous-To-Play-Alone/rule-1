import React, { useState, useEffect } from "react";
import "./App.css";
import DeckAnalyzer from "./components/DeckAnalyzer";
import BracketManager from "./components/BracketManager";
import CardCategoryManager from "./components/CardCategoryManager";
import configManager from "./services/configManager";

function App() {
  const [activeTab, setActiveTab] = useState("analyze");
  const [refreshKey, setRefreshKey] = useState(0);
  const [isLoadingDefaults, setIsLoadingDefaults] = useState(false);
  const [defaultsError, setDefaultsError] = useState(null);
  const [initializationStatus, setInitializationStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'
  const [isRestoring, setIsRestoring] = useState(false);
  const [restoreError, setRestoreError] = useState(null);

  // Initialize defaults on app launch
  useEffect(() => {
    const initializeDefaults = async () => {
      // Only fetch if we don't have defaults already
      if (!configManager.hasFetchedDefaults()) {
        setInitializationStatus('loading');
        try {
          await configManager.fetchDefaultsFromAPI();
          setInitializationStatus('success');
        } catch (error) {
          console.error('Failed to initialize defaults on launch:', error);
          setInitializationStatus('error');
          // App continues with hardcoded defaults
        }
      } else {
        setInitializationStatus('success');
      }
    };

    initializeDefaults();
  }, []);

  const handleConfigChange = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleResetToDefaults = async () => {
    if (!window.confirm('Are you sure you want to reset to bracket defaults? This will fetch the latest data from CommanderSpellbook and replace all your current settings.')) {
      return;
    }

    setIsLoadingDefaults(true);
    setDefaultsError(null);

    try {
      // Fetch fresh defaults from API
      await configManager.fetchDefaultsFromAPI();
      
      // Reset config to use the fetched defaults
      configManager.resetToDefaults();
      
      // Trigger refresh
      handleConfigChange();
      
      alert('Successfully reset to bracket defaults!');
    } catch (error) {
      console.error('Failed to reset to defaults:', error);
      setDefaultsError(error.message);
      alert('Failed to fetch defaults from CommanderSpellbook. Please try again later.');
    } finally {
      setIsLoadingDefaults(false);
    }
  };

  const handleBackup = () => {
    try {
      configManager.downloadBackup();
      alert('Configuration backed up successfully!');
    } catch (error) {
      console.error('Failed to create backup:', error);
      alert('Failed to create backup. Please try again.');
    }
  };

  const handleRestore = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Ask user if they want to merge or replace
    const shouldMerge = window.confirm(
      'Do you want to MERGE this backup with your current settings?\n\n' +
      'Click OK to merge (add new items, keep existing)\n' +
      'Click Cancel to REPLACE everything with the backup'
    );

    setIsRestoring(true);
    setRestoreError(null);

    try {
      await configManager.restoreFromFile(file, shouldMerge);
      handleConfigChange();
      alert(`Configuration ${shouldMerge ? 'merged' : 'restored'} successfully!`);
    } catch (error) {
      console.error('Failed to restore backup:', error);
      setRestoreError(error.message);
      alert(`Failed to restore backup: ${error.message}`);
    } finally {
      setIsRestoring(false);
      // Reset file input
      event.target.value = '';
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>⚔️ Rule Minus One</h1>
        <p>Analyze decks and manage Commander brackets for your Pods</p>
        {initializationStatus === 'loading' && (
          <div className="initialization-status">
            <small>⏳ Initializing default brackets from CommanderSpellbook...</small>
          </div>
        )}
        {initializationStatus === 'error' && (
          <div className="initialization-status error">
            <small>⚠️ Failed to fetch defaults. Using fallback data.</small>
          </div>
        )}
      </header>

      <nav className="App-nav">
        <button
          className={activeTab === "analyze" ? "active" : ""}
          onClick={() => setActiveTab("analyze")}
        >
          🔍 Analyze Deck
        </button>
        <button
          className={activeTab === "brackets" ? "active" : ""}
          onClick={() => setActiveTab("brackets")}
        >
          📊 Manage Brackets
        </button>
        <button
          className={activeTab === "categories" ? "active" : ""}
          onClick={() => setActiveTab("categories")}
        >
          🃏 Manage Cards
        </button>
      </nav>

      <main className="App-main">
        {activeTab === "analyze" && (
          <>
            <div className="actions-section">
              <div className="action-group">
                <h3>📦 Backup & Restore</h3>
                <div className="backup-restore-buttons">
                  <button
                    className="btn-backup"
                    onClick={handleBackup}
                  >
                    💾 Download Backup
                  </button>
                  <label className="btn-restore">
                    {isRestoring ? '⏳ Restoring...' : '📂 Restore Backup'}
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleRestore}
                      disabled={isRestoring}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
                <p className="action-help">
                  Save your custom brackets, categories, and card lists, or restore from a previous backup
                </p>
                {restoreError && (
                  <div className="error-message">
                    Error: {restoreError}
                  </div>
                )}
              </div>

              <div className="action-group">
                <h3>🔄 Reset to Defaults</h3>
                <button
                  className="reset-button"
                  onClick={handleResetToDefaults}
                  disabled={isLoadingDefaults}
                >
                  {isLoadingDefaults ? '⏳ Fetching...' : '🔄 Reset to Bracket Defaults'}
                </button>
                <p className="action-help">
                  Fetch the latest default brackets, bans, and card categories from CommanderSpellbook
                </p>
                {defaultsError && (
                  <div className="error-message">
                    Error: {defaultsError}
                  </div>
                )}
              </div>
            </div>
            <DeckAnalyzer key={refreshKey} />
          </>
        )}
        {activeTab === "brackets" && (
          <BracketManager onConfigChange={handleConfigChange} />
        )}
        {activeTab === "categories" && (
          <CardCategoryManager onConfigChange={handleConfigChange} />
        )}
      </main>

      <footer className="App-footer">
        <p>
          Data stored locally in your browser • Support for Moxfield & Archidekt
        </p>
      </footer>
    </div>
  );
}

export default App;
