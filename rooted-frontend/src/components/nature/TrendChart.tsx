import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);

interface TrendChartProps {
  data: { score: number; risk: string }[];
}

export function TrendChart({ data }: TrendChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  // Generate a simple smooth path through the data points
  // Map scores (which are like 1 to 5) to coordinates.
  const width = 300;
  const height = 200;
  const padding = 20;
  
  const minScore = 0;
  const maxScore = 5;

  const points = data.map((d, i) => {
    const x = padding + (i / Math.max(1, data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((d.score - minScore) / (maxScore - minScore)) * (height - padding * 2);
    return { x, y };
  });

  // Basic bezier curve generator
  const createPath = (pts: {x: number, y: number}[]) => {
    if (pts.length === 0) return '';
    if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;
    
    let path = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const cp1x = p1.x + (p2.x - p1.x) / 2;
      const cp1y = p1.y;
      const cp2x = p1.x + (p2.x - p1.x) / 2;
      const cp2y = p2.y;
      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return path;
  };

  const pathData = createPath(points);

  useGSAP(() => {
    if (!pathRef.current || !containerRef.current) return;
    
    // Animate drawing the line as the page scrolls
    // If the page doesn't scroll much, this will still draw partially,
    // so let's tie it to the container's top entering the viewport.
    gsap.fromTo(pathRef.current, 
      { drawSVG: "0%" },
      {
        drawSVG: "100%",
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          end: "bottom 40%",
          scrub: 1, // Smooth scrubbing
        }
      }
    );

    // Also animate the dots
    gsap.from(".trend-dot", {
      scale: 0,
      opacity: 0,
      duration: 0.5,
      stagger: 0.2,
      ease: "back.out(1.5)",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
      }
    });

  }, { scope: containerRef, dependencies: [data] });

  return (
    <div ref={containerRef} className="w-full bg-surface border border-border/50 rounded-3xl p-6 shadow-sm">
      <h3 className="text-sm font-medium text-trunk-text uppercase tracking-wider mb-6">Growth Trend</h3>
      <div className="relative w-full aspect-[3/2] flex items-center justify-center">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          {/* Grid lines */}
          {[1, 2, 3, 4, 5].map(score => {
            const y = height - padding - ((score - minScore) / (maxScore - minScore)) * (height - padding * 2);
            return (
              <line 
                key={score}
                x1={padding} y1={y} x2={width - padding} y2={y}
                stroke="var(--border-subtle)" 
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            );
          })}
          
          {/* The main trend line */}
          <path
            ref={pathRef}
            d={pathData}
            fill="none"
            stroke="var(--trunk-active-indicator)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {points.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={5}
              fill="var(--bg-surface)"
              stroke={
                data[i].risk === 'High' ? 'var(--risk-tangled)' :
                data[i].risk === 'Medium' ? 'var(--risk-shallow)' :
                'var(--risk-deep)'
              }
              strokeWidth="2"
              className="trend-dot"
            />
          ))}
        </svg>
      </div>
    </div>
  );
}
