import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import puzzleBG from '../../assets/images/puzzleBG.jpg';

const PUZZLE_SIZE = 3; // 3x3 grid
const BOARD_SIZE = 300; // 300px square
const PIECE_SIZE = BOARD_SIZE / PUZZLE_SIZE;
const SNAP_THRESHOLD = 30;

const archivePanelStyle = {
  backgroundColor: '#f9f5f0',
  backgroundImage: `
    linear-gradient(135deg, rgba(212, 175, 140, 0.04) 0%, transparent 50%),
    url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='jigsawtexture'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.06' numOctaves='3' /%3E%3C/filter%3E%3Crect width='200' height='200' fill='%23f9f5f0' filter='url(%23jigsawtexture)' opacity='0.35'/%3E%3C/svg%3E")
  `,
  border: '2px solid rgba(164, 100, 70, 0.3)',
  boxShadow: '0 20px 40px rgba(61, 40, 23, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
};

const inkTextStyle = { color: '#3d2817', fontFamily: "'EB Garamond', serif" };

// ---- SVG ICONS (replacing emojis) ----
const HeartLocketIcon = () => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
    <path
      d="M32 52C18 42 8 33 8 22.5 8 15 14 10 20.5 10c4.2 0 8.3 2.2 11.5 6.4C35.2 12.2 39.3 10 43.5 10 50 10 56 15 56 22.5 56 33 46 42 32 52Z"
      fill="rgba(201,165,116,0.18)"
      stroke="#8b5a2b"
      strokeWidth="1.6"
    />
    <path d="M22 24l6 6-6 6" stroke="#8b5a2b" strokeWidth="1.3" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
    <circle cx="32" cy="30" r="3" fill="#c9a574" />
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

