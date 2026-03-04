'use client';

import { getDrawingUrl } from '@/lib/constants';
import { usePanZoom } from '@/hooks/usePanZoom';
import type { RevisionView } from '@/types';

interface ComparePanelProps {
  rev: RevisionView;
  label: string;
}

export default function ComparePanel({ rev, label }: ComparePanelProps) {
  const {
    containerRef,
    handleWheel,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    transformStyle,
  } = usePanZoom();

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="h-7 bg-gray-50 flex items-center justify-center gap-2 text-xs">
        <span className="font-medium text-gray-600">{label}</span>
        <span className="text-gray-400">
          {rev.version} · {rev.dateString}
        </span>
      </div>
      <div
        ref={containerRef}
        className="flex-1 relative overflow-hidden bg-gray-100 cursor-grab active:cursor-grabbing"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={transformStyle}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={getDrawingUrl(rev.image)}
            alt={`${rev.version}`}
            className="max-w-none select-none"
            draggable={false}
          />
        </div>
      </div>
    </div>
  );
}
