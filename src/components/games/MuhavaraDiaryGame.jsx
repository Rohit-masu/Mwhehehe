import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const idioms = [
  {
    emoji: '🐘🦷',
    description: 'Things shown outside vs hidden truth',
    correct: 'Hathi ke dant khane ke aur dikhane ke aur',
    options: [
      'Hathi ke dant khane ke aur dikhane ke aur',
      'Bandar kya jaane adarak ka swad',
      'Thali ka baingan',
      'Oonth ke munh mein jeera',
    ],
  },
  {
    emoji: '7️⃣🩸🙏',
    description: 'Popular Bollywood movie',
    correct: 'Saat Khoon Maaf',
    options: ['Saat Khoon Maaf', 'Khoon Bhari Maang', '7 Days', 'Amar Akbar Anthony'],
  },
  {
    emoji: '🐒❓🫚😋',
    description: "Someone who doesn't appreciate value",
    correct: 'Bandar kya jaane adarak ka swad',
    options: [
      'Bandar kya jaane adarak ka swad',
      'Nach na jane aangan tedha',
      'Ab pachhtaye hot kya',
      'Uunchi dukan feeka pakwan',
    ],
  },
  {
    emoji: '🍽️🍆',
    description: 'Someone who keeps changing sides',
    correct: 'Thali ka baingan',
    options: [
      'Thali ka baingan',
      'Dhobi ka kutta',
      'Ghar ki murgi dal barabar',
      'Aasmaan se gira khajoor mein atka',
    ],
  },
  {
    emoji: '🐪👄▪️',
    description: 'Too little for a huge need',
    correct: 'Oonth ke munh mein jeera',
    options: [
      'Oonth ke munh mein jeera',
      'Hathi ke dant',
      'Naach na jaane aangan tedha',
      'Ghar ki murgi dal barabar',
    ],
  },
  {
    emoji: '💃❌🏠↘️',
    description: 'Blaming circumstances for lack of skill',
    correct: 'Naach na jaane aangan tedha',
    options: [
      'Naach na jaane aangan tedha',
      'Thali ka baingan',
      'Bandar kya jaane adarak ka swad',
      'Khoda pahad nikli chuhiya',
    ],
  },
  {
    emoji: '🏠🐔=🍲',
    description: 'Things available at home are undervalued',
    correct: 'Ghar ki murgi dal barabar',
    options: [
      'Ghar ki murgi dal barabar',
      'Dhobi ka kutta',
      'Oonth ke munh mein jeera',
      'Uunchi dukan feeka pakwan',
    ],
  },
  {
    emoji: '🧺🐕🏠❌🌉❌',
    description: 'Belonging nowhere',
    correct: 'Dhobi ka kutta na ghar ka na ghat ka',
    options: [
      'Dhobi ka kutta na ghar ka na ghat ka',
      'Thali ka baingan',
      'Bandar kya jaane adarak ka swad',
      'Ab pachhtaye hot kya',
    ],
  },
  {
    emoji: '⛰️⛏️➡️🐭',
    description: 'Big effort, tiny result',
    correct: 'Khoda pahad nikli chuhiya',
    options: [
      'Khoda pahad nikli chuhiya',
      'Oonth ke munh mein jeera',
      'Dhobi ka kutta',
      'Naach na jaane aangan tedha',
    ],
  },
  {
    emoji: '🏪⬆️🍽️😕',
    description: 'Looks impressive but disappointing',
    correct: 'Uunchi dukan feeka pakwan',
    options: [
      'Uunchi dukan feeka pakwan',
      'Ghar ki murgi dal barabar',
      'Thali ka baingan',
      'Khoda pahad nikli chuhiya',
    ],
  },
  {
    emoji: '☁️⬇️🌴😵',
    description: 'Escaping one problem, landing in another',
    correct: 'Aasmaan se gira khajoor mein atka',
    options: [
      'Aasmaan se gira khajoor mein atka',
      'Dhobi ka kutta',
      'Oonth ke munh mein jeera',
      'Bandar kya jaane adarak ka swad',
    ],
  },
];

const PASSKEY_WORD = 'I';

const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const CoffeeStain = ({ style }) => (
  <svg width="90" height="90" viewBox="0 0 90 90" className="absolute pointer-events-none" style={style}>
    <g fill="#7a4a1e" opacity="0.1">
      <ellipse cx="45" cy="45" rx="38" ry="34" />
    </g>
    <g fill="none" stroke="#7a4a1e" strokeWidth="1.5" opacity="0.16">
      <ellipse cx="45" cy="45" rx="38" ry="34" />
      <ellipse cx="45" cy="45" rx="30" ry="27" />
    </g>
  </svg>
);

