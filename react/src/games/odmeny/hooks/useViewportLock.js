import { useEffect } from 'react';

export default function useViewportLock() {
  useEffect(() => {
    const prevBodyOverflow = document.body.style.overflow;
    const prevBodyTouchAction = document.body.style.touchAction;
    const prevBodyOverscroll = document.body.style.overscrollBehavior;
    const prevDocOverflow = document.documentElement.style.overflow;
    const prevDocOverscroll = document.documentElement.style.overscrollBehavior;

    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';
    document.body.style.overscrollBehavior = 'none';
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.overscrollBehavior = 'none';

    const handleContextMenu = (e) => {
      e.preventDefault();
      return false;
    };
    const handleSelectStart = (e) => {
      e.preventDefault();
      return false;
    };
    const handleDragStart = (e) => {
      e.preventDefault();
      return false;
    };
    const handleTouchMove = (e) => {
      if (e.target && e.target.closest && e.target.closest('[data-scrollable]')) return;
      e.preventDefault();
    };

    window.addEventListener('contextmenu', handleContextMenu, { passive: false });
    window.addEventListener('selectstart', handleSelectStart, { passive: false });
    window.addEventListener('dragstart', handleDragStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.body.style.touchAction = prevBodyTouchAction;
      document.body.style.overscrollBehavior = prevBodyOverscroll;
      document.documentElement.style.overflow = prevDocOverflow;
      document.documentElement.style.overscrollBehavior = prevDocOverscroll;
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('selectstart', handleSelectStart);
      window.removeEventListener('dragstart', handleDragStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);
}