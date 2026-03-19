// Before-After Interactive Slider Component

import { useState } from 'react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  alt?: string;
}

export function BeforeAfterSlider({ beforeImage, afterImage, alt = 'Before After Comparison' }: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const handleMove = (clientX: number, rect: DOMRect) => {
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
    setSliderPosition(percent);
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    handleMove(e.clientX, rect);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    handleMove(e.touches[0].clientX, rect);
  };

  return (
    <div
      className="relative w-full aspect-[4/3] overflow-hidden rounded-lg select-none cursor-ew-resize"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUp}
    >
      {/* After Image (Background) */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src={afterImage}
          alt={`${alt} - After`}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 bg-[#0d6e6e] text-white px-3 py-1 rounded-full text-sm font-medium">
          After
        </div>
      </div>

      {/* Before Image (Clipped) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <ImageWithFallback
          src={beforeImage}
          alt={`${alt} - Before`}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 left-4 bg-gray-600 text-white px-3 py-1 rounded-full text-sm font-medium">
          Before
        </div>
      </div>

      {/* Slider Line & Handle */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize"
        style={{ left: `${sliderPosition}%` }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      >
        {/* Handle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center">
          <div className="flex gap-1">
            <div className="w-0.5 h-4 bg-[#0d6e6e]"></div>
            <div className="w-0.5 h-4 bg-[#0d6e6e]"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
