'use client';

import { createAuthClient } from 'better-auth/react';
import { Button } from '../ui/button';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const SignOutButton = () => {
  const router = useRouter();
  const { signOut } = createAuthClient();

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
    <Button variant="outline" onClick={handleSignOut}>
      <LogOut className="h-4 w-4" /> Sign Out
    </Button>
  );
};
