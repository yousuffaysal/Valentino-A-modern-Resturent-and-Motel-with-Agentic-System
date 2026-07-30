'use client';

import React, { useEffect, useRef } from 'react';
import { css } from '@/lib/css';
import { useSite } from '@/context/SiteContext';

const CHIPS = ['Room rates', 'Sky View menu', 'How do I get there'];

/** The AI reception desk. Model calls run server side through /api/chat. */
export function ChatWidget() {
  const { chatOpen, toggleChat, chatInput, setChatInput, chatMsgs, chatSend, panel } = useSite();
  const scroller = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scroller.current) scroller.current.scrollTop = scroller.current.scrollHeight;
  }, [chatMsgs, chatOpen]);

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
          style={css('width:min(370px,calc(100vw - 40px));height:min(520px,70vh);background:var(--limestone);border:var(--bl);box-shadow:0 40px 90px -40px rgba(0,0,0,.55);display:flex;flex-direction:column')}
        >
          <div style={css('padding:16px 18px;border-bottom:var(--bl);display:flex;align-items:center;justify-content:space-between;gap:12px')}>
            <div>
              <p style={css('font-family:var(--fu);font-size:11.5px;letter-spacing:.2em;color:var(--slate)')}>
                RECEPTION DESK
              </p>
              <p style={css('font-size:13.5px;font-weight:700;margin-top:4px;display:flex;align-items:center;gap:8px')}>
                <span aria-hidden="true" style={css('width:6px;height:6px;background:var(--lacquer);border-radius:50%;display:block')} />
                Answering now
              </p>
            </div>
            <button
              type="button"
              onClick={toggleChat}
              aria-label="Close chat"
              style={css('font-family:var(--fu);font-size:12px;color:var(--slate);min-height:44px;padding:0 4px')}
            >
              ✕
            </button>
          </div>

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
            {CHIPS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => chatSend(c)}
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
                  chatSend();
                }
              }}
              placeholder="Ask about rooms, food, directions"
              aria-label="Message reception"
              style={css('flex:1;font-size:14px;min-height:44px;border-bottom:var(--bl)')}
            />
            <button
              type="button"
              onClick={() => chatSend()}
              style={css('background:var(--lacquer);color:#fff;font-size:13px;font-weight:700;padding:0 18px;min-height:44px;border-radius:2px')}
            >
              Send
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={toggleChat}
        aria-label="Ask reception"
        style={css('display:flex;align-items:center;gap:10px;background:var(--night);color:var(--limestone);border:var(--bd);padding:14px 18px;min-height:52px;border-radius:2px;box-shadow:0 20px 50px -24px rgba(0,0,0,.6);transition:transform .3s var(--eo)')}
        data-hover-style="transform:translateY(-2px)"
      >
        <span aria-hidden="true" style={css('width:8px;height:8px;background:var(--lacquer);border-radius:50%;display:block')} />
        <span style={css('font-family:var(--fu);font-size:12px;letter-spacing:.14em')}>ASK RECEPTION</span>
      </button>
    </div>
  );
}
