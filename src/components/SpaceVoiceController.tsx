"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SpaceVoiceController: React.FC = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [activeVoiceLabel, setActiveVoiceLabel] = useState<string | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync mute state with localStorage
  useEffect(() => {
    const savedState = localStorage.getItem("space_voice_muted");
    if (savedState !== null) {
      setIsMuted(savedState === "true");
    }
  }, []);

  const toggleMute = () => {
    const newState = !isMuted;
    setIsMuted(newState);
    localStorage.setItem("space_voice_muted", String(newState));
    
    // Play quick confirm chirp
    playRadioChirp(newState ? 600 : 900, newState ? 300 : 1200, 0.06, 0.03);
  };

  // Synthesizes short astronaut walkie-talkie radio click beeps
  const playRadioChirp = (frequencyStart: number, frequencyEnd: number, duration: number, volume: number) => {
    if (isMuted) return;
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

  // Speaks customized pilot reports
  const speakText = (text: string) => {
    if (isMuted || typeof window === "undefined" || !window.speechSynthesis) return;

    window.speechSynthesis.cancel(); // Smoothly interrupt previous speech
    playRadioChirp(850, 1150, 0.07, 0.035); // Play key-up chirp

    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.volume = 0.9;
      utterance.rate = 0.95; // Steady, calm space transmission cadence
      utterance.pitch = 0.88; // Deep astronaut radio pitch

      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(
        (v) => v.lang.includes("en-US") || v.lang.includes("en-GB")
      );
      if (preferredVoice) utterance.voice = preferredVoice;

      utterance.onend = () => {
        playRadioChirp(950, 550, 0.06, 0.025); // Play key-down chirp
        setActiveVoiceLabel(null);
      };

      window.speechSynthesis.speak(utterance);
    }, 80);
  };

  useEffect(() => {
    if (typeof document === "undefined") return;

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      // Identify target interactive element (or closest anchor/button/heading)
      const hoverable = target.closest("a, button, h1, h2, [data-space-voice]");
      if (!hoverable) return;

      const label = hoverable.getAttribute("data-space-voice");
      const text = hoverable.textContent?.trim() || "";

      let phrase = "";

      // Match navigation nodes, headings, and buttons
      if (label) {
        phrase = label;
      } else if (text.toLowerCase().includes("about")) {
        phrase = "System check. Retrieving pilot profile credentials.";
      } else if (text.toLowerCase().includes("projects") || text.toLowerCase().includes("my work")) {
        phrase = "Sector four access: Scanning active mission blueprints.";
      } else if (text.toLowerCase().includes("contact") || text.toLowerCase().includes("connect")) {
        phrase = "Establishing transmission link to global comms terminal.";
      } else if (text.toLowerCase().includes("hire me")) {
        phrase = "Initiating pilot hiring sequence. Contract telemetry initialized.";
      } else if (text.toLowerCase().includes("af audit") || text.toLowerCase().includes("diagnostic scorecard")) {
        phrase = "Warning. Launching comprehensive systems performance audit.";
      } else if (text.includes("Crafting Digital Experiences")) {
        phrase = "Digital experience reactor core online.";
      } else if (text.includes("About Me")) {
        phrase = "Accessing biography grid files.";
      }

      if (!phrase) return;

      // Debounce trigger to avoid voice chaos on fast mouse swipes
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
      
      hoverTimeoutRef.current = setTimeout(() => {
        setActiveVoiceLabel(phrase);
        speakText(phrase);
      }, 220); // 220ms hover delay threshold
    };

    const handleMouseOut = () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
      }
    };

    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);

    return () => {
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, [isMuted]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-3 pointer-events-auto">
      {/* Active Audio Telemetry Caption */}
      <AnimatePresence>
        {activeVoiceLabel && !isMuted && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className="hidden md:block px-3 py-1.5 rounded-lg bg-black/75 border border-[#64b4dc]/30 text-[10px] font-mono text-[#64b4dc] tracking-widest max-w-xs text-right"
          >
            TRANSMITTING // "{activeVoiceLabel.toUpperCase()}"
          </motion.div>
        )}
      </AnimatePresence>

      {/* Glowing Comms Terminal Widget */}
      <motion.button
        onClick={toggleMute}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`p-3 rounded-full border flex items-center justify-center cursor-pointer transition-all duration-300 relative ${
          isMuted
            ? "bg-red-950/20 border-red-500/30 text-red-400 hover:bg-red-950/40"
            : "bg-[#44443a]/40 border-white/10 text-white hover:bg-white hover:text-black hover:border-white"
        }`}
        title={isMuted ? "Enable Space Telemetry Audio" : "Mute Space Telemetry Audio"}
      >
        {/* Animated Radio Beacon */}
        {!isMuted && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#64b4dc] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#64b4dc]"></span>
          </span>
        )}

        {isMuted ? (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6L4.5 9H1.5v6h3L9 19.5V4.5z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
          </svg>
        )}
      </motion.button>
    </div>
  );
};

export default SpaceVoiceController;
