import { useState } from 'react';
import { Shield, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { API_URL } from '../../utils/constants';

type ButtonState = 'idle' | 'verifying' | 'success' | 'error';

export function VerifyButton() {
  const [state, setState] = useState<ButtonState>('idle');
  const [lastResult, setLastResult] = useState<string | null>(null);

  const handleVerify = async () => {
    if (state === 'verifying') return;
    
    setState('verifying');
    setLastResult(null);
    
    try {
      const response = await fetch(`${API_URL}/api/control/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payload: `Live Verification Test ${new Date().toISOString()}`
        }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setState('success');
        setLastResult('Attack blocked!');
      } else {
        setState('error');
        setLastResult(data.message || 'Verification failed');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setState('error');
      setLastResult('Connection error');
    } finally {
      // Reset to idle after showing result
      setTimeout(() => {
        setState('idle');
        setLastResult(null);
      }, 3000);
    }
  };

  const getButtonStyles = () => {
    switch (state) {
      case 'verifying':
        return 'bg-cyan/20 text-cyan border-cyan/50 cursor-wait';
      case 'success':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50';
      case 'error':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      default:
        return 'bg-transparent text-cyan hover:bg-cyan/10 hover:border-cyan/60 hover:shadow-[0_0_10px_rgba(34,211,238,0.3)]';
    }
  };

  const getIcon = () => {
    switch (state) {
      case 'verifying':
        return <Loader2 className="w-3 h-3 md:w-4 md:h-4 animate-spin" />;
      case 'success':
        return <CheckCircle className="w-3 h-3 md:w-4 md:h-4" />;
      case 'error':
        return <XCircle className="w-3 h-3 md:w-4 md:h-4" />;
      default:
        return <Shield className="w-3 h-3 md:w-4 md:h-4" />;
    }
  };

  const getText = () => {
    switch (state) {
      case 'verifying':
        return 'TESTING...';
      case 'success':
        return 'BLOCKED ✓';
      case 'error':
        return 'ERROR';
      default:
        return 'TEST DEFENSE';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleVerify}
        disabled={state === 'verifying'}
        className={`
          relative px-2 md:px-4 py-1 md:py-1.5
          font-mono text-[10px] md:text-xs font-bold tracking-wider
          border rounded
          transition-all duration-300
          ${getButtonStyles()}
        `}
      >
        <div className="flex items-center gap-1.5 md:gap-2">
          {getIcon()}
          <span className="hidden sm:inline">{getText()}</span>
          <span className="sm:hidden">{state === 'idle' ? 'TEST' : getText()}</span>
        </div>
      </button>
      
      {/* Tooltip with result */}
      {lastResult && state !== 'idle' && (
        <div className={`
          absolute top-full left-1/2 -translate-x-1/2 mt-2
          px-2 py-1 rounded text-[10px] md:text-xs font-mono whitespace-nowrap
          ${state === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}
          animate-fade-in
        `}>
          {lastResult}
        </div>
      )}
    </div>
  );
}
