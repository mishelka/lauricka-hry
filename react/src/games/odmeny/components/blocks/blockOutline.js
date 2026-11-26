function vertexKey(vr, vc) {
  return `${vr},${vc}`;
}

function direction(from, to) {
  if (to.vc > from.vc) return 0;
  if (to.vr > from.vr) return 1;
  if (to.vc < from.vc) return 2;
  return 3;
}

function simplifyLoop(vertices) {
  const simplified = [...vertices];
  let changed = true;

  while (changed && simplified.length > 3) {
    changed = false;
    for (let index = 0; index < simplified.length; index += 1) {
      const previous = simplified[(index + simplified.length - 1) % simplified.length];
      const current = simplified[index];
      const next = simplified[(index + 1) % simplified.length];
      const before = direction(previous, current);
      const after = direction(current, next);
      if (before === after) {
        simplified.splice(index, 1);
        changed = true;
        break;
      }
    }
  }

  return simplified;
}

function formatNumber(value) {
  const rounded = Math.round(value * 1000) / 1000;
  return Object.is(rounded, -0) ? '0' : `${rounded}`;
}

function pointString(point) {
  return `${formatNumber(point.x)} ${formatNumber(point.y)}`;
}

function createRoundedLoop(vertices, toPoint, radius) {
  const points = vertices.map(toPoint);
  const shiftedPoints = points.map((point, index) => {
    const previous = points[(index + points.length - 1) % points.length];
    const next = points[(index + 1) % points.length];
    const incoming = { x: Math.sign(point.x - previous.x), y: Math.sign(point.y - previous.y) };
    const outgoing = { x: Math.sign(next.x - point.x), y: Math.sign(next.y - point.y) };
    return {
      point,
      incoming,
      outgoing
    };
  });

  const corners = shiftedPoints.map((shiftedPoint, index) => {
    const previous = shiftedPoints[(index + shiftedPoints.length - 1) % shiftedPoints.length].point;
    const next = shiftedPoints[(index + 1) % shiftedPoints.length].point;
    const shifted = shiftedPoint.point;
    const previousLength = Math.hypot(shifted.x - previous.x, shifted.y - previous.y);
    const nextLength = Math.hypot(next.x - shifted.x, next.y - shifted.y);
    const cornerRadius = Math.min(radius, previousLength / 2, nextLength / 2);

    return {
      incoming: shiftedPoint.incoming,
      outgoing: shiftedPoint.outgoing,
      radius: cornerRadius,
      start: { x: shifted.x - shiftedPoint.incoming.x * cornerRadius, y: shifted.y - shiftedPoint.incoming.y * cornerRadius },
      end: { x: shifted.x + shiftedPoint.outgoing.x * cornerRadius, y: shifted.y + shiftedPoint.outgoing.y * cornerRadius }
    };
  });

  const commands = [`M ${pointString(corners[0].end)}`];
  for (let index = 1; index < corners.length; index += 1) {
    const corner = corners[index];
    commands.push(`L ${pointString(corner.start)}`);
    if (corner.radius > 0) {
      const turn = corner.incoming.x * corner.outgoing.y - corner.incoming.y * corner.outgoing.x;
      commands.push(`A ${formatNumber(corner.radius)} ${formatNumber(corner.radius)} 0 0 ${turn > 0 ? 1 : 0} ${pointString(corner.end)}`);
    } else {
      commands.push(`L ${pointString(corner.end)}`);
    }
  }

  const firstCorner = corners[0];
  commands.push(`L ${pointString(firstCorner.start)}`);
  if (firstCorner.radius > 0) {
    const turn = firstCorner.incoming.x * firstCorner.outgoing.y - firstCorner.incoming.y * firstCorner.outgoing.x;
    commands.push(`A ${formatNumber(firstCorner.radius)} ${formatNumber(firstCorner.radius)} 0 0 ${turn > 0 ? 1 : 0} ${pointString(firstCorner.end)}`);
  } else {
    commands.push(`L ${pointString(firstCorner.end)}`);
  }
  commands.push('Z');
  return commands.join(' ');
}

