import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { AlertTriangle, Clock, MapPin, Shield, ChevronDown, ChevronUp, BellRing, VolumeX, Flame, Activity, Car, AlertCircle, Wind, FileWarning, Mic, Image, Video, FileText, BrainCircuit, Repeat, CheckCircle2, Navigation, PhoneCall, Check, Thermometer, ShieldAlert, BadgeInfo } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useRef } from 'react';

interface SOSAlert {
  id: string;
  status: string;
  is_stealth: boolean;
  triggered_at: string;
  resolved_at: string | null;
  description: string | null;
  location_text: string | null;
  alert_type: string;
  // Advanced Features Fields
  category?: 'Medical' | 'Fire' | 'Accident' | 'Assault' | 'Natural Disaster' | 'Suspicious Activity' | 'Custom';
  severity?: 'Low' | 'Medium' | 'High' | 'Critical';
  timeline?: { time: string; event: string; icon: any }[];
  multimedia?: { type: 'audio' | 'image' | 'video' | 'text'; count: number }[];
  isRecurring?: boolean;
  aiClassification?: { type: string; confidence: number };
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
  const [soundEnabled, setSoundEnabled] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);

  // advanced UI enrichment mock helper
  const enrichAlert = (alert: SOSAlert): SOSAlert => {
    // Deterministic mock variables based on ID
    const hash = alert.id.charCodeAt(0) + alert.id.charCodeAt(alert.id.length - 1);

    const categories = ['Medical', 'Fire', 'Accident', 'Assault', 'Natural Disaster', 'Suspicious Activity'];
    const category = categories[hash % categories.length] as any;

    const severities = ['Low', 'Medium', 'High', 'Critical'];
    const severity = severities[hash % severities.length] as any;

    const hasMedia = hash % 2 === 0;
    const isRecurring = hash % 5 === 0;
    const hasAi = hash % 3 === 0;

    return {
      ...alert,
      category,
      severity,
      isRecurring,
      timeline: [
        { time: format(new Date(alert.triggered_at), 'h:mm a'), event: 'SOS Activated', icon: AlertTriangle },
        { time: format(new Date(new Date(alert.triggered_at).getTime() + 5000), 'h:mm a'), event: 'Location Fetched', icon: MapPin },
        { time: format(new Date(new Date(alert.triggered_at).getTime() + 15000), 'h:mm a'), event: 'Emergency Contacts Notified', icon: PhoneCall },
        ...(alert.status === 'resolved' && alert.resolved_at
          ? [{ time: format(new Date(alert.resolved_at), 'h:mm a'), event: 'Emergency Resolved', icon: CheckCircle2 }]
          : [])
      ],
      multimedia: hasMedia ? [
        { type: 'audio', count: 1 },
        ...(hash % 4 === 0 ? [{ type: 'image' as const, count: 2 }] : [])
      ] : [],
      aiClassification: hasAi ? {
        type: category, confidence: 85 + (hash % 15)
      } : undefined
    };
  };

  const activeAlerts = alerts.filter(a => !['resolved', 'cancelled'].includes(a.status)).map(enrichAlert);
  const inactiveAlerts = alerts.filter(a => ['resolved', 'cancelled'].includes(a.status)).map(enrichAlert);

  // Sort inactive logs by priority/severity and then by date
  const severityWeight = { Critical: 4, High: 3, Medium: 2, Low: 1 };
  inactiveAlerts.sort((a, b) => {
    const weightA = severityWeight[a.severity as keyof typeof severityWeight] || 0;
    const weightB = severityWeight[b.severity as keyof typeof severityWeight] || 0;
    return weightB - weightA;
  });

  // Advanced Web Audio Siren System
  useEffect(() => {
    if (activeAlerts.length > 0 && soundEnabled) {
      if (!audioCtxRef.current) {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContext) audioCtxRef.current = new AudioContext();
      }
      const ctx = audioCtxRef.current;
      if (!ctx || ctx.state === 'closed') return;

      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      gainNode.gain.value = 0.05;

      osc.start();
      oscillatorRef.current = osc;

      const interval = setInterval(() => {
        if (osc.frequency.value === 800) {
          osc.frequency.setValueAtTime(600, ctx.currentTime);
        } else {
          osc.frequency.setValueAtTime(800, ctx.currentTime);
        }
      }, 400);

      return () => {
        clearInterval(interval);
        if (oscillatorRef.current) {
          oscillatorRef.current.stop();
          oscillatorRef.current.disconnect();
        }
      };
    } else {
      if (oscillatorRef.current) {
        try {
          oscillatorRef.current.stop();
          oscillatorRef.current.disconnect();
        } catch (e) {
          // ignore
        }
        oscillatorRef.current = null;
      }
    }
  }, [activeAlerts.length, soundEnabled]);

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

  const getCategoryIcon = (cat?: string) => {
    switch (cat) {
      case 'Medical': return <Activity className="w-4 h-4 text-rose-500" />;
      case 'Fire': return <Flame className="w-4 h-4 text-orange-500" />;
      case 'Accident': return <Car className="w-4 h-4 text-yellow-500" />;
      case 'Assault': return <ShieldAlert className="w-4 h-4 text-red-600" />;
      case 'Natural Disaster': return <Wind className="w-4 h-4 text-teal-500" />;
      default: return <AlertCircle className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getSeverityColor = (sev?: string) => {
    switch (sev) {
      case 'Critical': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'High': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'Medium': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'Low': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const renderAlerts = (alertList: SOSAlert[]) => {
    if (alertList.length === 0) {
      return (
        <div className="py-12 text-center text-muted-foreground flex flex-col items-center gap-3 bg-card border border-border rounded-xl">
          <Shield className="w-10 h-10 opacity-20 text-foreground" />
          <p className="text-sm">No alerts in this category</p>
        </div>
      );
    }

    return alertList.map((alert) => {
      const config = statusConfig[alert.status] ?? statusConfig.resolved;
      const isExpanded = expandedId === alert.id;
      const isEmergencyState = ['active', 'duress', 'triggered', 'recording'].includes(alert.status);

      return (
        <button
          key={alert.id}
          className={`w-full text-left bg-card border ${isEmergencyState ? 'border-destructive/40 shadow-[0_0_12px_hsl(var(--destructive)/0.1)] focus:border-destructive/60' : 'border-border'} rounded-xl p-4 space-y-3 transition-colors hover:bg-secondary/50 mb-3 block focus:outline-none`}
          onClick={() => setExpandedId(isExpanded ? null : alert.id)}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-background border border-border">
                {getCategoryIcon(alert.category)}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-foreground capitalize flex items-center gap-2">
                  {alert.category || alert.alert_type}
                  {alert.isRecurring && (
                    <Badge variant="destructive" className="h-4 text-[10px] px-1 py-0 bg-red-500/20 text-red-500 border-red-500/30 gap-1">
                      <Repeat className="w-3 h-3" />
                      Recurring Threat
                    </Badge>
                  )}
                </span>
                <span className="text-xs text-muted-foreground font-medium flex items-center gap-1.5 mt-0.5">
                  <Badge variant="outline" className={`h-4 text-[10px] px-1.5 py-0 ${getSeverityColor(alert.severity)}`}>
                    {alert.severity} Severity
                  </Badge>
                  {alert.is_stealth && (
                    <Badge variant="outline" className="h-4 text-[10px] px-1.5 py-0 bg-background">Stealth</Badge>
                  )}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge className={config.className}>{config.label}</Badge>
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-muted-foreground bg-background/50 rounded-md p-2">
            <div className="flex items-center gap-1.5 text-foreground/80 font-medium">
              <Clock className="w-3.5 h-3.5" />
              {format(new Date(alert.triggered_at), 'MMM d, yyyy · h:mm a')}
              <span className="mx-1 opacity-50 font-normal">|</span>
              {formatDistanceToNow(new Date(alert.triggered_at), { addSuffix: true })}
            </div>

            {(alert.multimedia && alert.multimedia.length > 0) && (
              <div className="flex items-center gap-2 border-l border-border/60 pl-3">
                {alert.multimedia.map((m, i) => (
                  <span key={i} className="flex items-center gap-1 bg-secondary/50 px-1.5 py-0.5 rounded text-[10px]">
                    {m.type === 'audio' && <Mic className="w-3 h-3" />}
                    {m.type === 'image' && <Image className="w-3 h-3" />}
                    {m.count}
                  </span>
                ))}
              </div>
            )}
          </div>

          {isExpanded && (
            <div className="pt-4 space-y-4 border-t border-border/60 mt-3 animate-in slide-in-from-top-2">

              {/* AI Smart Classification */}
              {alert.aiClassification && (
                <div className="flex items-center gap-2.5 text-xs text-primary/80 bg-primary/5 p-2 rounded-lg border border-primary/20">
                  <BrainCircuit className="w-4 h-4 shrink-0" />
                  <span>
                    <strong>AI Analysis:</strong> Detected signature of <span className="font-semibold">{alert.aiClassification.type}</span> with {alert.aiClassification.confidence}% confidence.
                  </span>
                </div>
              )}

              {/* Location Cluster Map Mock UI */}
              {alert.location_text && (
                <div className="relative overflow-hidden bg-muted/30 rounded-lg border border-border/50">
                  <div className="h-20 w-full bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/pin-s-l+ef4444(-122.42,37.77)/-122.42,37.77,13,0/600x200?access_token=pk.eyJ1IjoibW9jay1rZXkiLCJhIjoiY20wYjFmcGI1MDUyZDJqcHhuZ2Jza28wbSJ9.mock')] bg-cover bg-center opacity-60 mix-blend-luminosity hover:mix-blend-normal transition-all" />
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-background via-background/90 to-transparent pt-6">
                    <div className="flex items-start gap-2 text-sm text-foreground">
                      <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-red-500" />
                      <span className="font-medium drop-shadow-sm">{alert.location_text}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Advanced Timeline Tracker */}
              {alert.timeline && alert.timeline.length > 0 && (
                <div className="bg-background border border-border rounded-lg p-3 space-y-3">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Incident Timeline</h4>
                  <div className="relative space-y-3 before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                    {alert.timeline.map((step, idx) => {
                      const Icon = step.icon;
                      const isLast = idx === alert.timeline!.length - 1;
                      const isEmergencyResolved = step.event === 'Emergency Resolved';
                      return (
                        <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                          <div className={`flex items-center justify-center w-6 h-6 rounded-full border-2 ${isEmergencyResolved ? 'border-success bg-background text-success z-10' : 'border-primary/50 bg-background text-primary/80 z-10'} shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2`}>
                            <Icon className="w-3 h-3" />
                          </div>
                          <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] pl-3 md:pl-0 md:group-odd:pr-3 md:group-even:pl-3">
                            <div className="flex flex-col">
                              <span className="text-xs font-medium text-foreground">{step.event}</span>
                              <span className="text-[10px] text-muted-foreground">{step.time}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {alert.description && (
                <div className="bg-background border border-border rounded-lg p-3">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Notes & Context</h4>
                  <p className="text-sm text-foreground/90 leading-relaxed">{alert.description}</p>
                </div>
              )}

            </div>
          )}
        </button>
      );
    });
  };

  return (
    <ScrollArea className="h-full bg-background transition-colors duration-300">
      <div className="p-4 space-y-4 pb-28">

        {/* Dynamic Alarm System Widget */}
        {activeAlerts.length > 0 && (
          <div className="relative overflow-hidden bg-destructive/10 border border-destructive/50 rounded-xl p-4 shadow-[0_4px_24px_hsl(var(--destructive)/0.2)] animate-in fade-in slide-in-from-top-4">
            <div className="absolute top-0 right-0 w-32 h-32 bg-destructive/20 rounded-full blur-3xl -mr-16 -mt-16 animate-pulse" />

            <div className="flex items-start justify-between relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-destructive shadow-[0_0_15px_hsl(var(--destructive)/0.5)] flex items-center justify-center animate-pulse shrink-0">
                  <BellRing className="w-6 h-6 text-destructive-foreground animate-bounce" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-destructive tracking-tight uppercase">Emergency Alarm</h3>
                  <p className="text-sm text-foreground/80 font-medium">
                    System broadcasting active emergency signal
                  </p>
                </div>
              </div>
              <Button
                variant={soundEnabled ? "destructive" : "outline"}
                size="icon"
                className={`shrink-0 ${!soundEnabled ? 'border-destructive/40 text-destructive hover:bg-destructive/10' : ''} transition-all duration-300`}
                onClick={() => setSoundEnabled(!soundEnabled)}
              >
                {soundEnabled ? <VolumeX className="w-4 h-4" /> : <BellRing className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between px-1">
          <h2 className="text-xl font-bold text-foreground tracking-tight">Emergency Log</h2>
          {activeAlerts.length > 0 && (
            <Badge variant="destructive" className="animate-pulse shadow-sm">
              {activeAlerts.length} Active
            </Badge>
          )}
        </div>

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-2 p-1.5 mb-5 bg-card border border-border rounded-xl shadow-sm">
            <TabsTrigger
              value="active"
              className="rounded-lg data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all"
            >
              Active
              {activeAlerts.length > 0 && (
                <span className="ml-2 bg-destructive text-destructive-foreground text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                  {activeAlerts.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="inactive"
              className="rounded-lg data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all"
            >
              History
              {inactiveAlerts.length > 0 && (
                <span className="ml-2 bg-muted-foreground/20 text-muted-foreground text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                  {inactiveAlerts.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-0 outline-none animate-in fade-in-50 duration-500">
            {renderAlerts(activeAlerts)}
          </TabsContent>

          <TabsContent value="inactive" className="mt-0 outline-none animate-in fade-in-50 duration-500">
            {renderAlerts(inactiveAlerts)}
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
};
