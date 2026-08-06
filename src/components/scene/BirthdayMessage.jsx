import { AnimatePresence, motion } from "framer-motion";
import "./DeskScene.css";

const sparkles = [
  { x: -145, y: -46, delay: 0.1, size: 10 },
  { x: 138, y: -52, delay: 0.35, size: 8 },
  { x: -110, y: 50, delay: 0.65, size: 9 },
  { x: 112, y: 54, delay: 0.25, size: 12 },
  { x: -175, y: 4, delay: 0.5, size: 7 },
  { x: 168, y: 7, delay: 0.8, size: 8 },
  { x: 0, y: -78, delay: 0.2, size: 9 },
  { x: 24, y: 82, delay: 0.7, size: 7 },
];

export default function BirthdayMessage({ show }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="birthday-message"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.7 },
          }}
          aria-hidden="true"
        >
          <motion.div
            className="birthday-message__wrap"
            initial={{
              opacity: 0,
              scale: 0.94,
              y: 15,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
              delay: 0.65,
              ease: "easeOut",
            }}
          >
            {sparkles.map((sparkle, index) => (
              <motion.span
                key={index}
                className="birthday-message__sparkle"
                style={{
                  width: sparkle.size,
                  height: sparkle.size,
                  left: `calc(50% + ${sparkle.x}px)`,
                  top: `calc(50% + ${sparkle.y}px)`,
                }}
                animate={{
                  opacity: [0, 1, 0.2, 1, 0],
                  scale: [0.3, 1.25, 0.7, 1, 0.3],
                  rotate: [0, 45, 80, 110],
                }}
                transition={{
                  duration: 2.3,
                  delay: sparkle.delay,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}

            <motion.span
              className="birthday-message__eyebrow"
            >
              make a wish
            </motion.span>

            <h2 className="birthday-message__text">
              Happy Birthday
            </h2>

            <motion.span
              className="birthday-message__tiny"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{
                delay: 1.4,
                duration: 0.8,
              }}
            >
              ✦ 25 August ✦
            </motion.span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}