const InkStamp = ({ word }) => (
  <motion.div
    initial={{ scale: 1.6, opacity: 0, rotate: -14 }}
    animate={{ scale: 1, opacity: 1, rotate: -8 }}
    transition={{ type: 'spring', stiffness: 180, damping: 14, delay: 0.4 }}
    className="flex items-center justify-center"
    style={{
      width: '110px',
      height: '110px',
      border: '3px solid #7a2030',
      borderRadius: '8px',
      color: '#7a2030',
      opacity: 0.85,
    }}
  >
    <span
      style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontWeight: 700,
        fontSize: '30px',
        letterSpacing: '0.05em',
      }}
    >
      {word}
    </span>
  </motion.div>
);

const MuhavaraDiaryGame = ({ onWin, onBack }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [shuffledOptions, setShuffledOptions] = useState(() => shuffleArray(idioms[0].options));
  const [showPasskeyReveal, setShowPasskeyReveal] = useState(false);
  const [revealState, setRevealState] = useState({});

  const initializeReveal = useCallback((options) => {
    const next = {};
    options.forEach((_, idx) => {
      next[idx] = false;
    });
    setRevealState(next);
  }, []);

  const handleRevealStart = (idx) => {
    setRevealState((prev) => ({ ...prev, [idx]: true }));
  };

  const handleOptionClick = useCallback(
    (option) => {
      if (selectedOption !== null) return;

      setSelectedOption(option);
      const correct = option === idioms[currentIndex].correct;
      setIsCorrect(correct);
      if (correct) setScore((s) => s + 1);

      setTimeout(() => {
        if (currentIndex < idioms.length - 1) {
          const nextIndex = currentIndex + 1;
          const nextShuffled = shuffleArray(idioms[nextIndex].options);
          setCurrentIndex(nextIndex);
          setSelectedOption(null);
          setIsCorrect(null);
          setShuffledOptions(nextShuffled);
          initializeReveal(nextShuffled);
        } else {
          setShowResult(true);
        }
      }, 1400);
    },
    [currentIndex, selectedOption, initializeReveal]
  );

  const handleFinalResult = useCallback(() => {
    if (score >= 7) {
      setShowPasskeyReveal(true);
      setTimeout(() => onWin?.(PASSKEY_WORD), 2400);
    } else {
      setCurrentIndex(0);
      setScore(0);
      setShowResult(false);
      setSelectedOption(null);
      setIsCorrect(null);
      const reshuffled = shuffleArray(idioms[0].options);
      setShuffledOptions(reshuffled);
      initializeReveal(reshuffled);
    }
  }, [score, onWin, initializeReveal]);

  return (
    <div className="w-full min-h-full px-2 py-3 overflow-visible relative flex items-center justify-center">
      <AnimatePresence mode="wait">
        {!showResult && !showPasskeyReveal ? (
          <motion.div
            key="game"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            className="w-full max-w-xl mx-auto"
          >
            <div className="flex justify-between items-center mb-5">
              <button
                onClick={onBack}
                style={{
                  color: '#e8d3ad',
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '14px',
                  fontStyle: 'italic',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                ← Back to the Attic
              </button>
              <p
                style={{
                  color: '#c9ab7a',
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '13px',
                  fontStyle: 'italic',
                }}
              >
                Page {currentIndex + 1} / {idioms.length}
              </p>
            </div>

            {/* the notebook page */}
            <div
              className="relative p-6 md:p-8 overflow-hidden"
              style={{
                background: 'linear-gradient(160deg, #fbf6ea 0%, #f6ecd6 100%)',
                borderRadius: '4px',
                boxShadow: '0 20px 45px rgba(0,0,0,0.3), inset 0 0 30px rgba(139,100,50,0.05)',
                backgroundImage: `
                  repeating-linear-gradient(180deg, transparent 0px, transparent 27px, rgba(120,150,180,0.16) 27px, rgba(120,150,180,0.16) 28px)
                `,
              }}
            >
              {/* red margin line */}
              <div
                className="absolute top-0 bottom-0"
                style={{ left: '34px', width: '1px', background: 'rgba(180,60,60,0.2)' }}
              />
              {/* torn corner */}
              <div
                className="absolute top-0 right-0"
                style={{
                  width: 0,
                  height: 0,
                  borderStyle: 'solid',
                  borderWidth: '0 26px 26px 0',
                  borderColor: 'transparent #d9c6a0 transparent transparent',
                  opacity: 0.5,
                }}
              />
              <CoffeeStain style={{ bottom: '-12px', right: '30px', opacity: 0.35 }} />

              <div className="pl-6">
                <p
                  className="mb-1"
                  style={{
                    fontFamily: "'Caveat', cursive",
                    color: '#6b5344',
                    fontSize: '18px',
                  }}
                >
                  guess the muhavra:
                </p>

                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-6"
                >
                  <div
                    className="inline-block px-8 py-5"
                    style={{
                      border: '2px dashed rgba(139,90,43,0.35)',
                      borderRadius: '10px',
                      transform: 'rotate(-1deg)',
                    }}
                  >
                    <div style={{ fontSize: '52px', letterSpacing: '0.15em' }}>
                      {idioms[currentIndex].emoji}
                    </div>
                  </div>
                </motion.div>

                <p
                  className="mb-3 text-center"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontStyle: 'italic',
                    color: '#a3835a',
                    fontSize: '13px',
                  }}
                >
                  rub the faded ink to read each line
                </p>

                <div className="space-y-3">
                  {shuffledOptions.map((option, idx) => {
                    const isSelected = selectedOption === option;
                    const showCorrect = isSelected && isCorrect;
                    const showWrong = isSelected && !isCorrect;
                    const revealed = revealState[idx];

                    return (
                      <button
                        key={idx}
                        onClick={() => handleOptionClick(option)}
                        onMouseDown={() => handleRevealStart(idx)}
                        onTouchStart={() => handleRevealStart(idx)}
                        disabled={selectedOption !== null}
                        className="w-full text-left px-4 py-3 relative"
                        style={{
                          background: showCorrect
                            ? 'rgba(139, 170, 110, 0.12)'
                            : showWrong
                            ? 'rgba(180, 60, 60, 0.08)'
                            : 'rgba(255,255,255,0.35)',
                          border: showCorrect
                            ? '1px solid rgba(90,130,70,0.4)'
                            : showWrong
                            ? '1px solid rgba(180,60,60,0.4)'
                            : '1px solid rgba(139,100,50,0.2)',
                          borderRadius: '3px',
                          cursor: selectedOption === null ? 'pointer' : 'default',
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: '16px',
                            color: showWrong ? '#a83232' : '#3d2817',
                            opacity: revealed || isSelected ? 1 : 0.35,
                            filter: revealed || isSelected ? 'blur(0px)' : 'blur(3px)',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          {option}
                        </span>

                        {showCorrect && (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-1"
                            style={{ fontFamily: "'Caveat', cursive", color: '#5c7a3f', fontSize: '15px' }}
                          >
                            Correct! Memory restored. — {idioms[currentIndex].description}
                          </motion.p>
                        )}
                        {showWrong && (
                          <motion.p
                            initial={{ opacity: 0, rotate: -8 }}
                            animate={{ opacity: 1, rotate: 0 }}
                            className="mt-1"
                            style={{ fontFamily: "'Caveat', cursive", color: '#a83232', fontSize: '15px' }}
                          >
                            ✗ try again next time.
                          </motion.p>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        ) : showPasskeyReveal ? (
          <motion.div
            key="passkey"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center"
          >
            <InkStamp word={PASSKEY_WORD} />
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="mt-6 text-center"
              style={{ fontFamily: "'Cormorant Garamond', serif", color: '#e8d3ad', fontSize: '20px' }}
            >
              Diary restored.
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.75 }}
              transition={{ delay: 1.3 }}
              style={{ fontFamily: "'Caveat', cursive", color: '#c9ab7a', fontSize: '17px', marginTop: '4px' }}
            >
              One word of the surprise has been found.
            </motion.p>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-sm mx-auto p-8 text-center"
            style={{
              background: 'linear-gradient(160deg, #fbf6ea 0%, #f6ecd6 100%)',
              borderRadius: '4px',
              boxShadow: '0 20px 45px rgba(0,0,0,0.3)',
            }}
          >
            <h2
              className="mb-4"
              style={{
                color: '#3d2817',
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 600,
                fontSize: '26px',
              }}
            >
              {score >= 7 ? 'Diary Restored' : 'Some pages are still missing.'}
            </h2>
            <p
              className="mb-6"
              style={{ color: '#6b5344', fontFamily: "'Caveat', cursive", fontSize: '19px' }}
            >
              {score} / {idioms.length} remembered correctly
            </p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleFinalResult}
              className="w-full py-3 px-6"
              style={{
                backgroundColor: '#8b5a2b',
                color: '#f9f5f0',
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 600,
                fontSize: '15px',
                borderRadius: '4px',
                border: 'none',
                letterSpacing: '0.04em',
                cursor: 'pointer',
              }}
            >
              {score >= 7 ? 'Continue' : 'Try Again'}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;600&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&display=swap');
      `}</style>
    </div>
  );
};

export default MuhavaraDiaryGame;