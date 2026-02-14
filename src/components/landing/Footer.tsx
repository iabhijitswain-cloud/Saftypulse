import { Shield } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-border py-12 bg-card/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emergency/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-emergency" />
            </div>
            <span className="font-bold text-foreground">SafetyPulse</span>
          </div>
          <div className="flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © 2026 SafetyPulse. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
