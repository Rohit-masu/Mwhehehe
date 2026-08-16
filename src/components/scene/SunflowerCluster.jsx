import { motion } from "framer-motion";
import sunflower from "../../assets/images/sunflower.webp";
import babySunflower from "../../assets/images/baby_sunflower.webp";
import "./DeskScene.css";

export default function SunflowerCluster() {
  const animateSway =
    typeof window === "undefined" || window.innerWidth >= 768;

  return (
    <motion.div
  className="sunflower-cluster"
  initial={{
    opacity: 0,
    x: 30,
    rotate: 4,
  }}
  animate={{
    opacity: 1,
    x: 0,
    rotate: animateSway ? [4, 6.5, 3, 5.5, 4] : 4,
  }}
  transition={{
    opacity: { duration: 0.8 },
    x: { duration: 0.8 },
    rotate: {
      duration: 9,
      repeat: animateSway ? Infinity : 0,
      ease: "easeInOut",
      times: [0, 0.25, 0.5, 0.75, 1],
    },
  }}
  aria-hidden="true"
>
      <img
        src={sunflower}
        alt=""
        className="sunflower-cluster__big"
        draggable="false"
      />

      <img
        src={babySunflower}
        alt=""
        className="sunflower-cluster__baby"
        draggable="false"
      />
    </motion.div>
  );
}
