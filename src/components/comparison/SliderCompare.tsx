'use client';

import { useState, useRef, useCallback } from 'react';
import { getDrawingUrl } from '@/lib/constants';

interface SliderCompareProps {
  leftImage: string;
  rightImage: string;
  leftLabel: string;
  rightLabel: string;
}

export default function SliderCompare({
  leftImage,
  rightImage,
  leftLabel,
  rightLabel,
}: SliderCompareProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const updateSlider = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const pos = ((clientX - rect.left) / rect.width) * 100;
      setSliderPos(Math.max(0, Math.min(100, pos)));
    },
    [],
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      setIsDragging(true);
      updateSlider(e.clientX);
    },
    [updateSlider],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;
      updateSlider(e.clientX);
    },
    [isDragging, updateSlider],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      if (e.touches.length === 1) {
        setIsDragging(true);
        updateSlider(e.touches[0].clientX);
      }
    },
    [updateSlider],
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      if (!isDragging || e.touches.length !== 1) return;
      updateSlider(e.touches[0].clientX);
    },
    [isDragging, updateSlider],
  );

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex-1 relative overflow-hidden bg-gray-100 cursor-col-resize select-none"
      style={{ touchAction: 'none' }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Right image (full) */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={getDrawingUrl(rightImage)}
          alt={rightLabel}
          className="max-w-none select-none max-h-full object-contain"
          draggable={false}
        />
      </div>

      {/* Left image (clipped) */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={getDrawingUrl(leftImage)}
          alt={leftLabel}
          className="max-w-none select-none max-h-full object-contain"
          draggable={false}
        />
      </div>

      {/* Slider line */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-accent z-10"
        style={{ left: `${sliderPos}%` }}
      >
        <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-accent rounded-full flex items-center justify-center shadow-lg">
          <span className="text-white text-xs font-bold">⟷</span>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute top-3 left-3 px-2 py-1 bg-black/50 text-white text-xs rounded z-20">
        {leftLabel}
      </div>
      <div className="absolute top-3 right-3 px-2 py-1 bg-black/50 text-white text-xs rounded z-20">
        {rightLabel}
      </div>
    </div>
  );
}
