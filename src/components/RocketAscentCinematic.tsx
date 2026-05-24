"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface RocketAscentCinematicProps {
  onCinematicComplete: () => void;
}

export const RocketAscentCinematic: React.FC<RocketAscentCinematicProps> = ({ onCinematicComplete }) => {
  const [telemetry, setTelemetry] = useState({ altitude: 0, velocity: 0, acceleration: 2.8 });
  const [stage, setStage] = useState<"stage1" | "stage2" | "stage3">("stage1");
  const [detachingBooster, setDetachingBooster] = useState(false);
  const [fairingOpen, setFairingOpen] = useState(false);
  const [statusText, setStatusText] = useState("STAGE 1: MAIN ENGINE IGNITION");
  const [isMuted, setIsMuted] = useState(false);
  const [logs, setLogs] = useState<{ id: number; text: string; type: "sys" | "cmd" }[]>([
    { id: 0, text: "SYS BOOT: Mission control uplink secured", type: "sys" },
    { id: 1, text: "SYS BOOT: Autopilot guidance vector locked", type: "sys" },
  ]);

  // Refs to avoid stale closures in the single effect
  const stageRef = useRef<"stage1" | "stage2" | "stage3">("stage1");
  const isMutedRef = useRef(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const filterNodeRef = useRef<BiquadFilterNode | null>(null);
  const logIdRef = useRef(2);
  // Preload voices immediately on mount
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);
  useEffect(() => {
    const load = () => { voicesRef.current = window.speechSynthesis.getVoices(); };
    load();
    window.speechSynthesis.onvoiceschanged = load;
  }, []);

  const addLog = (text: string, type: "sys" | "cmd" = "cmd") => {
    const id = logIdRef.current++;
    setLogs((prev) => [...prev, { id, text, type }]);
  };

  // speak: does NOT cancel previous — each announcement plays sequentially
  const speak = (text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis || isMutedRef.current) return;
    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.volume = 1.0;
      utterance.rate = 0.95;
      utterance.pitch = 0.75;
      const voices = voicesRef.current.length > 0 ? voicesRef.current : window.speechSynthesis.getVoices();
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

  // Single useEffect — never re-runs, no dependency array triggers
  useEffect(() => {
    // — Audio engine setup —
    try {
      const Ctx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new Ctx();
      audioCtxRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.0, ctx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0.6, ctx.currentTime + 1.5);
      gainNodeRef.current = masterGain;
      masterGain.connect(ctx.destination);

      // ── Interstellar organ drone ─────────────────────────────────────────
      const organFreqs = [55, 82.4, 110, 164.8];
      organFreqs.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        const oscGain = ctx.createGain();
        oscGain.gain.setValueAtTime(0.08 / (i + 1), ctx.currentTime);
        const lpf = ctx.createBiquadFilter();
        lpf.type = "lowpass";
        lpf.frequency.setValueAtTime(600, ctx.currentTime);
        lpf.Q.setValueAtTime(1.5, ctx.currentTime);
        osc.connect(lpf); lpf.connect(oscGain); oscGain.connect(masterGain);
        osc.start();
      });

      // ── Engine rumble (filtered white noise) ─────────────────────────────
      const bufSize = 2 * ctx.sampleRate;
      const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
      const noise = ctx.createBufferSource();
      noise.buffer = buf; noise.loop = true;
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(90, ctx.currentTime);
      filterNodeRef.current = filter;
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.35, ctx.currentTime);
      
      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(14, ctx.currentTime);
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(22, ctx.currentTime);
      lfo.connect(lfoGain); lfoGain.connect(filter.frequency);
      
      noise.connect(filter); filter.connect(noiseGain); noiseGain.connect(masterGain);
      noise.start(); lfo.start();
    } catch (e) {}

    // ── T+0.0s  Main engine ignition ──────────────────────────────────────
    speak("Main engine start. Boosters at one hundred percent.");
    addLog("CMD T+0s: Main engine start — boosters 100%", "cmd");

    // ── Telemetry ticker (reads stageRef — no stale closure) ──────────────
    const accelRef = { current: 2.8 };
    const ticker = setInterval(() => {
      const s = stageRef.current;
      const a = accelRef.current;
      setTelemetry((prev) => {
        if (s === "stage1") return {
          altitude: Math.min(prev.altitude + Math.random() * 400 + 300, 45000),
          velocity: Math.min(prev.velocity + Math.random() * 130 + 180, 9000),
          acceleration: a,
        };
        if (s === "stage2") return {
          altitude: Math.min(prev.altitude + Math.random() * 2200 + 1800, 200000),
          velocity: Math.min(prev.velocity + Math.random() * 700 + 700, 27000),
          acceleration: a,
        };
        return {
          altitude: Math.min(prev.altitude + 150, 250000),
          velocity: 28000,
          acceleration: 0.0,
        };
      });
    }, 80);

    // ── T+0.8s  Throttle up / Max-Q warning ──────────────────────────────
    const tA = setTimeout(() => {
      speak("Throttle up. Approaching maximum aerodynamic pressure.");
      addLog("CMD T+0.8s: Throttle up — approaching Max Q", "cmd");
      accelRef.current = 3.2;
    }, 800);

    // ── T+1.8s  Engine throttle-down before separation ────────────────────
    const tB = setTimeout(() => {
      speak("Throttle down. Preparing for stage one separation.");
      addLog("CMD T+1.8s: Throttle down — stage 1 separation imminent", "cmd");
      accelRef.current = 1.5;
      setStatusText("STAGE 1: THROTTLE DOWN — SEPARATION IMMINENT");
    }, 1800);

    // ── T+2.2s  Stage 1 separation command ───────────────────────────────
    const tB2 = setTimeout(() => {
      speak("Stage one separation command.");
      addLog("CMD T+2.2s: Stage one separation command", "cmd");
    }, 2200);

    // ── T+2.35s Stage 1 separation voice ─────────────────────────────────
    const tB3 = setTimeout(() => {
      speak("Stage one separation.");
      addLog("CMD T+2.35s: Stage 1 separation", "cmd");
    }, 2350);

    // ── T+2.5s  Stage 1 booster separation ───────────────────────────────
    const tC = setTimeout(() => {
      speak("Stage one separation confirmed. Stage two engine ignition.");
      addLog("CMD T+2.5s: Stage 1 separation confirmed — stage 2 ignition", "cmd");
      setStatusText("STAGE 2: THERMOSPHERE BURN");
      setDetachingBooster(true);
      setStage("stage2");
      stageRef.current = "stage2";
      accelRef.current = 4.5;
      if (filterNodeRef.current && audioCtxRef.current) {
        filterNodeRef.current.frequency.setValueAtTime(140, audioCtxRef.current.currentTime);
      }
    }, 2500);

    // ── T+3.5s  Exosphere crossing ────────────────────────────────────────
    const tD = setTimeout(() => {
      speak("Exosphere boundary crossed. Engine throttle reducing for vacuum.");
      addLog("CMD T+3.5s: Exosphere boundary — throttle reducing", "cmd");
      accelRef.current = 2.8;
      setStatusText("STAGE 2: EXOSPHERE — VACUUM THROTTLE");
      if (filterNodeRef.current && audioCtxRef.current) {
        filterNodeRef.current.frequency.setValueAtTime(80, audioCtxRef.current.currentTime);
      }
    }, 3500);

    // ── T+4.5s  Fairing jettison ──────────────────────────────────────────
    const tE = setTimeout(() => {
      speak("Fairing jettison confirmed. Payload lander deployed.");
      addLog("CMD T+4.5s: Fairing split complete — lander deployed", "cmd");
      setStatusText("STAGE 3: LANDER DEPLOYMENT");
      setFairingOpen(true);
      setStage("stage3");
      stageRef.current = "stage3";
      accelRef.current = 0.0;
      if (filterNodeRef.current && audioCtxRef.current) {
        filterNodeRef.current.frequency.setValueAtTime(35, audioCtxRef.current.currentTime);
      }
    }, 4500);

    // ── T+5.5s  Orbital velocity achieved ─────────────────────────────────
    const tF = setTimeout(() => {
      speak("Orbital velocity achieved. Twenty eight thousand kilometers per hour.");
      addLog("CMD T+5.5s: Orbital velocity 28,000 km/h achieved", "cmd");
      setStatusText("STAGE 3: ORBITAL INSERTION NOMINAL");
    }, 5500);

    // ── T+6.5s  Portfolio uplink ───────────────────────────────────────────
    const tG = setTimeout(() => {
      speak("Payload insertion nominal. Initiating portfolio uplink.");
      addLog("CMD T+6.5s: Payload insertion nominal — portfolio uplink active", "cmd");
    }, 6500);

    // ── T+8.0s  Transition to website ─────────────────────────────────────
    const tH = setTimeout(() => {
      addLog("SYS T+8.0s: Portfolio payload delivered — loading site", "sys");
      if (gainNodeRef.current && audioCtxRef.current) {
        gainNodeRef.current.gain.linearRampToValueAtTime(0, audioCtxRef.current.currentTime + 0.5);
      }
      onCinematicComplete();
    }, 8000);

    return () => {
      clearInterval(ticker);
      clearTimeout(tA); clearTimeout(tB); clearTimeout(tB2); clearTimeout(tB3); clearTimeout(tC); clearTimeout(tD);
      clearTimeout(tE); clearTimeout(tF); clearTimeout(tG); clearTimeout(tH);
    };
  }, []); // ← runs ONCE only — no stage dependency

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    isMutedRef.current = next;
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.linearRampToValueAtTime(
        next ? 0 : (stageRef.current === "stage3" ? 0.05 : stageRef.current === "stage2" ? 0.35 : 0.45),
        audioCtxRef.current.currentTime + 0.3
      );
    }
    if (next && typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel();
  };

  return (
    <div className="fixed inset-0 z-[99999] text-white flex flex-col overflow-hidden select-none font-mono">
      {/* ── Solid Pure Black Background ─────────────────────────────── */}
      <div className="absolute inset-0 z-0 bg-black pointer-events-none" />



      {/* ── Header bar ── */}
      <div className="relative z-10 flex items-center justify-between px-5 py-3 border-b border-white/10 bg-black/50 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-white shadow-[0_0_6px_#ffffff] animate-pulse" />
          <span className="text-xs font-bold tracking-widest text-white/70">MISSION CONTROL — AF-CONVERTIX LANDER</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-[10px] text-white/40 font-bold tracking-wider">
          <span>TARGET: <span className="text-white">ANTONY PORTFOLIO</span></span>
          <span>STATUS: <span className="text-white">{statusText}</span></span>
        </div>
        <button
          onClick={toggleMute}
          className="text-[10px] border border-white/15 px-3 py-1 rounded hover:bg-white hover:text-black transition-all font-bold tracking-wider"
        >
          {isMuted ? "UNMUTE" : "MUTE"}
        </button>
      </div>

      {/* ── Main three-pane layout ── */}
      <div className="relative z-10 flex-1 flex flex-col lg:flex-row gap-3 p-4 overflow-hidden min-h-0">

        {/* Left — Systems */}
        <div className="w-full lg:w-56 shrink-0 bg-black/50 border border-white/10 rounded-lg p-3 flex flex-col gap-3">
          <div className="text-[10px] font-bold text-white/40 tracking-widest border-b border-white/10 pb-2">SYSTEMS</div>
          {[
            ["GUIDANCE", "AUTO VECTOR"],
            ["NOZZLE THRUST", "100% PRESSURE"],
            ["TELEMETRY", "SYNCHRONIZED"],
            ["PAYLOAD LOCK", "SECURED"],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between items-center bg-white/5 px-2 py-1.5 rounded border border-white/5 text-[10px]">
              <span className="text-white/45">{k}</span>
              <span className="text-white font-bold">{v}</span>
            </div>
          ))}

          <div className="mt-auto pt-3 border-t border-white/10">
            <div className="text-[10px] font-bold text-white/40 tracking-widest mb-2">FLIGHT MILESTONES</div>
            <div className="space-y-1.5">
              {[
                ["STAGE 1 SEPARATION", stage !== "stage1"],
                ["FAIRING JETTISON", stage === "stage3"],
                ["LANDER DEPLOYED", fairingOpen],
              ].map(([label, done]) => (
                <div key={label as string} className="flex items-center gap-2 text-[10px]">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${done ? "bg-white shadow-[0_0_6px_#ffffff]" : "bg-white/15 animate-pulse"}`} />
                  <span className={done ? "text-white font-bold" : "text-white/35"}>{label as string}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center — Rocket visualizer */}
        <div className="flex-1 bg-black/25 border border-white/10 rounded-lg flex items-center justify-center overflow-hidden relative min-h-[320px]">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none z-0" />
          <motion.div
            animate={stage === "stage1" ? { x: [0,-1,1,-1,0], y: [0,.4,-.4,.4,0] }
              : stage === "stage2" ? { x: [0,-.3,.3,0], y: [0,.2,-.2,0] } : {}}
            transition={{ repeat: Infinity, duration: 0.09 }}
            className="z-10"
          >
            {/* Exhaust cloud at launch */}
            {stage === "stage1" && (
              <div className="absolute -bottom-16 w-40 h-14 flex justify-center pointer-events-none">
                {Array.from({ length: 6 }).map((_, i) => (
                  <motion.div key={i}
                    animate={{ scale: [1,2.5,3.5], opacity: [0.6,0.3,0], x: [0,(i-2.5)*14], y: [0,35] }}
                    transition={{ duration: Math.random()*0.35+0.25, repeat: Infinity, ease: "easeOut" }}
                    className="absolute w-8 h-8 bg-gradient-to-t from-orange-500 via-[#44443a] to-transparent rounded-full blur-md"
                  />
                ))}
              </div>
            )}
            <RocketSVG stage={stage} detachingBooster={detachingBooster} fairingOpen={fairingOpen} />
          </motion.div>
        </div>

        {/* Right — Command console */}
        <div className="w-full lg:w-64 shrink-0 bg-black/50 border border-white/10 rounded-lg p-3 flex flex-col min-h-0">
          <div className="text-[10px] font-bold text-white/40 tracking-widest border-b border-white/10 pb-2 mb-2 shrink-0">COMMAND CONSOLE</div>
          <div className="flex-1 overflow-y-auto space-y-1.5 pr-0.5 min-h-0">
            <AnimatePresence>
              {logs.map((log) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`text-[10px] leading-snug px-2 py-1.5 rounded border ${
                    log.type === "sys"
                      ? "text-[#8f8f7c] bg-[#44443a]/20 border-[#44443a]/30"
                      : "text-white bg-white/5 border-white/10"
                  }`}
                >
                  {log.text}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

      </div>

      {/* ── Footer telemetry bar ── */}
      <div className="relative z-10 shrink-0 bg-black/60 border-t border-white/10 px-5 py-3 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          ["ALTITUDE", `${(telemetry.altitude / 1000).toFixed(2)}`, "KM", telemetry.altitude / 250000],
          ["VELOCITY", `${telemetry.velocity.toLocaleString()}`, "KM/H", telemetry.velocity / 28000],
          ["G-FORCE", `${telemetry.acceleration.toFixed(1)}`, "G", telemetry.acceleration / 5],
          null,
        ].map((item, idx) =>
          item ? (
            <div key={idx} className={`${idx < 3 ? "border-r border-white/10 pr-3" : ""}`}>
              <div className="text-[9px] text-white/35 tracking-widest mb-1">{item[0] as string}</div>
              <div className="text-lg font-bold text-white leading-none">
                {item[1] as string} <span className="text-[10px] text-white/30">{item[2] as string}</span>
              </div>
              <div className="w-full h-[2px] bg-white/5 mt-2 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#44443a] to-[#8f8f7c]"
                  animate={{ width: `${Math.min((item[3] as number) * 100, 100)}%` }}
                  transition={{ duration: 0.08 }}
                />
              </div>
            </div>
          ) : (
            <div key={idx} className="flex flex-col justify-center pl-2">
              <div className="text-[9px] text-white/35 tracking-widest mb-1">SEQUENCE STATUS</div>
              <div className="text-[11px] font-bold text-white animate-pulse uppercase">{statusText}</div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

// ── Realistic SVG Rocket ──
const RocketSVG: React.FC<{ stage: string; detachingBooster: boolean; fairingOpen: boolean }> = ({
  stage, detachingBooster, fairingOpen,
}) => (
  <div className="relative w-32 h-80 flex flex-col items-center">

    {/* Nosecone / Fairing */}
    {!fairingOpen ? (
      <div className="w-12 h-20 flex flex-col items-center z-20">
        <div className="w-2 h-2.5 bg-[#44443a] rounded-t-full" />
        <div className="w-10 h-[4.5rem] bg-gradient-to-b from-white via-white/80 to-[#44443a] border border-white/20 rounded-t-[2rem] relative overflow-hidden flex items-center justify-center">
          <div className="absolute top-3 w-full h-px bg-[#44443a]/50" />
          <div className="absolute left-1/2 w-px h-full bg-[#44443a]/20 top-0" />
        </div>
      </div>
    ) : (
      <div className="w-28 h-20 relative flex justify-between z-20">
        <motion.div initial={{ x: 0, rotate: 0, opacity: 1 }} animate={{ x: -80, y: 70, rotate: -70, opacity: 0 }}
          transition={{ duration: 1.6, ease: "easeOut" }}
          className="w-5 h-[4.5rem] bg-gradient-to-b from-white to-[#44443a] rounded-tl-[2rem] border border-white/20" />

        {/* Gold MLI Lander -> Brand Lander */}
        <motion.div initial={{ scale: 0.85, y: 10 }} animate={{ scale: 1.2, y: -18 }}
          transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
          {/* Solar wings */}
          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.2, duration: 1, ease: "easeOut" }}
            className="absolute w-24 h-4 flex justify-between">
            {[0,1].map(i => (
              <div key={i} className={`w-9 h-4 ${i===0?"bg-gradient-to-r":"bg-gradient-to-l"} from-black via-black/80 to-[#44443a] border border-[#44443a] rounded-sm overflow-hidden shadow-[0_0_8px_rgba(68,68,58,0.35)]`}>
                <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_5px,rgba(255,255,255,0.1)_6px)] opacity-40" />
              </div>
            ))}
          </motion.div>
          {/* Body */}
          <div className="w-7 h-9 bg-gradient-to-b from-[#8f8f7c] via-[#44443a] to-black border border-white/20 rounded shadow-[0_0_14px_rgba(68,68,58,0.4)] flex flex-col items-center justify-between p-1 z-10">
            <div className="w-3.5 h-3.5 rounded-full bg-white border border-[#44443a] flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-[#8f8f7c] animate-ping" />
            </div>
            <div className="w-2.5 h-1.5 bg-black border border-[#44443a] rounded-sm" />
          </div>
          {/* Landing legs */}
          <div className="absolute -bottom-1 w-10 h-3 flex justify-between px-1">
            <div className="w-1 h-3 bg-[#8f8f7c] origin-top rotate-45 rounded-sm" />
            <div className="w-1 h-3 bg-[#8f8f7c] origin-top -rotate-45 rounded-sm" />
          </div>
        </motion.div>

        <motion.div initial={{ x: 0, rotate: 0, opacity: 1 }} animate={{ x: 80, y: 70, rotate: 70, opacity: 0 }}
          transition={{ duration: 1.6, ease: "easeOut" }}
          className="w-5 h-[4.5rem] bg-gradient-to-b from-white to-[#44443a] rounded-tr-[2rem] border border-white/20" />
      </div>
    )}

    {/* Stage 2 tank */}
    <div className="w-10 h-24 bg-gradient-to-b from-white via-white/80 to-[#8f8f7c] border-x border-white/15 relative flex items-center justify-center z-10 shadow-lg overflow-hidden">
      <div className="absolute top-0 w-full h-1 bg-[#44443a]/50" />
      <span className="text-[7px] font-black tracking-widest text-[#44443a] rotate-90 whitespace-nowrap">AF CONVERTIX</span>
      <div className="absolute bottom-0 w-full h-1 bg-[#44443a]/50" />
    </div>

    {/* Stage 2 vacuum nozzle & plume */}
    {stage !== "stage1" && !fairingOpen && (
      <div className="relative w-6 h-4 flex flex-col items-center z-10">
        <div className="w-4 h-3 bg-gradient-to-b from-[#44443a] to-black rounded-b border-x border-[#44443a]" />
        <motion.div animate={{ scaleY: [1,1.3,0.9,1.2] }} transition={{ repeat: Infinity, duration: 0.09 }}
          className="absolute top-2 w-3 h-16 bg-gradient-to-b from-orange-400 via-red-500 to-transparent rounded-full blur-[2px] shadow-[0_0_18px_orange] origin-top" />
      </div>
    )}

    {/* Stage 1 booster */}
    {!detachingBooster ? (
      <div className="w-12 h-28 bg-gradient-to-b from-white via-white/70 to-[#8f8f7c] border border-white/10 rounded-b relative flex flex-col items-center z-10 shadow-2xl">
        {/* Grid fins */}
        {[-1,1].map((dir) => (
          <div key={dir} className={`absolute ${dir===-1?"-left-2.5":"-right-2.5"} top-2 w-2.5 h-5 bg-[#44443a] border border-white/20 rounded-sm ${dir===1?"-skew-y-3":"skew-y-3"} flex flex-col justify-evenly overflow-hidden`}>
            {[0,1,2].map(l => <div key={l} className="w-full h-px bg-white/20" />)}
          </div>
        ))}
        {/* Nozzle ring */}
        <div className="absolute bottom-2 w-full h-px bg-[#44443a]/80" />
        {/* Three engine bells */}
        <div className="absolute -bottom-1.5 w-10 flex justify-between px-0.5">
          {[0,1,2].map(i => (
            <div key={i} className={`${i===1?"w-4":"w-2.5"} h-3 bg-gradient-to-b from-[#44443a] to-black border border-white/10 rounded-b-sm`} />
          ))}
        </div>
        {/* Flame plume */}
        {stage === "stage1" && (
          <motion.div animate={{ scaleY: [1,1.2,0.9,1.15] }} transition={{ repeat: Infinity, duration: 0.08 }}
            className="absolute -bottom-24 w-7 h-24 bg-gradient-to-b from-orange-500 via-red-500 to-transparent rounded-full origin-top blur-[2px] shadow-[0_0_28px_orange]" />
        )}
      </div>
    ) : (
      <motion.div initial={{ y:0, opacity:1, rotate:0 }} animate={{ y:300, opacity:0, rotate:20 }}
        transition={{ duration: 2, ease:"easeIn" }}
        className="w-12 h-28 bg-gradient-to-b from-white via-white/70 to-[#8f8f7c] border border-white/10 rounded-b relative z-0">
        <div className="absolute -bottom-4 left-3 w-6 h-8 bg-white/10 blur-md rounded-full animate-pulse" />
      </motion.div>
    )}

  </div>
);
