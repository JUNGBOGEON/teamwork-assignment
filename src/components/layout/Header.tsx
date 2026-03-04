'use client';

import { Eye, Columns2, Layers } from 'lucide-react';
import { useViewerStore } from '@/stores/viewer-store';
import { useDrawingStore } from '@/stores/drawing-store';
import Breadcrumb from '@/components/navigation/Breadcrumb';
import type { ViewerMode } from '@/types';

const MODE_BUTTONS: { mode: ViewerMode; icon: typeof Eye; label: string }[] = [
  { mode: 'single', icon: Eye, label: '단일' },
  { mode: 'compare', icon: Columns2, label: '비교' },
  { mode: 'overlay', icon: Layers, label: '오버레이' },
];

export default function Header() {
  const { mode, setMode } = useViewerStore();
  const { selectedBuildingId } = useDrawingStore();

  return (
    <header className="h-14 bg-sidebar border-b border-border flex items-center justify-between px-4 shrink-0">
      <Breadcrumb />
      {selectedBuildingId && (
        <div className="flex items-center gap-1 ml-4">
          {MODE_BUTTONS.map(({ mode: m, icon: Icon, label }) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex items-center gap-1.5 px-3 py-1.5 border leading-none text-xs font-bold uppercase tracking-wider transition-all ${
                mode === m
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-black border-black hover:bg-gray-100'
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
