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

interface Planet {
  cxPercent: number;
  cyPercent: number;
  rxPercent: number;
  ryPercent: number;
  orbitAngle: number;
  theta: number;
  speed: number;
  size: number;
  color: string;
  glowColor: string;
  hasRings: boolean;
  cx: number;
  cy: number;
  rx: number;
  ry: number;
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
    const particleCount = 80;

    // Define 2 Orbiting Planets
    const planets: Planet[] = [
      {
        cxPercent: 0.78, // Positioned top-right
        cyPercent: 0.28,
        rxPercent: 0.12, // Orbit radius X relative to width
        ryPercent: 0.06, // Orbit radius Y relative to height
        orbitAngle: -0.18, // Tilted orbital plane in radians
        theta: Math.random() * Math.PI * 2, // Starting angle
        speed: 0.0003, // Slow orbital rotation
        size: 5.5, // Planet size
        color: "#e28254", // Orange gas giant
        glowColor: "rgba(226, 130, 84, 0.4)",
        hasRings: true,
        cx: 0,
        cy: 0,
        rx: 0,
        ry: 0,
      },
      {
        cxPercent: 0.22, // Positioned bottom-left
        cyPercent: 0.72,
        rxPercent: 0.14,
        ryPercent: 0.07,
        orbitAngle: 0.22, // Opposing tilted orbital plane
        theta: Math.random() * Math.PI * 2,
        speed: 0.0002,
        size: 4.8, // Slightly smaller ice giant
        color: "#64b4dc", // Azure blue planet
        glowColor: "rgba(100, 180, 220, 0.45)",
        hasRings: false,
        cx: 0,
        cy: 0,
        rx: 0,
        ry: 0,
      },
    ];

    // Resize handler
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // Update absolute positions of planets on resize
      planets.forEach((p) => {
        p.cx = canvas.width * p.cxPercent;
        p.cy = canvas.height * p.cyPercent;
        p.rx = canvas.width * p.rxPercent;
        p.ry = canvas.height * p.ryPercent;
      });
    };
    
    window.addEventListener("resize", handleResize);
    handleResize();

    // Generate random background stars
    const createParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        const isConstellation = i < 6;
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: isConstellation ? Math.random() * 0.8 + 1.2 : Math.random() * 1.0 + 0.4,
          speedX: (Math.random() - 0.5) * 0.08,
          speedY: (Math.random() - 0.5) * 0.08,
          alpha: Math.random() * 0.7 + 0.1,
          fadeSpeed: Math.random() * 0.005 + 0.002,
          twinkleDirection: Math.random() > 0.5 ? 1 : -1,
          isConstellation,
          flareSize: Math.random() * 8 + 8,
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
        startY = Math.random() * canvas.height * 0.5;
      }

      const angle = (135 + (Math.random() - 0.5) * 20) * (Math.PI / 180);
      const speed = Math.random() * 6 + 6;

      shootingStars.push({
        x: startX,
        y: startY,
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed,
        length: Math.random() * 120 + 80,
        speed: speed,
        alpha: 1.0,
        size: Math.random() * 1.2 + 0.8,
      });
    };

    createParticles();

    // Animation Loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Draw Twinkling Background Stars
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = canvas.width;
        else if (p.x > canvas.width) p.x = 0;

        if (p.y < 0) p.y = canvas.height;
        else if (p.y > canvas.height) p.y = 0;

        p.alpha += p.fadeSpeed * p.twinkleDirection;
        if (p.alpha >= 0.85) {
          p.twinkleDirection = -1;
        } else if (p.alpha <= 0.05) {
          p.twinkleDirection = 1;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
        ctx.shadowBlur = p.size * 2;
        ctx.shadowColor = "rgba(255, 255, 255, 0.4)";
        ctx.fill();

        if (p.isConstellation && p.alpha > 0.2 && p.flareSize) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(255, 255, 255, ${p.alpha * 0.35})`;
          ctx.lineWidth = 0.6;
          ctx.moveTo(p.x - p.flareSize, p.y);
          ctx.lineTo(p.x + p.flareSize, p.y);
          ctx.moveTo(p.x, p.y - p.flareSize);
          ctx.lineTo(p.x, p.y + p.flareSize);
          ctx.stroke();
        }
      }

      ctx.shadowBlur = 0; // Reset shadows for lines

      // 2. Draw Faint Orbital Paths & Moving Planets
      planets.forEach((p) => {
        // Increment orbital position
        p.theta += p.speed;
        if (p.theta > Math.PI * 2) p.theta -= Math.PI * 2;

        // Draw orbital ellipse path (very subtle)
        ctx.beginPath();
        ctx.ellipse(p.cx, p.cy, p.rx, p.ry, p.orbitAngle, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.035)";
        ctx.lineWidth = 0.65;
        ctx.stroke();

        // Calculate planet parametric position + ellipse rotation
        const cosTheta = Math.cos(p.theta);
        const sinTheta = Math.sin(p.theta);
        const unrotatedX = p.rx * cosTheta;
        const unrotatedY = p.ry * sinTheta;

        const cosAngle = Math.cos(p.orbitAngle);
        const sinAngle = Math.sin(p.orbitAngle);

        const px = p.cx + unrotatedX * cosAngle - unrotatedY * sinAngle;
        const py = p.cy + unrotatedX * sinAngle + unrotatedY * cosAngle;

        // Draw Saturn-like rings behind planet if applicable
        if (p.hasRings) {
          ctx.beginPath();
          ctx.ellipse(
            px,
            py,
            p.size * 1.8,
            p.size * 0.35,
            p.orbitAngle + Math.PI / 8,
            0,
            Math.PI * 2
          );
          ctx.strokeStyle = "rgba(226, 130, 84, 0.35)";
          ctx.lineWidth = 1.0;
          ctx.stroke();
        }

        // Draw Planet Sphere (3D illuminated radial gradient)
        const radGrad = ctx.createRadialGradient(
          px - p.size * 0.25,
          py - p.size * 0.25,
          p.size * 0.1,
          px,
          py,
          p.size
        );
        radGrad.addColorStop(0, "#ffffff"); // Reflective highlight core
        radGrad.addColorStop(0.3, p.color); // Native planet color
        radGrad.addColorStop(1, "#0a0a0c"); // Shadow/dark side

        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fillStyle = radGrad;
        ctx.shadowBlur = p.size * 3.5;
        ctx.shadowColor = p.glowColor;
        ctx.fill();
        ctx.shadowBlur = 0; // Reset shadow blur
      });

      // 3. Draw & Update Shooting Stars
      if (Math.random() < 0.0007 && shootingStars.length < 2) {
        spawnShootingStar();
      }

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];
        s.x += s.dx;
        s.y += s.dy;
        s.alpha -= 0.012;

        if (
          s.alpha <= 0 ||
          s.x < -200 ||
          s.y > canvas.height + 200 ||
          s.x > canvas.width + 200
        ) {
          shootingStars.splice(i, 1);
          continue;
        }

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

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`;
        ctx.shadowBlur = s.size * 5;
        ctx.shadowColor = "rgba(255, 255, 255, 0.9)";
        ctx.fill();
        ctx.shadowBlur = 0;
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
