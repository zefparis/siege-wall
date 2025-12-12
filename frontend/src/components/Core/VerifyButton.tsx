import { useState } from 'react';
import { Terminal } from 'lucide-react';
import { HackerTerminal } from '../Terminal/HackerTerminal';

export function VerifyButton() {
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsTerminalOpen(true)}
        className="
          flex items-center gap-1.5 lg:gap-2
          px-2 lg:px-4 py-1 lg:py-1.5
          font-mono text-[10px] lg:text-xs font-bold tracking-wider
          bg-linear-to-r from-red-500/20 to-orange-500/20 
          text-red-400 border border-red-500/30 rounded
          hover:from-red-500/30 hover:to-orange-500/30 
          hover:border-red-500/60 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)]
          transition-all duration-300
          animate-pulse
        "
      >
        <Terminal className="w-3 h-3 lg:w-4 lg:h-4" />
        <span className="hidden sm:inline">TRY TO HACK</span>
        <span className="sm:hidden">HACK</span>
      </button>

      <HackerTerminal 
        isOpen={isTerminalOpen} 
        onClose={() => setIsTerminalOpen(false)} 
      />
    </>
  );
}
