import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useDuressBackend = () => {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    // Securely trigger duress mode via Edge Function
    const triggerDuressSignal = async (
        alertId: string,
        location: { latitude: number; longitude: number },
        pin: string
    ) => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase.functions.invoke('signal-duress', {
                body: {
                    alertId,
                    latitude: location.latitude,
                    longitude: location.longitude,
                    pin
                }
            });

            if (error) throw error;

            console.log('Duress signal ACK:', data);

            // Even if backend fails, we technically "succeeded" in the UI 
            // because we must maintain the illusion. 
            // But logging the error internally is important.
            return true;

        } catch (error) {
            console.error('Failed to signal duress:', error);
            // In a real duress situation, we might want to fallback to a basic DB update
            // if the function call fails, but silently.
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        triggerDuressSignal,
        isLoading
    };
};
