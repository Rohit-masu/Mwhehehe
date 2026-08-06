import { motion } from "framer-motion";
import "./DiaryBook.css";

export default function BookStage({
  children,
  isOpen = false,
  isMobile = false,
}) {
  return (
    <motion.div
      className={[
        "book-stage",
        isOpen ? "book-stage--open" : "book-stage--closed",
        isMobile ? "book-stage--mobile" : "",
      ].join(" ")}
      initial={{
        opacity: 0,
        y: 15,
        scale: 0.96,
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      transition={{
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <div className="book-stage__shadow" />

      <div className="book-stage__tilt">
        {children}
      </div>
    </motion.div>
  );
}