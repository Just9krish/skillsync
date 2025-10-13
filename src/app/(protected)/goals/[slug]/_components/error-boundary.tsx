'use client';

import { useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    console.error('Goal detail error:', error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Alert className="max-w-md">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-2">
            <p>Something went wrong while loading the goal details.</p>
            <button onClick={reset} className="text-primary hover:underline">
              Try again
            </button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}
