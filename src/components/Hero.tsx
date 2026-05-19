"use client";

import React from "react";
import { motion } from "framer-motion";
import avatar from "@/assets/antony.jpeg";
import Image from "next/image";

const Hero = () => {
  // Stagger container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  // Spring slide-up item
  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 85, damping: 14 },
    },
  };

  // Soft floating effect
  const floatVariants = {
    animate: {
      y: [0, -12, 0],
      rotate: [0, 1, 0],
      transition: {
        duration: 6,
        ease: "easeInOut",
        repeat: Infinity,
      },
    },
  };

  return (
    <section className="min-h-screen flex items-center pt-20 section-padding overflow-hidden relative">
      <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center mt-20 relative z-10">

        {/* Intro / Text */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="order-last md:order-none"
        >
          <motion.div
            variants={itemVariants}
            className="inline-block px-4 py-1.5 rounded-full border border-[#44443a]/40 bg-[#44443a]/10 text-white/80 font-bold tracking-widest uppercase text-xs mb-6"
          >
            Web Developer
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
          >
            Crafting <span className="text-[#44443a]">Digital</span> <br />
            Experiences
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-foreground/60 text-lg mb-8 max-w-lg leading-relaxed font-light"
          >
            I am Antony Francis, an experienced web developer dedicated to building seamless user experiences and efficient, scalable web applications.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex space-x-4"
          >
            <a
              href="#projects"
              className="px-4 py-2 md:px-8 md:py-4 rounded-xl bg-[#44443a] text-white font-bold hover:bg-white hover:text-black hover:scale-105 transition-all duration-300 flex items-center justify-center shadow-lg shadow-[#44443a]/10"
            >
              View My Work
            </a>
            <a
              href="#contact"
              className="px-4 py-2 md:px-8 md:py-4 rounded-xl border border-white/10 hover:bg-[#44443a]/20 hover:text-white transition-colors flex items-center justify-center backdrop-blur-sm"
            >
              Contact Me
            </a>
          </motion.div>
        </motion.div>

        {/* Profile Card / Avatar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative order-first md:order-none"
        >
          <motion.div
            variants={floatVariants}
            animate="animate"
            className="relative z-10 rounded-lg overflow-hidden border-2 border-[#44443a]/40 mx-auto shadow-2xl shadow-[#44443a]/20"
          >
            <Image
              src={avatar}
              alt="Antony Francis"
              className="w-full h-full object-cover"
              priority
            />
          </motion.div>

          {/* Decorative premium glows */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#44443a]/20 blur-[100px] rounded-full pointer-events-none"></div>
          <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-white/5 blur-[120px] rounded-full pointer-events-none"></div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
