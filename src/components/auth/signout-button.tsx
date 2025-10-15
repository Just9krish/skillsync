'use client';

import { Button } from '../ui/button';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signOut } from '@/lib/auth-client';
import { useConfirm } from '@/hooks/use-confirm';

export const SignOutButton = ({
  variant = 'outline',
  size = 'default',
  className,
  ...props
}: {
  variant?:
    | 'outline'
    | 'default'
    | 'ghost'
    | 'link'
    | 'secondary'
    | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon' | 'icon-sm' | 'icon-lg';
  className?: string;
  props?: React.ComponentProps<typeof Button>;
}) => {
  const router = useRouter();
  const { confirm } = useConfirm();

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/login');
        },
      },
    });
  };

  const handleSignOutClick = () => {
    confirm(
      {
        title: 'Sign Out',
        description: 'Are you sure you want to sign out?',
        confirmText: 'Sign Out',
        cancelText: 'Cancel',
        variant: 'default',
      },
      handleSignOut
    );
  };

  return (
    <Button
      variant={variant}
      onClick={handleSignOutClick}
      size={size}
      className={className}
      {...props}
    >
      <LogOut className="h-4 w-4" /> Sign Out
    </Button>
  );
};
