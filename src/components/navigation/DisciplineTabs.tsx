'use client';

import { useDrawingStore } from '@/stores/drawing-store';
import { DISCIPLINE_COLORS } from '@/lib/constants';

export default function DisciplineTabs() {
  const {
    selectedBuildingId,
    selectedDiscipline,
    selectDiscipline,
    getDisciplinesForBuilding,
  } = useDrawingStore();

  if (!selectedBuildingId) return null;

  const disciplines = getDisciplinesForBuilding(selectedBuildingId);
  if (disciplines.length === 0) return null;

  return (
    <div className="space-y-1">
      <h3 className="px-3 text-[10px] font-bold text-black uppercase tracking-[0.2em] pb-2 border-b border-black mb-2 mt-4">
        공종
      </h3>
      <div className="flex flex-wrap gap-1.5 px-2">
        {disciplines.map((disc) => {
          const isActive = disc.name === selectedDiscipline;
          const color = DISCIPLINE_COLORS[disc.name] ?? '#6B7280';
          return (
            <button
              key={disc.name}
              onClick={() => selectDiscipline(disc.name)}
              className={`px-3 py-1.5 text-[10px] font-bold tracking-wider uppercase transition-all border ${isActive
                  ? 'border-black'
                  : 'bg-white border-black text-black hover:bg-gray-100'
                }`}
              style={
                isActive
                  ? {
                    backgroundColor: color,
                    color: '#fff',
                  }
                  : {}
              }
            >
              {disc.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
