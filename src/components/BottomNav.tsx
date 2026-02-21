import { motion } from 'framer-motion';
import { Home, HeartHandshake, Map, Settings } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

type View = 'user' | 'volunteer' | 'moments';

interface BottomNavProps {
  currentView?: View;
  onViewChange?: (view: View) => void;
}

export const BottomNav = ({ currentView = 'user', onViewChange }: BottomNavProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isSettings = location.pathname === '/settings';

  const handleTabClick = (tabId: View | 'settings') => {
    if (tabId === 'settings') {
      navigate('/settings');
    } else {
      if (isSettings) {
        navigate('/app', { state: { view: tabId } });
      } else {
        onViewChange?.(tabId);
      }
    }
  };

  const tabs = [
    { id: 'user' as const, icon: Home, label: 'Home' },
    { id: 'volunteer' as const, icon: HeartHandshake, label: 'Volunteer' },
    { id: 'moments' as const, icon: Map, label: 'SafeMap' },
    { id: 'settings' as const, icon: Settings, label: 'Settings' },
  ];

  return (
    <nav className="fixed bottom-4 left-4 right-4 bg-[#0a0a0a]/90 backdrop-blur-md border border-white/5 rounded-[2rem] p-2 max-w-md mx-auto z-50">
      <div className="flex justify-around items-center">
        {tabs.map((tab) => {
          const isActive = tab.id === 'settings'
            ? isSettings
            : !isSettings && currentView === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`flex flex-col items-center justify-center gap-1 w-[72px] h-[72px] rounded-full transition-colors relative ${isActive
                ? 'text-white'
                : 'text-[#888] hover:text-white/80'
                }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-[#E5252A] rounded-full"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              <tab.icon className={`w-6 h-6 relative z-10 ${isActive ? 'text-white' : 'text-[#888]'}`} />
              <span className={`text-[11px] font-medium relative z-10 mt-1 ${isActive ? 'text-white' : 'text-[#888]'}`}>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
