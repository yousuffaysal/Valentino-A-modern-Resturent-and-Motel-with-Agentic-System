'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { css } from '@/lib/css';
import { Wordmark } from '@/components/chrome/Wordmark';

export function AdminLogin({ defaultPassword }: { defaultPassword: boolean }) {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await fetch('/api/admin/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    setBusy(false);
    if (res.ok) {
      router.refresh();
    } else {
      setError('That password is not right.');
    }
  };

  return (
    <div style={css('min-height:100vh;background:var(--night);display:flex;align-items:center;justify-content:center;padding:24px')}>
      <form
        onSubmit={submit}
        style={css('width:100%;max-width:380px;background:var(--limestone);padding:clamp(28px,4vw,44px);border-radius:2px;box-shadow:0 40px 90px -40px rgba(0,0,0,.7)')}
      >
        <Wordmark color="var(--ink)" size="22px" />
        <p style={css('font-family:var(--fu);font-size:10.5px;letter-spacing:.25em;color:var(--brass);margin-top:4px')}>
          ADMIN PORTAL
        </p>
        <label style={css('display:block;margin-top:32px')}>
          <span style={css('display:block;font-family:var(--fu);font-size:12px;letter-spacing:.18em;color:var(--slate)')}>
            DESK PASSWORD
          </span>
          <input
            type="password"
            value={password}
            autoFocus
            onChange={(e) => setPassword(e.target.value)}
            style={css('width:100%;border-bottom:var(--bl);padding:12px 0;min-height:48px;font-size:15px;font-family:var(--fu)')}
          />
        </label>
        {error && <p style={css('font-size:.8125rem;color:var(--lacquer);margin-top:12px')}>{error}</p>}
        <button
          type="submit"
          disabled={busy}
          style={css('width:100%;background:var(--lacquer);color:#fff;font-size:14px;font-weight:700;padding:16px;min-height:52px;border-radius:2px;margin-top:26px')}
        >
          {busy ? 'Checking…' : 'Enter'}
        </button>
        {defaultPassword && (
          <p style={css('font-size:.75rem;color:var(--slate);margin-top:16px;line-height:1.6')}>
            No ADMIN_PASSWORD is set in the environment, so the portal is using the default password{' '}
            <strong>valentino</strong>. Set ADMIN_PASSWORD in .env before this goes live.
          </p>
        )}
      </form>
    </div>
  );
}
