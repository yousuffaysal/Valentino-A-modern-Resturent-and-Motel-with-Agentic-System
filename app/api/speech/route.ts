import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

/**
 * Text to speech for the reception desk.
 *
 * The browser's own synthesiser is free and instant but sounds like a browser's
 * own synthesiser. Groq hosts Orpheus, which does not, so English replies are
 * spoken by the model and everything else falls back to the device.
 *
 * Orpheus is gated behind a terms acceptance on the Groq console. Until an org
 * admin accepts them the call returns `model_terms_required`, which is reported
 * here as a plain "unavailable" so the widget quietly uses the browser voice
 * instead of failing in front of a guest.
 */
const MODEL = 'canopylabs/orpheus-v1-english';
const VOICE = process.env.ORPHEUS_VOICE || 'tara';
const ENDPOINT = 'https://api.groq.com/openai/v1/audio/speech';

/** One reply, not an audiobook. */
const MAX_CHARS = 900;

/**
 * One refusal is enough to stop paying for the round trip — but not forever:
 * the usual cause is terms nobody has accepted yet, and when someone does the
 * desk should find its voice again without a redeploy.
 */
const RETRY_AFTER_MS = 10 * 60 * 1000;
let refusedAt = 0;

function unavailable(): boolean {
  return refusedAt > 0 && Date.now() - refusedAt < RETRY_AFTER_MS;
}

export async function GET() {
  return NextResponse.json({ available: !unavailable() && !!process.env.GROQ_API_KEY });
}

export async function POST(req: Request) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return NextResponse.json({ ok: false, reason: 'unconfigured' });
  if (unavailable()) return NextResponse.json({ ok: false, reason: 'unavailable' });

  let text = '';
  let lang = 'en';
  try {
    const body = await req.json();
    text = typeof body.text === 'string' ? body.text.trim().slice(0, MAX_CHARS) : '';
    lang = body.lang === 'bn' ? 'bn' : 'en';
  } catch {
    return NextResponse.json({ ok: false, reason: 'bad-request' }, { status: 400 });
  }

  if (!text) return NextResponse.json({ ok: false, reason: 'empty' });
  /* Orpheus is English only; বাংলা stays with the device voice. */
  if (lang !== 'en') return NextResponse.json({ ok: false, reason: 'unsupported-language' });

  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        voice: VOICE,
        input: text,
        response_format: 'wav',
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      /* Terms not accepted, model retired, or the voice name is not one of
       * this model's. Stop asking for a while; the log line says which. */
      refusedAt = Date.now();
      console.warn(`[speech] ${MODEL} unavailable, falling back to the browser voice: ${detail}`);
      return NextResponse.json({ ok: false, reason: 'unavailable' });
    }

    const audio = await res.arrayBuffer();
    return new NextResponse(audio, {
      headers: {
        'Content-Type': res.headers.get('content-type') || 'audio/wav',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('[speech] request failed:', error);
    return NextResponse.json({ ok: false, reason: 'error' });
  }
}
