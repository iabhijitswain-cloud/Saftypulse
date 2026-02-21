import { motion } from 'framer-motion';
import { Shield, Wifi, Lock, Bell, Eye, Zap, MapPin, Users, Camera, PhoneCall } from 'lucide-react';

const features = [
  { icon: Shield, title: 'Duress PIN', description: 'A fake PIN that silently alerts authorities while appearing to deactivate the alarm.' },
  { icon: Wifi, title: 'Offline Mode', description: 'Captures data even without network. Syncs automatically when connection returns.' },
  { icon: Lock, title: 'End-to-End Encrypted', description: 'All communication and evidence is fully encrypted and inaccessible to third parties.' },
  { icon: Bell, title: 'Silent Alerts', description: 'No visible or audible indicators on your phone. Completely stealth operation.' },
  { icon: Eye, title: 'Stealth Recording', description: 'Background audio and video capture with screen disguised as a normal app.' },
  { icon: Zap, title: 'Instant Activation', description: 'One-tap or gesture-based trigger. Works even from lock screen.' },
  { icon: MapPin, title: 'Live GPS Tracking', description: 'Real-time location sharing with trusted contacts and emergency services.' },
  { icon: Users, title: 'Volunteer Network', description: 'Nearby verified volunteers are alerted to provide immediate physical assistance.' },
  { icon: Camera, title: 'Incident Logging', description: 'Create a secure way for users to log suspicious individuals or incidents with photos, notes, and geotags.' },
  { icon: PhoneCall, title: 'Fake Call Escape', description: 'Design a realistic fake call escape feature with customizable caller name, ringtone, and timing.' },
];

export const Features = () => {
  return (
    <section id="features" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-emergency text-sm font-semibold uppercase tracking-widest">Features</span>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mt-3">
            Built for the Moments That Matter
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Every feature is engineered for discretion, speed, and reliability when you need it most.
          </p>
        </motion.div>

        {/* Feature Spotlight: Duress PIN */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mb-16 max-w-4xl mx-auto bg-card/40 backdrop-blur-sm border border-emergency/20 rounded-2xl p-8 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emergency/5 via-transparent to-emergency/5" />
          <div className="relative z-10 flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emergency/10 flex items-center justify-center animate-pulse">
              <Shield className="w-6 h-6 text-emergency" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">Featured: Duress PIN Protection</h3>
              <p className="text-muted-foreground mt-2 max-w-2xl">
                A critical safety layer that works when you're compromised. Enter your preset <span className="text-emergency/80 font-medium">Duress PIN</span> to fake a deactivation while silently dispatching an SOS with recorded evidence to your Guardian Circle.
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="p-6 rounded-2xl border border-border bg-card/60 hover:bg-card hover:border-emergency/20 transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-emergency/10 flex items-center justify-center mb-4 group-hover:bg-emergency/20 transition-colors">
                <feature.icon className="w-5 h-5 text-emergency" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
