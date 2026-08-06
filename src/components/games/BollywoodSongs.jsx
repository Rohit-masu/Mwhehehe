import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const songs = [
  {
    title: 'Tujhe Dekha Toh Ye Jana Sanam',
    artist: 'Kumar Sanu, Alka Yagnik',
    audio: '/audio/song1.mp3',
    options: ['Tujhe Dekha Toh Ye Jana Sanam', 'Dil Dheela Hoja Gaya', 'Maine Tujhe Hardam Pukaara', 'Jab Koi Baat Bigar Jaye']
  },
  {
    title: 'Kuch Kuch Hota Hai',
    artist: 'Udit Narayan, Alka Yagnik',
    audio: '/audio/song2.mp3',
    options: ['Kuch Kuch Hota Hai', 'Bole Chudiyan', 'Say Shava Shava', 'Koi Mil Gaya']
  },
  {
    title: 'Suraj Hua Maddham',
    artist: 'Sonu Nigam, Alka Yagnik',
    audio: '/audio/song3.mp3',
    options: ['Suraj Hua Maddham', 'You Are My Soniya', 'Deewana Hai Dekho', 'Kal Ho Naa Ho']
  },
  {
    title: 'Bole Chudiyan',
    artist: 'Alka Yagnik, Sonu Nigam',
    audio: '/audio/song4.mp3',
    options: ['Bole Chudiyan', 'Say Shava Shava', 'Yeh Ladka Hai Allah', 'Maahi Ve']
  },
  {
    title: 'Kal Ho Naa Ho',
    artist: 'Sonu Nigam',
    audio: '/audio/song5.mp3',
    options: ['Kal Ho Naa Ho', 'Pretty Woman', 'Kuch To Hua Hai', "It's The Time To Disco"]
  }
];

const archivePanelStyle = {
  backgroundColor: '#f9f5f0',
  backgroundImage: `
    linear-gradient(135deg, rgba(212, 175, 140, 0.04) 0%, transparent 50%),
    url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='songtexture'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.06' numOctaves='3' /%3E%3C/filter%3E%3Crect width='200' height='200' fill='%23f9f5f0' filter='url(%23songtexture)' opacity='0.35'/%3E%3C/svg%3E")
  `,
  border: '2px solid rgba(164, 100, 70, 0.3)',
  boxShadow: '0 20px 40px rgba(61, 40, 23, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
};

const inkTextStyle = { color: '#3d2817', fontFamily: "'Crimson Text', serif" };
const mutedTextStyle = { color: '#6b5344', fontFamily: "'EB Garamond', serif" };

// ---- SVG ICONS (replacing emojis) ----
const VinylIcon = ({ spinning }) => (
  <motion.svg
    animate={{ rotate: spinning ? 360 : 0 }}
    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
    width="72" height="72" viewBox="0 0 72 72"
  >
    <circle cx="36" cy="36" r="34" fill="#2b1d14" />
    <circle cx="36" cy="36" r="34" stroke="#c9a574" strokeWidth="1" opacity="0.4" />
    <circle cx="36" cy="36" r="26" stroke="#5a3d24" strokeWidth="0.6" fill="none" opacity="0.6" />
    <circle cx="36" cy="36" r="20" stroke="#5a3d24" strokeWidth="0.6" fill="none" opacity="0.5" />
    <circle cx="36" cy="36" r="14" stroke="#5a3d24" strokeWidth="0.6" fill="none" opacity="0.4" />
    <circle cx="36" cy="36" r="9" fill="#c9a574" />
    <circle cx="36" cy="36" r="2.5" fill="#2b1d14" />
  </motion.svg>
);

const NoteIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M9 18V6l10-2v10" stroke="#f9f5f0" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="6.5" cy="18" r="2.5" fill="#f9f5f0" />
    <circle cx="16.5" cy="16" r="2.5" fill="#f9f5f0" />
  </svg>
);

