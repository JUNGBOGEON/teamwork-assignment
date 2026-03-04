'use client';

import { useDrawingStore } from '@/stores/drawing-store';
import type { RevisionView } from '@/types';

/**
 * Returns the revision list for the current selection context.
 * Handles both region-based and flat revision structures.
 */
export function useCurrentRevisions(): RevisionView[] {
  const {
    selectedBuildingId,
    selectedDiscipline,
    selectedRegion,
    disciplineMap,
  } = useDrawingStore();

  if (!selectedBuildingId || !selectedDiscipline) return [];

  const discView = disciplineMap
    .get(selectedBuildingId)
    ?.get(selectedDiscipline);
  if (!discView) return [];

  if (discView.hasRegions && selectedRegion) {
    const region = discView.regions.find((r) => r.name === selectedRegion);
    return region?.revisions ?? [];
  }

  return discView.revisions;
}
