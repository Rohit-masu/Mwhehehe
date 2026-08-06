import { motion } from "framer-motion";
import newsPaper from "../../assets/images/new_paper.webp";
import "./DeskScene.css";

export default function NewspaperNote() {
  return (
    <motion.div
      className="newspaper-note"
      initial={{
        opacity: 0,
        x: -30,
        rotate: -7,
      }}
      animate={{
        opacity: 1,
        x: 0,
        rotate: -5,
      }}
      transition={{
        duration: 0.8,
        ease: "easeOut",
      }}
      aria-hidden="true"
    >
      <img
        src={newsPaper}
        alt=""
        className="newspaper-note__image"
        draggable="false"
      />

      <div className="newspaper-tape newspaper-tape--left" />
    </motion.div>
  );
}