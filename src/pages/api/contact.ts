// ============================================================
//  POST /api/contact — contact form handler.
//  Sends via Resend when RESEND_API_KEY + CONTACT_TO_EMAIL are
//  set; otherwise logs and returns ok (so the form works in dev).
// ============================================================
import type { APIRoute } from 'astro';
// Secrets resolve per-request via getSecret() — works on both Node and the
// Cloudflare edge (where non-PUBLIC vars aren't inlined and process.env is absent).
import { getSecret } from 'astro:env/server';

export const prerender = false;

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });

const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

export const POST: APIRoute = async ({ request }) => {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: 'Invalid request' }, 400);
  }

  const name = String(body.name ?? '').trim().slice(0, 200);
  const email = String(body.email ?? '').trim().slice(0, 200);
  const subject = String(body.subject ?? '').trim().slice(0, 200);
  const message = String(body.message ?? '').trim().slice(0, 5000);

  if (!name || !isEmail(email) || !message) {
    return json({ ok: false, error: 'Please provide a name, a valid email, and a message.' }, 400);
  }

  const apiKey = getSecret('RESEND_API_KEY');
  const to = getSecret('CONTACT_TO_EMAIL');
  const from = getSecret('CONTACT_FROM_EMAIL') ?? 'Édition <onboarding@resend.dev>';

  // No provider configured — accept gracefully so the UI works in dev.
  if (!apiKey || !to) {
    console.info('[contact] (unconfigured) message from', email, '—', subject || '(no subject)');
    return json({ ok: true, delivered: false });
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: subject ? `[Contact] ${subject}` : `New contact message from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject || '—'}\n\n${message}`,
      }),
    });
    if (!res.ok) {
      const detail = await res.text();
      console.error('[contact] Resend error', res.status, detail);
      return json({ ok: false, error: 'Could not send your message right now.' }, 502);
    }
    return json({ ok: true, delivered: true });
  } catch (err) {
    console.error('[contact] send failed:', (err as Error).message);
    return json({ ok: false, error: 'Could not send your message right now.' }, 502);
  }
};
