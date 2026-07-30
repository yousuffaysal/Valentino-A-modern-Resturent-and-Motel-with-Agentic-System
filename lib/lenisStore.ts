/**
 * The smooth-scroll instance is created by MotionRoot but has to be paused by
 * whatever opens a modal, so it lives in a module-level ref both can reach.
 */
export const lenisRef: { current: { stop: () => void; start: () => void; scrollTo: (t: number | string, o?: unknown) => void; raf: (t: number) => void; resize: () => void; destroy: () => void } | null } = {
  current: null,
};
