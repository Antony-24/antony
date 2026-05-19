"use client";

import React from "react";
import { motion } from "framer-motion"; 
import { Activity, Video, CheckCircle2, ArrowRight } from "lucide-react";

interface AuditCTAProps {
  setSelectedService: (service: string) => void;
  onOpenAssessment?: () => void;
}

const AuditCTA = ({ setSelectedService, onOpenAssessment }: AuditCTAProps) => {
  const handleServiceSelect = (serviceName: string) => {
    if (serviceName === "Free Website Audit" && onOpenAssessment) {
      onOpenAssessment();
      return;
    }
    setSelectedService(serviceName);
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 70, damping: 14 }
    }
  };

  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <section id="free-session" className="section-padding bg-gradient-to-b from-background to-card/10 font-poppins relative overflow-hidden">
      <div className="container mx-auto relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          whileInView={isMobile ? undefined : { opacity: 1, y: 0 }}
          viewport={isMobile ? undefined : { once: true }}
          transition={{ type: "spring", stiffness: 85, damping: 15 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-white/60 font-medium mb-4 tracking-widest uppercase text-sm border-b border-[#44443a]/50 pb-2 inline-block">
            Collaborate For Free
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Accelerate Your <span className="text-[#44443a]">Digital Growth</span>
          </h2>
          <p className="text-foreground/55 font-light">
            Claim a zero-cost website audit or jump on a quick session to optimize your codebase, conversions, and speed.
          </p>
        </motion.div>

        {/* Dynamic Cards Grid */}
        <motion.div
          initial={isMobile ? "visible" : "hidden"}
          whileInView={isMobile ? undefined : "visible"}
          viewport={isMobile ? undefined : { once: true, amount: 0.15 }}
          variants={containerVariants}
          className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto"
        >
          {/* Card 1: Website Audit */}
          <motion.div
            variants={fadeInUp}
            whileHover={{ y: -8 }}
            className="glass p-8 md:p-12 rounded-[2.5rem] border border-white/5 hover:border-[#44443a]/30 transition-all duration-500 flex flex-col justify-between shadow-2xl relative group cursor-pointer"
            onClick={() => handleServiceSelect("Free Website Audit")}
          >
            <div>
              <div className="w-14 h-14 rounded-2.5xl bg-[#44443a]/10 border border-[#44443a]/30 flex items-center justify-center text-white/90 mb-8 group-hover:scale-110 group-hover:bg-[#44443a] transition-all duration-300">
                <Activity size={26} />
              </div>
              <h3 className="text-2xl font-bold mb-4 group-hover:text-white transition-colors">
                Free Website Audit
              </h3>
              <p className="text-foreground/50 text-sm mb-8 font-light leading-relaxed">
                Struggling with slow loading times or low sales conversions? Let me run an in-depth 10-point technical audit on your site.
              </p>
              
              <ul className="space-y-4 mb-10">
                <li className="flex items-center space-x-3 text-sm text-foreground/75 font-light">
                  <CheckCircle2 size={16} className="text-[#44443a]" />
                  <span>Performance & Core Web Vitals check</span>
                </li>
                <li className="flex items-center space-x-3 text-sm text-foreground/75 font-light">
                  <CheckCircle2 size={16} className="text-[#44443a]" />
                  <span>UX & conversion rate optimizations</span>
                </li>
                <li className="flex items-center space-x-3 text-sm text-foreground/75 font-light">
                  <CheckCircle2 size={16} className="text-[#44443a]" />
                  <span>SEO roadmap & speed fixes</span>
                </li>
              </ul>
            </div>

            <button 
              className="w-full py-4 rounded-xl border border-[#44443a]/50 text-white font-bold flex items-center justify-center space-x-2 bg-[#44443a]/10 hover:bg-[#44443a] transition-all duration-300 shadow-md group-hover:shadow-[#44443a]/25 group-hover:border-[#44443a]"
            >
              <span>Claim Free Audit</span>
              <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

          {/* Card 2: Strategy Call */}
          <motion.div
            variants={fadeInUp}
            whileHover={{ y: -8 }}
            className="glass p-8 md:p-12 rounded-[2.5rem] border border-white/5 hover:border-[#44443a]/30 transition-all duration-500 flex flex-col justify-between shadow-2xl relative group cursor-pointer"
            onClick={() => handleServiceSelect("Free 1:1 Strategy Session")}
          >
            <div>
              <div className="w-14 h-14 rounded-2.5xl bg-[#44443a]/10 border border-[#44443a]/30 flex items-center justify-center text-white/90 mb-8 group-hover:scale-110 group-hover:bg-[#44443a] transition-all duration-300">
                <Video size={26} />
              </div>
              <h3 className="text-2xl font-bold mb-4 group-hover:text-white transition-colors">
                Free 1:1 Strategy Call
              </h3>
              <p className="text-foreground/50 text-sm mb-8 font-light leading-relaxed">
                Got a custom project or custom web app idea? Let's hop on a 30-minute video session to scope your design and tech requirements.
              </p>
              
              <ul className="space-y-4 mb-10">
                <li className="flex items-center space-x-3 text-sm text-foreground/75 font-light">
                  <CheckCircle2 size={16} className="text-[#44443a]" />
                  <span>Conceptual system architecture scope</span>
                </li>
                <li className="flex items-center space-x-3 text-sm text-foreground/75 font-light">
                  <CheckCircle2 size={16} className="text-[#44443a]" />
                  <span>Modern database & API advisory</span>
                </li>
                <li className="flex items-center space-x-3 text-sm text-foreground/75 font-light">
                  <CheckCircle2 size={16} className="text-[#44443a]" />
                  <span>Cloud deployment & hosting strategy</span>
                </li>
              </ul>
            </div>

            <button 
              className="w-full py-4 rounded-xl border border-[#44443a]/50 text-white font-bold flex items-center justify-center space-x-2 bg-[#44443a]/10 hover:bg-[#44443a] transition-all duration-300 shadow-md group-hover:shadow-[#44443a]/25 group-hover:border-[#44443a]"
            >
              <span>Book Strategy Call</span>
              <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

        </motion.div>

      </div>

      {/* Background Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50rem] h-[50rem] bg-[#44443a]/5 blur-[200px] rounded-full pointer-events-none z-0"></div>
    </section>
  );
};

export default AuditCTA;
