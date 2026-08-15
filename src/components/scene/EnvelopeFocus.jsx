import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

import letterImage from "../../assets/images/letter.webp";

import "./EnvelopeFocus.css";

const OPENING_DURATION = 720;
const SEAL_BREAK_DURATION = 280;
const LETTER_REVEAL_DELAY = 220;
const EXTRACTION_DURATION = 460;
const TARGET_PHRASE = "I HATE DAAL CHAWAL";

function normalizePhrase(value) {
  return value.trim().replace(/\s+/g, " ").toUpperCase();
}

export default function EnvelopeFocus({ onClose }) {
  const [phrase, setPhrase] = useState("");
  const [hasPhraseError, setHasPhraseError] = useState(false);
  const [isTapeRemoved, setIsTapeRemoved] = useState(false);
  const [sealState, setSealState] = useState("sealed");
  const [letterStage, setLetterStage] = useState("hidden");
  const phraseInputRef = useRef(null);
  const sealTimerRef = useRef(null);
  const flapTimerRef = useRef(null);
  const letterTimerRef = useRef(null);
  const extractionTimerRef = useRef(null);

  const clearTimers = useCallback(() => {
    if (sealTimerRef.current) {
      window.clearTimeout(sealTimerRef.current);
    }

    if (flapTimerRef.current) {
      window.clearTimeout(flapTimerRef.current);
    }

    if (letterTimerRef.current) {
      window.clearTimeout(letterTimerRef.current);
    }

    if (extractionTimerRef.current) {
      window.clearTimeout(extractionTimerRef.current);
    }
  }, []);

  const handleBack = useCallback(() => {
    if (letterStage === "expanded" || letterStage === "extracting") {
      clearTimers();
      setLetterStage("peeking");
      return;
    }

    onClose();
  }, [clearTimers, letterStage, onClose]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        handleBack();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleBack]);

  useEffect(() => clearTimers, [clearTimers]);

  useEffect(() => {
    if (sealState === "prompt") {
      phraseInputRef.current?.focus();
    }
  }, [sealState]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (sealState !== "prompt") return;

    if (normalizePhrase(phrase) !== TARGET_PHRASE) {
      setHasPhraseError(true);
      return;
    }

    setHasPhraseError(false);
    setIsTapeRemoved(true);
    setSealState("unlocked");
  };

  const handleSealClick = () => {
    if (sealState === "sealed") {
      setSealState("prompt");
      return;
    }

    if (sealState !== "unlocked") return;

    clearTimers();
    setSealState("breaking");

    sealTimerRef.current = window.setTimeout(() => {
      setSealState("flap-opening");
    }, SEAL_BREAK_DURATION);

    flapTimerRef.current = window.setTimeout(() => {
      setSealState("flap-open");
    }, SEAL_BREAK_DURATION + OPENING_DURATION);

    letterTimerRef.current = window.setTimeout(() => {
      setLetterStage("peeking");
    }, SEAL_BREAK_DURATION + OPENING_DURATION + LETTER_REVEAL_DELAY);
  };

  const handleTapeClick = () => {
    if (isTapeRemoved || sealState !== "sealed") return;

    setSealState("prompt");
  };

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      handleBack();
    }
  };

  const handleLetterClick = () => {
    if (letterStage !== "peeking") return;

    setLetterStage("extracting");
    extractionTimerRef.current = window.setTimeout(() => {
      setLetterStage("expanded");
    }, EXTRACTION_DURATION);
  };

  const isLetterExpanded = letterStage === "expanded";
  const isPhraseVisible = sealState === "prompt";
  const isFlapOpen =
    sealState === "flap-opening" || sealState === "flap-open";

  return (
    <motion.section
      className="envelope-focus"
      role="dialog"
      aria-modal="true"
      aria-label="Sealed envelope"
      onClick={handleBackdropClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.32, ease: "easeOut" }}
    >
      <motion.div
        className="envelope-focus__stage"
        initial={{ opacity: 0, scale: 0.84, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 16 }}
        transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
      >
        <button
          type="button"
          className="envelope-focus__close"
          onClick={handleBack}
          aria-label={isLetterExpanded ? "Return letter to envelope" : "Return to diary"}
        >
          {isLetterExpanded ? "← envelope" : "← diary"}
        </button>

        <div className="envelope-focus__glow" />

        <div
          className={`envelope-focus__envelope ${
            isFlapOpen ? "is-flap-open" : ""
          } ${sealState === "flap-open" ? "is-flap-finished" : ""} ${
            isTapeRemoved ? "" : "has-tape"
          }`}
        >
          <div className="envelope-focus__back" />

          {letterStage !== "hidden" && (
            <div className={`envelope-focus__letter envelope-focus__letter--${letterStage}`}>
              <motion.button
                type="button"
                className="envelope-focus__letter-paper"
                onClick={handleLetterClick}
                drag={isLetterExpanded}
                dragMomentum={false}
                dragElastic={0.12}
                whileDrag={{ scale: 1.015, cursor: "grabbing" }}
                aria-label={
                  isLetterExpanded ? "Letter sheet" : "Pull the visible letter sheet out"
                }
              >
                <img src={letterImage} alt="" draggable="false" />
              </motion.button>
            </div>
          )}

          <div className="envelope-focus__pocket">
            <div className="envelope-focus__flap-shadow" />
            <div className="envelope-focus__fold envelope-focus__fold--left" />
            <div className="envelope-focus__fold envelope-focus__fold--right" />
            <div className="envelope-focus__fold envelope-focus__fold--bottom" />
          </div>

          <div className="envelope-focus__flap" aria-hidden="true">
            <div className="envelope-focus__flap-face envelope-focus__flap-face--outer" />
            <div className="envelope-focus__flap-face envelope-focus__flap-face--inner" />
          </div>
          {!isTapeRemoved && sealState !== "prompt" && (
            <button
              type="button"
              className="envelope-focus__tape"
              onClick={handleTapeClick}
              aria-label="Remove tape to reveal the stamp"
            >
            </button>
          )}
          <button
            type="button"
            className={`envelope-focus__seal envelope-focus__seal--${sealState}`}
            onClick={handleSealClick}
            aria-label={
              sealState === "unlocked"
                ? "Open the unlocked seal"
                : "Reveal the phrase"
            }
          >
            S
          </button>

          <form
            className={`envelope-focus__phrase ${isPhraseVisible ? "is-visible" : ""} ${
              hasPhraseError ? "has-error" : ""
            }`}
            onSubmit={handleSubmit}
            aria-hidden={!isPhraseVisible}
          >
            <label htmlFor="envelope-phrase">four pieces. one thought.</label>
            <input
              ref={phraseInputRef}
              id="envelope-phrase"
              value={phrase}
              onChange={(event) => {
                setPhrase(event.target.value);
                setHasPhraseError(false);
              }}
              autoComplete="off"
              disabled={!isPhraseVisible}
              aria-label="Enter the phrase"
              aria-invalid={hasPhraseError}
            />
          </form>
        </div>
      </motion.div>
    </motion.section>
  );
}
