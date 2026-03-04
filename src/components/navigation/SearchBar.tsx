'use client';

import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { useDrawingStore } from '@/stores/drawing-store';
import { useDrawingSearch, type SearchResult } from '@/hooks/useDrawingSearch';
import { DISCIPLINE_COLORS } from '@/lib/constants';

interface SearchBarProps {
  onActiveChange: (active: boolean) => void;
}

export default function SearchBar({ onActiveChange }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const results = useDrawingSearch(query);
  const { selectBuilding, selectDiscipline, selectRegion, selectRevision } =
    useDrawingStore();

  const isActive = query.trim().length > 0;

  const handleChange = (value: string) => {
    setQuery(value);
    onActiveChange(value.trim().length > 0);
  };

  const handleClear = () => {
    setQuery('');
    onActiveChange(false);
  };

  const handleSelect = (result: SearchResult) => {
    selectBuilding(result.buildingId);
    selectDiscipline(result.disciplineName);
    if (result.regionName) {
      selectRegion(result.regionName);
    }
    selectRevision(result.version);
    handleClear();
  };

  return (
    <div>
      {/* Search input */}
      <div className="relative">
        <Search
          size={14}
          className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="공종, 버전, 날짜 검색..."
          className="w-full pl-8 pr-8 py-2 text-xs border border-black bg-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-black"
        />
        {isActive && (
          <button
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Search results */}
      {isActive && (
        <div className="mt-2 space-y-0.5">
          {results.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-4">
              검색 결과 없음
            </p>
          ) : (
            <>
              <p className="text-[10px] text-gray-400 mb-1">
                {results.length}건
              </p>
              {results.map((r) => {
                const color = DISCIPLINE_COLORS[r.disciplineName] ?? '#6B7280';
                return (
                  <button
                    key={r.id}
                    onClick={() => handleSelect(r)}
                    className="w-full text-left px-2 py-2 border border-transparent hover:border-black hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-1.5 h-1.5 shrink-0 border border-black"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-[11px] font-medium text-black truncate">
                        {r.buildingName}
                      </span>
                      <span className="text-[10px] text-gray-400 shrink-0">
                        {r.disciplineName}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5 pl-3">
                      <span className="text-[10px] font-mono font-bold text-black">
                        {r.version}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {r.dateString}
                      </span>
                      {r.regionName && (
                        <span className="text-[9px] px-1 border border-black/20 text-gray-500">
                          {r.regionName}
                        </span>
                      )}
                    </div>
                    {r.description && (
                      <p className="text-[10px] text-gray-500 mt-0.5 pl-3 truncate">
                        {r.description}
                      </p>
                    )}
                  </button>
                );
              })}
            </>
          )}
        </div>
      )}
    </div>
  );
}
