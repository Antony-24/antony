"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Sparkles, Send, CheckCircle2, ArrowRight, Shield } from "lucide-react";

interface AssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Question {
  id: number;
  text: string;
  category: string;
  choices: { text: string; points: number }[];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    category: "Performance",
    text: "How fast does your home page load on a mobile device connection?",
    choices: [
      { text: "Under 2 seconds (Fast & Instant)", points: 10 },
      { text: "2 to 5 seconds (Average / Tolerable)", points: 5 },
      { text: "5+ seconds (Frustratingly Slow)", points: 0 }
    ]
  },
  {
    id: 2,
    category: "Responsiveness",
    text: "Is your website fully responsive and easy to navigate on mobile?",
    choices: [
      { text: "Perfect mobile-first layout & custom menu", points: 10 },
      { text: "Mostly, but has occasional overlapping blocks", points: 5 },
      { text: "No, visitors have to pinch and zoom to read", points: 0 }
    ]
  },
  {
    id: 3,
    category: "Conversion Flow",
    text: "How obvious and accessible are your contact actions (CTAs)?",
    choices: [
      { text: "Sticky sticky banners, floating forms, or header widgets", points: 10 },
      { text: "Visible, but requires scrolling to find", points: 5 },
      { text: "Hard to locate, or only on a hidden contact page", points: 0 }
    ]
  },
  {
    id: 4,
    category: "SEO Visibility",
    text: "Does your brand rank on the first page of Google for primary keywords?",
    choices: [
      { text: "Yes, we rank high for multiple product keywords", points: 10 },
      { text: "Yes, but only when searching our exact company name", points: 5 },
      { text: "No, we are buried beyond page two", points: 0 }
    ]
  },
  {
    id: 5,
    category: "User Insights",
    text: "Are you actively tracking analytics and click-behavior funnels?",
    choices: [
      { text: "Yes, tracking via Google Analytics 4, Hotjar, or pixels", points: 10 },
      { text: "Basic page view counts only", points: 5 },
      { text: "No analytics or event trackers are installed", points: 0 }
    ]
  },
  {
    id: 6,
    category: "Content Freshness",
    text: "How regularly do you update your portfolio, blog, or products?",
    choices: [
      { text: "Weekly or monthly with fresh assets", points: 10 },
      { text: "A few times a year", points: 5 },
      { text: "Rarely, the content looks years old", points: 0 }
    ]
  },
  {
    id: 7,
    category: "Web Security",
    text: "Is your domain secured with SSL/HTTPS and firewalls?",
    choices: [
      { text: "Yes, SSL padlock green and active CDN shields", points: 10 },
      { text: "SSL active, but no firewall or CDN protection", points: 5 },
      { text: "No SSL (displays 'Not Secure' warning)", points: 0 }
    ]
  },
  {
    id: 8,
    category: "Code Architecture",
    text: "What stack or platform is your website built on?",
    choices: [
      { text: "Modern React, Next.js, or lightweight headless framework", points: 10 },
      { text: "WordPress, Shopify, Webflow, or similar CMS", points: 5 },
      { text: "Outdated builders (Wix / old templates) or plain files", points: 0 }
    ]
  },
  {
    id: 9,
    category: "Lead Capture",
    text: "Do you have automated booking calendars or dynamic pre-fill forms?",
    choices: [
      { text: "Yes, interactive booking widgets or smart forms", points: 10 },
      { text: "Standard static text-input email forms only", points: 5 },
      { text: "No forms, just a plain email address on screen", points: 0 }
    ]
  },
  {
    id: 10,
    category: "Visual Aesthetics",
    text: "Does your website feature 3D elements, glassmorphism, or modern physics?",
    choices: [
      { text: "Yes, highly immersive layout with micro-animations", points: 10 },
      { text: "Clean and neat, but static and standard", points: 5 },
      { text: "Outdated design that resembles the 2010s", points: 0 }
    ]
  }
];

