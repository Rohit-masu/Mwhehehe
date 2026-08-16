import { useRef, useState } from "react";
import { motion } from "framer-motion";
import "./DeskScene.css";

import oldSongTrack from "../../assets/audio/old-song.mp3";

export default function VintageCassette() {
  const audioRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [audioError, setAudioError] = useState(false);

  const toggleAudio = async () => {
    const audio = audioRef.current;

    if (!audio) {
      console.error("Audio element not available");
      return;
    }

    try {
      setAudioError(false);

      if (audio.paused) {
        await audio.play();
      } else {
        audio.pause();
      }
    } catch (error) {
      console.error("Unable to play cassette audio:", error);
      setAudioError(true);
    }
  };

  return (
    <motion.div
      className="vintage-cassette"
      initial={{
        opacity: 0,
        x: 25,
        rotate: 8,
      }}
      animate={{
        opacity: 1,
        x: 0,
        rotate: 7,
      }}
      transition={{
        duration: 0.7,
        ease: "easeOut",
      }}
    >
      <audio
        ref={audioRef}
        src={oldSongTrack}
        preload="none"
        loop
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={(event) => {
          console.error(
            "Cassette audio load error:",
            event.currentTarget.error
          );
          setAudioError(true);
        }}
      />

      <div className="vintage-cassette__face">
      <div className="cassette-screw cassette-screw--tl" />
      <div className="cassette-screw cassette-screw--tr" />
      <div className="cassette-screw cassette-screw--bl" />
      <div className="cassette-screw cassette-screw--br" />

      <div className="cassette-label">
        <span className="cassette-label__side">
          SIDE A
        </span>

        <span className="cassette-label__title">
          Old Songs
        </span>

        <span className="cassette-label__subtitle">
          90s • rewind & remember
        </span>
      </div>

      <div className="cassette-window">
        <motion.div
          className="cassette-reel"
          animate={
            isPlaying
              ? { rotate: 360 }
              : { rotate: 0 }
          }
          transition={
            isPlaying
              ? {
                  duration: 2.2,
                  repeat: Infinity,
                  ease: "linear",
                }
              : {
                  duration: 0.2,
                }
          }
        />

        <div className="cassette-tape">
          <div className="cassette-tape__line" />
        </div>

        <motion.div
          className="cassette-reel"
          animate={
            isPlaying
              ? { rotate: -360 }
              : { rotate: 0 }
          }
          transition={
            isPlaying
              ? {
                  duration: 2.2,
                  repeat: Infinity,
                  ease: "linear",
                }
              : {
                  duration: 0.2,
                }
          }
        />
      </div>

      <div className="cassette-deck">
        <button
          type="button"
          className={`cassette-btn cassette-btn--play ${
            isPlaying ? "is-active" : ""
          }`}
          onClick={toggleAudio}
          aria-label={isPlaying ? "Pause tape" : "Play tape"}
        >
          {isPlaying ? (
            <span className="icon-pause">
              <span />
              <span />
            </span>
          ) : (
            <span className="icon-play" />
          )}
        </button>

        <div className="cassette-deck__vents">
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>

      {audioError && (
        <div className="cassette-error">
          audio unavailable
        </div>
      )}
      </div>
    </motion.div>
  );
}
