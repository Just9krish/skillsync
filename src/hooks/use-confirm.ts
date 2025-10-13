import { useAlertDialog } from '@/context/alert-dialog-context';

interface ConfirmOptions {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive';
}

export function useConfirm() {
  const { showAlert } = useAlertDialog();

  const confirm = (
    options: ConfirmOptions,
    onConfirm: () => void | Promise<void>
  ) => {
    showAlert({
      ...options,
      onConfirm,
    });
  };

  const confirmDelete = (
    itemName: string,
    onConfirm: () => void | Promise<void>
  ) => {
    confirm(
      {
        title: 'Delete Item',
        description: `Are you sure you want to delete "${itemName}"? This action cannot be undone.`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
        variant: 'destructive',
      },
      onConfirm
    );
  };

  const confirmRemove = (
    itemName: string,
    onConfirm: () => void | Promise<void>
  ) => {
    confirm(
      {
        title: 'Remove Item',
        description: `Are you sure you want to remove "${itemName}"?`,
        confirmText: 'Remove',
        cancelText: 'Cancel',
        variant: 'destructive',
      },
      onConfirm
    );
  };

  return {
    confirm,
    confirmDelete,
    confirmRemove,
  };
}
