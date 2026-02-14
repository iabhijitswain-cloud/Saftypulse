import { Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const LandingNav = () => {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emergency/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-emergency" />
          </div>
          <span className="font-bold text-foreground text-lg">SafetyPulse</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            className="text-muted-foreground hover:text-foreground"
            onClick={() => navigate('/auth')}
          >
            Sign In
          </Button>
          <Button
            className="bg-emergency hover:bg-emergency/90 text-emergency-foreground rounded-full px-6"
            onClick={() => navigate('/auth')}
          >
            Get Started
          </Button>
        </div>
      </div>
    </nav>
  );
};
