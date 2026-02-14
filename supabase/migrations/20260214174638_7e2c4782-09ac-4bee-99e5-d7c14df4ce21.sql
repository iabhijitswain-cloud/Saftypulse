
-- Add description/notes to sos_alerts for richer event logging
ALTER TABLE public.sos_alerts ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE public.sos_alerts ADD COLUMN IF NOT EXISTS location_text text;
ALTER TABLE public.sos_alerts ADD COLUMN IF NOT EXISTS alert_type text NOT NULL DEFAULT 'sos';

-- Create emergency_notes table for adding notes to events
CREATE TABLE public.emergency_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  alert_id UUID NOT NULL REFERENCES public.sos_alerts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.emergency_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notes"
  ON public.emergency_notes FOR SELECT
  USING (is_owner(user_id));

CREATE POLICY "Users can create own notes"
  ON public.emergency_notes FOR INSERT
  WITH CHECK (is_owner(user_id));

CREATE POLICY "Users can delete own notes"
  ON public.emergency_notes FOR DELETE
  USING (is_owner(user_id));
