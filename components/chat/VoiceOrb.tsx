'use client';

import React, { useEffect, useRef } from 'react';
import { css } from '@/lib/css';
import { prefersReducedMotion } from '@/lib/voice';

export type VoiceState = 'off' | 'idle' | 'listening' | 'thinking' | 'speaking' | 'blocked';

const BARS = 7;
/** Tallest in the middle, shortest at the edges, like a level meter. */
const WEIGHT = [0.45, 0.7, 0.9, 1, 0.9, 0.7, 0.45];

/**
 * The animated face of the reception desk.
 *
 * While the guest is talking the bars are driven by the microphone level, so
 * they are moving to that guest's own voice and not to a canned loop — the
 * quickest way to show that the desk is genuinely hearing them. Thinking and
 * speaking have no signal to sample, so they run synthesised waves instead.
 *
 * Everything animates through refs inside one animation frame; React never
 * re-renders per frame.
 */
export function VoiceOrb({
  state,
  levelRef,
  liveLevel = false,
  onClick,
  label,
}: {
  state: VoiceState;
  levelRef: React.MutableRefObject<number>;
  /** True when `levelRef` carries real amplitude for the current state. */
  liveLevel?: boolean;
  onClick?: () => void;
  label: string;
}) {
  const bars = useRef<(HTMLSpanElement | null)[]>([]);
  const halo = useRef<HTMLSpanElement | null>(null);
  const stateRef = useRef<VoiceState>(state);
  stateRef.current = state;
  const liveRef = useRef(liveLevel);
  liveRef.current = liveLevel;

  useEffect(() => {
    if (prefersReducedMotion()) return;

    let frame = 0;
    /* Each bar trails the one before it, which reads as a wave rather than a row. */
    const smoothed = new Array(BARS).fill(0);

    const tick = (time: number) => {
      const now = stateRef.current;
      for (let i = 0; i < BARS; i++) {
        let target = 0.12;

        if (now === 'listening') {
          const wobble = 0.75 + 0.25 * Math.sin(time / 120 + i * 1.1);
          target = 0.12 + Math.min(1, levelRef.current * 1.35) * WEIGHT[i] * wobble;
        } else if (now === 'speaking') {
          if (liveRef.current) {
            /* The model voice reports its own amplitude, so the bars move to the
             * words actually being said. */
            const wobble = 0.8 + 0.2 * Math.sin(time / 140 + i * 0.9);
            target = 0.16 + Math.min(1, levelRef.current * 1.5) * WEIGHT[i] * wobble;
          } else {
            /* The device voice reports nothing. Two detuned sines read as speech
             * cadence; one alone reads as a machine. */
            const wave =
              0.5 + 0.32 * Math.sin(time / 170 + i * 0.85) + 0.18 * Math.sin(time / 83 + i * 1.9);
            target = 0.18 + Math.max(0, wave) * WEIGHT[i] * 0.78;
          }
        } else if (now === 'thinking') {
          const sweep = Math.sin(time / 260 - i * 0.55);
          target = 0.14 + Math.max(0, sweep) * 0.4;
        } else if (now === 'idle') {
          target = 0.14 + 0.05 * Math.sin(time / 700 + i);
        }

        smoothed[i] += (target - smoothed[i]) * (now === 'listening' ? 0.35 : 0.16);
        const bar = bars.current[i];
        if (bar) bar.style.transform = `scaleY(${Math.max(0.08, smoothed[i]).toFixed(3)})`;
      }

      if (halo.current) {
        const energy =
          now === 'listening' || (now === 'speaking' && liveRef.current)
            ? Math.min(1, levelRef.current * 1.6)
            : now === 'speaking'
              ? 0.35 + 0.25 * Math.abs(Math.sin(time / 180))
              : now === 'thinking'
                ? 0.2 + 0.15 * Math.abs(Math.sin(time / 320))
                : 0.1;
        halo.current.style.transform = `scale(${(1 + energy * 0.22).toFixed(3)})`;
        halo.current.style.opacity = (0.18 + energy * 0.5).toFixed(3);
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [levelRef]);

  const tone =
    state === 'listening' || state === 'speaking'
      ? 'var(--lacquer)'
      : state === 'blocked'
        ? 'var(--slate)'
        : 'var(--ink)';

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      style={css(
        'position:relative;width:96px;height:96px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex:none;transition:background .4s var(--eo);' +
          (state === 'listening' ? 'background:rgba(168,30,45,.07)' : 'background:transparent'),
      )}
    >
      <span
        ref={halo}
        aria-hidden="true"
        style={css(
          'position:absolute;inset:0;border-radius:50%;border:1px solid ' +
            tone +
            ';opacity:.2;transition:border-color .4s var(--eo);will-change:transform,opacity',
        )}
      />
      <span
        aria-hidden="true"
        style={css('position:absolute;inset:14px;border-radius:50%;border:var(--bl)')}
      />
      <span
        aria-hidden="true"
        style={css('display:flex;align-items:center;justify-content:center;gap:4px;height:38px')}
      >
        {Array.from({ length: BARS }).map((_, i) => (
          <span
            key={i}
            ref={(el) => {
              bars.current[i] = el;
            }}
            style={css(
              'display:block;width:3px;height:38px;border-radius:2px;transform:scaleY(.12);transform-origin:center;will-change:transform;transition:background .4s var(--eo);background:' +
                tone,
            )}
          />
        ))}
      </span>
    </button>
  );
}
