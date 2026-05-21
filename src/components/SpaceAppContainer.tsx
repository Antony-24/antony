"use client";

import React, { useState } from "react";
import SpacePreloader from "./SpacePreloader";
import StarDustParticles from "./StarDustParticles";

interface SpaceAppContainerProps {
  children: React.ReactNode;
}

const SpaceAppContainer: React.FC<SpaceAppContainerProps> = ({ children }) => {
  const [isLaunched, setIsLaunched] = useState(false);

  return (
    <>
      <SpacePreloader onLaunchComplete={() => setIsLaunched(true)} />
      {isLaunched ? (
        <>
          <StarDustParticles />
          {children}
        </>
      ) : (
        // Render a clean black backdrop to optimize memory and CPU thread consumption during countdown
        <div className="min-h-screen bg-[#050507]" />
      )}
    </>
  );
};

export default SpaceAppContainer;
