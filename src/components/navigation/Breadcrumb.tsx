'use client';

import { ChevronRight, Home } from 'lucide-react';
import { useDrawingStore } from '@/stores/drawing-store';

export default function Breadcrumb() {
  const {
    project,
    selectedBuildingId,
    selectedDiscipline,
    selectedRegion,
    selectedRevision,
    buildings,
    goToSitePlan,
    selectBuilding,
    selectDiscipline,
  } = useDrawingStore();

  const building = buildings.find((b) => b.id === selectedBuildingId);

  const segments: { label: string; onClick?: () => void }[] = [];

  // Project
  segments.push({
    label: project?.name ?? '프로젝트',
    onClick: goToSitePlan,
  });

  // Site plan
  segments.push({
    label: '전체 배치도',
    onClick: goToSitePlan,
  });

  // Building
  if (building) {
    segments.push({
      label: building.name,
      onClick: () => selectBuilding(building.id),
    });
  }

  // Discipline
  if (selectedDiscipline) {
    segments.push({
      label: selectedDiscipline,
      onClick: selectedDiscipline
        ? () => selectDiscipline(selectedDiscipline)
        : undefined,
    });
  }

  // Region
  if (selectedRegion) {
    segments.push({ label: `${selectedRegion}구역` });
  }

  // Revision
  if (selectedRevision) {
    segments.push({ label: selectedRevision });
  }

  return (
    <nav className="flex items-center gap-1 text-sm text-gray-500 min-w-0 overflow-hidden">
      <button
        onClick={goToSitePlan}
        className="shrink-0 p-1 hover:text-black rounded-none transition-colors"
      >
        <Home size={14} />
      </button>
      {
        segments.map((seg, i) => {
          const isLast = i === segments.length - 1;
          return (
            <span key={i} className="flex items-center gap-1 min-w-0">
              <ChevronRight size={12} className="shrink-0 text-gray-300" />
              {isLast ? (
                <span className="font-medium text-gray-900 truncate">
                  {seg.label}
                </span>
              ) : (
                <button
                  onClick={seg.onClick}
                  className="hover:text-black truncate transition-colors"
                >
                  {seg.label}
                </button>
              )}
            </span>
          );
        })
      }
    </nav >
  );
}
