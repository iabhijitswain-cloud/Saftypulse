import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export type SOSState = 'ready' | 'triggered' | 'recording' | 'countdown' | 'resolved' | 'cancelled' | 'duress';

export interface TrustedContact {
  id: string;
  name: string;
  phone: string;
  status: 'pending' | 'notified' | 'responded' | 'failed';
  avatar?: string;
}

export interface Volunteer {
  id: string;
  name: string;
  distance: number;
  status: 'available' | 'responding' | 'arrived';
  avatar?: string;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
  accuracy?: number;
}

interface SOSContextType {
  state: SOSState;
  location: LocationData | null;
  isRecording: boolean;
  recordingProgress: number;
  countdownTime: number;
  trustedContacts: TrustedContact[];
  nearbyVolunteers: Volunteer[];
  currentAlertId: string | null;
  triggerSOS: () => Promise<void>;
  cancelSOS: (pin: string) => Promise<'success' | 'duress' | 'invalid'>;
  resolveEmergency: () => Promise<void>;
  resetSOS: () => void;
}

const SOSContext = createContext<SOSContextType | undefined>(undefined);

const MOCK_VOLUNTEERS: Volunteer[] = [
  { id: '1', name: 'Inspector Sharma', distance: 0.3, status: 'available' },
  { id: '2', name: 'Dr. Gupta', distance: 0.8, status: 'available' },
  { id: '3', name: 'Rahul Verma', distance: 1.2, status: 'available' },
];

const COUNTDOWN_DURATION = 300; // 5 minutes in seconds

