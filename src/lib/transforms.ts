import type { PolygonTransform } from '@/types';

/**
 * Apply polygonTransform to vertices for SVG rendering.
 * Transform order: scale → rotate → translate
 */
export function transformVertices(
  vertices: [number, number][],
  transform: PolygonTransform,
): [number, number][] {
  const { x, y, scale, rotation } = transform;
  const cos = Math.cos(rotation);
  const sin = Math.sin(rotation);

  return vertices.map(([vx, vy]) => {
    const sx = vx * scale;
    const sy = vy * scale;
    const rx = sx * cos - sy * sin;
    const ry = sx * sin + sy * cos;
    return [rx + x, ry + y];
  });
}

/**
 * Convert vertices array to SVG polygon points string
 */
export function verticesToSvgPoints(vertices: [number, number][]): string {
  return vertices.map(([x, y]) => `${x},${y}`).join(' ');
}

/**
 * Calculate bounding box of vertices
 */
export function getBoundingBox(vertices: [number, number][]): {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
} {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const [x, y] of vertices) {
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  }

  return {
    minX,
    minY,
    maxX,
    maxY,
    width: maxX - minX,
    height: maxY - minY,
    centerX: (minX + maxX) / 2,
    centerY: (minY + maxY) / 2,
  };
}
