import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { GlowCard } from '@/components/ui/spotlight-card';

// --- TYPES ---
interface FeatureImage {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
}

interface FeatureCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  features: FeatureImage[];
}

// --- FEATURE CAROUSEL COMPONENT ---
export const FeatureCarousel = React.forwardRef<HTMLDivElement, FeatureCarouselProps>(
  ({ features, className, ...props }, ref) => {
    const [currentIndex, setCurrentIndex] = React.useState(Math.floor(features.length / 2));

    const handleNext = React.useCallback(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % features.length);
    }, [features.length]);

    const handlePrev = () => {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + features.length) % features.length);
    };
    
    React.useEffect(() => {
        const timer = setInterval(() => {
            handleNext();
        }, 4000);
        return () => clearInterval(timer);
    }, [handleNext]);

    return (
      <div
        ref={ref}
        className={cn(
          'relative w-full py-20',
          className
        )}
        {...props}
      >
        {/* Main Showcase Section */}
        <div className="relative w-full h-[400px] md:h-[500px] flex items-center justify-center">
          {/* Carousel Wrapper */}
          <div className="relative w-full h-full flex items-center justify-center [perspective:1000px]">
            {features.map((feature, index) => {
              const offset = index - currentIndex;
              const total = features.length;
              let pos = (offset + total) % total;
              if (pos > Math.floor(total / 2)) {
                pos = pos - total;
              }

              const isCenter = pos === 0;
              const isAdjacent = Math.abs(pos) === 1;
              
              const glowColors: Array<'blue' | 'purple' | 'green' | 'orange'> = ['blue', 'purple', 'green', 'orange'];
              const glowColor = glowColors[index % glowColors.length];

              return (
                <div
                  key={index}
                  className={cn(
                    'absolute w-64 h-80 md:w-80 md:h-96 transition-all duration-500 ease-in-out',
                    'flex items-center justify-center'
                  )}
                  style={{
                    transform: `
                      translateX(${(pos) * 50}%) 
                      scale(${isCenter ? 1 : isAdjacent ? 0.85 : 0.7})
                      rotateY(${(pos) * -15}deg)
                    `,
                    zIndex: isCenter ? 10 : isAdjacent ? 5 : 1,
                    opacity: isCenter ? 1 : isAdjacent ? 0.5 : 0,
                    filter: isCenter ? 'blur(0px)' : 'blur(2px)',
                    visibility: Math.abs(pos) > 1 ? 'hidden' : 'visible',
                  }}
                >
                  <GlowCard 
                    glowColor={glowColor}
                    customSize
                    className={cn(
                      '!h-full !w-full !p-8',
                      'bg-white/5 backdrop-blur-xl',
                      'hover:bg-white/10 transition-all duration-300'
                    )}
                  >
                    <div className="h-full w-full flex flex-col">
                      <div className={`w-14 h-14 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center text-white mb-6 transition-transform duration-300 ${isCenter ? 'scale-110' : ''}`}>
                        {feature.icon}
                      </div>
                      <h3 className="text-2xl font-bold mb-3 text-white">{feature.title}</h3>
                      <p className="text-gray-300 text-base">{feature.description}</p>
                    </div>
                  </GlowCard>
                </div>
              );
            })}
          </div>
          
          {/* Navigation Buttons */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-2 sm:left-8 top-1/2 -translate-y-1/2 rounded-full h-12 w-12 z-20 bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 text-white"
            onClick={handlePrev}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 sm:right-8 top-1/2 -translate-y-1/2 rounded-full h-12 w-12 z-20 bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 text-white"
            onClick={handleNext}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-8">
          {features.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                'w-2 h-2 rounded-full transition-all duration-300',
                currentIndex === index 
                  ? 'bg-blue-400 w-8' 
                  : 'bg-white/30 hover:bg-white/50'
              )}
              aria-label={`Go to feature ${index + 1}`}
            />
          ))}
        </div>
      </div>
    );
  }
);

FeatureCarousel.displayName = 'FeatureCarousel';
