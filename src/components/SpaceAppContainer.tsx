"use client";

import React, { useState, useEffect } from "react";
import StarDustParticles from "./StarDustParticles";
import Navbar from "./Navbar";
import AssessmentModal from "./AssessmentModal";

interface SpaceAppContainerProps {
  children: React.ReactNode;
}

const SpaceAppContainer: React.FC<SpaceAppContainerProps> = ({ children }) => {
  const [isAssessmentOpen, setIsAssessmentOpen] = useState(false);

  useEffect(() => {
    const handleOpenModal = () => setIsAssessmentOpen(true);
    window.addEventListener("openAssessmentModal", handleOpenModal);
    return () => window.removeEventListener("openAssessmentModal", handleOpenModal);
  }, []);

  return (
    <>
      <StarDustParticles />
      <Navbar onOpenAssessment={() => setIsAssessmentOpen(true)} />
      <AssessmentModal isOpen={isAssessmentOpen} onClose={() => setIsAssessmentOpen(false)} />
      {children}
    </>
  );
};

export default SpaceAppContainer;
