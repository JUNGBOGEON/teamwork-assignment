'use client';

import { useDrawingStore } from '@/stores/drawing-store';

interface CurrentImage {
  image: string;
  label: string;
}

/**
 * Resolves the currently displayed image based on the selection state.
 * Handles site plan, discipline, region, and revision contexts.
 */
export function useCurrentImage(): CurrentImage {
  const {
    selectedBuildingId,
    selectedDiscipline,
    selectedRegion,
    selectedRevision,
    disciplineMap,
    siteMap,
  } = useDrawingStore();

  if (!selectedBuildingId) {
    return { image: siteMap?.image ?? '', label: '전체 배치도' };
  }

  if (!selectedDiscipline) {
    return { image: siteMap?.image ?? '', label: '전체 배치도' };
  }

  const discView = disciplineMap
    .get(selectedBuildingId)
    ?.get(selectedDiscipline);
  if (!discView) {
    return { image: siteMap?.image ?? '', label: '전체 배치도' };
  }

  if (discView.hasRegions && selectedRegion) {
    const region = discView.regions.find((r) => r.name === selectedRegion);
    const rev = region?.revisions.find((r) => r.version === selectedRevision);
    if (rev) {
      return {
        image: rev.image,
        label: `${selectedDiscipline} ${selectedRegion}구역 ${rev.version}`,
      };
    }
  } else {
    const rev = discView.revisions.find((r) => r.version === selectedRevision);
    if (rev) {
      return {
        image: rev.image,
        label: `${selectedDiscipline} ${rev.version}`,
      };
    }
  }

  return { image: siteMap?.image ?? '', label: '전체 배치도' };
}
