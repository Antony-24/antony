"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import logo from '../assets/logo.png';

interface NavbarProps {
  onOpenAssessment?: () => void;
}

const Navbar = ({ onOpenAssessment }: NavbarProps = {}) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "About", href: "#about" },
    { name: "Projects", href: "#projects" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
        ? "py-4 bg-black/60 backdrop-blur-lg"
        : "py-8 bg-transparent"
        }`}
    >
      <div className="container mx-auto px-6 md:px-0 flex justify-between items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold tracking-tight font-poppins"
        >
          <Image
            src={logo}
            alt="Logo"
            width={80}
            height={80}
          />
        </motion.div>

        <div className="hidden md:flex space-x-8">
          {navLinks.map((link, i) => (
            <motion.a
              key={link.name}
              href={link.href}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="text-sm font-medium text-white hover:text-[#8f8f7c] transition-colors"
            >
              {link.name}
            </motion.a>
          ))}
        </div>

        <div className="flex items-center space-x-4">
          {onOpenAssessment && (
            <motion.button
              onClick={onOpenAssessment}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center space-x-2 px-4 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-white hover:bg-emerald-500 hover:text-black hover:border-emerald-500 transition-all duration-300 cursor-pointer text-xs font-bold tracking-widest uppercase relative"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping absolute left-3 top-1/2 -translate-y-1/2"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-1"></span>
              <span>AI Audit</span>
            </motion.button>
          )}

          <motion.a
            href="#contact"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="px-6 py-2 rounded-full bg-[#44443a] text-white font-semibold text-sm hover:bg-white hover:text-black transition-all"
          >
            Hire Me
          </motion.a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
