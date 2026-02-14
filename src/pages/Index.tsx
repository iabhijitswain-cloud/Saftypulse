import { useState } from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { UserView } from '@/components/UserView';
import { VolunteerView } from '@/components/VolunteerView';

type View = 'user' | 'volunteer';

const Index = () => {
  const [currentView, setCurrentView] = useState<View>('user');

  return (
    <div className="flex flex-col h-screen bg-background max-w-md mx-auto">
      <Header />
      <main className="flex-1 overflow-hidden">
        {currentView === 'user' ? <UserView /> : <VolunteerView />}
      </main>
      <BottomNav currentView={currentView} onViewChange={setCurrentView} />
    </div>
  );
};

export default Index;
