import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.14.0'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
});

const cryptoProvider = Stripe.createSubtleCryptoProvider();

serve(async (req) => {
  const signature = req.headers.get('Stripe-Signature');
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

  if (!signature || !webhookSecret) {
    return new Response('Missing Stripe signature or Webhook secret', { status: 400 });
  }

  try {
    const body = await req.text();
    // Verify the webhook signature
    const event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret, undefined, cryptoProvider);

    // Initialize Supabase admin client (can bypass RLS to update profiles)
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    );

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        // In a real app, you pass the `user.id` in `client_reference_id` when creating the Stripe Checkout session
        const userId = session.client_reference_id; 
        const customerId = session.customer;

        if (userId) {
          // Update the user's profile to 'pro'
          await supabase.from('profiles').upsert({
            id: userId,
            stripe_customer_id: customerId,
            subscription_status: 'active',
            plan_type: 'pro',
          });
          console.log(`✅ Usuario ${userId} actualizado a PRO.`);
        }
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const customerId = subscription.customer;
        
        // Revert user to free plan
        await supabase
          .from('profiles')
          .update({ subscription_status: 'canceled', plan_type: 'basic' })
          .eq('stripe_customer_id', customerId);
          
        console.log(`❌ Suscripción cancelada para cliente Stripe ${customerId}.`);
        break;
      }
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });

  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }
});
