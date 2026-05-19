"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Github, Linkedin, Instagram, Facebook } from "lucide-react";

const Contact = () => {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    number: "",
    service: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd send this to your API route
    console.log("Form submitted:", formState);
    alert("Message sent successfully! (This is a demo submission)");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({
      ...formState,
      [e.target.id]: e.target.value
    });
  };

  return (
    <section id="contact" className="section-padding font-poppins">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-white/60 font-medium mb-4 tracking-widest uppercase text-sm border-b border-[#44443a]/50 pb-2 inline-block">Contact</h2>
            <h3 className="text-4xl md:text-5xl font-bold mb-8">Let's build something <span className="text-[#44443a]">extraordinary</span> together.</h3>
            
            <div className="space-y-6 mb-12">
              <div className="flex items-center space-x-4 group">
                <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center group-hover:bg-[#44443a] group-hover:text-white transition-all">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-foreground/40 text-xs uppercase tracking-widest font-bold">Email</p>
                  <p className="text-lg">555jinson@gmail.com</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 group">
                <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center group-hover:bg-[#44443a] group-hover:text-white transition-all">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-foreground/40 text-xs uppercase tracking-widest font-bold">Phone</p>
                  <p className="text-lg">8943367709</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 group">
                <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center group-hover:bg-[#44443a] group-hover:text-white transition-all">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-foreground/40 text-xs uppercase tracking-widest font-bold">Location</p>
                  <p className="text-lg">Alappuzha, Kerala, India</p>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <a href="https://github.com/Antony-24" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg glass flex items-center justify-center hover:bg-[#44443a] hover:text-white transition-all"><Github size={20} /></a>
              <a href="https://www.linkedin.com/in/antony-francis-8318a2225/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg glass flex items-center justify-center hover:bg-[#44443a] hover:text-white transition-all"><Linkedin size={20} /></a>
              <a href="https://www.instagram.com/antony__jinson/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg glass flex items-center justify-center hover:bg-[#44443a] hover:text-white transition-all"><Instagram size={20} /></a>
              <a href="https://www.facebook.com/antony.jinson.2025/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg glass flex items-center justify-center hover:bg-[#44443a] hover:text-white transition-all"><Facebook size={20} /></a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass p-8 md:p-12 rounded-[2rem]"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-xs uppercase tracking-widest font-bold text-foreground/40 ml-1">Your Name</label>
                  <input type="text" id="name" required onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-accent transition-colors" placeholder="Antony Francis" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-xs uppercase tracking-widest font-bold text-foreground/40 ml-1">Email Address</label>
                  <input type="email" id="email" required onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-accent transition-colors" placeholder="antony@example.com" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="number" className="text-xs uppercase tracking-widest font-bold text-foreground/40 ml-1">Phone Number</label>
                  <input type="tel" id="number" onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-accent transition-colors" placeholder="+91 8943367709" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="service" className="text-xs uppercase tracking-widest font-bold text-foreground/40 ml-1">Service Required</label>
                  <input type="text" id="service" onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-accent transition-colors" placeholder="Web Development" />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-xs uppercase tracking-widest font-bold text-foreground/40 ml-1">Requirements</label>
                <textarea id="message" rows={4} required onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-accent transition-colors" placeholder="Tell me about your project..."></textarea>
              </div>

              <button type="submit" className="w-full py-4 rounded-xl bg-[#44443a] text-white font-bold flex items-center justify-center space-x-2 hover:bg-white hover:text-black hover:scale-[1.02] active:scale-[0.98] transition-all">
                <span>Send Message</span>
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
