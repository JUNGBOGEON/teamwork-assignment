'use client';

import { useEffect, useState, useRef } from 'react';
import { useDrawingStore } from '@/stores/drawing-store';
import { useViewerStore } from '@/stores/viewer-store';
import { getDrawingUrl } from '@/lib/constants';
import { usePanZoom } from '@/hooks/usePanZoom';
import { useCurrentImage } from '@/hooks/useCurrentImage';
import ViewerControls from './ViewerControls';
import PolygonOverlay from './PolygonOverlay';
import ComparisonView from '@/components/comparison/ComparisonView';
import OverlayComposite from './OverlayComposite';
import { MapPin } from 'lucide-react';

export default function DrawingViewer() {
  const { mode, initOverlayDisciplines } = useViewerStore();
  const { selectedBuildingId, disciplineMap } =
    useDrawingStore();

  // Init overlay disciplines when building changes
  useEffect(() => {
    if (selectedBuildingId) {
      const discMap = disciplineMap.get(selectedBuildingId);
      if (discMap) {
        initOverlayDisciplines(Array.from(discMap.keys()));
      }
    }
  }, [selectedBuildingId, disciplineMap, initOverlayDisciplines]);

  if (mode === 'compare' && selectedBuildingId) {
    return <ComparisonView />;
  }

  if (mode === 'overlay' && selectedBuildingId) {
    return <OverlayComposite />;
  }

  return <SingleViewer />;
}

function SingleViewer() {
  const { image: currentImage, label: imageLabel } = useCurrentImage();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const {
    containerRef,
    isDragging,
    handleWheel,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    resetView,
    transformStyle,
  } = usePanZoom();

  // Reset view and image loaded state when image changes
  const prevImageRef = useRef(currentImage);
  if (prevImageRef.current !== currentImage) {
    prevImageRef.current = currentImage;
    setImageLoaded(false);
    setImageSize({ width: 0, height: 0 });
  }

  useEffect(() => {
    resetView();
  }, [currentImage, resetView]);

  if (!currentImage) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        <div className="text-center">
          <MapPin size={48} className="mx-auto mb-3 opacity-30" />
          <p>도면을 선택해주세요</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div
        ref={containerRef}
        className="flex-1 relative overflow-hidden bg-gray-100 cursor-grab active:cursor-grabbing"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div className="absolute inset-0 flex items-center justify-center" style={transformStyle}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={getDrawingUrl(currentImage)}
            alt={imageLabel}
            className={`max-w-none select-none transition-opacity ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            draggable={false}
            onLoad={(e) => {
              const img = e.currentTarget;
              setImageLoaded(true);
              setImageSize({ width: img.naturalWidth, height: img.naturalHeight });
            }}
          />
          {imageLoaded && imageSize.width > 0 && (
            <PolygonOverlay
              imageWidth={imageSize.width}
              imageHeight={imageSize.height}
            />
          )}
        </div>

        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2 text-gray-400">
              <div className="w-8 h-8 border-2 border-gray-300 border-t-accent rounded-full animate-spin" />
              <span className="text-sm">도면 로딩 중...</span>
            </div>
          </div>
        )}
      </div>

      <ViewerControls />
    </div>
  );
}
