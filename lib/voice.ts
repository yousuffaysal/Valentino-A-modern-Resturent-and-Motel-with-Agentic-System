/**
 * The voice half of the reception desk: microphone capture with end-of-speech
 * detection on the way in, and spoken replies on the way out.
 *
 * Speech to text goes through `/api/voice` (Groq Whisper) rather than the
 * browser's `SpeechRecognition`, for two reasons: Whisper transcribes Bengali
 * properly, and `SpeechRecognition` does not exist in Firefox and ships audio
 * to a third party in Chrome.
 *
 * Speech out prefers `/api/speech` (Orpheus on Groq), which sounds like a
 * person, and falls back to the browser's own synthesiser, which does not but
 * is always there — and is the only option for বাংলা.
 */

export type VoiceLang = 'en' | 'bn';
export type SpeechEngine = 'server' | 'browser';

/** Locale asked of the synthesiser, and the tag we match installed voices on. */
const LOCALE: Record<VoiceLang, string[]> = {
  en: ['en-GB', 'en-US', 'en'],
  bn: ['bn-BD', 'bn-IN', 'bn'],
};

/* ------------------------------------------------------- shared audio graph */

let sharedContext: AudioContext | null = null;

function audioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const Ctor: typeof AudioContext =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  if (!sharedContext || sharedContext.state === 'closed') sharedContext = new Ctor();
  return sharedContext;
}

/**
 * iOS and Chrome only allow audio that a gesture started. Called from the tap
 * that opens voice mode, this unlocks playback for the rest of the conversation
 * — including replies that arrive minutes later, with no gesture behind them.
 */
export function unlockAudio() {
  const ctx = audioContext();
  if (ctx?.state === 'suspended') void ctx.resume().catch(() => {});
  /* Safari also gates speechSynthesis on a gesture; an empty utterance opens it. */
  if (speechSupported()) {
    const primer = new SpeechSynthesisUtterance('');
    primer.volume = 0;
    window.speechSynthesis.speak(primer);
  }
}

/* ------------------------------------------------------------ text for ears */

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/**
 * Turn a written reply into something worth hearing. The model is already told
 * to write for the ear in voice mode, but replies also get spoken when the
 * guest typed the question, and those are full of screen-only formatting.
 */
