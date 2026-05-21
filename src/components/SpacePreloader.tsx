"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SpacePreloader: React.FC = () => {
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
      console.warn("Audio Context blocked or not supported", e);
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
      utterance.rate = 0.92; // Authoritative, paced astronaut cadence
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
    speakText("Cosmic engine telemetry initialized. Commencing launch sequence.");
    setStatusText("TELETROMY LINK: ACTIVE");
    
    // Begin countdown after introduction speech completes
    setTimeout(() => {
      setCount(5);
    }, 2800);
  };

  useEffect(() => {
    if (count === null) return;

    const phrases: Record<number, string> = {
      5: "T-minus five seconds. Guidance internal.",
      4: "T-minus four. Auxiliary thrusters armed.",
      3: "T-minus three. Reactor ignition sequence started.",
      2: "T-minus two. Sound suppression system active.",
      1: "T-minus one. Main engine ignition.",
      0: "Launch! Ignition confirmed. Systems fully operational.",
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
      // Reveal the main portfolio after 2 seconds
      const timeout = setTimeout(() => {
        setIsVisible(false);
      }, 2500);
      return () => clearTimeout(timeout);
    }

    const interval = setTimeout(() => {
      setCount(count - 1);
    }, 1200);

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
          <div className="absolute inset-0 bg-[radial-gradient(#1e1b4b_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

          <div className="w-full max-w-lg flex flex-col items-center relative z-10">
            {/* Spinning Radar Vectors */}
            <div className="relative w-44 h-44 md:w-56 md:h-56 mb-8 flex items-center justify-center">
              <motion.div
                className="absolute inset-0 rounded-full border border-white/5 border-t-[#e28254]/40"
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute w-36 h-36 rounded-full border border-white/5 border-b-[#64b4dc]/30"
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
                    className="text-4xl md:text-5xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-r from-[#e28254] to-[#64b4dc]"
                  >
                    T - {count}
                  </motion.div>
                ) : (
                  <div className="text-2xl font-bold font-mono tracking-widest text-[#e28254] animate-pulse">
                    COSMOS
                  </div>
                )}
              </div>
            </div>

            {/* Launch Status Dashboard */}
            <div className="w-full bg-white/5 border border-white/10 rounded-xl p-4 md:p-6 mb-8 text-center font-mono">
              <div className="text-[10px] md:text-xs text-white/50 mb-1 uppercase tracking-widest">
                Mission Guidance Uplink
              </div>
              <div className="text-xs md:text-sm font-semibold tracking-wide text-[#64b4dc] transition-all">
                {statusText}
              </div>
              
              {/* Telemetry Faux Glitch Lines */}
              <div className="flex justify-center space-x-1 mt-4">
                <span className={`w-2 h-1.5 rounded-sm ${isInitialized ? "bg-[#10b981]" : "bg-[#ef4444] animate-pulse"}`}></span>
                <span className={`w-2 h-1.5 rounded-sm ${count !== null && count <= 4 ? "bg-[#10b981]" : "bg-white/10"}`}></span>
                <span className={`w-2 h-1.5 rounded-sm ${count !== null && count <= 3 ? "bg-[#10b981]" : "bg-white/10"}`}></span>
                <span className={`w-2 h-1.5 rounded-sm ${count !== null && count <= 2 ? "bg-[#10b981]" : "bg-white/10"}`}></span>
                <span className={`w-2 h-1.5 rounded-sm ${count !== null && count <= 1 ? "bg-[#10b981]" : "bg-white/10"}`}></span>
                <span className={`w-2 h-1.5 rounded-sm ${count === 0 ? "bg-[#10b981]" : "bg-white/10"}`}></span>
              </div>
            </div>

            {/* Interactive Engagement Button */}
            {!isInitialized && (
              <motion.button
                onClick={handleStartLaunch}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 rounded-full bg-gradient-to-r from-[#e28254] to-[#44443a] text-white font-bold text-xs md:text-sm tracking-widest uppercase shadow-lg shadow-[#e28254]/20 border border-white/15 cursor-pointer transition-all duration-300"
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
                className="text-xs text-[#10b981] tracking-widest uppercase font-mono font-bold"
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
