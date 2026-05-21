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
  isConstellation?: boolean;
  flareSize?: number;
}

interface ShootingStar {
  x: number;
  y: number;
  dx: number;
  dy: number;
  length: number;
  speed: number;
  alpha: number;
  size: number;
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
    let shootingStars: ShootingStar[] = [];
    const particleCount = 80; // Balanced for maximum performance and gorgeous visual density

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
        const isConstellation = i < 6; // Make 6 stars premium constellation bodies
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: isConstellation ? Math.random() * 0.8 + 1.2 : Math.random() * 1.0 + 0.4, // Constellation stars are slightly larger
          speedX: (Math.random() - 0.5) * 0.08, // Slow drifting
          speedY: (Math.random() - 0.5) * 0.08,
          alpha: Math.random() * 0.7 + 0.1, // Varied initial opacity
          fadeSpeed: Math.random() * 0.005 + 0.002, // Gentle twinkle speed
          twinkleDirection: Math.random() > 0.5 ? 1 : -1,
          isConstellation,
          flareSize: Math.random() * 8 + 8, // 8px to 16px flare length
        });
      }
    };

    // Spawning a Comet / Shooting Star
    const spawnShootingStar = () => {
      const fromTop = Math.random() > 0.5;
      let startX = 0;
      let startY = 0;

      if (fromTop) {
        startX = Math.random() * canvas.width;
        startY = 0;
      } else {
        startX = canvas.width;
        startY = Math.random() * canvas.height * 0.5; // Upper half of right side
      }

      // Trajectory pointing leftwards and downwards (~135 degrees +/- 10)
      const angle = (135 + (Math.random() - 0.5) * 20) * (Math.PI / 180);
      const speed = Math.random() * 6 + 6; // Speed 6 to 12

      shootingStars.push({
        x: startX,
        y: startY,
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed,
        length: Math.random() * 120 + 80, // Tail length
        speed: speed,
        alpha: 1.0,
        size: Math.random() * 1.2 + 0.8, // Comet head size
      });
    };

    createParticles();

    // Animation Loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw Twinkling Background Stars
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
        if (p.alpha >= 0.85) {
          p.twinkleDirection = -1;
        } else if (p.alpha <= 0.05) {
          p.twinkleDirection = 1;
        }

        // Draw particle core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
        ctx.shadowBlur = p.size * 2;
        ctx.shadowColor = "rgba(255, 255, 255, 0.4)";
        ctx.fill();

        // Draw constellation cross flare if applicable
        if (p.isConstellation && p.alpha > 0.2 && p.flareSize) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(255, 255, 255, ${p.alpha * 0.35})`;
          ctx.lineWidth = 0.6;
          // Horizontal Flare Line
          ctx.moveTo(p.x - p.flareSize, p.y);
          ctx.lineTo(p.x + p.flareSize, p.y);
          // Vertical Flare Line
          ctx.moveTo(p.x, p.y - p.flareSize);
          ctx.lineTo(p.x, p.y + p.flareSize);
          ctx.stroke();
        }
      }

      ctx.shadowBlur = 0; // Reset shadow for comet line efficiency

      // Spawning Chance of Shooting Star (~0.0006 per frame, every ~25-30s average)
      if (Math.random() < 0.0007 && shootingStars.length < 2) {
        spawnShootingStar();
      }

      // Draw & Update Shooting Stars
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];
        s.x += s.dx;
        s.y += s.dy;
        s.alpha -= 0.012; // Gradual fade-out speed

        // Clean up comets once faded out or fully off-screen
        if (
          s.alpha <= 0 ||
          s.x < -200 ||
          s.y > canvas.height + 200 ||
          s.x > canvas.width + 200
        ) {
          shootingStars.splice(i, 1);
          continue;
        }

        // Draw glowing linear gradient comet tail
        const tailX = s.x - s.dx * (s.length / s.speed);
        const tailY = s.y - s.dy * (s.length / s.speed);

        const grad = ctx.createLinearGradient(s.x, s.y, tailX, tailY);
        grad.addColorStop(0, `rgba(255, 255, 255, ${s.alpha})`);
        grad.addColorStop(0.15, `rgba(255, 255, 255, ${s.alpha * 0.7})`);
        grad.addColorStop(1, "rgba(255, 255, 255, 0)");

        ctx.beginPath();
        ctx.strokeStyle = grad;
        ctx.lineWidth = s.size * 0.9;
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();

        // Draw comet bright head glow
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`;
        ctx.shadowBlur = s.size * 5;
        ctx.shadowColor = "rgba(255, 255, 255, 0.9)";
        ctx.fill();
        ctx.shadowBlur = 0; // Reset shadow
      }

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
