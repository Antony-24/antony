"use client";

import React, { useState } from "react";
import SpacePreloader from "./SpacePreloader";
import { RocketAscentCinematic } from "./RocketAscentCinematic";
import StarDustParticles from "./StarDustParticles";

interface SpaceAppContainerProps {
  children: React.ReactNode;
}

type LaunchStage = "preloader" | "ascent" | "website";

const SpaceAppContainer: React.FC<SpaceAppContainerProps> = ({ children }) => {
  const [stage, setStage] = useState<LaunchStage>("preloader");

  return (
    <>
      {stage === "preloader" && (
        <SpacePreloader onLaunchComplete={() => setStage("ascent")} />
      )}
      {stage === "ascent" && (
        <RocketAscentCinematic onCinematicComplete={() => setStage("website")} />
      )}
      {stage === "website" && (
        <>
          <StarDustParticles />
          {children}
        </>
      )}
      {stage !== "website" && (
        <div className="min-h-screen bg-[#050507] fixed inset-0 z-[999]" />
      )}
    </>
  );
};

export default SpaceAppContainer;