function speakable(text: string, lang: VoiceLang = 'en'): string {
  let out = text
    .replace(/\|\|BOOKING_DATA:.*?\|\|/g, '')
    .replace(/\|\|OPEN_BOOKING\|\|/g, '')
    .replace(/[*_`#]/g, '')
    /* Models like typographic hyphens and thin spaces; synthesisers stumble on them. */
    .replace(/[‐‑‒–—]/g, '-')
    .replace(/[   ]/g, ' ');

  /* "BDT 4,500" reads as three letters and a number. "4,500 taka" reads right. */
  out = out
    .replace(/\bBDT\s*([\d,]+)/gi, '$1 taka')
    .replace(/৳\s*([\d,]+)/g, '$1 taka');

  if (lang === 'en') {
    out = out.replace(/(\d{4})-(\d{2})-(\d{2})/g, (whole, y: string, m: string, d: string) => {
      const month = MONTHS[Number(m) - 1];
      return month ? `${Number(d)} ${month} ${y}` : whole;
    });
  }

  return out.replace(/\s+/g, ' ').trim();
}

/**
 * Split a reply into sentences so the browser voice can breathe between them,
 * and so the first words start sooner. Fragments too short to stand alone are
 * folded into the sentence that follows.
 */
function sentences(text: string): string[] {
  const parts: string[] = [];
  let current = '';
  for (const char of text) {
    current += char;
    if ('.!?।'.includes(char)) {
      parts.push(current.trim());
      current = '';
    }
  }
  if (current.trim()) parts.push(current.trim());

  const merged: string[] = [];
  for (const part of parts) {
    if (merged.length && merged[merged.length - 1].length < 40) merged[merged.length - 1] += ' ' + part;
    else merged.push(part);
  }
  return merged.filter(Boolean);
}

/* ------------------------------------------------------------ browser voice */

export function speechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

/**
 * Voices load asynchronously in Chrome: the first call after boot returns an
 * empty list and a `voiceschanged` event follows. Callers ask again on that
 * event rather than blocking on it.
 */
export function voicesReady(onChange: () => void): () => void {
  if (!speechSupported()) return () => {};
  window.speechSynthesis.getVoices();
  window.speechSynthesis.addEventListener('voiceschanged', onChange);
  return () => window.speechSynthesis.removeEventListener('voiceschanged', onChange);
}

/**
 * Every operating system ships a pile of voices of wildly different quality,
 * and the default is rarely the best one. Neural voices — Microsoft's
 * "Natural", Google's server voices, Apple's Siri and premium sets — sound
 * human; the older formant voices and the novelty ones do not.
 */
const GOOD_VOICE = /natural|neural|premium|enhanced|siri|google/i;
const NAMED_GOOD = /samantha|ava|allison|serena|zoe|evan|nathan|daniel|karen|moira|tessa|isha|rishi/i;
const NOVELTY =
  /albert|bad news|bahh|bells|boing|bubbles|cellos|deranged|good news|jester|junior|kathy|organ|ralph|trinoids|whisper|wobble|zarvox|fred|hysterical|princess|superstar|grandma|grandpa|rocko|shelley|sandy|eddy|flo|reed|bruce|vicki|victoria/i;

function score(voice: SpeechSynthesisVoice, lang: VoiceLang): number {
  let points = 0;
  const tag = voice.lang.replace('_', '-').toLowerCase();
  const wanted = LOCALE[lang].map((l) => l.toLowerCase());

  if (tag === wanted[0]) points += 40;
  else if (wanted.includes(tag)) points += 34;
  else if (tag.startsWith(lang)) points += 26;
  else return -1;

  if (GOOD_VOICE.test(voice.name)) points += 30;
  if (NAMED_GOOD.test(voice.name)) points += 14;
  if (NOVELTY.test(voice.name)) points -= 60;
  /* A remote voice is a server-rendered one, which is generally the better one. */
  if (!voice.localService) points += 10;
  if (voice.default) points += 3;
  return points;
}

/** The best installed voice for a language, or null when there is none. */
export function pickVoice(lang: VoiceLang): SpeechSynthesisVoice | null {
  if (!speechSupported()) return null;
  const ranked = window.speechSynthesis
    .getVoices()
    .map((voice) => ({ voice, points: score(voice, lang) }))
    .filter((entry) => entry.points >= 0)
    .sort((a, b) => b.points - a.points);
  return ranked[0]?.voice ?? null;
}

/**
 * Whether this device can speak a language at all. A Bengali reply read by an
 * English voice is unintelligible, so the widget would rather stay quiet and
 * say so than produce that.
 */
export function canSpeak(lang: VoiceLang): boolean {
  return !!pickVoice(lang);
}

export interface SpeakHandles {
  /** Resolves when the reply finishes, is interrupted, or fails. */
  done: Promise<void>;
  cancel: () => void;
}

export function stopSpeaking() {
  if (speechSupported()) window.speechSynthesis.cancel();
}

/**
 * Speak with the device's own synthesiser, one sentence at a time. Chrome stops
 * the synthesiser after roughly fifteen seconds unless it is nudged, so a timer
 * resumes it while an utterance is in flight.
 */
function speakBrowser(text: string, lang: VoiceLang): SpeakHandles {
  if (!speechSupported() || !text) return { done: Promise.resolve(), cancel: () => {} };

  const synth = window.speechSynthesis;
  const voice = pickVoice(lang);
  const chunks = sentences(text);
  let cancelled = false;
  let settle: () => void = () => {};

  const done = new Promise<void>((resolve) => {
    settle = resolve;
  });

  const keepAlive = window.setInterval(() => {
    if (synth.speaking && !synth.paused) synth.resume();
  }, 8000);

  const speakChunk = (index: number) => {
    if (cancelled || index >= chunks.length) {
      window.clearInterval(keepAlive);
      settle();
      return;
    }
    const utterance = new SpeechSynthesisUtterance(chunks[index]);
    if (voice) utterance.voice = voice;
    utterance.lang = voice?.lang ?? LOCALE[lang][0];
    /* Slightly under natural pace reads as considered rather than hurried, and
     * gives the older formant voices a chance at the consonants. */
    utterance.rate = lang === 'bn' ? 0.94 : 0.99;
    utterance.pitch = 1.02;
    const next = () => window.setTimeout(() => speakChunk(index + 1), 130);
    utterance.onend = next;
    utterance.onerror = next;
    synth.speak(utterance);
  };

  synth.cancel();
  /* Safari drops an utterance queued in the same tick as cancel(). */
  window.setTimeout(() => {
    if (!cancelled) speakChunk(0);
  }, 60);

  return {
    done,
    cancel: () => {
      cancelled = true;
      window.clearInterval(keepAlive);
      synth.cancel();
      settle();
    },
  };
}

/* ------------------------------------------------------------- server voice */

/** Latched off once the server says the model is unavailable to this account. */
let serverSpeech: 'unknown' | 'on' | 'off' = 'unknown';

export function serverVoiceState() {
  return serverSpeech;
}

/**
 * Play one reply rendered by the model, reporting real amplitude as it goes, so
 * the meter moves to the actual speech rather than to a synthesised wave.
 */
async function playBuffer(
  data: ArrayBuffer,
  onLevel: ((level: number) => void) | undefined,
  register: (cancel: () => void) => void,
): Promise<void> {
  const ctx = audioContext();
  if (!ctx) throw new Error('no audio context');
  if (ctx.state === 'suspended') await ctx.resume();

  const decoded = await ctx.decodeAudioData(data);
  const source = ctx.createBufferSource();
  source.buffer = decoded;

  const analyser = ctx.createAnalyser();
  analyser.fftSize = 512;
  analyser.smoothingTimeConstant = 0.7;
  source.connect(analyser);
  analyser.connect(ctx.destination);

  const samples = new Uint8Array(analyser.fftSize);
  let frame = 0;
  const meter = () => {
    analyser.getByteTimeDomainData(samples);
    let sum = 0;
    for (let i = 0; i < samples.length; i++) {
      const deviation = (samples[i] - 128) / 128;
      sum += deviation * deviation;
    }
    onLevel?.(Math.min(1, Math.sqrt(sum / samples.length) * 2.6));
    frame = requestAnimationFrame(meter);
  };

  await new Promise<void>((resolve) => {
    const finish = () => {
      cancelAnimationFrame(frame);
      onLevel?.(0);
      resolve();
    };
    register(() => {
      try {
        source.stop();
      } catch {
        /* already stopped */
      }
      finish();
    });
    source.onended = finish;
    source.start();
    frame = requestAnimationFrame(meter);
  });
}

/**
 * Speak a reply: the model voice when it is available and the language is
 * English, the device voice otherwise. `onEngine` reports which one actually
 * ran, so the caller knows whether the levels it receives are real.
 */
export function say(
  text: string,
  lang: VoiceLang,
  handlers: {
    onLevel?: (level: number) => void;
    onEngine?: (engine: SpeechEngine) => void;
  } = {},
): SpeakHandles {
  const body = speakable(text, lang);
  if (!body) return { done: Promise.resolve(), cancel: () => {} };

  let cancelled = false;
  let activeCancel: (() => void) | null = null;
  const controller = new AbortController();

  const done = (async () => {
    if (lang === 'en' && serverSpeech !== 'off') {
      try {
        const res = await fetch('/api/speech', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: body, lang }),
          signal: controller.signal,
        });
        const type = res.headers.get('content-type') ?? '';
        if (res.ok && type.startsWith('audio')) {
          const buffer = await res.arrayBuffer();
          if (cancelled) return;
          serverSpeech = 'on';
          handlers.onEngine?.('server');
          await playBuffer(buffer, handlers.onLevel, (cancel) => {
            activeCancel = cancel;
          });
          return;
        }
        /* A JSON body means the model refused; that will not change on retry. */
        serverSpeech = 'off';
      } catch {
        /* Aborted, offline, or the audio would not decode: use the device. */
        if (cancelled) return;
      }
    }

    if (cancelled) return;
    handlers.onEngine?.('browser');
    const browser = speakBrowser(body, lang);
    activeCancel = browser.cancel;
    await browser.done;
  })();

  return {
    done,
    cancel: () => {
      cancelled = true;
      controller.abort();
      activeCancel?.();
      stopSpeaking();
      handlers.onLevel?.(0);
    },
  };
}

/* ------------------------------------------------------------------- input */

export function micSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof navigator !== 'undefined' &&
    !!navigator.mediaDevices?.getUserMedia &&
    typeof window.MediaRecorder !== 'undefined'
  );
}

function bestMimeType(): string {
  const candidates = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/mp4',
    'audio/ogg;codecs=opus',
  ];
  for (const type of candidates) {
    if (MediaRecorder.isTypeSupported?.(type)) return type;
  }
  return '';
}

/** Loud enough to count as speech. */
const SPEECH_LEVEL = 0.085;
/** Quiet enough to count as a pause. */
const SILENCE_LEVEL = 0.05;
/** Pause after speech that ends the turn. */
const SILENCE_MS = 1150;
/** Speech shorter than this is a cough or a door. */
const MIN_SPEECH_MS = 320;
/** Give up if the guest never starts talking. */
const NO_SPEECH_MS = 7000;
/** Hard ceiling on one turn. */
const MAX_TURN_MS = 20000;

export type ListenEnd = 'speech' | 'silence' | 'stopped' | 'error';

export interface ListenResult {
  audio: Blob | null;
  reason: ListenEnd;
}

/**
 * One listening turn. Records until the guest stops talking, reporting the
 * microphone level continuously so the widget can animate against the guest's
 * own voice rather than a canned loop.
 */
export class VoiceListener {
  private stream: MediaStream | null = null;
  private recorder: MediaRecorder | null = null;
  private context: AudioContext | null = null;
  private frame = 0;
  private stopping = false;

  /** 0 to 1, updated every animation frame while listening. */
  readonly level = { current: 0 };

  async start(onLevel?: (level: number) => void): Promise<ListenResult> {
    if (!micSupported()) return { audio: null, reason: 'error' };

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
    } catch {
      /* Permission refused, or no microphone on the device. */
      return { audio: null, reason: 'error' };
    }

    const mimeType = bestMimeType();
    const chunks: BlobPart[] = [];
    this.stopping = false;

    try {
      this.recorder = new MediaRecorder(this.stream, mimeType ? { mimeType } : undefined);
    } catch {
      this.release();
      return { audio: null, reason: 'error' };
    }

    const AudioCtor: typeof AudioContext =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    /* Its own context, not the shared one: this graph is torn down every turn. */
    this.context = new AudioCtor();
    if (this.context.state === 'suspended') await this.context.resume().catch(() => {});

    const analyser = this.context.createAnalyser();
    analyser.fftSize = 1024;
    analyser.smoothingTimeConstant = 0.75;
    this.context.createMediaStreamSource(this.stream).connect(analyser);
    const samples = new Uint8Array(analyser.fftSize);

    const started = performance.now();
    let speechStartedAt = 0;
    let lastLoudAt = 0;
    let reason: ListenEnd = 'stopped';

    return new Promise<ListenResult>((resolve) => {
      const settle = (end: ListenEnd) => {
        if (this.stopping) return;
        this.stopping = true;
        reason = end;
        if (this.recorder?.state === 'recording') this.recorder.stop();
        else finish();
      };

      const finish = () => {
        cancelAnimationFrame(this.frame);
        this.level.current = 0;
        onLevel?.(0);
        const audio = chunks.length ? new Blob(chunks, { type: mimeType || 'audio/webm' }) : null;
        this.release();
        resolve({ audio: reason === 'speech' ? audio : null, reason });
      };

      this.recorder!.ondataavailable = (e) => {
        if (e.data.size) chunks.push(e.data);
      };
      this.recorder!.onstop = finish;
      this.recorder!.onerror = () => settle('error');

      const tick = () => {
        analyser.getByteTimeDomainData(samples);
        let sum = 0;
        for (let i = 0; i < samples.length; i++) {
          const deviation = (samples[i] - 128) / 128;
          sum += deviation * deviation;
        }
        /* RMS runs low for speech, so scale it into a usable 0-1 range. */
        const level = Math.min(1, Math.sqrt(sum / samples.length) * 3.2);
        this.level.current = level;
        onLevel?.(level);

        const now = performance.now();
        if (level > SPEECH_LEVEL) {
          if (!speechStartedAt) speechStartedAt = now;
          lastLoudAt = now;
        }

        if (!speechStartedAt && now - started > NO_SPEECH_MS) {
          settle('silence');
          return;
        }
        if (
          speechStartedAt &&
          now - speechStartedAt > MIN_SPEECH_MS &&
          level < SILENCE_LEVEL &&
          now - lastLoudAt > SILENCE_MS
        ) {
          settle('speech');
          return;
        }
        if (now - started > MAX_TURN_MS) {
          settle(speechStartedAt ? 'speech' : 'silence');
          return;
        }

        this.frame = requestAnimationFrame(tick);
      };

      this.recorder!.start(250);
      this.frame = requestAnimationFrame(tick);

      /* Handed out so the caller's submit()/abort() can end the turn early. */
      this.stopTurn = (keep: boolean) => settle(keep ? 'speech' : 'stopped');
    });
  }

  /** Replaced while a turn is running; a no-op the rest of the time. */
  private stopTurn: (keep: boolean) => void = () => {};

  /** End the turn and transcribe what was said so far. */
  submit() {
    this.stopTurn(true);
  }

  /** End the turn and throw the audio away. */
  abort() {
    this.stopTurn(false);
  }

  private release() {
    cancelAnimationFrame(this.frame);
    this.stream?.getTracks().forEach((t) => t.stop());
    this.stream = null;
    this.recorder = null;
    void this.context?.close().catch(() => {});
    this.context = null;
  }
}

/** Send one recorded turn to Whisper. Returns '' for silence or failure. */
export async function transcribe(audio: Blob, lang: VoiceLang): Promise<string> {
  const body = new FormData();
  body.append('audio', audio, 'speech.webm');
  body.append('lang', lang);
  try {
    const res = await fetch('/api/voice', { method: 'POST', body });
    const data = await res.json();
    return typeof data.text === 'string' ? data.text.trim() : '';
  } catch {
    return '';
  }
}

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}
