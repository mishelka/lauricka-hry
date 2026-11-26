import { useEffect, useState } from 'react';
import { DEFAULT_CELL_SIZE, DEFAULT_DOOR_DEPTH, DEFAULT_GAP, DEFAULT_PADDING } from '../constants';

export default function useBoardLayout(level) {
  const [boardLayout, setBoardLayout] = useState({
    cellSize: DEFAULT_CELL_SIZE,
    gap: DEFAULT_GAP,
    padding: DEFAULT_PADDING,
    doorDepth: DEFAULT_DOOR_DEPTH
  });

  useEffect(() => {
    function handleResize() {
      if (typeof window === 'undefined') return;
      const winW = window.innerWidth;
      const winH = window.innerHeight;
      const isSmallMobile = winW < 380 || winH < 620;
      const isMobile = winW < 540 || winH < 720;
      const currentGap = isSmallMobile ? 4 : isMobile ? 5 : 7;
      const currentPadding = isSmallMobile ? 6 : isMobile ? 8 : 10;
      const currentDoorDepth = isSmallMobile ? 18 : isMobile ? 20 : 24;
      const screenPadding = isSmallMobile ? 8 : isMobile ? 12 : 20;
      const wrapperPadding = isSmallMobile ? 12 : isMobile ? 16 : 24;
      const overheadW = screenPadding + wrapperPadding + (currentDoorDepth * 2);
      const maxAvailableWidth = Math.min(winW, 580) - overheadW;
      const cellFromWidth = Math.floor(
        (maxAvailableWidth - currentPadding * 2 - (level.width - 1) * currentGap) / level.width
      );
      const chromeHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--game-chrome-height')) || 80;
      const overheadH = chromeHeight + 48 + (currentDoorDepth * 2) + currentPadding * 2;
      const maxAvailableHeight = winH - overheadH;
      const cellFromHeight = Math.floor(
        (Math.max(100, maxAvailableHeight) - (level.height - 1) * currentGap) / level.height
      );
      const calculated = Math.min(cellFromWidth, cellFromHeight);
      const safeCellSize = Math.max(18, Math.min(60, calculated));

      setBoardLayout({
        cellSize: safeCellSize,
        gap: currentGap,
        padding: currentPadding,
        doorDepth: currentDoorDepth
      });
    }

    handleResize();
    window.addEventListener('resize', handleResize);
    const chrome = document.querySelector('.game-chrome');
    const observer = new ResizeObserver(handleResize);
    if (chrome) observer.observe(chrome);
    return () => {
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
    };
  }, [level.width, level.height]);

  return boardLayout;
}
