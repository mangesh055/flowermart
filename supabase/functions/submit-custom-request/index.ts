// ==============================================================================
// SANTOSH PUSHPA BHANDAR - SUPABASE EDGE FUNCTION: submit-custom-request
// ==============================================================================

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const payload = await req.json()
    const {
      customer_name,
      customer_phone,
      occasion,
      reference_image_url,
      description,
      flower_preferences,
      preferred_colours,
      budget_min,
      budget_max,
      required_date,
      additional_instructions,
    } = payload

    if (!customer_name || !customer_phone) {
      return new Response(
        JSON.stringify({ success: false, error: 'Customer name and phone number are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Generate unique Request Number
    const datePart = new Date().toISOString().slice(2, 10).replace(/-/g, '')
    const randPart = Math.floor(1000 + Math.random() * 9000)
    const requestNumber = `REQ-${datePart}-${randPart}`

    const { data: newReq, error } = await supabaseClient
      .from('custom_requests')
      .insert({
        request_number: requestNumber,
        customer_name: customer_name.trim(),
        customer_phone: customer_phone.trim(),
        occasion,
        reference_image_url,
        description,
        flower_preferences,
        preferred_colours,
        budget_min,
        budget_max,
        required_date,
        additional_instructions,
        status: 'new',
      })
      .select()
      .single()

    if (error || !newReq) {
      throw error || new Error('Failed to save request')
    }

    return new Response(
      JSON.stringify({ success: true, request: newReq }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err?.message || 'Server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

