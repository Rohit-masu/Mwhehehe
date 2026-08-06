import { motion } from "framer-motion";
import "./DeskScene.css";

const particles = [
  { x: 8, y: 28, size: 6.0, duration: 12, delay: 0 },
  { x: 14, y: 58, size: 6.6, duration: 15, delay: 1.5 },
  { x: 22, y: 40, size: 6.4, duration: 13, delay: 3 },
  { x: 30, y: 70, size: 6.5, duration: 16, delay: 0.8 },
  { x: 38, y: 22, size: 6.1, duration: 14, delay: 4.5 },
  { x: 45, y: 55, size: 6.9, duration: 12, delay: 2.4 },
  { x: 52, y: 33, size: 6.6, duration: 15, delay: 5.5 },
  { x: 58, y: 68, size: 6.4, duration: 17, delay: 1.2 },
  { x: 64, y: 44, size: 6.2, duration: 13, delay: 3.8 },
  { x: 70, y: 26, size: 6.8, duration: 16, delay: 0.5 },
  { x: 76, y: 62, size: 6.5, duration: 14, delay: 6 },
  { x: 82, y: 38, size: 6.6, duration: 12, delay: 2.9 },
  { x: 88, y: 71, size: 6.0, duration: 18, delay: 4.2 },
  { x: 93, y: 50, size: 6.3, duration: 15, delay: 1.9 },
];

const glowParticles = [
  { x: 12, y: 50, size: 5.6, duration: 9, delay: 0.5 },
  { x: 26, y: 22, size: 5.0, duration: 11, delay: 2.5 },
  { x: 40, y: 65, size: 5.8, duration: 10, delay: 4 },
  { x: 55, y: 30, size: 5.4, duration: 12, delay: 1 },
  { x: 68, y: 58, size: 5.2, duration: 9, delay: 3.5 },
  { x: 81, y: 35, size: 4.0, duration: 11, delay: 5 },
  { x: 90, y: 66, size: 5.5, duration: 13, delay: 2 },
];

export default function AmbientParticles() {
  return (
    <div className="ambient-particles" aria-hidden="true">
      {particles.map((particle, index) => (
        <motion.span
          key={`dust-${index}`}
          className="ambient-particle ambient-particle--dust"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            x: [0, 8, -5, 4, 0],
            y: [0, -15, -29, -43],
            opacity: [0, 0.28, 0.48, 0.18, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {glowParticles.map((particle, index) => (
        <motion.span
          key={`glow-${index}`}
          className="ambient-particle ambient-particle--glow"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            x: [0, 12, 5, -8, 0],
            y: [0, -9, -19, -28, 0],

            opacity: [0.08, 0.6, 0.22, 0.75, 0.12],

            scale: [0.8, 1.35, 1.0, 1.55, 0.8],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