const MutedNoteIcon = () => (
  <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
    <path d="M9 18V6l10-2v10" stroke="#a4643f" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="6.5" cy="18" r="2.5" stroke="#a4643f" strokeWidth="1.4" fill="none" />
    <circle cx="16.5" cy="16" r="2.5" stroke="#a4643f" strokeWidth="1.4" fill="none" />
    <line x1="3" y1="3" x2="21" y2="21" stroke="#a4643f" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

const TrebleClefIcon = () => (
  <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
    <path
      d="M13 3c-1.8 1-3 2.6-3 4.6 0 1.3.5 2.3 1.4 3.6-1.9 1.8-3.4 3.4-3.4 5.8 0 2.2 1.7 3.9 3.9 3.9 2.1 0 3.6-1.5 3.6-3.4 0-1.6-1-2.7-2.4-3.1V8.2c1.1.5 1.8 1.5 1.8 2.7"
      stroke="#c9a574" strokeWidth="1.3" fill="none" strokeLinecap="round" strokeLinejoin="round"
    />
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

const BollywoodSongs = ({ onWin, onBack }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [showFragmentReveal, setShowFragmentReveal] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const audioRef = useRef(null);

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setTimeout(() => {
              if (audioRef.current) {
                audioRef.current.pause();
                setIsPlaying(false);
              }
            }, 10000);
          })
          .catch((error) => {
            console.error('Playback failed:', error);
            alert("Audio file not found! Please ensure your MP3 files are in the 'public/audio/' folder named song1.mp3, song2.mp3, etc.");
          });
      }
    }
  };

  const handleOptionClick = (option) => {
    if (selectedOption !== null) return;
    setSelectedOption(option);
    const correct = option === songs[currentIndex].title;
    setIsCorrect(correct);
    if (correct) setScore((s) => s + 1);

    setTimeout(() => {
      if (currentIndex < songs.length - 1) {
        setCurrentIndex((i) => i + 1);
        setSelectedOption(null);
        setIsCorrect(null);
      } else {
        setShowResult(true);
      }
    }, 1500);
  };

  const handleFinalResult = useCallback(() => {
    if (score >= 4) {
      setShowResult(false);
      setShowFragmentReveal(true);
      setTimeout(() => {
        onWin('hate');
      }, 4500);
    } else {
      setCurrentIndex(0);
      setScore(0);
      setShowResult(false);
      setSelectedOption(null);
      setIsCorrect(null);
    }
  }, [score, onWin]);

  return (
    <div className="w-full min-h-full px-2 py-3 overflow-visible relative flex items-center justify-center">
      <AnimatePresence mode="wait">
        {!showResult && !showFragmentReveal ? (
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
                Song {currentIndex + 1}/{songs.length}
              </div>
            </div>

            <div
              className="p-6 md:p-8 rounded-[14px]"
              style={archivePanelStyle}
            >
              <div className="flex flex-col items-center text-center">
                <motion.div
                  className="w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center mb-6 md:mb-8 shadow-xl relative"
                  style={{ boxShadow: '0 12px 28px rgba(139, 90, 43, 0.28)' }}
                >
                  <VinylIcon spinning={isPlaying} />
                  {isPlaying && (
                    <motion.div
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="absolute inset-0 rounded-full"
                      style={{ border: '3px solid #c9a574' }}
                    />
                  )}
                </motion.div>

                <button
                  onClick={playAudio}
                  disabled={isPlaying || selectedOption !== null}
                  className="mb-6 md:mb-8 px-6 md:px-10 py-3 md:py-5 rounded-full text-sm md:text-lg shadow-lg transition-all transform active:scale-95 disabled:cursor-not-allowed flex items-center gap-2"
                  style={{
                    backgroundColor: isPlaying ? '#a4643f' : '#8b5a2b',
                    color: '#f9f5f0',
                    fontFamily: "'Crimson Text', serif",
                    opacity: isPlaying ? 0.85 : 1,
                    boxShadow: '0 10px 22px rgba(139, 90, 43, 0.22)',
                  }}
                >
                  <NoteIcon />
                  {isPlaying ? 'Listening...' : 'Play Clip (10s)'}
                </button>

                <audio ref={audioRef} src={songs[currentIndex].audio} />

                <div className="grid grid-cols-1 gap-3 w-full">
                  {songs[currentIndex].options.map((option, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleOptionClick(option)}
                      disabled={selectedOption !== null}
                      className="p-3 md:p-4 rounded-lg text-sm md:text-base transition-all duration-300 disabled:cursor-not-allowed text-left"
                      style={{
                        background:
                          selectedOption === option
                            ? isCorrect
                              ? 'linear-gradient(135deg, #f7f0e4 0%, rgba(201, 165, 116, 0.45) 100%)'
                              : 'linear-gradient(135deg, #f7f0e4 0%, rgba(164, 100, 70, 0.28) 100%)'
                            : selectedOption !== null && option === songs[currentIndex].title
                            ? 'linear-gradient(135deg, #f7f0e4 0%, rgba(201, 165, 116, 0.28) 100%)'
                            : 'linear-gradient(135deg, #faf6f1 0%, #f5ede4 100%)',
                        color: selectedOption === option && !isCorrect ? '#8d3c3c' : '#3d2817',
                        border:
                          selectedOption === option
                            ? isCorrect
                              ? '2px solid #c9a574'
                              : '2px solid #a4643f'
                            : selectedOption !== null && option === songs[currentIndex].title
                            ? '2px solid #c9a574'
                            : '2px solid rgba(164, 100, 70, 0.22)',
                        fontFamily: "'Crimson Text', serif",
                      }}
                    >
                      {option}
                    </motion.button>
                  ))}
                </div>

                <p className="mt-5 md:mt-6 italic text-xs md:text-sm" style={mutedTextStyle}>
                  Tip: Listen carefully to the melody!
                </p>
              </div>

              <div
                className="mt-6 md:mt-8 w-full h-2 rounded-full overflow-hidden"
                style={{ backgroundColor: 'rgba(212, 175, 140, 0.2)', border: '1px solid rgba(212, 175, 140, 0.35)' }}
              >
                <motion.div
                  className="h-full"
                  animate={{ width: `${((currentIndex + 1) / songs.length) * 100}%` }}
                  style={{ background: 'linear-gradient(90deg, #8b5a2b 0%, #d4af8a 50%, #8b5a2b 100%)' }}
                />
              </div>
            </div>
          </motion.div>
        ) : showFragmentReveal ? (
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
                      letterSpacing: '0.15em',
                    }}
                  >
                    hate
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
                A melody of the past has awakened...
              </p>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 w-full max-w-md mx-auto p-6 md:p-8 rounded-[14px] text-center"
            style={archivePanelStyle}
          >
            <h2 className="text-3xl md:text-4xl mb-5 md:mb-6 font-light" style={{ color: '#8b5a2b', fontFamily: "'Crimson Text', serif" }}>
              Music Master
            </h2>
            <div className="flex justify-center mb-5 md:mb-6">
              {score >= 4 ? <TrebleClefIcon /> : <MutedNoteIcon />}
            </div>
            <p className="text-lg md:text-2xl mb-6 md:mb-8" style={inkTextStyle}>
              Correct Guesses: <span className="font-bold" style={{ color: '#a4643f' }}>{score}</span>/{songs.length}
            </p>

            {score >= 4 ? (
              <div>
                <p className="text-sm md:text-lg mb-6 md:mb-8 italic" style={mutedTextStyle}>
                  Wah! Your Bollywood knowledge is legendary. Here is the next fragment.
                </p>
                <button
                  onClick={handleFinalResult}
                  className="w-full text-base md:text-xl py-3 md:py-4 rounded-lg transition-all shadow-lg"
                  style={{ backgroundColor: '#8b5a2b', color: '#f9f5f0', fontFamily: "'Crimson Text', serif" }}
                >
                  Reveal Fragment
                </button>
              </div>
            ) : (
              <div>
                <p className="text-sm md:text-lg mb-6 md:mb-8 italic" style={mutedTextStyle}>
                  Not quite a melody expert yet! Need 4/5 to unlock the fragment.
                </p>
                <button
                  onClick={handleFinalResult}
                  className="w-full text-base md:text-xl py-3 md:py-4 rounded-lg transition-all shadow-lg"
                  style={{ backgroundColor: '#a4643f', color: '#f9f5f0', fontFamily: "'Crimson Text', serif" }}
                >
                  Try Again
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Cinzel+Decorative:wght@400;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&family=EB+Garamond:ital,wght@0,400;0,600;1,400&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&display=swap');
      `}</style>
    </div>
  );
};

export default BollywoodSongs;