"use client";

import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  alpha: number;
  fadeSpeed: number;
  twinkleDirection: number;
}

const StarDustParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const particleCount = 75; // Balanced for maximum performance and gorgeous visual density

    // Resize handler
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener("resize", handleResize);
    handleResize();

    // Generate random particles
    const createParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 1.5 + 0.5, // 0.5px to 2.0px dots
          speedX: (Math.random() - 0.5) * 0.15, // Extremely slow drifting
          speedY: (Math.random() - 0.5) * 0.15,
          alpha: Math.random() * 0.7 + 0.1, // Varied initial opacity
          fadeSpeed: Math.random() * 0.005 + 0.002, // Gentle twinkle speed
          twinkleDirection: Math.random() > 0.5 ? 1 : -1,
        });
      }
    };

    createParticles();

    // Animation Loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move particle
        p.x += p.speedX;
        p.y += p.speedY;

        // Wrap around edges
        if (p.x < 0) p.x = canvas.width;
        else if (p.x > canvas.width) p.x = 0;

        if (p.y < 0) p.y = canvas.height;
        else if (p.y > canvas.height) p.y = 0;

        // Twinkle/Blink effect (shifting opacity)
        p.alpha += p.fadeSpeed * p.twinkleDirection;
        if (p.alpha >= 0.8) {
          p.twinkleDirection = -1;
        } else if (p.alpha <= 0.1) {
          p.twinkleDirection = 1;
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
        ctx.shadowBlur = p.size * 2;
        ctx.shadowColor = "rgba(255, 255, 255, 0.4)";
        ctx.fill();
      }

      ctx.shadowBlur = 0; // Reset shadow for efficiency
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-30"
      style={{
        mixBlendMode: "screen",
        opacity: 0.85,
      }}
    />
  );
};

export default StarDustParticles;
