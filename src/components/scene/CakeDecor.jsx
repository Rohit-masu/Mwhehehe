import { useState } from "react";
import { motion } from "framer-motion";
import cakeImage from "../../assets/images/cake.webp";
import "./DeskScene.css";

export default function CakeDecor({ onWish }) {
  const [isWishing, setIsWishing] = useState(false);

  const handleCakeClick = () => {
    // spam clicks avoid
    if (isWishing) return;

    setIsWishing(true);

    // Later DeskScene ko signal dega
    onWish?.();

    // Cake ka local effect reset
    setTimeout(() => {
      setIsWishing(false);
    }, 4200);
  };

  return (
    <motion.div
      className={`cake-decor ${isWishing ? "is-wishing" : ""}`}
      initial={{
        opacity: 0,
        y: 20,
        rotate: -3,
      }}
      animate={{
        opacity: 1,
        y: 0,
        rotate: -2,
      }}
      transition={{
        duration: 0.9,
        ease: "easeOut",
      }}
    >
      <motion.button
        type="button"
        className="cake-decor__button"
        onClick={handleCakeClick}
        whileHover={{
          scale: 1.025,
          rotate: -0.5,
        }}
        whileTap={{
          scale: 0.97,
        }}
        aria-label="Make a birthday wish"
      >
        <img
          src={cakeImage}
          alt="Chocolate birthday cake"
          className="cake-decor__image"
          draggable="false"
        />
      </motion.button>
    </motion.div>
  );
}