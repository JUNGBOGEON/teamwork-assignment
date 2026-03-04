'use client';

import { useState } from 'react';
import SearchBar from '@/components/navigation/SearchBar';
import SitePlanMinimap from '@/components/navigation/SitePlanMinimap';
import BuildingList from '@/components/navigation/BuildingList';
import DisciplineTabs from '@/components/navigation/DisciplineTabs';
import RegionSelector from '@/components/navigation/RegionSelector';
import RevisionTimeline from '@/components/navigation/RevisionTimeline';

export default function Sidebar() {
  const [searchActive, setSearchActive] = useState(false);

  return (
    <aside className="w-[300px] bg-white border-r border-black flex flex-col shrink-0 overflow-y-auto">
      <div className="p-3 space-y-4">
        <SearchBar onActiveChange={setSearchActive} />
        {!searchActive && (
          <>
            <SitePlanMinimap />
            <BuildingList />
            <DisciplineTabs />
            <RegionSelector />
            <RevisionTimeline />
          </>
        )}
      </div>
    </aside>
  );
}
