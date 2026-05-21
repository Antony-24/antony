"use client";

import React from "react";
import { motion } from "framer-motion";

const FloatingSpaceElements: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden">
      
      {/* 🧑‍🚀 FLOATING ASTRONAUT */}
      <motion.div
        className="absolute w-24 h-24 md:w-32 md:h-32"
        style={{
          top: "18%",
          right: "8%",
          opacity: 0.35,
          filter: "drop-shadow(0 0 15px rgba(255, 255, 255, 0.1))",
        }}
        animate={{
          y: [0, -18, 12, 0],
          x: [0, 8, -6, 0],
          rotate: [0, 6, -8, 0],
        }}
        transition={{
          duration: 15,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      >
        <svg
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Backpack/Life Support System */}
          <rect x="25" y="35" width="22" height="42" rx="6" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="2.5"/>
          <rect x="28" y="42" width="6" height="10" rx="1.5" fill="#3b82f6"/>
          <rect x="28" y="56" width="6" height="10" rx="1.5" fill="#ef4444"/>

          {/* Body/Suit */}
          <rect x="38" y="45" width="44" height="46" rx="14" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="2.5" />
          
          {/* Arms */}
          {/* Left Arm floating up */}
          <path d="M38 52C28 48 20 54 22 64C23 68 28 68 28 64" stroke="#d1d5db" strokeWidth="9" strokeLinecap="round"/>
          <circle cx="21" cy="65" r="4.5" fill="#9ca3af" />
          
          {/* Right Arm waving */}
          <path d="M82 52C94 48 98 38 96 30C94 25 89 27 91 33" stroke="#d1d5db" strokeWidth="9" strokeLinecap="round"/>
          <circle cx="95" cy="28" r="4.5" fill="#9ca3af" />

          {/* Legs */}
          {/* Left Leg */}
          <path d="M48 90V105C48 108 55 108 55 105" stroke="#d1d5db" strokeWidth="10" strokeLinecap="round" />
          <path d="M48 105H56" stroke="#9ca3af" strokeWidth="3" strokeLinecap="round"/>
          {/* Right Leg */}
          <path d="M72 90V102C72 105 79 105 79 102" stroke="#d1d5db" strokeWidth="10" strokeLinecap="round" />
          <path d="M72 102H80" stroke="#9ca3af" strokeWidth="3" strokeLinecap="round"/>

          {/* Helmet */}
          <circle cx="60" cy="32" r="19" fill="#f9fafb" stroke="#d1d5db" strokeWidth="2.5" />
          
          {/* Gold Visor with reflection reflection */}
          <rect x="47" y="20" width="26" height="18" rx="9" fill="url(#visorGrad)" stroke="#4b5563" strokeWidth="1.5" />
          <path d="M50 25C54 22 62 22 66 23" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
          
          {/* Suit Chest Details */}
          <rect x="50" y="53" width="20" height="12" rx="2" fill="#e5e7eb" />
          <circle cx="55" cy="59" r="2.5" fill="#ef4444" />
          <circle cx="65" cy="59" r="2.5" fill="#10b981" />

          {/* Definitions for visors */}
          <defs>
            <linearGradient id="visorGrad" x1="47" y1="20" x2="73" y2="38" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#d97706" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>

      {/* 🚀 SLEEK FUTURISTIC SPACESHIP */}
      <motion.div
        className="absolute w-28 h-14 md:w-36 md:h-18"
        style={{
          bottom: "22%",
          left: "6%",
          opacity: 0.3,
          filter: "drop-shadow(0 0 20px rgba(100, 180, 220, 0.2))",
        }}
        animate={{
          y: [0, 14, -10, 0],
          x: [0, -10, 12, 0],
          rotate: [0, -3, 3, 0],
        }}
        transition={{
          duration: 12,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      >
        <svg
          viewBox="0 0 140 70"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Ion Engine Thruster Flame (Twinkling Glow) */}
          <motion.path
            d="M5 35L22 28V42L5 35Z"
            fill="url(#thrusterGrad)"
            animate={{
              opacity: [0.6, 1.0, 0.6],
              scaleX: [0.9, 1.3, 0.9],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{ transformOrigin: "22px 35px" }}
          />

          {/* Engine Capsule */}
          <rect x="20" y="27" width="16" height="16" rx="4" fill="#4b5563" stroke="#374151" strokeWidth="2" />
          
          {/* Main Ship Hull (Sleek aerodynamic arrow disk) */}
          <path d="M30 35L70 14H105L135 35L105 56H70L30 35Z" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="2.5" />
          
          {/* Upper Deck / Cockpit cabin */}
          <path d="M72 26L95 18H106L116 35H72V26Z" fill="#1f2937" stroke="#111827" strokeWidth="1.5" />
          
          {/* Cyan Cockpit Glass Glow */}
          <path d="M96 20L105 20L112 31H92L96 20Z" fill="url(#cockpitGrad)" />

          {/* Wing panels */}
          {/* Top Wing */}
          <path d="M65 14L45 2L80 14" fill="#9ca3af" stroke="#6b7280" strokeWidth="1.5" />
          {/* Bottom Wing */}
          <path d="M65 56L45 68L80 56" fill="#9ca3af" stroke="#6b7280" strokeWidth="1.5" />

          {/* Body Lines and details */}
          <line x1="72" y1="35" x2="128" y2="35" stroke="#9ca3af" strokeWidth="2" strokeDasharray="4 4" />
          <circle cx="82" cy="45" r="2.5" fill="#ef4444" />
          <circle cx="94" cy="45" r="2.5" fill="#3b82f6" />

          <defs>
            {/* Glowing Engine Thruster Gradient */}
            <linearGradient id="thrusterGrad" x1="5" y1="35" x2="22" y2="35" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="rgba(56, 189, 248, 0)" />
              <stop offset="60%" stopColor="rgba(56, 189, 248, 0.7)" />
              <stop offset="100%" stopColor="rgba(56, 189, 248, 1)" />
            </linearGradient>
            
            {/* Glowing Glass Cockpit Gradient */}
            <linearGradient id="cockpitGrad" x1="92" y1="25" x2="112" y2="25" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#0891b2" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>

    </div>
  );
};

export default FloatingSpaceElements;
