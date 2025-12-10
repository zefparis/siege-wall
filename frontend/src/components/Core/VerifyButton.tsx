import { useState } from 'react';
import { Terminal } from 'lucide-react';
import { HackTerminal } from '../Terminal/HackTerminal';

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
          bg-transparent text-cyan border border-cyan/30 rounded
          hover:bg-cyan/10 hover:border-cyan/60 hover:shadow-[0_0_10px_rgba(0,255,209,0.3)]
          transition-all duration-300
        "
      >
        <Terminal className="w-3 h-3 lg:w-4 lg:h-4" />
        <span className="hidden sm:inline">TEST DEFENSE</span>
        <span className="sm:hidden">TEST</span>
      </button>

      <HackTerminal 
        isOpen={isTerminalOpen} 
        onClose={() => setIsTerminalOpen(false)} 
      />
    </>
  );
}
