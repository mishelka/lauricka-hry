import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BLOCK_OUT_LEVELS, COLOR_CONFIG, getBlockCells, getOccupiedCells, getBlockDimensions, isDirAllowedForBlock, isBlockFrozen, isDoorLocked, getLevelWalls } from './blockOutLevels';
import { sounds } from './soundEffects';
import { triggerFireworks } from '../utils/gameUtils';
import { getLevelStars, updateLevelBestStars } from '../utils/player';
import { RestartIcon, NextLevelIcon, LevelsMenuIcon, BackIcon } from '../components/Icons';
import './blockOut.css';

const DEFAULT_CELL_SIZE = 54;
const DEFAULT_GAP = 8;
const DEFAULT_PADDING = 12;
const DEFAULT_DOOR_DEPTH = 22;
const DRAG_THRESHOLD = 16;

function DoorArrow({ side, color, size }) {
  const isLight = color === 'white' || color === 'yellow';
  const fill = isLight ? '#334155' : '#ffffff';

  let rotation = 0;
  if (side === 'top') rotation = -90;
  if (side === 'right') rotation = 0;
  if (side === 'bottom') rotation = 90;
  if (side === 'left') rotation = 180;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className="blockout-door-arrow-svg"
      style={{
        transform: `rotate(${rotation}deg)`,
        display: 'block'
      }}
    >
      <path
        d="M8 5.5c0-.75.85-1.2 1.5-.8l9 6.5c.55.4.55 1.2 0 1.6l-9 6.5c-.65.4-1.5-.05-1.5-.8z"
        fill={fill}
      />
    </svg>
  );
}

