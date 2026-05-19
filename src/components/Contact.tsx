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
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [statusMsg, setStatusMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setStatusMsg("");

    try {
      // Smart local testing fallback (when running on localhost)
      if (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")) {
        await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate server response latency
        setStatus("success");
        setStatusMsg("Mock Success: Your message has been sent successfully! (Local testing simulation)");
        setFormState({
          name: "",
          email: "",
          number: "",
          service: "",
          message: ""
        });
        return;
      }

      const formData = new FormData();
      formData.append("name", formState.name);
      formData.append("email", formState.email);
      formData.append("number", formState.number);
      formData.append("service", formState.service);
      formData.append("message", formState.message);

      const response = await fetch("/contact.php", {
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
        setStatusMsg(data.message || "Message sent successfully!");
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
      setStatusMsg("Failed to connect to the mail server. Please try again later.");
    }
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
                <div className={`p-4 rounded-xl text-sm ${
                  status === "loading" ? "bg-white/5 text-white/80 border border-white/10 animate-pulse" :
                  status === "success" ? "bg-[#44443a]/20 text-[#a1a18c] border border-[#44443a]/30" :
                  "bg-red-500/10 text-red-400 border border-red-500/20"
                }`}>
                  {status === "loading" && (
                    <div className="flex items-center space-x-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      <span>Sending message...</span>
                    </div>
                  )}
                  {status === "success" && <span>{statusMsg}</span>}
                  {status === "error" && <span>{statusMsg}</span>}
                </div>
              )}

              <button type="submit" disabled={status === "loading"} className="w-full py-4 rounded-xl bg-[#44443a] text-white font-bold flex items-center justify-center space-x-2 hover:bg-white hover:text-black hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 disabled:hover:bg-[#44443a] disabled:hover:text-white cursor-pointer disabled:cursor-not-allowed">
                <span>{status === "loading" ? "Sending..." : "Send Message"}</span>
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
