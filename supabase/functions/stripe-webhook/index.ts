import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from "npm:stripe@^12.0.0"
import { createClient } from "npm:@supabase/supabase-js@2"

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') as string, {
  apiVersion: '2022-11-15',
  httpClient: Stripe.createFetchHttpClient(),
})

const cryptoProvider = Stripe.createSubtleCryptoProvider()

serve(async (request) => {
  const signature = request.headers.get("Stripe-Signature")
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET")

  try {
    if (!signature || !webhookSecret) {
      return new Response("Missing Stripe secrets.", { status: 400 })
    }
    
    // Validar la firma criptográfica enviada por los servidores de Stripe
    const body = await request.text()
    const event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      webhookSecret,
      undefined,
      cryptoProvider
    )

    // Evento de pago exitoso (suscripción o pago único completado)
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as any
      // 'client_reference_id' debe configurarse en el frontend (React) al momento de enviar al cliente al checkout de Stripe
      const userId = session.client_reference_id 

      if (userId) {
        // Inicializar cliente de Supabase con permisos de administrador (Service Role)
        const supabaseUrl = Deno.env.get("SUPABASE_URL")!
        const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
        const supabase = createClient(supabaseUrl, supabaseKey)

        // Habilitar inmediatamente las ventajas Premium
        await supabase
          .from('profiles')
          .update({ subscription_status: 'active', plan_type: 'premium' })
          .eq('id', userId)
          
        console.log(`Usuario ${userId} ha sido ascendido a Premium exitosamente.`)
      } else {
         console.warn("Se completó el checkout pero no se proporcionó client_reference_id")
      }
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 })
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`)
    return new Response(`Webhook Error: ${err.message}`, { status: 400 })
  }
})
