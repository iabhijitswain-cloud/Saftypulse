import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Users,
  History,
  HelpCircle,
  FileText,
  Phone,
  Share2,
  Star,
  LogOut,
} from 'lucide-react';

interface HamburgerMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const menuItems = [
  { icon: Users, label: 'Trusted Contacts', description: 'Manage your emergency contacts' },
  { icon: History, label: 'Emergency History', description: 'View past SOS events' },
  { icon: Phone, label: 'Emergency Numbers', description: 'Local emergency services' },
  { icon: Share2, label: 'Share Location', description: 'Send your location now' },
  { icon: FileText, label: 'Safety Tips', description: 'Learn safety best practices' },
  { icon: HelpCircle, label: 'Help & Support', description: 'Get help with SafePulse' },
  { icon: Star, label: 'Rate Us', description: 'Leave a review' },
];

export const HamburgerMenu = ({ open, onOpenChange }: HamburgerMenuProps) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="bg-card border-border w-[300px]">
        <SheetHeader>
          <SheetTitle className="text-foreground text-left">Menu</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-1">
          {menuItems.map((item, index) => (
            <Button
              key={index}
              variant="ghost"
              className="w-full justify-start h-auto py-3 px-3 hover:bg-secondary"
              onClick={() => onOpenChange(false)}
            >
              <item.icon className="w-5 h-5 mr-3 text-muted-foreground" />
              <div className="text-left">
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </div>
            </Button>
          ))}

          <Separator className="bg-border my-4" />

          <Button
            variant="ghost"
            className="w-full justify-start h-auto py-3 px-3 text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => onOpenChange(false)}
          >
            <LogOut className="w-5 h-5 mr-3" />
            <div className="text-left">
              <p className="text-sm font-medium">Sign Out</p>
              <p className="text-xs opacity-70">Log out of your account</p>
            </div>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
