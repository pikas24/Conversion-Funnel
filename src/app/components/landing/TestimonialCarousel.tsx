// Testimonial Carousel Component

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Button } from '../ui/button';

interface Testimonial {
  id: number;
  name: string;
  image: string;
  review: string;
  rating?: number;
  treatment?: string;
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
  autoSlide?: boolean;
  interval?: number;
}

export function TestimonialCarousel({ 
  testimonials, 
  autoSlide = true, 
  interval = 5000 
}: TestimonialCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!autoSlide) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoSlide, interval, testimonials.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Testimonial Cards */}
      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="min-w-full px-4">
              <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100">
                {/* Rating */}
                {testimonial.rating && (
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`size-5 ${
                          i < testimonial.rating!
                            ? 'fill-[#d4af37] text-[#d4af37]'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                )}

                {/* Review Text */}
                <p className="text-gray-700 text-lg leading-relaxed mb-6 italic">
                  "{testimonial.review}"
                </p>

                {/* Patient Info */}
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden">
                    <ImageWithFallback
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    {testimonial.treatment && (
                      <p className="text-sm text-gray-500">{testimonial.treatment}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-center gap-4 mt-8">
        <Button
          variant="outline"
          size="icon"
          onClick={goToPrevious}
          className="rounded-full border-gray-300 hover:border-[#0d6e6e] hover:bg-[#0d6e6e] hover:text-white transition-colors"
        >
          <ChevronLeft className="size-5" />
        </Button>

        {/* Dots Indicator */}
        <div className="flex gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-[#0d6e6e] w-8'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={goToNext}
          className="rounded-full border-gray-300 hover:border-[#0d6e6e] hover:bg-[#0d6e6e] hover:text-white transition-colors"
        >
          <ChevronRight className="size-5" />
        </Button>
      </div>
    </div>
  );
}
