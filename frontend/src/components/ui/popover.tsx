'use client';

import { cn } from '@/lib/utils';
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

// Simple Popover Context
interface PopoverContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLButtonElement>;
}

const PopoverContext = createContext<PopoverContextType | null>(null);

// Main Popover Container
const Popover = ({ children, ...props }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <PopoverContext.Provider value={{ isOpen, setIsOpen, triggerRef }}>
      <div className="relative" {...props}>
        {children}
      </div>
    </PopoverContext.Provider>
  );
};

// Popover Trigger
const PopoverTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
  const context = useContext(PopoverContext);
  if (!context) throw new Error('PopoverTrigger must be used within Popover');

  const { isOpen, setIsOpen, triggerRef } = context;

  return (
    <button
      ref={ref || triggerRef}
      type="button"
      className={className}
      onClick={() => setIsOpen(!isOpen)}
      {...props}
    >
      {children}
    </button>
  );
});
PopoverTrigger.displayName = 'PopoverTrigger';

// Popover Content
const PopoverContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    align?: 'start' | 'center' | 'end';
    side?: 'top' | 'right' | 'bottom' | 'left';
    sideOffset?: number;
  }
>(
  (
    {
      className,
      align = 'center',
      side = 'bottom',
      sideOffset = 4,
      children,
      ...props
    },
    ref
  ) => {
    const context = useContext(PopoverContext);
    if (!context) throw new Error('PopoverContent must be used within Popover');

    const { isOpen, setIsOpen } = context;
    const contentRef = useRef<HTMLDivElement>(null);

    // Handle click outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          isOpen &&
          contentRef.current &&
          !contentRef.current.contains(event.target as Node) &&
          context.triggerRef.current &&
          !context.triggerRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isOpen, setIsOpen, context.triggerRef]);

    // Handle escape key
    useEffect(() => {
      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape' && isOpen) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener('keydown', handleEscape);
      }

      return () => {
        document.removeEventListener('keydown', handleEscape);
      };
    }, [isOpen, setIsOpen]);

    if (!isOpen) return null;

    // Position classes based on align and side
    const positionClasses = {
      'bottom-center': 'top-full left-1/2 -translate-x-1/2',
      'bottom-start': 'top-full left-0',
      'bottom-end': 'top-full right-0',
      'top-center': 'bottom-full left-1/2 -translate-x-1/2',
      'top-start': 'bottom-full left-0',
      'top-end': 'bottom-full right-0',
      'right-center': 'left-full top-1/2 -translate-y-1/2',
      'left-center': 'right-full top-1/2 -translate-y-1/2',
    };

    const positionKey = `${side}-${align}` as keyof typeof positionClasses;
    const positionClass =
      positionClasses[positionKey] || positionClasses['bottom-center'];

    return (
      <div
        ref={ref || contentRef}
        className={cn(
          'absolute z-50 w-72 rounded-md border border-gray-200 bg-white p-4 shadow-lg outline-none',
          'animate-in fade-in-0 zoom-in-95 duration-200',
          positionClass,
          className
        )}
        style={{
          marginTop:
            side === 'bottom' ? sideOffset : side === 'top' ? -sideOffset : 0,
          marginLeft:
            side === 'right' ? sideOffset : side === 'left' ? -sideOffset : 0,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);
PopoverContent.displayName = 'PopoverContent';

export { Popover, PopoverContent, PopoverTrigger };
