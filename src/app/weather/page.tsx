"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Cloud, Sun, Droplets, Wind, MapPin, Search, Navigation,
  Thermometer, CloudRain, Zap, Sunrise, Sunset, Loader2, CloudLightning,
  Snowflake, CloudFog, AlertCircle, Crosshair
} from "lucide-react";

// --- Types ---
interface LocationResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
}

interface WeatherData {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    is_day: number;
    precipitation: number;
    rain: number;
    weather_code: number;
    cloud_cover: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    sunrise: string[];
    sunset: string[];
    uv_index_max: number[];
    precipitation_sum: number[];
  };
  timezone: string;
}

// --- WMO Code Mapping ---
const getWeatherInfo = (code: number, isDay: number = 1) => {
  const codes: Record<number, { label: string; icon: React.FC<any>; color: string }> = {
    0: { label: "Clear Sky", icon: Sun, color: "text-white" },
    1: { label: "Mainly Clear", icon: Sun, color: "text-white/80" },
    2: { label: "Partly Cloudy", icon: Cloud, color: "text-white/60" },
    3: { label: "Overcast", icon: Cloud, color: "text-white/40" },
    45: { label: "Fog", icon: CloudFog, color: "text-white/50" },
    48: { label: "Depositing Rime Fog", icon: CloudFog, color: "text-white/40" },
    51: { label: "Light Drizzle", icon: CloudRain, color: "text-[#8f8f7c]" },
    53: { label: "Moderate Drizzle", icon: CloudRain, color: "text-[#8f8f7c]" },
    55: { label: "Dense Drizzle", icon: CloudRain, color: "text-[#8f8f7c]" },
    56: { label: "Light Freezing Drizzle", icon: Snowflake, color: "text-white/70" },
    57: { label: "Dense Freezing Drizzle", icon: Snowflake, color: "text-white/90" },
    61: { label: "Slight Rain", icon: CloudRain, color: "text-[#8f8f7c]" },
    63: { label: "Moderate Rain", icon: Droplets, color: "text-[#8f8f7c]" },
    65: { label: "Heavy Rain", icon: Droplets, color: "text-[#8f8f7c]" },
    66: { label: "Light Freezing Rain", icon: Snowflake, color: "text-white/70" },
    67: { label: "Heavy Freezing Rain", icon: Snowflake, color: "text-white/90" },
    71: { label: "Slight Snowfall", icon: Snowflake, color: "text-white" },
    73: { label: "Moderate Snowfall", icon: Snowflake, color: "text-white/80" },
    75: { label: "Heavy Snowfall", icon: Snowflake, color: "text-white/60" },
    77: { label: "Snow Grains", icon: Snowflake, color: "text-white" },
    80: { label: "Slight Rain Showers", icon: CloudRain, color: "text-[#8f8f7c]" },
    81: { label: "Moderate Rain Showers", icon: Droplets, color: "text-[#8f8f7c]" },
    82: { label: "Violent Rain Showers", icon: Droplets, color: "text-[#8f8f7c]" },
    85: { label: "Slight Snow Showers", icon: Snowflake, color: "text-white" },
    86: { label: "Heavy Snow Showers", icon: Snowflake, color: "text-white/80" },
    95: { label: "Thunderstorm", icon: CloudLightning, color: "text-white/90" },
    96: { label: "Thunderstorm with slight hail", icon: CloudLightning, color: "text-white" },
    99: { label: "Thunderstorm with heavy hail", icon: CloudLightning, color: "text-white" },
  };

  const info = codes[code] || { label: "Unknown", icon: AlertCircle, color: "text-white/40" };
  // Swap clear icon to moon if it's night (isDay === 0)
  if (isDay === 0 && (code === 0 || code === 1)) {
    return { ...info, label: "Clear Night", color: "text-[#8f8f7c]" };
  }
  return info;
};

// Format date helper
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
};

