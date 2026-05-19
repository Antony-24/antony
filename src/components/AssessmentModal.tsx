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
        setStage("score");
      }
    }, 280);
  };

  const handleBack = () => {
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
    }
  };

  const handleSubmitScore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStage("submitting");
    setStatusMsg("");

    // Classify score
    let grade = "C (Critical Redesign Needed)";
    let recommendation = "Your website is leaking visitors due to technical friction. We recommend a full modern Next.js overhaul.";
    if (score >= 80) {
      grade = "A (Elite Platform)";
      recommendation = "Excellent performance! Only minor optimizations needed to fine-tune conversions.";
    } else if (score >= 50) {
      grade = "B (Standard Site)";
      recommendation = "Moderate speed and SEO, but suffers from conversion leakage. Upgrading code structure is recommended.";
    }

    try {
      const formData = new FormData();
      formData.append("email", email); // Client's email address where the autoresponse copy goes!
      formData.append("subject", `Website Audit Scorecard: ${score}/100 [Grade ${grade}]`);
      formData.append("_captcha", "false"); // Disables captcha for AJAX silent submission

      // Custom plain-text confirmation receipt sent to the client instantly
      formData.append("_autoresponder", `
Thank you for using the Antony Francis AI Website Assessment Calculator!

Here is your diagnostic website scorecard report:
---------------------------------------------
Your Calculated Score: ${score}/100
Your Diagnostic Rating: ${grade}
Recommendation: ${recommendation}

DETAILED CATEGORY SUMMARY:
1. Mobile Speed: ${selectedAnswers[1]}/10 pts
2. Responsiveness: ${selectedAnswers[2]}/10 pts
3. Conversion CTA: ${selectedAnswers[3]}/10 pts
4. Google SEO: ${selectedAnswers[4]}/10 pts
5. Analytics Tracker: ${selectedAnswers[5]}/10 pts
6. Update Frequency: ${selectedAnswers[6]}/10 pts
7. Security Protocol: ${selectedAnswers[7]}/10 pts
8. Stack Platform: ${selectedAnswers[8]}/10 pts
9. Lead Captures: ${selectedAnswers[9]}/10 pts
10. UI Aesthetics: ${selectedAnswers[10]}/10 pts
---------------------------------------------

If you would like to review this scorecard and get a fully detailed custom optimization roadmap, book a free strategy call with me here:
https://antony-nine.vercel.app/#contact

Best regards,
Antony Francis | React Developer
      `);

      // Full analytical log sent to the admin (555jinson@gmail.com)
      formData.append("message", `
=============================================
NEW WEBSITE AUDIT ASSESSMENT REPORT
=============================================
Lead Email: ${email}
Calculated Score: ${score}/100
Rating Grade: ${grade}
Recommendation: ${recommendation}

DETAILED ANSWERS SUMMARY:
1. Mobile Speed: ${selectedAnswers[1]} / 10 pts
2. Responsiveness: ${selectedAnswers[2]} / 10 pts
3. Conversion CTA: ${selectedAnswers[3]} / 10 pts
4. Google SEO: ${selectedAnswers[4]} / 10 pts
5. Analytics Tracker: ${selectedAnswers[5]} / 10 pts
6. Update Frequency: ${selectedAnswers[6]} / 10 pts
7. Security Protocol: ${selectedAnswers[7]} / 10 pts
8. Stack Platform: ${selectedAnswers[8]} / 10 pts
9. Lead Captures: ${selectedAnswers[9]} / 10 pts
10. UI Aesthetics: ${selectedAnswers[10]} / 10 pts
=============================================
      `);

      const response = await fetch("https://formsubmit.co/ajax/555jinson@gmail.com", {
        method: "POST",
        body: formData
      });

      let data;
      try {
        data = await response.json();
      } catch (err) {
        throw new Error("Invalid response format.");
      }

      if (response.ok) {
        setStage("success");
      } else {
        setStage("score");
        setStatusMsg("Oops! Something went wrong. Please check your details and try again.");
      }
    } catch (err) {
      console.error(err);
      setStage("score");
      setStatusMsg("Failed to connect. Please check your internet connection and try again.");
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
              <div className="p-6 md:p-8 border-b border-white/5 bg-white/[0.01]">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs uppercase font-bold tracking-widest text-[#8f8f7c]">
                    Category: {currentQuestion.category}
                  </span>
                  <span className="text-xs font-bold text-foreground/45">
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

              {/* Email Form */}
              <div className="w-full max-w-md mx-auto border-t border-white/5 pt-8">
                <h4 className="text-sm uppercase tracking-wider font-bold mb-4 text-foreground/75">
                  Email Me My Detailed Scorecard
                </h4>
                
                <form onSubmit={handleSubmitScore} className="space-y-4">
                  <div className="flex gap-2">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#44443a] transition-all text-sm text-white placeholder-white/30"
                      placeholder="Enter your email address"
                    />
                    <button
                      type="submit"
                      className="px-6 py-3 rounded-xl bg-[#44443a] hover:bg-white hover:text-black font-bold flex items-center space-x-2 transition-all hover:scale-105 active:scale-95 shadow-md shadow-[#44443a]/10 cursor-pointer"
                    >
                      <span>Send</span>
                      <Send size={14} />
                    </button>
                  </div>
                  {statusMsg && <p className="text-xs text-red-400 mt-2">{statusMsg}</p>}
                </form>
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

          {/* SUCCESS SCREEN */}
          {stage === "success" && (
            <div className="p-8 md:p-12 text-center flex flex-col items-center justify-center flex-1 relative z-10">
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 120, damping: 10 }}
                className="w-20 h-20 rounded-full bg-[#44443a]/10 border border-[#44443a]/30 flex items-center justify-center text-white mb-8"
              >
                <CheckCircle2 size={38} className="text-[#a1a18c]" />
              </motion.div>

              <h2 className="text-3xl font-bold mb-4">Scorecard Dispatched!</h2>
              <p className="text-foreground/50 text-sm md:text-base leading-relaxed mb-8 max-w-sm font-light">
                Your full report has been compiled and emailed to **{email}**. Antony has been notified and is preparing to review your codebase optimization options.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    onClose();
                    // Smooth scroll to contact
                    const contactSection = document.getElementById("contact");
                    if (contactSection) {
                      contactSection.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className="px-6 py-3 rounded-xl bg-[#44443a] hover:bg-white hover:text-black font-bold flex items-center justify-center space-x-2 transition-all hover:scale-105 active:scale-95 shadow-md shadow-[#44443a]/15 cursor-pointer"
                >
                  <span>Book Free Consultation</span>
                  <ArrowRight size={14} />
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 font-semibold text-sm transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          )}

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AssessmentModal;
