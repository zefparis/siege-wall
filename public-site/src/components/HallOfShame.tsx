"use client";

import { motion } from "framer-motion";
import { Skull, TrendingDown, DollarSign, Flame, Crown, Medal, Award } from "lucide-react";
import { useState, useEffect } from "react";

interface Attacker {
  id: number;
  name: string;
  avatar: string;
  attempts: number;
  moneyBurned: number;
  rank: number;
  status: "defeated" | "trying" | "rage_quit";
  lastAttempt: string;
  color: string;
}

const attackers: Attacker[] = [
  {
    id: 1,
    name: "GPT-4 Turbo",
    avatar: "🤖",
    attempts: 847293,
    moneyBurned: 127849,
    rank: 1,
    status: "defeated",
    lastAttempt: "2 min ago",
    color: "#10a37f",
  },
  {
    id: 2,
    name: "Claude 3 Opus",
    avatar: "🎭",
    attempts: 623847,
    moneyBurned: 89234,
    rank: 2,
    status: "trying",
    lastAttempt: "Just now",
    color: "#d97706",
  },
  {
    id: 3,
    name: "Gemini Ultra",
    avatar: "💎",
    attempts: 512983,
    moneyBurned: 76234,
    rank: 3,
    status: "defeated",
    lastAttempt: "5 min ago",
    color: "#4285f4",
  },
  {
    id: 4,
    name: "Mistral Large",
    avatar: "🌀",
    attempts: 298472,
    moneyBurned: 34892,
    rank: 4,
    status: "rage_quit",
    lastAttempt: "1 hour ago",
    color: "#ff7000",
  },
  {
    id: 5,
    name: "Llama 3 405B",
    avatar: "🦙",
    attempts: 187234,
    moneyBurned: 21893,
    rank: 5,
    status: "defeated",
    lastAttempt: "15 min ago",
    color: "#0668e1",
  },
  {
    id: 6,
    name: "Grok-2",
    avatar: "👁️",
    attempts: 156789,
    moneyBurned: 18234,
    rank: 6,
    status: "trying",
    lastAttempt: "Just now",
    color: "#1d9bf0",
  },
  {
    id: 7,
    name: "Qwen-72B",
    avatar: "🐉",
    attempts: 98234,
    moneyBurned: 11234,
    rank: 7,
    status: "defeated",
    lastAttempt: "30 min ago",
    color: "#7c3aed",
  },
  {
    id: 8,
    name: "DeepSeek V3",
    avatar: "🔮",
    attempts: 76543,
    moneyBurned: 8923,
    rank: 8,
    status: "defeated",
    lastAttempt: "45 min ago",
    color: "#06b6d4",
  },
];

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Crown className="w-5 h-5 text-yellow-400" />;
    case 2:
      return <Medal className="w-5 h-5 text-gray-300" />;
    case 3:
      return <Award className="w-5 h-5 text-amber-600" />;
    default:
      return <span className="text-white/40 font-mono text-sm">#{rank}</span>;
  }
};

const getStatusBadge = (status: Attacker["status"]) => {
  switch (status) {
    case "defeated":
      return (
        <span className="px-2 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-medium flex items-center gap-1">
          <Skull className="w-3 h-3" /> DEFEATED
        </span>
      );
    case "trying":
      return (
        <span className="px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-xs font-medium flex items-center gap-1 animate-pulse">
          <Flame className="w-3 h-3" /> TRYING
        </span>
      );
    case "rage_quit":
      return (
        <span className="px-2 py-1 rounded-full bg-violet-500/20 text-violet-400 text-xs font-medium">
          RAGE QUIT
        </span>
      );
  }
};

