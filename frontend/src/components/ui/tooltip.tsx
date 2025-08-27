'use client';

import { cn } from '@/lib/utils';
import * as React from 'react';

interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  className?: string;
  side?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  delayDuration?: number;
}

export function Tooltip({
  children,
  content,
  className,
  side = 'top',
  align = 'center',
  delayDuration = 700,
}: TooltipProps) {
  const [isVisible, setIsVisible] = React.useState(false);
  const [timeoutId, setTimeoutId] = React.useState<NodeJS.Timeout | null>(null);

  const showTooltip = () => {
    const id = setTimeout(() => setIsVisible(true), delayDuration);
    setTimeoutId(id);
  };

  const hideTooltip = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setIsVisible(false);
  };

  const getPositionClasses = () => {
    const positions = {
      top: {
        start: 'bottom-full left-0 mb-2',
        center: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
        end: 'bottom-full right-0 mb-2',
      },
      bottom: {
        start: 'top-full left-0 mt-2',
        center: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
        end: 'top-full right-0 mt-2',
      },
      left: {
        start: 'right-full top-0 mr-2',
        center: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
        end: 'right-full bottom-0 mr-2',
      },
      right: {
        start: 'left-full top-0 ml-2',
        center: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
        end: 'left-full bottom-0 ml-2',
      },
    };
    return positions[side][align];
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
      >
        {children}
      </div>

      {isVisible && (
        <div
          className={cn(
            'absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-md shadow-lg whitespace-nowrap pointer-events-none',
            getPositionClasses(),
            className
          )}
        >
          {content}

          {/* Arrow */}
          <div
            className={cn(
              'absolute w-2 h-2 bg-gray-900 transform rotate-45',
              side === 'top' &&
                align === 'center' &&
                'top-full left-1/2 -translate-x-1/2 -mt-1',
              side === 'top' && align === 'start' && 'top-full left-3 -mt-1',
              side === 'top' && align === 'end' && 'top-full right-3 -mt-1',
              side === 'bottom' &&
                align === 'center' &&
                'bottom-full left-1/2 -translate-x-1/2 -mb-1',
              side === 'bottom' &&
                align === 'start' &&
                'bottom-full left-3 -mb-1',
              side === 'bottom' &&
                align === 'end' &&
                'bottom-full right-3 -mb-1',
              side === 'left' &&
                align === 'center' &&
                'left-full top-1/2 -translate-y-1/2 -ml-1',
              side === 'left' && align === 'start' && 'left-full top-2 -ml-1',
              side === 'left' && align === 'end' && 'left-full bottom-2 -ml-1',
              side === 'right' &&
                align === 'center' &&
                'right-full top-1/2 -translate-y-1/2 -mr-1',
              side === 'right' && align === 'start' && 'right-full top-2 -mr-1',
              side === 'right' && align === 'end' && 'right-full bottom-2 -mr-1'
            )}
          />
        </div>
      )}
    </div>
  );
}

// Legacy API compatibility - für die bestehenden Import-Strukturen
export const TooltipProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <>{children}</>;

export const TooltipTrigger: React.FC<{
  children: React.ReactNode;
  asChild?: boolean;
}> = ({ children }) => <>{children}</>;

export const TooltipContent: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children }) => <>{children}</>;
