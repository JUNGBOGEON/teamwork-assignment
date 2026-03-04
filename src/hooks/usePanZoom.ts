'use client';

import { useState, useCallback, useRef } from 'react';
import { VIEWER_DEFAULTS } from '@/lib/constants';

interface PanZoomState {
  zoom: number;
  panX: number;
  panY: number;
  isDragging: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
  handleWheel: (e: React.WheelEvent) => void;
  handleMouseDown: (e: React.MouseEvent) => void;
  handleMouseMove: (e: React.MouseEvent) => void;
  handleMouseUp: () => void;
  resetView: () => void;
  setZoom: (zoom: number) => void;
  transformStyle: React.CSSProperties;
}

/**
 * Encapsulates pan/zoom mouse interaction logic for image viewers.
 * Provides event handlers, state, and a computed transform style.
 */
export function usePanZoom(initialZoom = VIEWER_DEFAULTS.INITIAL_ZOOM): PanZoomState {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoomRaw] = useState<number>(initialZoom);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const setZoom = useCallback((value: number) => {
    setZoomRaw(Math.max(VIEWER_DEFAULTS.MIN_ZOOM, Math.min(VIEWER_DEFAULTS.MAX_ZOOM, value)));
  }, []);

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -VIEWER_DEFAULTS.ZOOM_STEP : VIEWER_DEFAULTS.ZOOM_STEP;
      setZoomRaw((z) =>
        Math.max(VIEWER_DEFAULTS.MIN_ZOOM, Math.min(VIEWER_DEFAULTS.MAX_ZOOM, z * (1 + delta))),
      );
    },
    [],
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) return;
      setIsDragging(true);
      setDragStart({ x: e.clientX - panX, y: e.clientY - panY });
    },
    [panX, panY],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;
      setPanX(e.clientX - dragStart.x);
      setPanY(e.clientY - dragStart.y);
    },
    [isDragging, dragStart],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const resetView = useCallback(() => {
    setZoomRaw(initialZoom);
    setPanX(0);
    setPanY(0);
  }, [initialZoom]);

  const transformStyle: React.CSSProperties = {
    transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
    transformOrigin: 'center center',
    transition: isDragging ? 'none' : 'transform 0.1s ease-out',
  };

  return {
    zoom,
    panX,
    panY,
    isDragging,
    containerRef,
    handleWheel,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    resetView,
    setZoom,
    transformStyle,
  };
}
