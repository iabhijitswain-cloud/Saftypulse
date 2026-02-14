import { motion } from 'framer-motion';
import { ArrowRight, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-emergency/10 via-background to-background" />
      <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <div className="w-16 h-16 rounded-full bg-emergency/20 flex items-center justify-center mx-auto">
            <Shield className="w-8 h-8 text-emergency" />
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold text-foreground">
            Your Safety Shouldn't Be Silent
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of users who trust SafetyPulse to keep them protected. 
            Set up in under 2 minutes — completely free.
          </p>
          <Button
            size="lg"
            className="bg-emergency hover:bg-emergency/90 text-emergency-foreground px-10 py-6 text-base font-semibold rounded-full shadow-lg shadow-emergency/25"
            onClick={() => navigate('/auth')}
          >
            Get SafetyPulse Free
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
