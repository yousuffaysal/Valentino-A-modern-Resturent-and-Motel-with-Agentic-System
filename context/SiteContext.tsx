'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useRouter } from 'next/navigation';
import type { Addon, Room } from '@/lib/defaults';
import { hash, iso, nightsBetween, parse, today, VAT_RATE } from '@/lib/format';
import { lenisRef } from '@/lib/lenisStore';

export type Lang = 'en' | 'bn';
export type Panel = null | 'book' | 'table';
export type AvailState = 'idle' | 'loading' | 'ok' | 'empty';
export type SortKey = 'recommended' | 'price' | 'capacity';

export interface AvailRoom extends Room {
  left: number;
  out: boolean;
}

export interface ChatMsg {
  who: 'you' | 'bot';
  text: string;
}

interface BookingForm {
  name: string;
  mobile: string;
  email: string;
  arrival: string;
  notes: string;
}

interface TableState {
  step: number;
  date: string | null;
  time: string;
  party: number;
  name: string;
  mobile: string;
  code: string | null;
}

interface SiteContextValue {
  lang: Lang;
  isBn: boolean;
  toggleLang: () => void;

  rooms: Room[];
  addons: Addon[];
  settings: Record<string, string>;

  /** Page transition curtain: 0 hidden, 1 covering, 2 lifting. */
  wipe: number;
  navigate: (href: string) => void;

  panel: Panel;
  openBook: (roomCode?: string) => void;
  openTable: () => void;
  closePanel: () => void;

  step: number;
  setStep: (n: number) => void;
  maxStep: number;
  ci: string | null;
  co: string | null;
  nights: number;
  adults: number;
  kids: number;
  nrooms: number;
  setAdults: (n: number) => void;
  setKids: (n: number) => void;
  setNrooms: (n: number) => void;
  calAnchor: Date;
  shiftMonth: (delta: number) => void;
  pickDate: (isoDate: string) => void;
  setRange: (ci: string, co: string) => void;

  avail: AvailState;
  availRooms: AvailRoom[];
  sort: SortKey;
  setSort: (s: SortKey) => void;
  loadAvail: () => void;

  picked: string | null;
  selectRoom: (code: string) => void;
  pickedRoom: Room | null;

  activeAddons: Record<string, boolean>;
  toggleAddon: (id: string) => void;

  form: BookingForm;
  setField: (key: keyof BookingForm, value: string) => void;
  errors: Partial<Record<'name' | 'mobile' | 'email', string | null>>;
  validate: (key: 'name' | 'mobile' | 'email') => void;
  goToPayment: () => void;

  pay: string;
  setPay: (id: string) => void;
  placing: boolean;
  conf: string | null;
  confirmBooking: () => void;
  resetBooking: () => void;
  copyCode: () => void;

  subtotal: number;
  addonTotal: number;
  vat: number;
  total: number;

  table: TableState;
  setTbl: <K extends keyof TableState>(key: K, value: TableState[K]) => void;
  tblNext: () => void;
  tblConfirm: () => void;

  chatOpen: boolean;
  toggleChat: () => void;
  chatInput: string;
  setChatInput: (v: string) => void;
  chatMsgs: ChatMsg[];
  /** Resolves with the reply as spoken text, or null when nothing came back. */
  chatSend: (preset?: string, opts?: { voice?: boolean }) => Promise<string | null>;
}

const noop = () => {};

const SiteContext = createContext<SiteContextValue | null>(null);

const emptyForm: BookingForm = { name: '', mobile: '', email: '', arrival: '', notes: '' };

const MOBILE_RE = /^01[3-9]\d{8}$/;

