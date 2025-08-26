'use client';

import { useMemo } from 'react';
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

export default function BubbleAnimation({
  bubbleCount = 25,
  className = '',
}: BubbleAnimationProps) {
  // Generate bubbles with random properties
  const bubbles = useMemo<Bubble[]>(() => {
    return Array.from({ length: bubbleCount }, (_, i) => ({
      id: i,
      size: Math.random() * 60 + 20, // 20px to 80px
      x: Math.random() * 100, // 0% to 100%
      y: 110 + Math.random() * 20, // Start below viewport (110% - 130%)
      animationDuration: Math.random() * 10 + 8, // 8s to 18s
      animationDelay: Math.random() * 5, // 0s to 5s
      opacity: Math.random() * 0.3 + 0.1, // 0.1 to 0.4
    }));
  }, [bubbleCount]);

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className={styles.bubble}
          style={{
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            left: `${bubble.x}%`,
            top: `${bubble.y}%`,
            background: `linear-gradient(135deg, 
              rgba(37, 99, 235, 0.4) 0%, 
              rgba(59, 130, 246, 0.3) 50%, 
              rgba(147, 197, 253, 0.2) 100%)`,
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)', // Safari support
            boxShadow: `inset ${bubble.size * 0.1}px ${bubble.size * 0.1}px ${
              bubble.size * 0.2
            }px rgba(255, 255, 255, 0.3)`,
            animationDuration: `${bubble.animationDuration}s`,
            animationDelay: `${bubble.animationDelay}s`,
            opacity: bubble.opacity,
          }}
        />
      ))}
    </div>
  );
}
