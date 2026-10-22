import { useEffect } from 'react';
import { unlockAllLevels } from './player';

export function useDevUnlock({ gameId, levelCount, onUnlock }) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (!e.ctrlKey || !e.shiftKey) return;
      const key = (e.key || '').toLowerCase();
      const code = e.code || '';

      const isUnlockKey = (
        key === 'u' || key === 'l' || key === 'o' || key === 'd' || key === 'a' ||
        code === 'KeyU' || code === 'KeyL' || code === 'KeyO' || code === 'KeyD' || code === 'KeyA'
      );

      if (isUnlockKey) {
        e.preventDefault();
        const unlocked = unlockAllLevels(gameId, levelCount);
        if (typeof onUnlock === 'function') {
          onUnlock(unlocked);
        }
        console.log(`🔓 [DEV] Všetky levely odomknuté pre '${gameId}' (${levelCount} levelov).`);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameId, levelCount, onUnlock]);
}

export default useDevUnlock;
