"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import logo from '../assets/logo.png';

const Navbar = () => {
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
    // { name: "Skills", href: "#skills" },
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
              className="text-sm font-medium text-white"
            >
              {link.name}
            </motion.a>
          ))}
        </div>

        <motion.a
          href="#contact"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="px-6 py-2 rounded-full bg-[#44443a] text-white font-semibold text-sm hover:bg-white hover:text-black transition-all"
        >
          Hire Me
        </motion.a>
      </div>
    </nav>
  );
};

export default Navbar;
