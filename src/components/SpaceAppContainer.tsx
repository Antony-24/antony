"use client";

import React, { useState, useEffect, useRef } from "react";
import SpacePreloader from "./SpacePreloader";
import { RocketAscentCinematic } from "./RocketAscentCinematic";
import StarDustParticles from "./StarDustParticles";
import Navbar from "./Navbar";
import AssessmentModal from "./AssessmentModal";

interface SpaceAppContainerProps {
  children: React.ReactNode;
}

type LaunchStage = "preloader" | "ascent" | "website";

const SpaceAppContainer: React.FC<SpaceAppContainerProps> = ({ children }) => {
  const [stage, setStage] = useState<LaunchStage>("preloader");
  const [assetsReady, setAssetsReady] = useState(false);
  const [isAssessmentOpen, setIsAssessmentOpen] = useState(false);

  useEffect(() => {
    const handleOpenModal = () => setIsAssessmentOpen(true);
    window.addEventListener("openAssessmentModal", handleOpenModal);
    return () => window.removeEventListener("openAssessmentModal", handleOpenModal);
  }, []);

  useEffect(() => {
    // 1. Core images to pre-cache in browser memory
    const imagesToPreload = [
      "/images/hilltop.png",
      "/images/globalbusinesstech.png",
      "/images/ikonix.png",
      "/images/newspotent.png",
      "/images/ida_sdfc.png",
      "/images/packrack.png",
      "/images/megaaopes.png",
      "/images/thefysit.png",
      "/images/virra.png",
      "/images/winmax.png",
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600",
      "https://images.unsplash.com/photo-1612892483236-42d68a57623d?q=80&w=600",
      "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=600",
      "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=1200&auto=format&fit=crop",
    ];

    const preloadImages = imagesToPreload.map((src) => {
      return new Promise<void>((resolve) => {
        if (typeof window === "undefined") return resolve();
        const img = new Image();
        img.src = src;
        img.onload = () => resolve();
        img.onerror = () => resolve(); // continue gracefully if any load fails
      });
    });

    // 2. Google Web Fonts loaded check (avoids Flash of Unstyled Text)
    const fontsReady = typeof document !== "undefined" && (document as any).fonts
      ? (document as any).fonts.ready
      : Promise.resolve();

    // 3. Complete browser window load event check
    const docReady = new Promise<void>((resolve) => {
      if (typeof document === "undefined") return resolve();
      if (document.readyState === "complete") {
        resolve();
      } else {
        window.addEventListener("load", () => resolve());
      }
    });

    // Combine all checks and trigger pre-mounting release
    Promise.all([...preloadImages, fontsReady, docReady]).then(() => {
      // Small buffer for absolute visual guarantee
      setTimeout(() => {
        setAssetsReady(true);
      }, 1000);
    });
  }, []);

  return (
    <>
      {/* Preloader countdown */}
      {stage === "preloader" && (
        <SpacePreloader
          isAssetsReady={assetsReady}
          onLaunchComplete={() => setStage("ascent")}
        />
      )}

      {/* Rocket cinematic */}
      {stage === "ascent" && (
        <RocketAscentCinematic onCinematicComplete={() => setStage("website")} />
      )}

      {/*
        PERFORMANCE: Pre-mount the portfolio content DURING the cinematic
        using visibility:hidden (not display:none).
        The browser still fetches & parses all images, fonts, JS chunks
        so by T+8s everything is ready — zero skeleton loading.
      */}
      <div
        style={{
          visibility: stage === "website" ? "visible" : "hidden",
          position: stage === "website" ? "relative" : "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          zIndex: stage === "website" ? 1 : -1,
          pointerEvents: stage === "website" ? "auto" : "none",
        }}
        aria-hidden={stage !== "website"}
      >
        {/* StarDust only shows when website is active */}
        {stage === "website" && <StarDustParticles />}
        
        {stage === "website" && (
          <>
            <Navbar onOpenAssessment={() => setIsAssessmentOpen(true)} />
            <AssessmentModal isOpen={isAssessmentOpen} onClose={() => setIsAssessmentOpen(false)} />
          </>
        )}
        
        {children}
      </div>
    </>
  );
};

export default SpaceAppContainer;
