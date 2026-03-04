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
  handleTouchStart: (e: React.TouchEvent) => void;
  handleTouchMove: (e: React.TouchEvent) => void;
  handleTouchEnd: (e: React.TouchEvent) => void;
  resetView: () => void;
  setZoom: (zoom: number) => void;
  transformStyle: React.CSSProperties;
}

/**
 * Encapsulates pan/zoom interaction logic for image viewers.
 * Supports mouse (wheel + drag) and touch (pinch zoom, single-finger pan, double-tap reset).
 */
export function usePanZoom(initialZoom = VIEWER_DEFAULTS.INITIAL_ZOOM): PanZoomState {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoomRaw] = useState<number>(initialZoom);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Touch state refs (avoid re-renders on rapid 60Hz+ touch events)
  const touchStartRef = useRef({ x: 0, y: 0 });
  const panStartRef = useRef({ x: 0, y: 0 });
  const pinchStartDistRef = useRef(0);
  const pinchStartZoomRef = useRef(1);
  const lastTapTimeRef = useRef(0);
  const activeTouchCountRef = useRef(0);

  const clampZoom = useCallback(
    (value: number) => Math.max(VIEWER_DEFAULTS.MIN_ZOOM, Math.min(VIEWER_DEFAULTS.MAX_ZOOM, value)),
    [],
  );

  const setZoom = useCallback(
    (value: number) => setZoomRaw(clampZoom(value)),
    [clampZoom],
  );

  const resetView = useCallback(() => {
    setZoomRaw(initialZoom);
    setPanX(0);
    setPanY(0);
  }, [initialZoom]);

  // ─── Mouse handlers ───

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -VIEWER_DEFAULTS.ZOOM_STEP : VIEWER_DEFAULTS.ZOOM_STEP;
      setZoomRaw((z) => clampZoom(z * (1 + delta)));
    },
    [clampZoom],
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

  // ─── Touch handlers ───

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      const { touches } = e;
      activeTouchCountRef.current = touches.length;

      if (touches.length === 1) {
        // Double-tap detection
        const now = Date.now();
        if (now - lastTapTimeRef.current < 300) {
          resetView();
          lastTapTimeRef.current = 0;
          return;
        }
        lastTapTimeRef.current = now;

        // Single-finger pan start
        touchStartRef.current = { x: touches[0].clientX, y: touches[0].clientY };
        panStartRef.current = { x: panX, y: panY };
        setIsDragging(true);
      } else if (touches.length === 2) {
        // Pinch zoom start — cancel any ongoing pan
        setIsDragging(false);
        pinchStartDistRef.current = Math.hypot(
          touches[1].clientX - touches[0].clientX,
          touches[1].clientY - touches[0].clientY,
        );
        pinchStartZoomRef.current = zoom;
      }
    },
    [panX, panY, zoom, resetView],
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      const { touches } = e;

      if (touches.length === 1 && activeTouchCountRef.current === 1) {
        // Single-finger pan
        setPanX(panStartRef.current.x + touches[0].clientX - touchStartRef.current.x);
        setPanY(panStartRef.current.y + touches[0].clientY - touchStartRef.current.y);
      } else if (touches.length === 2) {
        // Pinch zoom
        const dist = Math.hypot(
          touches[1].clientX - touches[0].clientX,
          touches[1].clientY - touches[0].clientY,
        );
        const newZoom = pinchStartZoomRef.current * (dist / pinchStartDistRef.current);
        setZoomRaw(clampZoom(newZoom));
      }
    },
    [clampZoom],
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      const remaining = e.touches.length;
      activeTouchCountRef.current = remaining;

      if (remaining === 0) {
        setIsDragging(false);
      } else if (remaining === 1) {
        // Pinch → pan transition: re-anchor to prevent jump
        touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        panStartRef.current = { x: panX, y: panY };
      }
    },
    [panX, panY],
  );

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
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    resetView,
    setZoom,
    transformStyle,
  };
}
