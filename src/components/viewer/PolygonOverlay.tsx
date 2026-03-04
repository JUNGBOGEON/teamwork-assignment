'use client';

import { useState } from 'react';
import { useViewerStore } from '@/stores/viewer-store';
import { useCurrentPolygons } from '@/hooks/useCurrentPolygons';
import { verticesToSvgPoints } from '@/lib/transforms';

interface PolygonOverlayProps {
  imageWidth: number;
  imageHeight: number;
}

/**
 * Renders SVG polygon overlays on top of the drawing image.
 * Uses the same coordinate system as the image (viewBox = image dimensions).
 * Must be placed inside the same pan/zoom container as the image.
 */
export default function PolygonOverlay({
  imageWidth,
  imageHeight,
}: PolygonOverlayProps) {
  const showPolygons = useViewerStore((s) => s.showPolygons);
  const layers = useCurrentPolygons();

  if (!showPolygons || layers.length === 0 || !imageWidth || !imageHeight) {
    return null;
  }

  return (
    <svg
      className="absolute top-0 left-0 pointer-events-none"
      width={imageWidth}
      height={imageHeight}
      viewBox={`0 0 ${imageWidth} ${imageHeight}`}
    >
      {layers.map((layer) => (
        <PolygonShape key={layer.id} layer={layer} />
      ))}
    </svg>
  );
}

function PolygonShape({
  layer,
}: {
  layer: {
    id: string;
    vertices: [number, number][];
    label: string;
    isActive: boolean;
    color: string;
  };
}) {
  const [hovered, setHovered] = useState(false);
  const points = verticesToSvgPoints(layer.vertices);

  // Calculate label position (centroid)
  const cx =
    layer.vertices.reduce((sum, [x]) => sum + x, 0) / layer.vertices.length;
  const cy =
    layer.vertices.reduce((sum, [, y]) => sum + y, 0) / layer.vertices.length;

  return (
    <g
      className="pointer-events-auto"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <polygon
        points={points}
        fill={
          layer.isActive
            ? `${layer.color}18`
            : hovered
              ? `${layer.color}10`
              : 'none'
        }
        stroke={layer.color}
        strokeWidth={layer.isActive ? 4 : 2}
        strokeDasharray={layer.isActive ? 'none' : '12 6'}
        className="transition-all duration-150"
      />
      {(layer.isActive || hovered) && (
        <text
          x={cx}
          y={cy}
          textAnchor="middle"
          dominantBaseline="central"
          fill={layer.color}
          fontSize={28}
          fontWeight="bold"
          className="select-none"
        >
          {layer.label}
        </text>
      )}
    </g>
  );
}
