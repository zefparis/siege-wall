import { useState } from 'react';
import { API_URL } from '../../utils/constants';

export function VerifyButton() {
  const [verifying, setVerifying] = useState(false);

  const handleVerify = async () => {
    if (verifying) return;
    
    setVerifying(true);
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
      
      if (!response.ok) {
        throw new Error('Verification failed');
      }
      
      // Verification sent successfully
    } catch (error) {
      console.error('Verification error:', error);
    } finally {
      // Small cooldown to prevent spam
      setTimeout(() => setVerifying(false), 2000);
    }
  };

  return (
    <button
      onClick={handleVerify}
      disabled={verifying}
      className={`
        relative px-4 py-1.5 ml-4
        font-mono text-xs font-bold tracking-wider
        border border-cyan/30 rounded
        transition-all duration-300
        ${verifying 
          ? 'bg-cyan/20 text-cyan cursor-wait' 
          : 'bg-transparent text-cyan hover:bg-cyan/10 hover:border-cyan/60 hover:shadow-[0_0_10px_rgba(34,211,238,0.3)]'
        }
      `}
    >
      <div className="flex items-center gap-2">
        {verifying ? (
          <>
            <div className="w-2 h-2 rounded-full bg-cyan animate-ping" />
            <span>VERIFYING...</span>
          </>
        ) : (
          <>
            <div className="w-2 h-2 rounded-full bg-cyan/50" />
            <span>TEST DEFENSE</span>
          </>
        )}
      </div>
    </button>
  );
}
