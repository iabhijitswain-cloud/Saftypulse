
-- CRITICAL FIX: Remove the dangerous public location viewing policy
DROP POLICY IF EXISTS "Anyone can view active SOS locations" ON public.user_locations;

-- Create a function to check if a user is a trusted contact of the location owner
CREATE OR REPLACE FUNCTION public.is_trusted_contact_of(location_owner_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.trusted_contacts
    WHERE user_id = location_owner_id
    AND phone_number IN (
      SELECT phone_number FROM public.profiles WHERE id = auth.uid()
    )
    AND is_verified = true
  )
$$;

-- Allow only verified trusted contacts to view active SOS locations (non-stealth)
CREATE POLICY "Trusted contacts can view active SOS locations"
ON public.user_locations
FOR SELECT
USING (
  is_stealth = false
  AND public.has_active_sos(user_id)
  AND public.is_trusted_contact_of(user_id)
);

-- Add missing policies: profiles INSERT and DELETE
CREATE POLICY "Users can insert own profile"
ON public.profiles
FOR INSERT
WITH CHECK (is_owner(id));

CREATE POLICY "Users can delete own profile"
ON public.profiles
FOR DELETE
USING (is_owner(id));

-- Add missing DELETE policies for sos_alerts
CREATE POLICY "Users can delete own alerts"
ON public.sos_alerts
FOR DELETE
USING (is_owner(user_id));

-- Add missing UPDATE/DELETE for user_locations
CREATE POLICY "Users can update own locations"
ON public.user_locations
FOR UPDATE
USING (is_owner(user_id));

CREATE POLICY "Users can delete own locations"
ON public.user_locations
FOR DELETE
USING (is_owner(user_id));

-- Add missing UPDATE for emergency_notes
CREATE POLICY "Users can update own notes"
ON public.emergency_notes
FOR UPDATE
USING (is_owner(user_id));
