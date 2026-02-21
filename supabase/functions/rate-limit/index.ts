// @ts-ignore
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// In-memory rate limit store (resets on cold start, good enough for edge)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(key: string, maxRequests: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }

  entry.count++;
  if (entry.count > maxRequests) {
    return true;
  }
  return false;
}

// @ts-ignore
Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action } = await req.json();

    // Get client IP or fallback
    const clientIp = req.headers.get('x-forwarded-for') || req.headers.get('cf-connecting-ip') || 'unknown';

    let maxRequests = 10;
    let windowMs = 60_000; // 1 minute

    if (action === 'auth') {
      maxRequests = 5; // 5 auth attempts per minute
      windowMs = 60_000;
    } else if (action === 'sos') {
      maxRequests = 3; // 3 SOS triggers per minute
      windowMs = 60_000;
    } else if (action === 'contact') {
      maxRequests = 20; // 20 contact operations per minute
      windowMs = 60_000;
    }

    const key = `${clientIp}:${action}`;
    const limited = isRateLimited(key, maxRequests, windowMs);

    return new Response(
      JSON.stringify({ allowed: !limited }),
      {
        status: limited ? 429 : 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Bad request' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
