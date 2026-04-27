"use client";

import React, { useMemo } from "react";

type Variant = "swirl" | "hue";

export type ElectricBorderProps = {
  variant?: Variant;
  color?: string;
  children: React.ReactNode;
  className?: string;
};

/**
 * ElectricBorder
 * Wraps any content with an animated electric border effect.
 * Applies SVG filters to create dramatic displacement/hue animation.
 */
const ElectricBorder = ({
  variant = "swirl",
  color = "#dd8448",
  children,
  className = "",
}: ElectricBorderProps) => {
  const ids = useMemo(() => {
    const key = Math.random().toString(36).slice(2, 8);
    return {
      swirl: `swirl-${key}`,
      hue: `hue-${key}`,
    };
  }, []);

  const filterURL = variant === "hue" ? `url(#${ids.hue})` : `url(#${ids.swirl})`;

  return (
    <div className={`ec-border-wrap ${className}`}>
      {/* SVG with filters */}
      <svg
        className="svg-container"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          {/* SWIRL */}
          <filter
            id={ids.swirl}
            colorInterpolationFilters="sRGB"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feTurbulence
              type="turbulence"
              baseFrequency="0.02"
              numOctaves="10"
              result="noise1"
              seed="1"
            />
            <feOffset in="noise1" dx="0" dy="0" result="offsetNoise1">
              <animate
                attributeName="dy"
                values="700; 0"
                dur="6s"
                repeatCount="indefinite"
                calcMode="linear"
              />
            </feOffset>

            <feTurbulence
              type="turbulence"
              baseFrequency="0.02"
              numOctaves="10"
              result="noise2"
              seed="1"
            />
            <feOffset in="noise2" dx="0" dy="0" result="offsetNoise2">
              <animate
                attributeName="dy"
                values="0; -700"
                dur="6s"
                repeatCount="indefinite"
                calcMode="linear"
              />
            </feOffset>

            <feTurbulence
              type="turbulence"
              baseFrequency="0.02"
              numOctaves="10"
              result="noise3"
              seed="2"
            />
            <feOffset in="noise3" dx="0" dy="0" result="offsetNoise3">
              <animate
                attributeName="dx"
                values="490; 0"
                dur="6s"
                repeatCount="indefinite"
                calcMode="linear"
              />
            </feOffset>

            <feTurbulence
              type="turbulence"
              baseFrequency="0.02"
              numOctaves="10"
              result="noise4"
              seed="2"
            />
            <feOffset in="noise4" dx="0" dy="0" result="offsetNoise4">
              <animate
                attributeName="dx"
                values="0; -490"
                dur="6s"
                repeatCount="indefinite"
                calcMode="linear"
              />
            </feOffset>

            <feComposite in="offsetNoise1" in2="offsetNoise2" result="part1" />
            <feComposite in="offsetNoise3" in2="offsetNoise4" result="part2" />
            <feBlend in="part1" in2="part2" mode="color-dodge" result="combinedNoise" />

            <feDisplacementMap
              in="SourceGraphic"
              in2="combinedNoise"
              scale="30"
              xChannelSelector="R"
              yChannelSelector="B"
            />
          </filter>

          {/* HUE */}
          <filter
            id={ids.hue}
            colorInterpolationFilters="sRGB"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feTurbulence
              type="turbulence"
              baseFrequency="0.02"
              numOctaves="7"
            />
            <feColorMatrix type="hueRotate" result="pt1">
              <animate
                attributeName="values"
                values="0;360;"
                dur=".6s"
                repeatCount="indefinite"
                calcMode="paced"
              />
            </feColorMatrix>
            <feComposite />
            <feTurbulence
              type="turbulence"
              baseFrequency="0.03"
              numOctaves="7"
              seed="5"
            />
            <feColorMatrix type="hueRotate" result="pt2">
              <animate
                attributeName="values"
                values="0; 333; 199; 286; 64; 168; 256; 157; 360;"
                dur="5s"
                repeatCount="indefinite"
                calcMode="paced"
              />
            </feColorMatrix>
            <feBlend in="pt1" in2="pt2" mode="normal" result="combinedNoise" />
            <feDisplacementMap
              in="SourceGraphic"
              scale="30"
              xChannelSelector="R"
              yChannelSelector="B"
            />
          </filter>
        </defs>
      </svg>

      {/* Border container */}
      <div
        className="electric-border-container"
        style={{
          ["--electric-border-color" as any]: color,
          ["--f" as any]: filterURL,
        }}
      >
        {/* Glowing borders */}
        <div className="electric-border-fx" />
        <div className="glow-border-1" />
        <div className="glow-border-2" />

        {/* Content */}
        <div className="electric-border-content">{children}</div>
      </div>

      <style>{`
        .ec-border-wrap {
          position: relative;
          display: block;
        }

        .svg-container {
          position: absolute;
          width: 0;
          height: 0;
          overflow: hidden;
        }

        .electric-border-container {
          position: relative;
          border-radius: 1.5em;
          padding: 2px;
          --electric-light-color: oklch(
            from var(--electric-border-color) l c h
          );

          background: linear-gradient(
            -30deg,
            oklch(from var(--electric-border-color) 0.3 calc(c / 2) h / 0.4),
            transparent,
            oklch(from var(--electric-border-color) 0.3 calc(c / 2) h / 0.4)
          );
        }

        .glow-border-1,
        .glow-border-2,
        .electric-border-fx {
          border-radius: 1.5em;
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .electric-border-fx {
          border: 2px solid var(--electric-border-color);
          filter: var(--f);
          opacity: 0.9;
        }

        .glow-border-1 {
          border: 2px solid oklch(from var(--electric-border-color) l c h / 0.6);
          filter: blur(1px);
        }

        .glow-border-2 {
          border: 2px solid var(--electric-light-color);
          filter: blur(4px);
        }

        .electric-border-content {
          position: relative;
          z-index: 1;
          border-radius: 1.35em;
          overflow: hidden;
          background: rgba(7, 10, 18, 0.9);
        }
      `}</style>
    </div>
  );
};

export { ElectricBorder };
