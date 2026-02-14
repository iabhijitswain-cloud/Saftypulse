import { motion } from 'framer-motion';
import { Shield, Users, Settings } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

type View = 'user' | 'volunteer';

interface BottomNavProps {
  currentView?: View;
  onViewChange?: (view: View) => void;
}

export const BottomNav = ({ currentView = 'user', onViewChange }: BottomNavProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isSettings = location.pathname === '/settings';

  const handleTabClick = (tabId: 'user' | 'volunteer' | 'settings') => {
    if (tabId === 'settings') {
      navigate('/settings');
    } else {
      if (isSettings) {
        navigate('/');
      }
      onViewChange?.(tabId);
    }
  };

  const tabs = [
    { id: 'user' as const, icon: Shield, label: 'My Safety' },
    { id: 'volunteer' as const, icon: Users, label: 'Volunteer' },
    { id: 'settings' as const, icon: Settings, label: 'Settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-2 max-w-md mx-auto">
      <div className="flex justify-around">
        {tabs.map((tab) => {
          const isActive = tab.id === 'settings' 
            ? isSettings 
            : !isSettings && currentView === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`flex flex-col items-center gap-1 py-2 px-6 rounded-xl transition-colors relative ${
                isActive
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground/80'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-muted rounded-xl"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              <tab.icon className="w-5 h-5 relative z-10" />
              <span className="text-xs font-medium relative z-10">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
