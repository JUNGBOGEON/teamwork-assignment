'use client';

import { useMemo } from 'react';
import { useDrawingStore } from '@/stores/drawing-store';

export interface SearchResult {
  id: string;
  buildingId: string;
  buildingName: string;
  disciplineName: string;
  regionName?: string;
  version: string;
  date: Date;
  dateString: string;
  description: string;
  matchContext: string;
}

/**
 * Searches across all buildings, disciplines, and revisions.
 * Returns flat list of matching revisions with navigation context.
 */
export function useDrawingSearch(query: string): SearchResult[] {
  const { buildings, disciplineMap } = useDrawingStore();

  return useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const results: SearchResult[] = [];

    for (const building of buildings) {
      const discMap = disciplineMap.get(building.id);
      if (!discMap) continue;

      const buildingNameLower = building.name.toLowerCase();

      for (const [discName, disc] of discMap) {
        const discNameLower = discName.toLowerCase();

        const addRevision = (
          rev: { version: string; date: Date; dateString: string; description: string },
          regionName?: string,
        ) => {
          const fields = [
            buildingNameLower,
            discNameLower,
            rev.version.toLowerCase(),
            rev.dateString,
            rev.description.toLowerCase(),
            regionName?.toLowerCase() ?? '',
          ];

          const matchIdx = fields.findIndex((f) => f.includes(q));
          if (matchIdx === -1) return;

          const contextLabels = ['건물', '공종', '버전', '날짜', '설명', '영역'];
          results.push({
            id: `${building.id}-${discName}-${regionName ?? ''}-${rev.version}`,
            buildingId: building.id,
            buildingName: building.name,
            disciplineName: discName,
            regionName,
            version: rev.version,
            date: rev.date,
            dateString: rev.dateString,
            description: rev.description,
            matchContext: contextLabels[matchIdx],
          });
        };

        if (disc.hasRegions) {
          for (const region of disc.regions) {
            for (const rev of region.revisions) {
              addRevision(rev, region.name);
            }
          }
        } else {
          for (const rev of disc.revisions) {
            addRevision(rev);
          }
        }
      }
    }

    return results;
  }, [query, buildings, disciplineMap]);
}
