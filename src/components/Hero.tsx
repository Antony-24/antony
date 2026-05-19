"use client";

import React from "react";
import { motion } from "framer-motion";
import avatar from "@/assets/antony01.png";
import Image from "next/image";

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center pt-20 section-padding overflow-hidden">
      <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center mt-20">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="order-last md:order-none"
        >
          <div className="inline-block px-3 py-1 rounded-full border border-[#44443a]/40 bg-[#44443a]/10 text-white/80 font-semibold tracking-widest uppercase text-xs mb-4">
            Web Developer
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Crafting <span className="text-[#44443a]">Digital</span> <br />
            Experiences
          </h1>
          <p className="text-foreground/60 text-lg mb-8 max-w-lg leading-relaxed">
            I am Antony Francis, an experienced web developer dedicated to building seamless user experiences and efficient, scalable web applications.
          </p>
          <div className="flex space-x-4">
            <a href="#projects" className="px-4 py-2 md:px-8 md:py-4 rounded-xl bg-[#44443a] text-white font-bold hover:bg-white hover:text-black hover:scale-105 transition-all duration-300 flex items-center justify-center">
              View My Work
            </a>
            <a href="#contact" className="px-4 py-2 md:px-8 md:py-4 rounded-xl border border-white/10 hover:bg-[#44443a]/20 hover:text-white transition-colors flex items-center justify-center">
              Contact Me
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative order-first md:order-none"
        >
          <div className="relative z-10 rounded-3xl overflow-hidden border-2 border-[#44443a]/40 aspect-square max-w-md mx-auto shadow-2xl shadow-[#44443a]/20">
            <Image
              src={avatar}
              alt="Antony Francis"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Decorative elements */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#44443a]/30 blur-[100px] rounded-full"></div>
          <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-white/10 blur-[120px] rounded-full"></div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
