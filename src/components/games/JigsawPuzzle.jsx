import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import puzzleBG from "../../assets/images/puzzleBG.jpg";

import "./DiaryMiniGames.css";
import DiaryFragmentReveal from "./DiaryFragmentReveal";

const PUZZLE_SIZE = 3;
const TILE_SIZE = 58;
const BOARD_SIZE = TILE_SIZE * PUZZLE_SIZE;
const SNAP_DISTANCE = 34;

const START_POSITIONS = [
  { x: 2, y: 4 },
  { x: 86, y: 0 },
  { x: 166, y: 7 },
  { x: 0, y: 176 },
  { x: 84, y: 184 },
  { x: 168, y: 176 },
  { x: 4, y: 90 },
  { x: 166, y: 91 },
  { x: 86, y: 132 },
];

function createPieces() {
  const scatteredPositions = [...START_POSITIONS].sort(
    () => Math.random() - 0.5
  );

  const pieces = Array.from({ length: PUZZLE_SIZE * PUZZLE_SIZE }, (_, id) => {
    const row = Math.floor(id / PUZZLE_SIZE);
    const col = id % PUZZLE_SIZE;

    return {
      id,
      x: scatteredPositions[id].x,
      y: scatteredPositions[id].y,
      correctX: 28 + col * TILE_SIZE,
      correctY: 34 + row * TILE_SIZE,
      snapped: false,
    };
  });

  return pieces.sort(() => Math.random() - 0.5);
}

export default function JigsawPuzzle({
  isActive = false,
  onLockChange,
  onComplete,
}) {
  const [pieces, setPieces] = useState(() => createPieces());
  const [finished, setFinished] = useState(false);
  const completionReportedRef = useRef(false);

  useEffect(() => {
    if (!isActive || finished) {
      onLockChange?.(false);
      return undefined;
    }

    onLockChange?.(true);
    return () => onLockChange?.(false);
  }, [finished, isActive, onLockChange]);

  useEffect(() => {
    if (!finished || completionReportedRef.current) return;

    completionReportedRef.current = true;
    onComplete?.("chawal");
  }, [finished, onComplete]);

  const handleDragEnd = (pieceId, info) => {
    if (finished) return;

    setPieces((currentPieces) => {
      const piece = currentPieces.find((item) => item.id === pieceId);
      if (!piece || piece.snapped) return currentPieces;

      const nextX = piece.x + info.offset.x;
      const nextY = piece.y + info.offset.y;
      const distance = Math.hypot(
        nextX - piece.correctX,
        nextY - piece.correctY
      );
      const snapped = distance <= SNAP_DISTANCE;

      const nextPieces = currentPieces.map((item) =>
        item.id === pieceId
          ? {
              ...item,
              x: snapped ? item.correctX : nextX,
              y: snapped ? item.correctY : nextY,
              snapped,
            }
          : item
      );

      if (snapped && nextPieces.every((item) => item.snapped)) {
        window.setTimeout(() => setFinished(true), 500);
      }

      return nextPieces;
    });
  };

  const snappedCount = pieces.filter((piece) => piece.snapped).length;

  return (
    <section
      className="diary-mini-game jigsaw-game"
      onPointerDown={(event) => event.stopPropagation()}
      onMouseDown={(event) => event.stopPropagation()}
      onTouchStart={(event) => event.stopPropagation()}
    >
      <AnimatePresence mode="wait">
        {!finished ? (
          <motion.div
            key="jigsaw-game"
            className="diary-mini-game__screen"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <header className="diary-mini-game__header">
              <span className="diary-mini-game__kicker">chapter iv · picture puzzle</span>
              <h2>Pieces of a Memory</h2>
              <p>Hold a piece and find where this memory belongs.</p>
            </header>

            <div className="diary-mini-game__progress">
              <span />
              <small>{String(snappedCount).padStart(2, "0")} / 09</small>
              <span />
            </div>

            <div className="jigsaw-stage" aria-label="Picture puzzle">
              <div className="jigsaw-target" aria-hidden="true">
                {Array.from({ length: PUZZLE_SIZE * PUZZLE_SIZE }, (_, index) => (
                  <span key={index} />
                ))}
              </div>

              {pieces.map((piece) => {
                const row = Math.floor(piece.id / PUZZLE_SIZE);
                const col = piece.id % PUZZLE_SIZE;

                return (
                  <motion.button
                    key={piece.id}
                    type="button"
                    className={`jigsaw-piece ${piece.snapped ? "jigsaw-piece--snapped" : ""}`}
                    drag={!piece.snapped}
                    dragMomentum={false}
                    dragElastic={0}
                    initial={false}
                    animate={{ x: piece.x, y: piece.y }}
                    whileDrag={{ scale: 1.06, zIndex: 20 }}
                    onDragEnd={(_, info) => handleDragEnd(piece.id, info)}
                    style={{
                      width: TILE_SIZE,
                      height: TILE_SIZE,
                      backgroundImage: `url(${puzzleBG})`,
                      backgroundSize: `${BOARD_SIZE}px ${BOARD_SIZE}px`,
                      backgroundPosition: `${-col * TILE_SIZE}px ${-row * TILE_SIZE}px`,
                    }}
                    aria-label={`Move picture piece ${piece.id + 1}`}
                  />
                );
              })}
            </div>

            <p className="diary-mini-game__feedback diary-mini-game__feedback--note">
              a familiar corner usually helps.
            </p>
          </motion.div>
        ) : (
          <DiaryFragmentReveal
            key="jigsaw-finished"
            title="Everything fits again."
            body="The repaired picture left the final word."
            clue="Chawal"
          >
          </DiaryFragmentReveal>
        )}
      </AnimatePresence>
    </section>
  );
}
