'use client';
import { useCallback, useEffect, useRef } from 'react';

/**
 * useModalHistory — Syncs modal open/close state with the browser history stack.
 *
 * When a modal opens, pushes a history entry. When the user presses back
 * (iOS swipe, Android hardware button, browser back), the modal closes
 * instead of navigating away.
 *
 * @param isOpen   Whether the modal is currently open
 * @param onClose  Function to close the modal (set state to null/false)
 * @param key      Unique key for this modal (to prevent cross-modal conflicts)
 */
export function useModalHistory(isOpen: boolean, onClose: () => void, key: string = 'modal') {
  const pushedRef = useRef(false);

  // Push history state when modal opens
  useEffect(() => {
    if (isOpen && !pushedRef.current) {
      window.history.pushState({ modalKey: key }, '');
      pushedRef.current = true;
    }
    if (!isOpen) {
      pushedRef.current = false;
    }
  }, [isOpen, key]);

  // Listen for popstate to close modal
  useEffect(() => {
    if (!isOpen) return;

    const handlePopState = (e: PopStateEvent) => {
      if (pushedRef.current) {
        pushedRef.current = false;
        onClose();
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isOpen, onClose]);

  // When closing via the UI button (not via back), pop the history entry we pushed
  const closeWithHistory = useCallback(() => {
    if (pushedRef.current) {
      pushedRef.current = false;
      window.history.back();
    }
    onClose();
  }, [onClose]);

  return closeWithHistory;
}
