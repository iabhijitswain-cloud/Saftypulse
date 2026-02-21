import { useAuth } from '@/contexts/AuthContext';
import { GuardianCircle } from '@/components/GuardianCircle';
import { PinSetup } from '@/components/PinSetup';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';
import {
  User,
  LogOut,
  Mail,
  Shield,
  Crown,
  Loader2,
  Camera,
  PhoneCall,
  EyeOff,
  ShieldAlert,
  Bot,
  Watch,
  Car
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { user, isGuest, signOut, isLoading } = useAuth();
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<'user' | 'volunteer' | 'moments'>('user');
  const [aiEnabled, setAiEnabled] = useState(true);

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

        {/* Connected Devices Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-foreground">
            <Watch className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Connected Devices</h2>
          </div>

          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 mb-1">
                <Watch className="w-5 h-5 text-foreground" />
                <CardTitle className="text-base text-foreground">Wearable Integration</CardTitle>
              </div>
              <CardDescription className="text-sm text-muted-foreground">
                Connect your smartwatch or smart ring for silent, gesture-based emergency activation.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full border-border hover:bg-accent hover:text-accent-foreground transition-all">
                Setup Wearable Device
              </Button>
            </CardContent>
          </Card>
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

          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 mb-1">
                <EyeOff className="w-5 h-5 text-emergency" />
                <CardTitle className="text-base text-foreground">Anti-Tracking Protection</CardTitle>
              </div>
              <CardDescription className="text-sm text-muted-foreground">
                Create mechanisms to prevent abusers from tracking app usage or accessing emergency logs.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full border-border hover:bg-accent hover:text-accent-foreground transition-all">
                Configure Stealth Mode
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 mb-1">
                <ShieldAlert className="w-5 h-5 text-emergency" />
                <CardTitle className="text-base text-foreground">Threat Model Analysis</CardTitle>
              </div>
              <CardDescription className="text-sm text-muted-foreground">
                Create a full threat model for the application, including insider threats and external cyberattacks.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full border-border hover:bg-accent hover:text-accent-foreground transition-all">
                View Threat Model
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 mb-1">
                <Car className="w-5 h-5 text-emergency" />
                <CardTitle className="text-base text-foreground">AI Safe Ride Tracking</CardTitle>
              </div>
              <CardDescription className="text-sm text-muted-foreground">
                AI-powered driver verification and live ride tracking. The AI continuously monitors your route for unexpected deviations and actively suggests safe actions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full border-border hover:bg-accent hover:text-accent-foreground transition-all">
                Start AI Safe Ride
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card border-border overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent opacity-50" />
            <CardHeader className="pb-3 relative z-10 flex flex-row items-center justify-between">
              <div className="pr-4">
                <div className="flex items-center gap-2 mb-1">
                  <Bot className="w-5 h-5 text-primary" />
                  <CardTitle className="text-base text-foreground">AI Safety Sentinel</CardTitle>
                </div>
                <CardDescription className="text-sm text-muted-foreground">
                  Automated AI system that detects distress in your texts and actively suggests safety actions. Controls all intelligent security measures.
                </CardDescription>
              </div>
              <Switch checked={aiEnabled} onCheckedChange={setAiEnabled} />
            </CardHeader>
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
