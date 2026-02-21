import { useState } from 'react';
import { Shield, Bell, Menu } from 'lucide-react';
import { SettingsPanel } from './SettingsPanel';
import { HamburgerMenu } from './HamburgerMenu';

export const Header = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="flex items-center justify-between p-4 bg-[#0a0a0a]">
        <button
          onClick={() => setMenuOpen(true)}
          className="w-12 h-12 rounded-full border border-white/5 bg-white/5 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#E5252A] fill-[#E5252A]" />
            <h1 className="text-[1.1rem] font-medium text-white tracking-wide">SafetyPulse</h1>
          </div>
          <p className="text-[0.6rem] tracking-[0.2em] text-white/50 uppercase mt-0.5">Silent Protection</p>
        </div>

        <button
          onClick={() => setSettingsOpen(true)}
          className="w-12 h-12 rounded-full border border-white/5 bg-white/5 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors"
        >
          <Bell className="w-5 h-5 fill-white/70" />
        </button>
      </header>

      <SettingsPanel open={settingsOpen} onOpenChange={setSettingsOpen} />
      <HamburgerMenu open={menuOpen} onOpenChange={setMenuOpen} />
    </>
  );
};
