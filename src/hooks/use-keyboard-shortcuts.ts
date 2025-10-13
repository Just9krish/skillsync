import { useEffect } from 'react';

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  callback: () => void;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      shortcuts.forEach(
        ({ key, ctrlKey, metaKey, shiftKey, altKey, callback }) => {
          const isCtrlMatch =
            ctrlKey === undefined || event.ctrlKey === ctrlKey;
          const isMetaMatch =
            metaKey === undefined || event.metaKey === metaKey;
          const isShiftMatch =
            shiftKey === undefined || event.shiftKey === shiftKey;
          const isAltMatch = altKey === undefined || event.altKey === altKey;
          const isKeyMatch = event.key.toLowerCase() === key.toLowerCase();

          if (
            isCtrlMatch &&
            isMetaMatch &&
            isShiftMatch &&
            isAltMatch &&
            isKeyMatch
          ) {
            event.preventDefault();
            callback();
          }
        }
      );
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcuts]);
}
