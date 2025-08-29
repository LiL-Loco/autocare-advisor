'use client';

interface NoHydrationFooterProps {
  text: string;
  className?: string;
}

/**
 * ULTIMATE hydration-safe footer - renders identical content on server and client
 * Uses suppressHydrationWarning as absolute final protection
 */
export default function NoHydrationFooter({
  text,
  className = 'text-xs text-gray-500',
}: NoHydrationFooterProps) {
  // Always render the same structure - no conditional rendering
  return (
    <div suppressHydrationWarning>
      <p className={className} suppressHydrationWarning>
        {text}
      </p>
    </div>
  );
}
