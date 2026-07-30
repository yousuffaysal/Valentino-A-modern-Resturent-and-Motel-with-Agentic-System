import type { CSSProperties } from 'react';

/**
 * The design source for this site is a single HTML file written entirely with
 * inline CSS declaration strings. Converting those strings by hand invites
 * drift, so instead we keep the declarations verbatim and turn them into React
 * style objects at runtime. Results are memoised, so each unique string is
 * parsed once per process.
 */
const cache = new Map<string, CSSProperties>();

/** Split on `;` while ignoring separators nested inside brackets or quotes. */
function splitDeclarations(input: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let quote: string | null = null;
  let start = 0;
  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    if (quote) {
      if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'") {
      quote = ch;
    } else if (ch === '(' || ch === '[') {
      depth++;
    } else if (ch === ')' || ch === ']') {
      depth--;
    } else if (ch === ';' && depth === 0) {
      out.push(input.slice(start, i));
      start = i + 1;
    }
  }
  out.push(input.slice(start));
  return out;
}

function toReactKey(prop: string): string {
  if (prop.startsWith('--')) return prop;
  const camel = prop.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
  // -webkit-font-smoothing => WebkitFontSmoothing
  return prop.startsWith('-') ? camel.charAt(0).toUpperCase() + camel.slice(1) : camel;
}

/** Parse a CSS declaration string, e.g. `color:red;font-size:12px`. */
export function css(declarations: string): CSSProperties {
  const cached = cache.get(declarations);
  if (cached) return cached;

  const style: Record<string, string> = {};
  for (const decl of splitDeclarations(declarations)) {
    const trimmed = decl.trim();
    if (!trimmed) continue;
    const colon = trimmed.indexOf(':');
    if (colon < 1) continue;
    const prop = trimmed.slice(0, colon).trim();
    const value = trimmed.slice(colon + 1).trim();
    if (!prop || !value) continue;
    style[toReactKey(prop)] = value;
  }

  const frozen = style as CSSProperties;
  cache.set(declarations, frozen);
  return frozen;
}

/** Merge extra declarations onto a base string, later values winning. */
export function cx(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(';');
}