const AssessmentModal = ({ isOpen, onClose }: AssessmentModalProps) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [stage, setStage] = useState<"intro" | "quiz" | "score" | "submitting" | "success">("intro");
  
  const [score, setScore] = useState(0);
  const [email, setEmail] = useState("");
  const [statusMsg, setStatusMsg] = useState("");

  // Lock scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      // Reset state on close
      setCurrentIdx(0);
      setSelectedAnswers({});
      setStage("intro");
      setEmail("");
      setStatusMsg("");
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const currentQuestion = QUESTIONS[currentIdx];
  const progressPercent = ((currentIdx + 1) / QUESTIONS.length) * 100;

  const handleSelectAnswer = (points: number) => {
    const newAnswers = { ...selectedAnswers, [currentQuestion.id]: points };
    setSelectedAnswers(newAnswers);

    // Auto advance after short delay for next-level smooth flow
    setTimeout(() => {
      if (currentIdx < QUESTIONS.length - 1) {
        setCurrentIdx((prev) => prev + 1);
      } else {
        // Calculate final score
        const total = Object.values(newAnswers).reduce((sum, curr) => sum + curr, 0);
        setScore(total);
        // Automatically submit assessment to the admin in the background
        autoSubmitScore(total, newAnswers);
      }
    }, 280);
  };

  const handleBack = () => {
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
    }
  };

  const autoSubmitScore = async (finalScore: number, answers: Record<number, number>) => {
    setStage("submitting");
    setStatusMsg("");

    // Classify score
    let grade = "C (Critical Redesign Needed)";
    let recommendation = "Your website is leaking visitors due to technical friction. We recommend a full modern Next.js overhaul.";
    if (finalScore >= 80) {
      grade = "A (Elite Platform)";
      recommendation = "Excellent performance! Only minor optimizations needed to fine-tune conversions.";
    } else if (finalScore >= 50) {
      grade = "B (Standard Site)";
      recommendation = "Moderate speed and SEO, but suffers from conversion leakage. Upgrading code structure is recommended.";
    }

    try {
      const response = await fetch("/api/send-scorecard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: "anonymous@visitor.com",
          score: finalScore,
          grade,
          recommendation,
          selectedAnswers: answers
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.method === "client_fallback_required") {
          // SMTP not configured on server, fallback to client-side Web3Forms submission to inform admin
          const answersText = `
1. Mobile Speed: ${answers[1] ?? 0} / 10 pts
2. Responsiveness: ${answers[2] ?? 0} / 10 pts
3. Conversion CTA: ${answers[3] ?? 0} / 10 pts
4. Google SEO: ${answers[4] ?? 0} / 10 pts
5. Analytics Tracker: ${answers[5] ?? 0} / 10 pts
6. Update Frequency: ${answers[6] ?? 0} / 10 pts
7. Security Protocol: ${answers[7] ?? 0} / 10 pts
8. Stack Platform: ${answers[8] ?? 0} / 10 pts
9. Lead Captures: ${answers[9] ?? 0} / 10 pts
10. UI Aesthetics: ${answers[10] ?? 0} / 10 pts
          `.trim();

          const formData = new FormData();
          formData.append("access_key", "3b9590e7-73a5-4881-99e7-a956c496bf2d");
          formData.append("name", "Website Self-Assessment Lead");
          formData.append("email", "anonymous@visitor.com");
          formData.append("from_name", "Antony Portfolio AI Audit");
          formData.append("subject", `New Assessment Lead: ${finalScore}/100 [Grade ${grade}]`);
          formData.append("message", `
=============================================
NEW WEBSITE AUDIT ASSESSMENT REPORT
=============================================
Lead Email: Anonymous Visitor
Calculated Score: ${finalScore}/100
Rating Grade: ${grade}
Recommendation: ${recommendation}

DETAILED ANSWERS SUMMARY:
${answersText}
=============================================
          `.trim());

          await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: formData
          });
        }
      }
    } catch (err) {
      console.error("Auto-submit background error:", err);
    } finally {
      // Always transition to the score view page where the results and the success message are displayed
      setStage("score");
    }
  };

  // Diagnosis details based on score
  const getDiagnosis = () => {
    if (score >= 80) {
      return {
        grade: "Grade A",
        rating: "Elite Platform",
        desc: "Your website is in fantastic shape! It is fast, secure, and responsive. However, minor visual micro-interactions could still elevate conversions even further.",
        color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5"
      };
    } else if (score >= 50) {
      return {
        grade: "Grade B",
        rating: "Standard Site",
        desc: "Your platform is functional, but has noticeable conversion leaks. Speed optimization, dynamic pre-fills, and modern aesthetic styling could easily double your sales.",
        color: "text-[#a1a18c] border-[#44443a]/20 bg-[#44443a]/5"
      };
    } else {
      return {
        grade: "Grade C",
        rating: "Critical Revamp",
        desc: "Your site suffers from serious technical friction, performance lag, and missing security metrics. It is highly recommended to migrate to a custom Next.js structure immediately.",
        color: "text-red-400 border-red-500/20 bg-red-500/5"
      };
    }
  };

  const diagnosis = getDiagnosis();

  // Slide Animation directions
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 150 : -150,
      opacity: 0,
      rotateY: direction > 0 ? 8 : -8
    }),
    center: {
      x: 0,
      opacity: 1,
      rotateY: 0,
      transition: {
        x: { type: "spring", stiffness: 120, damping: 15 },
        opacity: { duration: 0.25 },
        rotateY: { type: "spring", stiffness: 100, damping: 15 }
      }
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 150 : -150,
      opacity: 0,
      rotateY: direction < 0 ? 8 : -8,
      transition: {
        x: { type: "spring", stiffness: 120, damping: 15 },
        opacity: { duration: 0.15 }
      }
    })
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-2xl p-4 md:p-6"
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          transition={{ type: "spring", stiffness: 100, damping: 16 }}
          className="relative w-full max-w-2xl bg-card border border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col justify-between max-h-[92vh] md:max-h-[85vh] font-poppins"
          style={{ transformStyle: "preserve-3d", perspective: 1000 }}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-50 p-2 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-[#44443a] transition-all cursor-pointer"
          >
            <X size={18} />
          </button>

          {/* BACKGROUND DECORATIVE ELEMENTS */}
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-[#44443a]/15 blur-[100px] rounded-full pointer-events-none z-0"></div>
          <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-white/5 blur-[100px] rounded-full pointer-events-none z-0"></div>

          {/* INTRO SCREEN */}
          {stage === "intro" && (
            <div className="p-8 md:p-12 text-center flex flex-col items-center justify-center flex-1 relative z-10">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-20 h-20 rounded-full border border-dashed border-[#44443a] flex items-center justify-center text-white mb-8"
              >
                <Sparkles size={30} className="text-[#8f8f7c]" />
              </motion.div>
              
              <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
                Self-Assessment Calculator
              </h2>
              <p className="text-foreground/55 text-sm md:text-base leading-relaxed mb-8 max-w-md font-light">
                Discover performance barriers, security leaks, and conversion bottlenecks on your website. Get your instant score out of 100 in 60 seconds.
              </p>

              <button
                onClick={() => setStage("quiz")}
                className="px-8 py-4 rounded-xl bg-[#44443a] hover:bg-white hover:text-black font-bold flex items-center space-x-2 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-[#44443a]/25"
              >
                <span>Start Assessment</span>
                <ArrowRight size={18} />
              </button>
            </div>
          )}

          {/* QUIZ SYSTEM */}
          {stage === "quiz" && (
            <div className="flex flex-col flex-1 relative z-10 h-full justify-between">
              
              {/* Progress Panel */}
              <div className="p-6 md:p-8 pr-16 border-b border-white/5 bg-white/[0.01]">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs uppercase font-bold tracking-widest text-[#8f8f7c] truncate pr-2">
                    Category: {currentQuestion.category}
                  </span>
                  <span className="text-xs font-bold text-foreground/45 shrink-0">
                    {currentIdx + 1} / {QUESTIONS.length}
                  </span>
                </div>
                {/* Progress bar */}
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#44443a] to-[#8f8f7c]"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>

              {/* Slider Viewport */}
              <div className="p-8 flex-1 flex flex-col justify-center overflow-hidden min-h-[300px]">
                <AnimatePresence custom={currentIdx} mode="wait">
                  <motion.div
                    key={currentIdx}
                    custom={currentIdx}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="space-y-8 flex flex-col justify-center h-full"
                  >
                    <h3 className="text-xl md:text-2xl font-bold leading-snug">
                      {currentQuestion.text}
                    </h3>

                    <div className="space-y-3">
                      {currentQuestion.choices.map((choice, i) => {
                        const isSelected = selectedAnswers[currentQuestion.id] === choice.points;
                        return (
                          <motion.button
                            key={i}
                            whileHover={{ x: 4, scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => handleSelectAnswer(choice.points)}
                            className={`w-full text-left p-4 rounded-2xl border text-sm font-light leading-relaxed transition-all flex items-center justify-between cursor-pointer ${
                              isSelected
                                ? "bg-[#44443a] border-[#44443a] text-white"
                                : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10 text-foreground/80"
                            }`}
                          >
                            <span>{choice.text}</span>
                            <span className="text-xs text-foreground/35 font-bold ml-2">+{choice.points} pts</span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Footer Controls */}
              <div className="p-6 md:p-8 border-t border-white/5 bg-white/[0.01] flex justify-between items-center">
                <button
                  onClick={handleBack}
                  disabled={currentIdx === 0}
                  className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-foreground/50 hover:text-white transition-colors disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronLeft size={16} />
                  <span>Back</span>
                </button>

                <div className="text-[10px] uppercase font-bold tracking-widest text-foreground/20">
                  Antony AI Calculator 2050
                </div>
              </div>

            </div>
          )}

          {/* SCORE & EMAIL CAPTURE SCREEN */}
          {stage === "score" && (
            <div className="p-8 md:p-12 text-center flex flex-col justify-between flex-1 relative z-10 overflow-y-auto max-h-[85vh]">
              
              {/* Top Score summary */}
              <div>
                <span className="text-white/60 font-medium mb-3 tracking-widest uppercase text-xs border-b border-[#44443a]/50 pb-1.5 inline-block">
                  Diagnostic Result
                </span>
                
                {/* Visual Circular Gauge */}
                <div className="relative w-36 h-36 mx-auto my-6 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="44" stroke="rgba(255,255,255,0.05)" strokeWidth="6" fill="transparent" />
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="44"
                      stroke="#44443a"
                      strokeWidth="6"
                      fill="transparent"
                      strokeDasharray="276.4"
                      initial={{ strokeDashoffset: 276.4 }}
                      animate={{ strokeDashoffset: 276.4 - (276.4 * score) / 100 }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                  </svg>
                  <div className="absolute text-center">
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-3xl md:text-4xl font-bold font-mono"
                    >
                      {score}
                    </motion.span>
                    <span className="text-foreground/30 text-xs block">/ 100</span>
                  </div>
                </div>

                <div className={`px-4 py-2 border rounded-full text-xs font-bold tracking-widest uppercase w-fit mx-auto mb-4 ${diagnosis.color}`}>
                  {diagnosis.grade} : {diagnosis.rating}
                </div>

                <p className="text-sm font-light text-foreground/60 leading-relaxed max-w-md mx-auto mb-8">
                  {diagnosis.desc}
                </p>
              </div>

              {/* Success Message & CTA Buttons */}
              <div className="w-full max-w-md mx-auto border-t border-white/5 pt-8 flex flex-col items-center">
                <div className="flex items-start space-x-3 text-[#a1a18c] bg-[#44443a]/10 border border-[#44443a]/20 px-4 py-3 rounded-2xl mb-6 text-left">
                  <CheckCircle2 size={18} className="shrink-0 mt-0.5 text-[#a1a18c]" />
                  <p className="text-xs font-light leading-relaxed">
                    Your diagnostic scorecard has been successfully recorded. We will review your site performance indicators and prepare custom suggestions for optimization.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
                  <button
                    onClick={() => {
                      onClose();
                      // Smooth scroll to contact
                      const contactSection = document.getElementById("contact");
                      if (contactSection) {
                        contactSection.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    className="px-6 py-3 rounded-xl bg-[#44443a] hover:bg-white hover:text-black font-bold flex items-center justify-center space-x-2 transition-all hover:scale-105 active:scale-95 shadow-md shadow-[#44443a]/15 cursor-pointer w-full sm:w-auto text-sm"
                  >
                    <span>Book Free Consultation</span>
                    <ArrowRight size={14} />
                  </button>
                  <button
                    onClick={onClose}
                    className="px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 font-semibold text-sm transition-colors cursor-pointer w-full sm:w-auto"
                  >
                    Close
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* SUBMITTING OVERLAY */}
          {stage === "submitting" && (
            <div className="p-8 md:p-12 text-center flex flex-col items-center justify-center flex-1 relative z-10">
              <span className="w-12 h-12 border-4 border-white/20 border-t-[#44443a] rounded-full animate-spin mb-6"></span>
              <h3 className="text-xl font-bold mb-2">Analyzing Diagnostics...</h3>
              <p className="text-foreground/45 text-sm font-light">
                Securing connection and compiling your scorecard responses.
              </p>
            </div>
          )}



        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AssessmentModal;
