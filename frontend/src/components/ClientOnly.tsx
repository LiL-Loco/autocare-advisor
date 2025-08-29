'use client';

/**
 * Direct rendering component - no hydration issues possible
 * Since we disabled SSR completely, this just renders children directly
 */
export default function ClientOnly({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
