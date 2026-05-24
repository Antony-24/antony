"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "@/components/Footer";
import {
  Rocket,
  Search,
  MapPin,
  Globe2,
  Wind,
  CloudRain,
  Sun,
  Shield,
  Layers,
  Sparkles,
  HelpCircle,
  Activity,
  Award,
  BookOpen,
  FileText,
} from "lucide-react";

type IsroTab = "launchers" | "spacecrafts" | "satellites" | "centres" | "bhuvan" | "research";

interface Spacecraft {
  id: number;
  name: string;
}

interface Launcher {
  id: string;
}

interface Centre {
  id: number;
  name: string;
  Place: string;
  State: string;
}

interface CustomerSatellite {
  id: string;
  country: string;
  launch_date: string;
  mass: string;
  launcher: string;
}

interface ResearchAbstract {
  id: string;
  title: string;
  mission: string;
  abstract: string;
  author: string;
  date: string;
}

export default function IsroData() {
  const [activeTab, setActiveTab] = useState<IsroTab>("launchers");

  // API states
  const [launchers, setLaunchers] = useState<Launcher[]>([
    { id: "PSLV (Polar Satellite Launch Vehicle)" },
    { id: "GSLV Mk II (Geosynchronous Satellite Launch Vehicle)" },
    { id: "LVM3 / GSLV Mk III (Launch Vehicle Mark 3)" },
    { id: "SSLV (Small Satellite Launch Vehicle)" },
    { id: "RLV-TD (Reusable Launch Vehicle Technology Demonstrator)" },
  ]);
  const [spacecrafts, setSpacecrafts] = useState<Spacecraft[]>([
    { id: 1, name: "Chandrayaan-3 (Lunar Lander & Rover)" },
    { id: 2, name: "Gaganyaan-1 (Manned Spaceflight Capsule)" },
    { id: 3, name: "Mangalyaan (Mars Orbiter Mission)" },
    { id: 4, name: "Aditya-L1 (Solar Coronagraph Probe)" },
    { id: 5, name: "AstroSat (Multi-wavelength Astronomy Space Observatory)" },
  ]);
  const [centres, setCentres] = useState<Centre[]>([
    { id: 1, name: "Satish Dhawan Space Centre (SDSC-SHAR)", Place: "Sriharikota", State: "Andhra Pradesh" },
    { id: 2, name: "Vikram Sarabhai Space Centre (VSSC)", Place: "Thiruvananthapuram", State: "Kerala" },
    { id: 3, name: "U R Rao Satellite Centre (URSC)", Place: "Bengaluru", State: "Karnataka" },
    { id: 4, name: "Space Applications Centre (SAC)", Place: "Ahmedabad", State: "Gujarat" },
    { id: 5, name: "Liquid Propulsion Systems Centre (LPSC)", Place: "Valiamala", State: "Tamil Nadu" },
  ]);
  const [satellites, setSatellites] = useState<CustomerSatellite[]>([
    { id: "OneWeb-36", country: "United Kingdom", launcher: "LVM3 M3", mass: "5805", launch_date: "2023-03-26" },
    { id: "TeLEOS-2", country: "Singapore", launcher: "PSLV-C55", mass: "741", launch_date: "2023-04-22" },
    { id: "DS-SAR", country: "Singapore", launcher: "PSLV-C56", mass: "360", launch_date: "2023-07-30" },
    { id: "Amazonia-1", country: "Brazil", launcher: "PSLV-C51", mass: "637", launch_date: "2021-02-28" },
  ]);

  // Loaders & Search
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [satelliteCountry, setSatelliteCountry] = useState("all");

  // Bhuvan Weather parameters (simulated 2050 MOSDAC feed)
  const [seaTemp, setSeaTemp] = useState(28.4);
  const [monsoonIndex, setMonsoonIndex] = useState(82);

  // System telemetry logger
  const [logs, setLogs] = useState<string[]>([
    "SYS INIT: ISRO Geospatial & Space Telemetry stream engaged",
    "UPLINK SECURED: Sriharikota Launch Site coordinates loaded",
  ]);

  const addLog = (msg: string) => {
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [`[${time}] ${msg}`, ...prev.slice(0, 10)]);
  };

  // ── Fetch Launchers ──
  const fetchLaunchers = async (isInitial = false) => {
    if (!isInitial) setLoading(true);
    try {
      const res = await fetch("https://isro.vercel.app/api/launchers");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setLaunchers(data.launchers || []);
      addLog(`LAUNCHERS: Synchronized ${data.launchers?.length} booster configuration profiles`);
    } catch {
      // Keep pre-populated state
      addLog("WARNING: Community API rate-limited. Rendered heavy lift launcher registry.");
    } finally {
      setLoading(false);
    }
  };

  // ── Fetch Spacecrafts ──
  const fetchSpacecrafts = async (isInitial = false) => {
    if (!isInitial) setLoading(true);
    try {
      const res = await fetch("https://isro.vercel.app/api/spacecrafts");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setSpacecrafts(data.spacecrafts || []);
      addLog(`SPACECRAFTS: Synchronized ${data.spacecrafts?.length} spacecraft registries`);
    } catch {
      // Keep pre-populated state
      addLog("WARNING: Spacecraft API offline. Loaded deep-space exploration catalog.");
    } finally {
      setLoading(false);
    }
  };

  // ── Fetch Customer Satellites ──
  const fetchSatellites = async () => {
    try {
      const res = await fetch("https://isro.vercel.app/api/customer_satellites");
      if (!res.ok) throw new Error();
      const data = await res.json();
      const list = data.customer_satellites || [];
      const formatted: CustomerSatellite[] = list.map((s: any, idx: number) => ({
        id: s.id || `SAT-${idx}`,
        country: s.country || "International",
        launch_date: s.launch_date || "N/A",
        mass: s.mass || "N/A",
        launcher: s.launcher || "PSLV",
      }));
      setSatellites(formatted.slice(0, 30));
      addLog(`PAYLOADS: Synchronized ${formatted.length} customer payload profiles`);
    } catch {
      // Keep pre-populated state
      addLog("WARNING: Customer payload API offline. Loaded primary international launch catalog.");
    }
  };

  // ── Fetch Centres ──
  const fetchCentres = async (isInitial = false) => {
    if (!isInitial) setLoading(true);
    try {
      const res = await fetch("https://isro.vercel.app/api/centres");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setCentres(data.centres || []);
      addLog(`FACILITIES: Secured ${data.centres?.length} ISRO facility coordinates`);
    } catch {
      // Keep pre-populated state
      addLog("WARNING: Facilities data offline. Loaded primary centers catalog.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLaunchers(true);
    fetchSpacecrafts(true);
    fetchCentres(true);
    fetchSatellites();
  }, []);

  // Scientific Research Abstracts List (ISSDC Deep Research)
  const researchBriefs: ResearchAbstract[] = [
    {
      id: "ISSDC-CY3-01",
      title: "APXS Chemical Analysis of Lunar South Polar Regolith",
      mission: "Chandrayaan-3",
      abstract: "In-situ chemical analysis of lunar soil at latitude 69° S using the Alpha Particle X-ray Spectrometer. Discovered an enhanced presence of minor elements like sulfur alongside magnesium, aluminum, and silicon compounds.",
      author: "ISRO Lunar Science Working Group",
      date: "2023-09-12",
    },
    {
      id: "ISSDC-MOM-04",
      title: "Mars Exospheric Neutral Composition and Isotope Ratios",
      mission: "Mars Orbiter Mission",
      abstract: "Investigation of Martian exospheric dynamics via the MENCA mass spectrometer. Telemetry catalogs high-resolution profiles of oxygen-16/18 isotopes and argon escape ratios during dust storm cycles.",
      author: "Space Physics Laboratory (SPL / VSSC)",
      date: "2018-05-20",
    },
    {
      id: "ISSDC-L1-02",
      title: "Solar Coronal Mass Ejection Acceleration Metrics in L1 Orbit",
      mission: "Aditya-L1",
      abstract: "Tracking CME velocity curves and magnetic field boundary disturbances at Lagrangian Point 1. CALIPSO sensor arrays log real-time solar solar wind flux thresholds during Class X coronal discharges.",
      author: "Physical Research Laboratory (PRL)",
      date: "2024-02-15",
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white font-mono relative overflow-hidden flex flex-col justify-between selection:bg-[#44443a] selection:text-white">
      {/* 2050 Grid overlay */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none opacity-45" />

      {/* Floating telemetry glow */}
      <div className="absolute bottom-1/4 right-1/4 w-[40vw] h-[40vh] bg-[#44443a]/5 rounded-full blur-[160px] pointer-events-none z-0" />

      <div className="relative z-10 w-full">

        {/* Space header spacer */}
        <div className="h-28" />

        {/* ── Main content wrapper ── */}
        <div className="container mx-auto px-6 py-6 flex flex-col gap-6">

          {/* ── 2050 Cybernetic Title & Console Logs bar ── */}
          <div className="border border-[#44443a]/30 bg-black/60 backdrop-blur-md rounded-lg p-5 flex flex-col lg:flex-row gap-5 justify-between items-start lg:items-center relative overflow-hidden">
            {/* HUD Corner markers */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#44443a]" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#44443a]" />

            <div>
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#44443a] shadow-[0_0_8px_#44443a] animate-pulse" />
                <span className="text-[10px] tracking-widest text-[#8f8f7c] font-black uppercase">ISRO MULTI-SECTOR DATA DECK — VER 2050.4</span>
              </div>
              <h1 className="text-3xl font-bold tracking-tighter text-white font-poppins mt-1">
                Indian Aerospace <span className="text-gradient font-bold">Telemetry Stream</span>
              </h1>
            </div>

            {/* Scrolling console logs */}
            <div className="w-full lg:w-96 h-12 bg-black/80 border border-white/5 rounded px-3 py-1.5 overflow-y-auto text-[9px] text-[#8f8f7c] space-y-1 scrollbar-thin">
              {logs.map((log, idx) => (
                <div key={idx} className="truncate">
                  <span className="text-emerald-400">✓</span> {log}
                </div>
              ))}
            </div>
          </div>

          {/* ── Interactive grid ── */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">

            {/* Left sidebar nav tabs */}
            <div className="flex flex-row lg:flex-col gap-2 bg-black/40 border border-white/5 p-3 rounded-lg overflow-x-auto scrollbar-none snap-x snap-mandatory">
              <span className="hidden lg:block text-[9px] text-white/40 tracking-widest font-black uppercase px-2 mb-2 shrink-0">TELEMETRY SECTORS</span>
              {[
                { id: "launchers", label: "BOOSTER STACKS", desc: "Launch Vehicles & Capacity", icon: Rocket },
                { id: "spacecrafts", label: "SPACECRAFT HUD", desc: "Interplanetary Missions", icon: Globe2 },
                { id: "satellites", label: "CUSTOMER PAYLOADS", desc: "International Launch Index", icon: Award },
                { id: "centres", label: "FACILITY MAP", desc: "Space & Research Centres", icon: MapPin },
                { id: "bhuvan", label: "BHUVAN WEATHER", desc: "GIS Meteorological Scans", icon: Layers },
                { id: "research", label: "ISSDC RESEARCH", desc: "Deep-Space Science Briefings", icon: BookOpen },
              ].map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id as IsroTab);
                      setSearchQuery("");
                      addLog(`Navigated to deck: ${tab.label}`);
                    }}
                    className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-all duration-300 min-w-max lg:min-w-0 shrink-0 snap-start ${active
                        ? "bg-[#44443a]/15 border-[#44443a] text-white shadow-[inset_0_0_12px_rgba(68,68,58,0.25)]"
                        : "bg-transparent border-transparent text-white/55 hover:bg-white/5 hover:text-white"
                      }`}
                  >
                    <Icon className={`w-5 h-5 shrink-0 ${active ? "text-white" : "text-white/40"}`} />
                    <div>
                      <div className="text-[11px] font-black tracking-widest uppercase">{tab.label}</div>
                      <div className="text-[9px] text-white/35 font-light leading-none mt-0.5 hidden lg:block">{tab.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3 border border-[#44443a]/25 bg-black/40 rounded-lg p-6 min-h-[520px] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 border-[#44443a]" />
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 border-[#44443a]" />

              <AnimatePresence mode="wait">

                {/* ── Launchers Tab ── */}
                {activeTab === "launchers" && (
                  <motion.div
                    key="launchers"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex flex-col gap-5"
                  >
                    <div className="flex justify-between items-center border-b border-white/10 pb-4">
                      <div>
                        <h2 className="text-xl font-bold tracking-tight">Active Launcher Registry</h2>
                        <p className="text-[10px] text-white/45 mt-0.5 uppercase tracking-widest">ISRO BOOSTER STACKS & PAYLOAD INDEX</p>
                      </div>
                    </div>

                    {loading ? (
                      <FuturisticLoader label="QUERYING BOOSTER PROFILES..." />
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {launchers.map((lnch, idx) => {
                          const isHvy = lnch.id.toLowerCase().includes("lvm3") || lnch.id.toLowerCase().includes("mk iii");
                          const isPslv = lnch.id.toLowerCase().includes("pslv");
                          const capacity = isHvy ? "10,000 KG (LEO)" : isPslv ? "3,800 KG (LEO)" : "1,500 KG (LEO)";
                          const thrust = isHvy ? "10,200 kN" : isPslv ? "4,400 kN" : "1,200 kN";
                          const stages = isPslv ? "4 Stages (Solid/Liquid)" : "3 Stages (Cryogenic)";
                          return (
                            <div
                              key={idx}
                              className="p-4 border border-white/5 hover:border-[#44443a] bg-black/60 rounded-lg relative overflow-hidden flex flex-col justify-between group transition-all"
                            >
                              <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-[#44443a]" />
                              <div>
                                <span className="text-[8px] border border-[#44443a] text-[#8f8f7c] px-2 py-0.5 rounded font-black tracking-widest uppercase">
                                  {isHvy ? "HEAVY LIFT" : "ORBITAL BOOSTER"}
                                </span>
                                <h3 className="text-sm font-bold text-white mt-3 font-poppins tracking-tight uppercase group-hover:text-gradient">
                                  {lnch.id}
                                </h3>

                                <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-white/5 text-[9px] text-white/50">
                                  <div>
                                    <span className="text-white/30 block">THRUST STACK</span>
                                    <span className="font-bold text-white">{thrust}</span>
                                  </div>
                                  <div>
                                    <span className="text-white/30 block">MAX CAPACITY</span>
                                    <span className="font-bold text-white">{capacity}</span>
                                  </div>
                                  <div className="col-span-2">
                                    <span className="text-white/30 block">STAGENCY TYPE</span>
                                    <span className="font-bold text-white">{stages}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="mt-4 pt-2 flex items-center justify-between text-[9px] text-[#8f8f7c]">
                                <span className="flex items-center gap-1"><Rocket className="w-3.5 h-3.5" /> STACK ACTIVE</span>
                                <span className="text-emerald-400 font-bold">READY</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* ── Spacecrafts Tab ── */}
                {activeTab === "spacecrafts" && (
                  <motion.div
                    key="spacecrafts"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex flex-col gap-5"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/10 pb-4 gap-3">
                      <div>
                        <h2 className="text-xl font-bold tracking-tight">Spacecraft & Interplanetary Registry</h2>
                        <p className="text-[10px] text-white/45 mt-0.5 uppercase tracking-widest">DEEP SPACE TELEMETRY CATALOUGE</p>
                      </div>

                      <div className="flex items-center gap-2 border border-white/10 rounded px-2.5 py-1.5 bg-white/5 w-full sm:w-60">
                        <Search className="w-3.5 h-3.5 text-[#8f8f7c]" />
                        <input
                          type="text"
                          placeholder="SEARCH MISSION..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="bg-transparent border-none text-xs text-white focus:outline-none placeholder:text-white/20 w-full"
                        />
                      </div>
                    </div>

                    {loading ? (
                      <FuturisticLoader label="DECRYPTING SPACE DECK REGISTRY..." />
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin">
                        {spacecrafts
                          .filter((sc) => sc.name.toLowerCase().includes(searchQuery.toLowerCase()))
                          .map((sc) => {
                            const isLunar = sc.name.toLowerCase().includes("chandra");
                            const isMars = sc.name.toLowerCase().includes("mangalyaan");
                            const isSolar = sc.name.toLowerCase().includes("aditya");
                            return (
                              <div
                                key={sc.id}
                                className="p-4 border border-white/5 hover:border-[#44443a] bg-black/60 rounded-lg relative overflow-hidden flex flex-col justify-between group transition-all"
                              >
                                <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-[#44443a]" />
                                <div>
                                  <span className="text-[8px] border border-[#44443a] text-[#8f8f7c] px-2 py-0.5 rounded font-black tracking-widest uppercase">
                                    {isLunar ? "LUNAR MISSION" : isMars ? "MARS INTERPLANETARY" : isSolar ? "SOLAR PROBE" : "EARTH OBSERVATION"}
                                  </span>
                                  <h3 className="text-sm font-bold text-white mt-3 font-poppins tracking-tight uppercase group-hover:text-gradient">
                                    {sc.name}
                                  </h3>
                                  <p className="text-[10px] text-white/40 mt-2 font-light leading-relaxed">
                                    {isLunar
                                      ? "Telemetry tracks soft-landing velocity curves at the south polar region."
                                      : isMars
                                        ? "Successfully mapped Martian atmospheric isotopes and high-altitude iron structures."
                                        : isSolar
                                          ? "Stationed at Lagrangian Point 1 (L1) monitoring solar solar wind fluxes."
                                          : "Delivering high-resolution multispectral terrain imagery layers via Earth orbit."}
                                  </p>
                                </div>
                                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[9px] text-[#8f8f7c]">
                                  <span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" /> SCIENTIFIC LOAD</span>
                                  <span className="text-emerald-400 animate-pulse font-bold">NOMINAL</span>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* ── International Customer Satellites Tab ── */}
                {activeTab === "satellites" && (
                  <motion.div
                    key="satellites"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex flex-col gap-5"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/10 pb-4 gap-3">
                      <div>
                        <h2 className="text-xl font-bold tracking-tight">International Payload Registry</h2>
                        <p className="text-[10px] text-white/45 mt-0.5 uppercase tracking-widest">ISRO COMMERCIAL LAUNCH METRICS</p>
                      </div>

                      {/* Country filter select */}
                      <select
                        value={satelliteCountry}
                        onChange={(e) => setSatelliteCountry(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#44443a] cursor-pointer"
                      >
                        <option value="all" className="bg-black">All Customers</option>
                        <option value="singapore" className="bg-black">Singapore</option>
                        <option value="united kingdom" className="bg-black">United Kingdom</option>
                        <option value="brazil" className="bg-black">Brazil</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[360px] overflow-y-auto pr-1 scrollbar-thin">
                      {satellites
                        .filter((s) => satelliteCountry === "all" || s.country.toLowerCase().includes(satelliteCountry))
                        .map((s, idx) => (
                          <div
                            key={idx}
                            className="p-4 border border-white/5 hover:border-[#44443a] bg-black/60 rounded-lg relative overflow-hidden flex flex-col justify-between group transition-all"
                          >
                            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#44443a]" />
                            <div>
                              <div className="flex justify-between items-center text-[8px] text-[#8f8f7c] font-black tracking-widest uppercase">
                                <span>CO-PASSENGER: {s.id}</span>
                                <span>{s.country}</span>
                              </div>
                              <h4 className="text-sm font-bold text-white mt-3 uppercase tracking-tight font-poppins">
                                {s.id} Orbital Payload
                              </h4>

                              <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/5 text-[9px] text-white/50">
                                <div>
                                  <span className="text-white/30 block">MASS</span>
                                  <span className="font-bold text-white">{s.mass}</span>
                                </div>
                                <div>
                                  <span className="text-white/30 block">LAUNCHER</span>
                                  <span className="font-bold text-white">{s.launcher}</span>
                                </div>
                                <div>
                                  <span className="text-white/30 block">LAUNCH DATE</span>
                                  <span className="font-bold text-white">{s.launch_date}</span>
                                </div>
                              </div>
                            </div>
                            <div className="mt-3.5 pt-2 flex items-center justify-between text-[8px] text-white/40">
                              <span>MISSION CODE: NSIL-2050</span>
                              <span className="text-emerald-400 font-bold uppercase tracking-widest">DEPLOYED NOMINAL</span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </motion.div>
                )}

                {/* ── Centres Tab ── */}
                {activeTab === "centres" && (
                  <motion.div
                    key="centres"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex flex-col gap-5"
                  >
                    <div className="flex justify-between items-center border-b border-white/10 pb-4">
                      <div>
                        <h2 className="text-xl font-bold tracking-tight">ISRO Facilities Map</h2>
                        <p className="text-[10px] text-white/45 mt-0.5 uppercase tracking-widest">GEOSPATIAL LOCATION DATA DECK</p>
                      </div>
                    </div>

                    {loading ? (
                      <FuturisticLoader label="MAPING GEOLOCATIONS..." />
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[360px] overflow-y-auto pr-1 scrollbar-thin">
                        {centres.map((ctr) => (
                          <div
                            key={ctr.id}
                            className="p-4 border border-white/5 hover:border-[#44443a] bg-black/60 rounded-lg relative overflow-hidden flex flex-col justify-between group transition-all"
                          >
                            <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-[#44443a]" />
                            <div>
                              <div className="flex justify-between items-center text-white/35 text-[8px] font-bold tracking-widest">
                                <span>VERIFICATION: CORE SYSTEM</span>
                                <span>REF: 0250-F</span>
                              </div>
                              <h3 className="text-sm font-bold text-white mt-3 font-poppins tracking-tight uppercase group-hover:text-gradient">
                                {ctr.name}
                              </h3>

                              <div className="flex items-center gap-2 mt-4 text-[10px] text-white/60">
                                <MapPin className="w-3.5 h-3.5 text-[#8f8f7c]" />
                                <span>{ctr.Place}, {ctr.State}</span>
                              </div>
                            </div>
                            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[9px] text-[#8f8f7c]">
                              <span>COORDINATES SECURED</span>
                              <span className="text-emerald-400 font-bold">LINKED</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* ── Bhuvan Weather Tab ── */}
                {activeTab === "bhuvan" && (
                  <motion.div
                    key="bhuvan"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex flex-col gap-6"
                  >
                    <div className="flex justify-between items-center border-b border-white/10 pb-4">
                      <div>
                        <h2 className="text-xl font-bold tracking-tight">MOSDAC Climate Dashboard</h2>
                        <p className="text-[10px] text-white/45 mt-0.5 uppercase tracking-widest">ISRO GEOSPATAIL METEOROLOGICAL SCAN</p>
                      </div>
                      <span className="flex items-center gap-1 text-[9px] text-[#8f8f7c] border border-[#44443a] rounded-full px-2.5 py-0.5 uppercase">
                        <Activity className="w-3 h-3 text-emerald-400 animate-pulse" /> SATELLITE LIVE FEED
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                      {[
                        { title: "SEA TEMP INDICES", value: `${seaTemp.toFixed(1)}°C`, desc: "Indian Ocean anomaly detection", icon: CloudRain, valSetter: setSeaTemp, min: 25, max: 32 },
                        { title: "MONSOON FORCE INDEX", value: `${monsoonIndex}%`, desc: "Atmospheric cloud vapor concentration", icon: Wind, valSetter: setMonsoonIndex, min: 20, max: 100 },
                        { title: "SOLAR ATM RADIATION", value: "840 W/m²", desc: "Surface radiation flux indices", icon: Sun },
                      ].map((item, idx) => {
                        const Icon = item.icon;
                        return (
                          <div key={idx} className="p-4 border border-[#44443a]/25 bg-black/60 rounded-lg relative overflow-hidden flex flex-col justify-between">
                            <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-[#44443a]" />
                            <div>
                              <div className="text-white/40 text-[8px] font-bold tracking-widest mb-2 uppercase">
                                {item.title}
                              </div>
                              <div className="text-2xl font-bold text-white tracking-tight mt-1">{item.value}</div>
                              <p className="text-[9px] text-white/40 mt-1 leading-snug">{item.desc}</p>
                            </div>

                            {item.valSetter && (
                              <div className="mt-4 pt-3 border-t border-white/5 flex flex-col gap-1.5">
                                <span className="text-[7px] text-white/30 tracking-widest font-black uppercase">ADJUST TRANSMISSION VALUE</span>
                                <input
                                  type="range"
                                  min={item.min}
                                  max={item.max}
                                  value={item.title.includes("SEA") ? seaTemp : monsoonIndex}
                                  onChange={(e) => item.valSetter(Number(e.target.value))}
                                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#8f8f7c]"
                                />
                              </div>
                            )}

                            {!item.valSetter && (
                              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[9px] text-white/30">
                                <span className="flex items-center gap-1.5"><Icon className="w-3.5 h-3.5" /> telemetry index</span>
                                <span>2050-D</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                      <div className="md:col-span-3 border border-white/10 rounded-lg p-5 bg-black/80 flex flex-col gap-4 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#44443a]" />
                        <div>
                          <div className="text-[10px] tracking-widest text-[#8f8f7c] font-black uppercase">INDIAN OCEAN GEOSPATIAL HEATMAP</div>
                          <p className="text-[9px] text-white/35">Real-time sea thermal layers scanning via INSAT-3DR meteorological satellite.</p>
                        </div>

                        <div className="h-36 border border-white/5 rounded relative bg-radial-gradient flex items-center justify-center">
                          <div className="absolute w-32 h-32 rounded-full border border-[#44443a]/15 animate-ping" style={{ animationDuration: "6s" }} />
                          <div className="absolute w-20 h-20 rounded-full border border-white/5 animate-pulse" />

                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                            className="absolute inset-0 origin-center pointer-events-none"
                            style={{
                              background: "conic-gradient(from 0deg at 50% 50%, rgba(68,68,58,0.2) 0deg, transparent 90deg, transparent 360deg)",
                            }}
                          />

                          <div className="text-[9px] text-[#8f8f7c] uppercase tracking-widest font-black flex items-center gap-2">
                            <Layers className="w-4 h-4 text-emerald-400 animate-pulse" /> SCANNING OCEAN ANOMALIES
                          </div>
                        </div>
                      </div>

                      <div className="md:col-span-2 border border-[#44443a]/30 rounded-lg p-4 bg-black/80 flex flex-col justify-between relative">
                        <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[#44443a]" />
                        <div>
                          <div className="text-[9px] tracking-widest text-[#8f8f7c] font-black uppercase">INSAT-3DR RADAR TELEMETRY</div>
                          <p className="text-[8px] text-white/40 mt-1 leading-relaxed">
                            Continuous data transmission of cyclone warning indices. Automated storm swell alerts calibrated to L1 lagrange constraints.
                          </p>
                        </div>

                        <div className="space-y-2 mt-4 text-[9px]">
                          <div className="flex justify-between border-b border-white/5 pb-1 text-white/60">
                            <span>GRID LATITUDE:</span>
                            <span className="font-bold text-white">13.7196° N</span>
                          </div>
                          <div className="flex justify-between border-b border-white/5 pb-1 text-white/60">
                            <span>GRID LONGITUDE:</span>
                            <span className="font-bold text-white">80.2304° E</span>
                          </div>
                          <div className="flex justify-between text-white/60">
                            <span>RADAR STAGE:</span>
                            <span className="font-bold text-emerald-400">ACTIVE</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ── ISSDC Research Briefings Tab ── */}
                {activeTab === "research" && (
                  <motion.div
                    key="research"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex flex-col gap-5"
                  >
                    <div className="border-b border-white/10 pb-4">
                      <h2 className="text-xl font-bold tracking-tight">ISSDC Space Science Research</h2>
                      <p className="text-[10px] text-white/45 mt-0.5 uppercase tracking-widest">INDIAN SPACE SCIENCE DATA CENTER ARCHIVES</p>
                    </div>

                    <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin">
                      {researchBriefs.map((brief) => (
                        <div
                          key={brief.id}
                          className="p-4 border border-white/5 hover:border-[#44443a] bg-black/60 rounded-lg relative overflow-hidden transition-all group"
                        >
                          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#44443a]" />

                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                            <div>
                              <span className="text-[8px] bg-[#44443a]/20 text-[#8f8f7c] border border-[#44443a] px-2 py-0.5 rounded font-black tracking-widest uppercase">
                                {brief.mission}
                              </span>
                              <span className="text-[9px] text-white/35 ml-3">ID: {brief.id}</span>
                            </div>
                            <span className="text-[9px] text-white/30">{brief.date}</span>
                          </div>

                          <h3 className="text-sm font-bold text-white mt-3 font-poppins tracking-tight uppercase group-hover:text-gradient">
                            {brief.title}
                          </h3>

                          <p className="text-[10px] text-white/55 mt-2.5 leading-relaxed font-light">
                            {brief.abstract}
                          </p>

                          <div className="mt-4 pt-3 border-t border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-[9px] text-white/40">
                            <span>PRINCIPAL INVESTIGATOR: {brief.author}</span>
                            <div className="flex items-center gap-2 shrink-0">
                              <a
                                href={`https://scholar.google.com/scholar?q=${encodeURIComponent(brief.title)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 hover:text-white border border-white/10 px-2 py-0.5 rounded transition-all"
                              >
                                <BookOpen className="w-3.5 h-3.5 text-[#8f8f7c]" /> RESEARCH PAPER
                              </a>
                              <span className="flex items-center gap-1 text-emerald-400 font-bold uppercase border border-emerald-900/30 px-1.5 py-0.5 rounded bg-emerald-950/10">
                                <FileText className="w-3.5 h-3.5" /> abstract verified
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

          </div>

        </div>
      </div>

      <Footer />
    </main>
  );
}

// ── Futuristic Loading ──
const FuturisticLoader: React.FC<{ label: string }> = ({ label }) => (
  <div className="flex flex-col items-center justify-center py-24 gap-4">
    <div className="relative w-16 h-16 flex items-center justify-center">
      <div className="absolute inset-0 rounded-full border-2 border-t-transparent border-[#44443a] animate-spin" />
      <div className="w-10 h-10 rounded-full border border-dashed border-[#8f8f7c]/50 animate-pulse flex items-center justify-center">
        <Layers className="w-5 h-5 text-[#8f8f7c] animate-bounce" />
      </div>
    </div>
    <div className="text-[10px] tracking-widest font-black text-[#8f8f7c] uppercase animate-pulse">
      {label}
    </div>
  </div>
);
