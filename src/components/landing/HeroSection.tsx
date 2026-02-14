import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Play, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import phoneMockup from '@/assets/phone-mockup.png';

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Mesh gradient background */}
      <div className="absolute inset-0 bg-background" />
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(ellipse at 20% 50%, hsl(0 84% 50% / 0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, hsl(220 15% 20% / 0.8) 0%, transparent 50%), radial-gradient(ellipse at 60% 80%, hsl(0 84% 50% / 0.08) 0%, transparent 50%)',
        }}
      />
      {/* Grid overlay */}
      <div 
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left column */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card/50 backdrop-blur-sm">
              <div className="w-2 h-2 rounded-full bg-emergency animate-pulse" />
              <span className="text-sm text-muted-foreground">Always watching. Always silent.</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground leading-[1.1] tracking-tight">
              Your Silent Guardian{' '}
              <span className="text-emergency">in Every Pulse</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
              Stay connected, protected and empowered with our discreet SOS network. 
              Alert trusted contacts and nearby volunteers, right when you need them most.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Button
                size="lg"
                className="bg-emergency hover:bg-emergency/90 text-emergency-foreground px-8 py-6 text-base font-semibold rounded-full shadow-lg shadow-emergency/25"
                onClick={() => navigate('/auth')}
              >
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="text-foreground border border-border hover:bg-card px-8 py-6 text-base rounded-full"
                onClick={() => {
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                How it Works
              </Button>
              <button
                className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:bg-card transition-colors"
                onClick={() => {
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <Play className="w-5 h-5 text-foreground ml-0.5" />
              </button>
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Lock className="w-4 h-4 text-emergency/70" />
                <span className="text-sm">End-to-End Encrypted</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Eye className="w-4 h-4 text-emergency/70" />
                <span className="text-sm">24/7 Monitoring</span>
              </div>
            </div>
          </motion.div>

          {/* Right column - Phone mockup */}
          <motion.div
            initial={{ opacity: 0, x: 40, rotateY: -10 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="relative">
              {/* Glow behind phone */}
              <div className="absolute inset-0 blur-3xl opacity-30 bg-emergency/40 rounded-full scale-75" />
              <img
                src={phoneMockup}
                alt="SafetyPulse SOS interface on smartphone"
                className="relative z-10 w-full max-w-md drop-shadow-2xl"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