function BlockArrowOverlay({ block, width, height, cellSize, gap = 0 }) {
  const dir = block.direction || block.axis;
  if (!dir) return null;

  const cells = getBlockCells(block);
  const arrowPadding = Math.max(6, Math.round(cellSize * 0.18));
  const headSize = Math.max(7, Math.round(cellSize * 0.22));
  const strokeW = Math.max(3.5, Math.round(cellSize * 0.08));

  // Determine best row for horizontal arrows (row with most cells)
  let targetRow = block.arrowRow;
  if (targetRow === undefined) {
    const rowCounts = {};
    for (const [r] of cells) {
      rowCounts[r] = (rowCounts[r] || 0) + 1;
    }
    let maxCount = -1;
    for (const [rStr, count] of Object.entries(rowCounts)) {
      const r = Number(rStr);
      if (count > maxCount) {
        maxCount = count;
        targetRow = r;
      }
    }
  }

  // Determine best col for vertical arrows (col with most cells)
  let targetCol = block.arrowCol;
  if (targetCol === undefined) {
    const colCounts = {};
    for (const [_, c] of cells) {
      colCounts[c] = (colCounts[c] || 0) + 1;
    }
    let maxCount = -1;
    for (const [cStr, count] of Object.entries(colCounts)) {
      const c = Number(cStr);
      if (count > maxCount) {
        maxCount = count;
        targetCol = c;
      }
    }
  }

  const rowCells = cells.filter(([r]) => r === targetRow);
  const rowCols = rowCells.map(([_, c]) => c);
  const minC = rowCols.length > 0 ? Math.min(...rowCols) : 0;
  const maxC = rowCols.length > 0 ? Math.max(...rowCols) : 0;

  const cy = (targetRow || 0) * (cellSize + gap) + cellSize / 2;
  const xLeft = minC * (cellSize + gap) + arrowPadding;
  const xRight = maxC * (cellSize + gap) + cellSize - arrowPadding;

  const colCells = cells.filter(([_, c]) => c === targetCol);
  const colRows = colCells.map(([r]) => r);
  const minR = colRows.length > 0 ? Math.min(...colRows) : 0;
  const maxR = colRows.length > 0 ? Math.max(...colRows) : 0;

  const cx = (targetCol || 0) * (cellSize + gap) + cellSize / 2;
  const yTop = minR * (cellSize + gap) + arrowPadding;
  const yBottom = maxR * (cellSize + gap) + cellSize - arrowPadding;

  if (dir === 'vertical' || dir === 'v' || dir === 'y') {
    return (
      <svg className="blockout-direction-arrow" width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <filter id={`arrow-glow-${block.id}`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#000" floodOpacity="0.45" />
          </filter>
        </defs>
        <g filter={`url(#arrow-glow-${block.id})`}>
          <line
            x1={cx}
            y1={yTop + headSize * 0.6}
            x2={cx}
            y2={yBottom - headSize * 0.6}
            stroke="white"
            strokeWidth={strokeW}
            strokeLinecap="round"
          />
          <polygon
            points={`${cx},${yTop} ${cx - headSize},${yTop + headSize * 1.3} ${cx + headSize},${yTop + headSize * 1.3}`}
            fill="white"
          />
          <polygon
            points={`${cx},${yBottom} ${cx - headSize},${yBottom - headSize * 1.3} ${cx + headSize},${yBottom - headSize * 1.3}`}
            fill="white"
          />
        </g>
      </svg>
    );
  }

  if (dir === 'horizontal' || dir === 'h' || dir === 'x') {
    return (
      <svg className="blockout-direction-arrow" width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <filter id={`arrow-glow-${block.id}`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#000" floodOpacity="0.45" />
          </filter>
        </defs>
        <g filter={`url(#arrow-glow-${block.id})`}>
          <line
            x1={xLeft + headSize * 0.6}
            y1={cy}
            x2={xRight - headSize * 0.6}
            y2={cy}
            stroke="white"
            strokeWidth={strokeW}
            strokeLinecap="round"
          />
          <polygon
            points={`${xLeft},${cy} ${xLeft + headSize * 1.3},${cy - headSize} ${xLeft + headSize * 1.3},${cy + headSize}`}
            fill="white"
          />
          <polygon
            points={`${xRight},${cy} ${xRight - headSize * 1.3},${cy - headSize} ${xRight - headSize * 1.3},${cy + headSize}`}
            fill="white"
          />
        </g>
      </svg>
    );
  }

  if (dir === 'up') {
    return (
      <svg className="blockout-direction-arrow" width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <filter id={`arrow-glow-${block.id}`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#000" floodOpacity="0.45" />
          </filter>
        </defs>
        <g filter={`url(#arrow-glow-${block.id})`}>
          <line x1={cx} y1={yTop + headSize * 0.6} x2={cx} y2={yBottom} stroke="white" strokeWidth={strokeW} strokeLinecap="round" />
          <polygon points={`${cx},${yTop} ${cx - headSize},${yTop + headSize * 1.4} ${cx + headSize},${yTop + headSize * 1.4}`} fill="white" />
        </g>
      </svg>
    );
  }

  if (dir === 'down') {
    return (
      <svg className="blockout-direction-arrow" width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <filter id={`arrow-glow-${block.id}`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#000" floodOpacity="0.45" />
          </filter>
        </defs>
        <g filter={`url(#arrow-glow-${block.id})`}>
          <line x1={cx} y1={yTop} x2={cx} y2={yBottom - headSize * 0.6} stroke="white" strokeWidth={strokeW} strokeLinecap="round" />
          <polygon points={`${cx},${yBottom} ${cx - headSize},${yBottom - headSize * 1.4} ${cx + headSize},${yBottom - headSize * 1.4}`} fill="white" />
        </g>
      </svg>
    );
  }

  if (dir === 'left') {
    return (
      <svg className="blockout-direction-arrow" width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <filter id={`arrow-glow-${block.id}`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#000" floodOpacity="0.45" />
          </filter>
        </defs>
        <g filter={`url(#arrow-glow-${block.id})`}>
          <line x1={xLeft + headSize * 0.6} y1={cy} x2={xRight} y2={cy} stroke="white" strokeWidth={strokeW} strokeLinecap="round" />
          <polygon points={`${xLeft},${cy} ${xLeft + headSize * 1.4},${cy - headSize} ${xLeft + headSize * 1.4},${cy + headSize}`} fill="white" />
        </g>
      </svg>
    );
  }

  if (dir === 'right') {
    return (
      <svg className="blockout-direction-arrow" width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <filter id={`arrow-glow-${block.id}`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#000" floodOpacity="0.45" />
          </filter>
        </defs>
        <g filter={`url(#arrow-glow-${block.id})`}>
          <line x1={xLeft} y1={cy} x2={xRight - headSize * 0.6} y2={cy} stroke="white" strokeWidth={strokeW} strokeLinecap="round" />
          <polygon points={`${xRight},${cy} ${xRight - headSize * 1.4},${cy - headSize} ${xRight - headSize * 1.4},${cy + headSize}`} fill="white" />
        </g>
      </svg>
    );
  }

  return null;
}

function FrozenBlockBadge({ block, cellSize, gap = 0 }) {
  const count = block.frozen ?? block.freezeCount ?? block.count ?? 0;
  if (!count || count <= 0) return null;

  const cells = getBlockCells(block);
  const avgR = cells.reduce((sum, [r]) => sum + r, 0) / cells.length;
  const avgC = cells.reduce((sum, [_, c]) => sum + c, 0) / cells.length;

  const cx = avgC * (cellSize + gap) + cellSize / 2;
  const cy = avgR * (cellSize + gap) + cellSize / 2;
  const badgeSize = Math.max(24, Math.round(cellSize * 0.52));

  return (
    <div
      className="blockout-frozen-badge"
      style={{
        left: `${cx}px`,
        top: `${cy}px`,
        width: `${badgeSize}px`,
        height: `${badgeSize}px`,
        fontSize: `${Math.max(13, Math.round(badgeSize * 0.52))}px`
      }}
    >
      <div className="blockout-frozen-badge-inner">
        <span className="blockout-frozen-snowflake">❄</span>
        <span className="blockout-frozen-number">{count}</span>
      </div>
    </div>
  );
}

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
  const [currentLevelIndex, setCurrentLevelIndex] = useState(() =>
    rewardLevel !== null ? rewardLevel : 0
  );
  const [gameState, setGameState] = useState(() =>
    rewardLevel !== null ? 'playing' : 'levels'
  );
  const [blocks, setBlocks] = useState([]);
  const [doors, setDoors] = useState([]);
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
  const levelWalls = useMemo(() => getLevelWalls(level), [level]);
  const { cellSize, gap, padding, doorDepth } = boardLayout;

  // Lock viewport scroll & disable long-press/contextmenu/selection on HTML
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
      if (e.target && e.target.closest && e.target.closest('.blockout-levels-grid')) {
        return;
      }
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

  useEffect(() => {
    function handleResize() {
      if (typeof window === 'undefined') return;

      const winW = window.innerWidth;
      const winH = window.innerHeight;
      const isSmallMobile = winW < 380 || winH < 620;
      const isMobile = winW < 540 || winH < 720;

      const currentGap = isSmallMobile ? 4 : isMobile ? 5 : 7;
      const currentPadding = isSmallMobile ? 6 : isMobile ? 8 : 10;
      const currentDoorDepth = isSmallMobile ? 14 : isMobile ? 16 : 20;

      // Available width calculation
      // Screen padding + board wrapper padding + doors on left and right
      const screenPadding = isSmallMobile ? 8 : isMobile ? 12 : 20;
      const wrapperPadding = isSmallMobile ? 12 : isMobile ? 16 : 24;
      const overheadW = screenPadding + wrapperPadding + (currentDoorDepth * 2);
      const maxAvailableWidth = Math.min(winW, 580) - overheadW;
      const cellFromWidth = Math.floor(
        (maxAvailableWidth - currentPadding * 2 - (level.width - 1) * currentGap) / level.width
      );

      // Available height calculation
      // Space for header (~46px), status bar (~36px), message banner (~28px), board margins & doors
      const overheadH = (isSmallMobile ? 130 : isMobile ? 148 : 166) + (currentDoorDepth * 2) + currentPadding * 2;
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
    return () => window.removeEventListener('resize', handleResize);
  }, [level.width, level.height]);

  // Dočasne odomknuté všetky levely pre testovanie
  function highestUnlockedLevel(_stars) {
    return BLOCK_OUT_LEVELS.length - 1;
  }

  const isLevelUnlocked = (_idx) => true;

  const startLevel = useCallback((lvlIndex) => {
    const lvl = BLOCK_OUT_LEVELS[lvlIndex];
    if (!lvl) return;
    setCurrentLevelIndex(lvlIndex);
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
      if (!target || isBlockFrozen(target)) return prevBlocks;
      if (!isDirAllowedForBlock(target, direction)) return prevBlocks;

      const blockCells = getBlockCells(target);
      let curR = target.r;
      let curC = target.c;
      let exited = false;
      let stepsRemaining = Math.max(1, requestedSteps);

      while (stepsRemaining > 0 && !exited) {
        const nextR = curR + dr;
        const nextC = curC + dc;
        const nextCells = blockCells.map(([rOff, cOff]) => ({
          r: nextR + rOff,
          c: nextC + cOff
        }));

        const exitingCells = nextCells.filter(
          c => c.r < 0 || c.r >= level.height || c.c < 0 || c.c >= level.width
        );

        if (exitingCells.length > 0) {
          let validExit = true;
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

            if (!door || door.color !== target.color || isDoorLocked(door)) {
              validExit = false;
              break;
            }
          }

          if (validExit) {
            exited = true;
            curR = nextR;
            curC = nextC;
          }
          break;
        }

        const isOccupied = prevBlocks.some(other => {
          if (other.exiting || other.id === target.id) return false;
          const otherCells = getOccupiedCells(other);
          return nextCells.some(nc => otherCells.some(oc => oc.r === nc.r && oc.c === nc.c));
        }) || nextCells.some(nc => levelWalls.some(w => w.r === nc.r && w.c === nc.c));

        if (isOccupied) {
          break;
        }

        curR = nextR;
        curC = nextC;
        stepsRemaining -= 1;
      }

      if (forceExit && !exited) {
        const nextR = curR + dr;
        const nextC = curC + dc;
        const nextCells = blockCells.map(([rOff, cOff]) => ({
          r: nextR + rOff,
          c: nextC + cOff
        }));
        const exitingCells = nextCells.filter(
          c => c.r < 0 || c.r >= level.height || c.c < 0 || c.c >= level.width
        );
        if (exitingCells.length > 0) {
          let validExit = true;
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

            if (!door || door.color !== target.color || isDoorLocked(door)) {
              validExit = false;
              break;
            }
          }
          if (validExit) {
            exited = true;
            curR = nextR;
            curC = nextC;
          }
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
          doors: doors.map(d => ({ ...d })),
          moves,
          selectedBlockId: target.id
        }
      ]);
      setMoves(m => m + 1);

      if (exited) {
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

        const updated = prevBlocks.map(b => {
          if (b.id === target.id) {
            return { ...b, r: curR, c: curC, exiting: true, exitSide };
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
  }, [gameState, findDoorAt, level.height, level.width, levelWalls, moves, currentLevelIndex, doors]);

  const undoMove = () => {
    if (history.length === 0 || gameState !== 'playing') return;
    const last = history[history.length - 1];
    setHistory(history.slice(0, -1));
    setBlocks(last.blocks);
    if (last.doors) {
      setDoors(last.doors.map(d => ({ ...d, justUnlocked: false })));
    }
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

    setSelectedBlockId(block.id);

    if (isBlockFrozen(block)) {
      sounds.playIceCrack();
      return;
    }

    const targetEl = e.currentTarget;
    if (targetEl && targetEl.setPointerCapture) {
      try {
        targetEl.setPointerCapture(e.pointerId);
      } catch {
        // Fallback if setPointerCapture is unsupported
      }
    }

    dragRef.current = {
      pointerId: e.pointerId,
      targetEl,
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

  const handlePointerMove = (e) => {
    if (!dragRef.current || dragRef.current.pointerId !== e.pointerId) return;

    const drag = dragRef.current;
    const totalDist = Math.hypot(e.clientX - drag.startX, e.clientY - drag.startY);

    if (totalDist < 5 && !drag.isDragging) {
      return; // Small deadzone for simple clicks/taps
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
        if (drag.exitSide === 'right' && localDx <= -threshold) pullBack = true;
        else if (drag.exitSide === 'left' && localDx >= threshold) pullBack = true;
        else if (drag.exitSide === 'bottom' && localDy <= -threshold) pullBack = true;
        else if (drag.exitSide === 'top' && localDy >= threshold) pullBack = true;

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

      let pDr = 0, pDc = 0;
      let sDr = 0, sDc = 0;

      if (absDx >= absDy) {
        if (absDx >= threshold) {
          pDc = localDx > 0 ? 1 : -1;
        }
        if (absDy >= threshold) {
          pDr = localDy > 0 ? 1 : -1;
        }
      } else {
        if (absDy >= threshold) {
          pDr = localDy > 0 ? 1 : -1;
        }
        if (absDx >= threshold) {
          pDc = localDx > 0 ? 1 : -1;
        }
      }

      if (pDr === 0 && pDc === 0) break;

      let moved = false;
      // Try primary direction first
      if (pDc !== 0 && absDx >= absDy) {
        const res = checkBlockStep(drag.block, drag.currentR, drag.currentC, drag.currentR, drag.currentC + pDc, blocks);
        if (res.valid) {
          if (res.exit) {
            drag.isExiting = true;
            drag.exitSide = res.exitSide;
          } else {
            drag.currentC += pDc;
          }
          moved = true;
        }
      } else if (pDr !== 0) {
        const res = checkBlockStep(drag.block, drag.currentR, drag.currentC, drag.currentR + pDr, drag.currentC, blocks);
        if (res.valid) {
          if (res.exit) {
            drag.isExiting = true;
            drag.exitSide = res.exitSide;
          } else {
            drag.currentR += pDr;
          }
          moved = true;
        }
      }

      // If primary direction was blocked, try secondary direction
      if (!moved) {
        if (sDr !== 0 && absDx >= absDy) {
          const res = checkBlockStep(drag.block, drag.currentR, drag.currentC, drag.currentR + sDr, drag.currentC, blocks);
          if (res.valid) {
            if (res.exit) {
              drag.isExiting = true;
              drag.exitSide = res.exitSide;
            } else {
              drag.currentR += sDr;
            }
            moved = true;
          }
        } else if (sDc !== 0 && absDy > absDx) {
          const res = checkBlockStep(drag.block, drag.currentR, drag.currentC, drag.currentR, drag.currentC + sDc, blocks);
          if (res.valid) {
            if (res.exit) {
              drag.isExiting = true;
              drag.exitSide = res.exitSide;
            } else {
              drag.currentC += sDc;
            }
            moved = true;
          }
        }
      }

      if (!moved) break;
    }

    // Sub-pixel drag visual offset calculation
    const expectedX = drag.startX + (drag.currentC - drag.startC) * step;
    const expectedY = drag.startY + (drag.currentR - drag.startR) * step;
    const localDx = e.clientX - expectedX;
    const localDy = e.clientY - expectedY;

    let subOffsetX = 0;
    let subOffsetY = 0;

    if (drag.isExiting) {
      if (drag.exitSide === 'right') {
        subOffsetX = Math.max(0, Math.min(localDx, doorDepth + cellSize * 0.25));
        subOffsetY = Math.max(-6, Math.min(6, localDy * 0.1));
      } else if (drag.exitSide === 'left') {
        subOffsetX = Math.min(0, Math.max(localDx, -(doorDepth + cellSize * 0.25)));
        subOffsetY = Math.max(-6, Math.min(6, localDy * 0.1));
      } else if (drag.exitSide === 'bottom') {
        subOffsetY = Math.max(0, Math.min(localDy, doorDepth + cellSize * 0.25));
        subOffsetX = Math.max(-6, Math.min(6, localDx * 0.1));
      } else if (drag.exitSide === 'top') {
        subOffsetY = Math.min(0, Math.max(localDy, -(doorDepth + cellSize * 0.25)));
        subOffsetX = Math.max(-6, Math.min(6, localDx * 0.1));
      }
    } else {
      const canRight = checkBlockStep(drag.block, drag.currentR, drag.currentC, drag.currentR, drag.currentC + 1, blocks).valid;
      const canLeft = checkBlockStep(drag.block, drag.currentR, drag.currentC, drag.currentR, drag.currentC - 1, blocks).valid;
      const canDown = checkBlockStep(drag.block, drag.currentR, drag.currentC, drag.currentR + 1, drag.currentC, blocks).valid;
      const canUp = checkBlockStep(drag.block, drag.currentR, drag.currentC, drag.currentR - 1, drag.currentC, blocks).valid;

      if (localDx > 0) {
        subOffsetX = canRight ? Math.min(localDx, step * 0.5) : Math.min(localDx * 0.15, 8);
      } else if (localDx < 0) {
        subOffsetX = canLeft ? Math.max(localDx, -step * 0.5) : Math.max(localDx * 0.15, -8);
      }

      if (localDy > 0) {
        subOffsetY = canDown ? Math.min(localDy, step * 0.5) : Math.min(localDy * 0.15, 8);
      } else if (localDy < 0) {
        subOffsetY = canUp ? Math.max(localDy, -step * 0.5) : Math.max(localDy * 0.15, -8);
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
  };

  const handlePointerUp = (e) => {
    if (!dragRef.current || dragRef.current.pointerId !== e.pointerId) return;

    const {
      targetEl,
      blockId,
      startR,
      startC,
      currentR,
      currentC,
      isDragging,
      isExiting,
      exitSide
    } = dragRef.current;

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

    if (isExiting) {
      // Save history snapshot before the drag started
      setHistory(prevHist => [
        ...prevHist,
        {
          blocks: blocks.map(b => ({ ...b })),
          doors: doors.map(d => ({ ...d })),
          moves,
          selectedBlockId: blockId
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

      setBlocks(updated);

      setTimeout(() => {
        setBlocks(current => {
          const remaining = current.filter(b => b.id !== blockId);
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
            setSelectedBlockId(prev => (prev === blockId ? remaining[0].id : prev));
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
          moves,
          selectedBlockId: blockId
        }
      ]);
      setMoves(m => m + 1);
      sounds.playSlide();

      setBlocks(prev =>
        prev.map(b => (b.id === blockId ? { ...b, r: currentR, c: currentC } : b))
      );
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

  const handleExit = () => {
    if (onBack) {
      onBack();
    } else if (onCloseReward) {
      onCloseReward();
    } else if (navigate) {
      navigate('/');
    }
  };

  const selectedBlock = blocks.find(b => b.id === selectedBlockId && !b.exiting) || null;

  return (
    <div
      className="blockout-container"
      onContextMenu={(e) => e.preventDefault()}
      onSelectStart={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
    >
      <div ref={fireworksRef} />

      {gameState === 'levels' && (
        <>
          <div className="blockout-header">
            <button
              className="blockout-btn-icon"
              onClick={handleExit}
              title="Späť do menu"
            >
              <BackIcon size={20} stroke="#334155" />
            </button>
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
                if (rewardLevel !== null) {
                  handleExit();
                } else {
                  setGameState('levels');
                }
              }}
              title={rewardLevel !== null ? 'Späť' : 'Výber levelov'}
            >
              {rewardLevel !== null ? <BackIcon size={20} stroke="#334155" /> : '📋'}
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
              {doors.map((door, dIdx) => {
                const conf = COLOR_CONFIG[door.color] || COLOR_CONFIG.red;
                const span = door.span || 1;
                const isLocked = isDoorLocked(door);
                const doorWidth = door.side === 'top' || door.side === 'bottom'
                  ? span * cellSize + (span - 1) * gap
                  : doorDepth;
                const doorHeight = door.side === 'left' || door.side === 'right'
                  ? span * cellSize + (span - 1) * gap
                  : doorDepth;

                let doorStyle = {
                  backgroundColor: conf.bg,
                  boxShadow: `0 0 10px ${conf.glow}`
                };

                if (door.side === 'top') {
                  doorStyle.left = padding + door.index * (cellSize + gap);
                  doorStyle.width = doorWidth;
                  doorStyle.top = -doorDepth;
                  doorStyle.height = doorDepth;
                } else if (door.side === 'bottom') {
                  doorStyle.left = padding + door.index * (cellSize + gap);
                  doorStyle.width = doorWidth;
                  doorStyle.bottom = -doorDepth;
                  doorStyle.height = doorDepth;
                } else if (door.side === 'left') {
                  doorStyle.top = padding + door.index * (cellSize + gap);
                  doorStyle.height = doorHeight;
                  doorStyle.left = -doorDepth;
                  doorStyle.width = doorDepth;
                } else if (door.side === 'right') {
                  doorStyle.top = padding + door.index * (cellSize + gap);
                  doorStyle.height = doorHeight;
                  doorStyle.right = -doorDepth;
                  doorStyle.width = doorDepth;
                }

                // Otvor sa zvýrazní LEN vtedy, keď je pri ňom kocka rovnakej farby a nie je zamknutý
                const isMatchingBlockAdjacent = !isLocked && blocks.some(b => {
                  if (b.exiting || b.color !== door.color) return false;
                  const effectiveBlock = (dragInfo && dragInfo.blockId === b.id)
                    ? { ...b, r: dragInfo.currentR, c: dragInfo.currentC }
                    : b;
                  const occupied = getOccupiedCells(effectiveBlock);
                  return occupied.some(cell => {
                    if (door.side === 'top') return cell.r === 0 && cell.c >= door.index && cell.c < door.index + span;
                    if (door.side === 'bottom') return cell.r === level.height - 1 && cell.c >= door.index && cell.c < door.index + span;
                    if (door.side === 'left') return cell.c === 0 && cell.r >= door.index && cell.r < door.index + span;
                    if (door.side === 'right') return cell.c === level.width - 1 && cell.r >= door.index && cell.r < door.index + span;
                    return false;
                  });
                });

                const isAbsorbing = !isLocked && (blocks.some(b => {
                  if (!b.exiting || b.exitSide !== door.side || b.color !== door.color) return false;
                  const occupied = getOccupiedCells(b);
                  return occupied.some(cell => {
                    if (door.side === 'top' || door.side === 'bottom') return cell.c >= door.index && cell.c < door.index + span;
                    if (door.side === 'left' || door.side === 'right') return cell.r >= door.index && cell.r < door.index + span;
                    return false;
                  });
                }) || (dragInfo && dragInfo.isExiting && dragInfo.exitSide === door.side && (() => {
                  const activeB = blocks.find(b => b.id === dragInfo.blockId);
                  if (!activeB || activeB.color !== door.color) return false;
                  const occ = getOccupiedCells({ ...activeB, r: dragInfo.currentR, c: dragInfo.currentC });
                  return occ.some(cell => {
                    if (door.side === 'top' || door.side === 'bottom') return cell.c >= door.index && cell.c < door.index + span;
                    if (door.side === 'left' || door.side === 'right') return cell.r >= door.index && cell.r < door.index + span;
                    return false;
                  });
                })()));

                return (
                  <div
                    key={door.id || dIdx}
                    className={`blockout-door blockout-door-${door.side} ${
                      isLocked ? 'blockout-door-locked' : ''
                    } ${door.justUnlocked ? 'just-unlocked' : ''} ${
                      isMatchingBlockAdjacent ? 'highlight' : ''
                    } ${isAbsorbing ? 'absorbing' : ''}`}
                    style={doorStyle}
                    title={isLocked ? `Zamknutý východ (zostáva ${door.locked})` : undefined}
                  >
                    {isLocked ? (
                      <div className="blockout-door-lock-badge">
                        <span className="blockout-door-lock-icon">🔒</span>
                        <span className="blockout-door-lock-count">{door.locked}</span>
                      </div>
                    ) : (
                      <DoorArrow
                        side={door.side}
                        color={door.color}
                        size={Math.max(12, Math.round(cellSize * 0.4))}
                      />
                    )}
                  </div>
                );
              })}

              {/* Grid Background Cells & Walls */}
              <div
                className="blockout-grid"
                style={{
                  padding: `${padding}px`,
                  gap: `${gap}px`,
                  gridTemplateColumns: `repeat(${level.width}, ${cellSize}px)`,
                  gridTemplateRows: `repeat(${level.height}, ${cellSize}px)`
                }}
              >
                {Array.from({ length: level.height * level.width }).map((_, cIdx) => {
                  const r = Math.floor(cIdx / level.width);
                  const c = cIdx % level.width;
                  const isWall = levelWalls.some(w => w.r === r && w.c === c);

                  if (!isWall) {
                    return (
                      <div
                        key={cIdx}
                        className="blockout-cell"
                        style={{
                          borderRadius: Math.max(6, Math.round(cellSize * 0.22)) + 'px'
                        }}
                      />
                    );
                  }

                  const hasTop = levelWalls.some(w => w.r === r - 1 && w.c === c);
                  const hasBottom = levelWalls.some(w => w.r === r + 1 && w.c === c);
                  const hasLeft = levelWalls.some(w => w.r === r && w.c === c - 1);
                  const hasRight = levelWalls.some(w => w.r === r && w.c === c + 1);
                  const hasBottomRight = levelWalls.some(w => w.r === r + 1 && w.c === c + 1);
                  const wallRadius = Math.max(8, Math.round(cellSize * 0.24));

                  return (
                    <div
                      key={cIdx}
                      className="blockout-cell blockout-cell-wall"
                      style={{
                        borderTopLeftRadius: !hasTop && !hasLeft ? `${wallRadius}px` : '0px',
                        borderTopRightRadius: !hasTop && !hasRight ? `${wallRadius}px` : '0px',
                        borderBottomLeftRadius: !hasBottom && !hasLeft ? `${wallRadius}px` : '0px',
                        borderBottomRightRadius: !hasBottom && !hasRight ? `${wallRadius}px` : '0px',
                        borderTop: !hasTop ? '2px solid #090d16' : 'none',
                        borderBottom: !hasBottom ? '2px solid #090d16' : 'none',
                        borderLeft: !hasLeft ? '2px solid #090d16' : 'none',
                        borderRight: !hasRight ? '2px solid #090d16' : 'none',
                      }}
                      title="Stena"
                    >
                      {/* Seamless bridge between adjacent horizontal wall cells */}
                      {hasRight && (
                        <div
                          className="blockout-wall-bridge blockout-wall-bridge-h"
                          style={{
                            top: 0,
                            left: 'calc(100% - 1px)',
                            width: gap + 2,
                            height: cellSize,
                            borderTop: (!levelWalls.some(w => w.r === r - 1 && w.c === c) && !levelWalls.some(w => w.r === r - 1 && w.c === c + 1)) ? '2px solid #090d16' : 'none',
                            borderBottom: (!levelWalls.some(w => w.r === r + 1 && w.c === c) && !levelWalls.some(w => w.r === r + 1 && w.c === c + 1)) ? '2px solid #090d16' : 'none',
                          }}
                        />
                      )}

                      {/* Seamless bridge between adjacent vertical wall cells */}
                      {hasBottom && (
                        <div
                          className="blockout-wall-bridge blockout-wall-bridge-v"
                          style={{
                            top: 'calc(100% - 1px)',
                            left: 0,
                            width: cellSize,
                            height: gap + 2,
                            borderLeft: (!levelWalls.some(w => w.r === r && w.c === c - 1) && !levelWalls.some(w => w.r === r + 1 && w.c === c - 1)) ? '2px solid #090d16' : 'none',
                            borderRight: (!levelWalls.some(w => w.r === r && w.c === c + 1) && !levelWalls.some(w => w.r === r + 1 && w.c === c + 1)) ? '2px solid #090d16' : 'none',
                          }}
                        />
                      )}

                      {/* Seamless center bridge for 2x2 wall clusters */}
                      {hasRight && hasBottom && hasBottomRight && (
                        <div
                          className="blockout-wall-bridge blockout-wall-bridge-c"
                          style={{
                            top: 'calc(100% - 1px)',
                            left: 'calc(100% - 1px)',
                            width: gap + 2,
                            height: gap + 2,
                          }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Blocks */}
              {blocks.map((block) => {
                  const conf = COLOR_CONFIG[block.color] || COLOR_CONFIG.red;
                  const isSelected = selectedBlockId === block.id;
                  const isDragging = dragInfo && dragInfo.blockId === block.id;
                  const isFrozen = isBlockFrozen(block);
                  const cells = getBlockCells(block);
                  const dims = getBlockDimensions(block);

                  const containerW = dims.cols * cellSize + (dims.cols - 1) * gap;
                  const containerH = dims.rows * cellSize + (dims.rows - 1) * gap;

                  let top = padding + block.r * (cellSize + gap);
                  let left = padding + block.c * (cellSize + gap);

                  const pieceStyle = {
                    top,
                    left,
                    width: containerW,
                    height: containerH
                  };

                  if (isDragging) {
                    pieceStyle.transform = `translate3d(${dragInfo.offsetX}px, ${dragInfo.offsetY}px, 0)`;
                  }

                  const exitClass = block.exiting ? `exiting exit-${block.exitSide}` : '';
                  const frozenClass = isFrozen ? 'is-frozen' : (block.justUnfrozen ? 'just-unfrozen' : '');
                  const cellRadius = Math.max(8, Math.round(cellSize * 0.24));

                  return (
                    <div
                      key={block.id}
                      className={`blockout-piece-container ${isSelected ? 'selected' : ''} ${exitClass} ${frozenClass} ${
                        isDragging ? 'dragging' : ''
                      }`}
                      style={pieceStyle}
                      onPointerDown={(e) => handlePointerDown(block, e)}
                      onPointerMove={handlePointerMove}
                      onPointerUp={handlePointerUp}
                      onPointerCancel={handlePointerCancel}
                    >
                      {/* Directional arrow overlay for restricted blocks (↕, ↔, ↑, ↓, etc.) */}
                      <BlockArrowOverlay
                        block={block}
                        width={containerW}
                        height={containerH}
                        cellSize={cellSize}
                        gap={gap}
                      />

                      {/* Frozen countdown badge with snowflake and remaining count */}
                      <FrozenBlockBadge
                        block={block}
                        cellSize={cellSize}
                        gap={gap}
                      />

                      {cells.map(([dr, dc], cellIdx) => {
                        const hasTop = cells.some(([r, c]) => r === dr - 1 && c === dc);
                        const hasBottom = cells.some(([r, c]) => r === dr + 1 && c === dc);
                        const hasLeft = cells.some(([r, c]) => r === dr && c === dc - 1);
                        const hasRight = cells.some(([r, c]) => r === dr && c === dc + 1);

                        const subStyle = {
                          top: dr * (cellSize + gap),
                          left: dc * (cellSize + gap),
                          width: cellSize,
                          height: cellSize,
                          backgroundColor: conf.bg,
                          borderColor: conf.border,
                          borderTopLeftRadius: !hasTop && !hasLeft ? `${cellRadius}px` : '4px',
                          borderTopRightRadius: !hasTop && !hasRight ? `${cellRadius}px` : '4px',
                          borderBottomLeftRadius: !hasBottom && !hasLeft ? `${cellRadius}px` : '4px',
                          borderBottomRightRadius: !hasBottom && !hasRight ? `${cellRadius}px` : '4px',
                        };

                        return (
                          <div key={cellIdx} className="blockout-subcell-wrapper">
                            <div className="blockout-subcell" style={subStyle}>
                              {isFrozen && <div className="blockout-subcell-ice" />}
                            </div>

                            {/* Seamless bridge between adjacent horizontal cells */}
                            {hasRight && (
                              <div
                                className="blockout-cell-bridge blockout-cell-bridge-h"
                                style={{
                                  top: dr * (cellSize + gap),
                                  left: dc * (cellSize + gap) + cellSize - 1,
                                  width: gap + 2,
                                  height: cellSize,
                                  backgroundColor: conf.bg,
                                  borderTop: `2px solid ${conf.border}`,
                                  borderBottom: `2px solid ${conf.border}`
                                }}
                              />
                            )}

                            {/* Seamless bridge between adjacent vertical cells */}
                            {hasBottom && (
                              <div
                                className="blockout-cell-bridge blockout-cell-bridge-v"
                                style={{
                                  top: dr * (cellSize + gap) + cellSize - 1,
                                  left: dc * (cellSize + gap),
                                  width: cellSize,
                                  height: gap + 2,
                                  backgroundColor: conf.bg,
                                  borderLeft: `2px solid ${conf.border}`,
                                  borderRight: `2px solid ${conf.border}`
                                }}
                              />
                            )}

                            {/* Seamless center bridge for 2x2 blocks */}
                            {hasRight && hasBottom && cells.some(([r, c]) => r === dr + 1 && c === dc + 1) && (
                              <div
                                className="blockout-cell-bridge blockout-cell-bridge-c"
                                style={{
                                  top: dr * (cellSize + gap) + cellSize - 1,
                                  left: dc * (cellSize + gap) + cellSize - 1,
                                  width: gap + 2,
                                  height: gap + 2,
                                  backgroundColor: conf.bg
                                }}
                              />
                            )}
                          </div>
                        );
                      })}
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
                  {onNextVybraneLevel ? (
                    hasNextVybraneLevel && (
                      <button
                        className="btn-blockout-primary"
                        onClick={onNextVybraneLevel}
                      >
                        <NextLevelIcon size={20} />
                        <span>Ďalší level</span>
                      </button>
                    )
                  ) : (
                    currentLevelIndex + 1 < BLOCK_OUT_LEVELS.length && (
                      <button
                        className="btn-blockout-primary"
                        onClick={() => startLevel(currentLevelIndex + 1)}
                      >
                        <NextLevelIcon size={20} />
                        <span>Ďalší level</span>
                      </button>
                    )
                  )}
                  <button
                    className="btn-blockout-secondary"
                    onClick={resetCurrentLevel}
                  >
                    <RestartIcon size={20} stroke="#334155" />
                    <span>Hrať znova</span>
                  </button>
                  {onBack || onCloseReward ? (
                    <button
                      className="btn-blockout-secondary"
                      onClick={handleExit}
                    >
                      <LevelsMenuIcon size={20} stroke="#334155" />
                      <span>Späť</span>
                    </button>
                  ) : (
                    <button
                      className="btn-blockout-secondary"
                      onClick={() => setGameState('levels')}
                    >
                      <LevelsMenuIcon size={20} stroke="#334155" />
                      <span>Výber levelov</span>
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
