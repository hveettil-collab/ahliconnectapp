'use client';
import { useKeyboardVisible } from '@/hooks/useKeyboardVisible';

/**
 * Global keyboard manager — renders nothing visible.
 * Just runs the useKeyboardVisible hook so the `keyboard-open` class
 * is toggled on <html> whenever the virtual keyboard is open on mobile.
 */
export default function KeyboardManager() {
  useKeyboardVisible();
  return null;
}
