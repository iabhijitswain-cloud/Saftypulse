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
          relative w-64 h-64 rounded-full flex items-center justify-center
          transition-all duration-300 focus:outline-none overflow-hidden
          ${isReady
            ? 'cursor-pointer'
            : 'cursor-not-allowed opacity-50'
          }
        `}
        whileHover={isReady ? { scale: 1.05 } : {}}
        whileTap={isReady ? { scale: 0.95 } : {}}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Glow effect layer */}
        <div className="absolute inset-0 rounded-full bg-[#E5252A]/20 blur-3xl animate-pulse"></div>
        {/* Border / Outer glow */}
        <div className="absolute inset-0 rounded-full border border-white/20 bg-gradient-to-br from-[#E5252A]/90 to-[#b2181d]/100 shadow-[0_0_80px_rgba(229,37,42,0.4)]"></div>
        {/* Inner glass highlight */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/20 to-transparent opacity-50"></div>

        <div className="relative flex flex-col items-center justify-center mt-2">
          {/* Small shield icon with 'SOS' text */}
          <div className="flex flex-col items-center justify-center relative mb-4">
            <Shield className="w-12 h-14 text-white fill-white" strokeWidth={0} />
            <span className="absolute top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#E5252A] text-[9px] font-bold tracking-widest mt-[-2px]">
              SOS
            </span>
          </div>
          <span className="text-white font-light text-5xl tracking-[0.1em] border-b-2 border-white/40 pb-1 px-1">
            SOS
          </span>
        </div>
      </motion.button>

      <div className="flex items-center justify-center gap-2 mt-12 mb-2 text-[#E5252A] font-medium text-sm w-full">
        <AlertTriangle className="w-4 h-4 fill-[#E5252A] text-[#111]" />
        <span>Hold or tap to activate emergency mode</span>
      </div>
    </div>
  );
};
