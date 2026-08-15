import { motion } from "framer-motion";

export default function DiaryFragmentReveal({
  kicker = "a small fragment, recovered",
  title,
  body,
  clue,
  note = "keep this word close.",
}) {
  return (
    <motion.div
      className="diary-fragment-reveal"
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35 }}
    >
      <span className="diary-fragment-reveal__kicker">{kicker}</span>
      <h3>{title}</h3>
      <p>{body}</p>
      <motion.strong
        className="diary-fragment-reveal__clue"
        initial={{ opacity: 0, scale: 1.25, rotate: -6 }}
        animate={{ opacity: 1, scale: 1, rotate: -3 }}
        transition={{ delay: 0.18, type: "spring", stiffness: 170, damping: 14 }}
      >
        {clue}
      </motion.strong>
      <span className="diary-fragment-reveal__note">{note}</span>
    </motion.div>
  );
}
