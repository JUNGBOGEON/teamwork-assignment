'use client';

import { useMemo } from 'react';
import { useDrawingStore } from '@/stores/drawing-store';
import { DISCIPLINE_COLORS } from '@/lib/constants';
import { transformVertices } from '@/lib/transforms';

export interface PolygonLayer {
  id: string;
  vertices: [number, number][];
  label: string;
  isActive: boolean;
  color: string;
}

/**
 * Resolves the polygon layers to display for the current selection context.
 *
 * - Discipline with polygon → single polygon
 * - Discipline with regions → all region polygons, selected one highlighted
 * - Revision with its own polygon → that revision's polygon
 * - No polygon → empty array
 */
export function useCurrentPolygons(): PolygonLayer[] {
  const {
    selectedBuildingId,
    selectedDiscipline,
    selectedRegion,
    selectedRevision,
    disciplineMap,
  } = useDrawingStore();

  return useMemo(() => {
    if (!selectedBuildingId || !selectedDiscipline) return [];

    const discView = disciplineMap
      .get(selectedBuildingId)
      ?.get(selectedDiscipline);
    if (!discView) return [];

    const color = DISCIPLINE_COLORS[selectedDiscipline] ?? '#6B7280';
    const layers: PolygonLayer[] = [];

    // Case 1: Discipline has regions (e.g., 101동 구조 A/B)
    if (discView.hasRegions && discView.regions.length > 0) {
      for (const region of discView.regions) {
        const transformed = transformVertices(
          region.polygon.vertices,
          region.polygon.transform,
        );
        layers.push({
          id: `region-${region.name}`,
          vertices: transformed,
          label: `${region.name}`,
          isActive: region.name === selectedRegion,
          color,
        });
      }
      return layers;
    }

    // Case 2: Current revision has its own polygon (e.g., 주민공동시설 건축 REV1-3)
    if (selectedRevision) {
      const rev = discView.revisions.find(
        (r) => r.version === selectedRevision,
      );
      if (rev?.polygon) {
        const transformed = transformVertices(
          rev.polygon.vertices,
          rev.polygon.transform,
        );
        layers.push({
          id: `rev-${rev.version}`,
          vertices: transformed,
          label: rev.version,
          isActive: true,
          color,
        });
        return layers;
      }
    }

    // Case 3: Discipline-level polygon (e.g., 101동 건축/공조설비/배관설비/소방)
    if (discView.polygon) {
      const transformed = transformVertices(
        discView.polygon.vertices,
        discView.polygon.transform,
      );
      layers.push({
        id: `disc-${discView.name}`,
        vertices: transformed,
        label: discView.name,
        isActive: true,
        color,
      });
      return layers;
    }

    return [];
  }, [
    selectedBuildingId,
    selectedDiscipline,
    selectedRegion,
    selectedRevision,
    disciplineMap,
  ]);
}
