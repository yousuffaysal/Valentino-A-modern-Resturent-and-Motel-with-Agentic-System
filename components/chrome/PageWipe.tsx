'use client';

import React from 'react';
import { css } from '@/lib/css';
import { useSite } from '@/context/SiteContext';

const TRANSFORMS: Record<number, string> = {
  0: 'translateY(101%)',
  1: 'translateY(0)',
  2: 'translateY(-101%)',
};

/** The dark curtain that covers the viewport between routes. */
export function PageWipe() {
  const { wipe } = useSite();
  return (
    <div
      aria-hidden="true"
      style={css(
        'position:fixed;inset:0;z-index:200;background:var(--night);pointer-events:none;transform:' +
          TRANSFORMS[wipe] +
          ';transition:' +
          (wipe === 0 ? 'none' : 'transform .33s var(--eio)'),
      )}
    />
  );
}
