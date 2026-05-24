"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SpacePreloaderProps {
  isAssetsReady?: boolean;
  onLaunchStart?: () => void;
  onLaunchComplete?: () => void;
}

const SpacePreloader: React.FC<SpacePreloaderProps> = ({ isAssetsReady = false, onLaunchStart, onLaunchComplete }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [count, setCount] = useState<number | null>(null);
  const [statusText, setStatusText] = useState("COSMIC UPLINK: OFFLINE");
  const [isVisible, setIsVisible] = useState(true);
  const [clientIp, setClientIp] = useState("");

  // Fetch client IP on mount for custom prelaunch launchphrase
  useEffect(() => {
    fetch("https://api.ipify.org?format=json")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.ip) {
          setClientIp(data.ip);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch client IP for cosmic launch:", err);
      });
  }, []);

  const playCountdownBeep = (isFinal = false) => {
    if (typeof window === "undefined") return;
    try {
      const Ctx = window.AudioContext || (window as any).webkitAudioContext;
      if (!Ctx) return;
      const ctx = new Ctx();
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      if (isFinal) {
        // Normal rocket engine roar/rumble using lowpass filtered white noise
        const bufSize = 1.8 * ctx.sampleRate;
        const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < bufSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buf;
        
        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(120, ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 1.6);
        
        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.0, ctx.currentTime);
        noiseGain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.1);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.8);
        
        // Add a low-frequency hum/organ element to give it weight
        const hum = ctx.createOscillator();
        hum.type = "sawtooth";
        hum.frequency.setValueAtTime(55, ctx.currentTime);
        
        const humFilter = ctx.createBiquadFilter();
        humFilter.type = "lowpass";
        humFilter.frequency.setValueAtTime(80, ctx.currentTime);
        
        const humGain = ctx.createGain();
        humGain.gain.setValueAtTime(0.0, ctx.currentTime);
        humGain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.15);
        humGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.8);
        
        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(ctx.destination);
        
        hum.connect(humFilter);
        humFilter.connect(humGain);
        humGain.connect(ctx.destination);
        
        noise.start();
        hum.start();
        
        noise.stop(ctx.currentTime + 1.8);
        hum.stop(ctx.currentTime + 1.8);
      } else {
        // High-pitched cyber pulse tick
        osc.type = "sine";
        osc.frequency.setValueAtTime(1000, ctx.currentTime);
        
        gainNode.gain.setValueAtTime(0.25, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      }
    } catch (e) {}
  };

  const speakText = (text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.volume = 1.0;
      utterance.rate = 1.0;
      utterance.pitch = 0.85; // cyber-announcer pitch
      
      const voices = window.speechSynthesis.getVoices();
      const en = voices.filter((v) => v.lang.startsWith("en"));
      const male = en.find((v) => {
        const n = v.name.toLowerCase();
        return n.includes("male") || n.includes("david") || n.includes("alex") || n.includes("daniel") || n.includes("fred") || n.includes("oliver") || n.includes("rishi");
      });
      const preferred = male || en.find((v) => v.lang.includes("en-US") || v.lang.includes("en-GB")) || en[0];
      if (preferred) { utterance.voice = preferred; }

      window.speechSynthesis.speak(utterance);
    } catch (e) {}
  };

  const handleStartLaunch = () => {
    if (onLaunchStart) {
      onLaunchStart();
    }
    if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel();
    setIsInitialized(true);
    setStatusText("TELEMETRY LINK: ACTIVE");
    
    // Begin countdown quickly
    setTimeout(() => {
      setCount(5);
    }, 600);
  };

  useEffect(() => {
    if (count === null) return;

    const statusTexts: Record<number, string> = {
      5: "LAUNCH STATE: T-5 (PRELAUNCH SEQUENCE)",
      4: "LAUNCH STATE: T-4 (SYSTEMS ENGAGED)",
      3: "LAUNCH STATE: T-3 (REACTOR IGNITION)",
      2: "LAUNCH STATE: T-2 (SUPPRESSION ENGAGED)",
      1: "LAUNCH STATE: T-1 (MAIN ENGINE READY)",
      0: "BOOSTER IGNITION AND LIFT OFF TO AF CONVERTIX!",
    };

    setStatusText(statusTexts[count]);

    // Trigger audio beeps and voice announcements during countdown ticks
    if (count === 5) {
      playCountdownBeep(false);
      speakText("T minus five.");
    } else if (count === 4) {
      playCountdownBeep(false);
      speakText("four.");
    } else if (count === 3) {
      playCountdownBeep(false);
      speakText("three.");
    } else if (count === 2) {
      playCountdownBeep(false);
      speakText("two.");
    } else if (count === 1) {
      playCountdownBeep(false);
      speakText("one.");
    } else if (count === 0) {
      playCountdownBeep(true);
      speakText("Booster ignition and lift off to a f convertix!");
    }

    if (count === 0) {
      if (onLaunchComplete) {
        onLaunchComplete();
      }

      const timeout = setTimeout(() => {
        setIsVisible(false);
      }, 1000);
      return () => clearTimeout(timeout);
    }

    const interval = setTimeout(() => {
      setCount(count - 1);
    }, 1100);

    return () => clearTimeout(interval);
  }, [count, clientIp]);

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
          {/* Cybernetic Tech Grid Fills without dots */}
          <div className="absolute inset-0 bg-black/40 pointer-events-none" />

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
                    {count === 5 ? "T-5" : count === 0 ? "BOOSTER" : count}
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
              isAssetsReady ? (
                <motion.button
                  onClick={handleStartLaunch}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 rounded-full bg-[#44443a] text-white font-bold text-xs md:text-sm tracking-widest uppercase shadow-lg shadow-black/40 border border-white/10 cursor-pointer hover:bg-white hover:text-black hover:border-white transition-all duration-300"
                >
                  Commence Mission Launch
                </motion.button>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#8f8f7c] animate-ping" />
                    <span className="text-[10px] md:text-xs text-[#8f8f7c] tracking-widest font-black uppercase font-mono">
                      SYNCING SYSTEM METRICS...
                    </span>
                  </div>
                  <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden border border-white/10">
                    <motion.div
                      className="h-full bg-gradient-to-r from-[#44443a] to-[#8f8f7c]"
                      animate={{ width: ["10%", "90%", "30%", "100%"] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </div>
                </div>
              )
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
                className="text-xs text-[#8f8f7c] tracking-widest uppercase font-mono font-bold animate-pulse"
              >
                LIFT OFF!
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SpacePreloader;
