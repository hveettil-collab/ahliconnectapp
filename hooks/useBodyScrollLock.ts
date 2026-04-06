'use client';
import { useEffect } from 'react';

/**
 * Locks body scroll when `locked` is true.
 * Prevents background content from scrolling when modals/bottom sheets are open.
 */
export function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;

    const scrollY = window.scrollY;
    const body = document.body;
    const html = document.documentElement;

    // Save current overflow values
    const originalBodyOverflow = body.style.overflow;
    const originalHtmlOverflow = html.style.overflow;
    const originalBodyPosition = body.style.position;
    const originalBodyTop = body.style.top;
    const originalBodyWidth = body.style.width;

    // Lock scroll — use position fixed to truly prevent scroll on iOS/Android
    body.style.overflow = 'hidden';
    html.style.overflow = 'hidden';
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.width = '100%';

    return () => {
      body.style.overflow = originalBodyOverflow;
      html.style.overflow = originalHtmlOverflow;
      body.style.position = originalBodyPosition;
      body.style.top = originalBodyTop;
      body.style.width = originalBodyWidth;
      window.scrollTo(0, scrollY);
    };
  }, [locked]);
}
