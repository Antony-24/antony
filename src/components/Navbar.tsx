"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import logo from '../assets/logo.png';

interface NavbarProps {
  onOpenAssessment?: () => void;
}

const Navbar = ({ onOpenAssessment }: NavbarProps = {}) => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "About", href: "/#about" },
    { name: "Projects", href: "/#projects" },
    { name: "NASA Data", href: "/nasa-data" },
    { name: "ISRO Data", href: "/isro-data" },
    { name: "Weather", href: "/weather" },
    { name: "Contact", href: "/#contact" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
          ? "py-4 bg-black/80 backdrop-blur-lg border-b border-white/5"
          : "py-8 bg-transparent"
          }`}
      >
      <div className="container mx-auto px-6 md:px-0 flex justify-between items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold tracking-tight font-poppins"
        >
          <Link href="/">
            <Image
              src={logo}
              alt="Logo"
              className="w-16 md:w-24 cursor-pointer hover:opacity-85 transition-opacity"
            />
          </Link>
        </motion.div>

        <div className="hidden md:flex space-x-8">
          {navLinks.map((link, i) => {
            const isActive = pathname === link.href;
            return (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={link.href}
                  className={`text-xs font-semibold uppercase tracking-widest transition-all duration-200 hover:text-white ${
                    isActive ? "text-white border-b border-[#44443a] pb-1" : "text-white/60"
                  }`}
                >
                  {link.name}
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="flex items-center space-x-2 md:space-x-4">
          {onOpenAssessment && (
            <motion.button
              onClick={onOpenAssessment}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center space-x-1.5 px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-white/20 bg-white/5 text-white hover:bg-white hover:text-black hover:border-white transition-all duration-300 cursor-pointer text-[10px] md:text-xs font-bold tracking-widest uppercase relative"
            >
              <span className="w-2 h-2 rounded-full bg-red-600 animate-ping absolute left-2 md:left-3 top-1/2 -translate-y-1/2"></span>
              <span className="w-2 h-2 rounded-full bg-red-600 ml-0.5 md:ml-1"></span>
              <span>AF Audit</span>
            </motion.button>
          )}

          <motion.a
            href="#contact"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="px-4 py-1.5 md:px-6 md:py-2 rounded-full bg-[#44443a] text-white font-semibold text-xs md:text-sm hover:bg-white hover:text-black transition-all shrink-0"
          >
            Hire Me
          </motion.a>

          <button 
            className="md:hidden text-white/80 hover:text-white transition-colors" 
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open mobile menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-[#050507] text-white flex flex-col p-6 shadow-2xl border-l border-white/5"
          >
            <div className="flex justify-between items-center mb-10">
              <div className="text-[10px] tracking-widest text-[#8f8f7c] font-black uppercase">
                NAVIGATION MATRIX
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="text-white/60 hover:text-white transition-colors p-2"
                aria-label="Close mobile menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex flex-col space-y-6">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`text-xl font-bold uppercase tracking-widest transition-all duration-200 border-b border-white/5 pb-4 ${
                      isActive ? "text-white" : "text-white/40"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
              
              <div className="pt-6">
                {onOpenAssessment && (
                  <button
                    onClick={() => {
                      onOpenAssessment();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 px-6 py-3 rounded border border-[#44443a] bg-[#44443a]/10 text-[#8f8f7c] font-bold tracking-widest uppercase relative w-full justify-center transition-all hover:bg-[#44443a]/20"
                  >
                    <span className="w-2 h-2 rounded-full bg-red-600 animate-ping absolute left-6 top-1/2 -translate-y-1/2"></span>
                    <span className="w-2 h-2 rounded-full bg-red-600 ml-1"></span>
                    <span>AF Audit</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
