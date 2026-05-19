"use client";

import React from "react";
import { motion } from "framer-motion";
import { Code2, Palette, Globe, Cpu, Smartphone, Database } from "lucide-react";

const About = () => {
  const experiences = [
    { company: "Inbounderz Bangalore", role: "Web Developer", period: "Jan 2025 - Present" },
    { company: "Cyber TRain Technologies", role: "React Developer", period: "Jan 2024 - Oct 2024" },
    { company: "Cloud static technologies", role: "Freelancing", period: "Feb 2023 - Dec 2023" },
    { company: "Apro IT Solutions", role: "Web Developer", period: "Feb 2022 - Feb 2023" },
  ];

  return (
    <section id="about" className="section-padding bg-card/30 font-poppins">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-white/60 font-medium mb-4 tracking-widest uppercase text-sm border-b border-[#44443a]/50 pb-2 inline-block">About Me</h2>
            <h3 className="text-4xl font-bold mb-8">Passionate about <span className="text-[#44443a]">seamless</span> user experiences.</h3>
            <p className="text-foreground/60 leading-relaxed mb-8">
              With over two years of experience in frontend development, I specialize in creating visually appealing and user-friendly websites. My expertise extends to deploying and managing websites to ensure optimal performance, security, and scalability.
            </p>
            
            <div className="space-y-4">
              {experiences.map((exp, i) => (
                <div key={i} className="flex justify-between items-center p-4 rounded-2xl glass hover:bg-white/10 transition-all cursor-default">
                  <div>
                    <h4 className="font-bold">{exp.role}</h4>
                    <p className="text-sm text-foreground/40">{exp.company}</p>
                  </div>
                  <span className="text-xs font-bold text-white px-3 py-1 rounded-full bg-[#44443a]">{exp.period}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-4"
          >
            <SkillCard icon={<Code2 />} title="React.js" desc="Next.js, Redux, Context" />
            <SkillCard icon={<Palette />} title="Tailwind CSS" desc="Aesthetic UI Design" />
            <SkillCard icon={<Globe />} title="JavaScript" desc="Modern ES6+ Logic" />
            <SkillCard icon={<Cpu />} title="Web Apps" desc="Scalable Architectures" />
            <SkillCard icon={<Smartphone />} title="Responsive" desc="Mobile-first approach" />
            <SkillCard icon={<Database />} title="API" desc="Restful Integration" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const SkillCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="p-6 rounded-3xl glass hover:bg-[#44443a] hover:text-white transition-all group">
    <div className="mb-4 text-white/80 group-hover:text-white transition-colors">{icon}</div>
    <h4 className="font-bold mb-2">{title}</h4>
    <p className="text-xs text-foreground/50 group-hover:text-white/80 transition-colors leading-relaxed">{desc}</p>
  </div>
);

export default About;
