import { useState } from 'react';
import { motion } from 'framer-motion';
import { Switch } from '@/components/ui/switch';
import { MapPin, Navigation, Clock, CheckCircle, User, AlertTriangle, Shield } from 'lucide-react';
import { useSOS } from '@/contexts/SOSContext';
import { Button } from '@/components/ui/button';

export const VolunteerView = () => {
  const [isAvailable, setIsAvailable] = useState(true);
  const { state, nearbyVolunteers, location } = useSOS();
  const isEmergencyActive = state === 'recording' || state === 'countdown';

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-card border-b border-border p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">Volunteer Network</h1>
            <p className="text-xs text-muted-foreground">Verified First Responders</p>
          </div>
        </div>
      </div>

      {/* User Status Bar */}
      <div className="bg-card/50 backdrop-blur-sm border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${isAvailable ? 'bg-success shadow-[0_0_8px_hsl(var(--success))]' : 'bg-muted-foreground'}`} />
          <span className="text-sm font-medium text-foreground">
            {isAvailable ? 'You are Available' : 'You are Offline'}
          </span>
        </div>
        <Switch checked={isAvailable} onCheckedChange={setIsAvailable} className="scale-90" />
      </div>

      <div className="flex-1 p-4 pb-24 space-y-4 overflow-auto">
        {/* Status Banner */}
        <motion.div
          animate={{
            backgroundColor: isEmergencyActive
              ? 'hsl(var(--emergency) / 0.1)'
              : 'hsl(var(--success) / 0.1)',
          }}
          className="rounded-xl p-4 border border-border"
        >
          <div className="flex items-center gap-3">
            {isEmergencyActive ? (
              <>
                <div className="w-3 h-3 rounded-full bg-emergency animate-pulse" />
                <div>
                  <p className="font-semibold text-emergency">Active Emergency Nearby</p>
                  <p className="text-xs text-muted-foreground">1 person needs assistance within 2km</p>
                </div>
              </>
            ) : (
              <>
                <div className="w-3 h-3 rounded-full bg-success" />
                <div>
                  <p className="font-semibold text-success">All Clear</p>
                  <p className="text-xs text-muted-foreground">No active emergencies in your area</p>
                </div>
              </>
            )}
          </div>
        </motion.div>

        {/* Emergency Details (shown when active) */}
        {isEmergencyActive && location && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-xl p-4 border border-emergency/30"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-emergency" />
                Emergency Alert
              </h3>
              <span className="text-xs bg-emergency/20 text-emergency px-2 py-1 rounded-full">
                0.3 km away
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-foreground">{location.address}</p>
                  <p className="text-xs text-muted-foreground font-mono">
                    {Math.abs(location.latitude)}°{location.latitude >= 0 ? 'N' : 'S'}, {Math.abs(location.longitude)}°{location.longitude >= 0 ? 'E' : 'W'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Triggered 2 minutes ago</p>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button className="flex-1 bg-success hover:bg-success/90 text-success-foreground">
                <Navigation className="w-4 h-4 mr-2" />
                Navigate
              </Button>
              <Button variant="outline" className="flex-1 border-border">
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark Responding
              </Button>
            </div>
          </motion.div>
        )}

        {/* Nearby Volunteers */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">Nearby Volunteers</h3>

          {nearbyVolunteers.map((volunteer, index) => (
            <motion.div
              key={volunteer.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-xl p-4 border border-border flex items-center gap-3"
            >
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                <User className="w-6 h-6 text-foreground" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">{volunteer.name}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  <span>{volunteer.distance} km away</span>
                </div>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${volunteer.status === 'responding'
                ? 'bg-success/20 text-success'
                : 'bg-muted text-muted-foreground'
                }`}>
                {volunteer.status === 'responding' ? 'Responding' : 'Available'}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Volunteer Stats */}
        <div className="bg-card rounded-xl p-4 border border-border">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Your Stats</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">12</p>
              <p className="text-xs text-muted-foreground">Responses</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-success">4.9</p>
              <p className="text-xs text-muted-foreground">Rating</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">2.3</p>
              <p className="text-xs text-muted-foreground">km Avg</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
