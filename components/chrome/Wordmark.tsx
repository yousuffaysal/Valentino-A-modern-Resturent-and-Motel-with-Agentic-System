import React from 'react';
import { css } from '@/lib/css';

/** `Valentıno` with the lacquer dot sitting above the dotless i. */
export function Wordmark({ size = '23px', color = '#fff' }: { size?: string; color?: string }) {
  return (
    <span style={css(`font-size:${size};font-weight:800;letter-spacing:-.03em;color:${color};transition:color .4s var(--eo)`)}>
      Valent
      <span style={css('position:relative;display:inline-block')}>
        &#305;
        <span
          aria-hidden="true"
          style={css('position:absolute;left:50%;top:.1em;transform:translateX(-50%);width:.17em;height:.17em;background:var(--lacquer);border-radius:50%;display:block')}
        />
      </span>
      no
    </span>
  );
}
