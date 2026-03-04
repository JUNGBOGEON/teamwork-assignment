'use client';

import { create } from 'zustand';
import type { ViewerMode, OverlayDiscipline, CompareStyle } from '@/types';
import { VIEWER_DEFAULTS } from '@/lib/constants';

interface ViewerState {
  // Mode
  mode: ViewerMode;

  // Pan/Zoom
  zoom: number;
  panX: number;
  panY: number;

  // Overlay
  overlayDisciplines: OverlayDiscipline[];

  // Compare
  compareLeftVersion: string | null;
  compareRightVersion: string | null;
  compareStyle: CompareStyle;

  // Compare sync
  syncPanZoom: boolean;

  // Polygon display
  showPolygons: boolean;

  // Actions
  setMode: (mode: ViewerMode) => void;
  setZoom: (zoom: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  setPan: (x: number, y: number) => void;
  resetView: () => void;

  initOverlayDisciplines: (names: string[]) => void;
  toggleOverlayDiscipline: (name: string) => void;
  setOverlayOpacity: (name: string, opacity: number) => void;

  setCompareVersions: (left: string, right: string) => void;
  setCompareStyle: (style: CompareStyle) => void;
  toggleSyncPanZoom: () => void;

  togglePolygons: () => void;
}

export const useViewerStore = create<ViewerState>((set, get) => ({
  mode: 'single',
  zoom: VIEWER_DEFAULTS.INITIAL_ZOOM,
  panX: 0,
  panY: 0,
  overlayDisciplines: [],
  compareLeftVersion: null,
  compareRightVersion: null,
  compareStyle: 'side-by-side',
  syncPanZoom: true,
  showPolygons: false,

  setMode: (mode) => set({ mode }),

  setZoom: (zoom) => {
    const clamped = Math.max(
      VIEWER_DEFAULTS.MIN_ZOOM,
      Math.min(VIEWER_DEFAULTS.MAX_ZOOM, zoom),
    );
    set({ zoom: clamped });
  },

  zoomIn: () => {
    const { zoom } = get();
    const newZoom = Math.min(
      VIEWER_DEFAULTS.MAX_ZOOM,
      zoom * (1 + VIEWER_DEFAULTS.ZOOM_STEP),
    );
    set({ zoom: newZoom });
  },

  zoomOut: () => {
    const { zoom } = get();
    const newZoom = Math.max(
      VIEWER_DEFAULTS.MIN_ZOOM,
      zoom * (1 - VIEWER_DEFAULTS.ZOOM_STEP),
    );
    set({ zoom: newZoom });
  },

  setPan: (x, y) => set({ panX: x, panY: y }),

  resetView: () =>
    set({ zoom: VIEWER_DEFAULTS.INITIAL_ZOOM, panX: 0, panY: 0 }),

  initOverlayDisciplines: (names) => {
    set({
      overlayDisciplines: names.map((name, i) => ({
        name,
        opacity: i === 0 ? 1 : 0.5,
        visible: i === 0,
      })),
    });
  },

  toggleOverlayDiscipline: (name) => {
    const { overlayDisciplines } = get();
    set({
      overlayDisciplines: overlayDisciplines.map((d) =>
        d.name === name ? { ...d, visible: !d.visible } : d,
      ),
    });
  },

  setOverlayOpacity: (name, opacity) => {
    const { overlayDisciplines } = get();
    set({
      overlayDisciplines: overlayDisciplines.map((d) =>
        d.name === name ? { ...d, opacity } : d,
      ),
    });
  },

  setCompareVersions: (left, right) =>
    set({ compareLeftVersion: left, compareRightVersion: right }),

  setCompareStyle: (style) => set({ compareStyle: style }),

  toggleSyncPanZoom: () => set((s) => ({ syncPanZoom: !s.syncPanZoom })),

  togglePolygons: () => set((s) => ({ showPolygons: !s.showPolygons })),
}));
