-- =============================================
-- PHASE 1: Core Security Schema for AuraGuard
-- =============================================

-- 1. Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  phone_number TEXT,
  is_guest BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. Create trusted_contacts table (Guardian Circle)
CREATE TABLE public.trusted_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  relationship TEXT,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. Create user_pins table for secure PIN storage
CREATE TABLE public.user_pins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  pin_hash TEXT NOT NULL,
  duress_pin_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 4. Create sos_alerts table
CREATE TABLE public.sos_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'resolved', 'duress')),
  triggered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  is_stealth BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 5. Create user_locations table for tracking during SOS
CREATE TABLE public.user_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sos_alert_id UUID REFERENCES public.sos_alerts(id) ON DELETE SET NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  accuracy DOUBLE PRECISION,
  address TEXT,
  is_stealth BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- =============================================
-- HELPER FUNCTIONS (Security Definer)
-- =============================================

-- Function to check if user owns a record
CREATE OR REPLACE FUNCTION public.is_owner(record_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT auth.uid() = record_user_id
$$;

-- Function to check if user has an active SOS alert
CREATE OR REPLACE FUNCTION public.has_active_sos(target_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.sos_alerts
    WHERE user_id = target_user_id
    AND status IN ('active', 'duress')
  )
$$;

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- =============================================
-- TRIGGERS
-- =============================================

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_trusted_contacts_updated_at
  BEFORE UPDATE ON public.trusted_contacts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_pins_updated_at
  BEFORE UPDATE ON public.user_pins
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- ENABLE ROW LEVEL SECURITY
-- =============================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trusted_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_pins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sos_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_locations ENABLE ROW LEVEL SECURITY;

-- =============================================
-- RLS POLICIES: profiles
-- =============================================

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (public.is_owner(id));

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (public.is_owner(id));

-- =============================================
-- RLS POLICIES: trusted_contacts
-- =============================================

CREATE POLICY "Users can view own contacts"
  ON public.trusted_contacts FOR SELECT
  USING (public.is_owner(user_id));

CREATE POLICY "Users can create own contacts"
  ON public.trusted_contacts FOR INSERT
  WITH CHECK (public.is_owner(user_id));

CREATE POLICY "Users can update own contacts"
  ON public.trusted_contacts FOR UPDATE
  USING (public.is_owner(user_id));

CREATE POLICY "Users can delete own contacts"
  ON public.trusted_contacts FOR DELETE
  USING (public.is_owner(user_id));

-- =============================================
-- RLS POLICIES: user_pins
-- =============================================

CREATE POLICY "Users can view own PIN"
  ON public.user_pins FOR SELECT
  USING (public.is_owner(user_id));

CREATE POLICY "Users can create own PIN"
  ON public.user_pins FOR INSERT
  WITH CHECK (public.is_owner(user_id));

CREATE POLICY "Users can update own PIN"
  ON public.user_pins FOR UPDATE
  USING (public.is_owner(user_id));

CREATE POLICY "Users can delete own PIN"
  ON public.user_pins FOR DELETE
  USING (public.is_owner(user_id));

-- =============================================
-- RLS POLICIES: sos_alerts
-- =============================================

CREATE POLICY "Users can view own alerts"
  ON public.sos_alerts FOR SELECT
  USING (public.is_owner(user_id));

CREATE POLICY "Users can create own alerts"
  ON public.sos_alerts FOR INSERT
  WITH CHECK (public.is_owner(user_id));

CREATE POLICY "Users can update own alerts"
  ON public.sos_alerts FOR UPDATE
  USING (public.is_owner(user_id));

-- =============================================
-- RLS POLICIES: user_locations
-- =============================================

CREATE POLICY "Users can view own locations"
  ON public.user_locations FOR SELECT
  USING (public.is_owner(user_id));

CREATE POLICY "Users can insert own locations"
  ON public.user_locations FOR INSERT
  WITH CHECK (public.is_owner(user_id));

-- View for volunteers to see active SOS locations (public read during active SOS)
CREATE POLICY "Anyone can view active SOS locations"
  ON public.user_locations FOR SELECT
  USING (public.has_active_sos(user_id) AND is_stealth = false);

-- =============================================
-- INDEXES for performance
-- =============================================

CREATE INDEX idx_trusted_contacts_user_id ON public.trusted_contacts(user_id);
CREATE INDEX idx_user_pins_user_id ON public.user_pins(user_id);
CREATE INDEX idx_sos_alerts_user_id ON public.sos_alerts(user_id);
CREATE INDEX idx_sos_alerts_status ON public.sos_alerts(status);
CREATE INDEX idx_user_locations_user_id ON public.user_locations(user_id);
CREATE INDEX idx_user_locations_sos_alert_id ON public.user_locations(sos_alert_id);