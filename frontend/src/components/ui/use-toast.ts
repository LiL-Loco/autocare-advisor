import { useCallback, useState } from 'react';

type ToastType = 'default' | 'destructive';

interface ToastProps {
  title: string;
  description?: string;
  variant?: ToastType;
}

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const toast = useCallback(
    ({ title, description, variant = 'default' }: ToastProps) => {
      // Simple console-based toast for now
      console.log(
        `🍞 Toast [${variant}]: ${title}${
          description ? ` - ${description}` : ''
        }`
      );

      // You could implement a proper toast system here
      // For now, we'll use browser alerts for critical messages
      if (variant === 'destructive') {
        alert(`⚠️ Fehler: ${title}${description ? `\n${description}` : ''}`);
      } else {
        // Non-blocking notification for success messages
        console.info(`✅ ${title}${description ? ` - ${description}` : ''}`);
      }
    },
    []
  );

  return { toast };
};
