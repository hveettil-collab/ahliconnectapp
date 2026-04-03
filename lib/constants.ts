/** Centralized constants for the Ahli Connect web app */

/* ── localStorage keys ── */
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'ahli_token',
  AUTH_USER: 'ahli_user',
  THEME: 'ahli_theme',
  LANGUAGE: 'ahli_lang',
  ONBOARDING_DONE: 'ahli_onboarding_done',
  SIDEBAR_COLLAPSED: 'ahli_sidebar_collapsed',
} as const;

/* ── Timing / animation delays (ms) ── */
export const TIMING = {
  TOAST_DURATION: 3000,
  STEP_DELAY: 1500,
  CONFETTI_DURATION: 2000,
  VOICE_SUBMIT_DELAY: 300,
} as const;
