'use client';

import { Link, Unlink } from 'lucide-react';
import { useViewerStore } from '@/stores/viewer-store';
import { useCurrentRevisions } from '@/hooks/useCurrentRevisions';
import { usePanZoom } from '@/hooks/usePanZoom';
import SliderCompare from './SliderCompare';
import ComparePanel from './ComparePanel';
import type { PanZoomHandlers } from './ComparePanel';

export default function ComparisonView() {
  const {
    compareLeftVersion,
    compareRightVersion,
    compareStyle,
    syncPanZoom,
    setCompareVersions,
    setCompareStyle,
    toggleSyncPanZoom,
  } = useViewerStore();

  const revisions = useCurrentRevisions();

  // Shared pan/zoom instance for synchronized mode
  const sharedPz = usePanZoom();
  const sharedHandlers: PanZoomHandlers = {
    handleWheel: sharedPz.handleWheel,
    handleMouseDown: sharedPz.handleMouseDown,
    handleMouseMove: sharedPz.handleMouseMove,
    handleMouseUp: sharedPz.handleMouseUp,
    handleTouchStart: sharedPz.handleTouchStart,
    handleTouchMove: sharedPz.handleTouchMove,
    handleTouchEnd: sharedPz.handleTouchEnd,
    transformStyle: sharedPz.transformStyle,
  };

  if (revisions.length < 2) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        <p>비교할 리비전이 2개 이상 필요합니다</p>
      </div>
    );
  }

  // Auto-select comparison versions if not set
  const left = compareLeftVersion ?? revisions[0]?.version;
  const right = compareRightVersion ?? revisions[revisions.length - 1]?.version;

  const leftRev = revisions.find((r) => r.version === left);
  const rightRev = revisions.find((r) => r.version === right);

  if (!leftRev || !rightRev) return null;

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Comparison controls */}
      <div className="h-10 bg-white border-b border-border flex items-center justify-center gap-3 px-4">
        <select
          value={left}
          onChange={(e) => setCompareVersions(e.target.value, right)}
          className="text-xs border border-gray-200 rounded px-2 py-1"
        >
          {revisions.map((r) => (
            <option key={r.version} value={r.version}>
              {r.version} ({r.dateString})
            </option>
          ))}
        </select>
        <span className="text-xs text-gray-400">vs</span>
        <select
          value={right}
          onChange={(e) => setCompareVersions(left, e.target.value)}
          className="text-xs border border-gray-200 rounded px-2 py-1"
        >
          {revisions.map((r) => (
            <option key={r.version} value={r.version}>
              {r.version} ({r.dateString})
            </option>
          ))}
        </select>
        <div className="w-px h-4 bg-gray-200 mx-1" />
        <button
          onClick={() => setCompareStyle('side-by-side')}
          className={`text-xs px-2 py-1 rounded ${
            compareStyle === 'side-by-side'
              ? 'bg-accent text-white'
              : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          나란히
        </button>
        <button
          onClick={() => setCompareStyle('slider')}
          className={`text-xs px-2 py-1 rounded ${
            compareStyle === 'slider'
              ? 'bg-accent text-white'
              : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          슬라이더
        </button>
        {compareStyle === 'side-by-side' && (
          <>
            <div className="w-px h-4 bg-gray-200 mx-1" />
            <button
              onClick={toggleSyncPanZoom}
              className={`flex items-center gap-1 text-xs px-2 py-1 rounded ${
                syncPanZoom
                  ? 'bg-accent text-white'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
              title={syncPanZoom ? '팬/줌 동기화 해제' : '팬/줌 동기화'}
            >
              {syncPanZoom ? <Link size={12} /> : <Unlink size={12} />}
              <span>동기화</span>
            </button>
          </>
        )}
      </div>

      {/* Comparison content */}
      {compareStyle === 'slider' ? (
        <SliderCompare leftImage={leftRev.image} rightImage={rightRev.image} leftLabel={leftRev.version} rightLabel={rightRev.version} />
      ) : (
        <div className="flex-1 flex min-h-0">
          <ComparePanel
            rev={leftRev}
            label="이전"
            sharedPanZoom={syncPanZoom ? sharedHandlers : undefined}
          />
          <div className="w-px bg-border" />
          <ComparePanel
            rev={rightRev}
            label="이후"
            sharedPanZoom={syncPanZoom ? sharedHandlers : undefined}
          />
        </div>
      )}
    </div>
  );
}
