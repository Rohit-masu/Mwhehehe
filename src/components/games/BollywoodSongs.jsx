import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import "./DiaryMiniGames.css";
import DiaryFragmentReveal from "./DiaryFragmentReveal";

const songs = [
  {
    title: "Tujhe Dekha Toh Ye Jana Sanam",
    artist: "Kumar Sanu, Alka Yagnik",
    audio: "/audio/song1.mp3",
    options: [
      "Tujhe Dekha Toh Ye Jana Sanam",
      "Dil Dheela Hoja Gaya",
      "Maine Tujhe Hardam Pukaara",
      "Jab Koi Baat Bigar Jaye",
    ],
  },
  {
    title: "Kuch Kuch Hota Hai",
    artist: "Udit Narayan, Alka Yagnik",
    audio: "/audio/song2.mp3",
    options: ["Kuch Kuch Hota Hai", "Bole Chudiyan", "Say Shava Shava", "Koi Mil Gaya"],
  },
  {
    title: "Suraj Hua Maddham",
    artist: "Sonu Nigam, Alka Yagnik",
    audio: "/audio/song3.mp3",
    options: ["Suraj Hua Maddham", "You Are My Soniya", "Deewana Hai Dekho", "Kal Ho Naa Ho"],
  },
  {
    title: "Bole Chudiyan",
    artist: "Alka Yagnik, Sonu Nigam",
    audio: "/audio/song4.mp3",
    options: ["Bole Chudiyan", "Say Shava Shava", "Yeh Ladka Hai Allah", "Maahi Ve"],
  },
  {
    title: "Kal Ho Naa Ho",
    artist: "Sonu Nigam",
    audio: "/audio/song5.mp3",
    options: ["Kal Ho Naa Ho", "Pretty Woman", "Kuch To Hua Hai", "It's The Time To Disco"],
  },
];

export default function BollywoodSongs({
  isActive = false,
  onLockChange,
  onComplete,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [showFragmentReveal, setShowFragmentReveal] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const audioRef = useRef(null);
  const completionReportedRef = useRef(false);

  useEffect(() => {
    if (!isActive || showFragmentReveal) {
      onLockChange?.(false);
      return undefined;
    }

    onLockChange?.(true);
    return () => onLockChange?.(false);
  }, [isActive, onLockChange, showFragmentReveal, showResult]);

  useEffect(() => {
    return () => audioRef.current?.pause();
  }, []);

  useEffect(() => {
    if (!showFragmentReveal || completionReportedRef.current) return;

    completionReportedRef.current = true;
    onComplete?.("Hate");
  }, [onComplete, showFragmentReveal]);

  const toggleAudio = () => {
    const audio = audioRef.current;
    if (!audio || selectedOption !== null) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    if (audio.ended) audio.currentTime = 0;
    audio
      .play()
      .then(() => {
        setIsPlaying(true);
        window.setTimeout(() => {
          audio.pause();
          audio.currentTime = 0;
          setIsPlaying(false);
        }, 10000);
      })
      .catch(() => {
        setIsPlaying(false);
      });
  };

  const handleOptionClick = (option) => {
    if (selectedOption !== null) return;

    const correct = option === songs[currentIndex].title;
    setSelectedOption(option);
    setIsCorrect(correct);
    audioRef.current?.pause();
    setIsPlaying(false);
    if (correct) setScore((previousScore) => previousScore + 1);

    window.setTimeout(() => {
      if (currentIndex < songs.length - 1) {
        setCurrentIndex((index) => index + 1);
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
      return;
    }

    setCurrentIndex(0);
    setScore(0);
    setShowResult(false);
    setSelectedOption(null);
    setIsCorrect(null);
  }, [score]);

  const song = songs[currentIndex];

  return (
    <section className="diary-mini-game bollywood-game">
      <AnimatePresence mode="wait">
        {!showResult && !showFragmentReveal && (
          <motion.div
            key="song-game"
            className="diary-mini-game__screen"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
          >
            <header className="diary-mini-game__header">
              <span className="diary-mini-game__kicker">chapter ii · music memory</span>
              <h2>Bollywood Music</h2>
              <p>Listen to a familiar voice and name the song.</p>
            </header>

            <div className="diary-mini-game__progress">
              <span />
              <small>song {currentIndex + 1} / {songs.length}</small>
              <span />
            </div>

            <div className="bollywood-player">
              <button
                type="button"
                className={`bollywood-player__disc ${isPlaying ? "is-playing" : ""}`}
                onClick={toggleAudio}
                disabled={selectedOption !== null}
                aria-label={isPlaying ? "Pause song clip" : "Play song clip"}
              >
                <span>♪</span>
              </button>
              <p>
                {song.artist}
                <span>click the record to {isPlaying ? "pause" : "listen"}</span>
              </p>
              <audio ref={audioRef} src={song.audio} preload="metadata" onEnded={() => setIsPlaying(false)} />
            </div>

            <div className="diary-mini-game__options">
              {song.options.map((option, index) => {
                const selected = selectedOption === option;
                return (
                  <motion.button
                    key={option}
                    type="button"
                    disabled={selectedOption !== null}
                    onClick={() => handleOptionClick(option)}
                    whileTap={{ scale: 0.985 }}
                    className={`diary-mini-game__option ${
                      selected ? (isCorrect ? "diary-mini-game__option--correct" : "diary-mini-game__option--wrong") : ""
                    }`}
                  >
                    <span>{String.fromCharCode(65 + index)}</span>
                    <b>{option}</b>
                  </motion.button>
                );
              })}
            </div>

            <div className="diary-mini-game__feedback">
              {selectedOption && <p>{isCorrect ? "correct track." : `It was ${song.title}.`}</p>}
            </div>
          </motion.div>
        )}

        {showResult && !showFragmentReveal && (
          <motion.div key="song-result" className="diary-mini-game__finished" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <span className="diary-mini-game__kicker">music round complete</span>
            <h3>Music Master</h3>
            <p>Correct guesses: {score}/{songs.length}</p>
            <button type="button" className="diary-mini-game__continue" onClick={handleFinalResult}>
              {score >= 4 ? "Reveal Fragment" : "Try Again"}
            </button>
          </motion.div>
        )}

        {showFragmentReveal && (
          <DiaryFragmentReveal
            key="song-fragment"
            title="A melody of the past awakened."
            body="The cassette kept one word safe for you."
            clue="Hate"
          />
        )}
      </AnimatePresence>
    </section>
  );
}
