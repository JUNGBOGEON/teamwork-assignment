'use client';

import { useEffect, useCallback } from 'react';
import { useDrawingStore } from '@/stores/drawing-store';
import { useViewerStore } from '@/stores/viewer-store';

/**
 * Global keyboard shortcuts for the drawing viewer application.
 *
 * Shortcuts:
 * - Escape: Go back to site plan
 * - +/=: Zoom in
 * - -: Zoom out
 * - 0: Reset view
 * - ArrowUp/Down: Navigate revisions
 * - 1/2/3: Switch viewer mode (single/compare/overlay)
 */
export function useKeyboardShortcuts() {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (
      e.target instanceof HTMLInputElement ||
      e.target instanceof HTMLTextAreaElement ||
      e.target instanceof HTMLSelectElement
    ) {
      return;
    }

    const {
      selectedBuildingId,
      selectedDiscipline,
      selectedRegion,
      selectedRevision,
      disciplineMap,
      goToSitePlan,
      selectRevision,
    } = useDrawingStore.getState();

    const { zoomIn, zoomOut, resetView, mode, setMode } =
      useViewerStore.getState();

    switch (e.key) {
      case 'Escape':
        goToSitePlan();
        break;

      case '+':
      case '=':
        e.preventDefault();
        zoomIn();
        break;

      case '-':
        e.preventDefault();
        zoomOut();
        break;

      case '0':
        e.preventDefault();
        resetView();
        break;

      case 'ArrowUp':
      case 'ArrowDown': {
        if (mode !== 'single' || !selectedBuildingId || !selectedDiscipline)
          break;
        e.preventDefault();

        const discView = disciplineMap
          .get(selectedBuildingId)
          ?.get(selectedDiscipline);
        if (!discView) break;

        let revisions = discView.revisions;
        if (discView.hasRegions && selectedRegion) {
          const region = discView.regions.find(
            (r) => r.name === selectedRegion,
          );
          if (region) revisions = region.revisions;
        }

        const currentIdx = revisions.findIndex(
          (r) => r.version === selectedRevision,
        );
        if (currentIdx === -1) break;

        const nextIdx =
          e.key === 'ArrowUp'
            ? Math.max(0, currentIdx - 1)
            : Math.min(revisions.length - 1, currentIdx + 1);

        if (nextIdx !== currentIdx) {
          selectRevision(revisions[nextIdx].version);
        }
        break;
      }

      case '1':
        if (!e.ctrlKey && !e.metaKey) setMode('single');
        break;
      case '2':
        if (!e.ctrlKey && !e.metaKey) setMode('compare');
        break;
      case '3':
        if (!e.ctrlKey && !e.metaKey) setMode('overlay');
        break;
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
