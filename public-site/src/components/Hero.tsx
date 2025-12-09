"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { Zap, Shield, Lock } from "lucide-react";

const AttackGlobe = dynamic(() => import("./AttackGlobe"), { ssr: false });

export default function Hero() {
  const [breachCount] = useState(0);
  const [isGlitching, setIsGlitching] = useState(false);
  const [attemptCount, setAttemptCount] = useState(847293);

  // Simulate attack attempts
  useEffect(() => {
    const interval = setInterval(() => {
      setAttemptCount((prev) => prev + Math.floor(Math.random() * 3) + 1);
      
      // Random glitch effect
      if (Math.random() > 0.95) {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 300);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const triggerGlitch = useCallback(() => {
    setIsGlitching(true);
    setTimeout(() => setIsGlitching(false), 300);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-linear-to-b from-black via-black to-violet-950/20" />
      
      {/* Radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,255,255,0.1)_0%,transparent_70%)]" />
      
      {/* Globe container */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] md:w-[600px] md:h-[600px] lg:w-[800px] lg:h-[800px] relative">
          <AttackGlobe />
        </div>
      </div>

      {/* Content overlay */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        {/* Status badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full glass mb-4 sm:mb-6"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
          <span className="text-xs sm:text-sm text-white/80 terminal-text">
            <span className="hidden sm:inline">SYSTEM OPERATIONAL • </span>{attemptCount.toLocaleString()} BLOCKED
          </span>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight mb-2 md:mb-4"
        >
          <span className="text-white">The Future of</span>
          <br />
          <span className="gradient-text">Authentication</span>
        </motion.h1>

        {/* Breach counter */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="my-6 sm:my-8"
          onClick={triggerGlitch}
        >
          <div className="inline-flex flex-col items-center gap-2 cursor-pointer group">
            <div className="relative">
              <AnimatePresence>
                {isGlitching && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <span className="text-5xl sm:text-6xl md:text-7xl lg:text-9xl font-bold text-red-500 animate-glitch terminal-text">
                      0
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
              <motion.span
                className={`text-5xl sm:text-6xl md:text-7xl lg:text-9xl font-bold terminal-text ${
                  isGlitching ? "text-transparent" : "text-cyan-400 text-glow-cyan"
                }`}
                animate={isGlitching ? { x: [-2, 2, -2, 0] } : {}}
                transition={{ duration: 0.1 }}
              >
                {breachCount}
              </motion.span>
            </div>
            <span className="text-xs sm:text-sm md:text-base lg:text-lg text-white/60 tracking-widest sm:tracking-[0.2em] uppercase terminal-text">
              Breaches Since 2024
            </span>
          </div>
        </motion.div>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-sm sm:text-base md:text-lg text-white/50 max-w-2xl mx-auto mb-6 md:mb-8 px-4"
        >
          Quantum-safe signatures. Celestial entropy. Cognitive firewalls.
          <br />
          The most advanced authentication system ever designed.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.button
            className="group relative px-6 py-3 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl bg-linear-to-r from-cyan-500 to-violet-600 text-white font-semibold text-base sm:text-lg overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              LAUNCH SIEGE
            </span>
            <motion.div
              className="absolute inset-0 bg-linear-to-r from-violet-600 to-cyan-500"
              initial={{ x: "100%" }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>

          <motion.button
            className="px-6 py-3 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl glass text-white/80 font-medium text-base sm:text-lg flex items-center gap-2 hover:text-cyan-400 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Shield className="w-5 h-5" />
            View Security Layers
          </motion.button>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mt-8 md:mt-12 grid grid-cols-3 gap-4 sm:gap-6 max-w-2xl mx-auto"
        >
          {[
            { value: "9", label: "Security Layers", icon: Lock },
            { value: "∞", label: "Entropy Sources", icon: Shield },
            { value: "0ms", label: "Response Time", icon: Zap },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 + i * 0.1 }}
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <stat.icon className="w-4 h-4 text-cyan-400" />
                <span className="text-xl sm:text-2xl md:text-3xl font-bold text-white terminal-text">
                  {stat.value}
                </span>
              </div>
              <span className="text-[10px] sm:text-xs text-white/40 uppercase tracking-wider">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 rounded-full border border-white/20 flex items-start justify-center p-2"
        >
          <motion.div
            animate={{ height: ["20%", "80%", "20%"] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 bg-linear-to-b from-cyan-400 to-violet-500 rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
