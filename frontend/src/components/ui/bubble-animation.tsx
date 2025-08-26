'use client';

import { useEffect, useMemo, useState } from 'react';
import styles from './bubble-animation.module.css';

interface Bubble {
  id: number;
  size: number;
  x: number;
  y: number;
  animationDuration: number;
  animationDelay: number;
  opacity: number;
}

interface BubbleAnimationProps {
  bubbleCount?: number;
  className?: string;
}

// Deterministic pseudo-random number generator using seed
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export default function BubbleAnimation({
  bubbleCount = 25,
  className = '',
}: BubbleAnimationProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Generate bubbles with deterministic properties using seed
  const bubbles = useMemo<Bubble[]>(() => {
    if (!isClient) return [];

    return Array.from({ length: bubbleCount }, (_, i) => {
      // Use index as base seed for deterministic generation
      const baseSeed = i + 1000; // Offset to avoid zero
      return {
        id: i,
        size: seededRandom(baseSeed * 1.1) * 60 + 20, // 20px to 80px
        x: seededRandom(baseSeed * 1.2) * 100, // 0% to 100%
        y: 110 + seededRandom(baseSeed * 1.3) * 20, // Start below viewport (110% - 130%)
        animationDuration: seededRandom(baseSeed * 1.4) * 10 + 8, // 8s to 18s
        animationDelay: seededRandom(baseSeed * 1.5) * 5, // 0s to 5s
        opacity: seededRandom(baseSeed * 1.6) * 0.3 + 0.1, // 0.1 to 0.4
      };
    });
  }, [bubbleCount, isClient]);

  // Don't render anything on server to avoid hydration mismatch
  if (!isClient) {
    return <div className={`absolute inset-0 overflow-hidden ${className}`} />;
  }

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {bubbles.map((bubble) => {
        // Generate different blue shades based on bubble properties (only medium to dark blues)
        const blueVariant = Math.floor(seededRandom(bubble.id * 2.7) * 4); // 0-3 for different variants

        let backgroundColor, borderColor;
        switch (blueVariant) {
          case 0: // Medium blue
            backgroundColor = `linear-gradient(135deg, 
              rgba(96, 165, 250, 0.6) 0%,      /* blue-400 */
              rgba(59, 130, 246, 0.5) 50%,     /* blue-500 */
              rgba(37, 99, 235, 0.4) 100%)`; /* blue-600 */
            borderColor = 'rgba(59, 130, 246, 0.5)'; /* blue-500 */
            break;
          case 1: // Medium-strong blue
            backgroundColor = `linear-gradient(135deg, 
              rgba(59, 130, 246, 0.6) 0%,      /* blue-500 */
              rgba(37, 99, 235, 0.5) 50%,      /* blue-600 */
              rgba(29, 78, 216, 0.4) 100%)`; /* blue-700 */
            borderColor = 'rgba(37, 99, 235, 0.5)'; /* blue-600 */
            break;
          case 2: // Dark blue
            backgroundColor = `linear-gradient(135deg, 
              rgba(37, 99, 235, 0.6) 0%,       /* blue-600 */
              rgba(29, 78, 216, 0.5) 50%,      /* blue-700 */
              rgba(30, 64, 175, 0.4) 100%)`; /* blue-800 */
            borderColor = 'rgba(29, 78, 216, 0.5)'; /* blue-700 */
            break;
          default: // Very dark blue
            backgroundColor = `linear-gradient(135deg, 
              rgba(29, 78, 216, 0.6) 0%,       /* blue-700 */
              rgba(30, 64, 175, 0.5) 50%,      /* blue-800 */
              rgba(30, 58, 138, 0.4) 100%)`; /* blue-900 */
            borderColor = 'rgba(30, 64, 175, 0.5)'; /* blue-800 */
            break;
        }

        return (
          <div
            key={bubble.id}
            className={styles.bubble}
            style={{
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
              left: `${bubble.x}%`,
              top: `${bubble.y}%`,
              background: backgroundColor,
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)', // Safari support
              boxShadow: `inset ${bubble.size * 0.1}px ${bubble.size * 0.1}px ${
                bubble.size * 0.2
              }px ${borderColor}, 0 0 ${
                bubble.size * 0.15
              }px ${borderColor.replace('0.5', '0.3')}`,
              animationDuration: `${bubble.animationDuration}s`,
              animationDelay: `${bubble.animationDelay}s`,
              opacity: bubble.opacity,
              border: `1px solid ${borderColor}`,
            }}
          />
        );
      })}
    </div>
  );
}
