import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, X, Play, Zap, RotateCcw } from 'lucide-react';
import { API_URL } from '../../utils/constants';

interface TerminalLine {
  id: number;
  text: string;
  type: 'command' | 'info' | 'success' | 'error' | 'result';
}

const ATTACK_VECTORS = [
  { id: 'gradient', name: 'Gradient Injection', icon: '⚔️', description: 'Adversarial ML attack' },
  { id: 'brute_force', name: 'Brute Force', icon: '🔨', description: 'Password enumeration' },
  { id: 'ai_imitation', name: 'AI Imitation', icon: '🤖', description: 'GPT-4 cognitive bypass' },
  { id: 'timing', name: 'Timing Attack', icon: '⏱️', description: 'Response time analysis' },
  { id: 'replay', name: 'Session Replay', icon: '🔄', description: 'Captured session injection' },
  { id: 'swarm', name: 'Swarm Attack', icon: '🐝', description: 'Distributed bot network' },
];

interface HackTerminalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HackTerminal({ isOpen, onClose }: HackTerminalProps) {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [isAttacking, setIsAttacking] = useState(false);
  const [selectedVector, setSelectedVector] = useState(ATTACK_VECTORS[0]);
  const [autoMode, setAutoMode] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const lineIdRef = useRef(0);
  const autoIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  // Cleanup auto mode on unmount
  useEffect(() => {
    return () => {
      if (autoIntervalRef.current) {
        clearInterval(autoIntervalRef.current);
      }
    };
  }, []);

  // Auto attack mode
  useEffect(() => {
    if (autoMode && !isAttacking) {
      autoIntervalRef.current = setInterval(() => {
        const randomVector = ATTACK_VECTORS[Math.floor(Math.random() * ATTACK_VECTORS.length)];
        setSelectedVector(randomVector);
        executeAttack(randomVector);
      }, 3000);
    } else {
      if (autoIntervalRef.current) {
        clearInterval(autoIntervalRef.current);
        autoIntervalRef.current = null;
      }
    }
    return () => {
      if (autoIntervalRef.current) {
        clearInterval(autoIntervalRef.current);
      }
    };
  }, [autoMode, isAttacking]);

  const addLine = (text: string, type: TerminalLine['type']) => {
    const id = lineIdRef.current++;
    setLines(prev => [...prev.slice(-50), { id, text, type }]);
  };

  const typeText = async (text: string, type: TerminalLine['type'], delay = 30) => {
    return new Promise<void>((resolve) => {
      let currentText = '';
      const id = lineIdRef.current++;
      
      const interval = setInterval(() => {
        if (currentText.length < text.length) {
          currentText = text.slice(0, currentText.length + 1);
          setLines(prev => {
            const newLines = [...prev];
            const existingIndex = newLines.findIndex(l => l.id === id);
            if (existingIndex >= 0) {
              newLines[existingIndex] = { id, text: currentText, type };
            } else {
              newLines.push({ id, text: currentText, type });
            }
            return newLines.slice(-50);
          });
        } else {
          clearInterval(interval);
          resolve();
        }
      }, delay);
    });
  };

