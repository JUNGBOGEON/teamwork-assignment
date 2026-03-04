'use client';

import { useDrawingStore } from '@/stores/drawing-store';
import { useViewerStore } from '@/stores/viewer-store';
import { getDrawingUrl, DISCIPLINE_COLORS } from '@/lib/constants';
import { usePanZoom } from '@/hooks/usePanZoom';
import { useOverlayTransforms } from '@/hooks/useOverlayTransforms';
import { toCSSTransformString } from '@/lib/image-transforms';
import ViewerControls from './ViewerControls';

export default function OverlayComposite() {
  const { selectedBuildingId, disciplineMap } = useDrawingStore();
  const { overlayDisciplines, toggleOverlayDiscipline, setOverlayOpacity } =
    useViewerStore();

  const {
    containerRef,
    handleWheel,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    transformStyle: panZoomStyle,
  } = usePanZoom();

  const layers = useOverlayTransforms();

  if (!selectedBuildingId) return null;

  const discMap = disciplineMap.get(selectedBuildingId);
  if (!discMap) return null;

  const disciplines = Array.from(discMap.values());

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex-1 flex min-h-0">
        {/* Overlay viewer with pan/zoom */}
        <div
          ref={containerRef}
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
            style={panZoomStyle}
          >
            {layers.map((layer) => {
              const layerTransform = toCSSTransformString(layer.cssTransform);

              return (
                <div
                  key={layer.name}
                  className="absolute"
                  style={{
                    opacity: layer.opacity,
                    mixBlendMode: 'multiply',
                    transform: layerTransform !== 'none' ? layerTransform : undefined,
                    transformOrigin: 'center center',
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getDrawingUrl(layer.image)}
                    alt={layer.name}
                    className="max-w-none select-none"
                    draggable={false}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Overlay control panel */}
        <div className="w-56 bg-white border-l border-black p-4 space-y-4 overflow-y-auto">
          <h3 className="text-[10px] font-bold text-black uppercase tracking-[0.2em] pb-2 border-b border-black">
            오버레이 공종
          </h3>
          {disciplines.map((disc) => {
            const overlayDisc = overlayDisciplines.find(
              (d) => d.name === disc.name,
            );
            const color = DISCIPLINE_COLORS[disc.name] ?? '#6B7280';

            return (
              <div key={disc.name} className="space-y-1.5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={overlayDisc?.visible ?? false}
                    onChange={() => toggleOverlayDiscipline(disc.name)}
                    className="rounded-none border-black focus:ring-black accent-black"
                  />
                  <span
                    className="w-2.5 h-2.5 border border-black"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs font-medium text-gray-700">
                    {disc.name}
                  </span>
                </label>
                {overlayDisc?.visible && (
                  <div className="flex items-center gap-2 pl-6">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={overlayDisc.opacity}
                      onChange={(e) =>
                        setOverlayOpacity(disc.name, parseFloat(e.target.value))
                      }
                      className="flex-1 h-0.5 accent-black bg-black"
                    />
                    <span className="text-[10px] font-mono font-bold text-black w-8">
                      {Math.round((overlayDisc?.opacity ?? 0) * 100)}%
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <ViewerControls />
    </div>
  );
}
