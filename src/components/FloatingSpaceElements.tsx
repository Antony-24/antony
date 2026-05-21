"use client";

import React from "react";
import { motion } from "framer-motion";

const FloatingSpaceElements: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden">
      
      {/* 🧑‍🚀 PHOTOREALISTIC ZERO-GRAVITY ASTRONAUT */}
      <motion.div
        className="absolute w-44 h-44 md:w-56 md:h-56"
        style={{
          top: "14%",
          right: "5%",
          opacity: 0.42,
          filter: "drop-shadow(0 0 25px rgba(255, 255, 255, 0.08))",
        }}
        animate={{
          y: [0, -20, 15, 0],
          x: [0, 10, -8, 0],
          rotate: [0, 8, -6, 0],
        }}
        transition={{
          duration: 18,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      >
        <img
          src="/images/astronaut.png"
          alt="Photorealistic Floating Astronaut"
          className="w-full h-full object-contain"
          style={{
            mixBlendMode: "screen",
          }}
        />
      </motion.div>

      {/* 🚀 PHOTOREALISTIC SLEEK SPACESHIP */}
      <motion.div
        className="absolute w-48 h-48 md:w-60 md:h-60"
        style={{
          bottom: "12%",
          left: "5%",
          opacity: 0.38,
          filter: "drop-shadow(0 0 30px rgba(100, 180, 220, 0.12))",
        }}
        animate={{
          y: [0, 12, -15, 0],
          x: [0, -12, 10, 0],
          rotate: [0, -4, 4, 0],
        }}
        transition={{
          duration: 16,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      >
        <img
          src="/images/spaceship.png"
          alt="Photorealistic Sleek Spaceship"
          className="w-full h-full object-contain"
          style={{
            mixBlendMode: "screen",
          }}
        />
      </motion.div>

      {/* 🛸 PHOTOREALISTIC SPINNING UFO */}
      <motion.div
        className="absolute w-40 h-40 md:w-52 md:h-52"
        style={{
          top: "48%",
          right: "6%",
          opacity: 0.35,
          filter: "drop-shadow(0 0 35px rgba(100, 220, 220, 0.15))",
        }}
        animate={{
          y: [0, -14, 14, 0],
          x: [0, 8, -8, 0],
          rotate: 360,
        }}
        transition={{
          y: { duration: 14, ease: "easeInOut", repeat: Infinity },
          x: { duration: 14, ease: "easeInOut", repeat: Infinity },
          rotate: { duration: 35, ease: "linear", repeat: Infinity },
        }}
      >
        <img
          src="/images/ufo.png"
          alt="Photorealistic Rotating UFO Saucer"
          className="w-full h-full object-contain"
          style={{
            mixBlendMode: "screen",
          }}
        />
      </motion.div>

    </div>
  );
};

export default FloatingSpaceElements;
