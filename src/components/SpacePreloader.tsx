"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SpacePreloaderProps {
  onLaunchComplete?: () => void;
}

const SpacePreloader: React.FC<SpacePreloaderProps> = ({ onLaunchComplete }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [count, setCount] = useState<number | null>(null);
  const [statusText, setStatusText] = useState("COSMIC UPLINK: OFFLINE");
  const [isVisible, setIsVisible] = useState(true);

  // Audio synthesis helper for authentic astronaut radio chirps
  const playRadioChirp = (frequencyStart: number, frequencyEnd: number, duration: number, volume: number) => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(frequencyStart, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(frequencyEnd, audioCtx.currentTime + duration);
      
      gain.gain.setValueAtTime(volume, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Audio context inactive
    }
  };

  // Speaks commands using the Web Speech Synthesis API
  const speakText = (text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    
    window.speechSynthesis.cancel(); // Terminate any active speech
    
    // Play mic key-up radio chirp
    playRadioChirp(800, 1200, 0.08, 0.04);
    
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.volume = 1.0;
      utterance.rate = 1.0; // Standard crisp speech speed
      utterance.pitch = 0.85; // Deep radio broadcast pitch
      
      // Look for standard high-quality English synthesizers
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(
        (v) => v.lang.includes("en-US") || v.lang.includes("en-GB")
      );
      if (preferredVoice) utterance.voice = preferredVoice;

      utterance.onend = () => {
        // Play mic key-down radio chirp
        playRadioChirp(1000, 500, 0.07, 0.03);
      };
      
      window.speechSynthesis.speak(utterance);
    }, 100);
  };

  const handleStartLaunch = () => {
    setIsInitialized(true);
    speakText("T-minus five");
    setStatusText("TELEMETRY LINK: ACTIVE");
    
    // Begin countdown after introduction speech completes
    setTimeout(() => {
      setCount(5);
    }, 1200);
  };

  useEffect(() => {
    if (count === null) return;

    const phrases: Record<number, string> = {
      5: "T-five",
      4: "four",
      3: "three",
      2: "two",
      1: "one",
      0: "zero",
    };

    const statusTexts: Record<number, string> = {
      5: "LAUNCH STATE: T-5 (GUIDANCE INTERNAL)",
      4: "LAUNCH STATE: T-4 (THRUSTERS ARMED)",
      3: "LAUNCH STATE: T-3 (REACTOR IGNITION)",
      2: "LAUNCH STATE: T-2 (SUPPRESSION ENGAGED)",
      1: "LAUNCH STATE: T-1 (MAIN ENGINE READY)",
      0: "MISSION DEPLOYED: SYSTEMS NOMINAL",
    };

    speakText(phrases[count]);
    setStatusText(statusTexts[count]);

    if (count === 0) {
      // Trigger lazy mount of main website content immediately at T-0
      if (onLaunchComplete) {
        onLaunchComplete();
      }

      // Slide up/fade out the preloader after a brief pause
      const timeout = setTimeout(() => {
        setIsVisible(false);
      }, 1500);
      return () => clearTimeout(timeout);
    }

    const interval = setTimeout(() => {
      setCount(count - 1);
    }, 1100);

    return () => clearTimeout(interval);
  }, [count]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050507] text-white p-6"
          exit={{
            y: "-100%",
            opacity: 0,
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
          }}
        >
          {/* Cybernetic Tech Grid Fills */}
          <div className="absolute inset-0 bg-[radial-gradient(#8f8f7c_1px,transparent_1px)] [background-size:24px_24px] opacity-5 pointer-events-none" />

          <div className="w-full max-w-lg flex flex-col items-center relative z-10">
            {/* Spinning Radar Vectors */}
            <div className="relative w-44 h-44 md:w-56 md:h-56 mb-8 flex items-center justify-center">
              <motion.div
                className="absolute inset-0 rounded-full border border-white/5 border-t-[#8f8f7c]/40"
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute w-36 h-36 rounded-full border border-white/5 border-b-[#44443a]/50"
                animate={{ rotate: -360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute w-28 h-28 rounded-full border border-dashed border-white/10"
                animate={{ rotate: 180 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              />

              {/* Centered Digital Countdown */}
              <div className="text-center">
                {count !== null ? (
                  <motion.div
                    key={count}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-4xl md:text-5xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-r from-white to-[#8f8f7c]"
                  >
                    T - {count}
                  </motion.div>
                ) : (
                  <div className="text-2xl font-bold font-mono tracking-widest text-[#8f8f7c] animate-pulse">
                    COSMOS
                  </div>
                )}
              </div>
            </div>

            {/* Launch Status Dashboard */}
            <div className="w-full bg-white/5 border border-white/10 rounded-xl p-4 md:p-6 mb-8 text-center font-mono">
              <div className="text-[10px] md:text-xs text-white/40 mb-1 uppercase tracking-widest">
                Mission Guidance Uplink
              </div>
              <div className="text-xs md:text-sm font-semibold tracking-wide text-white transition-all">
                {statusText}
              </div>
              
              {/* Telemetry Faux Glitch Lines */}
              <div className="flex justify-center space-x-1 mt-4">
                <span className={`w-2 h-1.5 rounded-sm ${isInitialized ? "bg-white" : "bg-white/10 animate-pulse"}`}></span>
                <span className={`w-2 h-1.5 rounded-sm ${count !== null && count <= 4 ? "bg-white" : "bg-white/10"}`}></span>
                <span className={`w-2 h-1.5 rounded-sm ${count !== null && count <= 3 ? "bg-white" : "bg-white/10"}`}></span>
                <span className={`w-2 h-1.5 rounded-sm ${count !== null && count <= 2 ? "bg-white" : "bg-white/10"}`}></span>
                <span className={`w-2 h-1.5 rounded-sm ${count !== null && count <= 1 ? "bg-white" : "bg-white/10"}`}></span>
                <span className={`w-2 h-1.5 rounded-sm ${count === 0 ? "bg-white" : "bg-white/10"}`}></span>
              </div>
            </div>

            {/* Interactive Engagement Button */}
            {!isInitialized && (
              <motion.button
                onClick={handleStartLaunch}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 rounded-full bg-[#44443a] text-white font-bold text-xs md:text-sm tracking-widest uppercase shadow-lg shadow-black/40 border border-white/10 cursor-pointer hover:bg-white hover:text-black hover:border-white transition-all duration-300"
              >
                Commence Mission Launch
              </motion.button>
            )}

            {isInitialized && count === null && (
              <div className="text-xs text-white/40 tracking-wider animate-pulse uppercase font-mono">
                Running launch telemetry checks...
              </div>
            )}
            
            {count !== null && count > 0 && (
              <div className="text-xs text-white/40 tracking-wider animate-pulse uppercase font-mono">
                Cosmic propulsion charging...
              </div>
            )}

            {count === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-white tracking-widest uppercase font-mono font-bold"
              >
                Ignition engaged! Welcome aboard.
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SpacePreloader;
