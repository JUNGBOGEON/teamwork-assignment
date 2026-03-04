'use client';

import { useDrawingStore } from '@/stores/drawing-store';

export default function RegionSelector() {
  const {
    selectedBuildingId,
    selectedDiscipline,
    selectedRegion,
    selectRegion,
    disciplineMap,
  } = useDrawingStore();

  if (!selectedBuildingId || !selectedDiscipline) return null;

  const discView = disciplineMap
    .get(selectedBuildingId)
    ?.get(selectedDiscipline);
  if (!discView?.hasRegions) return null;

  return (
    <div className="space-y-1">
      <h3 className="px-3 text-[10px] font-bold text-black uppercase tracking-[0.2em] pb-2 border-b border-black mb-2 mt-4">
        영역
      </h3>
      <div className="flex gap-1.5 px-2">
        {discView.regions.map((region) => {
          const isActive = region.name === selectedRegion;
          return (
            <button
              key={region.name}
              onClick={() => selectRegion(region.name)}
              className={`flex-1 px-3 py-1.5 text-[10px] font-bold tracking-wider uppercase transition-all border ${isActive
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-black border-black hover:bg-gray-100'
                }`}
            >
              {region.name}구역
            </button>
          );
        })}
      </div>
    </div>
  );
}
