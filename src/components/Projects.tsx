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
                <span key={tag} className="text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md bg-[#44443a]/10 border border-[#44443a]/30 text-white/70">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="flex space-x-2 ml-3 shrink-0">
            {github && (
              <a href={github} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/5 hover:bg-[#44443a] hover:text-white transition-all">
                <Github size={15} />
              </a>
            )}
            {link && (
              <a href={link} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/5 hover:bg-[#44443a] hover:text-white transition-all">
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
      title: "Hilltop Granite",
      description: "Premium marble and granite distributor website featuring an elegant, rich portfolio of stone designs, slabs, and countertop collections.",
      images: ["/images/hilltop.png"],
      tags: ["Next.js", "Tailwind CSS", "UI/UX", "Product Showcase"],
      link: "https://www.hilltopgranite.com/",
      github: "https://github.com/Antony-24",
    },
    {
      title: "Global Business Tech",
      description: "Enterprise IT solutions and professional consultancy platform showcasing services in hardware, network security, and cloud infrastructure.",
      images: ["/images/globalbusinesstech.png"],
      tags: ["React", "Next.js", "Corporate", "Services Portal"],
      link: "https://globalbusinesstech.in/",
      github: "https://github.com/Antony-24",
    },
    {
      title: "Ikonix Perfumer",
      description: "High-end luxury fragrance store and e-commerce experience designed to showcase premium scent catalogs, notes, and collections.",
      images: ["/images/ikonix.png"],
      tags: ["E-Commerce", "React", "Sleek Aesthetics", "Product Catalog"],
      link: "https://ikonixperfumer.com/",
      github: "https://github.com/Antony-24",
    },
    {
      title: "News Potent",
      description: "Dynamic global news and media portal featuring real-time feed updates, categorized articles, and fully responsive layouts.",
      images: ["/images/newspotent.png"],
      tags: ["Vercel", "React", "News Feed", "API Integration"],
      link: "https://newspotent.vercel.app/",
      github: "https://github.com/Antony-24",
    },
    {
      title: "IDA SDFC Kerala",
      description: "State-level professional dental council platform providing member registration, updates, directories, and secure dental resource sharing.",
      images: ["/images/ida_sdfc.png"],
      tags: ["Next.js", "Member Directory", "Professional Portal", "Security"],
      link: "https://ida-sdfckerala.com/",
      github: "https://github.com/Antony-24",
    },
    {
      title: "Packrack",
      description: "B2B and B2C heavy-duty industrial shelving, storage racking, and warehouse solutions website featuring catalog management.",
      images: ["/images/packrack.png"],
      tags: ["Tailwind CSS", "React", "Industrial Design", "Catalog"],
      link: "https://packrack.in/",
      github: "https://github.com/Antony-24",
    },
    {
      title: "Megaa Opes",
      description: "Global recruitment and human resources portal facilitating international talent sourcing, job boards, and employer services.",
      images: ["/images/megaaopes.png"],
      tags: ["Recruitment", "Job Board", "React", "User Experience"],
      link: "https://megaaopes.com/",
      github: "https://github.com/Antony-24",
    },
    {
      title: "The Fysit",
      description: "Modern health and wellness portal dedicated to physical therapy, fitness consulting, and online treatment scheduling.",
      images: ["/images/thefysit.png"],
      tags: ["Next.js", "Wellness", "Booking Integration", "Responsive"],
      link: "https://thefysit.com/",
      github: "https://github.com/Antony-24",
    },
    {
      title: "Virra",
      description: "Creative design studio and digital branding agency showcase page featuring high-concept animations and immersive experiences.",
      images: ["/images/virra.png"],
      tags: ["Agency Showcase", "Framer Motion", "Vibrant UI", "Next.js"],
      link: "https://virra.in/",
      github: "https://github.com/Antony-24",
    },
    {
      title: "Winmax India",
      description: "Advanced engineering systems and industrial equipment supplier portal presenting detailed product metrics and sales inquiries.",
      images: ["/images/winmax.png"],
      tags: ["Next.js", "Engineering Portal", "B2B E-Commerce", "Contact Forms"],
      link: "https://winmaxindia.com/",
      github: "https://github.com/Antony-24",
    },
  ];

  const N = projects.length;
  // Triple-clone for seamless infinite loop
  const cloned = [...projects, ...projects, ...projects];

  // Responsive: 1 card on mobile, 3 on desktop
  const [isMounted, setIsMounted] = useState(false);
  const [visible, setVisible] = useState(3);

  useEffect(() => {
    setIsMounted(true);
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
  const lastClick = useRef(0);
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
    const now = Date.now();
    if (now - lastClick.current < 450) return;
    lastClick.current = now;
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
      if (c < N) { setJumping(true); return c + N; }
      if (c < 0 || c >= cloned.length) { setJumping(true); return N; }
      return c;
    });
  };

  // CSS % calculation
  const trackWidth = (cloned.length / (isMounted ? visible : 3)) * 100;
  const cardWidth = 100 / cloned.length;
  const translateX = -(current * cardWidth);

  const activeIndex = current % N;

  return (
    <section id="projects" className="section-padding bg-background font-poppins">
      <div className="container mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
          <div>
            <h2 className="text-white/60 font-medium mb-4 tracking-widest uppercase text-sm border-b border-[#44443a]/50 pb-2 inline-block">Portfolio</h2>
            <h3 className="text-4xl md:text-5xl font-bold">Feathers In My Cap</h3>
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
                       hover:bg-[#44443a] hover:text-white hover:border-[#44443a]
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
                       hover:bg-[#44443a] hover:text-white hover:border-[#44443a]
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
                className={`transition-all duration-300 rounded-full ${i === activeIndex
                    ? "w-8 h-2 bg-white"
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
