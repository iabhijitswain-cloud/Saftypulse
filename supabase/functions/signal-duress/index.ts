
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        );

        // Get the JWT from the request to identify the user
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) {
            throw new Error('Missing Authorization header');
        }

        const { data: { user }, error: userError } = await supabaseClient.auth.getUser(
            authHeader.replace('Bearer ', '')
        );

        if (userError || !user) {
            throw new Error('Invalid user token');
        }

        const { alertId, latitude, longitude, pin } = await req.json();

        // 1. Verify PIN (Optional explicit verification step)
        // In a real scenario, we would re-hash the PIN here and compare against DB
        // to ensure the request is authorized.

        // 2. LOG THE DURESS EVENT (Immutable Audit Log)
        // We log this BEFORE ANY UI changes so we have a record.
        await supabaseClient.from('audit_logs').insert({
            user_id: user.id,
            action: 'DURESS_SIGNAL_ACTIVATED',
            severity: 'critical',
            details: {
                alert_id: alertId,
                location: { latitude, longitude },
                timestamp: new Date().toISOString()
            },
            ip_address: req.headers.get('x-forwarded-for') ?? 'unknown'
        });

        // 3. ESCALATE THE ALERT (Stealth Mode)
        // We update the alert to 'duress' status but keep is_stealth true
        const { error: updateError } = await supabaseClient
            .from('sos_alerts')
            .update({
                status: 'duress',
                is_stealth: true,
                description: 'Duress signal received. User forced to deactivate.',
                resolved_at: null // Ensure it is NOT marked as resolved
            })
            .eq('id', alertId);

        if (updateError) throw updateError;

        // 4. QUEUE NOTIFICATIONS TO GUARDIANS
        // Fetch trusted contacts
        const { data: contacts } = await supabaseClient
            .from('trusted_contacts')
            .select('*')
            .eq('user_id', user.id)
            .eq('is_verified', true);

        if (contacts && contacts.length > 0) {
            const notifications = contacts.map(contact => ({
                user_id: user.id,
                alert_id: alertId,
                recipient_phone: contact.phone_number,
                message_body: `URGENT: ${user.email} has entered a DURESS CODE. They appear safe but have secretly requested help. Location: https://maps.google.com/?q=${latitude},${longitude}`,
                status: 'pending'
            }));

            await supabaseClient.from('notification_queue').insert(notifications);

            // TRIGGER SMS PROVIDER (e.g. Twilio)
            // Ideally, a separate worker processes the queue, but we can do it here for MVP
            console.log(`[MOCK SMS] Dispatching to ${contacts.length} contacts...`);
        }

        return new Response(
            JSON.stringify({
                success: true,
                message: 'Duress signal processed silently'
            }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200
            }
        );

    } catch (error) {
        console.error('Duress Signal Error:', error);
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400
            }
        );
    }
});
