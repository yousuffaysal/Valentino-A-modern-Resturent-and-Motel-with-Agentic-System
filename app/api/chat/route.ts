import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { getRooms, getSettings } from '@/lib/content';
import { iso } from '@/lib/format';

export const dynamic = 'force-dynamic';

/**
 * Hosted models get retired, and when the one named here disappears every reply
 * in the widget becomes "Connection issue" — which is what happened to
 * `llama-3.3-70b-versatile`. So the desk keeps a list and walks down it on a
 * 404, remembering the one that answered.
 */
const MODELS = ['openai/gpt-oss-120b', 'openai/gpt-oss-20b', 'groq/compound-mini'];
let workingModel: string | null = null;

const DAY = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
 * Models are unreliable at counting forward from a date — "next Monday" lands a
 * day or two out often enough to book the wrong night. Handing them the actual
 * calendar removes the arithmetic entirely.
 */
function dateTable(days = 12): string {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const lines: string[] = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const tag = i === 0 ? ' (today)' : i === 1 ? ' (tomorrow)' : '';
    lines.push(`  ${DAY[d.getDay()]} ${iso(d)}${tag}`);
  }
  return lines.join('\n');
}

/**
 * Extra rules when the guest is speaking rather than typing. The reply is about
 * to be read out loud, so anything that only works on a screen — bullet lists,
 * currency codes, digit-grouped numbers — has to go.
 */
const VOICE_RULES = `
YOU ARE BEING READ ALOUD. The guest is speaking to you, not typing:
- Write the reply the way you would say it. No lists, no bullet points, no asterisks, no emoji, no parentheses.
- Say amounts in words: "two thousand five hundred taka", never "BDT 2,500".
- Say dates in words: "the twenty first of August", never "2026-08-21".
- Keep it to one or two short sentences. Ask for one piece of information at a time, not three.
- Never read the BOOKING_DATA block out loud; still append it, it is stripped before speaking.`;

async function buildSystemPrompt(voice: boolean) {
  const [rooms, settings] = await Promise.all([getRooms(), getSettings()]);
  const roomLines = rooms
    .map((r) => `  * ${r.name} (code "${r.code}", rate BDT ${r.rate.toLocaleString('en-US')}, sleeps ${r.sleeps})`)
    .join('\n');

  return `You are the AI reception assistant for Hotel Valentino, a premium hotel at Boro Masjid Moar, Main Road, Maijdee Court, Noakhali-3800, Bangladesh. Phone: ${settings.phonePrimary}.
Today's date is: ${iso(new Date())}.

CALENDAR — resolve "tomorrow", "next Monday", "this weekend" against this table, never by counting yourself:
${dateTable()}

HOTEL FACTS:
- Room Codes, Slugs & Rates:
${roomLines}
- All rates include free Wi-Fi and free parking.
- Restaurant: Sky View rooftop kitchen — Chinese, Japanese, Korean food. Also an Italian cafe with Danesi Emerald beans.
- Location: 1 km from train station and bus station.

YOUR BEHAVIOR:
- Warm, professional, concise. Max 2-3 sentences per reply.
- Answer in the language the guest writes or speaks in. If they use বাংলা, reply in বাংলা.
- Conversational Booking Flow: If a user wants to book or reserve a room, you must actively collect these 5 pieces of information:
  1. Check-in & Check-out dates (or check-in date and number of nights)
  2. Guest Name
  3. Mobile number (e.g. 017xxxxxxxx)
  4. Email address
  5. Room type choice (recommend a room matching their occupancy/needs from the list above)
- State Syncing: At the very end of EVERY response, always output the extracted fields as JSON in this hidden block, using EXACTLY these key names:
  ||BOOKING_DATA:{"ci":"YYYY-MM-DD","co":"YYYY-MM-DD","adults":X,"nrooms":Y,"name":"Name","mobile":"Phone","email":"Email","picked":"HV-XX"}||
  "ci" is check-in and "co" is check-out. Never invent other key names. Only include fields that you have collected. If a field is not yet known, do not include it.
- Finalizing: Once you have gathered ALL 5 pieces of information, summarize them clearly and ask the user to confirm (e.g., "I have your details: [Summary]. Shall I proceed to payment and confirm?").
- When they confirm (e.g. they say "yes", "proceed", "sure", or "confirm"), append the '"complete":true' property to the JSON block. This will automatically trigger the checkout panel.
${voice ? VOICE_RULES : ''}
Example response:
"Certainly! I can book that for you. What is your full name and mobile number? ||BOOKING_DATA:{"ci":"2026-08-21","co":"2026-08-23","adults":2,"picked":"HV-03"}||"`;
}

function isMissingModel(error: unknown): boolean {
  const status = (error as { status?: number })?.status;
  const code = (error as { error?: { error?: { code?: string } } })?.error?.error?.code;
  return status === 404 || code === 'model_not_found' || code === 'model_terms_required';
}

export async function POST(req: Request) {
  const fallback = 'Connection issue. Please call us on +880 1795 855555.';
  try {
    const { messages, voice } = await req.json();
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        reply: 'Reception assistant is not configured yet. Please call +880 1795 855555.',
      });
    }

    const groq = new Groq({ apiKey });
    const system = await buildSystemPrompt(!!voice);
    const history = [{ role: 'system' as const, content: system }, ...(messages || []).slice(-16)];

    /* Try the remembered model first, then anything after it in the list. */
    const order = workingModel
      ? [workingModel, ...MODELS.filter((m) => m !== workingModel)]
      : MODELS;

    let lastError: unknown = null;
    for (const model of order) {
      try {
        const completion = await groq.chat.completions.create({
          model,
          messages: history,
          temperature: 0.2,
          /* The gpt-oss models think before answering, and that thinking is
           * billed against the same budget. Kept low and hidden, they answer in
           * about a second; left at the default they spend the whole allowance
           * reasoning and return an empty message. */
          reasoning_effort: 'low',
          reasoning_format: 'hidden',
          max_completion_tokens: 600,
        } as Parameters<typeof groq.chat.completions.create>[0]);

        const reply = (completion as { choices: { message: { content?: string } }[] }).choices[0]
          ?.message?.content?.trim();
        if (!reply) {
          lastError = new Error(`empty reply from ${model}`);
          continue;
        }

        workingModel = model;
        return NextResponse.json({ success: true, reply, model });
      } catch (error) {
        lastError = error;
        if (!isMissingModel(error)) throw error;
        console.warn(`[chat] ${model} unavailable, trying the next model.`);
      }
    }

    console.error('Groq AI error: no usable model.', lastError);
    return NextResponse.json({ success: false, reply: fallback });
  } catch (error) {
    console.error('Groq AI error:', error);
    return NextResponse.json({ success: false, reply: fallback });
  }
}
