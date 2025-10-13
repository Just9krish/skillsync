import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

/**
 * Get the current authenticated user
 * @returns Current user object
 * @throws Error if user is not authenticated
 */
export async function getCurrentUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  return session.user;
}

/**
 * Get the current user ID
 * @returns Current user ID
 * @throws Error if user is not authenticated
 */
export async function getCurrentUserId(): Promise<string> {
  const user = await getCurrentUser();
  return user.id;
}
