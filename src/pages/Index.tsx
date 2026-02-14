import { useState } from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { UserView } from '@/components/UserView';
import { VolunteerView } from '@/components/VolunteerView';
import { MomentsView } from '@/components/MomentsView';

type View = 'user' | 'volunteer' | 'moments';

const Index = () => {
  const [currentView, setCurrentView] = useState<View>('user');

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
