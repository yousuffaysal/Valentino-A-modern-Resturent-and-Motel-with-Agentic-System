import { NextResponse } from 'next/server';
import Groq, { toFile } from 'groq-sdk';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

/**
 * Speech to text for the reception desk.
 *
 * Turbo is the faster and cheaper model, but its multilingual accuracy is well
 * behind the full model, and half of this hotel's guests speak Bengali. So
 * English goes to turbo and বাংলা goes to `whisper-large-v3`, which handles it
 * properly.
 */
const MODEL_EN = 'whisper-large-v3-turbo';
const MODEL_BN = 'whisper-large-v3';

/** Roughly 30 seconds of Opus. Anything larger is not a reception question. */
const MAX_BYTES = 8 * 1024 * 1024;
/** Below this the recording is a click or a breath, not speech. */
const MIN_BYTES = 1600;

/**
 * Whisper is far more accurate on proper nouns it has been shown first, and
 * this desk hears the same twenty words all day: room categories, the
 * restaurant, the payment methods, the town.
 */
const PROMPT =
  'Hotel Valentino, Maijdee Court, Noakhali, Bangladesh. Sky View rooftop restaurant. ' +
  'Room categories: Single Deluxe, Couple Deluxe, Twin Deluxe, Triple Deluxe, Honeymoon Suite, ' +
  'VIP Suite, Deluxe Four Bed, Premium Executive Suite. Check-in, check-out, nights, BDT, bKash, Nagad.';

/**
 * Whisper invents a polite closing phrase when handed near-silence — a known
 * artefact of its training data. Recognising the handful it reaches for is
 * cheaper than sending the guest a reply to something they never said.
 */
const HALLUCINATIONS = [
  'thank you',
  'thank you.',
  'thanks for watching',
  'thanks for watching!',
  'you',
  'bye',
  'bye.',
  '.',
  'ধন্যবাদ',
  'ধন্যবাদ।',
];

function isNoise(text: string): boolean {
  const stripped = text.trim().toLowerCase();
  if (stripped.length < 2) return true;
  return HALLUCINATIONS.includes(stripped);
}

/** Whisper wants a filename whose extension matches what was recorded. */
function filenameFor(type: string): string {
  if (type.includes('mp4')) return 'speech.mp4';
  if (type.includes('mpeg')) return 'speech.mp3';
  if (type.includes('ogg')) return 'speech.ogg';
  if (type.includes('wav')) return 'speech.wav';
  return 'speech.webm';
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        text: '',
        reason: 'unconfigured',
      });
    }

    /* A request without a multipart body is a caller error, not a Groq one, so
     * it must not reach the catch below and be logged as a transcription fault. */
    const form = await req.formData().catch(() => null);
    if (!form) {
      return NextResponse.json({ success: false, text: '', reason: 'no-audio' }, { status: 400 });
    }

    const audio = form.get('audio');
    const lang = form.get('lang') === 'bn' ? 'bn' : 'en';

    if (!(audio instanceof Blob)) {
      return NextResponse.json({ success: false, text: '', reason: 'no-audio' }, { status: 400 });
    }
    if (audio.size > MAX_BYTES) {
      return NextResponse.json({ success: false, text: '', reason: 'too-long' }, { status: 413 });
    }
    /* Silence is not an error — the client simply keeps listening. */
    if (audio.size < MIN_BYTES) {
      return NextResponse.json({ success: true, text: '', reason: 'too-short' });
    }

    const type = audio.type || 'audio/webm';
    const groq = new Groq({ apiKey });
    const result = await groq.audio.transcriptions.create({
      file: await toFile(audio, filenameFor(type), { type }),
      model: lang === 'bn' ? MODEL_BN : MODEL_EN,
      language: lang,
      prompt: PROMPT,
      temperature: 0,
      response_format: 'json',
    });

    const text = (result.text ?? '').trim();
    if (isNoise(text)) {
      return NextResponse.json({ success: true, text: '', reason: 'noise' });
    }

    return NextResponse.json({ success: true, text });
  } catch (error) {
    console.error('Groq transcription error:', error);
    return NextResponse.json({ success: false, text: '', reason: 'error' });
  }
}
