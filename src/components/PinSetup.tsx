import { useState } from 'react';
import { useSecurityPin } from '@/hooks/useSecurityPin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Shield, Lock, AlertTriangle, CheckCircle2, Loader2, Eye, EyeOff } from 'lucide-react';

export const PinSetup = () => {
  const { pinStatus, isLoading, setupPin, removePin } = useSecurityPin();
  
  const [isOpen, setIsOpen] = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [duressPin, setDuressPin] = useState('');
  const [enableDuress, setEnableDuress] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState('');

  const resetForm = () => {
    setPin('');
    setConfirmPin('');
    setDuressPin('');
    setEnableDuress(false);
    setShowPin(false);
    setError('');
  };

  const validateForm = (): boolean => {
    if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      setError('PIN must be exactly 4 digits');
      return false;
    }
    if (pin !== confirmPin) {
      setError('PINs do not match');
      return false;
    }
    if (enableDuress) {
      if (duressPin.length !== 4 || !/^\d{4}$/.test(duressPin)) {
        setError('Duress PIN must be exactly 4 digits');
        return false;
      }
      if (pin === duressPin) {
        setError('Duress PIN must be different from main PIN');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    const success = await setupPin(pin, enableDuress ? duressPin : undefined);
    if (success) {
      setIsOpen(false);
      resetForm();
    }
    setIsSubmitting(false);
  };

  const handleRemove = async () => {
    setIsSubmitting(true);
    await removePin();
    setShowRemoveConfirm(false);
    setIsSubmitting(false);
  };

  if (isLoading) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="w-6 h-6 animate-spin text-emergency" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emergency/20 flex items-center justify-center">
              <Lock className="w-5 h-5 text-emergency" />
            </div>
            <div>
              <CardTitle className="text-lg text-foreground">Security PIN</CardTitle>
              <CardDescription className="text-muted-foreground">
                Required to cancel SOS alerts
              </CardDescription>
            </div>
          </div>

          {pinStatus.hasPin ? (
            <CheckCircle2 className="w-6 h-6 text-success" />
          ) : (
            <AlertTriangle className="w-6 h-6 text-warning" />
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          {pinStatus.hasPin ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="w-4 h-4 text-success" />
                <span>PIN is configured</span>
              </div>
              {pinStatus.hasDuressPin && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <AlertTriangle className="w-4 h-4 text-warning" />
                  <span>Duress PIN enabled</span>
                </div>
              )}
              <div className="flex gap-2">
                <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetForm(); }}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="border-border">
                      Change PIN
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-card border-border">
                    <PinFormContent
                      pin={pin}
                      setPin={setPin}
                      confirmPin={confirmPin}
                      setConfirmPin={setConfirmPin}
                      duressPin={duressPin}
                      setDuressPin={setDuressPin}
                      enableDuress={enableDuress}
                      setEnableDuress={setEnableDuress}
                      showPin={showPin}
                      setShowPin={setShowPin}
                      error={error}
                      isSubmitting={isSubmitting}
                      onSubmit={handleSubmit}
                      isUpdate
                    />
                  </DialogContent>
                </Dialog>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-border text-destructive hover:bg-destructive/10"
                  onClick={() => setShowRemoveConfirm(true)}
                >
                  Remove PIN
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Set up a 4-digit PIN to prevent unauthorized cancellation of SOS alerts.
              </p>
              <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetForm(); }}>
                <DialogTrigger asChild>
                  <Button className="bg-emergency hover:bg-emergency/90 text-emergency-foreground">
                    Set Up PIN
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border-border">
                  <PinFormContent
                    pin={pin}
                    setPin={setPin}
                    confirmPin={confirmPin}
                    setConfirmPin={setConfirmPin}
                    duressPin={duressPin}
                    setDuressPin={setDuressPin}
                    enableDuress={enableDuress}
                    setEnableDuress={setEnableDuress}
                    showPin={showPin}
                    setShowPin={setShowPin}
                    error={error}
                    isSubmitting={isSubmitting}
                    onSubmit={handleSubmit}
                    isUpdate={false}
                  />
                </DialogContent>
              </Dialog>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Remove Confirmation */}
      <AlertDialog open={showRemoveConfirm} onOpenChange={setShowRemoveConfirm}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">Remove Security PIN</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Without a PIN, anyone will be able to cancel your SOS alerts. Are you sure?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-border">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemove}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Remove PIN
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

// Extracted form content for reuse
interface PinFormContentProps {
  pin: string;
  setPin: (v: string) => void;
  confirmPin: string;
  setConfirmPin: (v: string) => void;
  duressPin: string;
  setDuressPin: (v: string) => void;
  enableDuress: boolean;
  setEnableDuress: (v: boolean) => void;
  showPin: boolean;
  setShowPin: (v: boolean) => void;
  error: string;
  isSubmitting: boolean;
  onSubmit: () => void;
  isUpdate: boolean;
}

const PinFormContent = ({
  pin,
  setPin,
  confirmPin,
  setConfirmPin,
  duressPin,
  setDuressPin,
  enableDuress,
  setEnableDuress,
  showPin,
  setShowPin,
  error,
  isSubmitting,
  onSubmit,
  isUpdate,
}: PinFormContentProps) => {
  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-foreground">
          {isUpdate ? 'Change Security PIN' : 'Set Up Security PIN'}
        </DialogTitle>
        <DialogDescription className="text-muted-foreground">
          This PIN will be required to cancel SOS alerts.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 py-4">
        {/* Main PIN */}
        <div className="space-y-2">
          <Label className="text-foreground">4-Digit PIN</Label>
          <div className="relative">
            <Input
              type={showPin ? 'text' : 'password'}
              maxLength={4}
              placeholder="••••"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
              className="bg-muted border-border text-center text-2xl tracking-widest"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2"
              onClick={() => setShowPin(!showPin)}
            >
              {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Confirm PIN */}
        <div className="space-y-2">
          <Label className="text-foreground">Confirm PIN</Label>
          <Input
            type={showPin ? 'text' : 'password'}
            maxLength={4}
            placeholder="••••"
            value={confirmPin}
            onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
            className="bg-muted border-border text-center text-2xl tracking-widest"
          />
        </div>

        {/* Duress PIN Toggle */}
        <div className="flex items-center justify-between py-2">
          <div className="space-y-0.5">
            <Label className="text-foreground">Enable Duress PIN</Label>
            <p className="text-xs text-muted-foreground">
              A secondary PIN that appears to cancel but continues tracking
            </p>
          </div>
          <Switch checked={enableDuress} onCheckedChange={setEnableDuress} />
        </div>

        {/* Duress PIN Input */}
        {enableDuress && (
          <div className="space-y-2">
            <Label className="text-foreground flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-warning" />
              Duress PIN
            </Label>
            <Input
              type={showPin ? 'text' : 'password'}
              maxLength={4}
              placeholder="••••"
              value={duressPin}
              onChange={(e) => setDuressPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
              className="bg-muted border-border text-center text-2xl tracking-widest"
            />
            <p className="text-xs text-muted-foreground">
              When entered, the app will look deactivated but continue sending stealth updates.
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        {/* Submit */}
        <Button
          onClick={onSubmit}
          className="w-full bg-emergency hover:bg-emergency/90 text-emergency-foreground"
          disabled={isSubmitting || pin.length !== 4 || confirmPin.length !== 4}
        >
          {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
          {isUpdate ? 'Update PIN' : 'Set PIN'}
        </Button>
      </div>
    </>
  );
};
