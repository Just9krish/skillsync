'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface AlertDialogOptions {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive';
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
}

interface AlertDialogContextType {
  showAlert: (options: AlertDialogOptions) => void;
  hideAlert: () => void;
}

const AlertDialogContext = createContext<AlertDialogContextType | undefined>(
  undefined
);

export function useAlertDialog() {
  const context = useContext(AlertDialogContext);
  if (!context) {
    throw new Error(
      'useAlertDialog must be used within an AlertDialogProvider'
    );
  }
  return context;
}

interface AlertDialogProviderProps {
  children: React.ReactNode;
}

export function AlertDialogProvider({ children }: AlertDialogProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<AlertDialogOptions | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const showAlert = useCallback((alertOptions: AlertDialogOptions) => {
    setOptions(alertOptions);
    setIsOpen(true);
  }, []);

  const hideAlert = useCallback(() => {
    setIsOpen(false);
    setOptions(null);
    setIsLoading(false);
  }, []);

  const handleConfirm = async () => {
    if (!options) return;

    setIsLoading(true);
    try {
      await options.onConfirm();
      hideAlert();
    } catch (error) {
      console.error('Error in alert dialog confirm action:', error);
      // Don't hide the dialog on error, let the user try again
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (options?.onCancel) {
      options.onCancel();
    }
    hideAlert();
  };

  return (
    <AlertDialogContext.Provider value={{ showAlert, hideAlert }}>
      {children}
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{options?.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {options?.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel} disabled={isLoading}>
              {options?.cancelText || 'Cancel'}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              disabled={isLoading}
              className={
                options?.variant === 'destructive'
                  ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                  : ''
              }
            >
              {isLoading ? 'Loading...' : options?.confirmText || 'Confirm'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AlertDialogContext.Provider>
  );
}
