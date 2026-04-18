import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { Hammer, Trash2, Box, Hexagon, AlertTriangle, RefreshCw, XCircle } from 'lucide-react';
import './ScrapSorter.css';

interface ScrapItem {
  id: number;
  type: 'ore' | 'metal' | 'debris';
  x: number;
  y: number;
  rotation: number;
  speed: number;
}

const ScrapSorter: React.FC = () => {
  const [gameState, setGameState] = useState<'IDLE' | 'PLAYING' | 'GAMEOVER'>('IDLE');
  const [items, setItems] = useState<ScrapItem[]>([]);
  const [score, setScore] = useState(0);
  const [hullHealth, setHullHealth] = useState(100);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  
  const gameLoopRef = useRef<number>();
  const frameCountRef = useRef(0);
  const itemsRef = useRef<ScrapItem[]>([]);
  const scoreRef = useRef(0);
  const healthRef = useRef(100);

  const spawnItem = useCallback(() => {
    const types: ('ore' | 'metal' | 'debris')[] = ['ore', 'metal', 'debris'];
    const type = types[Math.floor(Math.random() * types.length)];
    const newItem: ScrapItem = {
      id: Date.now() + Math.random(),
      type,
      x: 50 + Math.random() * 200,
      y: -50,
      rotation: Math.random() * 360,
      speed: 1.0 + (scoreRef.current / 2000),
    };
    itemsRef.current.push(newItem);
    setItems([...itemsRef.current]);
  }, []);

  const update = () => {
    if (gameState !== 'PLAYING') return;

    frameCountRef.current++;
    if (frameCountRef.current % 90 === 0) spawnItem();

    const currentItems = [...itemsRef.current];
    let healthPenalty = 0;

    for (let i = currentItems.length - 1; i >= 0; i--) {
      currentItems[i].y += currentItems[i].speed;
      
      // If item hits the bottom unsorted
      if (currentItems[i].y > 500) {
        if (currentItems[i].type !== 'debris') {
          healthPenalty += 10;
        }
        currentItems.splice(i, 1);
      }
    }

    if (healthPenalty > 0) {
      healthRef.current = Math.max(0, healthRef.current - healthPenalty);
      setHullHealth(healthRef.current);
      if (healthRef.current <= 0) {
        setGameState('GAMEOVER');
      }
    }

    itemsRef.current = currentItems;
    setItems(currentItems);
    gameLoopRef.current = requestAnimationFrame(update);
  };

  useEffect(() => {
    if (gameState === 'PLAYING') {
      gameLoopRef.current = requestAnimationFrame(update);
    } else {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [gameState]);

  const startGame = () => {
    setGameState('PLAYING');
    setScore(0);
    setHullHealth(100);
    scoreRef.current = 0;
    healthRef.current = 100;
    itemsRef.current = [];
    setItems([]);
    frameCountRef.current = 0;
  };

  const handleSort = (id: number, bin: 'ore' | 'metal' | 'trash') => {
    const item = itemsRef.current.find(i => i.id === id);
    if (!item) return;

    let correct = false;
    if (bin === 'ore' && item.type === 'ore') correct = true;
    if (bin === 'metal' && item.type === 'metal') correct = true;
    if (bin === 'trash' && item.type === 'debris') correct = true;

    if (correct) {
      scoreRef.current += 50;
      setScore(scoreRef.current);
      setFeedback({ type: 'success', msg: '+50 CREDITS' });
    } else {
      healthRef.current = Math.max(0, healthRef.current - 15);
      setHullHealth(healthRef.current);
      setFeedback({ type: 'error', msg: 'CONTAMINATION DETECTED' });
      if (healthRef.current <= 0) setGameState('GAMEOVER');
    }

    itemsRef.current = itemsRef.current.filter(i => i.id !== id);
    setItems([...itemsRef.current]);
    setTimeout(() => setFeedback(null), 1000);
  };

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'ore': return <Hexagon size={32} className="ore-icon" />;
      case 'metal': return <Box size={32} className="metal-icon" />;
      case 'debris': return <AlertTriangle size={32} className="debris-icon" />;
      default: return <Hammer size={32} />;
    }
  };

  return (
    <div className="sorter-container scrap-border">
      <div className="sorter-header">
        <div className="sorter-title">
          <Hammer size={18} className="axium-orange" />
          <span>DOCK_7_SALVAGE_LINE</span>
        </div>
        <div className="sorter-stats">
          <div className="stat">CREDITS: {score}</div>
          <div className={`stat health ${hullHealth < 30 ? 'low' : ''}`}>HULL: {hullHealth}%</div>
        </div>
      </div>

      <div className="sorter-viewport">
        <AnimatePresence>
          {gameState === 'IDLE' && (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="sorter-overlay">
              <h3 className="axium-orange">SCRAP_SORTER_v1.0</h3>
              <div className="shift-manual scrap-border">
                <h4>SHIFT_MANUAL:</h4>
                <p>DRAG ITEMS INTO CORRECT BINS:</p>
                <ul className="instruction-list">
                  <li><Hexagon size={16} className="ore-icon" /> [ ORE ]: DULL-GLASS (LEFT)</li>
                  <li><Box size={16} className="metal-icon" /> [ METAL ]: SCRAP-IRON (MIDDLE)</li>
                  <li><AlertTriangle size={16} className="debris-icon" /> [ DEBRIS ]: INCINERATOR (RIGHT)</li>
                </ul>
                <p className="warning">WARNING: MIS-SORTING OR DROPPING ITEMS CAUSES HULL DAMAGE.</p>
              </div>
              <button onClick={startGame} className="axium-button">START_SHIFT</button>
            </motion.div>
          )}

          {gameState === 'GAMEOVER' && (
            <motion.div key="over" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="sorter-overlay fatal">
              <XCircle size={48} color="#8b0000" />
              <h3>HULL_BREACH</h3>
              <p>Shift Terminated. Salvage lost to the Void.</p>
              <div className="final-score">TOTAL CREDITS: {score}</div>
              <button onClick={startGame} className="axium-button">RETRY_SHIFT</button>
            </motion.div>
          )}

          {gameState === 'PLAYING' && items.map(item => (
            <motion.div
              key={item.id}
              drag
              dragConstraints={{ top: 0, left: 0, right: 300, bottom: 500 }}
              onDragEnd={(_, info) => {
                const y = item.y + info.point.y;
                const x = item.x + info.point.x;
                if (y > 350) {
                  if (x < 100) handleSort(item.id, 'ore');
                  else if (x > 200) handleSort(item.id, 'trash');
                  else handleSort(item.id, 'metal');
                }
              }}
              className={`scrap-item ${item.type}`}
              style={{ top: item.y, left: item.x, rotate: item.rotation }}
            >
              {getItemIcon(item.type)}
              <span className="item-label">{item.type.toUpperCase()}</span>
            </motion.div>
          ))}
        </AnimatePresence>

        <div className="sorter-bins">
          <div className="bin ore">DULL-GLASS</div>
          <div className="bin metal">SCRAP-IRON</div>
          <div className="bin trash">INCINERATOR</div>
        </div>

        {feedback && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`game-feedback ${feedback.type}`}>
            {feedback.msg}
          </motion.div>
        )}
      </div>

      <div className="conveyor-belt">
        <div className="belt-lines" />
      </div>
    </div>
  );
};

export default ScrapSorter;
