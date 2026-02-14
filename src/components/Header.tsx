import { useState } from 'react';
import { Shield, Settings, Bell, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SettingsPanel } from './SettingsPanel';
import { HamburgerMenu } from './HamburgerMenu';

export const Header = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="flex items-center justify-between p-4 bg-card border-b border-border">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
            onClick={() => setMenuOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </Button>
          <div className="w-10 h-10 rounded-xl bg-emergency/10 flex items-center justify-center">
            <Shield className="w-6 h-6 text-emergency" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground tracking-tight">SafePulse</h1>
            <p className="text-xs text-muted-foreground">Silent Protection</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <Bell className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
            onClick={() => setSettingsOpen(true)}
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <SettingsPanel open={settingsOpen} onOpenChange={setSettingsOpen} />
      <HamburgerMenu open={menuOpen} onOpenChange={setMenuOpen} />
    </>
  );
};
