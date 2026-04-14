import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const resendApiKey = Deno.env.get("RESEND_API_KEY")

serve(async (req) => {
  try {
    const payload = await req.json()
    const record = payload.record

    if (!record || !record.email) {
      return new Response("No email provided or not a DB webhook", { status: 400 })
    }

    const { email, name, full_date, time } = record

    // Resend API call para enviar correo al cliente
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "Notificaciones <onboarding@resend.dev>", // Cambia a tu dominio cuando lo verifiques
        to: email, // Nota: Resend Free solo permite enviar a tu propio correo verificado (para pruebas)
        subject: "Confirmación de tu Cita",
        html: `
          <div style="font-family: sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 10px;">
            <h2 style="color: #0f172a;">¡Cita Confirmada! ✅</h2>
            <p style="color: #475569; font-size: 16px;">Hola <strong>${name}</strong>,</p>
            <p style="color: #475569; font-size: 16px;">Tu solicitud de espacio ah sido agendada con éxito para la siguiente fecha:</p>
            <div style="background: #f1f5f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; font-size: 16px;">📅 <b>Fecha:</b> ${full_date}</p>
              <p style="margin: 5px 0 0 0; font-size: 16px;">⏰ <b>Hora:</b> ${time}</p>
            </div>
            <p style="color: #475569; font-size: 14px;">Te esperamos. Si necesitas cancelar o reagendar, ponte en contacto con nosotros.</p>
          </div>
        `,
      }),
    });

    const data = await res.json()

    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 })
  }
})
