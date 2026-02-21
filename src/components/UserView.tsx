import { motion, AnimatePresence } from 'framer-motion';
import { useSOS } from '@/contexts/SOSContext';
import { SOSButton } from './SOSButton';
import { EmergencyDashboard } from './EmergencyDashboard';
import { CountdownTimer } from './CountdownTimer';

export const UserView = () => {
  const { state } = useSOS();
  const isReady = state === 'ready';
  const isCountdown = state === 'countdown';
  const isResolved = state === 'resolved' || state === 'cancelled' || state === 'duress';

  return (
    <div className="flex flex-col h-full overflow-auto pb-24">
      <AnimatePresence mode="wait">
        {isReady && (
          <motion.div
            key="ready"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-start pt-6 px-6"
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-2 bg-[#022A1E] text-[#00E599] px-4 py-1.5 rounded-full mb-8 border border-[#00E599]/20"
            >
              <div className="w-2 h-2 rounded-full bg-[#00E599] animate-pulse"></div>
              <span className="text-sm font-semibold tracking-wide">Live Monitoring Active</span>
            </motion.div>

            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-12"
            >
              <h2 className="text-[2rem] font-medium text-white mb-2 tracking-tight">You're Protected</h2>
              <p className="text-[#888] text-[1.05rem]">
                Tap the button below in case of<br />emergency
              </p>
            </motion.div>

            <div className="flex-1 flex flex-col items-center justify-center w-full mt-[-20px]">
              <SOSButton />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="w-full max-w-[320px] bg-white/[0.03] border border-white/10 rounded-2xl p-4 mt-8 mb-4"
            >
              <p className="text-[#888] text-sm text-center italic leading-relaxed">
                This will notify your 5 trusted contacts and share your live GPS location with local emergency services immediately.
              </p>
            </motion.div>
          </motion.div>
        )}

        {(state === 'triggered' || state === 'recording') && (
          <motion.div
            key="recording"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 p-4 overflow-auto"
          >
            <div className="mb-6">
              <h2 className="text-xl font-bold text-emergency mb-1">Emergency Activated</h2>
              <p className="text-sm text-muted-foreground">
                Capturing data and notifying contacts...
              </p>
            </div>
            <EmergencyDashboard />
          </motion.div>
        )}

        {isCountdown && (
          <motion.div
            key="countdown"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col p-4 overflow-auto"
          >
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-warning mb-1">Safety Countdown</h2>
              <p className="text-sm text-muted-foreground">
                Police will be notified if timer reaches zero
              </p>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <CountdownTimer />
            </div>
            <div className="mt-4">
              <EmergencyDashboard />
            </div>
          </motion.div>
        )}

        {isResolved && (
          <motion.div
            key="resolved"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex items-center justify-center p-6"
          >
            <CountdownTimer />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
