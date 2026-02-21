import { motion, AnimatePresence } from 'framer-motion';
import { useSOS } from '@/contexts/SOSContext';
import { SOSButton } from './SOSButton';
import { EmergencyDashboard } from './EmergencyDashboard';
import { CountdownTimer } from './CountdownTimer';
import { Fingerprint, Lock, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const UserView = () => {
  const { state, triggerSOS } = useSOS();
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
              className="text-center mb-10 w-full"
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

            <div className="mb-12">
              <SOSButton />
            </div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="w-full max-w-sm mt-auto"
            >
              <Card className="bg-card/40 border-border/50 backdrop-blur-sm overflow-hidden group cursor-pointer hover:bg-card/60 transition-colors">
                <CardContent className="p-0">
                  <Button
                    variant="ghost"
                    className="w-full h-auto p-4 flex items-center justify-between hover:bg-transparent"
                    onClick={() => triggerSOS()}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <Fingerprint className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-1.5">
                          <Lock className="w-3 h-3 text-muted-foreground" />
                          <span className="font-semibold text-foreground">Sensitive Safety Logs</span>
                        </div>
                        <span className="text-xs text-muted-foreground block font-normal">Face ID / Fingerprint required</span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </Button>
                </CardContent>
              </Card>
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
