import { motion } from 'framer-motion';
import { Shield, AlertTriangle } from 'lucide-react';
import { useSOS } from '@/contexts/SOSContext';

export const SOSButton = () => {
  const { state, triggerSOS } = useSOS();
  const isReady = state === 'ready';

  return (
    <div className="flex flex-col items-center gap-6">
      <motion.button
        onClick={triggerSOS}
        disabled={!isReady}
        className={`
          relative w-48 h-48 rounded-full flex items-center justify-center
          transition-all duration-300 focus:outline-none
          ${isReady 
            ? 'bg-emergency hover:scale-105 active:scale-95 emergency-glow cursor-pointer' 
            : 'bg-muted cursor-not-allowed opacity-50'
          }
        `}
        whileHover={isReady ? { scale: 1.05 } : {}}
        whileTap={isReady ? { scale: 0.95 } : {}}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="absolute inset-0 rounded-full bg-emergency/20 animate-ping" style={{ animationDuration: '2s' }} />
        <div className="flex flex-col items-center gap-2">
          <Shield className="w-16 h-16 text-emergency-foreground" strokeWidth={2} />
          <span className="text-emergency-foreground font-bold text-xl tracking-wide">
            SOS
          </span>
        </div>
      </motion.button>

      <div className="flex items-center gap-2 text-muted-foreground">
        <AlertTriangle className="w-4 h-4" />
        <span className="text-sm">Hold or tap to activate emergency mode</span>
      </div>

      <p className="text-xs text-muted-foreground/60 text-center max-w-xs">
        This will notify your trusted contacts and nearby volunteers with your location
      </p>
    </div>
  );
};
