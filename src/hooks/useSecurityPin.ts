import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface PinStatus {
  hasPin: boolean;
  hasDuressPin: boolean;
}

// Simple hash function for PIN (in production, use bcrypt via edge function)
const hashPin = async (pin: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(pin + 'safepulse-salt');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

export const useSecurityPin = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [pinStatus, setPinStatus] = useState<PinStatus>({ hasPin: false, hasDuressPin: false });
  const [isLoading, setIsLoading] = useState(true);

  // Check if user has PIN set up
  const checkPinStatus = useCallback(async () => {
    if (!user) {
      setPinStatus({ hasPin: false, hasDuressPin: false });
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_pins')
        .select('pin_hash, duress_pin_hash')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      setPinStatus({
        hasPin: !!data?.pin_hash,
        hasDuressPin: !!data?.duress_pin_hash,
      });
    } catch (error) {
      console.error('Error checking PIN status:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    checkPinStatus();
  }, [checkPinStatus]);

  // Set up PIN
  const setupPin = async (pin: string, duressPin?: string): Promise<boolean> => {
    if (!user) return false;

    if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      toast({
        title: 'Invalid PIN',
        description: 'PIN must be exactly 4 digits.',
        variant: 'destructive',
      });
      return false;
    }

    if (duressPin && (duressPin.length !== 4 || !/^\d{4}$/.test(duressPin))) {
      toast({
        title: 'Invalid Duress PIN',
        description: 'Duress PIN must be exactly 4 digits.',
        variant: 'destructive',
      });
      return false;
    }

    if (duressPin && pin === duressPin) {
      toast({
        title: 'Invalid Duress PIN',
        description: 'Duress PIN must be different from your main PIN.',
        variant: 'destructive',
      });
      return false;
    }

    try {
      const pinHash = await hashPin(pin);
      const duressHash = duressPin ? await hashPin(duressPin) : null;

      // Upsert the PIN
      const { error } = await supabase
        .from('user_pins')
        .upsert({
          user_id: user.id,
          pin_hash: pinHash,
          duress_pin_hash: duressHash,
        }, {
          onConflict: 'user_id',
        });

      if (error) throw error;

      setPinStatus({
        hasPin: true,
        hasDuressPin: !!duressPin,
      });

      toast({
        title: 'PIN Set',
        description: 'Your security PIN has been configured.',
      });
      return true;
    } catch (error) {
      console.error('Error setting PIN:', error);
      toast({
        title: 'Error',
        description: 'Failed to set PIN. Please try again.',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Verify PIN and return type (normal or duress)
  const verifyPin = async (pin: string): Promise<'valid' | 'duress' | 'invalid'> => {
    if (!user) return 'invalid';

    try {
      const { data, error } = await supabase
        .from('user_pins')
        .select('pin_hash, duress_pin_hash')
        .eq('user_id', user.id)
        .single();

      if (error || !data) return 'invalid';

      const inputHash = await hashPin(pin);

      if (inputHash === data.pin_hash) {
        return 'valid';
      }

      if (data.duress_pin_hash && inputHash === data.duress_pin_hash) {
        return 'duress';
      }

      return 'invalid';
    } catch (error) {
      console.error('Error verifying PIN:', error);
      return 'invalid';
    }
  };

  // Remove PIN
  const removePin = async (): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('user_pins')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      setPinStatus({ hasPin: false, hasDuressPin: false });
      toast({
        title: 'PIN Removed',
        description: 'Your security PIN has been removed.',
      });
      return true;
    } catch (error) {
      console.error('Error removing PIN:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove PIN.',
        variant: 'destructive',
      });
      return false;
    }
  };

  return {
    pinStatus,
    isLoading,
    setupPin,
    verifyPin,
    removePin,
    refetch: checkPinStatus,
  };
};
