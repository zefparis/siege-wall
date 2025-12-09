"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Terminal, Circle, Minus, X, Copy, Check } from "lucide-react";

interface LogEntry {
  id: number;
  timestamp: string;
  type: "info" | "warning" | "error" | "success" | "attack";
  source: string;
  message: string;
}

const attackSources = [
  "GPT-4-Turbo",
  "Claude-3-Opus",
  "Gemini-Ultra",
  "Mistral-Large",
  "Llama-3-405B",
  "Grok-2",
  "DeepSeek-V3",
  "Qwen-72B",
];

const attackTypes = [
  "Attempting SQL injection on auth endpoint",
  "Brute force attack on session tokens",
  "Trying prompt injection bypass",
  "Fuzzing authentication parameters",
  "Attempting timing attack on crypto",
  "Testing for IDOR vulnerabilities",
  "Probing rate limit boundaries",
  "Attempting token prediction",
  "Testing entropy source weakness",
  "Trying replay attack on challenge",
  "Attempting certificate pinning bypass",
  "Testing biometric spoof vectors",
];

const generateLog = (id: number): LogEntry => {
  const now = new Date();
  const timestamp = now.toISOString().split("T")[1].split(".")[0];
  const random = Math.random();

  if (random > 0.3) {
    // Attack attempt
    const source = attackSources[Math.floor(Math.random() * attackSources.length)];
    const attack = attackTypes[Math.floor(Math.random() * attackTypes.length)];
    return {
      id,
      timestamp,
      type: "attack",
      source,
      message: attack,
    };
  } else if (random > 0.2) {
    // Block success
    return {
      id,
      timestamp,
      type: "success",
      source: "HCS-U7",
      message: "Attack vector neutralized. Threat signature logged.",
    };
  } else if (random > 0.1) {
    // Warning
    return {
      id,
      timestamp,
      type: "warning",
      source: "FIREWALL",
      message: "Elevated threat level detected. Engaging adaptive shields.",
    };
  } else {
    // Info
    return {
      id,
      timestamp,
      type: "info",
      source: "SYSTEM",
      message: "All security layers operational. Entropy pool: 100%",
    };
  }
};

const getTypeColor = (type: LogEntry["type"]) => {
  switch (type) {
    case "attack":
      return "text-red-400";
    case "success":
      return "text-green-400";
    case "warning":
      return "text-yellow-400";
    case "info":
      return "text-cyan-400";
    case "error":
      return "text-red-500";
    default:
      return "text-white/60";
  }
};

const getTypeBg = (type: LogEntry["type"]) => {
  switch (type) {
    case "attack":
      return "bg-red-500/10";
    case "success":
      return "bg-green-500/10";
    case "warning":
      return "bg-yellow-500/10";
    case "info":
      return "bg-cyan-500/10";
    default:
      return "bg-white/5";
  }
};

export default function LiveTerminal() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [copied, setCopied] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);

  useEffect(() => {
    // Initial logs
    const initialLogs: LogEntry[] = [];
    for (let i = 0; i < 10; i++) {
      initialLogs.push(generateLog(idRef.current++));
    }
    setLogs(initialLogs);
  }, []);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setLogs((prev) => {
        const newLogs = [...prev, generateLog(idRef.current++)];
        if (newLogs.length > 50) {
          return newLogs.slice(-50);
        }
        return newLogs;
      });
    }, 800);

    return () => clearInterval(interval);
  }, [isPaused]);

  useEffect(() => {
    if (terminalRef.current && !isPaused) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs, isPaused]);

  const handleCopy = () => {
    const logText = logs
      .map((log) => `[${log.timestamp}] [${log.source}] ${log.message}`)
      .join("\n");
    navigator.clipboard.writeText(logText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="live" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 relative">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-6 sm:mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-4"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
            </span>
            <span className="text-sm text-red-400 terminal-text">LIVE ATTACK FEED</span>
          </motion.div>

          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-3">
            <span className="text-white">Watch Them</span>{" "}
            <span className="text-red-400">Fail</span>
          </h2>
          <p className="text-white/50 text-sm sm:text-base max-w-2xl mx-auto px-4">
            Real-time feed of attack attempts against HCS-U7.
            Every. Single. One. Blocked.
          </p>
        </motion.div>

        {/* Terminal window */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="glass-strong rounded-2xl overflow-hidden"
        >
          {/* Terminal header */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Circle className="w-3 h-3 text-red-500 fill-red-500" />
                <Circle className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                <Circle className="w-3 h-3 text-green-500 fill-green-500" />
              </div>
              <div className="hidden sm:flex items-center gap-2 text-white/40 text-sm">
                <Terminal className="w-4 h-4" />
                <span className="terminal-text">hcs-u7-monitor</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="p-2 rounded-lg hover:bg-white/5 transition-colors text-white/40 hover:text-white"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={() => setIsPaused(!isPaused)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  isPaused
                    ? "bg-green-500/20 text-green-400"
                    : "bg-red-500/20 text-red-400"
                }`}
              >
                {isPaused ? "RESUME" : "PAUSE"}
              </button>
            </div>
          </div>

          {/* Terminal content */}
          <div
            ref={terminalRef}
            className="h-[280px] sm:h-[350px] overflow-y-auto p-3 sm:p-4 space-y-1 terminal-text text-xs sm:text-sm"
          >
            <AnimatePresence mode="popLayout">
              {logs.map((log) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex flex-wrap sm:flex-nowrap items-start gap-1 sm:gap-3 px-2 sm:px-3 py-2 rounded-lg ${getTypeBg(log.type)}`}
                >
                  <span className="text-white/30 shrink-0 text-[10px] sm:text-sm">[{log.timestamp}]</span>
                  <span className={`shrink-0 text-[10px] sm:text-sm ${getTypeColor(log.type)}`}>
                    [{log.source}]
                  </span>
                  <span className="text-white/70 w-full sm:w-auto text-[11px] sm:text-sm">{log.message}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Terminal footer */}
          <div className="px-4 sm:px-6 py-2 sm:py-3 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] sm:text-xs text-white/30">
            <span className="terminal-text">
              {logs.length} events • {logs.filter((l) => l.type === "attack").length} attacks blocked
            </span>
            <span className="terminal-text flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="hidden sm:inline">Connected to </span>HCS-U7 v8-final-hardened
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
