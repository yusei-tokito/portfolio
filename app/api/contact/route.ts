import { Resend } from "resend"

export async function POST(req: Request) {
  try {
    const { name, email, message, company } = await req.json()

    // Honeypot: bots fill hidden fields
    if (company) {
      return Response.json({ ok: true })
    }

    const cleanName = String(name ?? "").trim()
    const cleanEmail = String(email ?? "").trim()
    const cleanMessage = String(message ?? "").trim()

    if (!cleanName || !cleanEmail || !cleanMessage) {
      return Response.json({ ok: false, error: "Please fill in all fields." }, { status: 400 })
    }

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)
    if (!emailOk) {
      return Response.json({ ok: false, error: "Please enter a valid email." }, { status: 400 })
    }

    if (cleanMessage.length < 10) {
      return Response.json({ ok: false, error: "Message is too short." }, { status: 400 })
    }

    const apiKey = process.env.RESEND_API_KEY
    const to = process.env.CONTACT_TO_EMAIL
    const from = process.env.CONTACT_FROM_EMAIL

    if (!apiKey || !to || !from) {
      return Response.json({ ok: false, error: "Server is not configured." }, { status: 500 })
    }

    const resend = new Resend(apiKey)

    const { error } = await resend.emails.send({
      from,
      to,
      subject: `Portfolio contact from ${cleanName}`,
      replyTo: cleanEmail,
      text: `Name: ${cleanName}\nEmail: ${cleanEmail}\n\n${cleanMessage}`,
    })

    if (error) {
      return Response.json({ ok: false, error: "Failed to send message." }, { status: 502 })
    }

    return Response.json({ ok: true })
  } catch {
    return Response.json({ ok: false, error: "Bad request." }, { status: 400 })
  }
}