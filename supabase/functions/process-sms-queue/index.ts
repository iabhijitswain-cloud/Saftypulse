// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Connect to MSG91 Flow API
async function sendMSG91SMS(to: string, messageBody: string) {
    const authKey = Deno.env.get("MSG91_AUTH_KEY");
    const templateId = Deno.env.get("MSG91_TEMPLATE_ID");

    if (!authKey || !templateId) {
        throw new Error("Missing MSG91 configuration (MSG91_AUTH_KEY or MSG91_TEMPLATE_ID)");
    }

    // MSG91 prefers numbers with country code but NO '+' sign
    // e.g., '919876543210'
    const cleanPhone = to.startsWith('+') ? to.substring(1) : to;

    const url = `https://control.msg91.com/api/v5/flow/`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'authkey': authKey,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            template_id: templateId,
            short_url: "0",
            recipients: [
                {
                    mobiles: cleanPhone,
                    // Note: 'message' here is the variable name defined in your MSG91 DLT Template.
                    // E.g., if your template is "Alert from Safetypulse: {#message#}", it will replace it here.
                    // Make sure the variable key matches exactly what you configure in MSG91!
                    message: messageBody,
                }
            ]
        })
    });

    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`MSG91 API Error: ${errText}`);
    }

    return await response.json();
}

serve(async (req: Request) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        );

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

        // 1. Fetch pending notifications
        const { data: pendingNotifications, error: fetchError } = await supabaseClient
            .from('notification_queue')
            .select('*')
            .eq('status', 'pending');

        if (fetchError) throw fetchError;

        if (!pendingNotifications || pendingNotifications.length === 0) {
            return new Response(
                JSON.stringify({ message: 'No pending notifications to process' }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
            );
        }

        console.log(`Processing ${pendingNotifications.length} pending SMS jobs via MSG91...`);

        const results = [];

        // 2. Process each notification
        for (const notification of pendingNotifications) {
            try {
                let phone = notification.recipient_phone;
                // Add India country code if basic 10-digit number
                if (phone && phone.length === 10) {
                    phone = `91${phone}`;
                }

                console.log(`Attempting to send SMS to ${phone} via MSG91`);

                await sendMSG91SMS(phone, notification.message_body);

                // Update row to 'sent'
                await supabaseClient
                    .from('notification_queue')
                    .update({ status: 'sent', sent_at: new Date().toISOString() })
                    .eq('id', notification.id);

                results.push({ id: notification.id, status: 'success' });

            } catch (err: any) {
                console.error(`Failed to send notification ${notification.id}:`, err);

                // Update row to 'failed'
                await supabaseClient
                    .from('notification_queue')
                    .update({
                        status: 'failed',
                        error_log: err.message,
                        sent_at: new Date().toISOString()
                    })
                    .eq('id', notification.id);

                results.push({ id: notification.id, status: 'failed', error: err.message });
            }
        }

        return new Response(
            JSON.stringify({
                success: true,
                processed: pendingNotifications.length,
                results
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        );

    } catch (error: any) {
        console.error('Queue Processing Error:', error);
        return new Response(
            JSON.stringify({ error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        );
    }
});