const JigsawPuzzle = ({ onWin, onBack }) => {
  const [pieces, setPieces] = useState([]);
  const [isWon, setIsWon] = useState(false);
  const [showFragmentReveal, setShowFragmentReveal] = useState(false);
  const containerRef = useRef(null);

  const imageUrl = puzzleBG;

  useEffect(() => {
    initializePuzzle();
  }, []);

  const initializePuzzle = () => {
    const newPieces = [];
    for (let row = 0; row < PUZZLE_SIZE; row++) {
      for (let col = 0; col < PUZZLE_SIZE; col++) {
        const id = row * PUZZLE_SIZE + col;
        const initialX = Math.random() * 200 - 100;
        const initialY = Math.random() * 200 - 100;

        newPieces.push({
          id,
          correctX: col * PIECE_SIZE,
          correctY: row * PIECE_SIZE,
          currentX: initialX,
          currentY: initialY,
          isSnapped: false,
          bgPos: `-${col * PIECE_SIZE}px -${row * PIECE_SIZE}px`,
        });
      }
    }
    setPieces(newPieces.sort(() => Math.random() - 0.5));
    setIsWon(false);
    setShowFragmentReveal(false);
  };

  const handleDragEnd = (id, event, info) => {
    const pieceIndex = pieces.findIndex((p) => p.id === id);
    if (pieceIndex === -1 || pieces[pieceIndex].isSnapped) return;

    const piece = pieces[pieceIndex];
    const newX = piece.currentX + info.offset.x;
    const newY = piece.currentY + info.offset.y;

    const dist = Math.sqrt(Math.pow(newX - piece.correctX, 2) + Math.pow(newY - piece.correctY, 2));

    if (dist < SNAP_THRESHOLD) {
      const updatedPieces = [...pieces];
      updatedPieces[pieceIndex] = { ...piece, currentX: piece.correctX, currentY: piece.correctY, isSnapped: true };
      setPieces(updatedPieces);
      checkWin(updatedPieces);
    } else {
      const updatedPieces = [...pieces];
      updatedPieces[pieceIndex] = { ...piece, currentX: newX, currentY: newY };
      setPieces(updatedPieces);
    }
  };

  const checkWin = (currentPieces) => {
    if (currentPieces.every((p) => p.isSnapped)) {
      setTimeout(() => setIsWon(true), 500);
    }
  };

  const handleRevealFragment = useCallback(() => {
    setIsWon(false);
    setShowFragmentReveal(true);
    setTimeout(() => {
      onWin('chawal');
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
                Final Fragment
              </div>
            </div>

            <div className="p-6 md:p-8 rounded-[14px]" style={archivePanelStyle}>
              <div className="text-center mb-5 md:mb-6">
                <h2 className="text-2xl md:text-4xl font-light mb-2" style={{ color: '#8b5a2b', fontFamily: "'Crimson Text', serif" }}>
                  The Broken Picture
                </h2>
                <p className="italic text-xs md:text-base" style={{ color: '#6b5344', fontFamily: "'EB Garamond', serif" }}>
                  Drag the pieces to complete the portrait
                </p>
              </div>

              {!isWon ? (
                <div
                  ref={containerRef}
                  className="relative rounded-xl mx-auto overflow-visible"
                  style={{
                    width: BOARD_SIZE,
                    height: BOARD_SIZE,
                    maxWidth: '100%',
                    backgroundColor: 'rgba(212, 175, 140, 0.08)',
                    border: '2px dashed rgba(164, 100, 70, 0.28)',
                  }}
                >
                  <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-20">
                    {[...Array(9)].map((_, i) => (
                      <div key={i} style={{ border: '1px solid #c9a574' }} />
                    ))}
                  </div>

                  {pieces.map((piece) => (
                    <motion.div
                      key={piece.id}
                      drag={!piece.isSnapped}
                      dragMomentum={false}
                      onDragEnd={(e, info) => handleDragEnd(piece.id, e, info)}
                      initial={{ x: piece.currentX, y: piece.currentY }}
                      animate={{
                        x: piece.currentX,
                        y: piece.currentY,
                        scale: piece.isSnapped ? 1 : 1.05,
                        zIndex: piece.isSnapped ? 0 : 10,
                      }}
                      className={`absolute rounded-sm cursor-grab active:cursor-grabbing ${piece.isSnapped ? 'shadow-none' : 'shadow-lg'}`}
                      style={{
                        width: PIECE_SIZE,
                        height: PIECE_SIZE,
                        backgroundImage: `url(${imageUrl})`,
                        backgroundSize: `${BOARD_SIZE}px ${BOARD_SIZE}px`,
                        backgroundPosition: piece.bgPos,
                        touchAction: 'none',
                        border: piece.isSnapped ? 'none' : '1px solid rgba(249, 245, 240, 0.65)',
                      }}
                    >
                      {!piece.isSnapped && (
                        <div className="absolute inset-0 pointer-events-none" style={{ backgroundColor: 'rgba(201, 165, 116, 0.12)' }} />
                      )}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6 md:py-8">
                  <h2 className="text-3xl md:text-4xl font-light mb-5 md:mb-6" style={{ color: '#8b5a2b', fontFamily: "'Crimson Text', serif" }}>
                    Portrait Complete
                  </h2>
                  <div
                    className="w-48 h-48 md:w-64 md:h-64 mx-auto mb-5 md:mb-6 rounded-xl overflow-hidden shadow-2xl"
                    style={{ border: '4px solid #c9a574' }}
                  >
                    <img src={imageUrl} alt="Complete Portrait" className="w-full h-full object-cover" />
                  </div>
                  <p className="text-sm md:text-2xl mb-6 md:mb-8 px-2" style={inkTextStyle}>
                    Grown up Nikki would be so happy!
                  </p>
                  <button
                    onClick={handleRevealFragment}
                    className="w-full text-base md:text-xl py-3 md:py-4 rounded-lg transition-all shadow-lg"
                    style={{ backgroundColor: '#8b5a2b', color: '#f9f5f0', fontFamily: "'Crimson Text', serif" }}
                  >
                    Reveal Last Fragment
                  </button>
                </motion.div>
              )}

              {!isWon && (
                <div className="mt-8 md:mt-12 text-center">
                  <button
                    onClick={initializePuzzle}
                    className="px-6 md:px-8 py-2 rounded-full transition-all text-xs md:text-sm"
                    style={{
                      color: '#8b5a2b',
                      border: '2px solid #c9a574',
                      fontFamily: "'Crimson Text', serif",
                      backgroundColor: 'rgba(212, 175, 140, 0.08)',
                    }}
                  >
                    Reshuffle Pieces
                  </button>
                  <p className="mt-3 md:mt-4 text-xs" style={{ color: 'rgba(107, 83, 68, 0.75)', fontFamily: "'EB Garamond', serif" }}>
                    Tip: Drag pieces into the dotted box. They'll snap when close!
                  </p>
                </div>
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
                      fontSize: '40px',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                    }}
                  >
                    chawal
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
              <div className="flex justify-center mb-3">
                <HeartLocketIcon />
              </div>
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
                FINAL FRAGMENT RECOVERED
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
                The shattered image has been mended...
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

export default JigsawPuzzle;