// Hash function matching useSecurityPin
const hashPin = async (pin: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(pin + 'safepulse-salt');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

export const SOSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [state, setState] = useState<SOSState>('ready');
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingProgress, setRecordingProgress] = useState(0);
  const [countdownTime, setCountdownTime] = useState(COUNTDOWN_DURATION);
  const [trustedContacts, setTrustedContacts] = useState<TrustedContact[]>([]);
  const [nearbyVolunteers, setNearbyVolunteers] = useState<Volunteer[]>(MOCK_VOLUNTEERS);
  const [currentAlertId, setCurrentAlertId] = useState<string | null>(null);

  // Fetch trusted contacts from database
  const fetchTrustedContacts = useCallback(async () => {
    if (!user) return;

    const { data } = await supabase
      .from('trusted_contacts')
      .select('id, name, phone_number')
      .eq('user_id', user.id);

    if (data) {
      setTrustedContacts(data.map(c => ({
        id: c.id,
        name: c.name,
        phone: c.phone_number,
        status: 'pending' as const,
      })));
    }
  }, [user]);

  useEffect(() => {
    fetchTrustedContacts();
  }, [fetchTrustedContacts]);

  // Get real location using Geolocation API
  const getLocation = useCallback((): Promise<LocationData | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        console.warn('Geolocation is not supported by this browser.');
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc: LocationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          };
          setLocation(loc);
          resolve(loc);
        },
        (error) => {
          console.error('Geolocation error:', error);
          // Resolve null on error instead of mocked fake coordinates
          resolve(null);
        },
        { enableHighAccuracy: true, timeout: 30000, maximumAge: 0 }
      );
    });
  }, []);

  // Simulate audio recording
  useEffect(() => {
    if (state === 'recording') {
      setIsRecording(true);
      const interval = setInterval(() => {
        setRecordingProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsRecording(false);
            setState('countdown');
            return 100;
          }
          return prev + 10;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [state]);

  // Countdown timer
  useEffect(() => {
    if ((state === 'countdown' || state === 'duress') && countdownTime > 0) {
      const timer = setInterval(() => {
        setCountdownTime((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            if (state !== 'duress') {
              setState('resolved');
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [state, countdownTime]);

  // Simulate contact notifications UI (Simultaneous Broadcast)
  useEffect(() => {
    if (state === 'recording' || state === 'countdown' || state === 'duress') {
      // Mark all trusted contacts as notified instantly
      setTrustedContacts(current =>
        current.map(c => ({ ...c, status: 'notified' as const }))
      );

      // Randomly simulate their responses asynchronously
      trustedContacts.forEach(contact => {
        setTimeout(() => {
          if (Math.random() > 0.2) {
            setTrustedContacts(current =>
              current.map(c =>
                c.id === contact.id ? { ...c, status: 'responded' as const } : c
              )
            );
          }
        }, 2000 + Math.random() * 3000);
      });
    }
  }, [state]);

  // Simulate volunteer responses
  useEffect(() => {
    if (state === 'countdown' || state === 'duress') {
      setTimeout(() => {
        setNearbyVolunteers((prev) =>
          prev.map((v, i) => (i === 0 ? { ...v, status: 'responding' as const } : v))
        );
      }, 3000);
    }
  }, [state]);

  // Trigger SOS
  const triggerSOS = useCallback(async () => {
    if (!user) return;

    setState('triggered');

    // Get location first
    const loc = await getLocation();

    // Reset contacts to pending
    setTrustedContacts((prev) => prev.map(c => ({ ...c, status: 'pending' as const })));
    setNearbyVolunteers(MOCK_VOLUNTEERS.map(v => ({ ...v, status: 'available' as const })));
    setCountdownTime(COUNTDOWN_DURATION);
    setRecordingProgress(0);

    // Fetch trusted contacts FRESH directly from database Guardian Circle
    const { data: freshContacts } = await supabase
      .from('trusted_contacts')
      .select('*')
      .eq('user_id', user.id);

    const mappedContacts = (freshContacts || []).map(c => ({
      id: c.id,
      name: c.name,
      phone: c.phone_number,
      status: 'pending' as const,
    }));
    setTrustedContacts(mappedContacts);

    // Create SOS alert in database
    try {
      const { data: alert, error } = await supabase
        .from('sos_alerts')
        .insert({
          user_id: user.id,
          status: 'active',
        })
        .select()
        .single();

      if (error) throw error;
      setCurrentAlertId(alert.id);

      // Save initial location
      if (loc) {
        await supabase.from('user_locations').insert({
          user_id: user.id,
          sos_alert_id: alert.id,
          latitude: loc.latitude,
          longitude: loc.longitude,
          accuracy: loc.accuracy,
        });
      }

      // 4. QUEUE NOTIFICATIONS TO ALL GUARDIANS SIMULTANEOUSLY
      if (freshContacts && freshContacts.length > 0) {
        // Fetch user's registered phone
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('phone_number')
          .eq('id', user.id)
          .single();

        const userName = user.user_metadata?.display_name || user.email || 'A user';
        const phoneStr = userProfile?.phone_number ? ` (Ph: ${userProfile.phone_number})` : '';
        const rawMessage = `EMERGENCY SOS: ${userName}${phoneStr} is in an emergency and has activated their SOS alarm. They may be in danger. Location: https://maps.google.com/?q=${loc?.latitude || 0},${loc?.longitude || 0}`;

        const notifications = freshContacts.map(contact => ({
          user_id: user.id,
          alert_id: alert.id,
          recipient_phone: contact.phone_number,
          message_body: rawMessage,
          status: 'pending'
        }));

        await (supabase as any).from('notification_queue').insert(notifications);
        // 5. TRIGGER NATIVE DEVICE SMS (No Twilio Required)
        // Use the device's native cellular network to text all guardians for free
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        const isAndroid = /Android/.test(navigator.userAgent);
        const isMobile = isIOS || isAndroid;

        // iOS uses comma for multiple numbers, Android conventionally uses semicolon
        const phoneSep = isIOS ? ',' : ';';
        const phoneNumbers = freshContacts.map(c => c.phone_number).join(phoneSep);
        const messageBody = encodeURIComponent(rawMessage);

        // Open the native SMS app pre-filled with all Guardian Circle contacts and the distress message
        const separator = isIOS ? '&' : '?';
        const smsUrl = `sms:${phoneNumbers}${separator}body=${messageBody}`;

        if (isMobile) {
          // Reliable trick to open SMS dialects on mobile browsers
          const link = document.createElement('a');
          link.href = smsUrl;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          console.warn('Native SMS cannot be automatically opened on non-mobile desktop devices.');
          // Try to open it gracefully for desktop apps like Phone Link
          window.open(smsUrl, '_blank');
        }
      }
    } catch (error) {
      console.error('Error creating SOS alert:', error);
    }

    // Trigger Haptic Feedback (Accessibility - Visually/Physically Impaired)
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([200, 100, 200, 100, 500]);
    }

    // Trigger Voice Feedback (Accessibility - Visually Impaired)
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance("Emergency Mode Activated. Live location is tracked.");
      window.speechSynthesis.speak(utterance);
    }

    setTimeout(() => {
      setState('recording');
    }, 500);
  }, [user, getLocation]);

  // Cancel SOS with PIN verification
  const cancelSOS = useCallback(async (pin: string): Promise<'success' | 'duress' | 'invalid'> => {
    if (!user) return 'invalid';

    // Get user's PIN from database
    const { data: pinData } = await supabase
      .from('user_pins')
      .select('pin_hash, duress_pin_hash')
      .eq('user_id', user.id)
      .single();

    // If no PIN set, allow cancellation with any input (legacy behavior)
    if (!pinData) {
      setState('cancelled');
      setIsRecording(false);

      if (currentAlertId) {
        await supabase
          .from('sos_alerts')
          .update({ status: 'cancelled', resolved_at: new Date().toISOString() })
          .eq('id', currentAlertId);
      }

      return 'success';
    }

    const inputHash = await hashPin(pin);

    // Check for duress PIN first
    if (pinData.duress_pin_hash && inputHash === pinData.duress_pin_hash) {
      // Appear to cancel but continue in stealth mode
      setState('duress');
      setIsRecording(false);

      if (currentAlertId) {
        await supabase
          .from('sos_alerts')
          .update({ status: 'duress', is_stealth: true })
          .eq('id', currentAlertId);
      }

      return 'duress';
    }

    // Check normal PIN
    if (inputHash === pinData.pin_hash) {
      setState('cancelled');
      setIsRecording(false);

      if (currentAlertId) {
        await supabase
          .from('sos_alerts')
          .update({ status: 'cancelled', resolved_at: new Date().toISOString() })
          .eq('id', currentAlertId);
      }

      return 'success';
    }

    return 'invalid';
  }, [user, currentAlertId]);

  // Resolve emergency
  const resolveEmergency = useCallback(async () => {
    setState('resolved');
    setIsRecording(false);

    if (currentAlertId) {
      await supabase
        .from('sos_alerts')
        .update({ status: 'resolved', resolved_at: new Date().toISOString() })
        .eq('id', currentAlertId);
    }
  }, [currentAlertId]);

  // Reset SOS
  const resetSOS = useCallback(() => {
    setState('ready');
    setLocation(null);
    setIsRecording(false);
    setRecordingProgress(0);
    setCountdownTime(COUNTDOWN_DURATION);
    setCurrentAlertId(null);
    setNearbyVolunteers(MOCK_VOLUNTEERS);
    fetchTrustedContacts();
  }, [fetchTrustedContacts]);

  return (
    <SOSContext.Provider
      value={{
        state,
        location,
        isRecording,
        recordingProgress,
        countdownTime,
        trustedContacts,
        nearbyVolunteers,
        currentAlertId,
        triggerSOS,
        cancelSOS,
        resolveEmergency,
        resetSOS,
      }}
    >
      {children}
    </SOSContext.Provider>
  );
};

export const useSOS = () => {
  const context = useContext(SOSContext);
  if (!context) {
    throw new Error('useSOS must be used within a SOSProvider');
  }
  return context;
};
