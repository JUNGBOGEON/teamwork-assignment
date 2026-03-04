'use client';

import { useDrawingStore } from '@/stores/drawing-store';
import { useViewerStore } from '@/stores/viewer-store';
import { DISCIPLINE_COLORS } from '@/lib/constants';

export default function StatusBar() {
  const {
    selectedBuildingId,
    selectedDiscipline,
    selectedRevision,
    selectedRegion,
    disciplineMap,
  } = useDrawingStore();
  const { zoom } = useViewerStore();

  let filename = '';
  let date = '';

  if (selectedBuildingId && selectedDiscipline) {
    const discView = disciplineMap
      .get(selectedBuildingId)
      ?.get(selectedDiscipline);
    if (discView) {
      if (discView.hasRegions && selectedRegion) {
        const region = discView.regions.find((r) => r.name === selectedRegion);
        const rev = region?.revisions.find(
          (r) => r.version === selectedRevision,
        );
        filename = rev?.image ?? '';
        date = rev?.dateString ?? '';
      } else {
        const rev = discView.revisions.find(
          (r) => r.version === selectedRevision,
        );
        filename = rev?.image ?? discView.image ?? '';
        date = rev?.dateString ?? '';
      }
    }
  }

  const discColor = selectedDiscipline
    ? DISCIPLINE_COLORS[selectedDiscipline]
    : undefined;

  return (
    <footer className="h-8 bg-white border-t border-black flex items-center justify-between px-4 text-[10px] uppercase font-bold tracking-wider text-black gap-4 shrink-0">
      <div className="flex items-center gap-4">
        {selectedDiscipline && (
          <span className="flex items-center gap-1.5 border border-black px-1.5 py-0.5 leading-none">
            <span
              className="w-2 h-2"
              style={{ backgroundColor: discColor }}
            />
            {selectedDiscipline}
          </span>
        )}
        {filename && <span className="truncate max-w-[300px]">{filename}</span>}
      </div>
      <div className="flex items-center gap-4 border-l border-black pl-4 h-full">
        <span>ZOOM: {Math.round(zoom * 100)}%</span>
        {date && <span className="border-l border-black pl-4 h-full flex items-center">{date}</span>}
      </div>
    </footer>
  );
}