export function buildBlockOutlinePath({ cells = [], cellSize, gap = 0, radius = 0 }) {
  if (!cells.length || !cellSize) return '';

  const cellSet = new Set(cells.map(([r, c]) => `${r},${c}`));
  const hasCell = (r, c) => cellSet.has(`${r},${c}`);

  let maxR = 0, maxC = 0;
  for (const [r, c] of cells) {
    if (r > maxR) maxR = r;
    if (c > maxC) maxC = c;
  }

  const subgridRows = (maxR + 1) * 2 - 1;
  const subgridCols = (maxC + 1) * 2 - 1;

  const isOccupied = (gr, gc) => {
    if (gr < 0 || gr > subgridRows || gc < 0 || gc > subgridCols) return false;
    const isEvenR = gr % 2 === 0;
    const isEvenC = gc % 2 === 0;

    if (isEvenR && isEvenC) {
      return hasCell(gr / 2, gc / 2);
    }
    if (isEvenR && !isEvenC) {
      const cLeft = (gc - 1) / 2;
      return hasCell(gr / 2, cLeft) && hasCell(gr / 2, cLeft + 1);
    }
    if (!isEvenR && isEvenC) {
      const rTop = (gr - 1) / 2;
      return hasCell(rTop, gc / 2) && hasCell(rTop + 1, gc / 2);
    }
    const rTop = (gr - 1) / 2;
    const cLeft = (gc - 1) / 2;
    return hasCell(rTop, cLeft) && hasCell(rTop, cLeft + 1) && hasCell(rTop + 1, cLeft) && hasCell(rTop + 1, cLeft + 1);
  };

  const edges = [];
  const addEdge = (from, to) => edges.push({ from, to, direction: direction(from, to) });

  for (let gr = 0; gr <= subgridRows; gr += 1) {
    for (let gc = 0; gc <= subgridCols; gc += 1) {
      if (!isOccupied(gr, gc)) continue;
      if (!isOccupied(gr - 1, gc)) addEdge({ vr: gr, vc: gc }, { vr: gr, vc: gc + 1 });
      if (!isOccupied(gr, gc + 1)) addEdge({ vr: gr, vc: gc + 1 }, { vr: gr + 1, vc: gc + 1 });
      if (!isOccupied(gr + 1, gc)) addEdge({ vr: gr + 1, vc: gc + 1 }, { vr: gr + 1, vc: gc });
      if (!isOccupied(gr, gc - 1)) addEdge({ vr: gr + 1, vc: gc }, { vr: gr, vc: gc });
    }
  }

  const outgoingEdges = new Map();
  edges.forEach((edge, index) => {
    edge.id = index;
    const key = vertexKey(edge.from.vr, edge.from.vc);
    if (!outgoingEdges.has(key)) outgoingEdges.set(key, []);
    outgoingEdges.get(key).push(edge);
  });

  const unusedEdges = new Set(edges.map(edge => edge.id));
  const loops = [];
  while (unusedEdges.size > 0) {
    const first = edges[unusedEdges.values().next().value];
    const vertices = [first.from];
    let edge = first;
    let closed = false;

    while (edge && unusedEdges.has(edge.id)) {
      unusedEdges.delete(edge.id);
      vertices.push(edge.to);
      if (vertexKey(edge.to.vr, edge.to.vc) === vertexKey(first.from.vr, first.from.vc)) {
        closed = true;
        break;
      }

      const candidates = (outgoingEdges.get(vertexKey(edge.to.vr, edge.to.vc)) || []).filter(candidate => unusedEdges.has(candidate.id));
      candidates.sort((a, b) => {
        const turnRank = candidate => {
          const turn = (candidate.direction - edge.direction + 4) % 4;
          return turn === 1 ? 0 : turn === 0 ? 1 : turn === 3 ? 2 : 3;
        };
        return turnRank(a) - turnRank(b);
      });
      edge = candidates[0];
    }

    if (closed) loops.push(simplifyLoop(vertices.slice(0, -1)));
  }

  const step = cellSize + gap;
  const x = vc => (vc % 2 === 0 ? (vc / 2) * step : ((vc - 1) / 2) * step + cellSize);
  const y = vr => (vr % 2 === 0 ? (vr / 2) * step : ((vr - 1) / 2) * step + cellSize);
  const toPoint = vertex => ({ x: x(vertex.vc), y: y(vertex.vr) });
  const cornerRadius = Math.max(0, Number(radius) || 0);

  return loops
    .filter(loop => loop.length >= 3)
    .map(loop => createRoundedLoop(loop, toPoint, cornerRadius))
    .join(' ');
}

export default buildBlockOutlinePath;
