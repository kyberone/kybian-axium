import React from 'react';
import { motion } from 'framer-motion';
import { Radio, Hammer, BookOpen, Share2, AlertTriangle, MessageSquare } from 'lucide-react';
import './App.css';

const philosophy = [
  "Centralization is the rot that broke the stars.",
  "Your neighbors oxygen is as vital as your own.",
  "Scavenge the old to build the new.",
  "The Core Greed is a Black Hole."
];

function App() {
  return (
    <div className="axium-container">
      {/* Header / Nav */}
      <header className="axium-header scrap-border">
        <div className="logo-section">
          <Radio className="axium-orange" size={32} />
          <h1>AXIUM RELAY :: RIM-NET</h1>
        </div>
        <nav className="axium-nav">
          <a href="#philosophy">Philosophy</a>
          <a href="#trade">Salvage-Trade</a>
          <a href="#comms">Comms-Freq</a>
          <a href="https://kybian.com" className="hub-tag">[ BACK_TO_HUB ]</a>
        </nav>
      </header>

      <main className="axium-main">
        {/* Hero */}
        <section className="axium-hero scrap-border">
          <div className="hero-img-wrap">
            <img src="/images/axium-hero.png" alt="Axium Outpost" />
            <div className="hero-overlay" />
          </div>
          <div className="hero-text">
            <h2>The Stars Are For Everyone</h2>
            <p>Welcome to the Axium Coalition. We are the scavengers, the survivors, and the independent minds of the Outer Rim. No Castes. No Rationing. Just Freedom.</p>
          </div>
        </section>

        <div className="axium-grid">
          {/* Philosophy Column */}
          <section id="philosophy" className="philosophy-col scrap-border">
            <div className="panel-head">
              <BookOpen size={20} />
              <h3>RIM PHILOSOPHY</h3>
            </div>
            <div className="quote-list">
              {philosophy.map((q, i) => (
                <motion.div 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  key={i} 
                  className="quote-card"
                >
                  "{q}"
                </motion.div>
              ))}
            </div>
          </section>

          {/* Salvage column */}
          <section id="trade" className="trade-col scrap-border">
            <div className="panel-head">
              <Hammer size={20} />
              <h3>SALVAGE BULLETIN</h3>
            </div>
            <div className="trade-items">
              <div className="trade-row">
                <span>[WANTED] DREADNOUGHT COILS</span>
                <span className="offer">OFFER: 20x DULL-GLASS</span>
              </div>
              <div className="trade-row">
                <span>[AVAILABLE] SCRAP-PLATING</span>
                <span className="offer">OFFER: OXYGEN-CANISTER</span>
              </div>
              <div className="trade-row">
                <span>[WANTED] VEIL-DIVER PARTS</span>
                <span className="offer">OFFER: SHIP-LABOR</span>
              </div>
            </div>
            <button className="axium-button">POST AD</button>
          </section>

          {/* Comms column */}
          <section id="comms" className="comms-col scrap-border">
            <div className="panel-head">
              <MessageSquare size={20} />
              <h3>COALITION CHAT [FREQ: 144.2]</h3>
            </div>
            <div className="chat-window">
              <div className="msg"><span className="user">Rook:</span> Anyone seen the Directorate patrols near Shallows?</div>
              <div className="msg"><span className="user">Sola_V:</span> Shadows are moving. Stay low, Axium.</div>
              <div className="msg"><span className="user">Scrap_Rat:</span> Just found a haul of pulse-grade near the rift!</div>
            </div>
            <div className="chat-input">
              <input type="text" placeholder="TRANSMIT MESSAGE..." />
              <Share2 size={18} />
            </div>
          </section>
        </div>

        <section className="alert-bar scrap-border">
          <AlertTriangle color="#ff8c00" size={24} />
          <div className="alert-text">
            VEIL-STORM DETECTED IN SECTOR 4 :: ALL SCAVENGERS RETURN TO OUTPOST :: RE-ROUTE ALL FTL-SNARES
          </div>
        </section>
      </main>

      <footer className="axium-footer">
        <p>Decentralized. Autonomous. Free. // Axium Coalition // 342 AF</p>
      </footer>
    </div>
  );
}

export default App;
