import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { UserView } from '@/components/UserView';
import { VolunteerView } from '@/components/VolunteerView';
import { MomentsView } from '@/components/MomentsView';

type View = 'user' | 'volunteer' | 'moments';

const Index = () => {
  const location = useLocation();
  const [currentView, setCurrentView] = useState<View>(() => {
    return (location.state as any)?.view || 'user';
  });

  useEffect(() => {
    if ((location.state as any)?.view) {
      setCurrentView((location.state as any).view);
      // Clean up the state so refreshing doesn't keep forcing this view if they navigate away
      window.history.replaceState({}, document.title)
    }
  }, [location.state]);

  const renderView = () => {
    switch (currentView) {
      case 'user': return <UserView />;
      case 'volunteer': return <VolunteerView />;
      case 'moments': return <MomentsView />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background max-w-md mx-auto">
      <Header />
      <main className="flex-1 overflow-hidden">
        {renderView()}
      </main>
      <BottomNav currentView={currentView} onViewChange={setCurrentView} />
    </div>
  );
};

export default Index;
