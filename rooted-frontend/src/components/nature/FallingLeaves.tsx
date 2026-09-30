import React, { useEffect, useRef, useState, useMemo } from 'react';
import gsap from 'gsap';
import { Leaf } from './Leaf';
import { useReducedMotion } from '../../lib/gsap';

interface FallingLeavesProps {
  count?: number;
  intensity?: 'subtle' | 'medium' | 'lush';
  colors?: string[];
  className?: string;
}

export const FallingLeaves: React.FC<FallingLeavesProps> = ({
  count = 14,
  intensity = 'subtle',
  colors = ['text-sage-400', 'text-moss-500', 'text-leaf-500', 'text-ochre-400', 'text-terracotta-400'],
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [activeLeaves, setActiveLeaves] = useState<Array<{ id: number; color: string; left: string; scale: number; startY: string }>>([]);
  const leafCounter = useRef(0);
  const isVisible = useRef(true);

  // Settings based on intensity
  const settings = useMemo(() => {
    switch (intensity) {
      case 'lush': return { opacityRange: [0.35, 0.7], spawnRate: 900 };
      case 'medium': return { opacityRange: [0.25, 0.55], spawnRate: 1600 };
      case 'subtle':
      default: return { opacityRange: [0.15, 0.35], spawnRate: 3000 };
    }
  }, [intensity]);

  // Handle visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      isVisible.current = document.visibilityState === 'visible';
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Spawn leaves loop
  useEffect(() => {
    if (reducedMotion) {
      // Just render 3 static leaves
      setActiveLeaves([
        { id: 1, color: colors[0], left: '20%', scale: 1.2, startY: '30%' },
        { id: 2, color: colors[1], left: '75%', scale: 0.8, startY: '60%' },
        { id: 3, color: colors[2], left: '45%', scale: 1, startY: '85%' },
      ]);
      return;
    }

    let spawnTimeout: number;

    const spawnLeaf = () => {
      if (!isVisible.current) {
        spawnTimeout = window.setTimeout(spawnLeaf, 1000);
        return;
      }

      setActiveLeaves((prev) => {
        if (prev.length >= count) return prev; // Safety valve
        
        leafCounter.current += 1;
        const newLeaf = {
          id: leafCounter.current,
          color: colors[Math.floor(Math.random() * colors.length)],
          left: `${Math.random() * 100}%`,
          scale: 0.5 + Math.random() * 0.8,
          startY: '-10%',
        };
        return [...prev, newLeaf];
      });

      // Schedule next spawn with some randomness
      const nextSpawnDelay = settings.spawnRate * (0.8 + Math.random() * 0.4);
      spawnTimeout = window.setTimeout(spawnLeaf, nextSpawnDelay);
    };

    spawnLeaf();

    return () => clearTimeout(spawnTimeout);
  }, [count, settings.spawnRate, reducedMotion, colors]);

  const removeLeaf = (id: number) => {
    setActiveLeaves((prev) => prev.filter((leaf) => leaf.id !== id));
  };

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 pointer-events-none overflow-hidden z-0 ${className}`}
      aria-hidden="true"
    >
      {activeLeaves.map((leaf) => (
        <FallingLeaf
          key={leaf.id}
          leaf={leaf}
          settings={settings}
          reducedMotion={reducedMotion}
          onComplete={() => removeLeaf(leaf.id)}
        />
      ))}
    </div>
  );
};

interface FallingLeafProps {
  leaf: { id: number; color: string; left: string; scale: number; startY: string };
  settings: { opacityRange: number[] };
  reducedMotion: boolean;
  onComplete: () => void;
}

const FallingLeaf: React.FC<FallingLeafProps> = ({ leaf, settings, reducedMotion, onComplete }) => {
  const leafRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion || !leafRef.current) return;

    const element = leafRef.current;
    const duration = 8 + Math.random() * 8; // 8-16s
    const targetY = window.innerHeight + 100;
    
    // Calculate bezier path for swaying motion
    const startX = 0;
    const midX = (Math.random() > 0.5 ? 1 : -1) * (100 + Math.random() * 200);
    const endX = midX + (Math.random() > 0.5 ? 1 : -1) * (50 + Math.random() * 150);
    
    const path = [
      { x: startX, y: 0 },
      { x: midX, y: targetY * 0.5 },
      { x: endX, y: targetY }
    ];

    const tl = gsap.timeline({
      onComplete,
    });

    // Set initial opacity and rotation
    const targetOpacity = settings.opacityRange[0] + Math.random() * (settings.opacityRange[1] - settings.opacityRange[0]);
    const rotation = 30 + Math.random() * 60;
    
    gsap.set(element, { opacity: 0 });

    tl.to(element, {
      motionPath: {
        path,
        curviness: 1.5,
      },
      rotation: rotation * (Math.random() > 0.5 ? 1 : -1),
      duration,
      ease: "none",
    }, 0);

    // Fade in
    tl.to(element, { opacity: targetOpacity, duration: 1.5 }, 0);
    // Fade out
    tl.to(element, { opacity: 0, duration: 1.5 }, duration - 1.5);

    return () => {
      tl.kill();
    };
  }, [reducedMotion, settings.opacityRange, onComplete]);

  return (
    <div
      ref={leafRef}
      className={`absolute ${leaf.color}`}
      style={{
        left: leaf.left,
        top: leaf.startY,
        transform: `scale(${leaf.scale})`,
        opacity: reducedMotion ? (settings.opacityRange[0] + settings.opacityRange[1]) / 2 : 0,
      }}
    >
      <Leaf className="w-8 h-8 opacity-80" />
    </div>
  );
};
