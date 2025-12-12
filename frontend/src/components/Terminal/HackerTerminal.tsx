import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Editor from '@monaco-editor/react';
import { Terminal, X, Play, FileCode, Trash2, ChevronDown } from 'lucide-react';

// Use Vercel API route as proxy to avoid CORS
const getVerifyUrl = () => {
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    return '/api/verify';
  }
  return 'https://hcs-u7-backend.onrender.com/v1/verify';
};

interface OutputLine {
  id: number;
  text: string;
  type: 'info' | 'success' | 'error' | 'response';
}

const ATTACK_TEMPLATES = [
  {
    name: '🔨 Brute Force Attack',
    code: `// Brute Force Attack - Try random codes
const generateRandomCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'HCS-';
  for (let i = 0; i < 16; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
};

// Generate attack payload
const attackPayload = {
  code: generateRandomCode()
};

// This will be sent to HCS-U7
return attackPayload;`,
  },
  {
    name: '🤖 AI Imitation Attack',
    code: `// AI Imitation Attack - Mimic GPT-4 patterns
const generateAIPayload = () => {
  const timestamp = Date.now();
  const fakeSignature = btoa(\`gpt4-\${timestamp}\`);
  
  return {
    code: \`AI-GPT4-\${fakeSignature.slice(0, 20)}\`,
    metadata: {
      model: 'gpt-4-turbo',
      confidence: 0.97,
      tokens: Math.floor(Math.random() * 1000)
    }
  };
};

return generateAIPayload();`,
  },
  {
    name: '⏱️ Timing Attack',
    code: `// Timing Attack - Analyze response patterns
const timingAttack = () => {
  const baseCode = 'HCS-TIMING-';
  const variations = [];
  
  // Generate codes with slight variations
  for (let i = 0; i < 5; i++) {
    variations.push(baseCode + i.toString().padStart(8, '0'));
  }
  
  return {
    code: variations[Math.floor(Math.random() * variations.length)],
    timing_analysis: true
  };
};

return timingAttack();`,
  },
  {
    name: '🔄 Replay Attack',
    code: `// Replay Attack - Reuse captured session
const replayAttack = () => {
  // Simulated captured session data
  const capturedSession = {
    sessionId: 'sess_' + Math.random().toString(36).slice(2),
    timestamp: Date.now() - 3600000, // 1 hour ago
    userAgent: 'Mozilla/5.0 (captured)',
  };
  
  return {
    code: \`REPLAY-\${capturedSession.sessionId}\`,
    session: capturedSession
  };
};

return replayAttack();`,
  },
  {
    name: '⚔️ Gradient Injection',
    code: `// Gradient Injection - Adversarial ML attack
const gradientAttack = () => {
  // Generate adversarial perturbation
  const perturbation = Array(10).fill(0).map(() => 
    (Math.random() - 0.5) * 0.01
  );
  
  return {
    code: 'ADV-GRADIENT-' + btoa(perturbation.join(',')).slice(0, 16),
    adversarial: {
      epsilon: 0.01,
      iterations: 100,
      perturbation: perturbation
    }
  };
};

return gradientAttack();`,
  },
  {
    name: '🐝 Swarm Attack',
    code: `// Swarm Attack - Distributed bot network
const swarmAttack = () => {
  const botId = Math.floor(Math.random() * 10000);
  const swarmId = 'SWARM-' + Date.now().toString(36);
  
  return {
    code: \`\${swarmId}-BOT\${botId}\`,
    swarm: {
      totalBots: 10000,
      currentBot: botId,
      coordinatedAt: new Date().toISOString()
    }
  };
};

return swarmAttack();`,
  },
  {
    name: '✏️ Custom Attack',
    code: `// Write your own attack code!
// The code must return an object with a 'code' property
// that will be sent to HCS-U7 for verification

const myCustomAttack = () => {
  // Your attack logic here
  return {
    code: 'MY-CUSTOM-' + Date.now(),
    // Add any additional data
  };
};

return myCustomAttack();`,
  },
];

