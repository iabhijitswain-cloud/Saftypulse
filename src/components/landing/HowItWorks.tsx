import { motion } from 'framer-motion';
import { Smartphone, Shield, Users, MapPin } from 'lucide-react';

const steps = [
  {
    icon: Smartphone,
    title: 'Tap SOS',
    description: 'One tap silently activates the emergency beacon. No unlock, no fumbling.',
    step: '01',
  },
  {
    icon: Shield,
    title: 'Stealth Recording',
    description: 'Audio, video and location are captured automatically as evidence.',
    step: '02',
  },
  {
    icon: Users,
    title: 'Alert Contacts',
    description: 'Trusted contacts and nearby volunteers receive instant notifications.',
    step: '03',
  },
  {
    icon: MapPin,
    title: 'Live Tracking',
    description: 'Real-time GPS sharing with countdown timer for police dispatch.',
    step: '04',
  },
];

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 bg-card/50 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-emergency text-sm font-semibold uppercase tracking-widest">How It Works</span>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mt-3">
            Protection in Four Simple Steps
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Designed for high-stress situations where every second counts. No complex menus, no visible indicators.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative group"
            >
              <div className="p-6 rounded-2xl border border-border bg-card hover:border-emergency/30 transition-colors">
                <span className="text-5xl font-black text-emergency/10 absolute top-4 right-6">{step.step}</span>
                <div className="w-12 h-12 rounded-xl bg-emergency/10 flex items-center justify-center mb-5">
                  <step.icon className="w-6 h-6 text-emergency" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
