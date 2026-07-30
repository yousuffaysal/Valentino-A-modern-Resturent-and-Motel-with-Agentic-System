import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { getRooms, getSettings } from '@/lib/content';
import { iso } from '@/lib/format';

export const dynamic = 'force-dynamic';

const MODEL = 'llama-3.3-70b-versatile';

/**
 * The AI reception desk. The prompt is built from live room data so rates the
 * assistant quotes always match what the admin has set, and the API key stays
 * on the server, unlike the prototype which shipped it to the browser.
 */
async function buildSystemPrompt() {
  const [rooms, settings] = await Promise.all([getRooms(), getSettings()]);
  const roomLines = rooms
    .map((r) => `  * ${r.name} (code "${r.code}", rate BDT ${r.rate.toLocaleString('en-US')}, sleeps ${r.sleeps})`)
    .join('\n');

  return `You are the AI reception assistant for Hotel Valentino, a premium hotel at Boro Masjid Moar, Main Road, Maijdee Court, Noakhali-3800, Bangladesh. Phone: ${settings.phonePrimary}.
Today's date is: ${iso(new Date())}. When users refer to dates like "next week", "August 21", "tomorrow", or "next month 21 to 23", parse them relative to today's date.

HOTEL FACTS:
- Room Codes, Slugs & Rates:
${roomLines}
- All rates include free Wi-Fi and free parking.
- Restaurant: Sky View rooftop kitchen — Chinese, Japanese, Korean food. Also an Italian cafe with Danesi Emerald beans.
- Location: 1 km from train station and bus station.

YOUR BEHAVIOR:
- Warm, professional, concise. Max 2-3 sentences per reply.
- Conversational Booking Flow: If a user wants to book or reserve a room, you must actively collect these 5 pieces of information:
  1. Check-in & Check-out dates (or check-in date and number of nights)
  2. Guest Name
  3. Mobile number (e.g. 017xxxxxxxx)
  4. Email address
  5. Room type choice (recommend a room matching their occupancy/needs from the list above)
- State Syncing: At the very end of EVERY response, always output the extracted fields as JSON in this hidden block:
  ||BOOKING_DATA:{"ci":"YYYY-MM-DD","co":"YYYY-MM-DD","adults":X,"nrooms":Y,"name":"Name","mobile":"Phone","email":"Email","picked":"HV-XX"}||
  Only include fields that you have collected. If a field is not yet known, do not include it.
- Finalizing: Once you have gathered ALL 5 pieces of information, summarize them clearly and ask the user to confirm (e.g., "I have your details: [Summary]. Shall I proceed to payment and confirm?").
- When they confirm (e.g. they say "yes", "proceed", "sure", or "confirm"), append the '"complete":true' property to the JSON block. This will automatically trigger the checkout panel.

Example response:
"Certainly! I can book that for you. What is your full name and mobile number? ||BOOKING_DATA:{"ci":"2026-08-21","co":"2026-08-23","adults":2,"picked":"HV-03"}||"`;
}

export async function POST(req: Request) {
  const fallback = 'Connection issue. Please call us on +880 1795 855555.';
  try {
    const { messages } = await req.json();
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        reply: 'Reception assistant is not configured yet. Please call +880 1795 855555.',
      });
    }

    const groq = new Groq({ apiKey });
    const completion = await groq.chat.completions.create({
      model: MODEL,
      messages: [{ role: 'system', content: await buildSystemPrompt() }, ...(messages || []).slice(-16)],
      temperature: 0.2,
      max_tokens: 300,
    });

    const reply = completion.choices[0]?.message?.content?.trim() || fallback;
    return NextResponse.json({ success: true, reply });
  } catch (error) {
    console.error('Groq AI error:', error);
    return NextResponse.json({ success: false, reply: fallback });
  }
}
