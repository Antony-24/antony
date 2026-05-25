"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  ShoppingCart, 
  AppWindow, 
  Smartphone, 
  Layout, 
  Zap,
  ShieldCheck
} from "lucide-react";

const services = [
  {
    title: "E-Commerce Solutions",
    description: "Robust digital storefronts engineered for high conversion, secure payments, and seamless shopping experiences.",
    icon: <ShoppingCart className="w-6 h-6 text-[#8f8f7c]" />,
    size: "lg:col-span-2",
  },
  {
    title: "Bespoke Web Platforms",
    description: "Lightning-fast custom websites, tailored business platforms, and immersive personal portfolios.",
    icon: <Layout className="w-6 h-6 text-[#8f8f7c]" />,
    size: "lg:col-span-1",
  },
  {
    title: "Full-Stack Web Apps",
    description: "Complex, data-driven web applications with scalable backend architectures and modern frontend interfaces.",
    icon: <AppWindow className="w-6 h-6 text-[#8f8f7c]" />,
    size: "lg:col-span-1",
  },
  {
    title: "Mobile App Development",
    description: "Sleek, high-performance native and cross-platform mobile experiences for iOS and Android.",
    icon: <Smartphone className="w-6 h-6 text-[#8f8f7c]" />,
    size: "lg:col-span-1",
  },
  {
    title: "High-Conversion Landing Pages",
    description: "Strategically crafted single-page campaigns optimized for maximum engagement and lead generation.",
    icon: <Zap className="w-6 h-6 text-[#8f8f7c]" />,
    size: "lg:col-span-1",
  },
  {
    title: "Audit, Revamp & Maintenance",
    description: "Comprehensive UX/performance audits, modern codebase revamps, and continuous reliable maintenance.",
    icon: <ShieldCheck className="w-6 h-6 text-[#8f8f7c]" />,
    size: "lg:col-span-3",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 12 }
  }
};

export default function Services() {
  return (
    <section id="services" className="py-24 relative z-10 font-poppins">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Digital <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#8f8f7c] to-[#44443a]">Capabilities</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-white/50 max-w-2xl text-lg font-mono"
          >
            From stunning portfolios to complex scalable applications, I architect and engineer premium digital solutions tailored to your unique objectives.
          </motion.p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className={`group relative p-8 rounded-2xl bg-black border border-[#44443a]/40 overflow-hidden ${service.size}`}
            >
              {/* Background Glow on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#44443a]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-full bg-[#44443a]/20 flex items-center justify-center border border-[#44443a]/30 mb-6 group-hover:scale-110 transition-transform duration-500">
                  {service.icon}
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
                  {service.title}
                </h3>
                <p className="text-white/50 font-mono text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>

              {/* Decorative corner accent */}
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="w-2 h-2 rounded-full bg-[#44443a] shadow-[0_0_8px_#44443a] animate-pulse" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
