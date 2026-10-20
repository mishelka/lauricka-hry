import { useState, useEffect, useRef, useCallback } from 'react';
import { BLOCK_OUT_LEVELS, COLOR_CONFIG } from './blockOutLevels';
import { sounds } from './soundEffects';
import { triggerFireworks } from '../utils/gameUtils';
import { getLevelStars, updateLevelBestStars } from '../utils/player';
import './blockOut.css';

const DEFAULT_CELL_SIZE = 54;
const DEFAULT_GAP = 8;
const DEFAULT_PADDING = 12;
const DEFAULT_DOOR_DEPTH = 22;
const DRAG_THRESHOLD = 16;

export default function BlockOutGame({ rewardLevel = null, onBack = null }) {
  const [levelStars, setLevelStars] = useState(() =>
    getLevelStars('blockOut', BLOCK_OUT_LEVELS.length)
  );
  const [currentLevelIndex, setCurrentLevelIndex] = useState(() =>
    rewardLevel !== null ? rewardLevel : 0
  );
  const [gameState, setGameState] = useState(() =>
    rewardLevel !== null ? 'playing' : 'levels'
  );
  const [blocks, setBlocks] = useState([]);
  const [selectedBlockId, setSelectedBlockId] = useState(null);
  const [dragInfo, setDragInfo] = useState(null); // { blockId, offsetX, offsetY, activeDir }
  const [moves, setMoves] = useState(0);
  const [history, setHistory] = useState([]);
  const [muted, setMuted] = useState(false);
  const [message, setMessage] = useState('');
  
  const [boardLayout, setBoardLayout] = useState({
    cellSize: DEFAULT_CELL_SIZE,
    gap: DEFAULT_GAP,
    padding: DEFAULT_PADDING,
    doorDepth: DEFAULT_DOOR_DEPTH
  });

  const fireworksRef = useRef(null);
  const dragRef = useRef(null);

  const level = BLOCK_OUT_LEVELS[currentLevelIndex] || BLOCK_OUT_LEVELS[0];
  const { cellSize, gap, padding, doorDepth } = boardLayout;

  useEffect(() => {
    function handleResize() {
      if (typeof window === 'undefined') return;

      const winW = window.innerWidth;
      const winH = window.innerHeight;
      const isSmallMobile = winW < 380;
      const isMobile = winW < 540;

      const currentGap = isSmallMobile ? 5 : isMobile ? 6 : 8;
      const currentPadding = isSmallMobile ? 8 : isMobile ? 10 : 12;
      const currentDoorDepth = isSmallMobile ? 16 : isMobile ? 18 : 22;

      // Available width calculation
      // Screen padding + board wrapper padding + doors on left and right
      const screenPadding = isSmallMobile ? 12 : isMobile ? 16 : 24;
      const wrapperPadding = isSmallMobile ? 16 : isMobile ? 20 : 28;
      const overheadW = screenPadding + wrapperPadding + (currentDoorDepth * 2);
      const maxAvailableWidth = Math.min(winW, 500) - overheadW;
      const cellFromWidth = Math.floor(
        (maxAvailableWidth - currentPadding * 2 - (level.width - 1) * currentGap) / level.width
      );

      // Available height calculation
      // Space for header, status bar, hint, controls/d-pad, padding
      const overheadH = (isSmallMobile ? 240 : isMobile ? 260 : 300) + (currentDoorDepth * 2) + currentPadding * 2;
      const maxAvailableHeight = winH - overheadH;
      const cellFromHeight = Math.floor(
        (Math.max(150, maxAvailableHeight) - (level.height - 1) * currentGap) / level.height
      );

      const calculated = Math.min(cellFromWidth, cellFromHeight > 28 ? cellFromHeight : cellFromWidth);
      const safeCellSize = Math.max(28, Math.min(58, calculated));

      setBoardLayout({
        cellSize: safeCellSize,
        gap: currentGap,
        padding: currentPadding,
        doorDepth: currentDoorDepth
      });
    }

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [level.width, level.height]);

  function highestUnlockedLevel(stars) {
    let highest = 0;
    for (let i = 0; i < stars.length - 1; i++) {
      if (stars[i] >= 3) highest = i + 1;
      else break;
    }
    return highest;
  }

  const isLevelUnlocked = (idx) => idx <= highestUnlockedLevel(levelStars);

  const startLevel = useCallback((lvlIndex) => {
    const lvl = BLOCK_OUT_LEVELS[lvlIndex];
    if (!lvl) return;
    setCurrentLevelIndex(lvlIndex);
    setBlocks(lvl.blocks.map(b => ({ ...b, exiting: false, exitSide: null })));
    setSelectedBlockId(lvl.blocks.length > 0 ? lvl.blocks[0].id : null);
    setMoves(0);
    setHistory([]);
    setMessage('');
    setGameState('playing');
  }, []);

  useEffect(() => {
    if (rewardLevel !== null) {
      startLevel(rewardLevel);
    }
  }, [rewardLevel, startLevel]);

  const resetCurrentLevel = () => {
    startLevel(currentLevelIndex);
  };

  const toggleMute = () => {
    const nextMuted = !muted;
    setMuted(nextMuted);
    sounds.setMuted(nextMuted);
  };

  const findDoorAt = useCallback((side, index) => {
    return level.doors.find(d => d.side === side && d.index === index) || null;
  }, [level.doors]);

  const getMovementLimits = useCallback((block, allBlocks) => {
    const directions = {
      up: { dr: -1, dc: 0, exitSide: 'top' },
      down: { dr: 1, dc: 0, exitSide: 'bottom' },
      left: { dr: 0, dc: -1, exitSide: 'left' },
      right: { dr: 0, dc: 1, exitSide: 'right' }
    };

    const limits = {};

    for (const [dir, { dr, dc }] of Object.entries(directions)) {
      let curR = block.r;
      let curC = block.c;
      let maxCells = 0;
      let canExit = false;

      while (true) {
        const nextR = curR + dr;
        const nextC = curC + dc;

        if (nextR < 0) {
          const door = findDoorAt('top', curC);
          if (door && door.color === block.color) {
            canExit = true;
          }
          break;
        }
        if (nextR >= level.height) {
          const door = findDoorAt('bottom', curC);
          if (door && door.color === block.color) {
            canExit = true;
          }
          break;
        }
        if (nextC < 0) {
          const door = findDoorAt('left', curR);
          if (door && door.color === block.color) {
            canExit = true;
          }
          break;
        }
        if (nextC >= level.width) {
          const door = findDoorAt('right', curR);
          if (door && door.color === block.color) {
            canExit = true;
          }
          break;
        }

        const isOccupied = allBlocks.some(
          b => !b.exiting && b.id !== block.id && b.r === nextR && b.c === nextC
        );
        if (isOccupied) {
          break;
        }

        curR = nextR;
        curC = nextC;
        maxCells += 1;
      }

      limits[dir] = { maxCells, canExit, canMove: maxCells > 0 || canExit };
    }

    return limits;
  }, [findDoorAt, level.height, level.width]);

  const canBlockMoveInDir = useCallback((block, dr, dc, currentBlocks) => {
    const curR = block.r;
    const curC = block.c;
    const nextR = curR + dr;
    const nextC = curC + dc;

    if (nextR < 0) {
      const door = findDoorAt('top', curC);
      return door && door.color === block.color;
    }
    if (nextR >= level.height) {
      const door = findDoorAt('bottom', curC);
      return door && door.color === block.color;
    }
    if (nextC < 0) {
      const door = findDoorAt('left', curR);
      return door && door.color === block.color;
    }
    if (nextC >= level.width) {
      const door = findDoorAt('right', curR);
      return door && door.color === block.color;
    }

    return !currentBlocks.some(b => !b.exiting && b.id !== block.id && b.r === nextR && b.c === nextC);
  }, [findDoorAt, level.height, level.width]);

  const moveBlock = useCallback((blockId, direction, requestedSteps = 1, forceExit = false) => {
    if (gameState !== 'playing') return;

    const dirMap = {
      up: { dr: -1, dc: 0, exitSide: 'top' },
      down: { dr: 1, dc: 0, exitSide: 'bottom' },
      left: { dr: 0, dc: -1, exitSide: 'left' },
      right: { dr: 0, dc: 1, exitSide: 'right' }
    };
    const { dr, dc, exitSide } = dirMap[direction] || {};
    if (dr === undefined) return;

    setBlocks((prevBlocks) => {
      const target = prevBlocks.find(b => b.id === blockId && !b.exiting);
      if (!target) return prevBlocks;

      let curR = target.r;
      let curC = target.c;
      let exited = false;
      let stepsRemaining = Math.max(1, requestedSteps);

      while (stepsRemaining > 0 && !exited) {
        const nextR = curR + dr;
        const nextC = curC + dc;

        if (nextR < 0) {
          const door = findDoorAt('top', curC);
          if (door && door.color === target.color) {
            exited = true;
            curR = -1;
          }
          break;
        } else if (nextR >= level.height) {
          const door = findDoorAt('bottom', curC);
          if (door && door.color === target.color) {
            exited = true;
            curR = level.height;
          }
          break;
        } else if (nextC < 0) {
          const door = findDoorAt('left', curR);
          if (door && door.color === target.color) {
            exited = true;
            curC = -1;
          }
          break;
        } else if (nextC >= level.width) {
          const door = findDoorAt('right', curR);
          if (door && door.color === target.color) {
            exited = true;
            curC = level.width;
          }
          break;
        } else {
          const isOccupied = prevBlocks.some(
            b => !b.exiting && b.id !== target.id && b.r === nextR && b.c === nextC
          );
          if (isOccupied) {
            break;
          }
          curR = nextR;
          curC = nextC;
          stepsRemaining -= 1;
        }
      }

      if (forceExit && !exited) {
        const nextR = curR + dr;
        const nextC = curC + dc;
        if (nextR < 0 && findDoorAt('top', curC)?.color === target.color) {
          exited = true;
          curR = -1;
        } else if (nextR >= level.height && findDoorAt('bottom', curC)?.color === target.color) {
          exited = true;
          curR = level.height;
        } else if (nextC < 0 && findDoorAt('left', curR)?.color === target.color) {
          exited = true;
          curC = -1;
        } else if (nextC >= level.width && findDoorAt('right', curR)?.color === target.color) {
          exited = true;
          curC = level.width;
        }
      }

      if (curR === target.r && curC === target.c && !exited) {
        return prevBlocks; // No movement possible
      }

      // Save history snapshot before moving
      setHistory(prevHist => [
        ...prevHist,
        {
          blocks: prevBlocks.map(b => ({ ...b })),
          moves,
          selectedBlockId: target.id
        }
      ]);
      setMoves(m => m + 1);

      if (exited) {
        sounds.playBlockOut();
        setMessage('Pohltené! ✨');
        setTimeout(() => setMessage(''), 1200);

        const updated = prevBlocks.map(b =>
          b.id === target.id
            ? { ...b, r: curR, c: curC, exiting: true, exitSide }
            : b
        );

        // Allow smooth absorption animation to finish before removing
        setTimeout(() => {
          setBlocks(current => {
            const remaining = current.filter(b => b.id !== target.id);
            if (remaining.length === 0) {
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
            } else {
              setSelectedBlockId(prev => (prev === target.id ? remaining[0].id : prev));
            }
            return remaining;
          });
        }, 450);

        return updated;
      }

      sounds.playSlide();
      return prevBlocks.map(b =>
        b.id === target.id ? { ...b, r: curR, c: curC } : b
      );
    });
  }, [gameState, findDoorAt, level.height, level.width, moves, currentLevelIndex]);

  const undoMove = () => {
    if (history.length === 0 || gameState !== 'playing') return;
    const last = history[history.length - 1];
    setHistory(history.slice(0, -1));
    setBlocks(last.blocks);
    setMoves(last.moves);
    setSelectedBlockId(last.selectedBlockId);
    sounds.playUndo();
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameState !== 'playing' || !selectedBlockId) return;

      const key = e.key.toLowerCase();
      if (key === 'arrowup' || key === 'w') {
        e.preventDefault();
        moveBlock(selectedBlockId, 'up');
      } else if (key === 'arrowdown' || key === 's') {
        e.preventDefault();
        moveBlock(selectedBlockId, 'down');
      } else if (key === 'arrowleft' || key === 'a') {
        e.preventDefault();
        moveBlock(selectedBlockId, 'left');
      } else if (key === 'arrowright' || key === 'd') {
        e.preventDefault();
        moveBlock(selectedBlockId, 'right');
      } else if (key === 'z' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        undoMove();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, selectedBlockId, moveBlock, undoMove]);

  // Touch and mouse drag handlers using Pointer Events
  const handlePointerDown = (block, e) => {
    if (gameState !== 'playing' || block.exiting) return;
    e.preventDefault();

    const targetEl = e.currentTarget;
    if (targetEl && targetEl.setPointerCapture) {
      try {
        targetEl.setPointerCapture(e.pointerId);
      } catch {
        // Fallback if setPointerCapture is unsupported
      }
    }

    setSelectedBlockId(block.id);
    const limits = getMovementLimits(block, blocks);

    dragRef.current = {
      pointerId: e.pointerId,
      blockId: block.id,
      startX: e.clientX,
      startY: e.clientY,
      limits,
      isDragging: false,
      targetEl
    };
  };

  const handlePointerMove = (e) => {
    if (!dragRef.current || dragRef.current.pointerId !== e.pointerId) return;

    const { startX, startY, blockId, limits } = dragRef.current;
    const rawDx = e.clientX - startX;
    const rawDy = e.clientY - startY;
    const dist = Math.hypot(rawDx, rawDy);

    if (dist < 5 && !dragRef.current.isDragging) {
      return; // Small deadzone to prevent accidental drag on simple tap
    }

    dragRef.current.isDragging = true;
    const step = cellSize + gap;
    const isHoriz = Math.abs(rawDx) >= Math.abs(rawDy);

    let offsetX = 0;
    let offsetY = 0;
    let activeDir = null;

    if (isHoriz) {
      if (rawDx > 0) {
        activeDir = 'right';
        const limit = limits.right;
        const maxDist = limit.maxCells * step + (limit.canExit ? doorDepth + cellSize * 0.35 : 0);
        if (limit.canMove) {
          if (rawDx <= maxDist) {
            offsetX = rawDx;
          } else {
            offsetX = maxDist + Math.min((rawDx - maxDist) * 0.12, 10);
          }
        } else {
          offsetX = Math.min(rawDx * 0.12, 8);
        }
      } else {
        activeDir = 'left';
        const limit = limits.left;
        const maxDist = limit.maxCells * step + (limit.canExit ? doorDepth + cellSize * 0.35 : 0);
        if (limit.canMove) {
          if (-rawDx <= maxDist) {
            offsetX = rawDx;
          } else {
            offsetX = -maxDist - Math.min((-rawDx - maxDist) * 0.12, 10);
          }
        } else {
          offsetX = Math.max(rawDx * 0.12, -8);
        }
      }
    } else {
      if (rawDy > 0) {
        activeDir = 'down';
        const limit = limits.down;
        const maxDist = limit.maxCells * step + (limit.canExit ? doorDepth + cellSize * 0.35 : 0);
        if (limit.canMove) {
          if (rawDy <= maxDist) {
            offsetY = rawDy;
          } else {
            offsetY = maxDist + Math.min((rawDy - maxDist) * 0.12, 10);
          }
        } else {
          offsetY = Math.min(rawDy * 0.12, 8);
        }
      } else {
        activeDir = 'up';
        const limit = limits.up;
        const maxDist = limit.maxCells * step + (limit.canExit ? doorDepth + cellSize * 0.35 : 0);
        if (limit.canMove) {
          if (-rawDy <= maxDist) {
            offsetY = rawDy;
          } else {
            offsetY = -maxDist - Math.min((-rawDy - maxDist) * 0.12, 10);
          }
        } else {
          offsetY = Math.max(rawDy * 0.12, -8);
        }
      }
    }

    setDragInfo({
      blockId,
      offsetX,
      offsetY,
      activeDir
    });
  };

  const handlePointerUp = (e) => {
    if (!dragRef.current || dragRef.current.pointerId !== e.pointerId) return;

    const { startX, startY, blockId, limits, isDragging, targetEl } = dragRef.current;
    if (targetEl && targetEl.releasePointerCapture) {
      try {
        targetEl.releasePointerCapture(e.pointerId);
      } catch {
        // Fallback
      }
    }

    dragRef.current = null;
    setDragInfo(null);

    if (!isDragging) {
      setSelectedBlockId(blockId);
      return;
    }

    const rawDx = e.clientX - startX;
    const rawDy = e.clientY - startY;
    const isHoriz = Math.abs(rawDx) >= Math.abs(rawDy);
    const step = cellSize + gap;
    const threshold = Math.min(DRAG_THRESHOLD, cellSize * 0.28);

    let directionToMove = null;
    let stepsToMove = 1;
    let forceExit = false;

    if (isHoriz) {
      if (rawDx > threshold && limits.right.canMove) {
        directionToMove = 'right';
        const limit = limits.right;
        const exitDistThreshold = limit.maxCells * step + threshold;
        if (limit.canExit && rawDx >= exitDistThreshold) {
          forceExit = true;
          stepsToMove = limit.maxCells + 1;
        } else {
          stepsToMove = Math.min(limit.maxCells, Math.max(1, Math.round(rawDx / step)));
        }
      } else if (rawDx < -threshold && limits.left.canMove) {
        directionToMove = 'left';
        const limit = limits.left;
        const dist = -rawDx;
        const exitDistThreshold = limit.maxCells * step + threshold;
        if (limit.canExit && dist >= exitDistThreshold) {
          forceExit = true;
          stepsToMove = limit.maxCells + 1;
        } else {
          stepsToMove = Math.min(limit.maxCells, Math.max(1, Math.round(dist / step)));
        }
      }
    } else {
      if (rawDy > threshold && limits.down.canMove) {
        directionToMove = 'down';
        const limit = limits.down;
        const exitDistThreshold = limit.maxCells * step + threshold;
        if (limit.canExit && rawDy >= exitDistThreshold) {
          forceExit = true;
          stepsToMove = limit.maxCells + 1;
        } else {
          stepsToMove = Math.min(limit.maxCells, Math.max(1, Math.round(rawDy / step)));
        }
      } else if (rawDy < -threshold && limits.up.canMove) {
        directionToMove = 'up';
        const limit = limits.up;
        const dist = -rawDy;
        const exitDistThreshold = limit.maxCells * step + threshold;
        if (limit.canExit && dist >= exitDistThreshold) {
          forceExit = true;
          stepsToMove = limit.maxCells + 1;
        } else {
          stepsToMove = Math.min(limit.maxCells, Math.max(1, Math.round(dist / step)));
        }
      }
    }

    if (directionToMove && (stepsToMove > 0 || forceExit)) {
      moveBlock(blockId, directionToMove, stepsToMove, forceExit);
    }
  };

  const handlePointerCancel = (e) => {
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
  };

  const selectedBlock = blocks.find(b => b.id === selectedBlockId && !b.exiting) || null;

  return (
    <div className="blockout-container">
      <div ref={fireworksRef} />

      {gameState === 'levels' && (
        <>
          <div className="blockout-header">
            <h2 className="blockout-title">🧩 Block Out! - Výber levelu</h2>
            <div className="blockout-header-actions">
              <button
                className="blockout-btn-icon"
                onClick={toggleMute}
                title={muted ? 'Zapnúť zvuk' : 'Vypnúť zvuk'}
              >
                {muted ? '🔇' : '🔊'}
              </button>
            </div>
          </div>

          <div className="blockout-hint">
            Hraj vlastným tempom bez akéhokoľvek časovača! Posuň kocky do dverí rovnakej farby.
          </div>

          <div className="blockout-levels-grid">
            {BLOCK_OUT_LEVELS.map((lvl, idx) => {
              const unlocked = isLevelUnlocked(idx);
              const stars = levelStars[idx] || 0;
              return (
                <button
                  key={lvl.id}
                  className="blockout-level-card"
                  disabled={!unlocked}
                  onClick={() => startLevel(idx)}
                >
                  <div className="blockout-level-number">{lvl.id}</div>
                  {unlocked ? (
                    <div className="blockout-level-stars">
                      {'★'.repeat(stars)}{'☆'.repeat(5 - stars)}
                    </div>
                  ) : (
                    <div className="blockout-level-lock">🔒</div>
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}

      {(gameState === 'playing' || gameState === 'win') && (
        <>
          <div className="blockout-header">
            <button
              className="blockout-btn-icon"
              onClick={() => {
                if (onBack) {
                  onBack();
                } else {
                  setGameState('levels');
                }
              }}
              title={onBack ? 'Späť' : 'Výber levelov'}
            >
              📋
            </button>
            <h2 className="blockout-title">{level.name}</h2>
            <div className="blockout-header-actions">
              <button
                className="blockout-btn-icon"
                onClick={undoMove}
                disabled={history.length === 0}
                title="Krok späť"
              >
                ↩
              </button>
              <button
                className="blockout-btn-icon"
                onClick={resetCurrentLevel}
                title="Reštartovať level"
              >
                🔄
              </button>
              <button
                className="blockout-btn-icon"
                onClick={toggleMute}
                title={muted ? 'Zapnúť zvuk' : 'Vypnúť zvuk'}
              >
                {muted ? '🔇' : '🔊'}
              </button>
            </div>
          </div>

          <div className="blockout-status-bar">
            <span>{level.hint}</span>
            <span className="blockout-moves-badge">Ťahy: {moves}</span>
          </div>

          <div className="blockout-board-wrapper">
            <div
              className="blockout-board-outer"
              style={{
                width: level.width * cellSize + (level.width - 1) * gap + padding * 2,
                height: level.height * cellSize + (level.height - 1) * gap + padding * 2,
                marginTop: doorDepth + 4,
                marginBottom: doorDepth + 4
              }}
            >
              {/* Doors */}
              {level.doors.map((door, dIdx) => {
                const conf = COLOR_CONFIG[door.color] || COLOR_CONFIG.red;
                let doorStyle = {
                  backgroundColor: conf.bg,
                  boxShadow: `0 0 10px ${conf.glow}`
                };

                if (door.side === 'top') {
                  doorStyle.left = padding + door.index * (cellSize + gap);
                  doorStyle.width = cellSize;
                  doorStyle.top = -doorDepth;
                  doorStyle.height = doorDepth;
                } else if (door.side === 'bottom') {
                  doorStyle.left = padding + door.index * (cellSize + gap);
                  doorStyle.width = cellSize;
                  doorStyle.bottom = -doorDepth;
                  doorStyle.height = doorDepth;
                } else if (door.side === 'left') {
                  doorStyle.top = padding + door.index * (cellSize + gap);
                  doorStyle.height = cellSize;
                  doorStyle.left = -doorDepth;
                  doorStyle.width = doorDepth;
                } else if (door.side === 'right') {
                  doorStyle.top = padding + door.index * (cellSize + gap);
                  doorStyle.height = cellSize;
                  doorStyle.right = -doorDepth;
                  doorStyle.width = doorDepth;
                }

                // Otvor sa zvýrazní LEN vtedy, keď je pri ňom kocka rovnakej farby
                const isMatchingBlockAdjacent = blocks.some(b => {
                  if (b.exiting || b.color !== door.color) return false;
                  if (door.side === 'top') return b.r === 0 && b.c === door.index;
                  if (door.side === 'bottom') return b.r === level.height - 1 && b.c === door.index;
                  if (door.side === 'left') return b.c === 0 && b.r === door.index;
                  if (door.side === 'right') return b.c === level.width - 1 && b.r === door.index;
                  return false;
                });

                const isAbsorbing = blocks.some(b => {
                  if (!b.exiting || b.exitSide !== door.side || b.color !== door.color) return false;
                  if (door.side === 'top' || door.side === 'bottom') return b.c === door.index;
                  if (door.side === 'left' || door.side === 'right') return b.r === door.index;
                  return false;
                });

                return (
                  <div
                    key={dIdx}
                    className={`blockout-door blockout-door-${door.side} ${
                      isMatchingBlockAdjacent ? 'highlight' : ''
                    } ${isAbsorbing ? 'absorbing' : ''}`}
                    style={doorStyle}
                  >
                    <span
                      className="blockout-door-icon"
                      style={{ fontSize: Math.max(10, Math.round(cellSize * 0.34)) + 'px' }}
                    >
                      {conf.icon}
                    </span>
                  </div>
                );
              })}

              {/* Grid Background Cells */}
              <div
                className="blockout-grid"
                style={{
                  padding: `${padding}px`,
                  gap: `${gap}px`,
                  gridTemplateColumns: `repeat(${level.width}, ${cellSize}px)`,
                  gridTemplateRows: `repeat(${level.height}, ${cellSize}px)`
                }}
              >
                {Array.from({ length: level.height * level.width }).map((_, cIdx) => (
                  <div
                    key={cIdx}
                    className="blockout-cell"
                    style={{
                      borderRadius: Math.max(6, Math.round(cellSize * 0.22)) + 'px'
                    }}
                  />
                ))}

                {/* Blocks */}
                {blocks.map((block) => {
                  const conf = COLOR_CONFIG[block.color] || COLOR_CONFIG.red;
                  const isSelected = selectedBlockId === block.id;
                  const isDragging = dragInfo && dragInfo.blockId === block.id;

                  let top = padding + block.r * (cellSize + gap);
                  let left = padding + block.c * (cellSize + gap);

                  const pieceStyle = {
                    top,
                    left,
                    width: cellSize,
                    height: cellSize,
                    backgroundColor: conf.bg,
                    borderColor: conf.border,
                    borderRadius: Math.max(8, Math.round(cellSize * 0.24)) + 'px'
                  };

                  if (isDragging) {
                    pieceStyle.transform = `translate3d(${dragInfo.offsetX}px, ${dragInfo.offsetY}px, 0)`;
                  }

                  const exitClass = block.exiting ? `exiting exit-${block.exitSide}` : '';

                  return (
                    <div
                      key={block.id}
                      className={`blockout-piece ${isSelected ? 'selected' : ''} ${exitClass} ${
                        isDragging ? 'dragging' : ''
                      }`}
                      style={pieceStyle}
                      onPointerDown={(e) => handlePointerDown(block, e)}
                      onPointerMove={handlePointerMove}
                      onPointerUp={handlePointerUp}
                      onPointerCancel={handlePointerCancel}
                    >
                      <span
                        className="blockout-piece-icon"
                        style={{ fontSize: Math.max(13, Math.round(cellSize * 0.42)) + 'px' }}
                      >
                        {conf.icon}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Temporary feedback banner under the game board */}
            <div
              className={`blockout-message-banner ${message ? 'visible' : ''}`}
              aria-live="polite"
            >
              {message || ' '}
            </div>

            {/* Controls hint & D-Pad */}
            <div className="blockout-controls-panel">
              <div className="blockout-control-tip">
                👆 Ťahaj kocku prstom alebo myšou do dverí
              </div>

              {/* D-Pad Directional Controls for accessible touch/click */}
              <div className="blockout-dpad">
                <div />
                <button
                  className="blockout-dpad-btn"
                  disabled={!selectedBlock || !canBlockMoveInDir(selectedBlock, -1, 0, blocks)}
                  onClick={() => selectedBlock && moveBlock(selectedBlock.id, 'up')}
                  title="Hore (alebo šípka Hore / W)"
                >
                  ▲
                </button>
                <div />
                <button
                  className="blockout-dpad-btn"
                  disabled={!selectedBlock || !canBlockMoveInDir(selectedBlock, 0, -1, blocks)}
                  onClick={() => selectedBlock && moveBlock(selectedBlock.id, 'left')}
                  title="Vľavo (alebo šípka Vľavo / A)"
                >
                  ◀
                </button>
                <div className="blockout-dpad-center">
                  {selectedBlock ? COLOR_CONFIG[selectedBlock.color]?.icon : '•'}
                </div>
                <button
                  className="blockout-dpad-btn"
                  disabled={!selectedBlock || !canBlockMoveInDir(selectedBlock, 0, 1, blocks)}
                  onClick={() => selectedBlock && moveBlock(selectedBlock.id, 'right')}
                  title="Vpravo (alebo šípka Vpravo / D)"
                >
                  ▶
                </button>
                <div />
                <button
                  className="blockout-dpad-btn"
                  disabled={!selectedBlock || !canBlockMoveInDir(selectedBlock, 1, 0, blocks)}
                  onClick={() => selectedBlock && moveBlock(selectedBlock.id, 'down')}
                  title="Dole (alebo šípka Dole / S)"
                >
                  ▼
                </button>
                <div />
              </div>
            </div>
          </div>

          {/* Victory Modal */}
          {gameState === 'win' && (
            <div className="blockout-modal-backdrop">
              <div className="blockout-modal-card">
                <div style={{ fontSize: 48 }}>🎉</div>
                <h3 className="blockout-win-title">Výborne!</h3>
                <div className="blockout-win-stars">★★★★★</div>
                <p style={{ margin: 0, color: '#475569', fontSize: 16 }}>
                  Všetky kocky úspešne vyradené na {moves} {moves === 1 ? 'ťah' : (moves < 5 ? 'ťahy' : 'ťahov')}!
                </p>
                <div className="blockout-modal-buttons">
                  {currentLevelIndex + 1 < BLOCK_OUT_LEVELS.length && (
                    <button
                      className="btn-blockout-primary"
                      onClick={() => startLevel(currentLevelIndex + 1)}
                    >
                      Ďalší level ➔
                    </button>
                  )}
                  <button
                    className="btn-blockout-secondary"
                    onClick={resetCurrentLevel}
                  >
                    Hrať znova 🔄
                  </button>
                  {onBack ? (
                    <button
                      className="btn-blockout-secondary"
                      onClick={onBack}
                    >
                      Späť do vybraných slov 📋
                    </button>
                  ) : (
                    <button
                      className="btn-blockout-secondary"
                      onClick={() => setGameState('levels')}
                    >
                      Výber levelov 📋
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
