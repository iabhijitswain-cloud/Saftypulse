
-- 1. AUDIT LOGS: Immutable record of security events
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    severity TEXT DEFAULT 'info', -- info, warning, critical
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Users can see their own logs (transparency)
CREATE POLICY "Users can view own audit logs" 
ON public.audit_logs FOR SELECT 
USING (auth.uid() = user_id);

-- Policy: Only server can insert (Prevent tampering)
CREATE POLICY "Service role can insert logs" 
ON public.audit_logs FOR INSERT 
TO service_role 
WITH CHECK (true);


-- 2. NOTIFICATION QUEUE: Async reliability for SMS/Push
CREATE TABLE IF NOT EXISTS public.notification_queue (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    alert_id UUID REFERENCES public.sos_alerts(id),
    recipient_phone TEXT NOT NULL,
    message_body TEXT NOT NULL,
    status TEXT DEFAULT 'pending', -- pending, sent, failed
    provider_id TEXT, -- e.g. Twilio Message SID
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notification_queue ENABLE ROW LEVEL SECURITY;

-- Trigger to update 'updated_at'
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_notification_queue_modtime
    BEFORE UPDATE ON public.notification_queue
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();
