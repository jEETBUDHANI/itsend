import React from 'react';

export const ImageAutoSlider = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <style>{`
        @keyframes scroll-right {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .infinite-scroll {
          animation: scroll-right 30s linear infinite;
        }

        .infinite-scroll:hover {
          animation-play-state: paused;
        }

        .scroll-container {
          mask: linear-gradient(
            90deg,
            transparent 0%,
            black 5%,
            black 95%,
            transparent 100%
          );
          -webkit-mask: linear-gradient(
            90deg,
            transparent 0%,
            black 5%,
            black 95%,
            transparent 100%
          );
        }
      `}</style>
      
      <div className="scroll-container w-full overflow-hidden">
        <div className="infinite-scroll flex gap-6 w-max">
          {children}
          {children}
        </div>
      </div>
    </>
  );
};
