import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, AlertTriangle } from 'lucide-react';
import { useSOS } from '@/contexts/SOSContext';
import { Button } from '@/components/ui/button';
import { PinNumpad } from '@/components/PinNumpad';
import { useToast } from '@/hooks/use-toast';

export const CountdownTimer = () => {
  const { state, countdownTime, cancelSOS, resetSOS } = useSOS();
  const { toast } = useToast();
  const [showPinInput, setShowPinInput] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const isActive = state === 'countdown';
  const isResolved = state === 'resolved';
  const isCancelled = state === 'cancelled';
  const isDuress = state === 'duress';

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePinSubmit = async (pin: string) => {
    setIsVerifying(true);
    const result = await cancelSOS(pin);
    setIsVerifying(false);

    if (result === 'success') {
      setShowPinInput(false);
      toast({
        title: 'Alert Cancelled',
        description: 'You have been marked as safe.',
      });
    } else if (result === 'duress') {
      // Show fake success, but actually continue in stealth mode
      setShowPinInput(false);
      toast({
        title: 'Alert Cancelled',
        description: 'You have been marked as safe.',
      });
    } else {
      // Trigger shake animation
      (window as any).triggerPinShake?.();
      toast({
        title: 'Incorrect PIN',
        description: 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  const progress = (countdownTime / 300) * 100;
  const circumference = 2 * Math.PI * 90;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  if (!isActive && !isResolved && !isCancelled && !isDuress) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center"
      >
        {isActive && (
          <>
            <div className="relative w-52 h-52 mb-6">
              {/* Background circle */}
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle
                  cx="104"
                  cy="104"
                  r="90"
                  fill="none"
                  stroke="hsl(var(--muted))"
                  strokeWidth="8"
                />
                <motion.circle
                  cx="104"
                  cy="104"
                  r="90"
                  fill="none"
                  stroke={countdownTime < 60 ? "hsl(var(--emergency))" : "hsl(var(--warning))"}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  initial={{ strokeDashoffset: 0 }}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 0.5 }}
                />
              </svg>
              
              {/* Timer content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Shield className={`w-8 h-8 mb-2 ${countdownTime < 60 ? 'text-emergency' : 'text-warning'}`} />
                <span className={`text-4xl font-bold font-mono countdown-pulse ${
                  countdownTime < 60 ? 'text-emergency' : 'text-warning'
                }`}>
                  {formatTime(countdownTime)}
                </span>
                <span className="text-xs text-muted-foreground mt-1">until police alert</span>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Button
                onClick={() => setShowPinInput(true)}
                variant="outline"
                className="border-muted-foreground/30 text-foreground hover:bg-muted"
                disabled={isVerifying}
              >
                <Lock className="w-4 h-4 mr-2" />
                I'm Safe - Cancel Alert
              </Button>
            </motion.div>
          </>
        )}

        {/* Duress mode - looks cancelled but secretly continues */}
        {isDuress && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="w-24 h-24 rounded-full flex items-center justify-center bg-success/20 safe-glow">
              <Shield className="w-12 h-12 text-success" />
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-success">
                Alert Cancelled
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                You are marked as safe. Stay vigilant.
              </p>
            </div>
            <Button onClick={resetSOS} className="mt-4 bg-secondary hover:bg-secondary/80 text-foreground">
              Return to Home
            </Button>
            {/* Hidden indicator for debugging - remove in production */}
            <p className="text-xs text-muted-foreground/30 mt-8">
              Stealth tracking active
            </p>
          </motion.div>
        )}

        {(isResolved || isCancelled) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-4"
          >
            <div className={`w-24 h-24 rounded-full flex items-center justify-center ${
              isCancelled ? 'bg-success/20 safe-glow' : 'bg-emergency/20 emergency-glow'
            }`}>
              <Shield className={`w-12 h-12 ${isCancelled ? 'text-success' : 'text-emergency'}`} />
            </div>
            <div className="text-center">
              <h2 className={`text-2xl font-bold ${isCancelled ? 'text-success' : 'text-emergency'}`}>
                {isCancelled ? 'Alert Cancelled' : 'Police Notified'}
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                {isCancelled
                  ? 'You are marked as safe. Stay vigilant.'
                  : 'Emergency services have been alerted to your location.'}
              </p>
            </div>
            <Button onClick={resetSOS} className="mt-4 bg-secondary hover:bg-secondary/80 text-foreground">
              Return to Home
            </Button>
          </motion.div>
        )}
      </motion.div>

      {/* PIN Numpad Overlay */}
      <PinNumpad
        open={showPinInput}
        onClose={() => setShowPinInput(false)}
        onSubmit={handlePinSubmit}
        title="Enter PIN to Cancel"
        description="Enter your security PIN to confirm you're safe"
      />
    </>
  );
};
