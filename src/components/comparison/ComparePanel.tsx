'use client';

import { useRef } from 'react';
import { getDrawingUrl } from '@/lib/constants';
import { usePanZoom } from '@/hooks/usePanZoom';
import type { RevisionView } from '@/types';

export interface PanZoomHandlers {
  handleWheel: (e: React.WheelEvent) => void;
  handleMouseDown: (e: React.MouseEvent) => void;
  handleMouseMove: (e: React.MouseEvent) => void;
  handleMouseUp: () => void;
  handleTouchStart: (e: React.TouchEvent) => void;
  handleTouchMove: (e: React.TouchEvent) => void;
  handleTouchEnd: (e: React.TouchEvent) => void;
  transformStyle: React.CSSProperties;
}

interface ComparePanelProps {
  rev: RevisionView;
  label: string;
  sharedPanZoom?: PanZoomHandlers;
}

export default function ComparePanel({ rev, label, sharedPanZoom }: ComparePanelProps) {
  const localRef = useRef<HTMLDivElement>(null);
  const localPanZoom = usePanZoom();

  const {
    handleWheel,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    transformStyle,
  } = sharedPanZoom ?? localPanZoom;

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="h-7 bg-gray-50 flex items-center justify-center gap-2 text-xs">
        <span className="font-medium text-gray-600">{label}</span>
        <span className="text-gray-400">
          {rev.version} · {rev.dateString}
        </span>
      </div>
      <div
        ref={localRef}
        className="flex-1 relative overflow-hidden bg-gray-100 cursor-grab active:cursor-grabbing"
        style={{ touchAction: 'none' }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
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
