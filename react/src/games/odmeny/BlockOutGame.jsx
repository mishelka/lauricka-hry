import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BLOCK_OUT_LEVELS, getBlockCells, getOccupiedCells, isDirAllowedForBlock, isBlockFrozen, isDoorLocked, getLevelWalls, revealUnfrozenGroups } from './levels';
import { sounds } from './soundEffects';
import { triggerFireworks } from '../../utils/gameUtils';
import { getLevelStars, updateLevelBestStars, getLevelPlays, incrementLevelPlays, getBlockOutSavedState, saveBlockOutSavedState, clearBlockOutSavedState, getBlockOutSavedStates } from '../../utils/player';
import { BlockOutHeader as HeaderComponent, GameBoard as GameBoardComponent, LevelSelect as LevelSelectComponent, StatusBar as StatusBarComponent, VictoryModal as VictoryModalComponent } from './components';
import { DRAG_THRESHOLD, MAX_LEVEL_PLAYS } from './constants';
import useBoardLayout from './hooks/useBoardLayout';
import useViewportLock from './hooks/useViewportLock';
import styles from './BlockOutGame.module.scss';

export default function BlockOutGame({
  rewardLevel = null,
  onBack = null,
  onCloseReward = null,
  onNextVybraneLevel = null,
  hasNextVybraneLevel = false
}) {
  const navigate = useNavigate();
  const [levelStars, setLevelStars] = useState(() =>
    getLevelStars('blockOut', BLOCK_OUT_LEVELS.length)
  );
  const [levelPlays, setLevelPlays] = useState(() =>
    getLevelPlays('blockOut', BLOCK_OUT_LEVELS.length)
  );
  const [savedStates, setSavedStates] = useState(() =>
    getBlockOutSavedStates()
  );
  const [currentLevelIndex, setCurrentLevelIndex] = useState(() =>
    rewardLevel !== null ? rewardLevel : 0
  );
  const [gameState, setGameState] = useState(() =>
    rewardLevel !== null ? 'playing' : 'levels'
  );
  const [blocks, setBlocks] = useState(() => {
    if (rewardLevel !== null && BLOCK_OUT_LEVELS[rewardLevel]) {
      const lvl = BLOCK_OUT_LEVELS[rewardLevel];
      const saved = getBlockOutSavedState(rewardLevel);
      if (saved && Array.isArray(saved.blocks) && saved.blocks.length > 0) {
        return saved.blocks.map(b => ({
          ...b,
          frozen: b.frozen ?? b.freezeCount ?? b.count ?? 0,
          exiting: false,
          exitSide: null,
          justUnfrozen: false,
          justRevealed: false
        }));
      }
      return lvl.blocks.map(b => ({
        ...b,
        frozen: b.frozen ?? b.freezeCount ?? b.count ?? 0,
        exiting: false,
        exitSide: null
      }));
    }
    return [];
  });
  const [doors, setDoors] = useState(() => {
    if (rewardLevel !== null && BLOCK_OUT_LEVELS[rewardLevel]) {
      const lvl = BLOCK_OUT_LEVELS[rewardLevel];
      const saved = getBlockOutSavedState(rewardLevel);
      const doorList = (saved && Array.isArray(saved.doors)) ? saved.doors : (lvl.doors || []);
      return doorList.map((d, idx) => ({
        ...d,
        id: d.id || `door_${idx}`,
        locked: Number(d.locked ?? d.count ?? d.freezeCount ?? d.lockedCount ?? 0),
        justUnlocked: false
      }));
    }
    return [];
  });
  const [dragInfo, setDragInfo] = useState(null); // { blockId, offsetX, offsetY, activeDir }
  const [moves, setMoves] = useState(0);
  const [history, setHistory] = useState([]);
  const [muted, setMuted] = useState(false);
  const [message, setMessage] = useState('');
  
  const fireworksRef = useRef(null);
  const dragRef = useRef(null);

  const level = BLOCK_OUT_LEVELS[currentLevelIndex] || BLOCK_OUT_LEVELS[0];
  const levelWalls = useMemo(() => getLevelWalls(level), [level]);
  useViewportLock();
  const boardLayout = useBoardLayout(level);
  const { cellSize, gap, padding, doorDepth } = boardLayout;

  // Level je odomknutý, kým nebol odohratý maximálne 3-krát
  const isLevelUnlocked = useCallback((idx) => {
    return (levelPlays[idx] || 0) < MAX_LEVEL_PLAYS;
  }, [levelPlays]);

  const startLevel = useCallback((lvlIndex, options = true) => {
    const isOptionsObj = typeof options === 'object' && options !== null;
    const forceReset = isOptionsObj ? Boolean(options.forceReset) : false;
    let countPlay = isOptionsObj ? (options.countPlay !== undefined ? options.countPlay : true) : Boolean(options);

    const lvl = BLOCK_OUT_LEVELS[lvlIndex];
    if (!lvl) return;

    if (forceReset) {
      clearBlockOutSavedState(lvlIndex);
      setSavedStates(getBlockOutSavedStates());
    }

    const saved = !forceReset ? getBlockOutSavedState(lvlIndex) : null;
    const isSavedValid = saved &&
      Array.isArray(saved.blocks) &&
      saved.blocks.length > 0 &&
      saved.blocks.every(b => b && b.id !== undefined && typeof b.r === 'number' && typeof b.c === 'number');

    // Pokiaľ pokračujeme v rozohranom leveli, neodrátavame ďalšie hranie
    if (isSavedValid) {
      countPlay = false;
    }

    if (countPlay) {
      const currentCounts = getLevelPlays('blockOut', BLOCK_OUT_LEVELS.length);
      const curPlays = currentCounts[lvlIndex] || 0;
      if (curPlays < MAX_LEVEL_PLAYS) {
        const updatedPlays = incrementLevelPlays('blockOut', lvlIndex, BLOCK_OUT_LEVELS.length);
        setLevelPlays(updatedPlays);
      }
    }

    setCurrentLevelIndex(lvlIndex);

    if (isSavedValid) {
      setBlocks(saved.blocks.map(b => ({
        ...b,
        frozen: b.frozen ?? b.freezeCount ?? b.count ?? 0,
        exiting: false,
        exitSide: null
      })));
      setDoors((Array.isArray(saved.doors) ? saved.doors : (lvl.doors || [])).map((d, idx) => ({
        ...d,
        id: d.id || `door_${idx}`,
        locked: Number(d.locked ?? d.count ?? d.freezeCount ?? d.lockedCount ?? 0),
        justUnlocked: false
      })));
      setMoves(Number(saved.moves) || 0);
      setHistory(Array.isArray(saved.history) ? saved.history : []);
    } else {
      setBlocks(lvl.blocks.map(b => ({
        ...b,
        frozen: b.frozen ?? b.freezeCount ?? b.count ?? 0,
        exiting: false,
        exitSide: null
      })));
      setDoors((lvl.doors || []).map((d, idx) => ({
        ...d,
        id: d.id || `door_${idx}`,
        locked: Number(d.locked ?? d.count ?? d.freezeCount ?? d.lockedCount ?? 0),
        justUnlocked: false
      })));
      setMoves(0);
      setHistory([]);
    }

    setMessage('');
    setGameState('playing');
  }, []);

  useEffect(() => {
    if (rewardLevel !== null) {
      startLevel(rewardLevel, { countPlay: true });
    }
  }, [rewardLevel, startLevel]);

  // Auto-save rozohraného stavu levelu do lokálnej pamäte
  useEffect(() => {
    if (gameState !== 'playing') return;
    if (!blocks || blocks.length === 0) return;

    const cleanBlocks = blocks
      .filter(b => !b.exiting)
      .map(b => ({
        id: b.id,
        shape: b.shape,
        r: b.r,
        c: b.c,
        color: b.color,
        direction: b.direction,
        axis: b.axis,
        frozen: b.frozen ?? 0,
        arrowRow: b.arrowRow,
        arrowCol: b.arrowCol,
        innerColor: b.innerColor,
        children: b.children
      }));

    if (cleanBlocks.length === 0) {
      clearBlockOutSavedState(currentLevelIndex);
      setSavedStates(getBlockOutSavedStates());
      return;
    }

    if (moves > 0 || history.length > 0) {
      saveBlockOutSavedState(currentLevelIndex, {
        blocks: cleanBlocks,
        doors: doors.map(d => ({
          id: d.id,
          side: d.side,
          index: d.index,
          span: d.span,
          color: d.color,
          locked: d.locked ?? 0
        })),
        moves,
        history: history.map(h => ({
          blocks: Array.isArray(h.blocks)
            ? h.blocks.filter(b => !b.exiting).map(b => ({ ...b, exiting: false, exitSide: null }))
            : [],
          doors: Array.isArray(h.doors)
            ? h.doors.map(d => ({ ...d, justUnlocked: false }))
            : [],
          moves: h.moves
        })),
        timestamp: Date.now()
      });
      setSavedStates(getBlockOutSavedStates());
    }
  }, [gameState, currentLevelIndex, blocks, doors, moves, history]);

  const resetCurrentLevel = () => {
    clearBlockOutSavedState(currentLevelIndex);
    setSavedStates(getBlockOutSavedStates());
    startLevel(currentLevelIndex, { forceReset: true, countPlay: false });
  };

  const toggleMute = () => {
    const nextMuted = !muted;
    setMuted(nextMuted);
    sounds.setMuted(nextMuted);
  };

  const findDoorAt = useCallback((side, index) => {
    return doors.find(d => {
      if (d.side !== side) return false;
      const span = d.span || 1;
      return index >= d.index && index < d.index + span;
    }) || null;
  }, [doors]);

  const checkBlockStep = useCallback((block, fromR, fromC, toR, toC, currentBlocks) => {
    if (isBlockFrozen(block)) {
      return { valid: false, exit: false, exitSide: null };
    }

    const dr = toR - fromR;
    const dc = toC - fromC;
    let dirName = null;
    if (dr === -1 && dc === 0) dirName = 'up';
    else if (dr === 1 && dc === 0) dirName = 'down';
    else if (dr === 0 && dc === -1) dirName = 'left';
    else if (dr === 0 && dc === 1) dirName = 'right';

    if (!dirName || !isDirAllowedForBlock(block, dirName)) {
      return { valid: false, exit: false, exitSide: null };
    }

    const blockCells = getBlockCells(block);
    const nextCells = blockCells.map(([rOff, cOff]) => ({
      r: toR + rOff,
      c: toC + cOff
    }));

    const exitingCells = nextCells.filter(
      c => c.r < 0 || c.r >= level.height || c.c < 0 || c.c >= level.width
    );

    if (exitingCells.length > 0) {
      for (const cell of exitingCells) {
        let door = null;
        if (dr === -1 && cell.r === -1 && cell.c >= 0 && cell.c < level.width) {
          door = findDoorAt('top', cell.c);
        } else if (dr === 1 && cell.r === level.height && cell.c >= 0 && cell.c < level.width) {
          door = findDoorAt('bottom', cell.c);
        } else if (dc === -1 && cell.c === -1 && cell.r >= 0 && cell.r < level.height) {
          door = findDoorAt('left', cell.r);
        } else if (dc === 1 && cell.c === level.width && cell.r >= 0 && cell.r < level.height) {
          door = findDoorAt('right', cell.r);
        }

        if (!door || door.color !== block.color || isDoorLocked(door)) {
          return { valid: false, exit: false, exitSide: null };
        }
      }
      const exitSide = dirName === 'up' ? 'top' : dirName === 'down' ? 'bottom' : dirName;
      return { valid: true, exit: true, exitSide };
    }

    if (nextCells.some(nc => levelWalls.some(w => w.r === nc.r && w.c === nc.c))) {
      return { valid: false, exit: false, exitSide: null };
    }

    const collidesWithOther = currentBlocks.some(other => {
      if (other.exiting || other.id === block.id) return false;
      const otherCells = getOccupiedCells(other);
      return nextCells.some(nc => otherCells.some(oc => oc.r === nc.r && oc.c === nc.c));
    });

    if (collidesWithOther) {
      return { valid: false, exit: false, exitSide: null };
    }

    return { valid: true, exit: false, exitSide: null };
  }, [findDoorAt, level.height, level.width, levelWalls]);

  const canBlockMoveInDir = useCallback((block, dr, dc, currentBlocks) => {
    return checkBlockStep(block, block.r, block.c, block.r + dr, block.c + dc, currentBlocks).valid;
  }, [checkBlockStep]);

  const getMovementLimits = useCallback((block, allBlocks) => {
    if (isBlockFrozen(block)) {
      return {
        up: { maxCells: 0, canExit: false, canMove: false },
        down: { maxCells: 0, canExit: false, canMove: false },
        left: { maxCells: 0, canExit: false, canMove: false },
        right: { maxCells: 0, canExit: false, canMove: false }
      };
    }

    const directions = {
      up: { dr: -1, dc: 0 },
      down: { dr: 1, dc: 0 },
      left: { dr: 0, dc: -1 },
      right: { dr: 0, dc: 1 }
    };

    const limits = {};

    for (const [dir, { dr, dc }] of Object.entries(directions)) {
      let curR = block.r;
      let curC = block.c;
      let maxCells = 0;
      let canExit = false;

      while (true) {
        const res = checkBlockStep(block, curR, curC, curR + dr, curC + dc, allBlocks);
        if (!res.valid) break;
        if (res.exit) {
          canExit = true;
          break;
        }
        curR += dr;
        curC += dc;
        maxCells += 1;
      }

      limits[dir] = { maxCells, canExit, canMove: maxCells > 0 || canExit };
    }

    return limits;
  }, [checkBlockStep]);

  const undoMove = () => {
    if (history.length === 0 || gameState !== 'playing') return;
    const last = history[history.length - 1];
    setHistory(history.slice(0, -1));
    setBlocks(last.blocks.map(b => ({ ...b, justUnfrozen: false, justRevealed: false })));
    if (last.doors) {
      setDoors(last.doors.map(d => ({ ...d, justUnlocked: false })));
    }
    setMoves(last.moves);
    sounds.playUndo();
  };

  // Keyboard shortcut for Undo (Ctrl+Z / Cmd+Z)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameState !== 'playing') return;
      if (e.key.toLowerCase() === 'z' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        undoMove();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, undoMove]);

  // Touch and mouse drag handlers using Pointer Events
  const handlePointerDown = (block, e) => {
    if (gameState !== 'playing' || block.exiting) return;
    if (e.button !== undefined && e.button !== 0) return; // Only primary button
    e.preventDefault();

    if (isBlockFrozen(block)) {
      sounds.playIceCrack();
      return;
    }

    dragRef.current = {
      pointerId: e.pointerId,
      block,
      blockId: block.id,
      startR: block.r,
      startC: block.c,
      currentR: block.r,
      currentC: block.c,
      startX: e.clientX,
      startY: e.clientY,
      isDragging: false,
      isExiting: false,
      exitSide: null
    };

    setDragInfo({
      blockId: block.id,
      offsetX: 0,
      offsetY: 0,
      currentR: block.r,
      currentC: block.c,
      isExiting: false,
      exitSide: null
    });
  };

  const handlePointerMove = useCallback((e) => {
    if (!dragRef.current || dragRef.current.pointerId !== e.pointerId) return;

    const drag = dragRef.current;
    const totalDist = Math.hypot(e.clientX - drag.startX, e.clientY - drag.startY);

    if (totalDist < 3 && !drag.isDragging) {
      return; // Tiny deadzone to prevent accidental jitter on simple clicks
    }

    drag.isDragging = true;
    const step = cellSize + gap;
    const threshold = step * 0.5;

    let maxLoops = 10;
    while (maxLoops-- > 0) {
      if (drag.isExiting) {
        // If block entered an exit door, check if user is pulling back onto the board
        const expectedX = drag.startX + (drag.currentC - drag.startC) * step;
        const expectedY = drag.startY + (drag.currentR - drag.startR) * step;
        const localDx = e.clientX - expectedX;
        const localDy = e.clientY - expectedY;

        let pullBack = false;
        if (drag.exitSide === 'right' && localDx <= -step * 0.2) pullBack = true;
        else if (drag.exitSide === 'left' && localDx >= step * 0.2) pullBack = true;
        else if (drag.exitSide === 'bottom' && localDy <= -step * 0.2) pullBack = true;
        else if (drag.exitSide === 'top' && localDy >= step * 0.2) pullBack = true;

        if (pullBack) {
          drag.isExiting = false;
          drag.exitSide = null;
          continue;
        }
        break;
      }

      const expectedX = drag.startX + (drag.currentC - drag.startC) * step;
      const expectedY = drag.startY + (drag.currentR - drag.startR) * step;
      const localDx = e.clientX - expectedX;
      const localDy = e.clientY - expectedY;
      const absDx = Math.abs(localDx);
      const absDy = Math.abs(localDy);

      if (absDx < threshold && absDy < threshold) break;

      let moved = false;
      const tryXFirst = absDx >= absDy;

      if (tryXFirst) {
        if (absDx >= threshold) {
          const dirX = localDx > 0 ? 1 : -1;
          const res = checkBlockStep(drag.block, drag.currentR, drag.currentC, drag.currentR, drag.currentC + dirX, blocks);
          if (res.valid) {
            if (res.exit) {
              drag.isExiting = true;
              drag.exitSide = res.exitSide;
            } else {
              drag.currentC += dirX;
            }
            moved = true;
          }
        }
        if (!moved && absDy >= threshold) {
          const dirY = localDy > 0 ? 1 : -1;
          const res = checkBlockStep(drag.block, drag.currentR, drag.currentC, drag.currentR + dirY, drag.currentC, blocks);
          if (res.valid) {
            if (res.exit) {
              drag.isExiting = true;
              drag.exitSide = res.exitSide;
            } else {
              drag.currentR += dirY;
            }
            moved = true;
          }
        }
      } else {
        if (absDy >= threshold) {
          const dirY = localDy > 0 ? 1 : -1;
          const res = checkBlockStep(drag.block, drag.currentR, drag.currentC, drag.currentR + dirY, drag.currentC, blocks);
          if (res.valid) {
            if (res.exit) {
              drag.isExiting = true;
              drag.exitSide = res.exitSide;
            } else {
              drag.currentR += dirY;
            }
            moved = true;
          }
        }
        if (!moved && absDx >= threshold) {
          const dirX = localDx > 0 ? 1 : -1;
          const res = checkBlockStep(drag.block, drag.currentR, drag.currentC, drag.currentR, drag.currentC + dirX, blocks);
          if (res.valid) {
            if (res.exit) {
              drag.isExiting = true;
              drag.exitSide = res.exitSide;
            } else {
              drag.currentC += dirX;
            }
            moved = true;
          }
        }
      }

      if (!moved) break;
    }

    // Sub-pixel drag visual offset calculation
    const curExpectedX = drag.startX + (drag.currentC - drag.startC) * step;
    const curExpectedY = drag.startY + (drag.currentR - drag.startR) * step;
    const subDx = e.clientX - curExpectedX;
    const subDy = e.clientY - curExpectedY;

    let subOffsetX = 0;
    let subOffsetY = 0;

    if (drag.isExiting) {
      if (drag.exitSide === 'right') {
        subOffsetX = Math.max(0, Math.min(subDx, doorDepth + cellSize * 0.25));
        subOffsetY = Math.max(-6, Math.min(6, subDy * 0.1));
      } else if (drag.exitSide === 'left') {
        subOffsetX = Math.min(0, Math.max(subDx, -(doorDepth + cellSize * 0.25)));
        subOffsetY = Math.max(-6, Math.min(6, subDy * 0.1));
      } else if (drag.exitSide === 'bottom') {
        subOffsetY = Math.max(0, Math.min(subDy, doorDepth + cellSize * 0.25));
        subOffsetX = Math.max(-6, Math.min(6, subDx * 0.1));
      } else if (drag.exitSide === 'top') {
        subOffsetY = Math.min(0, Math.max(subDy, -(doorDepth + cellSize * 0.25)));
        subOffsetX = Math.max(-6, Math.min(6, subDx * 0.1));
      }
    } else {
      const canRight = checkBlockStep(drag.block, drag.currentR, drag.currentC, drag.currentR, drag.currentC + 1, blocks).valid;
      const canLeft = checkBlockStep(drag.block, drag.currentR, drag.currentC, drag.currentR, drag.currentC - 1, blocks).valid;
      const canDown = checkBlockStep(drag.block, drag.currentR, drag.currentC, drag.currentR + 1, drag.currentC, blocks).valid;
      const canUp = checkBlockStep(drag.block, drag.currentR, drag.currentC, drag.currentR - 1, drag.currentC, blocks).valid;

      if (subDx > 0) {
        subOffsetX = canRight ? Math.min(subDx, step * 0.5) : Math.min(subDx * 0.15, 8);
      } else if (subDx < 0) {
        subOffsetX = canLeft ? Math.max(subDx, -step * 0.5) : Math.max(subDx * 0.15, -8);
      }

      if (subDy > 0) {
        subOffsetY = canDown ? Math.min(subDy, step * 0.5) : Math.min(subDy * 0.15, 8);
      } else if (subDy < 0) {
        subOffsetY = canUp ? Math.max(subDy, -step * 0.5) : Math.max(subDy * 0.15, -8);
      }
    }

    const totalOffsetX = (drag.currentC - drag.startC) * step + subOffsetX;
    const totalOffsetY = (drag.currentR - drag.startR) * step + subOffsetY;

    setDragInfo({
      blockId: drag.blockId,
      offsetX: totalOffsetX,
      offsetY: totalOffsetY,
      currentR: drag.currentR,
      currentC: drag.currentC,
      isExiting: drag.isExiting,
      exitSide: drag.exitSide
    });
  }, [cellSize, gap, doorDepth, checkBlockStep, blocks]);

  // Po skončení unfreeze-pop animácie (0.65s) zruší príznak justUnfrozen, aby trieda
  // .just-unfrozen (animation ... forwards) neprepisovala transform pri ďalšom ťahaní bloku
  const scheduleClearUnfrozenFlags = useCallback(() => {
    setTimeout(() => {
      setBlocks(current => {
        if (!current.some(b => b.justUnfrozen)) return current;
        return current.map(b => (b.justUnfrozen ? { ...b, justUnfrozen: false } : b));
      });
    }, 700);
  }, []);

  const handlePointerUp = useCallback((e) => {
    if (!dragRef.current || dragRef.current.pointerId !== e.pointerId) return;

    const {
      blockId,
      startR,
      startC,
      currentR,
      currentC,
      isDragging,
      isExiting,
      exitSide
    } = dragRef.current;

    dragRef.current = null;
    setDragInfo(null);

    if (!isDragging) {
      return;
    }

    if (isExiting) {
      // Save history snapshot before the drag started
      setHistory(prevHist => [
        ...prevHist,
        {
          blocks: blocks.map(b => ({ ...b })),
          doors: doors.map(d => ({ ...d })),
          moves
        }
      ]);
      setMoves(m => m + 1);

      sounds.playBlockOut();
      setMessage('Pohltené! ✨');
      setTimeout(() => setMessage(''), 1200);

      let didUnfreeze = false;
      let didCrack = false;
      let didUnlockDoor = false;
      let didDoorCrack = false;

      setDoors(prevDoors => prevDoors.map(d => {
        const curLocked = d.locked ?? d.count ?? 0;
        if (curLocked > 0) {
          const nextLocked = Math.max(0, curLocked - 1);
          if (nextLocked === 0) didUnlockDoor = true;
          else didDoorCrack = true;
          return {
            ...d,
            locked: nextLocked,
            justUnlocked: nextLocked === 0
          };
        }
        return { ...d, justUnlocked: false };
      }));

      const target = blocks.find(b => b.id === blockId);
      if (target && target.innerColor) {
        const oldColor = target.color;
        const nextColor = target.innerColor;

        // Dvojfarebný blok: vonkajšia farba (border) sa zničí, blok ostáva na hracej ploche na currentR, currentC
        const updated = blocks.map(b => {
          if (b.id === blockId) {
            return {
              ...b,
              r: currentR,
              c: currentC,
              borderDestroying: true,
              destroyingColor: oldColor
            };
          }
          const curFrozen = b.frozen ?? b.freezeCount ?? b.count ?? 0;
          if (curFrozen > 0) {
            const nextFrozen = Math.max(0, curFrozen - 1);
            if (nextFrozen === 0) didUnfreeze = true;
            else didCrack = true;
            return {
              ...b,
              frozen: nextFrozen,
              justUnfrozen: nextFrozen === 0
            };
          }
          return b;
        });

        if (didUnlockDoor) {
          sounds.playLockUnlock();
        } else if (didUnfreeze) {
          sounds.playIceShatter();
        } else if (didCrack || didDoorCrack) {
          sounds.playIceCrack();
        }

        setBlocks(revealUnfrozenGroups(updated));
        if (didUnfreeze) scheduleClearUnfrozenFlags();

        setTimeout(() => {
          setBlocks(current => current.map(b => {
            if (b.id === blockId) {
              return {
                ...b,
                color: nextColor,
                innerColor: undefined,
                borderDestroying: false,
                destroyingColor: undefined,
                justRevealed: true
              };
            }
            return b;
          }));
          setTimeout(() => {
            setBlocks(cur => cur.map(b => b.id === blockId ? { ...b, justRevealed: false } : b));
          }, 400);
        }, 350);

        return;
      }

      // Jednofarebný blok: pohltenie a vyradenie z hracej plochy
      const updated = blocks.map(b => {
        if (b.id === blockId) {
          return { ...b, r: currentR, c: currentC, exiting: true, exitSide };
        }
        const curFrozen = b.frozen ?? b.freezeCount ?? b.count ?? 0;
        if (curFrozen > 0) {
          const nextFrozen = Math.max(0, curFrozen - 1);
          if (nextFrozen === 0) didUnfreeze = true;
          else didCrack = true;
          return {
            ...b,
            frozen: nextFrozen,
            justUnfrozen: nextFrozen === 0
          };
        }
        return b;
      });

      if (didUnlockDoor) {
        sounds.playLockUnlock();
      } else if (didUnfreeze) {
        sounds.playIceShatter();
      } else if (didCrack || didDoorCrack) {
        sounds.playIceCrack();
      }

      setBlocks(revealUnfrozenGroups(updated));
      if (didUnfreeze) scheduleClearUnfrozenFlags();

      setTimeout(() => {
        setBlocks(current => {
          const remaining = current.filter(b => b.id !== blockId);

          if (remaining.length === 0) {
            clearBlockOutSavedState(currentLevelIndex);
            setSavedStates(getBlockOutSavedStates());
            const updatedStars = updateLevelBestStars(
              'blockOut',
              currentLevelIndex,
              5,
              BLOCK_OUT_LEVELS.length
            );
            setLevelStars(updatedStars);
            setGameState('win');
            sounds.playVictory();
            if (fireworksRef.current) {
              triggerFireworks(fireworksRef.current);
            }
          }
          return remaining;
        });
      }, 450);
      return;
    }

    if (currentR !== startR || currentC !== startC) {
      setHistory(prevHist => [
        ...prevHist,
        {
          blocks: blocks.map(b => ({ ...b })),
          doors: doors.map(d => ({ ...d })),
          moves
        }
      ]);
      setMoves(m => m + 1);
      sounds.playSlide();

      setBlocks(prev =>
        prev.map(b => (b.id === blockId ? { ...b, r: currentR, c: currentC } : b))
      );
    }
  }, [blocks, doors, moves, currentLevelIndex, scheduleClearUnfrozenFlags]);

  const handlePointerCancel = useCallback((e) => {
    if (dragRef.current && dragRef.current.pointerId === e.pointerId) {
      const { targetEl } = dragRef.current;
      if (targetEl && targetEl.releasePointerCapture) {
        try {
          targetEl.releasePointerCapture(e.pointerId);
        } catch {}
      }
      dragRef.current = null;
      setDragInfo(null);
    }
  }, []);

  // Global window listeners for drag & drop to guarantee zero lost pointer events
  const pointerHandlersRef = useRef({
    handlePointerMove,
    handlePointerUp,
    handlePointerCancel
  });
  pointerHandlersRef.current = {
    handlePointerMove,
    handlePointerUp,
    handlePointerCancel
  };

  useEffect(() => {
    const onWindowPointerMove = (e) => {
      pointerHandlersRef.current.handlePointerMove(e);
    };
    const onWindowPointerUp = (e) => {
      pointerHandlersRef.current.handlePointerUp(e);
    };
    const onWindowPointerCancel = (e) => {
      pointerHandlersRef.current.handlePointerCancel(e);
    };

    window.addEventListener('pointermove', onWindowPointerMove, { passive: false });
    window.addEventListener('pointerup', onWindowPointerUp, { passive: false });
    window.addEventListener('pointercancel', onWindowPointerCancel, { passive: false });

    return () => {
      window.removeEventListener('pointermove', onWindowPointerMove);
      window.removeEventListener('pointerup', onWindowPointerUp);
      window.removeEventListener('pointercancel', onWindowPointerCancel);
    };
  }, []);

  const handleExit = () => {
    if (onBack) {
      onBack();
    } else if (onCloseReward) {
      onCloseReward();
    } else if (navigate) {
      navigate('/');
    }
  };

  return (
    <div
      className={styles.container}
      onContextMenu={(e) => e.preventDefault()}
      onSelectStart={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
    >
      <div ref={fireworksRef} />

      {gameState === 'levels' && (
        <>
          <HeaderComponent title="🧩 Block Out! - Výber levelu" onBack={handleExit} backTitle="Späť do menu" muted={muted} onToggleMute={toggleMute} />
          <LevelSelectComponent
            levels={BLOCK_OUT_LEVELS}
            levelStars={levelStars}
            levelPlays={levelPlays}
            savedStates={savedStates}
            isLevelUnlocked={isLevelUnlocked}
            onSelect={(index) => startLevel(index, { countPlay: true })}
            maxLevelPlays={MAX_LEVEL_PLAYS}
          />
        </>
      )}

      {(gameState === 'playing' || gameState === 'win') && (
        <>
          <HeaderComponent
            title={level.name}
            onBack={() => {
              if (rewardLevel !== null) {
                handleExit();
              } else {
                setSavedStates(getBlockOutSavedStates());
                setGameState('levels');
              }
            }}
            backTitle={rewardLevel !== null ? 'Späť' : 'Výber levelov'}
            onUndo={undoMove}
            canUndo={history.length > 0}
            onRestart={resetCurrentLevel}
            muted={muted}
            onToggleMute={toggleMute}
          />

          <StatusBarComponent moves={moves} message={message} />

          <GameBoardComponent level={level} levelWalls={levelWalls} doors={doors} blocks={blocks} dragInfo={dragInfo} cellSize={cellSize} gap={gap} padding={padding} doorDepth={doorDepth} onPointerDown={handlePointerDown} />

          {gameState === 'win' && (
            <VictoryModalComponent
              moves={moves}
              canReplay={isLevelUnlocked(currentLevelIndex)}
              onReplay={() => startLevel(currentLevelIndex, true)}
              onExit={onBack || onCloseReward ? handleExit : () => {
                setSavedStates(getBlockOutSavedStates());
                setGameState('levels');
              }}
              exitLabel={onBack || onCloseReward ? 'Späť' : 'Výber levelov'}
              canNextLevel={onNextVybraneLevel ? hasNextVybraneLevel : currentLevelIndex + 1 < BLOCK_OUT_LEVELS.length && isLevelUnlocked(currentLevelIndex + 1)}
              onNextLevel={onNextVybraneLevel || (() => startLevel(currentLevelIndex + 1, true))}
            />
          )}
        </>
      )}
    </div>
  );
}