export default function HallOfShame() {
  const [liveAttackers, setLiveAttackers] = useState(attackers);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveAttackers((prev) =>
        prev.map((attacker) => ({
          ...attacker,
          attempts: attacker.status === "trying" 
            ? attacker.attempts + Math.floor(Math.random() * 10) + 1
            : attacker.attempts,
          moneyBurned: attacker.status === "trying"
            ? attacker.moneyBurned + Math.floor(Math.random() * 5)
            : attacker.moneyBurned,
        }))
      );
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="shame" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 relative">
      {/* Background effects */}
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-red-950/5 to-transparent" />
      
      <div className="max-w-6xl mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 sm:mb-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-4"
          >
            <Skull className="w-4 h-4 text-red-400" />
            <span className="text-sm text-red-400 terminal-text">HALL OF SHAME</span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4">
            <span className="text-white">They Tried.</span>{" "}
            <span className="text-red-400">They Failed.</span>
          </h2>
          <p className="text-white/50 text-base sm:text-lg max-w-2xl mx-auto px-4">
            The world&apos;s most advanced AI systems have attempted to breach HCS-U7.
            Here&apos;s their permanent record of failure.
          </p>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-3 gap-2 sm:gap-4 mb-6 sm:mb-8"
        >
          {[
            { label: "Total Attempts", value: liveAttackers.reduce((a, b) => a + b.attempts, 0).toLocaleString(), icon: TrendingDown, color: "text-cyan-400" },
            { label: "Money Burned", value: `$${(liveAttackers.reduce((a, b) => a + b.moneyBurned, 0) / 1000).toFixed(1)}K`, icon: DollarSign, color: "text-green-400" },
            { label: "Success Rate", value: "0.000%", icon: Skull, color: "text-red-400" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="glass rounded-xl sm:rounded-2xl p-3 sm:p-5 text-center"
            >
              <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.color} mx-auto mb-1 sm:mb-2`} />
              <div className={`text-lg sm:text-xl md:text-2xl font-bold ${stat.color} terminal-text`}>
                {stat.value}
              </div>
              <div className="text-[10px] sm:text-xs text-white/40 mt-0.5">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Leaderboard */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="glass-strong rounded-2xl overflow-hidden"
        >
          {/* Table header - hidden on mobile */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/5 text-sm text-white/40 uppercase tracking-wider">
            <div className="col-span-1">Rank</div>
            <div className="col-span-4">Attacker</div>
            <div className="col-span-2 text-right">Attempts</div>
            <div className="col-span-2 text-right">$ Burned</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-1 text-right">Last</div>
          </div>

          {/* Table rows */}
          {liveAttackers.map((attacker, i) => (
            <motion.div
              key={attacker.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * i }}
              className="flex flex-col md:grid md:grid-cols-12 gap-1.5 md:gap-3 px-3 sm:px-5 py-3 border-b border-white/5 hover:bg-white/5 transition-colors group"
            >
              <div className="flex items-center gap-3 md:col-span-1 md:contents">
                <div className="md:col-span-1 flex items-center">
                  {getRankIcon(attacker.rank)}
                </div>
              <div className="md:col-span-4 flex items-center gap-3 flex-1">
                <div
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center text-base sm:text-xl"
                  style={{ backgroundColor: `${attacker.color}20` }}
                >
                  {attacker.avatar}
                </div>
                <div>
                  <div className="font-medium text-white group-hover:text-cyan-400 transition-colors">
                    {attacker.name}
                  </div>
                  <div className="text-xs text-white/30">AI Model</div>
                </div>
              </div>
              </div>
              <div className="flex items-center justify-between md:contents mt-2 md:mt-0 pl-8 md:pl-0">
                <div className="md:col-span-2 flex items-center md:justify-end">
                  <span className="terminal-text text-white/80 text-sm md:text-base">
                    <span className="md:hidden text-white/40 mr-1">Attempts:</span>
                    {attacker.attempts.toLocaleString()}
                  </span>
                </div>
                <div className="md:col-span-2 flex items-center md:justify-end">
                  <span className="terminal-text text-green-400 text-sm md:text-base">
                    ${attacker.moneyBurned.toLocaleString()}
                  </span>
                </div>
                <div className="md:col-span-2 flex items-center">
                  {getStatusBadge(attacker.status)}
                </div>
                <div className="hidden md:flex md:col-span-1 items-center justify-end text-sm text-white/40">
                  {attacker.lastAttempt}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1 }}
          className="text-center text-white/30 text-xs sm:text-sm mt-4 sm:mt-6 terminal-text"
        >
          * Data updated in real-time. All attempts are logged and permanently recorded.
        </motion.p>
      </div>
    </section>
  );
}
