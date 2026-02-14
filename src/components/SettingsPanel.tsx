import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Bell, MapPin, Shield, Smartphone, Volume2 } from 'lucide-react';

interface SettingsPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SettingsPanel = ({ open, onOpenChange }: SettingsPanelProps) => {
  const [settings, setSettings] = useState({
    notifications: true,
    locationSharing: true,
    silentMode: false,
    volumeTrigger: true,
    autoRecord: true,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="bg-card border-border">
        <SheetHeader>
          <SheetTitle className="text-foreground flex items-center gap-2">
            <Shield className="w-5 h-5 text-emergency" />
            Settings
          </SheetTitle>
          <SheetDescription className="text-muted-foreground">
            Configure your SafePulse preferences
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Notifications */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <div>
                <Label className="text-foreground">Notifications</Label>
                <p className="text-xs text-muted-foreground">Receive emergency alerts</p>
              </div>
            </div>
            <Switch
              checked={settings.notifications}
              onCheckedChange={() => toggleSetting('notifications')}
            />
          </div>

          <Separator className="bg-border" />

          {/* Location Sharing */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-muted-foreground" />
              <div>
                <Label className="text-foreground">Location Sharing</Label>
                <p className="text-xs text-muted-foreground">Share GPS during emergencies</p>
              </div>
            </div>
            <Switch
              checked={settings.locationSharing}
              onCheckedChange={() => toggleSetting('locationSharing')}
            />
          </div>

          <Separator className="bg-border" />

          {/* Silent Mode */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Volume2 className="w-5 h-5 text-muted-foreground" />
              <div>
                <Label className="text-foreground">Silent Mode</Label>
                <p className="text-xs text-muted-foreground">No sounds during SOS</p>
              </div>
            </div>
            <Switch
              checked={settings.silentMode}
              onCheckedChange={() => toggleSetting('silentMode')}
            />
          </div>

          <Separator className="bg-border" />

          {/* Volume Trigger */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-muted-foreground" />
              <div>
                <Label className="text-foreground">Volume Button Trigger</Label>
                <p className="text-xs text-muted-foreground">Activate SOS with volume keys</p>
              </div>
            </div>
            <Switch
              checked={settings.volumeTrigger}
              onCheckedChange={() => toggleSetting('volumeTrigger')}
            />
          </div>

          <Separator className="bg-border" />

          {/* Auto Record */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-muted-foreground" />
              <div>
                <Label className="text-foreground">Auto Record</Label>
                <p className="text-xs text-muted-foreground">Record audio on trigger</p>
              </div>
            </div>
            <Switch
              checked={settings.autoRecord}
              onCheckedChange={() => toggleSetting('autoRecord')}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
