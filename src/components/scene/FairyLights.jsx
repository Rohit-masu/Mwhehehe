import { useRef, useState } from "react";
import { motion } from "framer-motion";

const bulbs = [
  { cx: 70, cy: 30, delay: 0.1, direction: "down" },
  { cx: 240, cy: 52, delay: 0.7, direction: "up" },
  { cx: 400, cy: 46, delay: 1.1, direction: "down" },
  { cx: 560, cy: 46, delay: 0.4, direction: "up" },
  { cx: 720, cy: 79, delay: 1.4, direction: "down" },
  { cx: 880, cy: 54, delay: 0.8, direction: "up" },
  { cx: 1040, cy: 54, delay: 1.7, direction: "down" },
];

export default function FairyLights() {
  const [isTapped, setIsTapped] = useState(false);
  const timeoutRef = useRef(null);
  const animateBulbs =
    typeof window === "undefined" || window.innerWidth >= 768;

  const handleTap = () => {
    setIsTapped(true);
    window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => setIsTapped(false), 900);
  };

  return (
    <div
      className={`fairy-lights ${isTapped ? "is-tapped" : ""}`}
      onClick={handleTap}
    >
      <svg
        viewBox="0 0 1100 110"
        preserveAspectRatio="none"
        className="fairy-lights__svg"
      >
        <defs>
          <filter id="bulbGlow" x="-120%" y="-120%" width="340%" height="340%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <linearGradient id="wireGradient" x1="0" x2="1">
            <stop offset="0%" stopColor="#3a271a" />
            <stop offset="50%" stopColor="#6b4c31" />
            <stop offset="100%" stopColor="#2f1d14" />
          </linearGradient>

          <radialGradient id="bulbFill">
            <stop offset="0%" stopColor="#fff8c8" />
            <stop offset="45%" stopColor="#ffd978" />
            <stop offset="100%" stopColor="#d89a32" />
          </radialGradient>
        </defs>

        <path
          d="
            M -20 14
            C 120 20, 170 55, 300 48
            S 500 22, 650 62
            S 860 28, 1030 50
            S 1130 30, 1180 18
          "
          fill="none"
          stroke="url(#wireGradient)"
          strokeWidth="2.1"
          strokeLinecap="round"
        />

        {bulbs.map((bulb, index) => {
          const isUp = bulb.direction === "up";

          const socketY = isUp ? bulb.cy - 5 : bulb.cy + 1;
          const bulbY = isUp ? bulb.cy - 12 : bulb.cy + 8;

          return (
            <g key={index}>
              <line
                x1={bulb.cx}
                y1={bulb.cy}
                x2={bulb.cx}
                y2={socketY}
                stroke="#4e3523"
                strokeWidth="2"
              />

              <rect
                x={bulb.cx - 3}
                y={isUp ? socketY - 5 : socketY}
                width="6"
                height="6"
                rx="1"
                fill="#4c3524"
              />

              <motion.circle
                cx={bulb.cx}
                cy={bulbY}
                r="5.2"
                fill="url(#bulbFill)"
                filter={animateBulbs ? "url(#bulbGlow)" : undefined}
                animate={animateBulbs ? {
                  opacity: [0.72, 1, 0.8],
                  r: [5, 5.8, 5.1],
                } : undefined}
                transition={animateBulbs ? {
                  duration: 3 + (index % 2) * 0.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: bulb.delay,
                } : undefined}
              />

              <motion.circle
                cx={bulb.cx}
                cy={bulbY}
                r="16"
                fill="rgba(255, 191, 75, 0.17)"
                animate={animateBulbs ? {
                  opacity: [0.16, 0.42, 0.18],
                  r: [15, 20, 16],
                } : undefined}
                transition={animateBulbs ? {
                  duration: 3.6 + (index % 2) * 0.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: bulb.delay + 0.2,
                } : undefined}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
