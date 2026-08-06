import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import jethalalImg from '../../assets/images/Jethalal.webp';
import dayaImg from '../../assets/images/dayaben.webp';
import bapujiImg from '../../assets/images/bapuji.webp';
import babitaImg from '../../assets/images/babita.png';
import bhideImg from '../../assets/images/bhide.jpg';
import popatImg from '../../assets/images/popatlal.jpeg';

const CARDS = [
  { id: 1, image: jethalalImg, label: 'Jethalal' },
  { id: 2, image: dayaImg, label: 'Daya Bhabi' },
  { id: 3, image: bapujiImg, label: 'Bapuji' },
  { id: 4, image: bhideImg, label: 'Bhide' },
  { id: 5, image: babitaImg, label: 'Babita' },
  { id: 6, image: popatImg, label: 'Popatlal' },
];

const archivePanelStyle = {
  backgroundColor: '#f9f5f0',
  backgroundImage: `
    linear-gradient(135deg, rgba(212, 175, 140, 0.04) 0%, transparent 50%),
    url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='matchtexture'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.06' numOctaves='3' /%3E%3C/filter%3E%3Crect width='200' height='200' fill='%23f9f5f0' filter='url(%23matchtexture)' opacity='0.35'/%3E%3C/svg%3E")
  `,
  border: '2px solid rgba(164, 100, 70, 0.3)',
  boxShadow: '0 20px 40px rgba(61, 40, 23, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
};

const inkTextStyle = { color: '#3d2817', fontFamily: "'EB Garamond', serif" };

// ---- SVG ICONS (replacing emojis) ----
const TrophyIcon = () => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
    <path d="M20 12h24v14c0 7-5.4 12-12 12s-12-5-12-12V12Z" stroke="#8b5a2b" strokeWidth="1.6" fill="rgba(201,165,116,0.15)" />
    <path d="M20 16h-6a6 6 0 0 0 6 12" stroke="#8b5a2b" strokeWidth="1.6" fill="none" />
    <path d="M44 16h6a6 6 0 0 1-6 12" stroke="#8b5a2b" strokeWidth="1.6" fill="none" />
    <path d="M32 38v8" stroke="#8b5a2b" strokeWidth="1.6" />
    <path d="M22 50h20l-3-4H25l-3 4Z" fill="#8b5a2b" opacity="0.85" />
    <circle cx="32" cy="20" r="4" fill="#c9a574" />
  </svg>
);

const WaxSealIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    <circle cx="20" cy="20" r="18" fill="#8d3c3c" opacity="0.9" />
    <circle cx="20" cy="20" r="16" stroke="#c9a574" strokeWidth="1.3" />
    <path d="M20 10L24 17H16Z" fill="#c9a574" />
    <circle cx="20" cy="20" r="1.8" fill="#c9a574" />
  </svg>
);

