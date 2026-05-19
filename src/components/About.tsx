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

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const timelineItemVariants = {
    hidden: { opacity: 0, x: -40, y: 10 },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { type: "spring", stiffness: 80, damping: 14 }
    },
  };

  const skillItemVariants = {
    hidden: { opacity: 0, scale: 0.85, y: 30 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring", stiffness: 75, damping: 12 }
    },
  };

  return (
    <section id="about" className="section-padding bg-card/30 font-poppins relative overflow-hidden">
      <div className="container mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-start">

          {/* Timeline & Bio */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.h2
              variants={timelineItemVariants}
              className="text-white/60 font-medium mb-4 tracking-widest uppercase text-sm border-b border-[#44443a]/50 pb-2 inline-block"
            >
              About Me
            </motion.h2>

            <motion.h3
              variants={timelineItemVariants}
              className="text-4xl font-bold mb-8"
            >
              Passionate about <span className="text-[#44443a]">seamless</span> user experiences.
            </motion.h3>

            <motion.p
              variants={timelineItemVariants}
              className="text-foreground/60 leading-relaxed mb-8 font-light"
            >
              With over two years of experience in frontend development, I specialize in creating visually appealing and user-friendly websites. My expertise extends to deploying and managing websites to ensure optimal performance, security, and scalability.
            </motion.p>

            {/* Timeline */}
            <div className="space-y-4">
              {experiences.map((exp, i) => (
                <motion.div
                  key={i}
                  variants={timelineItemVariants}
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="flex justify-between items-center p-4 rounded-2xl glass hover:bg-white/10 transition-all cursor-default"
                >
                  <div>
                    <h4 className="font-bold">{exp.role}</h4>
                    <p className="text-sm text-foreground/40">{exp.company}</p>
                  </div>
                  <span className="text-xs font-bold text-white px-3 py-1 rounded-full bg-[#44443a] shadow-md shadow-[#44443a]/20">{exp.period}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Grid of Skill Cards */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid grid-cols-2 gap-4 lg:mt-16"
          >
            <SkillCard icon={<Code2 size={24} />} title="Next.js" desc="React.js, Redux, Context" variants={skillItemVariants} />
            <SkillCard icon={<Palette size={24} />} title="Tailwind CSS" desc="Aesthetic UI Design" variants={skillItemVariants} />
            <SkillCard icon={<Globe size={24} />} title="JavaScript" desc="Modern ES6+ Logic" variants={skillItemVariants} />
            <SkillCard icon={<Cpu size={24} />} title="Web Apps" desc="Scalable Architectures" variants={skillItemVariants} />
            <SkillCard icon={<Smartphone size={24} />} title="Responsive" desc="Mobile-first approach" variants={skillItemVariants} />
            <SkillCard icon={<Database size={24} />} title="API" desc="Restful Integration" variants={skillItemVariants} />
          </motion.div>
        </div>
      </div>

      {/* Decorative Blur elements */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-[#44443a]/5 blur-[120px] rounded-full pointer-events-none"></div>
    </section>
  );
};

const SkillCard = ({
  icon,
  title,
  desc,
  variants
}: {
  icon: React.ReactNode,
  title: string,
  desc: string,
  variants: any
}) => (
  <motion.div
    variants={variants}
    whileHover={{
      scale: 1.05,
      rotateY: 5,
      rotateX: -5,
      z: 50
    }}
    className="p-6 rounded-3xl glass hover:bg-[#44443a] hover:text-white transition-all group cursor-pointer shadow-lg shadow-black/10 border border-white/5 hover:border-[#44443a]/50"
    style={{ transformStyle: "preserve-3d", perspective: 1000 }}
  >
    <div className="mb-4 text-white/80 group-hover:text-white transition-colors group-hover:scale-110 duration-300 w-fit">{icon}</div>
    <h4 className="font-bold mb-2 group-hover:translate-z-10">{title}</h4>
    <p className="text-xs text-foreground/50 group-hover:text-white/80 transition-colors leading-relaxed font-light">{desc}</p>
  </motion.div>
);

export default About;