export default function WeatherDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<LocationResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const [activeLocation, setActiveLocation] = useState<{ name: string, lat: number, lon: number } | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced Search
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchQuery)}&count=5&language=en&format=json`);
        const data = await res.json();
        if (data.results) {
          setSearchResults(data.results);
          setShowDropdown(true);
        } else {
          setSearchResults([]);
        }
      } catch (err) {
        console.error("Geocoding fetch error:", err);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch Weather Data
  const fetchWeather = async (lat: number, lon: number, locationName: string) => {
    setIsLoadingWeather(true);
    setError(null);
    setActiveLocation({ name: locationName, lat, lon });
    setShowDropdown(false);
    setSearchQuery("");

    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum&timezone=auto`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch weather telemetry");
      const data = await res.json();
      setWeatherData(data);
    } catch (err: any) {
      setError(err.message || "An error occurred fetching telemetry.");
    } finally {
      setIsLoadingWeather(false);
    }
  };

  // Get User Location
  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setIsLoadingWeather(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        // Reverse geocode to get a nice name (optional, but good for UX)
        try {
          const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
          const data = await res.json();
          const locName = data.city || data.locality || "Current Location";
          fetchWeather(latitude, longitude, locName);
        } catch {
          fetchWeather(latitude, longitude, "Local Coordinates");
        }
      },
      (err) => {
        setError("Unable to retrieve your location. Please check permissions.");
        setIsLoadingWeather(false);
      }
    );
  };

  return (
    <div className="min-h-screen bg-[#050507] text-white pt-24 pb-20 font-poppins relative selection:bg-[#44443a]/50 selection:text-white">
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-[#44443a]/10 blur-[150px] rounded-full mix-blend-screen opacity-50" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-[#44443a]/10 blur-[150px] rounded-full mix-blend-screen opacity-40" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay" />
      </div>

      <div className="container mx-auto px-6 relative z-10 max-w-6xl">

        {/* Header Section */}
        <div className="mb-10 mt-8 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#44443a] bg-[#44443a]/10 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#8f8f7c] shadow-[0_0_8px_#8f8f7c] animate-pulse" />
            <span className="text-[10px] tracking-widest text-[#8f8f7c] font-black uppercase">METEOROLOGICAL UPLINK ACTIVE</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-white font-poppins">
            Global <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-[#8f8f7c]">Atmospheric Data</span>
          </h1>
          <p className="text-white/50 mt-4 text-sm max-w-xl font-light leading-relaxed">
            Access real-time global weather telemetry. Utilize the elastic search datalink or sync local geolocation coordinates for accurate meteorological tracking.
          </p>
        </div>

        {/* Search & Action Bar */}
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-12" ref={searchRef}>
          <div className="relative w-full max-w-md">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                placeholder="Search telemetry by city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => { if (searchResults.length > 0) setShowDropdown(true) }}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-12 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#44443a] focus:bg-white/10 transition-all backdrop-blur-md shadow-lg"
              />
              {isSearching && (
                <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8f8f7c] animate-spin" />
              )}
            </div>

            {/* Elastic Search Dropdown */}
            <AnimatePresence>
              {showDropdown && searchResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.98 }}
                  className="absolute top-full left-0 w-full mt-2 bg-[#0a0a0e] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 max-h-72 overflow-y-auto"
                >
                  <div className="p-2 text-[10px] text-white/30 tracking-widest uppercase font-bold border-b border-white/5">
                    Elastic Search Results
                  </div>
                  {searchResults.map((res) => (
                    <button
                      key={res.id}
                      onClick={() => fetchWeather(res.latitude, res.longitude, `${res.name}${res.admin1 ? `, ${res.admin1}` : ''}, ${res.country}`)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 group"
                    >
                      <div>
                        <div className="text-sm font-semibold text-white group-hover:text-white transition-colors">{res.name}</div>
                        <div className="text-xs text-white/50">{res.admin1 ? `${res.admin1}, ` : ''}{res.country}</div>
                      </div>
                      <MapPin className="w-4 h-4 text-white/20 group-hover:text-[#8f8f7c] transition-colors" />
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-4 text-white/30 font-mono text-[10px] tracking-widest uppercase">— OR —</div>

          <button
            onClick={handleGeolocation}
            className="flex items-center gap-2 px-6 py-4 rounded-xl bg-[#44443a]/10 border border-white/5 text-white font-bold text-xs tracking-widest uppercase hover:bg-[#44443a]/30 hover:border-[#44443a] transition-all group shadow-[0_0_20px_rgba(68,68,58,0.1)] hover:shadow-[0_0_30px_rgba(68,68,58,0.3)] shrink-0"
          >
            <Crosshair className="w-4 h-4 group-hover:scale-110 transition-transform" />
            Sync Local Telemetry
          </button>
        </div>

        {/* Error State */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-[#44443a]/10 border border-[#44443a] text-white px-6 py-4 rounded-xl mb-8 flex items-center gap-3 backdrop-blur-md max-w-2xl mx-auto"
            >
              <AlertCircle className="w-5 h-5 shrink-0 text-[#8f8f7c]" />
              <p className="text-sm font-light">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading State */}
        {isLoadingWeather && !error && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative w-24 h-24 flex items-center justify-center mb-6">
              <div className="absolute inset-0 rounded-full border-t-2 border-[#44443a] animate-spin" style={{ animationDuration: '1.5s' }} />
              <div className="absolute inset-2 rounded-full border-b-2 border-[#8f8f7c] animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }} />
              <Cloud className="w-8 h-8 text-white/50 animate-pulse" />
            </div>
            <p className="text-xs text-white/40 tracking-widest uppercase font-mono animate-pulse">Establishing Uplink to Atmospheric Sensors...</p>
          </div>
        )}

        {/* Weather Dashboard Core */}
        {weatherData && !isLoadingWeather && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-8"
          >
            {/* Top Row: Main Status & Quick Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Main Current Weather Card */}
              <div className="lg:col-span-2 bg-black/40 border border-white/10 rounded-2xl p-8 backdrop-blur-md relative overflow-hidden flex flex-col justify-between group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#44443a]/40 to-transparent blur-3xl rounded-full pointer-events-none group-hover:opacity-100 opacity-50 transition-opacity duration-1000" />

                <div className="flex justify-between items-start z-10">
                  <div>
                    <div className="text-[10px] text-[#8f8f7c] tracking-widest font-black uppercase mb-2 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#8f8f7c] animate-ping" />
                      LIVE TELEMETRY
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">{activeLocation?.name}</h2>
                    <p className="text-xs text-white/40 mt-1 font-mono">{activeLocation?.lat.toFixed(4)}°N, {activeLocation?.lon.toFixed(4)}°E</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-white/40 mb-1">{formatDate(weatherData.daily.time[0])}</p>
                    <p className="text-[10px] text-white/30 tracking-widest uppercase">{weatherData.timezone}</p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-center md:items-end justify-between mt-12 z-10 gap-8">
                  <div className="flex items-center gap-6">
                    {(() => {
                      const { icon: WeatherIcon, color, label } = getWeatherInfo(weatherData.current.weather_code, weatherData.current.is_day);
                      return (
                        <>
                          <div className={`p-4 rounded-2xl bg-white/5 border border-white/10 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)]`}>
                            <WeatherIcon className={`w-16 h-16 ${color} drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]`} strokeWidth={1.5} />
                          </div>
                          <div>
                            <div className="flex items-start">
                              <span className="text-7xl md:text-8xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                                {Math.round(weatherData.current.temperature_2m)}
                              </span>
                              <span className="text-3xl md:text-4xl font-light text-white/50 mt-2">°C</span>
                            </div>
                            <p className="text-lg text-white/80 font-medium tracking-wide">{label}</p>
                          </div>
                        </>
                      );
                    })()}
                  </div>

                  <div className="flex gap-4">
                    <div className="bg-white/5 border border-white/10 rounded-xl px-5 py-3 flex flex-col items-center">
                      <span className="text-[9px] text-white/40 tracking-widest uppercase mb-1">Feels Like</span>
                      <span className="text-xl font-bold text-white">{Math.round(weatherData.current.apparent_temperature)}°</span>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl px-5 py-3 flex flex-col items-center">
                      <span className="text-[9px] text-white/40 tracking-widest uppercase mb-1">Precipitation</span>
                      <span className="text-xl font-bold text-white">{weatherData.current.precipitation}mm</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Side Metrics Grid */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Wind Speed", value: `${weatherData.current.wind_speed_10m} km/h`, icon: Wind, color: "text-[#8f8f7c]" },
                  { label: "Humidity", value: `${weatherData.current.relative_humidity_2m}%`, icon: Droplets, color: "text-[#8f8f7c]" },
                  { label: "Cloud Cover", value: `${weatherData.current.cloud_cover}%`, icon: Cloud, color: "text-[#8f8f7c]" },
                  { label: "UV Index Max", value: `${weatherData.daily.uv_index_max[0]}`, icon: Sun, color: "text-[#8f8f7c]" },
                ].map((stat, i) => (
                  <div key={i} className="bg-black/30 border border-white/5 rounded-2xl p-5 flex flex-col justify-center relative overflow-hidden group hover:border-white/20 transition-colors">
                    <stat.icon className={`w-6 h-6 mb-3 ${stat.color} opacity-80 group-hover:scale-110 transition-transform`} />
                    <span className="text-2xl font-bold text-white tracking-tight">{stat.value}</span>
                    <span className="text-[10px] text-white/40 tracking-widest uppercase mt-1">{stat.label}</span>
                  </div>
                ))}

                {/* Sun Position */}
                <div className="col-span-2 bg-black/30 border border-white/5 rounded-2xl p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#44443a]/20 flex items-center justify-center border border-[#44443a]/50">
                      <Sunrise className="w-5 h-5 text-[#8f8f7c]" />
                    </div>
                    <div>
                      <div className="text-[10px] text-white/40 tracking-widest uppercase">Sunrise</div>
                      <div className="text-lg font-bold text-white">{new Date(weatherData.daily.sunrise[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                  </div>
                  <div className="w-px h-10 bg-white/10" />
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-[10px] text-white/40 tracking-widest uppercase">Sunset</div>
                      <div className="text-lg font-bold text-white">{new Date(weatherData.daily.sunset[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-[#44443a]/20 flex items-center justify-center border border-[#44443a]/50">
                      <Sunset className="w-5 h-5 text-[#8f8f7c]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 7-Day Forecast Row */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-px bg-[#44443a]" />
                <h3 className="text-xs text-white/60 font-black tracking-widest uppercase">7-Day Trajectory Forecast</h3>
                <div className="flex-1 h-px bg-white/5" />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {weatherData.daily.time.map((timeStr, idx) => {
                  const { icon: DayIcon, color } = getWeatherInfo(weatherData.daily.weather_code[idx]);
                  const isToday = idx === 0;

                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      key={timeStr}
                      className={`flex flex-col items-center p-5 rounded-2xl border transition-all ${isToday
                          ? "bg-[#44443a]/20 border-[#44443a] shadow-[inset_0_0_12px_rgba(68,68,58,0.25)]"
                          : "bg-black/30 border-white/5 hover:bg-white/5 hover:border-white/10"
                        }`}
                    >
                      <span className={`text-[10px] tracking-widest uppercase font-bold ${isToday ? 'text-white' : 'text-white/50'}`}>
                        {isToday ? 'TODAY' : new Date(timeStr).toLocaleDateString("en-US", { weekday: "short" })}
                      </span>
                      <span className="text-xs text-white/30 mt-1">{new Date(timeStr).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>

                      <DayIcon className={`w-8 h-8 my-4 ${color}`} strokeWidth={1.5} />

                      <div className="flex items-center gap-3 w-full justify-center">
                        <span className="text-lg font-bold text-white">{Math.round(weatherData.daily.temperature_2m_max[idx])}°</span>
                        <span className="text-sm font-medium text-white/40">{Math.round(weatherData.daily.temperature_2m_min[idx])}°</span>
                      </div>

                      {weatherData.daily.precipitation_sum[idx] > 0 && (
                        <div className="flex items-center gap-1 mt-3 text-[10px] text-[#8f8f7c] bg-[#44443a]/15 px-2 py-0.5 rounded-full border border-[#44443a]">
                          <Droplets className="w-3 h-3" />
                          <span>{weatherData.daily.precipitation_sum[idx]}mm</span>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>

          </motion.div>
        )}

      </div>
    </div>
  );
}
