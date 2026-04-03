'use client';
import { useState, useEffect } from 'react';

/**
 * Detects when the mobile virtual keyboard is open.
 * Uses visualViewport API (best) with a fallback to focusin/focusout events.
 * Returns true when keyboard is likely visible.
 *
 * Also sets a CSS class `keyboard-open` on <html> so CSS can react globally.
 */
export function useKeyboardVisible(): boolean {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const html = document.documentElement;

    function setOpen(open: boolean) {
      setIsKeyboardVisible(open);
      if (open) {
        html.classList.add('keyboard-open');
      } else {
        html.classList.remove('keyboard-open');
      }
    }

    // Method 1: visualViewport (most reliable on modern mobile browsers)
    if (window.visualViewport) {
      const vv = window.visualViewport;
      const initialHeight = vv.height;
      const threshold = 150; // pixels — keyboard is at least this tall

      function onViewportResize() {
        const diff = initialHeight - vv.height;
        setOpen(diff > threshold);
      }

      vv.addEventListener('resize', onViewportResize);
      return () => {
        vv.removeEventListener('resize', onViewportResize);
        html.classList.remove('keyboard-open');
      };
    }

    // Method 2: focusin/focusout fallback
    function onFocusIn(e: FocusEvent) {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT')) {
        setOpen(true);
      }
    }

    function onFocusOut() {
      // Small delay to handle focus moving between inputs
      setTimeout(() => {
        const active = document.activeElement;
        if (!active || (active.tagName !== 'INPUT' && active.tagName !== 'TEXTAREA' && active.tagName !== 'SELECT')) {
          setOpen(false);
        }
      }, 100);
    }

    document.addEventListener('focusin', onFocusIn);
    document.addEventListener('focusout', onFocusOut);

    return () => {
      document.removeEventListener('focusin', onFocusIn);
      document.removeEventListener('focusout', onFocusOut);
      html.classList.remove('keyboard-open');
    };
  }, []);

  return isKeyboardVisible;
}
