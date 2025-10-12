'use client';

import { Button } from '../ui/button';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signOut } from '@/lib/auth-client';

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

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/login');
        },
      },
    });
  };

  return (
    <Button
      variant={variant}
      onClick={handleSignOut}
      size={size}
      className={className}
      {...props}
    >
      <LogOut className="h-4 w-4" /> Sign Out
    </Button>
  );
};
