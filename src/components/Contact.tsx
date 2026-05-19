"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Github, Linkedin, Instagram, Facebook } from "lucide-react";

interface ContactProps {
  selectedService?: string;
  setSelectedService?: (service: string) => void;
}

const Contact = ({ selectedService, setSelectedService }: ContactProps = {}) => {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    number: "",
    service: "",
    message: ""
  });

  React.useEffect(() => {
    if (selectedService) {
      setFormState((prev) => ({
        ...prev,
        service: selectedService
      }));
      // Reset the shared state so it does not interfere with future edits
      if (setSelectedService) {
        setSelectedService("");
      }
    }
  }, [selectedService, setSelectedService]);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [statusMsg, setStatusMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setStatusMsg("");

    try {
      const formData = new FormData();
      formData.append("access_key", "3b9590e7-73a5-4881-99e7-a956c496bf2d");
      formData.append("name", formState.name);
      formData.append("email", formState.email);
      formData.append("number", formState.number);
      formData.append("service", formState.service);
      formData.append("message", formState.message);

      // Web3Forms configurations for beautiful emails
      formData.append("from_name", "Antony Portfolio");
      formData.append("subject", `New Portfolio Inquiry from ${formState.name}`);
      formData.append("replyto", formState.email);

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      let data;
      try {
        data = await response.json();
      } catch (err) {
        throw new Error("Invalid response from server.");
      }

      if (response.ok && data.success) {
        setStatus("success");
        setStatusMsg("Your message has been sent successfully! I will get back to you soon.");
        setFormState({
          name: "",
          email: "",
          number: "",
          service: "",
          message: ""
        });
      } else {
        setStatus("error");
        setStatusMsg(data.message || "Oops! Something went wrong.");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setStatus("error");
      setStatusMsg("Failed to send your inquiry. Please check your internet connection and try again.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({
      ...formState,
      [e.target.id]: e.target.value
    });
  };

  // Animation variants
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05
      }
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 85, damping: 14 }
    }
  };

  const socialIconVariants = {
    hidden: { opacity: 0, scale: 0.6 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 120, damping: 10 }
    }
  };

  return (
    <section id="contact" className="section-padding font-poppins relative overflow-hidden">
      <div className="container mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          
          {/* Details Column */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-white/60 font-medium mb-4 tracking-widest uppercase text-sm border-b border-[#44443a]/50 pb-2 inline-block"
            >
              Contact
            </motion.h2>
            
            <motion.h3 
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-bold mb-8"
            >
              Let's build something <span className="text-[#44443a]">extraordinary</span> together.
            </motion.h3>
            
            {/* Cards */}
            <div className="space-y-6 mb-12">
              <motion.div 
                variants={fadeInUp}
                whileHover={{ x: 5 }}
                className="flex items-center space-x-4 group cursor-default"
              >
                <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center group-hover:bg-[#44443a] group-hover:text-white transition-all duration-300">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-foreground/40 text-xs uppercase tracking-widest font-bold">Email</p>
                  <p className="text-lg">555jinson@gmail.com</p>
                </div>
              </motion.div>

              <motion.div 
                variants={fadeInUp}
                whileHover={{ x: 5 }}
                className="flex items-center space-x-4 group cursor-default"
              >
                <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center group-hover:bg-[#44443a] group-hover:text-white transition-all duration-300">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-foreground/40 text-xs uppercase tracking-widest font-bold">Phone</p>
                  <p className="text-lg">8943367709</p>
                </div>
              </motion.div>

              <motion.div 
                variants={fadeInUp}
                whileHover={{ x: 5 }}
                className="flex items-center space-x-4 group cursor-default"
              >
                <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center group-hover:bg-[#44443a] group-hover:text-white transition-all duration-300">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-foreground/40 text-xs uppercase tracking-widest font-bold">Location</p>
                  <p className="text-lg">Alappuzha, Kerala, India</p>
                </div>
              </motion.div>
            </div>

            {/* Social Connects */}
            <motion.div variants={fadeInUp} className="flex space-x-4">
              <motion.a 
                variants={socialIconVariants} 
                whileHover={{ scale: 1.15, rotate: 5 }} 
                whileTap={{ scale: 0.95 }}
                href="https://github.com/Antony-24" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-12 h-12 rounded-xl glass flex items-center justify-center hover:bg-[#44443a] hover:text-white transition-all duration-300 border border-white/5 shadow-md"
              >
                <Github size={20} />
              </motion.a>
              <motion.a 
                variants={socialIconVariants} 
                whileHover={{ scale: 1.15, rotate: -5 }} 
                whileTap={{ scale: 0.95 }}
                href="https://www.linkedin.com/in/antony-francis-8318a2225/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-12 h-12 rounded-xl glass flex items-center justify-center hover:bg-[#44443a] hover:text-white transition-all duration-300 border border-white/5 shadow-md"
              >
                <Linkedin size={20} />
              </motion.a>
              <motion.a 
                variants={socialIconVariants} 
                whileHover={{ scale: 1.15, rotate: 5 }} 
                whileTap={{ scale: 0.95 }}
                href="https://www.instagram.com/antony__jinson/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-12 h-12 rounded-xl glass flex items-center justify-center hover:bg-[#44443a] hover:text-white transition-all duration-300 border border-white/5 shadow-md"
              >
                <Instagram size={20} />
              </motion.a>
              <motion.a 
                variants={socialIconVariants} 
                whileHover={{ scale: 1.15, rotate: -5 }} 
                whileTap={{ scale: 0.95 }}
                href="https://www.facebook.com/antony.jinson.2025/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-12 h-12 rounded-xl glass flex items-center justify-center hover:bg-[#44443a] hover:text-white transition-all duration-300 border border-white/5 shadow-md"
              >
                <Facebook size={20} />
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Form Card Column */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: 50 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ type: "spring", stiffness: 60, damping: 15 }}
            whileHover={{ y: -5 }}
            className="glass p-8 md:p-12 rounded-[2rem] border border-white/5 hover:border-[#44443a]/30 transition-all duration-500 shadow-2xl shadow-black/20"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-xs uppercase tracking-widest font-bold text-foreground/40 ml-1">Your Name</label>
                  <input type="text" id="name" required value={formState.name} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-accent transition-colors text-white" placeholder="Antony Francis" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-xs uppercase tracking-widest font-bold text-foreground/40 ml-1">Email Address</label>
                  <input type="email" id="email" required value={formState.email} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-accent transition-colors text-white" placeholder="antony@example.com" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="number" className="text-xs uppercase tracking-widest font-bold text-foreground/40 ml-1">Phone Number</label>
                  <input type="tel" id="number" value={formState.number} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-accent transition-colors text-white" placeholder="+91 8943367709" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="service" className="text-xs uppercase tracking-widest font-bold text-foreground/40 ml-1">Service Required</label>
                  <input type="text" id="service" value={formState.service} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-accent transition-colors text-white" placeholder="Web Development" />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-xs uppercase tracking-widest font-bold text-foreground/40 ml-1">Requirements</label>
                <textarea id="message" rows={4} required value={formState.message} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-accent transition-colors text-white" placeholder="Tell me about your project..."></textarea>
              </div>

              {status !== "idle" && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`p-4 rounded-xl text-sm ${
                    status === "loading" ? "bg-white/5 text-white/80 border border-white/10 animate-pulse" :
                    status === "success" ? "bg-[#44443a]/20 text-[#a1a18c] border border-[#44443a]/30" :
                    "bg-red-500/10 text-red-400 border border-red-500/20"
                  }`}
                >
                  {status === "loading" && (
                    <div className="flex items-center space-x-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      <span>Sending message...</span>
                    </div>
                  )}
                  {status === "success" && <span>{statusMsg}</span>}
                  {status === "error" && <span>{statusMsg}</span>}
                </motion.div>
              )}

              <motion.button 
                type="submit" 
                disabled={status === "loading"} 
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 rounded-xl bg-[#44443a] text-white font-bold flex items-center justify-center space-x-2 hover:bg-white hover:text-black hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 disabled:hover:bg-[#44443a] disabled:hover:text-white cursor-pointer disabled:cursor-not-allowed shadow-lg shadow-[#44443a]/10"
              >
                <span>{status === "loading" ? "Sending..." : "Send Message"}</span>
                <Send size={18} />
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
      
      {/* Decorative Glow */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#44443a]/5 blur-[150px] rounded-full pointer-events-none"></div>
    </section>
  );
};

export default Contact;
