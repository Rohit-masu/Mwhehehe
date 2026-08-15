import { useRef, useState } from "react";
import { motion } from "framer-motion";
import candle from "../../assets/images/candle.webp";
import "./DeskScene.css";

export default function CandleDecor() {
  const [isTapped, setIsTapped] = useState(false);
  const timeoutRef = useRef(null);

  const handleTap = () => {
    setIsTapped(true);
    window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => setIsTapped(false), 900);
  };

  return (
    <motion.div
      className={`candle-decor ${isTapped ? "is-tapped" : ""}`}
      initial={{
        opacity: 0,
        x: -24,
        y: 10,
      }}
      animate={{
        opacity: 1,
        x: 0,
        y: 0,
      }}
      transition={{
        duration: 0.8,
        ease: "easeOut",
      }}
      onClick={handleTap}
      aria-hidden="true"
    >
      <div className="candle-decor__ambient" />

      <img
        src={candle}
        alt=""
        draggable="false"
        className="candle-decor__image"
      />

      <motion.div
        className="candle-decor__flame-glow"
        animate={{
          opacity: [0.35, 0.62, 0.42, 0.58, 0.35],
          scale: [0.96, 1.05, 0.99, 1.03, 0.96],
        }}
        transition={{
          duration: 2.4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  );
}
