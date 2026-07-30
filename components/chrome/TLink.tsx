'use client';

import React from 'react';
import { useSite } from '@/context/SiteContext';

/**
 * Internal link that plays the full-screen curtain wipe before the route
 * changes, the way the design source did on every navigation.
 */
export function TLink({
  href,
  children,
  style,
  hoverStyle,
  ariaLabel,
  ...rest
}: {
  href: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
  hoverStyle?: string;
  ariaLabel?: string;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'style'>) {
  const { navigate } = useSite();
  return (
    <a
      href={href}
      aria-label={ariaLabel}
      data-hover-style={hoverStyle}
      style={style}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        navigate(href);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
