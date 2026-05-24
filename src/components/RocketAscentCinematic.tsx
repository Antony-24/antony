"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface RocketAscentCinematicProps {
  onCinematicComplete: () => void;
}

export const RocketAscentCinematic: React.FC<RocketAscentCinematicProps> = ({ onCinematicComplete }) => {
  const [telemetry, setTelemetry] = useState({
    altitude: 0,
    velocity: 0,
    acceleration: 1.2,
    statusText: "STAGE 1: MAIN ENGINE IGNITION COMPLETE",
  });

  const [stage, setStage] = useState<"stage1" | "stage2" | "stage3">("stage1");
  const [detachingBooster, setDetachingBooster] = useState(false);
  const [fairingOpen, setFairingOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioNodesRef = useRef<{
    whiteNoise: AudioBufferSourceNode;
    modulator: OscillatorNode;
    gainNode: GainNode;
    filterNode: BiquadFilterNode;
  } | null>(null);

  // Initialize Web Audio engine rumble
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioContextClass();
      audioCtxRef.current = audioCtx;

      // Create white noise buffer for engine roar
      const bufferSize = 2 * audioCtx.sampleRate;
      const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = audioCtx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Low pass filter to create a deep bass rumble
      const filter = audioCtx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(90, audioCtx.currentTime);

      // Low-frequency oscillator for engine combustion pulsation
      const modulator = audioCtx.createOscillator();
      modulator.type = "sine";
      modulator.frequency.setValueAtTime(14, audioCtx.currentTime); // 14Hz combustion flutter
      
      const modulatorGain = audioCtx.createGain();
      modulatorGain.gain.setValueAtTime(25, audioCtx.currentTime);

      // Main gain node for volume adjustments
      const gainNode = audioCtx.createGain();
      gainNode.gain.setValueAtTime(isMuted ? 0 : 0.6, audioCtx.currentTime);

      // Connect nodes
      modulator.connect(modulatorGain);
      modulatorGain.connect(filter.frequency);
      
      whiteNoise.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      whiteNoise.start();
      modulator.start();

      audioNodesRef.current = { whiteNoise, modulator, gainNode, filterNode: filter };
    } catch (e) {
      console.warn("Web Audio API not supported or blocked by browser policies:", e);
    }

    return () => {
      // Clean up audio nodes on unmount
      if (audioNodesRef.current) {
        try {
          audioNodesRef.current.whiteNoise.stop();
          audioNodesRef.current.modulator.stop();
        } catch (e) {}
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  // Update volume based on mute state or stage transitions
  useEffect(() => {
    if (audioNodesRef.current && audioCtxRef.current) {
      const vol = isMuted ? 0 : (stage === "stage3" ? 0.05 : (stage === "stage2" ? 0.4 : 0.6));
      audioNodesRef.current.gainNode.gain.linearRampToValueAtTime(
        vol,
        audioCtxRef.current.currentTime + 0.5
      );
    }
  }, [isMuted, stage]);

  // Audio synthesis helper for authentic astronaut radio chirps
  const playRadioChirp = (frequencyStart: number, frequencyEnd: number, duration: number, volume: number) => {
    if (!audioCtxRef.current || isMuted) return;
    try {
      const audioCtx = audioCtxRef.current;
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
    } catch (e) {}
  };

  // Robot / Astronaut speech synthesis helper
  const speakMissionControl = (text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis || isMuted) return;
    
    window.speechSynthesis.cancel();
    playRadioChirp(800, 1200, 0.08, 0.04);

    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.volume = 1.0;
      utterance.rate = 1.0;
      
      const voices = window.speechSynthesis.getVoices();
      const englishVoices = voices.filter(
        (v) => v.lang.includes("en-US") || v.lang.includes("en-GB") || v.lang.startsWith("en")
      );
      const maleVoice = englishVoices.find((v) => {
        const name = v.name.toLowerCase();
        return (
          name.includes("male") ||
          name.includes("david") ||
          name.includes("alex") ||
          name.includes("daniel") ||
          name.includes("oliver") ||
          name.includes("fred") ||
          name.includes("microsoft david") ||
          name.includes("google us english male")
        );
      });
      const preferredVoice = maleVoice || englishVoices.find(
        (v) => v.lang.includes("en-US") || v.lang.includes("en-GB")
      );
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
        const isMale = preferredVoice.name.toLowerCase().includes("male") || 
                       preferredVoice.name.toLowerCase().includes("david") ||
                       preferredVoice.name.toLowerCase().includes("alex") ||
                       preferredVoice.name.toLowerCase().includes("daniel") ||
                       preferredVoice.name.toLowerCase().includes("oliver") ||
                       preferredVoice.name.toLowerCase().includes("fred");
        utterance.pitch = isMale ? 0.85 : 0.70;
      } else {
        utterance.pitch = 0.70;
      }

      utterance.onend = () => {
        playRadioChirp(1000, 500, 0.07, 0.03);
      };
      
      window.speechSynthesis.speak(utterance);
    }, 100);
  };

  // Main cinematic timing controller
  useEffect(() => {
    speakMissionControl("Main engine start. Boosters at 100% capacity.");

    // Telemetry tick interval
    const telemetryInterval = setInterval(() => {
      setTelemetry((prev) => {
        let altInc = 0;
        let velInc = 0;
        let acc = prev.acceleration;
        let status = prev.statusText;

        if (stage === "stage1") {
          altInc = Math.floor(Math.random() * 80) + 120;
          velInc = Math.floor(Math.random() * 30) + 70;
          acc = 2.4;
          status = "STAGE 1: EXTREME BURST ASCENT";
        } else if (stage === "stage2") {
          altInc = Math.floor(Math.random() * 250) + 350;
          velInc = Math.floor(Math.random() * 90) + 180;
          acc = 4.2;
          status = "STAGE 2: THERMOSPHERE BURNING";
        } else if (stage === "stage3") {
          altInc = Math.floor(Math.random() * 50) + 20;
          velInc = 28000; // Orbital velocity
          acc = 0.0; // Weightlessness
          status = "STAGE 3: ORBITAL INSERTION NOMINAL";
        }

        return {
          altitude: Math.min(prev.altitude + altInc, stage === "stage3" ? 250000 : 180000),
          velocity: Math.min(prev.velocity + velInc, stage === "stage3" ? 28000 : 22000),
          acceleration: acc,
          statusText: status,
        };
      });
    }, 100);

    // Sequence Milestones
    // T+4.2s - Stage 1 separation announcement
    const timerSeparationAlert = setTimeout(() => {
      speakMissionControl("Booster depletion. Standing by for stage one separation.");
    }, 4200);

    // T+5.0s - Stage 1 separation
    const timerSeparation = setTimeout(() => {
      setDetachingBooster(true);
      setStage("stage2");
      // Change audio rumble pitch to higher and cleaner
      if (audioNodesRef.current) {
        audioNodesRef.current.filterNode.frequency.setValueAtTime(140, audioCtxRef.current!.currentTime);
      }
      setTimeout(() => {
        speakMissionControl("Stage one separation confirmed. Stage two engine ignition.");
      }, 500);
    }, 5000);

    // T+9.0s - Fairing separation alert
    const timerFairingAlert = setTimeout(() => {
      speakMissionControl("Exosphere boundary crossed. Preparing fairing jettison.");
    }, 9000);

    // T+9.8s - Fairing jettison
    const timerFairing = setTimeout(() => {
      setFairingOpen(true);
      setStage("stage3");
      // Muffle audio completely for exosphere vacuum
      if (audioNodesRef.current) {
        audioNodesRef.current.filterNode.frequency.setValueAtTime(50, audioCtxRef.current!.currentTime);
      }
      setTimeout(() => {
        speakMissionControl("Fairing separation confirmed. Orbital insertion successful.");
      }, 500);
    }, 9800);

    // T+13.0s - Deployment message
    const timerWelcomeAlert = setTimeout(() => {
      speakMissionControl("Welcome to Antony Francis Portfolio. Deploying payload capsule.");
    }, 13000);

    // T+15.5s - Transition to full website
    const timerTransition = setTimeout(() => {
      onCinematicComplete();
    }, 15500);

    return () => {
      clearInterval(telemetryInterval);
      clearTimeout(timerSeparationAlert);
      clearTimeout(timerSeparation);
      clearTimeout(timerFairingAlert);
      clearTimeout(timerFairing);
      clearTimeout(timerWelcomeAlert);
      clearTimeout(timerTransition);
    };
  }, [stage]);

  return (
    <div className="fixed inset-0 z-[99999] bg-[#050507] text-white flex flex-col justify-between overflow-hidden p-6 select-none font-mono">
      {/* Background Exosphere / Starfield Shift */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Dynamic Space Background based on Flight Phase */}
        <motion.div
          animate={{
            background: stage === "stage1" 
              ? "radial-gradient(circle at center bottom, #111116 0%, #050507 70%)"
              : stage === "stage2"
              ? "radial-gradient(circle at center bottom, #0a1020 0%, #050507 80%)"
              : "radial-gradient(circle at center bottom, #070814 0%, #050507 100%)"
          }}
          transition={{ duration: 4 }}
          className="absolute inset-0"
        />

        {/* Animated rising stars/particles during launch */}
        <AnimatePresence>
          {stage !== "stage3" && (
            <div className="absolute inset-0">
              {Array.from({ length: 40 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ 
                    x: typeof window !== "undefined" ? Math.random() * window.innerWidth : 1000, 
                    y: typeof window !== "undefined" ? window.innerHeight + 50 : 800, 
                    scale: Math.random() * 1.5 + 0.5,
                    opacity: Math.random() * 0.7 + 0.3 
                  }}
                  animate={{ 
                    y: -100 
                  }}
                  transition={{ 
                    duration: stage === "stage1" ? Math.random() * 1.5 + 1.2 : Math.random() * 0.7 + 0.4,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="absolute w-[2px] h-[15px] bg-white/40 rounded-full"
                />
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Static high altitude twinkling starfield in space */}
        {stage !== "stage1" && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 3 }}
            className="absolute inset-0 bg-[radial-gradient(white_1px,transparent_1px)] [background-size:32px_32px] opacity-20"
          />
        )}
        
        {/* Faux Horizon earth line fading down */}
        {stage === "stage1" && (
          <motion.div 
            animate={{ y: 250, opacity: 0 }}
            transition={{ duration: 5, ease: "easeIn" }}
            className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white/10 to-transparent blur-[20px]"
          />
        )}
      </div>

      {/* Cybernetic Tech Grid Fills */}
      <div className="absolute inset-0 bg-[radial-gradient(#8f8f7c_1px,transparent_1px)] [background-size:24px_24px] opacity-5 pointer-events-none z-0" />

      {/* HEADER HUD BAR */}
      <div className="w-full flex justify-between items-center z-10 border-b border-white/10 pb-4 bg-gradient-to-b from-black/50 to-transparent backdrop-blur-sm px-4">
        <div className="flex items-center space-x-3">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
          <span className="text-xs md:text-sm font-black tracking-widest text-[#8f8f7c]">LAUNCH MISSION PROTOCOL</span>
        </div>
        
        {/* Telemetry Status Indicator */}
        <div className="hidden md:flex items-center space-x-6 text-[11px] text-white/50">
          <div>VEHICLE: <span className="text-white font-bold">AF-CONVERTIX HEAVY</span></div>
          <div>EST. ORBIT: <span className="text-white font-bold">LEO (250 KM)</span></div>
          <div>PAYLOAD: <span className="text-white font-bold">PORTFOLIO V1</span></div>
        </div>

        {/* Sound Toggle */}
        <button 
          onClick={() => setIsMuted(!isMuted)} 
          className="text-xs border border-white/20 px-3 py-1.5 rounded-full hover:bg-white hover:text-black transition-all cursor-pointer font-bold tracking-widest"
        >
          {isMuted ? "UNMUTE HUD AUDIO" : "MUTE HUD AUDIO"}
        </button>
      </div>

      {/* MAIN ROCKET FLIGHT AREA */}
      <div className="flex-1 w-full flex items-center justify-center relative z-10">
        
        {/* Launchpad Rumble / Shake Container */}
        <motion.div 
          animate={stage === "stage1" ? {
            x: [0, -2, 2, -1, 1, -2, 2, 0],
            y: [0, 1, -2, 1, -1, 2, -1, 0]
          } : stage === "stage2" ? {
            x: [0, -0.5, 0.5, -0.5, 0],
            y: [0, 0.5, -0.5, 0.5, 0]
          } : {}}
          transition={{
            repeat: Infinity,
            duration: 0.12,
            ease: "easeInOut"
          }}
          className="relative flex flex-col items-center"
        >
          {/* Billowing exhaust clouds at launchpad stage 1 */}
          {stage === "stage1" && (
            <div className="absolute -bottom-24 w-80 h-32 flex justify-center pointer-events-none">
              {Array.from({ length: 15 }).map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    scale: [1, 2.5, 3.5],
                    opacity: [0.8, 0.5, 0],
                    x: [0, (i - 7) * 20 + (Math.random() * 40 - 20)],
                    y: [0, Math.random() * 60 + 40]
                  }}
                  transition={{
                    duration: Math.random() * 0.8 + 0.6,
                    repeat: Infinity,
                    ease: "easeOut"
                  }}
                  className="absolute w-12 h-12 bg-gradient-to-t from-orange-600 via-gray-600 to-gray-800 rounded-full blur-[8px]"
                />
              ))}
            </div>
          )}

          {/* SVG ROCKET VEHICLE */}
          <div className="flex flex-col items-center select-none">
            <RocketSVG stage={stage} detachingBooster={detachingBooster} fairingOpen={fairingOpen} />
          </div>
        </motion.div>
        
        {/* Floating Flight Alerts Overlay */}
        <div className="absolute top-10 left-10 hidden lg:block max-w-xs space-y-4">
          <div className="bg-white/5 border border-white/10 rounded-lg p-3 backdrop-blur-md">
            <div className="text-[10px] text-white/40 uppercase font-black">Flight Computer Diagnostic</div>
            <div className="text-xs text-emerald-400 font-bold mt-1">✓ Lox tank pressure: Nominal</div>
            <div className="text-xs text-emerald-400 font-bold">✓ Avionics linkage: Locked</div>
            <div className="text-xs text-emerald-400 font-bold">✓ Guidance vector: Auto-pilot</div>
          </div>
        </div>

        {/* Telemetry Stage Indicators (Right side overlay) */}
        <div className="absolute right-6 top-10 space-y-3 hidden sm:block">
          <div className="text-[10px] text-white/40 uppercase font-black mb-1">Flight milestones</div>
          
          <div className="flex items-center space-x-3">
            <span className={`w-3 h-3 rounded-full border ${stage !== "stage1" ? "bg-emerald-500 border-emerald-400 shadow-[0_0_8px_emerald]" : "bg-white/10 border-white/20 animate-pulse"}`} />
            <span className={`text-xs font-bold ${stage !== "stage1" ? "text-emerald-400" : "text-white/60"}`}>STAGE 1 SEPARATION</span>
          </div>

          <div className="flex items-center space-x-3">
            <span className={`w-3 h-3 rounded-full border ${stage === "stage3" ? "bg-emerald-500 border-emerald-400 shadow-[0_0_8px_emerald]" : detachingBooster ? "bg-white/10 border-white/20 animate-pulse" : "bg-black/40 border-white/10"}`} />
            <span className={`text-xs font-bold ${stage === "stage3" ? "text-emerald-400" : detachingBooster ? "text-white/60" : "text-white/20"}`}>FAIRING DEPLOYMENT</span>
          </div>

          <div className="flex items-center space-x-3">
            <span className={`w-3 h-3 rounded-full border ${fairingOpen ? "bg-emerald-500 border-emerald-400 shadow-[0_0_8px_emerald]" : "bg-black/40 border-white/10"}`} />
            <span className={`text-xs font-bold ${fairingOpen ? "text-emerald-400" : "text-white/20"}`}>ORBITAL PAYLOAD LOADED</span>
          </div>
        </div>
      </div>

      {/* DASHBOARD TELEMETRY FOOTER HUD */}
      <div className="w-full bg-white/5 border border-white/10 rounded-xl p-4 md:p-6 font-mono z-10 backdrop-blur-md">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          
          {/* ALTITUDE DISPLAY */}
          <div className="border-r border-white/10 pr-2">
            <div className="text-[10px] text-white/40 uppercase tracking-widest mb-1">ALTITUDE</div>
            <div className="text-lg md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-[#8f8f7c]">
              {(telemetry.altitude / 1000).toFixed(2)} <span className="text-xs text-white/50">KM</span>
            </div>
            <div className="w-full bg-white/10 h-1 rounded-full mt-2 overflow-hidden">
              <motion.div 
                className="bg-[#8f8f7c] h-full"
                animate={{ width: `${(telemetry.altitude / 250000) * 100}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </div>

          {/* VELOCITY DISPLAY */}
          <div className="md:border-r border-white/10 pr-2">
            <div className="text-[10px] text-white/40 uppercase tracking-widest mb-1">VELOCITY</div>
            <div className="text-lg md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-[#8f8f7c]">
              {telemetry.velocity.toLocaleString()} <span className="text-xs text-white/50">KM/H</span>
            </div>
            <div className="w-full bg-white/10 h-1 rounded-full mt-2 overflow-hidden">
              <motion.div 
                className="bg-[#8f8f7c] h-full"
                animate={{ width: `${(telemetry.velocity / 28000) * 100}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </div>

          {/* ACCELERATION DISPLAY */}
          <div className="border-r border-white/10 pr-2 pt-2 md:pt-0">
            <div className="text-[10px] text-white/40 uppercase tracking-widest mb-1">ACCELERATION</div>
            <div className="text-lg md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-[#8f8f7c]">
              {telemetry.acceleration.toFixed(1)} <span className="text-xs text-white/50">G</span>
            </div>
            <div className="w-full bg-white/10 h-1 rounded-full mt-2 overflow-hidden">
              <motion.div 
                className="bg-[#8f8f7c] h-full"
                animate={{ width: `${(telemetry.acceleration / 5) * 100}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </div>

          {/* TELEMETRY UPLINK LOGS */}
          <div className="pt-2 md:pt-0 pl-2">
            <div className="text-[10px] text-white/40 uppercase tracking-widest mb-1">FLIGHT TELEMETRY STATUS</div>
            <div className="text-[11px] md:text-xs text-white font-bold leading-tight uppercase transition-all tracking-wide animate-pulse">
              {telemetry.statusText}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// SVG Rocket Component Definition
const RocketSVG: React.FC<{ stage: string; detachingBooster: boolean; fairingOpen: boolean }> = ({ stage, detachingBooster, fairingOpen }) => {
  return (
    <div className="relative w-24 h-72 flex flex-col items-center">
      {/* Fairing / Payload Capsule */}
      {!fairingOpen ? (
        <motion.div className="w-10 h-16 bg-gradient-to-b from-[#e5e5e0] to-[#c5c5c0] rounded-t-full border border-white/20 relative flex items-center justify-center">
          {/* Payload inside, revealed later */}
          <div className="absolute w-2 h-8 bg-[#8f8f7c]/50 rounded-full animate-pulse" />
        </motion.div>
      ) : (
        /* Fairing opened / split */
        <div className="w-16 h-16 relative flex justify-between">
          <motion.div 
            initial={{ rotate: -30, x: -10, opacity: 1 }}
            animate={{ x: -75, y: 55, rotate: -85, opacity: 0 }}
            transition={{ duration: 2.2, ease: "easeOut" }}
            className="w-5 h-16 bg-[#c5c5c0] rounded-tl-full border border-white/20"
          />
          {/* Floating Payload Satellite */}
          <motion.div 
            initial={{ scale: 0.8, y: 15 }}
            animate={{ scale: 1.3, y: -25, rotate: 180 }}
            transition={{ duration: 4.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
            className="absolute left-1/2 -translate-x-1/2 w-8 h-12 flex flex-col items-center justify-center"
          >
            {/* Satellite core */}
            <div className="w-5 h-7 bg-cyan-400 border border-cyan-300 rounded-sm shadow-[0_0_20px_#06b6d4] flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-white rounded-full animate-ping" />
            </div>
            {/* Deploying Solar panels */}
            <motion.div 
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.8, duration: 1.8, ease: "easeOut" }}
              className="absolute w-20 h-2 bg-gradient-to-r from-blue-600 via-transparent to-blue-600 border border-blue-400 rounded-sm"
            />
          </motion.div>
          <motion.div 
            initial={{ rotate: 30, x: 10, opacity: 1 }}
            animate={{ x: 75, y: 55, rotate: 85, opacity: 0 }}
            transition={{ duration: 2.2, ease: "easeOut" }}
            className="w-5 h-16 bg-[#c5c5c0] rounded-tr-full border border-white/20"
          />
        </div>
      )}

      {/* Stage 2 Core */}
      <div className="w-10 h-20 bg-gradient-to-b from-[#b0b0a8] to-[#909088] border-x border-white/10 relative flex items-center justify-center overflow-hidden">
        {/* Glowing decal lines */}
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-cyan-500/50 shadow-[0_0_8px_cyan]" />
        <div className="absolute bottom-4 left-0 right-0 h-0.5 bg-cyan-500/50 shadow-[0_0_8px_cyan]" />
        <span className="text-[7px] font-black tracking-widest text-white/50 rotate-90 whitespace-nowrap">AF CONVERTIX</span>
      </div>

      {/* Interstage Ring & Engine 2 Plume */}
      {stage !== "stage1" && !fairingOpen && (
        <motion.div 
          initial={{ scaleY: 0 }}
          animate={{ scaleY: [1, 1.25, 1] }}
          transition={{ repeat: Infinity, duration: 0.12 }}
          className="absolute top-[148px] w-4 h-14 bg-gradient-to-b from-cyan-400 via-cyan-500 to-transparent rounded-full blur-[2px] shadow-[0_0_20px_#06b6d4] origin-top"
        />
      )}

      {/* Stage 1 Core (Deploys and falls away) */}
      {!detachingBooster ? (
        <div className="w-12 h-24 bg-gradient-to-b from-[#8f8f7c] to-[#44443a] border border-white/10 rounded-b-sm relative flex flex-col items-center">
          {/* Grid fins / stabilizers */}
          <div className="absolute -left-2 top-2 w-2 h-4 bg-white/20 border border-white/10 rounded-sm" />
          <div className="absolute -right-2 top-2 w-2 h-4 bg-white/20 border border-white/10 rounded-sm" />
          {/* Main Engines fire */}
          {stage === "stage1" && (
            <motion.div 
              animate={{ scaleY: [1, 1.25, 0.9, 1.15] }}
              transition={{ repeat: Infinity, duration: 0.08 }}
              className="absolute -bottom-20 w-8 h-24 bg-gradient-to-b from-orange-500 via-red-500 to-transparent rounded-full origin-top blur-[2px] shadow-[0_0_25px_orange]"
            />
          )}
        </div>
      ) : (
        /* Detaching booster falling out of view */
        <motion.div 
          initial={{ y: 0, opacity: 1, rotate: 0 }}
          animate={{ y: 350, opacity: 0, rotate: 18 }}
          transition={{ duration: 3.5, ease: "easeIn" }}
          className="w-12 h-24 bg-gradient-to-b from-[#8f8f7c] to-[#44443a] border border-white/10 rounded-b-sm relative"
        >
          {/* Smoking engines since they are cut off */}
          <div className="absolute -bottom-4 left-4 w-4 h-8 bg-gray-500/20 blur-[5px] rounded-full animate-pulse" />
        </motion.div>
      )}
    </div>
  );
};
