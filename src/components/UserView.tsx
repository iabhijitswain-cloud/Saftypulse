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
            className="flex-1 flex flex-col items-center justify-center p-6"
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-center mb-8"
            >
              <h2 className="text-2xl font-bold text-foreground mb-2">You're Protected</h2>
              <p className="text-muted-foreground">
                Tap the button below in case of emergency
              </p>
            </motion.div>
            <SOSButton />
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
