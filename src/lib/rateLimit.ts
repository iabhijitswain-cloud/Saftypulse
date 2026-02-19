import { supabase } from '@/integrations/supabase/client';

export const checkRateLimit = async (action: 'auth' | 'sos' | 'contact'): Promise<boolean> => {
  try {
    const { data, error } = await supabase.functions.invoke('rate-limit', {
      body: { action },
    });

    if (error || data?.allowed === false) {
      return false; // Rate limited
    }
    return true; // Allowed
  } catch {
    // If rate limit service is down, allow the request (fail open)
    return true;
  }
};
