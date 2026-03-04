'use client';

import { useMemo } from 'react';
import { useDrawingStore } from '@/stores/drawing-store';
import { useViewerStore } from '@/stores/viewer-store';
import type { DisciplineView, ImageTransform } from '@/types';
import {
  computeRelativeTransform,
  IDENTITY_TRANSFORM,
  type CSSTransform2D,
} from '@/lib/image-transforms';

export interface OverlayLayerInfo {
  name: string;
  image: string;
  opacity: number;
  isBase: boolean;
  cssTransform: CSSTransform2D;
}

/**
 * Resolves the effective image and imageTransform for a discipline.
 * Revision-level transform takes precedence over discipline-level.
 */
function resolveImageAndTransform(
  disc: DisciplineView,
): { image: string; transform: ImageTransform | undefined } | null {
  if (disc.image) {
    return { image: disc.image, transform: disc.imageTransform };
  }

  if (disc.latestRevision) {
    return {
      image: disc.latestRevision.image,
      transform: disc.latestRevision.imageTransform ?? disc.imageTransform,
    };
  }

  if (disc.hasRegions && disc.regions.length > 0) {
    const rev = disc.regions[0].latestRevision;
    if (rev) {
      return {
        image: rev.image,
        transform: rev.imageTransform ?? disc.imageTransform,
      };
    }
  }

  return null;
}

/**
 * Computes aligned overlay layer info for all visible disciplines.
 * The first visible discipline with a transform is treated as the base (identity).
 */
export function useOverlayTransforms(): OverlayLayerInfo[] {
  const { selectedBuildingId, disciplineMap } = useDrawingStore();
  const { overlayDisciplines } = useViewerStore();

  return useMemo(() => {
    if (!selectedBuildingId) return [];

    const discMap = disciplineMap.get(selectedBuildingId);
    if (!discMap) return [];

    const resolved: Array<{
      name: string;
      image: string;
      opacity: number;
      transform: ImageTransform | undefined;
    }> = [];

    for (const disc of discMap.values()) {
      const overlayDisc = overlayDisciplines.find((d) => d.name === disc.name);
      if (!overlayDisc?.visible) continue;

      const result = resolveImageAndTransform(disc);
      if (!result) continue;

      resolved.push({
        name: disc.name,
        image: result.image,
        opacity: overlayDisc.opacity,
        transform: result.transform,
      });
    }

    if (resolved.length === 0) return [];

    // First visible discipline with a transform = base
    const baseIdx = resolved.findIndex((r) => r.transform != null);
    const baseTransform = baseIdx >= 0 ? resolved[baseIdx].transform! : undefined;

    return resolved.map((r, i) => {
      let cssTransform: CSSTransform2D;

      if (!baseTransform || !r.transform) {
        cssTransform = IDENTITY_TRANSFORM;
      } else if (i === baseIdx) {
        cssTransform = IDENTITY_TRANSFORM;
      } else {
        cssTransform = computeRelativeTransform(baseTransform, r.transform);
      }

      return {
        name: r.name,
        image: r.image,
        opacity: r.opacity,
        isBase: i === baseIdx || baseTransform == null,
        cssTransform,
      };
    });
  }, [selectedBuildingId, disciplineMap, overlayDisciplines]);
}