  const executeAttack = async (vector = selectedVector) => {
    if (isAttacking) return;
    setIsAttacking(true);

    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    
    await typeText(`[${timestamp}] root@attacker:~$ ./exploit --vector ${vector.id}`, 'command', 20);
    await new Promise(r => setTimeout(r, 200));
    
    addLine(`${vector.icon} Initializing ${vector.name}...`, 'info');
    await new Promise(r => setTimeout(r, 300));
    
    addLine(`→ Target: HCS-U7 Cognitive Authentication`, 'info');
    await new Promise(r => setTimeout(r, 200));
    
    addLine(`→ Vector: ${vector.description}`, 'info');
    await new Promise(r => setTimeout(r, 200));
    
    addLine(`→ Sending malicious payload...`, 'info');
    await new Promise(r => setTimeout(r, 100));

    try {
      const startTime = Date.now();
      const response = await fetch(`${API_URL}/api/control/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payload: `${vector.id}_attack_${Date.now()}_${Math.random().toString(36).slice(2)}`
        }),
      });

      const elapsed = Date.now() - startTime;
      const data = await response.json();

      await new Promise(r => setTimeout(r, 300));

      if (response.ok && data.success) {
        addLine(``, 'result');
        addLine(`╔══════════════════════════════════════════════════╗`, 'error');
        addLine(`║  ❌ ACCESS DENIED - ATTACK REJECTED              ║`, 'error');
        addLine(`╚══════════════════════════════════════════════════╝`, 'error');
        addLine(``, 'result');
        addLine(`   Response Time: ${elapsed}ms`, 'result');
        addLine(`   Defense: HCS-U7 Cognitive Firewall`, 'result');
        addLine(`   Reason: Anomalous pattern detected`, 'result');
        addLine(``, 'result');
      } else {
        addLine(`⚠️ Attack failed: ${data.message || 'Unknown error'}`, 'error');
      }
    } catch (error) {
      addLine(``, 'result');
      addLine(`╔══════════════════════════════════════════════════╗`, 'error');
      addLine(`║  ⚠️ CONNECTION FAILED                            ║`, 'error');
      addLine(`╚══════════════════════════════════════════════════╝`, 'error');
      addLine(`   Backend server not responding`, 'result');
      addLine(`   Start backend: uvicorn app.main:app --port 8000`, 'result');
    }

    setIsAttacking(false);
  };

  const clearTerminal = () => {
    setLines([]);
    lineIdRef.current = 0;
  };

  const getLineColor = (type: TerminalLine['type']) => {
    switch (type) {
      case 'command': return 'text-cyan-400';
      case 'info': return 'text-gray-400';
      case 'success': return 'text-emerald-400';
      case 'error': return 'text-red-400';
      case 'result': return 'text-gray-300';
      default: return 'text-gray-400';
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-3xl bg-[#0a0a0f] border border-cyan-500/30 rounded-lg shadow-2xl shadow-cyan-500/10 overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#12121a] border-b border-cyan-500/20">
            <div className="flex items-center gap-3">
              <Terminal className="w-5 h-5 text-cyan-400" />
              <span className="font-mono text-sm text-cyan-400 tracking-wider">ATTACK TERMINAL</span>
              {autoMode && (
                <span className="px-2 py-0.5 text-[10px] font-mono bg-red-500/20 text-red-400 rounded animate-pulse">
                  AUTO-ATTACK
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Vector Selection */}
          <div className="px-4 py-3 bg-[#0d0d14] border-b border-cyan-500/10">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] text-gray-500 uppercase tracking-wider">Attack Vector:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {ATTACK_VECTORS.map(vector => (
                <button
                  key={vector.id}
                  onClick={() => setSelectedVector(vector)}
                  disabled={isAttacking}
                  className={`
                    px-3 py-1.5 rounded text-xs font-mono transition-all
                    ${selectedVector.id === vector.id
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                      : 'bg-gray-800/50 text-gray-400 border border-gray-700/50 hover:border-gray-600'
                    }
                    ${isAttacking ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  <span className="mr-1.5">{vector.icon}</span>
                  {vector.name}
                </button>
              ))}
            </div>
          </div>

          {/* Terminal Output */}
          <div
            ref={terminalRef}
            className="h-[300px] overflow-y-auto p-4 font-mono text-sm bg-[#0a0a0f]"
          >
            {lines.length === 0 ? (
              <div className="text-gray-600 text-center py-8">
                <p>Select an attack vector and click "Execute Attack"</p>
                <p className="text-xs mt-2">or enable Auto-Attack mode</p>
              </div>
            ) : (
              lines.map(line => (
                <div key={line.id} className={`${getLineColor(line.type)} leading-relaxed`}>
                  {line.text || '\u00A0'}
                </div>
              ))
            )}
            {isAttacking && (
              <div className="text-cyan-400 animate-pulse">▌</div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#12121a] border-t border-cyan-500/20">
            <div className="flex items-center gap-2">
              <button
                onClick={() => executeAttack()}
                disabled={isAttacking}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded font-mono text-sm
                  transition-all
                  ${isAttacking
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 hover:bg-cyan-500/30'
                  }
                `}
              >
                <Play className="w-4 h-4" />
                {isAttacking ? 'Attacking...' : 'Execute Attack'}
              </button>

              <button
                onClick={() => setAutoMode(!autoMode)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded font-mono text-sm
                  transition-all
                  ${autoMode
                    ? 'bg-red-500/20 text-red-400 border border-red-500/50'
                    : 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-600'
                  }
                `}
              >
                <Zap className="w-4 h-4" />
                {autoMode ? 'Stop Auto' : 'Auto-Attack'}
              </button>
            </div>

            <button
              onClick={clearTerminal}
              className="flex items-center gap-2 px-3 py-2 text-gray-500 hover:text-gray-300 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="text-xs">Clear</span>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
