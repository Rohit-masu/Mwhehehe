import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import audio1 from "../../assets/audio/agar-main-kahoon.mp3";
import audio2 from "../../assets/audio/ladki-kyon.mp3";
import audio3 from "../../assets/audio/tauba-tumhare.mp3";
import audio4 from "../../assets/audio/wo-ladki-hai-kahan.mp3";
import audio5 from "../../assets/audio/kya-mujhe-pyar.mp3";

import recordDisc from "../../assets/images/disk.webp";

import "./DiaryMiniGames.css";
import DiaryFragmentReveal from "./DiaryFragmentReveal";

const songs = [
  {
    title: "Agar Mai kahoon",
    audio: audio1,
    options: [
      "Agar Mai kahoon",
      "Dil Dheela Hoja Gaya",
      "Maine Tujhe Hardam Pukaara",
      "Jab Koi Baat Bigar Jaye",
    ],
  },
  {
    title: "Tauba Tumhare Yeh Ishaare",
    audio: audio3,
    options: ["Kuch Kuch Hota Hai", "Bole Chudiyan", "Tauba Tumhare Yeh Ishaare", "Koi Mil Gaya"],
  },
  {
    title: "Ladki Kyon",
    audio: audio2,
    options: ["Suraj Hua Maddham", "You Are My Soniya", "Deewana Hai Dekho", "Ladki Kyon"],
  },
  {
    title: "Woh Ladki Hai Kahan",
    audio: audio4,
    options: ["Bole Chudiyan", "Woh Ladki Hai Kahan", "Yeh Ladka Hai Allah", "Maahi Ve"],
  },
  {
    title: "Kya Mujhe Pyaar hai",
    audio: audio5,
    options: ["Chal Chhaiya Chhaiya", "Kya Mujhe Pyaar hai", "Kuch To Hua Hai", "It's The Time To Disco"],
  },
];

export default function BollywoodSongs({
  isActive = false,
  onLockChange,
  onComplete,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
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
  }, [isActive, onLockChange, showFragmentReveal]);

  useEffect(() => {
    const audio = audioRef.current;
    return () => audio?.pause();
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
      .then(() => setIsPlaying(true))
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

    window.setTimeout(() => {
      if (currentIndex < songs.length - 1) {
        setCurrentIndex((index) => index + 1);
        setSelectedOption(null);
        setIsCorrect(null);
      } else {
        setShowFragmentReveal(true);
      }
    }, 1500);
  };

  const song = songs[currentIndex];

  return (
    <section
      className="diary-mini-game bollywood-game"
      onPointerDownCapture={(event) => event.stopPropagation()}
      onMouseDownCapture={(event) => event.stopPropagation()}
      onTouchStartCapture={(event) => event.stopPropagation()}
    >
      <AnimatePresence mode="wait">
        {!showFragmentReveal && (
          <motion.div
            key="song-game"
            className="diary-mini-game__screen"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
          >
            <header className="diary-mini-game__header">
              <span className="diary-mini-game__kicker">chapter ii · music memory</span>
              <h2>Rewind to the 90s</h2>
              <p>Listen closely. Some songs never really leave.</p>
            </header>

            <div className="diary-mini-game__progress">
              <span />
              <small>
                song {String(currentIndex + 1).padStart(2, "0")} / {String(songs.length).padStart(2, "0")}
              </small>
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
                <img src={recordDisc} alt="" />
              </button>
              <audio
                ref={audioRef}
                src={song.audio}
                preload="metadata"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
              />
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
              {selectedOption && <p>{isCorrect ? "hmm... heard this before." : `It was ${song.title}.`}</p>}
            </div>
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
