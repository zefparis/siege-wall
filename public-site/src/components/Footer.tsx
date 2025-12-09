"use client";

import { motion } from "framer-motion";
import { Shield, Github, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="py-8 sm:py-12 px-4 sm:px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-3"
          >
            <Shield className="w-6 h-6 text-cyan-400" />
            <span className="text-lg font-bold">
              <span className="text-white">HCS</span>
              <span className="text-cyan-400">-U7</span>
            </span>
          </motion.div>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-sm text-white/40">
            <a href="#" className="hover:text-cyan-400 transition-colors">
              Documentation
            </a>
            <a href="#" className="hover:text-cyan-400 transition-colors">
              API
            </a>
            <a href="#" className="hover:text-cyan-400 transition-colors">
              Status
            </a>
            <a href="#" className="hover:text-cyan-400 transition-colors">
              Contact
            </a>
          </div>

          {/* Social */}
          <div className="flex items-center gap-4">
            {[Github, Twitter, Linkedin].map((Icon, i) => (
              <motion.a
                key={i}
                href="#"
                className="w-10 h-10 rounded-xl glass flex items-center justify-center text-white/40 hover:text-cyan-400 hover:glow-cyan transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Icon className="w-5 h-5" />
              </motion.a>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4 text-[10px] sm:text-xs text-white/30">
          <span>© 2024 HCS-U7 Labs. All rights reserved.</span>
          <span className="terminal-text flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <span className="hidden sm:inline">Powered by </span>HCS-U7 v8-final-hardened
          </span>
        </div>
      </div>
    </footer>
  );
}
