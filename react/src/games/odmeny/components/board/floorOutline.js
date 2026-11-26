function vertexKey(vertex) {
  return `${vertex.r},${vertex.c}`;
}

function direction(from, to) {
  if (to.c > from.c) return 0;
  if (to.r > from.r) return 1;
  if (to.c < from.c) return 2;
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

function pointString(point, shift) {
  return `${formatNumber(point.x + shift)} ${formatNumber(point.y + shift)}`;
}

function createRoundedLoop(vertices, toPoint, offset, radius, shift) {
  const points = vertices.map(toPoint);
  const shiftedPoints = points.map((point, index) => {
    const previous = points[(index + points.length - 1) % points.length];
    const next = points[(index + 1) % points.length];
    const incoming = { x: Math.sign(point.x - previous.x), y: Math.sign(point.y - previous.y) };
    const outgoing = { x: Math.sign(next.x - point.x), y: Math.sign(next.y - point.y) };
    const previousNormal = { x: incoming.y, y: -incoming.x };
    const nextNormal = { x: outgoing.y, y: -outgoing.x };
    return {
      point: {
        x: point.x + (previousNormal.x + nextNormal.x) * offset,
        y: point.y + (previousNormal.y + nextNormal.y) * offset
      },
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

  const commands = [`M ${pointString(corners[0].end, shift)}`];
  for (let index = 1; index < corners.length; index += 1) {
    const corner = corners[index];
    commands.push(`L ${pointString(corner.start, shift)}`);
    if (corner.radius > 0) {
      const turn = corner.incoming.x * corner.outgoing.y - corner.incoming.y * corner.outgoing.x;
      commands.push(`A ${formatNumber(corner.radius)} ${formatNumber(corner.radius)} 0 0 ${turn > 0 ? 1 : 0} ${pointString(corner.end, shift)}`);
    } else {
      commands.push(`L ${pointString(corner.end, shift)}`);
    }
  }

  const firstCorner = corners[0];
  commands.push(`L ${pointString(firstCorner.start, shift)}`);
  if (firstCorner.radius > 0) {
    const turn = firstCorner.incoming.x * firstCorner.outgoing.y - firstCorner.incoming.y * firstCorner.outgoing.x;
    commands.push(`A ${formatNumber(firstCorner.radius)} ${formatNumber(firstCorner.radius)} 0 0 ${turn > 0 ? 1 : 0} ${pointString(firstCorner.end, shift)}`);
  } else {
    commands.push(`L ${pointString(firstCorner.end, shift)}`);
  }
  commands.push('Z');
  return commands.join(' ');
}

export function buildFloorOutlinePath({ width, height, walls = [], cellSize, gap, padding, strokeWidth, radius }) {
  if (!width || !height || !cellSize || !Number.isFinite(gap) || !Number.isFinite(padding) || !Number.isFinite(strokeWidth)) return '';

  const wallKeys = new Set((Array.isArray(walls) ? walls : []).map(({ r, c }) => `${r},${c}`));
  const isFloor = (r, c) => r >= 0 && r < height && c >= 0 && c < width && !wallKeys.has(`${r},${c}`);
  const edges = [];

  const addEdge = (from, to) => edges.push({ from, to, direction: direction(from, to) });

  for (let r = 0; r < height; r += 1) {
    for (let c = 0; c < width; c += 1) {
      if (!isFloor(r, c)) continue;
      if (!isFloor(r - 1, c)) addEdge({ r, c }, { r, c: c + 1 });
      if (!isFloor(r, c + 1)) addEdge({ r, c: c + 1 }, { r: r + 1, c: c + 1 });
      if (!isFloor(r + 1, c)) addEdge({ r: r + 1, c: c + 1 }, { r: r + 1, c });
      if (!isFloor(r, c - 1)) addEdge({ r: r + 1, c }, { r, c });
    }
  }

  const outgoingEdges = new Map();
  edges.forEach((edge, index) => {
    edge.id = index;
    const key = vertexKey(edge.from);
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
      if (vertexKey(edge.to) === vertexKey(first.from)) {
        closed = true;
        break;
      }

      const candidates = (outgoingEdges.get(vertexKey(edge.to)) || []).filter(candidate => unusedEdges.has(candidate.id));
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
  const x = c => padding + (c === width ? width * cellSize + (width - 1) * gap : c * step);
  const y = r => padding + (r === height ? height * cellSize + (height - 1) * gap : r * step);
  const toPoint = vertex => ({ x: x(vertex.c), y: y(vertex.r) });
  const offset = padding + strokeWidth / 2;
  const cornerRadius = Math.max(0, Number(radius) || 0);

  return loops
    .filter(loop => loop.length >= 4)
    .map(loop => createRoundedLoop(loop, toPoint, offset, cornerRadius, strokeWidth))
    .join(' ');
}

export default buildFloorOutlinePath;