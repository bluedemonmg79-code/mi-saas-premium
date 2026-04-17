import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from "https://esm.sh/stripe@12.0.0?target=deno"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2022-11-15',
      httpClient: Stripe.createFetchHttpClient(),
    })
    
    // Obtenemos el cliente de Stripe directamente por su email para no fallar si falta el ID
    // Usaremos el email del usuario autenticado (lo pasamos desde el front para seguridad en esta prueba)
    const { email } = await req.json()
    if (!email) throw new Error("Email no proporcionado")

    const customers = await stripe.customers.list({ email, limit: 1 })
    if (customers.data.length === 0) {
      throw new Error(`No existe un cliente en Stripe con el correo ${email}. ¿Ya hiciste una compra de prueba?`)
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customers.data[0].id,
      return_url: `${req.headers.get('origin')}/dashboard/settings`,
    })

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200, // Siempre 200 para capturar el error en el front
    })
  }
})
