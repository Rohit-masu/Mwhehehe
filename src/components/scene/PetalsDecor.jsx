import { motion } from "framer-motion";
import driedPetals from "../../assets/images/dried_petals.webp";
import "./DeskScene.css";

export default function PetalsDecor() {
  return (
    <motion.div
      className="petals-decor"
      initial={{
        opacity: 0,
        x: -10,
        y: 8,
        rotate: -4,
      }}
      animate={{
        opacity: 1,
        x: 0,
        y: 0,
        rotate: -3,
      }}
      transition={{
        duration: 1.1,
        ease: "easeOut",
      }}
      aria-hidden="true"
    >
      <img
        src={driedPetals}
        alt=""
        draggable="false"
        className="petals-decor__image"
      />
    </motion.div>
  );
}