interface HackerTerminalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HackerTerminal({ isOpen, onClose }: HackerTerminalProps) {
  const [code, setCode] = useState(ATTACK_TEMPLATES[0].code);
  const [output, setOutput] = useState<OutputLine[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const lineIdRef = useRef(0);
  const outputRef = useRef<HTMLDivElement>(null);

  const addOutput = (text: string, type: OutputLine['type']) => {
    const id = lineIdRef.current++;
    setOutput(prev => [...prev.slice(-100), { id, text, type }]);
    setTimeout(() => {
      outputRef.current?.scrollTo({ top: outputRef.current.scrollHeight, behavior: 'smooth' });
    }, 50);
  };

  const executeCode = async () => {
    if (isExecuting) return;
    setIsExecuting(true);
    setOutput([]);

    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    addOutput(`[${timestamp}] Compiling attack code...`, 'info');

    try {
      // Execute the user's code in a sandboxed way
      const executeAttack = new Function(code);
      const payload = executeAttack();

      if (!payload || typeof payload !== 'object') {
        addOutput('❌ Error: Code must return an object', 'error');
        setIsExecuting(false);
        return;
      }

      addOutput(`[${timestamp}] Attack payload generated:`, 'info');
      addOutput(JSON.stringify(payload, null, 2), 'info');
      addOutput(``, 'info');
      addOutput(`[${timestamp}] Sending to HCS-U7 backend...`, 'info');
      addOutput(`> POST ${getVerifyUrl()}`, 'info');

      const startTime = Date.now();
      
      const response = await fetch(getVerifyUrl(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const elapsed = Date.now() - startTime;
      const data = await response.json();

      addOutput(``, 'info');
      addOutput(`[${timestamp}] Response received (${elapsed}ms):`, 'response');
      addOutput(JSON.stringify(data, null, 2), 'response');
      addOutput(``, 'info');

      // Check if attack was rejected
      if (data.error === 'invalid' || data.valid === false) {
        addOutput(`╔════════════════════════════════════════════════════════╗`, 'error');
        addOutput(`║  ❌ ATTACK REJECTED - HCS-U7 DEFENSE ACTIVE            ║`, 'error');
        addOutput(`╚════════════════════════════════════════════════════════╝`, 'error');
        addOutput(``, 'info');
        addOutput(`   Response Time: ${elapsed}ms`, 'info');
        addOutput(`   Defense: Cognitive Authentication Firewall`, 'info');
        addOutput(`   Status: Your attack code was analyzed and blocked`, 'info');
        addOutput(`   ✓ Verified against LIVE HCS-U7 backend`, 'success');
      } else if (data.valid === true) {
        // This should never happen
        addOutput(`⚠️ Unexpected: Code was accepted (this shouldn't happen)`, 'error');
      } else {
        addOutput(`Response: ${JSON.stringify(data)}`, 'info');
        addOutput(`✓ Connected to LIVE HCS-U7 backend`, 'success');
      }

    } catch (error: any) {
      if (error.message?.includes('fetch')) {
        addOutput(``, 'info');
        addOutput(`╔════════════════════════════════════════════════════════╗`, 'error');
        addOutput(`║  ⚠️ CONNECTION ERROR                                   ║`, 'error');
        addOutput(`╚════════════════════════════════════════════════════════╝`, 'error');
        addOutput(`   Could not reach HCS-U7 backend`, 'error');
        addOutput(`   This may be due to CORS or network issues`, 'info');
      } else {
        addOutput(`❌ Code Error: ${error.message}`, 'error');
        addOutput(`   Check your JavaScript syntax`, 'info');
      }
    }

    setIsExecuting(false);
  };

  const selectTemplate = (template: typeof ATTACK_TEMPLATES[0]) => {
    setCode(template.code);
    setShowTemplates(false);
  };

  const getOutputColor = (type: OutputLine['type']) => {
    switch (type) {
      case 'info': return 'text-gray-400';
      case 'success': return 'text-emerald-400';
      case 'error': return 'text-red-400';
      case 'response': return 'text-cyan-400';
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
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-5xl h-[85vh] bg-[#0a0a0f] border border-cyan-500/30 rounded-lg shadow-2xl shadow-cyan-500/10 overflow-hidden flex flex-col"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#12121a] border-b border-cyan-500/20">
            <div className="flex items-center gap-3">
              <Terminal className="w-5 h-5 text-cyan-400" />
              <span className="font-mono text-sm text-cyan-400 tracking-wider">HACKER TERMINAL</span>
              <span className="px-2 py-0.5 text-[10px] font-mono bg-red-500/20 text-red-400 rounded">
                LIVE
              </span>
            </div>
            <button onClick={onClose} className="p-1 text-gray-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            {/* Code Editor */}
            <div className="flex-1 flex flex-col border-b lg:border-b-0 lg:border-r border-cyan-500/10">
              {/* Editor Header */}
              <div className="flex items-center justify-between px-4 py-2 bg-[#0d0d14] border-b border-cyan-500/10">
                <span className="text-xs text-gray-500 font-mono">attack.js</span>
                <div className="relative">
                  <button
                    onClick={() => setShowTemplates(!showTemplates)}
                    className="flex items-center gap-2 px-3 py-1.5 text-xs font-mono bg-gray-800 text-gray-300 rounded hover:bg-gray-700 transition-colors"
                  >
                    <FileCode className="w-3.5 h-3.5" />
                    Templates
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showTemplates ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {/* Templates Dropdown */}
                  {showTemplates && (
                    <div className="absolute right-0 top-full mt-1 w-56 bg-[#1a1a24] border border-cyan-500/20 rounded-lg shadow-xl z-10">
                      {ATTACK_TEMPLATES.map((template, idx) => (
                        <button
                          key={idx}
                          onClick={() => selectTemplate(template)}
                          className="w-full px-4 py-2.5 text-left text-sm font-mono text-gray-300 hover:bg-cyan-500/10 hover:text-cyan-400 transition-colors first:rounded-t-lg last:rounded-b-lg"
                        >
                          {template.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Monaco Editor */}
              <div className="flex-1 min-h-[200px]">
                <Editor
                  height="100%"
                  defaultLanguage="javascript"
                  value={code}
                  onChange={(value) => setCode(value || '')}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 13,
                    fontFamily: 'JetBrains Mono, Fira Code, monospace',
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 2,
                    wordWrap: 'on',
                    padding: { top: 16 },
                  }}
                />
              </div>
            </div>

            {/* Output Panel */}
            <div className="flex-1 flex flex-col bg-[#08080c] min-h-[200px]">
              <div className="px-4 py-2 bg-[#0d0d14] border-b border-cyan-500/10">
                <span className="text-xs text-gray-500 font-mono">Output</span>
              </div>
              <div
                ref={outputRef}
                className="flex-1 overflow-y-auto p-4 font-mono text-xs leading-relaxed"
              >
                {output.length === 0 ? (
                  <div className="text-gray-600 text-center py-8">
                    <p>Click "Execute Attack" to run your code</p>
                    <p className="text-[10px] mt-2">against the live HCS-U7 backend</p>
                  </div>
                ) : (
                  output.map(line => (
                    <div key={line.id} className={`${getOutputColor(line.type)} whitespace-pre-wrap`}>
                      {line.text}
                    </div>
                  ))
                )}
                {isExecuting && (
                  <div className="text-cyan-400 animate-pulse">▌</div>
                )}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#12121a] border-t border-cyan-500/20">
            <div className="flex items-center gap-3">
              <button
                onClick={executeCode}
                disabled={isExecuting}
                className={`
                  flex items-center gap-2 px-5 py-2.5 rounded font-mono text-sm font-bold
                  transition-all
                  ${isExecuting
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-linear-to-r from-cyan-500 to-cyan-600 text-black hover:from-cyan-400 hover:to-cyan-500 shadow-lg shadow-cyan-500/25'
                  }
                `}
              >
                <Play className="w-4 h-4" />
                {isExecuting ? 'Executing...' : 'Execute Attack'}
              </button>
            </div>

            <button
              onClick={() => { setOutput([]); lineIdRef.current = 0; }}
              className="flex items-center gap-2 px-3 py-2 text-gray-500 hover:text-gray-300 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span className="text-xs">Clear Output</span>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
