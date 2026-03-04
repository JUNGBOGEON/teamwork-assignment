'use client';

import { Building2 } from 'lucide-react';
import { useDrawingStore } from '@/stores/drawing-store';

export default function BuildingList() {
  const { buildings, selectedBuildingId, selectBuilding } = useDrawingStore();

  return (
    <div className="space-y-1">
      <h3 className="px-3 text-[10px] font-bold text-black uppercase tracking-[0.2em] pb-2 border-b border-black mb-2">
        건물
      </h3>
      {buildings.map((building) => {
        const isActive = building.id === selectedBuildingId;
        return (
          <button
            key={building.id}
            onClick={() => selectBuilding(building.id)}
            className={`w-full flex items-center gap-3 px-3 py-3 border-b border-black last:border-b-0 text-sm transition-all focus:outline-none ${isActive
                ? 'bg-black text-white'
                : 'text-black hover:bg-gray-100'
              }`}
          >
            <Building2
              size={18}
              strokeWidth={1.5}
              className={isActive ? 'text-white' : 'text-black'}
            />
            <div className="text-left min-w-0">
              <div className="truncate">{building.name}</div>
              <div className="text-xs font-mono tracking-wider opacity-60 mt-0.5">
                {building.disciplines.length} DISCIPLINES
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
