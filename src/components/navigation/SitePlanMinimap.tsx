'use client';

import { useDrawingStore } from '@/stores/drawing-store';
import { getDrawingUrl } from '@/lib/constants';

export default function SitePlanMinimap() {
  const { siteMap, buildings, selectedBuildingId, selectBuilding, goToSitePlan } =
    useDrawingStore();

  if (!siteMap) return null;

  return (
    <div className="space-y-1">
      <h3 className="px-3 text-[10px] font-bold text-black uppercase tracking-[0.2em] pb-2 border-b border-black mb-2 mt-2 flex justify-between items-center">
        <span>전체 배치도</span>
        <button
          onClick={goToSitePlan}
          className="hover:underline opacity-60 hover:opacity-100 transition-opacity"
        >
          [ 보기 ]
        </button>
      </h3>
      <div className="relative mx-3 border border-black bg-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={getDrawingUrl(siteMap.image)}
          alt="전체 배치도"
          className="w-full h-auto opacity-80"
          loading="lazy"
        />
        {/* Building overlays */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 4962 3508"
          preserveAspectRatio="xMidYMid meet"
        >
          {buildings.map((building) => {
            if (!building.position) return null;
            const isActive = building.id === selectedBuildingId;
            const points = building.position.vertices
              .map(([x, y]) => `${x},${y}`)
              .join(' ');
            return (
              <polygon
                key={building.id}
                points={points}
                className="cursor-pointer transition-all"
                fill={isActive ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0)'}
                stroke="black"
                strokeWidth={isActive ? 12 : 6}
                onClick={() => selectBuilding(building.id)}
              >
                <title>{building.name}</title>
              </polygon>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
