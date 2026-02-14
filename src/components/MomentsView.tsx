import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { AlertTriangle, Clock, MapPin, Shield, ChevronDown, ChevronUp } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface SOSAlert {
  id: string;
  status: string;
  is_stealth: boolean;
  triggered_at: string;
  resolved_at: string | null;
  description: string | null;
  location_text: string | null;
  alert_type: string;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  active: { label: 'Active', className: 'bg-destructive text-destructive-foreground' },
  duress: { label: 'Duress', className: 'bg-destructive text-destructive-foreground' },
  resolved: { label: 'Resolved', className: 'bg-muted text-muted-foreground' },
  cancelled: { label: 'Cancelled', className: 'bg-secondary text-secondary-foreground' },
};

export const MomentsView = () => {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<SOSAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchAlerts = async () => {
      const { data, error } = await supabase
        .from('sos_alerts')
        .select('*')
        .eq('user_id', user.id)
        .order('triggered_at', { ascending: false });

      if (!error && data) {
        setAlerts(data as SOSAlert[]);
      }
      setLoading(false);
    };

    fetchAlerts();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-6 gap-4">
        <Shield className="w-16 h-16 text-muted-foreground/40" />
        <div>
          <h3 className="text-lg font-semibold text-foreground">No Events Yet</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Your emergency event log will appear here when SOS alerts are triggered.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-3 pb-20">
        <h2 className="text-lg font-semibold text-foreground mb-4">Emergency Event Log</h2>
        {alerts.map((alert) => {
          const config = statusConfig[alert.status] ?? statusConfig.resolved;
          const isExpanded = expandedId === alert.id;

          return (
            <button
              key={alert.id}
              className="w-full text-left bg-card border border-border rounded-xl p-4 space-y-2 transition-colors hover:bg-secondary/50"
              onClick={() => setExpandedId(isExpanded ? null : alert.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-destructive" />
                  <span className="text-sm font-medium text-foreground capitalize">
                    {alert.alert_type} Alert
                  </span>
                  {alert.is_stealth && (
                    <Badge variant="outline" className="text-xs">Stealth</Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={config.className}>{config.label}</Badge>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>
                  {format(new Date(alert.triggered_at), 'MMM d, yyyy · h:mm a')}
                  {' · '}
                  {formatDistanceToNow(new Date(alert.triggered_at), { addSuffix: true })}
                </span>
              </div>

              {isExpanded && (
                <div className="pt-2 space-y-2 border-t border-border mt-2">
                  {alert.location_text && (
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                      <span>{alert.location_text}</span>
                    </div>
                  )}
                  {alert.description && (
                    <p className="text-sm text-muted-foreground">{alert.description}</p>
                  )}
                  {alert.resolved_at && (
                    <p className="text-xs text-muted-foreground">
                      Resolved: {format(new Date(alert.resolved_at), 'MMM d, yyyy · h:mm a')}
                    </p>
                  )}
                  {!alert.resolved_at && !alert.description && !alert.location_text && (
                    <p className="text-xs text-muted-foreground italic">No additional details</p>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </ScrollArea>
  );
};