export function SiteProvider({
  children,
  rooms,
  addons,
  settings,
}: {
  children: React.ReactNode;
  rooms: Room[];
  addons: Addon[];
  settings: Record<string, string>;
}) {
  const router = useRouter();
  const t0 = useMemo(() => today(), []);

  const [lang, setLang] = useState<Lang>('en');
  const [wipe, setWipe] = useState(0);
  const [panel, setPanel] = useState<Panel>(null);

  const [step, setStepState] = useState(1);
  const [ci, setCi] = useState<string | null>(null);
  const [co, setCo] = useState<string | null>(null);
  const [adults, setAdults] = useState(2);
  const [kids, setKids] = useState(0);
  const [nrooms, setNrooms] = useState(1);
  const [calAnchor, setCalAnchor] = useState(() => new Date(t0.getFullYear(), t0.getMonth(), 1));

  const [avail, setAvail] = useState<AvailState>('idle');
  const [availRooms, setAvailRooms] = useState<AvailRoom[]>([]);
  const [sort, setSort] = useState<SortKey>('recommended');
  const [picked, setPicked] = useState<string | null>(null);
  const [activeAddons, setActiveAddons] = useState<Record<string, boolean>>({});

  const [form, setForm] = useState<BookingForm>(emptyForm);
  const [errors, setErrors] = useState<SiteContextValue['errors']>({});
  const [pay, setPay] = useState('bkash');
  const [placing, setPlacing] = useState(false);
  const [conf, setConf] = useState<string | null>(null);

  const [table, setTable] = useState<TableState>({
    step: 1,
    date: null,
    time: '19:30',
    party: 2,
    name: '',
    mobile: '',
    code: null,
  });

  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMsgs, setChatMsgs] = useState<ChatMsg[]>([
    {
      who: 'bot',
      text: 'Reception desk. Ask me about rooms, rates, the Sky View menu, or how to get here.',
    },
  ]);
  const chatHistory = useRef<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const availToken = useRef(0);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  /* The panel takes over the viewport, so smooth scrolling and body scroll stop. */
  useEffect(() => {
    if (panel) {
      lenisRef.current?.stop();
      document.body.style.overflow = 'hidden';
    } else {
      lenisRef.current?.start();
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [panel]);

  const toggleLang = useCallback(() => setLang((l) => (l === 'en' ? 'bn' : 'en')), []);

  const navigate = useCallback(
    (href: string) => {
      const reduced =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduced) {
        router.push(href);
        return;
      }
      setWipe(1);
      window.setTimeout(() => {
        router.push(href);
        window.scrollTo(0, 0);
        lenisRef.current?.scrollTo(0, { immediate: true });
        setWipe(2);
        window.setTimeout(() => setWipe(0), 420);
      }, 330);
    },
    [router],
  );

  const nights = nightsBetween(ci, co);

  const pickedRoom = useMemo(
    () => rooms.find((r) => r.code === picked) ?? null,
    [rooms, picked],
  );

  const loadAvail = useCallback(
    (over?: { ci?: string | null; co?: string | null; guests?: number }) => {
      const useCi = over?.ci ?? ci;
      const useCo = over?.co ?? co;
      const guests = over?.guests ?? adults + kids;
      if (!useCi || !useCo) return;
      const token = ++availToken.current;
      setAvail('loading');
      fetch(`/api/availability?ci=${useCi}&co=${useCo}&guests=${guests}`)
        .then((r) => r.json())
        .then((data) => {
          if (token !== availToken.current) return;
          const list: AvailRoom[] = data.rooms ?? [];
          setAvailRooms(list);
          setAvail(list.some((r) => !r.out) ? 'ok' : 'empty');
        })
        .catch(() => {
          if (token !== availToken.current) return;
          // Offline fallback keeps the flow usable: everything shown as free.
          const list = rooms
            .filter((r) => r.sleeps >= guests || guests <= 1)
            .map((r) => ({ ...r, left: r.inventory, out: false }));
          setAvailRooms(list);
          setAvail(list.length ? 'ok' : 'empty');
        });
    },
    [ci, co, adults, kids, rooms],
  );

  const maxStep = useMemo(() => {
    if (!ci || !co) return 1;
    if (!picked) return 2;
    if (!form.name) return 4;
    return 5;
  }, [ci, co, picked, form.name]);

  const setStep = useCallback(
    (n: number) => {
      if (n <= maxStep) setStepState(n);
    },
    [maxStep],
  );

  const openBook = useCallback(
    (roomCode?: string) => {
      if (roomCode) setPicked(roomCode);
      setPanel('book');
      setStepState(ci && co ? (roomCode ? 3 : 2) : 1);
      if (ci && co) loadAvail();
    },
    [ci, co, loadAvail],
  );

  const openTable = useCallback(() => {
    setTable((s) => ({ ...s, step: 1, code: null }));
    setPanel('table');
  }, []);

  const closePanel = useCallback(() => setPanel(null), []);

  const shiftMonth = useCallback((delta: number) => {
    setCalAnchor((a) => new Date(a.getFullYear(), a.getMonth() + delta, 1));
  }, []);

  const pickDate = useCallback(
    (date: string) => {
      if (!ci || (ci && co)) {
        setCi(date);
        setCo(null);
        setAvail('idle');
        setPicked(null);
        return;
      }
      if (parse(date) <= parse(ci)) {
        setCi(date);
        setCo(null);
        return;
      }
      setCo(date);
      loadAvail({ co: date });
    },
    [ci, co, loadAvail],
  );

  const setRange = useCallback(
    (nextCi: string, nextCo: string) => {
      setCi(nextCi);
      setCo(nextCo);
      loadAvail({ ci: nextCi, co: nextCo });
    },
    [loadAvail],
  );

  const selectRoom = useCallback((code: string) => {
    setPicked(code);
    setStepState(3);
  }, []);

  const toggleAddon = useCallback((id: string) => {
    setActiveAddons((a) => ({ ...a, [id]: !a[id] }));
  }, []);

  const setField = useCallback((key: keyof BookingForm, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
  }, []);

  const validate = useCallback(
    (key: 'name' | 'mobile' | 'email') => {
      setErrors((prev) => {
        const next = { ...prev };
        if (key === 'name')
          next.name = form.name.trim().length < 2 ? 'Tell us the name the room should be under.' : null;
        if (key === 'mobile')
          next.mobile = MOBILE_RE.test(form.mobile.replace(/\s|-/g, ''))
            ? null
            : 'Enter a mobile number we can confirm on, like 01795855555.';
        if (key === 'email')
          next.email =
            !form.email || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)
              ? null
              : 'Check the email address, we could not read it.';
        return next;
      });
    },
    [form],
  );

  const goToPayment = useCallback(() => {
    (['name', 'mobile', 'email'] as const).forEach(validate);
    if (form.name.trim().length >= 2 && MOBILE_RE.test(form.mobile.replace(/\s|-/g, ''))) {
      setStepState(5);
    }
  }, [form, validate]);

  const subtotal = pickedRoom ? pickedRoom.rate * Math.max(1, nights) * nrooms : 0;
  const addonTotal = addons.reduce(
    (sum, a) =>
      sum + (activeAddons[a.id] ? (a.id === 'bed' ? a.price * Math.max(1, nights) : a.price) : 0),
    0,
  );
  const vat = Math.round((subtotal + addonTotal) * VAT_RATE);
  const total = subtotal + addonTotal + vat;

  const confirmBooking = useCallback(() => {
    if (placing) return;
    setPlacing(true);
    const code = 'HV-' + hash((ci ?? '') + (picked ?? '') + Date.now()).toString(36).toUpperCase().slice(0, 5);
    const payload = {
      id: code,
      name: form.name || 'Anonymous',
      mobile: form.mobile || 'N/A',
      email: form.email || null,
      room: pickedRoom?.name ?? 'Unknown Room',
      roomCode: picked,
      rate: total,
      nights: Math.max(1, nights),
      adults,
      children: kids,
      nrooms,
      ci,
      co,
      status: 'Paid',
      date: iso(new Date()),
      notes: form.notes,
      arrival: form.arrival,
      addons: Object.keys(activeAddons).filter((k) => activeAddons[k]).join(','),
      pay,
    };
    fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .catch(() => {
        /* The guest still gets a code; reception reconciles from the phone call. */
      })
      .finally(() => {
        setPlacing(false);
        setConf(code);
        setStepState(6);
      });
  }, [placing, ci, co, picked, pickedRoom, form, total, nights, adults, kids, nrooms, activeAddons, pay]);

  const resetBooking = useCallback(() => {
    setStepState(1);
    setCi(null);
    setCo(null);
    setPicked(null);
    setActiveAddons({});
    setConf(null);
    setAvail('idle');
    setForm(emptyForm);
    setErrors({});
  }, []);

  const copyCode = useCallback(() => {
    if (navigator.clipboard && conf) navigator.clipboard.writeText(conf);
  }, [conf]);

  const setTbl = useCallback(
    <K extends keyof TableState>(key: K, value: TableState[K]) =>
      setTable((s) => ({ ...s, [key]: value })),
    [],
  );

  const tblNext = useCallback(() => setTable((s) => ({ ...s, step: s.step + 1 })), []);

  const tblConfirm = useCallback(() => {
    const code = 'SV-' + hash(String(Date.now())).toString(36).toUpperCase().slice(0, 4);
    fetch('/api/reservations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: table.name,
        mobile: table.mobile,
        date: table.date ?? iso(new Date()),
        time: table.time,
        party: table.party,
        code,
      }),
    }).catch(() => {});
    setTable((s) => ({ ...s, step: 3, code }));
  }, [table]);

  const toggleChat = useCallback(() => setChatOpen((o) => !o), []);

  const chatSend = useCallback(
    async (preset?: string, opts?: { voice?: boolean }): Promise<string | null> => {
      const q = (preset ?? chatInput).trim();
      if (!q) return null;
      chatHistory.current = [...chatHistory.current, { role: 'user', content: q }];
      setChatInput('');
      setChatMsgs((m) => [...m, { who: 'you', text: q }, { who: 'bot', text: '…' }]);

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          /* Voice turns get a prompt written for the ear rather than the screen. */
          body: JSON.stringify({ messages: chatHistory.current, voice: !!opts?.voice }),
        });
        const data = await res.json();
        let reply: string =
          (data.reply || 'Sorry, I had trouble connecting. Please call us on +880 1795 855555.').trim();

        // The assistant appends a hidden JSON block with whatever it has collected.
        const match = reply.match(/\|\|BOOKING_DATA:(.*?)\|\|/);
        let parsed: Record<string, unknown> | null = null;
        if (match) {
          try {
            parsed = JSON.parse(match[1]);
          } catch {
            parsed = null;
          }
          reply = reply.replace(/\|\|BOOKING_DATA:.*?\|\|/g, '').trim();
        }
        const shouldBook = reply.includes('||OPEN_BOOKING||');
        reply = reply.replace(/\|\|OPEN_BOOKING\|\|/g, '').trim();

        chatHistory.current = [...chatHistory.current, { role: 'assistant', content: reply }];
        setChatMsgs((m) => [...m.slice(0, -1), { who: 'bot', text: reply }]);

        if (parsed) {
          const p = parsed as {
            ci?: string;
            co?: string;
            adults?: number;
            nrooms?: number;
            name?: string;
            mobile?: string;
            email?: string;
            picked?: string;
            complete?: boolean;
          };
          if (p.ci) setCi(p.ci);
          if (p.co) setCo(p.co);
          if (p.adults) setAdults(p.adults);
          if (p.nrooms) setNrooms(p.nrooms);
          if (p.picked) setPicked(p.picked);
          if (p.name || p.mobile || p.email) {
            setForm((f) => ({
              ...f,
              name: p.name ?? f.name,
              mobile: p.mobile ?? f.mobile,
              email: p.email ?? f.email,
            }));
          }
          if (p.ci && p.co) loadAvail({ ci: p.ci, co: p.co, guests: p.adults ?? adults + kids });
          if (p.complete) {
            setPanel('book');
            setStepState(5);
          }
        }
        if (shouldBook && !parsed?.complete) {
          window.setTimeout(() => setPanel('book'), 400);
        }
        return reply;
      } catch {
        const failed = 'Connection issue. Please call us on +880 1795 855555.';
        setChatMsgs((m) => [...m.slice(0, -1), { who: 'bot', text: failed }]);
        return failed;
      }
    },
    [chatInput, adults, kids, loadAvail],
  );

  const value: SiteContextValue = {
    lang,
    isBn: lang === 'bn',
    toggleLang,
    rooms,
    addons,
    settings,
    wipe,
    navigate,
    panel,
    openBook,
    openTable,
    closePanel,
    step,
    setStep,
    maxStep,
    ci,
    co,
    nights,
    adults,
    kids,
    nrooms,
    setAdults,
    setKids,
    setNrooms,
    calAnchor,
    shiftMonth,
    pickDate,
    setRange,
    avail,
    availRooms,
    sort,
    setSort,
    loadAvail: () => loadAvail(),
    picked,
    selectRoom,
    pickedRoom,
    activeAddons,
    toggleAddon,
    form,
    setField,
    errors,
    validate,
    goToPayment,
    pay,
    setPay,
    placing,
    conf,
    confirmBooking,
    resetBooking,
    copyCode,
    subtotal,
    addonTotal,
    vat,
    total,
    table,
    setTbl,
    tblNext,
    tblConfirm,
    chatOpen,
    toggleChat,
    chatInput,
    setChatInput,
    chatMsgs,
    chatSend,
  };

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite(): SiteContextValue {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error('useSite must be used inside SiteProvider');
  return ctx;
}

export const __noop = noop;
