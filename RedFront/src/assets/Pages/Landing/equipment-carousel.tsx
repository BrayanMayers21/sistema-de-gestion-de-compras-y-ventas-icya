"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

interface EquipmentCarouselProps {
  images: string[];
  title?: string;
  autoPlayInterval?: number;
}

export function EquipmentCarousel({
  images,
  title = "EQUIPOS UTILIZADOS",
  autoPlayInterval = 3000,
}: EquipmentCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const visibleCount = 3;

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1 >= images.length ? 0 : prev + 1));
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [isAutoPlaying, isPaused, images.length, autoPlayInterval]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1 >= images.length ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 < 0 ? images.length - 1 : prev - 1));
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  const getVisibleImages = () => {
    const visible = [];
    for (let i = 0; i < Math.min(visibleCount, images.length); i++) {
      const index = (currentIndex + i) % images.length;
      visible.push({ src: images[index], index });
    }
    return visible;
  };

  return (
    <div className="mt-12 relative">
      {/* Title with gradient underline */}
      <div className="mb-8 text-center">
        <h3 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
          {title}
        </h3>
        <div className="w-24 h-1 mx-auto bg-gradient-to-r from-[#f59e0b] via-[#f97316] to-[#f59e0b] rounded-full"></div>
      </div>

      <div className="relative flex items-center group">
        {/* Left Arrow with glow effect */}
        <button
          onClick={prevSlide}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="absolute left-0 z-10 w-14 h-14 flex items-center justify-center bg-gradient-to-br from-[#f59e0b] to-[#f97316] text-white rounded-full shadow-lg hover:shadow-2xl hover:scale-110 transition-all duration-300 opacity-90 hover:opacity-100"
          aria-label="Anterior"
        >
          <ChevronLeft className="w-7 h-7" strokeWidth={3} />
        </button>

        {/* Images Container with enhanced styling */}
        <div className="flex-1 flex gap-6 justify-center overflow-hidden px-20">
          {getVisibleImages().map((img, idx) => (
            <div
              key={`${img.index}-${idx}`}
              className={`relative flex-shrink-0 transition-all duration-500 ${
                idx === 1
                  ? "w-64 h-64 scale-110"
                  : "w-52 h-52 scale-90 opacity-75"
              }`}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#f59e0b]/20 to-[#f97316]/20 rounded-2xl blur-xl"></div>
              <div className="relative w-full h-full border-2 border-gray-200 rounded-2xl overflow-hidden bg-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:border-[#f59e0b] p-4">
                <img
                  src={img.src || "/placeholder.svg"}
                  alt={`Equipo ${img.index + 1}`}
                  className="w-full h-full object-contain transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#f59e0b] to-transparent"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Arrow with glow effect */}
        <button
          onClick={nextSlide}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="absolute right-0 z-10 w-14 h-14 flex items-center justify-center bg-gradient-to-br from-[#f59e0b] to-[#f97316] text-white rounded-full shadow-lg hover:shadow-2xl hover:scale-110 transition-all duration-300 opacity-90 hover:opacity-100"
          aria-label="Siguiente"
        >
          <ChevronRight className="w-7 h-7" strokeWidth={3} />
        </button>
      </div>

      {/* Auto-play control and indicators */}
      <div className="flex items-center justify-center gap-4 mt-8">
        {/* Play/Pause Button */}
        <button
          onClick={toggleAutoPlay}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-all duration-300 text-sm font-medium text-gray-700 hover:text-gray-900"
          aria-label={isAutoPlaying ? "Pausar" : "Reproducir"}
        >
          {isAutoPlaying ? (
            <>
              <Pause className="w-4 h-4" />
              <span>Pausar</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span>Reproducir</span>
            </>
          )}
        </button>

        {/* Progress Indicators */}
        <div className="flex gap-2">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`transition-all duration-300 rounded-full ${
                idx === currentIndex
                  ? "w-8 h-2 bg-gradient-to-r from-[#f59e0b] to-[#f97316]"
                  : "w-2 h-2 bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Ir a equipo ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
