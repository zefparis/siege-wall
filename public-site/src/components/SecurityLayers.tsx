"use client";

import { motion } from "framer-motion";
import {
  Shield,
  Fingerprint,
  Brain,
  Atom,
  Sparkles,
  Lock,
  Eye,
  Cpu,
  Zap,
} from "lucide-react";

const securityLayers = [
  {
    id: 1,
    name: "Quantum-Safe Signatures",
    description: "Post-quantum cryptographic algorithms resistant to Shor's algorithm attacks",
    icon: Atom,
    color: "#00ffff",
    delay: 0,
  },
  {
    id: 2,
    name: "Celestial Entropy",
    description: "True randomness harvested from cosmic microwave background radiation",
    icon: Sparkles,
    color: "#8b00ff",
    delay: 0.1,
  },
  {
    id: 3,
    name: "Cognitive Firewall",
    description: "AI-powered behavioral analysis detecting synthetic authentication attempts",
    icon: Brain,
    color: "#00ff88",
    delay: 0.2,
  },
  {
    id: 4,
    name: "Biometric Fusion",
    description: "Multi-modal biometric verification with liveness detection",
    icon: Fingerprint,
    color: "#ff6b00",
    delay: 0.3,
  },
  {
    id: 5,
    name: "Zero-Knowledge Proofs",
    description: "Authenticate without revealing any sensitive information",
    icon: Eye,
    color: "#ff00ff",
    delay: 0.4,
  },
  {
    id: 6,
    name: "Temporal Binding",
    description: "Time-locked cryptographic challenges with nanosecond precision",
    icon: Zap,
    color: "#ffff00",
    delay: 0.5,
  },
  {
    id: 7,
    name: "Hardware Enclave",
    description: "Secure execution environment isolated from all system software",
    icon: Cpu,
    color: "#00ff00",
    delay: 0.6,
  },
  {
    id: 8,
    name: "Adaptive Shield",
    description: "Self-evolving defense mechanisms that learn from attack patterns",
    icon: Shield,
    color: "#ff0066",
    delay: 0.7,
  },
  {
    id: 9,
    name: "Immutable Ledger",
    description: "Cryptographically sealed audit trail on distributed infrastructure",
    icon: Lock,
    color: "#00ccff",
    delay: 0.8,
  },
];

export default function SecurityLayers() {
  return (
    <section id="security" className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-violet-950/10 to-transparent" />
      
      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 sm:mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6"
          >
            <Shield className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-cyan-400 terminal-text">9 LAYERS OF PROTECTION</span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4">
            <span className="text-white">Impenetrable by</span>{" "}
            <span className="gradient-text">Design</span>
          </h2>
          <p className="text-white/50 text-base sm:text-lg max-w-2xl mx-auto px-4">
            Each layer operates independently. Compromising one does nothing.
            You&apos;d need to break all nine simultaneously. Good luck.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {securityLayers.map((layer, i) => (
            <motion.div
              key={layer.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: layer.delay, duration: 0.6 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative"
            >
              <div className="glass-strong rounded-2xl p-4 sm:p-6 h-full relative overflow-hidden min-h-[160px]">
                {/* Glow effect on hover */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `radial-gradient(circle at 50% 50%, ${layer.color}10 0%, transparent 70%)`,
                  }}
                />

                {/* Icon */}
                <motion.div
                  className="relative mb-4"
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${layer.color}15` }}
                  >
                    <layer.icon
                      className="w-6 h-6"
                      style={{ color: layer.color }}
                    />
                  </div>
                  <motion.div
                    className="absolute inset-0 rounded-2xl"
                    style={{ boxShadow: `0 0 30px ${layer.color}40` }}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>

                {/* Content */}
                <h3 className="text-base sm:text-lg font-semibold text-white mb-1.5 group-hover:text-cyan-400 transition-colors">
                  {layer.name}
                </h3>
                <p className="text-white/50 text-xs sm:text-sm leading-relaxed">
                  {layer.description}
                </p>

                {/* Layer number */}
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 text-2xl sm:text-3xl font-bold text-white/5 terminal-text">
                  0{layer.id}
                </div>

                {/* Bottom gradient line */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-px"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${layer.color}, transparent)`,
                  }}
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: layer.delay + 0.3, duration: 0.8 }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1 }}
          className="text-center mt-8 sm:mt-12"
        >
          <p className="text-white/40 text-sm terminal-text mb-4">
            Think you can break through?
          </p>
          <motion.button
            className="px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl gradient-border bg-transparent text-white text-sm sm:text-base font-medium hover:bg-white/5 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View Technical Documentation →
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
