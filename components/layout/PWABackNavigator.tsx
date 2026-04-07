'use client';
import { useEffect, useRef, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';

/**
 * PWABackNavigator — Global back-navigation handler for the PWA
 *
 * 1. Swipe right-to-left gesture → router.back()
 * 2. Android hardware back button (popstate) → prevents app exit
 * 3. History stack management for standalone PWA mode
 *
 * Mount once in the root layout — every screen gets it automatically.
 */

const MAIN_PAGES = ['/dashboard', '/explore', '/marketplace', '/community', '/services'];
const AUTH_PAGES = ['/', '/login', '/signup', '/verify', '/landing'];

export default function PWABackNavigator() {
  const router = useRouter();
  const pathname = usePathname();
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchStartTime = useRef(0);
  const isSwiping = useRef(false);
  const isStandalone = useRef(false);
  const historyDepth = useRef(0);

  // Detect PWA standalone mode
  useEffect(() => {
    isStandalone.current =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
  }, []);

  // Track navigation depth for standalone mode
  useEffect(() => {
    if (MAIN_PAGES.includes(pathname)) {
      historyDepth.current = 0;
    } else if (!AUTH_PAGES.includes(pathname)) {
      historyDepth.current += 1;
    }
  }, [pathname]);

  // ── Android hardware back / browser back button ──
  useEffect(() => {
    if (!isStandalone.current) return;

    // Push a dummy state so we can intercept the first back press
    const handlePopState = (e: PopStateEvent) => {
      // If a modal pushed its own history state, let the modal handle it
      if (e.state?.modalKey) return;

      // On a main page in standalone mode → don't let the app close
      if (MAIN_PAGES.includes(pathname)) {
        // Re-push state to prevent app from closing
        window.history.pushState({ pwaGuard: true }, '');
        return;
      }

      // On a sub-page → go back
      router.back();
    };

    // Push guard state
    window.history.pushState({ pwaGuard: true }, '');

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [pathname, router]);

  // ── Swipe right gesture for back navigation ──
  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    // Only start tracking if swipe begins from left edge (within 40px)
    if (touch.clientX > 40) return;

    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;
    touchStartTime.current = Date.now();
    isSwiping.current = true;
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isSwiping.current) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStartX.current;
    const deltaY = Math.abs(touch.clientY - touchStartY.current);

    // If vertical movement is greater, cancel the swipe (user is scrolling)
    if (deltaY > Math.abs(deltaX)) {
      isSwiping.current = false;
      return;
    }

    // Only care about right swipes (deltaX > 0)
    if (deltaX < 0) {
      isSwiping.current = false;
    }
  }, []);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (!isSwiping.current) return;
    isSwiping.current = false;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartX.current;
    const deltaY = Math.abs(touch.clientY - touchStartY.current);
    const elapsed = Date.now() - touchStartTime.current;

    // Swipe must be: >80px horizontal, <100px vertical, <400ms, and on a sub-page
    const isValidSwipe = deltaX > 80 && deltaY < 100 && elapsed < 400;

    if (isValidSwipe && !MAIN_PAGES.includes(pathname) && !AUTH_PAGES.includes(pathname)) {
      router.back();
    }
  }, [pathname, router]);

  useEffect(() => {
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return null; // No UI — purely behavioral
}
