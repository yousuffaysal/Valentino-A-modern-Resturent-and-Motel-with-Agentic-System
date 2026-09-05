'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { css } from '@/lib/css';
import { useSite } from '@/context/SiteContext';
import { VoiceOrb, type VoiceState } from '@/components/chat/VoiceOrb';
import {
  VoiceListener,
  canSpeak,
  micSupported,
  say as speakReply,
  serverVoiceState,
  speechSupported,
  transcribe,
  unlockAudio,
  voicesReady,
  type SpeakHandles,
  type SpeechEngine,
  type VoiceLang,
} from '@/lib/voice';

const CHIPS = {
  en: ['Room rates', 'Sky View menu', 'How do I get there'],
  bn: ['রুম রেট', 'স্কাই ভিউ মেনু', 'কীভাবে আসব'],
};

/** Spoken the moment voice mode opens, so the desk answers the tap out loud. */
const GREETING = {
  en: 'Reception desk. How can I help you today?',
  bn: 'রিসেপশন ডেস্ক। আমি কীভাবে সাহায্য করতে পারি?',
};

const T = {
  voice: { en: 'VOICE', bn: 'ভয়েস' },
  end: { en: 'END', bn: 'বন্ধ' },
  listening: { en: 'LISTENING', bn: 'শুনছি' },
  thinking: { en: 'THINKING', bn: 'ভাবছি' },
  speaking: { en: 'SPEAKING', bn: 'বলছি' },
  idle: { en: 'TAP TO TALK', bn: 'কথা বলতে ট্যাপ করুন' },
  blocked: { en: 'MICROPHONE BLOCKED', bn: 'মাইক্রোফোন বন্ধ' },
  hintListening: { en: 'Just talk. I stop when you do.', bn: 'বলুন। থামলেই আমি বুঝে নেব।' },
  hintThinking: { en: 'One moment.', bn: 'এক মুহূর্ত।' },
  hintSpeaking: { en: 'Tap to interrupt me.', bn: 'থামাতে ট্যাপ করুন।' },
  hintIdle: { en: 'Tap the meter and speak.', bn: 'মিটারে ট্যাপ করে বলুন।' },
  hintBlocked: {
    en: 'Allow microphone access in your browser, or keep typing below.',
    bn: 'ব্রাউজারে মাইক্রোফোনের অনুমতি দিন, অথবা নিচে লিখুন।',
  },
  noVoice: {
    en: 'This device has no Bengali voice, so replies are written, not spoken.',
    bn: 'এই ডিভাইসে বাংলা ভয়েস নেই, তাই উত্তর লেখা হবে — বলা হবে না।',
  },
  talk: { en: 'Talk to reception', bn: 'রিসেপশনে কথা বলুন' },
  ask: { en: 'ASK RECEPTION', bn: 'রিসেপশন' },
  placeholder: {
    en: 'Ask about rooms, food, directions',
    bn: 'রুম, খাবার বা ঠিকানা জিজ্ঞাসা করুন',
  },
  send: { en: 'Send', bn: 'পাঠান' },
};

/** Stop the loop after this many turns that transcribed to nothing. */
const MAX_EMPTY_TURNS = 2;

/**
 * Can a reply in this language be spoken at all? English has the model voice
 * even on a device with no voices of its own; বাংলা depends on the device.
 */
function canSpeakIn(lang: VoiceLang): boolean {
  if (lang === 'en' && serverVoiceState() !== 'off') return true;
  return speechSupported() && canSpeak(lang);
}

