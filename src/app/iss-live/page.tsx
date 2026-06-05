"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function ISSLivePage() {
  return (
    <main className="w-screen h-screen bg-black overflow-hidden relative">
      {/* Back button overlay */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute top-6 left-6 z-50"
      >
        <Link 
          href="/nasa-data"
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/60 hover:bg-white hover:text-black border border-white/20 hover:border-white text-white text-xs font-bold tracking-widest uppercase transition-all backdrop-blur-md cursor-pointer shadow-lg"
        >
          <ArrowLeft size={16} />
          Back to NASA Data
        </Link>
      </motion.div>

      {/* Full screen iframe */}
      <iframe
        src="https://www.youtube.com/embed/FuuC4dpSQ1M?autoplay=1&controls=1&mute=0"
        title="ISS Live Earth Stream"
        className="w-full h-full border-none"
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    </main>
  );
}
