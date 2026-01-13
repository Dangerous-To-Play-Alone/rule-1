import React, { useState } from "react";
import "./App.css";
import DeckAnalyzer from "./components/DeckAnalyzer";
import BracketManager from "./components/BracketManager";
import CardCategoryManager from "./components/CardCategoryManager";

function App() {
  const [activeTab, setActiveTab] = useState("analyze");
  const [refreshKey, setRefreshKey] = useState(0);

  const handleConfigChange = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>⚔️ Rule Minus One</h1>
        <p>Analyze decks and manage Commander brackets for your Pods</p>
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
        {activeTab === "analyze" && <DeckAnalyzer key={refreshKey} />}
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
