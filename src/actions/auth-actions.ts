'use server';

import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { APIError } from 'better-auth/api';

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: any;
  error?: string;
}

export const signUpAction = async (
  email: string,
  password: string,
  name: string
): Promise<AuthResponse> => {
  try {
    const result = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
      },
    });

    if (!result.token) {
      return {
        success: false,
        message: 'Registration failed',
        error: 'Failed to create account',
      };
    }

    return {
      success: true,
      message: 'Registration successful',
      user: result.user,
    };
  } catch (error) {
    console.error('Sign up error:', error);
    return {
      success: false,
      message: 'An unexpected error occurred',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

export const signInAction = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  try {
    const result = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });

    if (!result.token) {
      return {
        success: false,
        message: 'Login failed',
        error: 'Invalid credentials',
      };
    }

    return {
      success: true,
      message: 'Login successful',
      user: result.user,
    };
  } catch (error) {
    console.error('Sign in error:', error);
    return {
      success: false,
      message: 'An unexpected error occurred',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

export const signOutAction = async (): Promise<AuthResponse> => {
  try {
    await auth.api.signOut({
      headers: new Headers(),
    });

    return {
      success: true,
      message: 'Logged out successfully',
    };
  } catch (error) {
    console.error('Sign out error:', error);
    return {
      success: false,
      message: 'An unexpected error occurred',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

export const getSessionAction = async () => {
  try {
    const session = await auth.api.getSession({
      headers: new Headers(),
    });

    return {
      success: true,
      session: session,
    };
  } catch (error) {
    console.error('Get session error:', error);
    return {
      success: false,
      session: null,
    };
  }
};
