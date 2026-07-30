'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { css } from '@/lib/css';
import { lenisRef } from '@/lib/lenisStore';

/**
 * The whole motion system of the site, ported from the design source:
 * smooth scroll, section rail, reveal/counter/fill observers, hero split text,
 * the pinned room track, the scaling wordmark mask, the flipping menu book and
 * the responsive chrome rules. Sections opt in through `data-hv-*` attributes,
 * exactly like the prototype opted in through refs.
 */

interface Tick {
  label: string;
  id: string;
  pct: number;
}

type El = HTMLElement | null;

const q = (sel: string): El => document.querySelector(sel) as El;
const qa = (sel: string): HTMLElement[] => Array.from(document.querySelectorAll(sel)) as HTMLElement[];

export function MotionRoot({ showRail = true, smoothScroll = true }: { showRail?: boolean; smoothScroll?: boolean }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin') ?? false;

  const [ticks, setTicks] = useState<Tick[]>([]);

  const rail = useRef<HTMLElement | null>(null);
  const railFill = useRef<HTMLDivElement | null>(null);
  const railDot = useRef<HTMLDivElement | null>(null);
  const railLabel = useRef<HTMLDivElement | null>(null);
  const tickEls = useRef<{ el: El; pct: number }[]>([]);

  const store = useRef({
    lastY: -1,
    force: true,
    prevY: 0,
    reduced: false,
    sections: [] as HTMLElement[],
    words: [] as HTMLElement[],
    svcBlocks: [] as HTMLElement[],
    svcMedia: [] as HTMLElement[],
    leaves: [] as HTMLElement[],
    svcActive: -1,
    railLabelText: '',
    tickSig: '',
  });

  /* ---------- responsive chrome ---------- */
  const applyChrome = useCallback(() => {
    const w = window.innerWidth;
    const nav = q('[data-hv-nav]');
    if (nav) nav.style.display = w >= 1024 ? 'flex' : 'none';
    const phone = q('[data-hv-phone]');
    if (phone) phone.style.display = w >= 1300 ? 'block' : 'none';
    const bar = q('[data-hv-mobile-bar]');
    if (bar) bar.style.display = w < 1024 ? 'flex' : 'none';
    const wa = q('[data-hv-wa]');
    if (wa) wa.style.display = w < 1024 ? 'flex' : 'none';

    qa('[data-hero-building]').forEach((el) => {
      el.style.width = w < 900 ? '100%' : 'min(78%,1280px)';
      el.style.opacity = w < 900 ? '.55' : '1';
    });

    const svcGrid = q('[data-hv-svc-grid]');
    if (svcGrid) svcGrid.style.gridTemplateColumns = w >= 900 ? '0.9fr 1.1fr' : '1fr';
    const svcMediaWrap = q('[data-hv-svc-media-wrap]');
    if (svcMediaWrap) {
      svcMediaWrap.style.position = w >= 900 ? 'sticky' : 'relative';
      svcMediaWrap.style.top = '14vh';
    }
    qa('[data-two-col]').forEach((el) => {
      el.style.gridTemplateColumns = w >= 900 ? el.dataset.twoCol || '1fr 1fr' : '1fr';
    });
  }, []);

  /* ---------- measurement ---------- */
  const measure = useCallback(() => {
    const s = store.current;
    const w = window.innerWidth;
    s.sections = qa('[data-floor]');

    const trackWrap = q('[data-hv-track-wrap]');
    const track = q('[data-hv-track]');
    const trackScroll = q('[data-hv-track-scroll]');
    if (trackWrap && track) {
      const sticky = trackWrap.firstElementChild as El;
      if (w < 640) {
        trackWrap.style.height = 'auto';
        track.style.transform = 'none';
        if (trackScroll) {
          trackScroll.style.scrollSnapType = 'x mandatory';
          trackScroll.style.overflowX = 'auto';
        }
        if (sticky) {
          sticky.style.position = 'static';
          sticky.style.height = 'auto';
        }
      } else {
        if (sticky) {
          sticky.style.position = 'sticky';
          sticky.style.height = '100vh';
        }
        if (trackScroll) trackScroll.style.overflowX = 'hidden';
        const extra = Math.max(0, track.scrollWidth - w + 40);
        trackWrap.style.height = window.innerHeight + extra + 'px';
      }
    }

    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const next: Tick[] = s.sections.map((sec) => {
      const top = sec.getBoundingClientRect().top + window.scrollY;
      return {
        label: sec.dataset.floor || '',
        id: sec.dataset.floorId || '',
        pct: Math.max(0, Math.min(1, top / Math.max(1, docH))),
      };
    });
    const sig = next.map((t) => t.id + t.pct.toFixed(4)).join('|');
    if (sig !== s.tickSig) {
      s.tickSig = sig;
      setTicks(next);
    }
    if (rail.current) {
      rail.current.style.display = w >= 1180 && showRail && !isAdmin ? 'block' : 'none';
    }
    lenisRef.current?.resize();
    s.force = true;
  }, [showRail, isAdmin]);

  /* ---------- text splitting ---------- */
  const splitHero = useCallback(() => {
    const s = store.current;
    const h = q('[data-hero-split]') as (HTMLElement & { __s?: number }) | null;
    if (h && !h.__s) {
      h.__s = 1;
      if (!s.reduced) {
        const base = window.location.pathname === '/' ? 1.2 : 0;
        const words = (h.textContent || '').trim().split(/(\s+)/);
        h.textContent = '';
        let charIdx = 0;
        words.forEach((word) => {
          if (!word.trim()) {
            h.appendChild(document.createTextNode(word));
            return;
          }
          const outer = document.createElement('span');
          outer.style.cssText = 'display:inline-block';
          for (let i = 0; i < word.length; i++) {
            const inner = document.createElement('span');
            inner.style.cssText = 'opacity:0;transition:opacity 0.05s linear ' + (base + charIdx * 0.035) + 's';
            inner.textContent = word[i];
            outer.appendChild(inner);
            requestAnimationFrame(() =>
              requestAnimationFrame(() => {
                inner.style.opacity = '1';
              }),
            );
            charIdx++;
          }
          h.appendChild(outer);
        });
      }
    }

    const base = window.location.pathname === '/' ? 1.2 : 0;
    qa('[data-hero-el]').forEach((el, i) => {
      const flagged = el as HTMLElement & { __h?: number };
      if (flagged.__h) return;
      flagged.__h = 1;
      if (s.reduced) return;
      el.style.opacity = '0';
      el.style.transform = 'translateY(18px)';
      el.style.transition =
        'opacity .9s var(--eo) ' + (base + 0.8 + i * 0.09) + 's, transform .9s var(--eo) ' + (base + 0.8 + i * 0.09) + 's';
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          el.style.opacity = '1';
          el.style.transform = 'none';
        }),
      );
    });
  }, []);

  const splitMani = useCallback(() => {
    const s = store.current;
    const el = q('[data-hv-mani]') as (HTMLElement & { __s?: number }) | null;
    if (!el || el.__s) return;
    el.__s = 1;
    const words = (el.textContent || '').trim().split(/\s+/);
    el.textContent = '';
    s.words = words.map((word, i) => {
      const span = document.createElement('span');
      span.textContent = word;
      span.style.cssText = 'display:inline-block;opacity:.14;color:#5B6058;will-change:opacity';
      el.appendChild(span);
      if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
      return span;
    });
    if (s.reduced) {
      s.words.forEach((span) => {
        span.style.opacity = '1';
        span.style.color = '#16181A';
      });
    }
  }, []);

  /* ---------- counters ---------- */
  const runCount = useCallback((el: HTMLElement) => {
    const to = Number(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const pad = Number(el.dataset.pad || 0);
    if (store.current.reduced) return;
    const t0 = performance.now();
    const dur = 1050;
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      const v = Math.round(to * eased);
      el.textContent = (pad ? String(v).padStart(pad, '0') : String(v)) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    el.textContent = (pad ? '00' : '0') + suffix;
    requestAnimationFrame(step);
  }, []);

  /* ---------- per frame ---------- */
  const frame = useCallback(() => {
    const s = store.current;
    const y = window.scrollY;
    if (y === s.lastY && !s.force) return;
    s.lastY = y;
    s.force = false;

    const vh = window.innerHeight;
    const w = window.innerWidth;
    const docH = Math.max(1, document.documentElement.scrollHeight - vh);
    const p = Math.min(1, Math.max(0, y / docH));
    const isHome = window.location.pathname === '/';

    const header = q('[data-hv-header]');
    if (header) {
      const past = y > vh * 0.8 || !isHome;
      const solid = y > 40 && !isHome;
      header.style.height = y > 60 ? '64px' : '92px';
      if (past || solid) {
        header.style.background = 'rgba(14,17,20,.75)';
        header.style.backdropFilter = 'blur(14px)';
        header.style.borderBottomColor = 'rgba(233,234,229,.12)';
      } else {
        header.style.background = 'transparent';
        header.style.backdropFilter = 'none';
        header.style.borderBottomColor = 'transparent';
      }
    }

    if (rail.current && rail.current.style.display !== 'none' && railFill.current && railDot.current) {
      const railH = rail.current.offsetHeight;
      railFill.current.style.height = p * railH + 'px';
      railDot.current.style.transform = 'translateY(' + (p * railH - 4) + 'px)';
      let cur: HTMLElement | null = null;
      for (const sec of s.sections) {
        if (sec.getBoundingClientRect().top <= vh * 0.42) cur = sec;
      }
      const label = cur ? cur.dataset.floor || '' : 'G · TOP';
      const rl = railLabel.current;
      if (rl && s.railLabelText !== label) {
        s.railLabelText = label;
        rl.style.transition = 'none';
        rl.style.transform = 'translateY(-9px) translateY(10px)';
        rl.style.opacity = '0';
        rl.textContent = label;
        requestAnimationFrame(() => {
          rl.style.transition = 'transform .18s var(--eio),opacity .18s var(--eio)';
          rl.style.transform = 'translateY(-9px)';
          rl.style.opacity = '1';
        });
      }
      if (rl) rl.style.top = p * railH + 'px';
      tickEls.current.forEach((o) => {
        if (o.el) o.el.style.top = o.pct * railH + 'px';
      });
    }

    if (!s.reduced) {
      const heroBg = q('[data-hv-hero-bg]');
      const heroFg = q('[data-hv-hero-fg]');
      if (heroBg && y < vh * 1.3) {
        const d = w < 640 ? 0.5 : 1;
        heroBg.style.transform = 'translate3d(0,' + y * 0.62 * d + 'px,0)';
        if (heroFg) heroFg.style.transform = 'translate3d(0,' + y * 0.42 * d + 'px,0)';
      }

      const maniWrap = q('[data-hv-mani-wrap]');
      if (maniWrap && s.words.length) {
        const r = maniWrap.getBoundingClientRect();
        const total = r.height - vh;
        const mp = Math.min(1, Math.max(0, -r.top / Math.max(1, total)));
        const n = s.words.length;
        const span = 4.5;
        for (let i = 0; i < n; i++) {
          const l = Math.min(1, Math.max(0, (mp * (n + span) - i) / span));
          const word = s.words[i];
          word.style.opacity = String(0.14 + 0.86 * l);
          word.style.color = l > 0.55 ? '#16181A' : '#5B6058';
        }
        const maniBg = q('[data-hv-mani-bg]');
        if (maniBg) maniBg.style.transform = 'scale(' + (1.15 - 0.15 * mp) + ')';
      }

      const trackWrap = q('[data-hv-track-wrap]');
      const track = q('[data-hv-track]');
      if (trackWrap && track && w >= 640) {
        const r = trackWrap.getBoundingClientRect();
        const total = r.height - vh;
        const tp = Math.min(1, Math.max(0, -r.top / Math.max(1, total)));
        const max = Math.max(0, track.scrollWidth - w + 40);
        track.style.transform = 'translate3d(' + -tp * max + 'px,0,0)';
        const idxEl = q('[data-hv-track-idx]');
        if (idxEl) {
          const count = Number(idxEl.dataset.hvTrackIdx) || 8;
          const idx = Math.min(count, Math.max(1, Math.round(tp * (count - 1)) + 1));
          idxEl.textContent = String(idx).padStart(2, '0') + ' / ' + String(count).padStart(2, '0');
        }
      }

      const mapPara = q('[data-hv-map-para]');
      if (mapPara && mapPara.parentElement) {
        const r = mapPara.parentElement.getBoundingClientRect();
        if (r.top < vh && r.bottom > 0) {
          mapPara.style.transform = 'translate3d(0,' + ((vh - r.top) * 0.06 - 40) + 'px,0)';
        }
      }

      const wmWrap = q('[data-hv-wm-wrap]');
      const maskStage = q('[data-hv-mask-stage]');
      const wmImg = q('[data-hv-wm-img]');
      if (wmWrap && maskStage) {
        const r = wmWrap.getBoundingClientRect();
        const qv = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - vh)));
        const e = Math.min(1, qv / 0.88);
        const S = 1 + Math.pow(e, 2.2) * 30;
        maskStage.style.transform = 'scale(' + S.toFixed(3) + ')';
        if (wmImg) wmImg.style.transform = 'scale(' + (1 / S).toFixed(4) + ')';
      }
    }

    if (s.svcBlocks.length) {
      let active = 0;
      s.svcBlocks.forEach((b, i) => {
        if (b && b.getBoundingClientRect().top < vh * 0.55) active = i;
      });
      if (s.svcActive !== active) {
        s.svcActive = active;
        s.svcBlocks.forEach((b, i) => {
          if (b) b.style.opacity = i === active ? '1' : '.3';
        });
        s.svcMedia.forEach((m, i) => {
          if (m) m.style.opacity = i === active ? '1' : '0';
        });
        const idx = q('[data-hv-svc-idx]');
        if (idx) {
          idx.textContent =
            String(active + 1).padStart(2, '0') + ' / ' + String(s.svcBlocks.length).padStart(2, '0');
        }
      }
    }

    const bookWrap = q('[data-hv-book-wrap]') as (HTMLElement & { __h?: number }) | null;
    if (bookWrap && s.leaves.length) {
      const n = s.leaves.length;
      const want = Math.round(vh * (0.85 * n + 1));
      if (bookWrap.__h !== want) {
        bookWrap.__h = want;
        bookWrap.style.height = want + 'px';
      }
      const r = bookWrap.getBoundingClientRect();
      const bp = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - vh)));
      for (let i = 0; i < n; i++) {
        const leaf = s.leaves[i];
        if (!leaf) continue;
        const a = Math.min(1, Math.max(0, bp * n - i));
        leaf.style.transform = 'rotateY(' + -179.6 * a + 'deg)';
        leaf.style.zIndex = String(a < 0.5 ? n - i + 10 : n + i + 10);
      }
      const bookIdx = q('[data-hv-book-idx]');
      if (bookIdx) {
        bookIdx.textContent =
          String(Math.min(n, Math.floor(bp * n) + 1)).padStart(2, '0') + ' / ' + String(n).padStart(2, '0');
      }
    }

    const bar = q('[data-hv-mobile-bar]');
    if (bar) {
      const down = y > s.prevY && y > 200;
      bar.style.transform = down ? 'translateY(120%)' : 'translateY(0)';
      s.prevY = y;
    }
  }, []);

  /* ---------- observers, lenis, listeners ---------- */
  const io = useRef<IntersectionObserver | null>(null);
  const cio = useRef<IntersectionObserver | null>(null);
  const fio = useRef<IntersectionObserver | null>(null);

  const afterRoute = useCallback(() => {
    const s = store.current;
    s.words = [];
    s.svcActive = -1;
    s.svcBlocks = qa('[data-hv-svc-block]');
    s.svcMedia = qa('[data-hv-svc-media]');
    s.leaves = qa('[data-hv-leaf]');
    if (s.svcMedia[0]) s.svcMedia[0].style.opacity = '1';

    /*
     * Elements are prepared once (the `__rev`/`__c`/`__f` flags) but observed
     * every pass until they have actually fired. Without that second guard a
     * remount — StrictMode in development, or a fast refresh — would leave
     * prepared-but-unobserved elements stuck at opacity 0, because the observer
     * that was watching them got disconnected with the previous effect.
     */
    qa('[data-rev]').forEach((el, i) => {
      const flagged = el as HTMLElement & { __rev?: number; __revDone?: number };
      if (!flagged.__rev) {
        flagged.__rev = 1;
        if (s.reduced) {
          el.style.opacity = '1';
          flagged.__revDone = 1;
          return;
        }
        el.style.opacity = '0';
        el.style.transform = 'translateY(26px)';
        el.style.transition =
          'opacity .85s var(--eo) ' + (i % 6) * 0.06 + 's, transform .85s var(--eo) ' + (i % 6) * 0.06 + 's';
      }
      if (!flagged.__revDone) io.current?.observe(el);
    });

    qa('[data-count]').forEach((el) => {
      const flagged = el as HTMLElement & { __c?: number; __cDone?: number };
      flagged.__c = 1;
      if (!flagged.__cDone) cio.current?.observe(el);
    });

    qa('[data-fill]').forEach((el) => {
      const flagged = el as HTMLElement & { __f?: number; __fDone?: number };
      if (!flagged.__f) {
        flagged.__f = 1;
        if (s.reduced) return;
        el.style.clipPath = 'inset(0 0 100% 0)';
        el.style.transition = 'clip-path 1.15s var(--eo) ' + Number(el.dataset.fillDelay || 0) / 1000 + 's';
      }
      if (s.reduced || flagged.__fDone) return;
      fio.current?.observe(el);
    });

    splitHero();
    splitMani();
    applyChrome();
    window.setTimeout(() => measure(), 80);
  }, [applyChrome, measure, splitHero, splitMani]);

  useEffect(() => {
    const s = store.current;
    s.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    io.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const el = e.target as HTMLElement & { __revDone?: number };
            el.style.opacity = '1';
            el.style.transform = 'none';
            el.__revDone = 1;
            io.current?.unobserve(e.target);
          }
        });
      },
      { rootMargin: '0px 0px -18% 0px' },
    );
    cio.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement & { __cDone?: number }).__cDone = 1;
            runCount(e.target as HTMLElement);
            cio.current?.unobserve(e.target);
          }
        });
      },
      { rootMargin: '0px 0px -20% 0px' },
    );
    fio.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const el = e.target as HTMLElement & { __fDone?: number };
            el.style.clipPath = 'inset(0 0 0% 0)';
            el.__fDone = 1;
            fio.current?.unobserve(e.target);
          }
        });
      },
      { rootMargin: '0px 0px -14% 0px' },
    );

    let raf = 0;
    let cancelled = false;

    const tick = (t: number) => {
      if (cancelled) return;
      lenisRef.current?.raf(t);
      frame();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    if (smoothScroll && !s.reduced) {
      import('lenis')
        .then(({ default: Lenis }) => {
          if (cancelled) return;
          lenisRef.current = new Lenis({ lerp: 0.085, smoothWheel: true }) as unknown as typeof lenisRef.current;
        })
        .catch(() => {});
    }

    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        applyChrome();
        measure();
      }, 160);
    };
    window.addEventListener('resize', onResize);

    /* `data-hover-style` mirrors the design source's `style-hover` attribute. */
    const onOver = (event: Event) => {
      const target = (event.target as HTMLElement | null)?.closest?.('[data-hover-style]') as
        | (HTMLElement & { __hov?: number })
        | null;
      if (!target || target.__hov) return;
      target.__hov = 1;
      const decls = (target.dataset.hoverStyle || '')
        .split(';')
        .map((d) => d.trim())
        .filter(Boolean)
        .map((d) => {
          const i = d.indexOf(':');
          return [d.slice(0, i).trim(), d.slice(i + 1).trim()] as [string, string];
        });
      const previous = decls.map(([prop]) => [prop, target.style.getPropertyValue(prop)] as [string, string]);
      decls.forEach(([prop, value]) => target.style.setProperty(prop, value));
      const off = () => {
        previous.forEach(([prop, value]) => {
          if (value) target.style.setProperty(prop, value);
          else target.style.removeProperty(prop);
        });
        target.__hov = 0;
        target.removeEventListener('mouseleave', off);
        target.removeEventListener('blur', off);
      };
      target.addEventListener('mouseleave', off);
      target.addEventListener('blur', off);
    };
    document.addEventListener('mouseover', onOver, true);

    if (document.fonts?.ready) {
      document.fonts.ready.then(() => window.setTimeout(() => measure(), 50));
    }

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('mouseover', onOver, true);
      window.clearTimeout(resizeTimer);
      io.current?.disconnect();
      cio.current?.disconnect();
      fio.current?.disconnect();
      lenisRef.current?.destroy();
      lenisRef.current = null;
    };
  }, [applyChrome, frame, measure, runCount, smoothScroll]);

  /* Re-arm everything whenever a new page's markup lands. */
  useEffect(() => {
    store.current.lastY = -1;
    store.current.force = true;
    const t = window.setTimeout(() => afterRoute(), 60);
    afterRoute();
    return () => window.clearTimeout(t);
  }, [pathname, afterRoute]);

  const goToSection = (id: string) => () => {
    const el = document.querySelector(`[data-floor-id="${id}"]`);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 40;
    if (lenisRef.current) lenisRef.current.scrollTo(top);
    else window.scrollTo({ top, behavior: 'smooth' });
  };

  tickEls.current = [];

  return (
    <nav
      aria-label="Section rail"
      ref={rail}
      data-rail="1"
      style={css('position:fixed;left:18px;top:20vh;height:60vh;width:150px;z-index:60;pointer-events:none;display:none')}
    >
      <div style={css('position:absolute;left:0;top:0;bottom:0;width:2px;background:rgba(22,24,26,.14)')} />
      <div
        ref={railFill}
        style={css('position:absolute;left:0;top:0;width:2px;height:0;background:var(--lacquer);transform-origin:top')}
      />
      <div
        ref={railDot}
        style={css('position:absolute;left:-3px;top:0;width:8px;height:8px;background:var(--lacquer);border-radius:50%;transform:translateY(-4px)')}
      />
      <div
        ref={railLabel}
        style={css('display:none;position:absolute;left:16px;top:0;transform:translateY(-9px);font-family:var(--fu);font-size:12.5px;letter-spacing:.2em;color:var(--slate);white-space:nowrap;overflow:hidden;height:18px;line-height:18px')}
      />
      {ticks.map((tk, i) => (
        <button
          key={tk.id + i}
          type="button"
          onClick={goToSection(tk.id)}
          aria-label={tk.label}
          data-hover-style="opacity:.6"
          ref={(el) => {
            tickEls.current[i] = { el, pct: tk.pct };
            if (el && rail.current) el.style.top = tk.pct * rail.current.offsetHeight + 'px';
          }}
          style={css('position:absolute;left:-8px;width:26px;height:16px;pointer-events:auto;display:flex;align-items:center')}
        >
          <span style={css('width:9px;height:1px;background:rgba(22,24,26,.34);display:block')} />
        </button>
      ))}
    </nav>
  );
}
