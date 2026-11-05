// ==============================================================================
// SANTOSH PUSHPA BHANDAR - SUPABASE EDGE FUNCTION: create-order
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
      customer_alternate_phone,
      fulfilment_type,
      delivery_address,
      required_date,
      required_time,
      special_instructions,
      idempotency_key,
      items, // array of { product_id, quantity }
    } = payload

    // 1. Check idempotency
    if (idempotency_key) {
      const { data: existing } = await supabaseClient
        .from('orders')
        .select('*, items:order_items(*)')
        .eq('idempotency_key', idempotency_key)
        .maybeSingle()

      if (existing) {
        return new Response(
          JSON.stringify({ success: true, order: existing }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    // 2. Fetch current prices & verify availability from database
    const productIds = items.map((i: any) => i.product_id)
    const { data: dbProducts, error: prodErr } = await supabaseClient
      .from('products')
      .select('*')
      .in('id', productIds)

    if (prodErr || !dbProducts || dbProducts.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'Could not fetch current product data' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    let subtotal = 0
    const verifiedOrderItems = []

    for (const item of items) {
      const dbProd = dbProducts.find((p: any) => p.id === item.product_id)
      if (!dbProd) {
        return new Response(
          JSON.stringify({ success: false, error: `Product not found: ${item.product_id}` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      if (!dbProd.is_available) {
        return new Response(
          JSON.stringify({ success: false, error: `"${dbProd.name}" is currently out of stock` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const lineTotal = Number(dbProd.price) * item.quantity
      subtotal += lineTotal

      verifiedOrderItems.push({
        product_id: dbProd.id,
        product_name: dbProd.name,
        product_sku: dbProd.sku,
        price_unit: dbProd.price_unit,
        unit_price: Number(dbProd.price),
        quantity: item.quantity,
        line_total: lineTotal,
      })
    }

    // 3. Store settings & delivery charge
    const { data: settings } = await supabaseClient
      .from('store_settings')
      .select('*')
      .limit(1)
      .maybeSingle()

    const deliveryCharge =
      fulfilment_type === 'delivery'
        ? (Number(settings?.default_delivery_charge) || 50)
        : 0
    const totalAmount = subtotal + deliveryCharge

    // 4. Generate unique Order number
    const datePart = new Date().toISOString().slice(2, 10).replace(/-/g, '')
    const randPart = Math.floor(1000 + Math.random() * 9000)
    const orderNumber = `SPB-${datePart}-${randPart}`

    // 5. Insert order
    const { data: newOrder, error: orderInsertErr } = await supabaseClient
      .from('orders')
      .insert({
        order_number: orderNumber,
        customer_name: customer_name.trim(),
        customer_phone: customer_phone.trim(),
        customer_alternate_phone,
        fulfilment_type,
        delivery_address: fulfilment_type === 'delivery' ? delivery_address : null,
        required_date,
        required_time,
        special_instructions,
        subtotal,
        delivery_charge: deliveryCharge,
        total_amount: totalAmount,
        status: 'pending',
        payment_status: 'pending',
        idempotency_key,
      })
      .select()
      .single()

    if (orderInsertErr || !newOrder) {
      throw orderInsertErr || new Error('Failed to create order record')
    }

    // 6. Insert items
    const itemsToInsert = verifiedOrderItems.map((i) => ({
      ...i,
      order_id: newOrder.id,
    }))
    await supabaseClient.from('order_items').insert(itemsToInsert)

    // 7. Status history record
    await supabaseClient.from('order_status_history').insert({
      order_id: newOrder.id,
      status: 'pending',
      note: 'Order submitted via WhatsApp Click-to-Chat flow',
    })

    // 8. Return prepared order & WhatsApp message
    return new Response(
      JSON.stringify({
        success: true,
        order: {
          ...newOrder,
          items: itemsToInsert,
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err?.message || 'Internal Server Error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

