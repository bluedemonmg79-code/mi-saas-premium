import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

/**
 * Edge Function para Rate Limiting en Reservas Públicas
 * Previene abuso del sistema de bookings
 */

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RateLimitEntry {
  ip: string
  attempts: number
  last_attempt: string
}

serve(async (req) => {
  // Manejar CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Obtener IP del cliente
    const clientIP = req.headers.get('x-forwarded-for') || 'unknown'
    
    // Obtener datos de la request
    const { action, professionalId } = await req.json()

    // Configuración de límites
    const RATE_LIMITS = {
      booking_attempt: { max: 5, window: 3600 }, // 5 intentos por hora
      profile_view: { max: 30, window: 3600 }     // 30 vistas por hora
    }

    const limit = RATE_LIMITS[action as keyof typeof RATE_LIMITS]
    
    if (!limit) {
      throw new Error('Invalid action')
    }

    // Buscar intentos recientes de esta IP
    const { data: rateLimitData, error: fetchError } = await supabaseClient
      .from('rate_limits')
      .select('*')
      .eq('ip', clientIP)
      .eq('action', action)
      .eq('professional_id', professionalId)
      .single()

    const now = new Date()
    const windowStart = new Date(now.getTime() - limit.window * 1000)

    if (rateLimitData) {
      const lastAttempt = new Date(rateLimitData.last_attempt)
      
      // Si el último intento fue dentro de la ventana de tiempo
      if (lastAttempt > windowStart) {
        if (rateLimitData.attempts >= limit.max) {
          return new Response(
            JSON.stringify({
              allowed: false,
              message: 'Rate limit exceeded. Please try again later.',
              retryAfter: Math.ceil((lastAttempt.getTime() + limit.window * 1000 - now.getTime()) / 1000)
            }),
            {
              status: 429,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          )
        }

        // Incrementar contador
        await supabaseClient
          .from('rate_limits')
          .update({
            attempts: rateLimitData.attempts + 1,
            last_attempt: now.toISOString()
          })
          .eq('id', rateLimitData.id)

      } else {
        // Ventana expirada, resetear contador
        await supabaseClient
          .from('rate_limits')
          .update({
            attempts: 1,
            last_attempt: now.toISOString()
          })
          .eq('id', rateLimitData.id)
      }
    } else {
      // Primera vez, crear registro
      await supabaseClient
        .from('rate_limits')
        .insert({
          ip: clientIP,
          action,
          professional_id: professionalId,
          attempts: 1,
          last_attempt: now.toISOString()
        })
    }

    return new Response(
      JSON.stringify({
        allowed: true,
        message: 'Request allowed'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
