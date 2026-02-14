import { motion } from 'framer-motion';
import { MapPin, Mic, Users, Radio, CheckCircle, Clock, AlertCircle, Phone } from 'lucide-react';
import { useSOS } from '@/contexts/SOSContext';
import { Progress } from '@/components/ui/progress';

export const EmergencyDashboard = () => {
  const { state, location, isRecording, recordingProgress, trustedContacts } = useSOS();

  const isActive = state === 'triggered' || state === 'recording' || state === 'countdown' || state === 'duress';

  if (!isActive) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-muted-foreground" />;
      case 'notified':
        return <Radio className="w-4 h-4 text-warning animate-pulse" />;
      case 'responded':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-emergency" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'notified':
        return 'Notified';
      case 'responded':
        return 'Responded';
      case 'failed':
        return 'Failed';
      default:
        return 'Unknown';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full space-y-4"
    >
      {/* Location Card */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-xl p-4 border border-border"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-success" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Location Captured</h3>
            <p className="text-xs text-muted-foreground">GPS coordinates secured</p>
          </div>
          <CheckCircle className="w-5 h-5 text-success ml-auto" />
        </div>
        {location && (
          <div className="bg-muted/50 rounded-lg p-3 text-sm">
            <p className="text-muted-foreground font-mono text-xs">
              {location.latitude.toFixed(6)}°N, {location.longitude.toFixed(6)}°W
            </p>
            <p className="text-foreground mt-1">{location.address}</p>
          </div>
        )}
      </motion.div>

      {/* Audio Recording Card */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card rounded-xl p-4 border border-border"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isRecording ? 'bg-emergency/20' : 'bg-success/20'
          }`}>
            <Mic className={`w-5 h-5 ${isRecording ? 'text-emergency animate-pulse' : 'text-success'}`} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground">Audio Snapshot</h3>
            <p className="text-xs text-muted-foreground">
              {isRecording ? 'Recording 10s clip...' : 'Recording complete'}
            </p>
          </div>
          {!isRecording && <CheckCircle className="w-5 h-5 text-success" />}
        </div>
        <Progress value={recordingProgress} className="h-2" />
        <p className="text-xs text-muted-foreground mt-2">
          {isRecording ? `${Math.round(recordingProgress / 10)}s / 10s` : 'Audio saved and encrypted'}
        </p>
      </motion.div>

      {/* Trusted Contacts Card */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-card rounded-xl p-4 border border-border"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Trusted Contacts</h3>
            <p className="text-xs text-muted-foreground">
              {trustedContacts.filter(c => c.status === 'responded').length} of {trustedContacts.length} responded
            </p>
          </div>
        </div>
        
        <div className="space-y-3">
          {trustedContacts.map((contact, index) => (
            <motion.div
              key={contact.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="flex items-center gap-3 bg-muted/30 rounded-lg p-3"
            >
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                <span className="text-sm font-medium text-foreground">
                  {contact.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground text-sm truncate">{contact.name}</p>
                <div className="flex items-center gap-1">
                  <Phone className="w-3 h-3 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">{contact.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(contact.status)}
                <span className={`text-xs font-medium ${
                  contact.status === 'responded' ? 'text-success' :
                  contact.status === 'notified' ? 'text-warning' :
                  contact.status === 'failed' ? 'text-emergency' :
                  'text-muted-foreground'
                }`}>
                  {getStatusText(contact.status)}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};
