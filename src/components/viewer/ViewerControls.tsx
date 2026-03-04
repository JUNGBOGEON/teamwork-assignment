'use client';

import { ZoomIn, ZoomOut, Maximize, Hexagon } from 'lucide-react';
import { useViewerStore } from '@/stores/viewer-store';

export default function ViewerControls() {
  const { zoom, zoomIn, zoomOut, resetView, showPolygons, togglePolygons } =
    useViewerStore();

  return (
    <div className="h-10 border-t border-black bg-white flex items-center justify-center gap-2 px-4 shadow-[0_-1px_0_0_rgba(0,0,0,1)]">
      <button
        onClick={zoomOut}
        className="p-1.5 border border-black hover:bg-black hover:text-white text-black transition-colors"
        title="축소"
      >
        <ZoomOut size={16} strokeWidth={1.5} />
      </button>
      <span className="w-16 text-center text-xs text-black font-bold font-mono tracking-wider">
        {Math.round(zoom * 100)}%
      </span>
      <button
        onClick={zoomIn}
        className="p-1.5 border border-black hover:bg-black hover:text-white text-black transition-colors"
        title="확대"
      >
        <ZoomIn size={16} strokeWidth={1.5} />
      </button>
      <div className="w-px h-6 bg-black mx-2" />
      <button
        onClick={resetView}
        className="p-1.5 border border-black hover:bg-black hover:text-white text-black transition-colors"
        title="화면 맞춤"
      >
        <Maximize size={16} strokeWidth={1.5} />
      </button>
      <div className="w-px h-6 bg-black mx-2" />
      <button
        onClick={togglePolygons}
        className={`p-1.5 border border-black transition-colors ${
          showPolygons
            ? 'bg-black text-white'
            : 'hover:bg-black hover:text-white text-black'
        }`}
        title="폴리곤 표시"
      >
        <Hexagon size={16} strokeWidth={1.5} />
      </button>
    </div>
  );
}
