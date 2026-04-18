import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Radio, Hammer, BookOpen, AlertTriangle, MessageSquare, Send, Zap, ChevronRight, Package } from 'lucide-react';
import ScrapSorter from './components/ScrapSorter';
import './App.css';

const philosophy = [
  "Centralization is the rot that broke the stars.",
  "Your neighbors oxygen is as vital as your own.",
  "Scavenge the old to build the new.",
  "The Core Greed is a Black Hole."
];

const initialTrades = [
  { id: 1, item: '[WANTED] DREADNOUGHT COILS', offer: '20x DULL-GLASS', bids: 3 },
  { id: 2, item: '[AVAILABLE] SCRAP-PLATING', offer: 'OXYGEN-CANISTER', bids: 0 },
  { id: 3, item: '[WANTED] VEIL-DIVER PARTS', offer: 'SHIP-LABOR', bids: 12 },
];

const initialMessages = [
  { user: 'Rook', msg: 'Anyone seen the Directorate patrols near Shallows?' },
  { user: 'Sola_V', msg: 'Shadows are moving. Stay low, Axium.' },
  { user: 'Scrap_Rat', msg: 'Just found a haul of pulse-grade near the rift!' },
];

function App() {
  const [messages, setMessages] = useState(initialMessages);
  const [chatInput, setChatInput] = useState('');
  const [trades, setTrades] = useState(initialTrades);
  const [bidStatus, setBidStatus] = useState<number | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setMessages([...messages, { user: 'Guest_77', msg: chatInput }]);
    setChatInput('');
  };

  const handleBid = (tradeId: number) => {
    setTrades(trades.map(t => t.id === tradeId ? { ...t, bids: t.bids + 1 } : t));
    setBidStatus(tradeId);
    setTimeout(() => setBidStatus(null), 2000);
  };

  return (
    <div className="axium-container">
      <div className="rust-overlay" />
      
      {/* Header / Nav */}
      <header className="axium-header scrap-border">
        <div className="logo-section">
          <Radio className="axium-orange" size={32} />
          <h1>AXIUM RELAY :: RIM-NET</h1>
        </div>
        <nav className="axium-nav">
          <a href="#philosophy">Philosophy</a>
          <a href="#sorter">Salvage-Shift</a>
          <a href="#trade">Trade</a>
          <a href="#comms">Comms</a>
          <a href="https://kybian.com" className="hub-tag">[ HUB ]</a>
        </nav>
      </header>

      <main className="axium-main">
        {/* Sorter Game Section */}
        <section id="sorter" className="salvage-game-section scrap-border">
           <div className="panel-head">
              <Package size={20} className="axium-orange" />
              <h3>ACTIVE SALVAGE LINE :: DOCK 7</h3>
            </div>
            <div className="game-wrapper">
              <ScrapSorter />
            </div>
        </section>

        {/* Hero */}
        <section className="axium-hero scrap-border">
          <div className="hero-img-wrap">
            <img src="/images/axium-hero.png" alt="Axium Outpost" />
            <div className="hero-overlay" />
          </div>
          <div className="hero-text">
            <h2>The Stars Are For Everyone</h2>
            <p>Welcome to the Axium Coalition. We are the scavengers, the survivors, and the independent minds of the Outer Rim. No Castes. No Rationing. Just Freedom.</p>
            <div className="hero-stats">
              <div className="stat"><Zap size={14}/> POWER: SCAVENGED</div>
              <div className="stat"><MessageSquare size={14}/> NODES: 42 ACTIVE</div>
            </div>
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
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  key={i} 
                  className="quote-card"
                >
                  <ChevronRight size={14} className="axium-orange" />
                  <span>"{q}"</span>
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
              {trades.map((trade) => (
                <div key={trade.id} className="trade-row">
                  <div className="trade-info">
                    <span className="trade-item">{trade.item}</span>
                    <span className="offer">{trade.offer}</span>
                  </div>
                  <button 
                    className={`bid-button ${bidStatus === trade.id ? 'success' : ''}`}
                    onClick={() => handleBid(trade.id)}
                  >
                    {bidStatus === trade.id ? 'SENT!' : `BID [${trade.bids}]`}
                  </button>
                </div>
              ))}
            </div>
            <button className="axium-button full-width">POST AD</button>
          </section>

          {/* Comms column */}
          <section id="comms" className="comms-col scrap-border">
            <div className="panel-head">
              <MessageSquare size={20} />
              <h3>COALITION CHAT [FREQ: 144.2]</h3>
            </div>
            <div className="chat-window">
              {messages.map((m, i) => (
                <div key={i} className="msg">
                  <span className="user">{m.user}:</span>
                  <span className="text">{m.msg}</span>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="chat-input">
              <input 
                type="text" 
                placeholder="TRANSMIT MESSAGE..." 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
              />
              <button type="submit"><Send size={18} /></button>
            </form>
          </section>
        </div>

        <section className="alert-bar scrap-border">
          <div className="alert-content">
            <AlertTriangle color="#ff8c00" size={24} />
            <marquee className="alert-text">
              VEIL-STORM DETECTED IN SECTOR 4 :: ALL SCAVENGERS RETURN TO OUTPOST :: RE-ROUTE ALL FTL-SNARES :: DIRECTORATE FRIGATE SPOTTED NEAR AXIUM-7 :: STAY RADIOSILENT
            </marquee>
          </div>
        </section>
      </main>

      <footer className="axium-footer">
        <div className="footer-line" />
        <p>Decentralized. Autonomous. Free. // Axium Coalition // 52 AF</p>
      </footer>
    </div>
  );
}

export default App;