/** The AI reception desk. Model calls run server side through /api/chat. */
export function ChatWidget() {
  const { chatOpen, toggleChat, chatInput, setChatInput, chatMsgs, chatSend, panel, isBn, lang } =
    useSite();
  const scroller = useRef<HTMLDivElement | null>(null);

  const [voice, setVoice] = useState<VoiceState>('off');
  /* Bumped to invalidate a running conversation loop. */
  const run = useRef(0);
  const listener = useRef<VoiceListener | null>(null);
  const speech = useRef<SpeakHandles | null>(null);
  const levelRef = useRef(0);
  const langRef = useRef(lang);
  langRef.current = lang;

  /* True while the meter is driven by real audio rather than a synthesised wave. */
  const [liveLevel, setLiveLevel] = useState(false);

  /* Chrome populates the voice list asynchronously; re-check when it lands. */
  const [voicesTick, setVoicesTick] = useState(0);
  useEffect(() => voicesReady(() => setVoicesTick((n) => n + 1)), []);
  void voicesTick;

  /**
   * English can be spoken by the model voice even on a device with no voices of
   * its own; বাংলা has only the device to fall back on.
   */
  const canTalk = canSpeakIn(lang);

  useEffect(() => {
    if (scroller.current) scroller.current.scrollTop = scroller.current.scrollHeight;
  }, [chatMsgs, chatOpen, voice]);

  const say = useCallback(async (text: string) => {
    const handles = speakReply(text, langRef.current, {
      onLevel: (level) => {
        levelRef.current = level;
      },
      /* The model voice hands back real amplitude; the device voice does not,
       * so the meter falls back to its own wave for that engine. */
      onEngine: (engine: SpeechEngine) => setLiveLevel(engine === 'server'),
    });
    speech.current = handles;
    await handles.done;
    speech.current = null;
    levelRef.current = 0;
  }, []);

  const stopVoice = useCallback(() => {
    run.current += 1;
    listener.current?.abort();
    speech.current?.cancel();
    speech.current = null;
    levelRef.current = 0;
    setVoice('off');
  }, []);

  /**
   * One conversation: listen, transcribe, answer, speak, listen again. It runs
   * until the guest ends voice mode or goes quiet, and every step checks its
   * generation so a stale loop cannot write over a newer one.
   */
  const loop = useCallback(
    async (gen: number) => {
      if (!listener.current) listener.current = new VoiceListener();
      let empty = 0;

      while (run.current === gen) {
        setVoice('listening');
        const { audio, reason } = await listener.current.start((l) => {
          levelRef.current = l;
        });
        if (run.current !== gen) return;

        if (reason === 'error') {
          setVoice('blocked');
          return;
        }
        if (!audio) {
          /* Silence: stop rather than hold the microphone open indefinitely. */
          setVoice('idle');
          return;
        }

        setVoice('thinking');
        const heard = await transcribe(audio, langRef.current);
        if (run.current !== gen) return;
        if (!heard) {
          if (++empty >= MAX_EMPTY_TURNS) {
            setVoice('idle');
            return;
          }
          continue;
        }
        empty = 0;

        const reply = await chatSend(heard, { voice: true });
        if (run.current !== gen) return;
        if (!reply) {
          setVoice('idle');
          return;
        }

        if (canSpeakIn(langRef.current)) {
          setVoice('speaking');
          await say(reply);
          if (run.current !== gen) return;
        }
      }
    },
    [chatSend, say],
  );

  const startVoice = useCallback(async () => {
    if (!micSupported()) {
      setVoice('blocked');
      return;
    }
    const gen = ++run.current;

    /* This runs inside the tap, which is the only moment iOS and Chrome will
     * let a page open audio playback for the rest of the conversation. */
    unlockAudio();

    if (canSpeakIn(langRef.current)) {
      setVoice('speaking');
      await say(GREETING[langRef.current]);
      if (run.current !== gen) return;
    }
    void loop(gen);
  }, [loop, say]);

  const onOrbClick = useCallback(() => {
    if (voice === 'speaking') {
      /* Barge-in: cancelling resolves the utterance, and the loop listens next. */
      speech.current?.cancel();
      return;
    }
    if (voice === 'listening') {
      listener.current?.submit();
      return;
    }
    if (voice === 'idle' || voice === 'blocked') {
      const gen = ++run.current;
      void loop(gen);
    }
  }, [voice, loop]);

  /**
   * Text still works while voice mode is on: the loop stands down for the turn,
   * the answer is spoken, and listening picks up again afterwards.
   */
  const send = useCallback(
    async (preset?: string) => {
      const text = (preset ?? chatInput).trim();
      if (!text) return;

      if (voice === 'off') {
        void chatSend(text);
        if (!preset) setChatInput('');
        return;
      }

      const gen = ++run.current;
      listener.current?.abort();
      speech.current?.cancel();
      if (!preset) setChatInput('');

      setVoice('thinking');
      const reply = await chatSend(text, { voice: true });
      if (run.current !== gen) return;

      if (reply && canSpeakIn(langRef.current)) {
        setVoice('speaking');
        await say(reply);
        if (run.current !== gen) return;
      }
      void loop(gen);
    },
    [chatInput, chatSend, setChatInput, voice, loop, say],
  );

  const toggleVoice = useCallback(() => {
    if (voice === 'off') void startVoice();
    else stopVoice();
  }, [voice, startVoice, stopVoice]);

  /* The booking panel covers the widget, and a closed chat should be silent. */
  useEffect(() => {
    if ((panel || !chatOpen) && voice !== 'off') stopVoice();
  }, [panel, chatOpen, voice, stopVoice]);

  useEffect(() => stopVoice, [stopVoice]);

  const openWithVoice = useCallback(() => {
    if (!chatOpen) toggleChat();
    void startVoice();
  }, [chatOpen, toggleChat, startVoice]);

  const status = voice === 'off' ? T.idle : T[voice as keyof typeof T] ?? T.idle;
  const hint =
    voice === 'listening'
      ? T.hintListening
      : voice === 'thinking'
        ? T.hintThinking
        : voice === 'speaking'
          ? T.hintSpeaking
          : voice === 'blocked'
            ? T.hintBlocked
            : T.hintIdle;
  const pick = (pair: { en: string; bn: string }) => (isBn ? pair.bn : pair.en);

  return (
    <div
      style={css(
        'position:fixed;right:20px;bottom:20px;z-index:150;display:flex;flex-direction:column;align-items:flex-end;gap:12px;transition:opacity .4s var(--eo), transform .4s var(--eo);' +
          (panel ? 'opacity:0;pointer-events:none;transform:translateY(20px)' : 'opacity:1;pointer-events:auto;transform:translateY(0)'),
      )}
    >
      {chatOpen && (
        <div
          role="dialog"
          aria-label="Ask reception"
          style={css('width:min(370px,calc(100vw - 40px));height:min(560px,74vh);background:var(--limestone);border:var(--bl);box-shadow:0 40px 90px -40px rgba(0,0,0,.55);display:flex;flex-direction:column')}
        >
          <div style={css('padding:16px 18px;border-bottom:var(--bl);display:flex;align-items:center;justify-content:space-between;gap:10px')}>
            <div>
              <p style={css('font-family:var(--fu);font-size:11.5px;letter-spacing:.2em;color:var(--slate)')}>
                RECEPTION DESK
              </p>
              <p style={css('font-size:13.5px;font-weight:700;margin-top:4px;display:flex;align-items:center;gap:8px')}>
                <span aria-hidden="true" style={css('width:6px;height:6px;background:var(--lacquer);border-radius:50%;display:block')} />
                Answering now
              </p>
            </div>

            <div style={css('display:flex;align-items:center;gap:6px')}>
              <button
                type="button"
                onClick={toggleVoice}
                aria-pressed={voice !== 'off'}
                aria-label={voice === 'off' ? pick(T.talk) : 'End voice mode'}
                style={css(
                  'display:flex;align-items:center;gap:6px;font-family:var(--fu);font-size:10.5px;letter-spacing:.12em;border:var(--bl);padding:0 10px;min-height:38px;border-radius:2px;transition:background .3s var(--eo),color .3s var(--eo);' +
                    (voice === 'off'
                      ? 'color:var(--slate)'
                      : 'background:var(--lacquer);color:#fff;border-color:var(--lacquer)'),
                )}
                data-hover-style={voice === 'off' ? 'background:var(--mist)' : undefined}
              >
                <MicGlyph on={voice !== 'off'} />
                {voice === 'off' ? pick(T.voice) : pick(T.end)}
              </button>
              <button
                type="button"
                onClick={toggleChat}
                aria-label="Close chat"
                style={css('font-family:var(--fu);font-size:12px;color:var(--slate);min-height:44px;padding:0 4px')}
              >
                ✕
              </button>
            </div>
          </div>

          {voice !== 'off' && (
            <div
              style={css('display:flex;align-items:center;gap:14px;padding:14px 18px;border-bottom:var(--bl);background:var(--mist)')}
            >
              <VoiceOrb
                state={voice}
                levelRef={levelRef}
                liveLevel={liveLevel}
                onClick={onOrbClick}
                label={pick(status)}
              />
              <div style={css('min-width:0')}>
                <p
                  aria-live="polite"
                  style={css('font-family:var(--fu);font-size:11px;letter-spacing:.18em;color:var(--ink)')}
                >
                  {pick(status)}
                </p>
                <p style={css('font-size:12.5px;line-height:1.5;color:var(--slate);margin-top:5px')}>
                  {pick(hint)}
                </p>
                {!canTalk && voice !== 'blocked' && (
                  <p style={css('font-size:11.5px;line-height:1.5;color:var(--lacquer);margin-top:6px')}>
                    {pick(T.noVoice)}
                  </p>
                )}
              </div>
            </div>
          )}

          <div
            ref={scroller}
            data-lenis-prevent="1"
            style={css('flex:1;overflow-y:auto;padding:18px;display:flex;flex-direction:column;gap:10px')}
          >
            {chatMsgs.map((m, i) => (
              <div
                key={i}
                style={css(
                  'max-width:82%;padding:11px 14px;border-radius:2px;font-size:13.5px;line-height:1.55;white-space:pre-wrap;' +
                    (m.who === 'you'
                      ? 'align-self:flex-end;background:var(--ink);color:var(--limestone);'
                      : 'align-self:flex-start;background:var(--mist);color:var(--ink);'),
                )}
              >
                {m.text === '…' ? (
                  <span style={css('display:flex;align-items:center;gap:4px;height:18px')}>
                    <span className="hv-typing-dot" />
                    <span className="hv-typing-dot" />
                    <span className="hv-typing-dot" />
                  </span>
                ) : (
                  <span>{m.text}</span>
                )}
              </div>
            ))}
          </div>

          <div
            data-noscroll="1"
            data-lenis-prevent="1"
            style={css('display:flex;gap:6px;padding:0 18px 12px;overflow-x:auto')}
          >
            {(isBn ? CHIPS.bn : CHIPS.en).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => send(c)}
                style={css('font-family:var(--fu);font-size:11px;letter-spacing:.08em;border:var(--bl);padding:8px 11px;min-height:38px;border-radius:2px;color:var(--slate);white-space:nowrap')}
              >
                {c}
              </button>
            ))}
          </div>

          <div style={css('display:flex;gap:8px;padding:14px 18px;border-top:var(--bl)')}>
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  void send();
                }
              }}
              placeholder={pick(T.placeholder)}
              aria-label="Message reception"
              style={css('flex:1;font-size:14px;min-height:44px;border-bottom:var(--bl)')}
            />
            <button
              type="button"
              onClick={() => void send()}
              style={css('background:var(--lacquer);color:#fff;font-size:13px;font-weight:700;padding:0 18px;min-height:44px;border-radius:2px')}
            >
              {pick(T.send)}
            </button>
          </div>
        </div>
      )}

      <div style={css('display:flex;align-items:center;gap:10px')}>
        {!chatOpen && (
          <button
            type="button"
            onClick={openWithVoice}
            aria-label={pick(T.talk)}
            style={css('display:flex;align-items:center;justify-content:center;width:52px;height:52px;background:var(--lacquer);color:#fff;border-radius:50%;box-shadow:0 20px 50px -24px rgba(0,0,0,.6);transition:transform .3s var(--eo)')}
            data-hover-style="transform:translateY(-2px)"
          >
            <MicGlyph on large />
          </button>
        )}
        <button
          type="button"
          onClick={toggleChat}
          aria-label="Ask reception"
          style={css('display:flex;align-items:center;gap:10px;background:var(--night);color:var(--limestone);border:var(--bd);padding:14px 18px;min-height:52px;border-radius:2px;box-shadow:0 20px 50px -24px rgba(0,0,0,.6);transition:transform .3s var(--eo)')}
          data-hover-style="transform:translateY(-2px)"
        >
          <span aria-hidden="true" style={css('width:8px;height:8px;background:var(--lacquer);border-radius:50%;display:block')} />
          <span style={css('font-family:var(--fu);font-size:12px;letter-spacing:.14em')}>
            {pick(T.ask)}
          </span>
        </button>
      </div>
    </div>
  );
}

/** Drawn rather than imported, to keep the widget free of an icon dependency. */
function MicGlyph({ on, large }: { on: boolean; large?: boolean }) {
  const size = large ? 20 : 12;
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={large ? 1.9 : 2.1}
      strokeLinecap="round"
      style={{ opacity: on ? 1 : 0.75, flex: 'none' }}
    >
      <rect x="9" y="2.5" width="6" height="11.5" rx="3" />
      <path d="M5 11.5a7 7 0 0 0 14 0" />
      <path d="M12 18.5V21.5" />
    </svg>
  );
}
