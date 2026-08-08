import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import "./MuhavaraDiaryGame.css";
import DiaryFragmentReveal from "./DiaryFragmentReveal";

const idioms = [
  {
    emoji: "🐘🦷",
    correct: "Hathi ke dant khane ke aur dikhane ke aur",
    options: [
      "Hathi ke dant khane ke aur dikhane ke aur",
      "Bandar kya jaane adarak ka swad",
      "Thali ka baingan",
      "Oonth ke munh mein jeera",
    ],
  },

  {
    emoji: "🐒❓🫚😋",
    correct: "Bandar kya jaane adarak ka swad",
    options: [
      "Bandar kya jaane adarak ka swad",
      "Naach na jaane aangan tedha",
      "Thali ka baingan",
      "Uunchi dukan feeka pakwan",
    ],
  },

  {
    emoji: "🍽️🍆",
    correct: "Thali ka baingan",
    options: [
      "Thali ka baingan",
      "Dhobi ka kutta",
      "Ghar ki murgi dal barabar",
      "Aasmaan se gira khajoor mein atka",
    ],
  },

  {
    emoji: "🐪👄▪️",
    correct: "Oonth ke munh mein jeera",
    options: [
      "Oonth ke munh mein jeera",
      "Hathi ke dant",
      "Naach na jaane aangan tedha",
      "Ghar ki murgi dal barabar",
    ],
  },

  {
    emoji: "💃❌🏠↘️",
    correct: "Naach na jaane aangan tedha",
    options: [
      "Naach na jaane aangan tedha",
      "Thali ka baingan",
      "Bandar kya jaane adarak ka swad",
      "Khoda pahad nikli chuhiya",
    ],
  },

  {
    emoji: "🏠🐔=🍲",
    correct: "Ghar ki murgi dal barabar",
    options: [
      "Ghar ki murgi dal barabar",
      "Dhobi ka kutta",
      "Oonth ke munh mein jeera",
      "Uunchi dukan feeka pakwan",
    ],
  },

  {
    emoji: "🧺🐕🏠❌🌉❌",
    correct: "Dhobi ka kutta na ghar ka na ghat ka",
    options: [
      "Dhobi ka kutta na ghar ka na ghat ka",
      "Thali ka baingan",
      "Bandar kya jaane adarak ka swad",
      "Aasmaan se gira khajoor mein atka",
    ],
  },

  {
    emoji: "⛰️⛏️➡️🐭",
    correct: "Khoda pahad nikli chuhiya",
    options: [
      "Khoda pahad nikli chuhiya",
      "Oonth ke munh mein jeera",
      "Dhobi ka kutta",
      "Naach na jaane aangan tedha",
    ],
  },

  {
    emoji: "🏪⬆️🍽️😕",
    correct: "Uunchi dukan feeka pakwan",
    options: [
      "Uunchi dukan feeka pakwan",
      "Ghar ki murgi dal barabar",
      "Thali ka baingan",
      "Khoda pahad nikli chuhiya",
    ],
  },

  {
    emoji: "☁️⬇️🌴😵",
    correct: "Aasmaan se gira khajoor mein atka",
    options: [
      "Aasmaan se gira khajoor mein atka",
      "Dhobi ka kutta",
      "Oonth ke munh mein jeera",
      "Bandar kya jaane adarak ka swad",
    ],
  },
];

function shuffleArray(array) {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));

    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

export default function MuhavaraDiaryGame({
  isActive = false,
  onLockChange,
  onComplete,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const [options, setOptions] = useState(() => shuffleArray(idioms[0].options));

  const [selectedOption, setSelectedOption] = useState(null);

  const [isCorrect, setIsCorrect] = useState(null);

  const [finished, setFinished] = useState(false);

  const completionReportedRef = useRef(false);

  const currentQuestion = idioms[currentIndex];

  useEffect(() => {
    if (!isActive || finished) {
      onLockChange?.(false);
      return undefined;
    }

    onLockChange?.(true);

    return () => {
      onLockChange?.(false);
    };
  }, [finished, isActive, onLockChange]);

  useEffect(() => {
    if (!finished || completionReportedRef.current) {
      return;
    }

    completionReportedRef.current = true;
    onComplete?.("I");
  }, [finished, onComplete]);

  const handleOptionClick = (option) => {
    if (selectedOption) return;

    const correct = option === currentQuestion.correct;

    setSelectedOption(option);
    setIsCorrect(correct);

    setTimeout(() => {
      const isLastQuestion = currentIndex === idioms.length - 1;

      if (isLastQuestion) {
        setFinished(true);
        return;
      }

      const nextIndex = currentIndex + 1;

      setCurrentIndex(nextIndex);

      setOptions(shuffleArray(idioms[nextIndex].options));

      setSelectedOption(null);
      setIsCorrect(null);
    }, 1200);
  };

  return (
    <div className="muhavara-diary-game">
      <AnimatePresence mode="wait">
        {!finished ? (
          <motion.div
            key={`question-${currentIndex}`}
            className="muhavara-game-screen"
            initial={{
              opacity: 0,
              y: 5,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -5,
            }}
            transition={{
              duration: 0.22,
            }}
          >
            {/* HEADING */}
            <header className="muhavara-header">
              <span className="muhavara-kicker">something familiar...</span>

              <h2>कुछ बातें इशारों में...</h2>

              <p>Read the clue and trust the first thing you remember.</p>
            </header>

            {/* PROGRESS */}
            <div className="muhavara-progress">
              <span />

              <small>
                {String(currentIndex + 1).padStart(2, "0")}
                {" / "}
                {String(idioms.length).padStart(2, "0")}
              </small>

              <span />
            </div>

            {/* EMOJI */}
            <div className="muhavara-prompt">
              <span className="muhavara-prompt-note">one old saying...</span>

              <motion.div
                key={currentQuestion.emoji}
                className="muhavara-emoji"
                initial={{
                  scale: 0.92,
                  opacity: 0,
                }}
                animate={{
                  scale: 1,
                  opacity: 1,
                }}
              >
                {currentQuestion.emoji}
              </motion.div>
            </div>

            {/* OPTIONS */}
            <div className="muhavara-options">
              {options.map((option, index) => {
                const selected = selectedOption === option;

                const correct = selected && isCorrect;

                const wrong = selected && isCorrect === false;

                return (
                  <motion.button
                    key={option}
                    type="button"
                    disabled={selectedOption !== null}
                    onClick={() => {
                      handleOptionClick(option);
                    }}
                    whileTap={{
                      scale: 0.985,
                    }}
                    className={[
                      "muhavara-option",
                      correct ? "muhavara-option--correct" : "",
                      wrong ? "muhavara-option--wrong" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    <span className="muhavara-option-letter">
                      {String.fromCharCode(65 + index)}
                    </span>

                    <span className="muhavara-option-text">{option}</span>
                  </motion.button>
                );
              })}
            </div>

            {/* FEEDBACK */}
            <div className="muhavara-feedback">
              <AnimatePresence>
                {selectedOption && (
                  <motion.p
                    initial={{
                      opacity: 0,
                      y: 2,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                  >
                    {isCorrect
                      ? "yep, that's the one."
                      : `almost — it was “${currentQuestion.correct}”`}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <span className="muhavara-corner-note">no Googling ↗</span>
          </motion.div>
        ) : (
          <motion.div
            key="finished"
            className="muhavara-finished"
          >
            <DiaryFragmentReveal
              title="Well, that was nostalgic."
              body="Looks like this page had one tiny thing tucked away."
              clue="I"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