const CardMatch = ({ onWin, onBack }) => {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [isWon, setIsWon] = useState(false);
  const [showFragmentReveal, setShowFragmentReveal] = useState(false);

  const initializeGame = useCallback(() => {
    const shuffledCards = [...CARDS, ...CARDS]
      .map((card, index) => ({ ...card, uniqueId: index }))
      .sort(() => Math.random() - 0.5);
    setCards(shuffledCards);
    setFlippedCards([]);
    setMatchedPairs([]);
    setIsWon(false);
    setShowFragmentReveal(false);
  }, []);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const handleCardClick = (card) => {
    if (flippedCards.length === 2 || matchedPairs.includes(card.id) || flippedCards.some((f) => f.uniqueId === card.uniqueId)) {
      return;
    }

    const newFlipped = [...flippedCards, card];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      if (newFlipped[0].id === newFlipped[1].id) {
        setMatchedPairs([...matchedPairs, newFlipped[0].id]);
        setFlippedCards([]);
        if (matchedPairs.length + 1 === CARDS.length) {
          setTimeout(() => setIsWon(true), 800);
        }
      } else {
        setTimeout(() => setFlippedCards([]), 1000);
      }
    }
  };

  const handleRevealFragment = useCallback(() => {
    setIsWon(false);
    setShowFragmentReveal(true);
    setTimeout(() => {
      onWin('Daal');
    }, 4500);
  }, [onWin]);

  return (
    <div className="w-full min-h-full px-2 py-3 overflow-visible relative flex items-center justify-center">
      <AnimatePresence mode="wait">
        {!showFragmentReveal ? (
          <motion.div
            key="game"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative z-10 w-full max-w-2xl mx-auto"
          >
            <div className="flex justify-between items-center mb-6 md:mb-8">
              <button
                onClick={onBack}
                className="px-3 py-2 md:px-4 rounded-lg transition-all text-xs md:text-sm italic"
                style={{
                  color: '#3d2817',
                  fontFamily: "'Crimson Text', serif",
                  backgroundColor: 'rgba(212, 175, 140, 0.16)',
                  border: '1px solid rgba(164, 100, 70, 0.25)',
                }}
              >
                ← Back to Selection
              </button>
              <div className="text-sm md:text-xl font-bold tracking-wide" style={{ color: '#8b5a2b', fontFamily: "'Cinzel', serif" }}>
                Pairs: {matchedPairs.length}/{CARDS.length}
              </div>
            </div>

            <div className="p-6 md:p-8 rounded-[14px]" style={archivePanelStyle}>
              {!isWon ? (
                <div className="grid grid-cols-3 gap-3 md:gap-4 justify-items-center">
                  {cards.map((card) => {
                    const isFlipped = flippedCards.some((f) => f.uniqueId === card.uniqueId) || matchedPairs.includes(card.id);
                    return (
                      <motion.div
                        key={card.uniqueId}
                        whileHover={{ scale: isFlipped ? 1 : 1.05 }}
                        whileTap={{ scale: isFlipped ? 1 : 0.95 }}
                        className="w-full aspect-[3/4] cursor-pointer"
                        style={{ perspective: '1000px' }}
                        onClick={() => handleCardClick(card)}
                      >
                        <motion.div
                          className="relative w-full h-full"
                          style={{ transformStyle: 'preserve-3d', transition: 'transform 0.5s' }}
                          animate={{ rotateY: isFlipped ? 180 : 0 }}
                        >
                          {/* Front (Face Down) */}
                          <div
                            className="absolute w-full h-full rounded-[10px] flex items-center justify-center"
                            style={{
                              backfaceVisibility: 'hidden',
                              background: 'linear-gradient(135deg, #8b5a2b 0%, #a4643f 100%)',
                              border: '1px solid rgba(249, 245, 240, 0.35)',
                            }}
                          >
                            <div
                              className="w-9 h-9 md:w-12 md:h-12 rounded-full flex items-center justify-center"
                              style={{ border: '2px dashed rgba(249, 245, 240, 0.38)' }}
                            >
                              <span className="text-base md:text-xl italic" style={{ color: '#f9f5f0', fontFamily: "'Crimson Text', serif" }}>
                                TM
                              </span>
                            </div>
                          </div>
                          {/* Back (Face Up) */}
                          <div
                            className="absolute w-full h-full rounded-[10px] overflow-hidden"
                            style={{
                              backfaceVisibility: 'hidden',
                              transform: 'rotateY(180deg)',
                              border: '2px solid #c9a574',
                              backgroundColor: '#faf6f1',
                            }}
                          >
                            <img
                              src={card.image}
                              alt={card.label}
                              className="w-full h-full object-cover"
                              style={{ filter: 'sepia(0.15) contrast(1.02)' }}
                            />
                          </div>
                        </motion.div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6 md:py-8">
                  <h2 className="text-3xl md:text-4xl font-light mb-5 md:mb-6" style={{ color: '#8b5a2b', fontFamily: "'Crimson Text', serif" }}>
                    Master of Gokuldham
                  </h2>
                  <div className="flex justify-center mb-5 md:mb-6">
                    <TrophyIcon />
                  </div>
                  <p className="text-sm md:text-2xl mb-6 md:mb-8 px-2" style={inkTextStyle}>
                    Your memory is as sharp as Taarak's advice!
                  </p>
                  <button
                    onClick={handleRevealFragment}
                    className="w-full text-base md:text-xl py-3 md:py-4 rounded-lg transition-all shadow-lg"
                    style={{ backgroundColor: '#8b5a2b', color: '#f9f5f0', fontFamily: "'Crimson Text', serif" }}
                  >
                    Reveal Fragment
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="fragment-reveal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10 w-full max-w-2xl mx-auto flex flex-col items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="relative"
            >
              <div className="relative w-56 h-56 md:w-64 md:h-64 flex items-center justify-center">
                <motion.div
                  animate={{
                    boxShadow: [
                      '0 0 20px rgba(201, 165, 116, 0.3)',
                      '0 0 40px rgba(201, 165, 116, 0.6)',
                      '0 0 30px rgba(201, 165, 116, 0.4)',
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 rounded-lg"
                  style={{
                    background: 'radial-gradient(circle at center, #f7f0e4 0%, #d4a574 50%, #8d3c3c 100%)',
                    border: '2px solid #8b5a2b',
                    boxShadow: 'inset 0 0 30px rgba(139, 60, 60, 0.3)',
                  }}
                />

                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                  className="relative z-10 text-center"
                >
                  <motion.p
                    animate={{
                      textShadow: [
                        '0 0 10px rgba(201, 165, 116, 0.5)',
                        '0 0 20px rgba(201, 165, 116, 0.8)',
                        '0 0 10px rgba(201, 165, 116, 0.5)',
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{
                      color: '#c9a574',
                      fontFamily: "'Cinzel Decorative', serif",
                      fontSize: '48px',
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                    }}
                  >
                    Daal
                  </motion.p>
                </motion.div>

                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute bottom-4 right-4 z-10"
                >
                  <WaxSealIcon />
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8, duration: 0.8 }}
              className="mt-10 md:mt-12 text-center px-4"
            >
              <p
                style={{
                  color: '#3d2817',
                  fontFamily: "'Cinzel Decorative', serif",
                  fontSize: '22px',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  marginBottom: '10px',
                }}
              >
                ARCHIVE FRAGMENT RECOVERED
              </p>
              <p
                style={{
                  color: '#8b5a2b',
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '15px',
                  fontStyle: 'italic',
                  letterSpacing: '0.04em',
                }}
              >
                A face from another time has awakened...
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Cinzel+Decorative:wght@400;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&family=EB+Garamond:ital,wght@0,400;0,600;1,400&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&display=swap');
      `}</style>
    </div>
  );
};

export default CardMatch;