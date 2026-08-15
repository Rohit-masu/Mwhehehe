import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import jethalalImg from "../../assets/images/Jethalal.webp";
import dayaImg from "../../assets/images/dayaben.webp";
import bapujiImg from "../../assets/images/bapuji.webp";
import bhideImg from "../../assets/images/bhide.jpg";
import babitaImg from "../../assets/images/babita.png";
import popatImg from "../../assets/images/popatlal.jpeg";

import "./DiaryMiniGames.css";
import DiaryFragmentReveal from "./DiaryFragmentReveal";

const PAIRS = [
  { id: "jethalal", image: jethalalImg, label: "Jetha" },
  { id: "daya", image: dayaImg, label: "Daya" },
  { id: "bapuji", image: bapujiImg, label: "Bapuji" },
  { id: "bhide", image: bhideImg, label: "Bhide" },
  { id: "babita", image: babitaImg, label: "Babita" },
  { id: "popatlal", image: popatImg, label: "Popatlal" },
];

function shuffleArray(array) {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));

    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

function createDeck() {
  return shuffleArray(
    PAIRS.flatMap((card) => [
      {
        ...card,
        uniqueId: `${card.id}-a`,
      },
      {
        ...card,
        uniqueId: `${card.id}-b`,
      },
    ])
  );
}

export default function CardMatch({
  isActive = false,
  onLockChange,
  onComplete,
}) {
  const [cards, setCards] = useState(() => createDeck());
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedIds, setMatchedIds] = useState([]);
  const [finished, setFinished] = useState(false);

  const completionReportedRef = useRef(false);
  const mismatchTimeoutRef = useRef(null);

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
    onComplete?.("Daal");
  }, [finished, onComplete]);

  useEffect(() => {
    return () => {
      if (mismatchTimeoutRef.current) {
        clearTimeout(mismatchTimeoutRef.current);
      }
    };
  }, []);

  const resetGame = useCallback(() => {
    if (mismatchTimeoutRef.current) {
      clearTimeout(mismatchTimeoutRef.current);
    }

    completionReportedRef.current = false;
    setCards(createDeck());
    setFlippedCards([]);
    setMatchedIds([]);
    setFinished(false);
  }, []);

  const handleCardClick = (card) => {
    const alreadyFlipped = flippedCards.some(
      (flippedCard) => flippedCard.uniqueId === card.uniqueId
    );
    const alreadyMatched = matchedIds.includes(card.id);

    if (
      finished ||
      alreadyFlipped ||
      alreadyMatched ||
      flippedCards.length === 2
    ) {
      return;
    }

    const nextFlippedCards = [...flippedCards, card];
    setFlippedCards(nextFlippedCards);

    if (nextFlippedCards.length !== 2) {
      return;
    }

    const [firstCard, secondCard] = nextFlippedCards;

    if (firstCard.id === secondCard.id) {
      const nextMatchedIds = [...matchedIds, firstCard.id];

      setMatchedIds(nextMatchedIds);
      setFlippedCards([]);

      if (nextMatchedIds.length === PAIRS.length) {
        setTimeout(() => setFinished(true), 450);
      }

      return;
    }

    mismatchTimeoutRef.current = setTimeout(() => {
      setFlippedCards([]);
    }, 650);
  };

  return (
    <section
      className="diary-mini-game card-match-game"
      onPointerDownCapture={(event) => event.stopPropagation()}
      onMouseDownCapture={(event) => event.stopPropagation()}
      onTouchStartCapture={(event) => event.stopPropagation()}
    >
      <AnimatePresence mode="wait">
        {!finished ? (
          <motion.div
            key="card-game"
            className="diary-mini-game__screen"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <header className="diary-mini-game__header">
              <span className="diary-mini-game__kicker">chapter iii · Gokuldham drawer</span>
              <h2>Gokuldham Memory Drawer</h2>
              <p>Turn over two familiar faces at a time.</p>
            </header>

            <div className="diary-mini-game__progress">
              <span />
              <small>
                {String(matchedIds.length).padStart(2, "0")}
                {" / "}
                {String(PAIRS.length).padStart(2, "0")}
              </small>
              <span />
            </div>

            <div className="card-match-grid">
              {cards.map((card) => {
                const isFlipped =
                  flippedCards.some(
                    (flippedCard) => flippedCard.uniqueId === card.uniqueId
                  ) || matchedIds.includes(card.id);

                return (
                  <button
                    key={card.uniqueId}
                    type="button"
                    className={[
                      "card-match-card",
                      isFlipped ? "card-match-card--flipped" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    onClick={() => handleCardClick(card)}
                    aria-label={`Match ${card.label}`}
                  >
                    <motion.span
                      className="card-match-card__inner"
                      animate={{ rotateY: isFlipped ? 180 : 0 }}
                      transition={{ duration: 0.28 }}
                    >
                      <span className="card-match-card__front">TM</span>
                      <span className="card-match-card__back">
                        <img src={card.image} alt={card.label} />
                      </span>
                    </motion.span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              className="diary-mini-game__small-action"
              onClick={resetGame}
            >
              reshuffle
            </button>
          </motion.div>
        ) : (
          <DiaryFragmentReveal
            key="card-finished"
            title="Gokuldham remembered."
            body="This tiny stack of cards kept a word hidden."
            clue="Daal"
          >
          </DiaryFragmentReveal>
        )}
      </AnimatePresence>
    </section>
  );
}
