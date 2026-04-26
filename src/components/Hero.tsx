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
          <h2 className="text-accent font-medium mb-4 tracking-widest uppercase text-sm">
            Web Developer
          </h2>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Crafting <span className="text-gradient">Digital</span> <br />
            Experiences
          </h1>
          <p className="text-foreground/60 text-lg mb-8 max-w-lg leading-relaxed">
            I am Antony Francis, an experienced web developer dedicated to building seamless user experiences and efficient, scalable web applications.
          </p>
          <div className="flex space-x-4">
            <button className="px-4 py-2 md:px-8 md:py-4 rounded-xl bg-accent text-background font-bold hover:scale-105 transition-transform">
              View My Work
            </button>
            <button className="px-4 py-2 md:px-8 md:py-4 rounded-xl border border-white/10 hover:bg-white/5 transition-colors">
              Contact Me
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative order-first md:order-none"
        >
          <div className="relative z-10 rounded-3xl overflow-hidden border-2 border-white/10 aspect-square max-w-md mx-auto shadow-2xl shadow-accent/10">
            <Image
              src={avatar}
              alt="Antony Francis"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Decorative elements */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent/20 blur-[100px] rounded-full"></div>
          <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-blue-500/10 blur-[120px] rounded-full"></div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
