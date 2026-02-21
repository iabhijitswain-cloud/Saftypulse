import { useAuth } from '@/contexts/AuthContext';
import { GuardianCircle } from '@/components/GuardianCircle';
import { PinSetup } from '@/components/PinSetup';
import { ProfileSettings } from '@/components/ProfileSettings';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { useState } from 'react';
import {
  User,
  LogOut,
  Mail,
  Shield,
  Crown,
  Loader2,
  Camera,
  PhoneCall
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { user, isGuest, signOut, isLoading } = useAuth();
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<'user' | 'volunteer' | 'moments'>('user');

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emergency" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 container max-w-lg mx-auto px-4 py-6 pb-24 space-y-6">
        {/* Profile Card */}
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <div className="w-14 h-14 rounded-full bg-emergency/20 flex items-center justify-center">
              <User className="w-7 h-7 text-emergency" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg text-foreground">
                  {user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'User'}
                </CardTitle>
                {isGuest && (
                  <span className="px-2 py-0.5 text-xs rounded-full bg-warning/20 text-warning">
                    Guest
                  </span>
                )}
              </div>
              <CardDescription className="text-muted-foreground flex items-center gap-1">
                <Mail className="w-3 h-3" />
                {user?.email}
              </CardDescription>
            </div>
          </CardHeader>

          {isGuest && (
            <CardContent className="pt-2">
              <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
                <div className="flex items-center gap-2 text-warning mb-1">
                  <Crown className="w-4 h-4" />
                  <span className="font-medium text-sm">Upgrade Your Account</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Create a full account to save your emergency contacts and settings permanently.
                </p>
                <Button
                  size="sm"
                  className="mt-3 bg-warning hover:bg-warning/90 text-warning-foreground"
                  onClick={() => navigate('/auth')}
                >
                  Create Account
                </Button>
              </div>
            </CardContent>
          )}
        </Card>

        {/* User Phone Wrapper */}
        <div className="space-y-4">
          <ProfileSettings />
        </div>

        {/* Security Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-foreground">
            <Shield className="w-5 h-5 text-emergency" />
            <h2 className="text-lg font-semibold">Security</h2>
          </div>

          <PinSetup />

          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 mb-1">
                <Camera className="w-5 h-5 text-emergency" />
                <CardTitle className="text-base text-foreground">Incident Log</CardTitle>
              </div>
              <CardDescription className="text-sm text-muted-foreground">
                Create a secure way for users to log suspicious individuals or incidents with photos, notes, and geotags.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full border-border hover:bg-accent hover:text-accent-foreground transition-all">
                Open Incident Log
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 mb-1">
                <PhoneCall className="w-5 h-5 text-emergency" />
                <CardTitle className="text-base text-foreground">Fake Call Escape</CardTitle>
              </div>
              <CardDescription className="text-sm text-muted-foreground">
                Design a realistic fake call escape feature with customizable caller name, ringtone, and timing to quickly get out of dangerous situations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full border-border hover:bg-accent hover:text-accent-foreground transition-all">
                Configure Fake Call
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Guardian Circle */}
        <div className="space-y-4">
          <GuardianCircle />
        </div>

        {/* Sign Out */}
        <Button
          variant="outline"
          className="w-full border-border hover:bg-muted"
          onClick={handleSignOut}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </main>

      <BottomNav currentView={currentView} onViewChange={setCurrentView} />
    </div>
  );
};

export default Settings;
