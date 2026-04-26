"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { ExternalLink, Github, ChevronLeft, ChevronRight } from "lucide-react";

interface ProjectProps {
  title: string;
  description: string;
  images: string[];
  tags: string[];
  link?: string;
  github?: string;
}

/* ── Project Card ─────────────────────────────────────────────────── */
const ProjectCard = ({ title, description, images, tags, link, github }: ProjectProps) => {
  const [imgIndex, setImgIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const t = setInterval(() => setImgIndex(i => (i + 1) % images.length), 2500);
    return () => clearInterval(t);
  }, [images.length]);

  return (
    <div className="group relative bg-card rounded-3xl overflow-hidden border border-white/5 hover:border-accent/30 transition-all duration-500 h-full flex flex-col">
      {/* Image */}
      <div className="relative h-52 overflow-hidden shrink-0">
        <img
          src={images[imgIndex]}
          alt={`${title} screenshot`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold mb-2 group-hover:text-accent transition-colors truncate">
              {title}
            </h3>
            <div className="flex flex-wrap gap-1">
              {tags.map(tag => (
                <span key={tag} className="text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md bg-white/5 text-foreground/50">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="flex space-x-2 ml-3 shrink-0">
            {github && (
              <a href={github} className="p-2 rounded-full bg-white/5 hover:bg-accent hover:text-background transition-all">
                <Github size={15} />
              </a>
            )}
            {link && (
              <a href={link} className="p-2 rounded-full bg-white/5 hover:bg-accent hover:text-background transition-all">
                <ExternalLink size={15} />
              </a>
            )}
          </div>
        </div>
        <p className="text-foreground/55 leading-relaxed text-sm flex-1">{description}</p>
      </div>
    </div>
  );
};

/* ── Projects Section ─────────────────────────────────────────────── */
const Projects = () => {
  const projects: ProjectProps[] = [
    {
      title: "Tourismooze",
      description: "A comprehensive tourism web application featuring diverse packages, currency conversion, and international payment acceptance.",
      images: ["/images/tourismooze_1.png", "/images/tourismooze_2.png"],
      tags: ["React", "Next.js", "Tailwind", "API Integration"],
      link: "#",
      github: "#",
    },
    {
      title: "Mental Health Portal",
      description: "A professional portfolio for a psychiatrist featuring a clean design, service showcase, and appointment booking integration.",
      images: ["/images/psychiatrist.png"],
      tags: ["React", "UI/UX", "Responsive"],
      link: "#",
    },
    {
      title: "Analytics Dashboard",
      description: "High-performance data visualization platform with real-time updates and interactive charts for business intelligence.",
      images: ["/images/dashboard.png"],
      tags: ["Next.js", "Redux", "DataViz"],
      link: "#",
      github: "#",
    },
  ];

  const N = projects.length;
  // Triple-clone for seamless infinite loop
  const cloned = [...projects, ...projects, ...projects];

  // Responsive: 1 card on mobile, 3 on desktop
  const [visible, setVisible] = useState(3);

  useEffect(() => {
    const update = () => setVisible(window.innerWidth < 768 ? 1 : 3);
    update(); // run once on mount
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Start at index N so the "real" set is centered
  const [current, setCurrent] = useState(N);
  const [jumping, setJumping] = useState(false);
  const [paused, setPaused] = useState(false);

  // Reset position when breakpoint switches
  const prevVisible = useRef(visible);
  useEffect(() => {
    if (prevVisible.current !== visible) {
      prevVisible.current = visible;
      setJumping(true);
      setCurrent(N);
      requestAnimationFrame(() => requestAnimationFrame(() => setJumping(false)));
    }
  }, [visible, N]);

  // Re-enable transition after silent jump
  useEffect(() => {
    if (!jumping) return;
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(() => setJumping(false))
    );
    return () => cancelAnimationFrame(id);
  }, [jumping]);

  const paginate = useCallback((dir: number) => {
    setCurrent(c => c + dir);
  }, []);

  // Auto-slide every 5 s
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => paginate(1), 5000);
    return () => clearInterval(t);
  }, [paused, paginate]);

  // Seamless loop reset after CSS transition ends
  const handleTransitionEnd = () => {
    setCurrent(c => {
      if (c >= N * 2) { setJumping(true); return c - N; }
      if (c < N)      { setJumping(true); return c + N; }
      return c;
    });
  };

  // CSS % calculation
  const trackWidth  = (cloned.length / visible) * 100;
  const cardWidth   = 100 / cloned.length;
  const translateX  = -(current * cardWidth);

  const activeIndex = current % N;

  return (
    <section id="projects" className="section-padding bg-black/50 font-poppins">
      <div className="container mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
          <div>
            <h2 className="text-accent font-medium mb-4 tracking-widest uppercase text-sm">Portfolio</h2>
            <h3 className="text-4xl md:text-5xl font-bold">Featured Projects</h3>
          </div>
          <p className="text-foreground/40 max-w-xs mt-4 md:mt-0">
            A selection of my recent works where design meets functionality.
          </p>
        </div>

        {/* Slider */}
        <div
          className="relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Viewport */}
          <div className="overflow-hidden">
            {/* Track */}
            <div
              className="flex items-stretch"
              style={{
                width: `${trackWidth}%`,
                transform: `translateX(${translateX}%)`,
                transition: jumping ? "none" : "transform 0.55s cubic-bezier(0.4,0,0.2,1)",
              }}
              onTransitionEnd={handleTransitionEnd}
            >
              {cloned.map((project, i) => (
                <div
                  key={i}
                  className="px-3"
                  style={{ width: `${cardWidth}%` }}
                >
                  <ProjectCard {...project} />
                </div>
              ))}
            </div>
          </div>

          {/* Left Arrow */}
          <button
            onClick={() => paginate(-1)}
            aria-label="Previous project"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-5 z-10
                       w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center
                       bg-card border border-white/10 text-foreground/70
                       hover:bg-accent hover:text-background hover:border-accent
                       transition-all duration-300 shadow-xl"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Right Arrow */}
          <button
            onClick={() => paginate(1)}
            aria-label="Next project"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-5 z-10
                       w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center
                       bg-card border border-white/10 text-foreground/70
                       hover:bg-accent hover:text-background hover:border-accent
                       transition-all duration-300 shadow-xl"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Dots + Counter */}
        <div className="flex items-center justify-center gap-6 mt-10">
          <div className="flex gap-2">
            {projects.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(N + i)}
                aria-label={`Go to project ${i + 1}`}
                className={`transition-all duration-300 rounded-full ${
                  i === activeIndex
                    ? "w-8 h-2 bg-accent"
                    : "w-2 h-2 bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </div>
          <span className="text-foreground/30 text-xs tabular-nums">
            {String(activeIndex + 1).padStart(2, "0")} / {String(N).padStart(2, "0")}
          </span>
        </div>

      </div>
    </section>
  );
};

export default Projects;
