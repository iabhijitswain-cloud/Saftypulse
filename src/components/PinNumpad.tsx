import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Delete, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PinNumpadProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (pin: string) => void;
  title?: string;
  description?: string;
  maxLength?: number;
  showClose?: boolean;
}

export const PinNumpad = ({
  open,
  onClose,
  onSubmit,
  title = 'Enter PIN',
  description = 'Enter your 4-digit security PIN',
  maxLength = 4,
  showClose = true,
}: PinNumpadProps) => {
  const [pin, setPin] = useState('');
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (!open) {
      setPin('');
    }
  }, [open]);

  const handleNumber = (num: string) => {
    if (pin.length < maxLength) {
      const newPin = pin + num;
      setPin(newPin);

      // Auto-submit when complete
      if (newPin.length === maxLength) {
        setTimeout(() => {
          onSubmit(newPin);
        }, 150);
      }
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  const triggerShake = () => {
    setShake(true);
    setPin('');
    setTimeout(() => setShake(false), 500);
  };

  // Expose shake trigger via ref or callback
  useEffect(() => {
    (window as any).triggerPinShake = triggerShake;
    return () => {
      delete (window as any).triggerPinShake;
    };
  }, []);

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col items-center justify-center p-4"
      >
        {/* Close button */}
        {showClose && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            onClick={onClose}
          >
            <X className="w-6 h-6" />
          </Button>
        )}

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">{title}</h2>
          <p className="text-muted-foreground">{description}</p>
        </div>

        {/* PIN dots */}
        <motion.div
          className="flex gap-4 mb-8"
          animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
        >
          {Array.from({ length: maxLength }).map((_, i) => (
            <motion.div
              key={i}
              className={`w-4 h-4 rounded-full border-2 ${
                i < pin.length
                  ? 'bg-emergency border-emergency'
                  : 'border-muted-foreground'
              }`}
              animate={i < pin.length ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.15 }}
            />
          ))}
        </motion.div>

        {/* Numpad */}
        <div className="grid grid-cols-3 gap-4 max-w-xs w-full">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
            <Button
              key={num}
              variant="outline"
              className="h-16 text-2xl font-semibold border-border hover:bg-muted"
              onClick={() => handleNumber(num)}
            >
              {num}
            </Button>
          ))}
          
          {/* Empty space */}
          <div />
          
          {/* 0 */}
          <Button
            variant="outline"
            className="h-16 text-2xl font-semibold border-border hover:bg-muted"
            onClick={() => handleNumber('0')}
          >
            0
          </Button>
          
          {/* Backspace */}
          <Button
            variant="outline"
            className="h-16 text-xl border-border hover:bg-muted"
            onClick={handleBackspace}
            disabled={pin.length === 0}
          >
            <Delete className="w-6 h-6" />
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
