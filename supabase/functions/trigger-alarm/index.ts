
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.14.0";

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
    // Create a Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get request body
    const { fromUserId, toUserId } = await req.json();
    
    if (!fromUserId || !toUserId) {
      return new Response(
        JSON.stringify({ error: "Missing user IDs" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Validate auth token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "No authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user || user.id !== fromUserId) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Create or update the alarm trigger
    const { data: triggerData, error: triggerError } = await supabase
      .from('alarm_triggers')
      .upsert(
        {
          from_user_id: fromUserId,
          to_user_id: toUserId,
          triggered_at: new Date().toISOString()
        },
        { onConflict: 'from_user_id,to_user_id' }
      );
    
    if (triggerError) {
      console.error('Error triggering alarm:', triggerError);
      return new Response(
        JSON.stringify({ error: "Failed to trigger alarm" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Check if there's a mutual match
    const { data: mutualData, error: mutualError } = await supabase
      .from('alarm_triggers')
      .select('*')
      .eq('from_user_id', toUserId)
      .eq('to_user_id', fromUserId)
      .single();
    
    // Create notification for the recipient
    const { data: notificationData, error: notificationError } = await supabase
      .from('notifications')
      .insert({
        type: mutualData ? 'match' : 'alarm',
        message: mutualData ? '¡Tienes un match!' : 'Alguien ha activado tu alarma',
        from_user_id: fromUserId,
        to_user_id: toUserId,
        read: false
      });
    
    if (notificationError) {
      console.error('Error creating notification:', notificationError);
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        isMatch: !!mutualData,
        notification: notificationData
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
