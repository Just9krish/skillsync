'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth-utils';

// Profile update schema
const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  email: z.string().email('Please enter a valid email address'),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  focus: z
    .string()
    .max(100, 'Learning focus must be less than 100 characters')
    .optional(),
});

type UpdateProfileData = z.infer<typeof updateProfileSchema>;


export async function updateProfile(data: UpdateProfileData) {
  try {
    const user = await getCurrentUser();

    // Validate the input data
    const validatedData = updateProfileSchema.parse(data);

    // Check if email is already taken by another user
    if (validatedData.email !== user.email) {
      const existingUser = await prisma.user.findUnique({
        where: {
          email: validatedData.email,
        },
      });

      if (existingUser && existingUser.id !== user.id) {
        return {
          success: false,
          error: 'This email is already taken by another user',
        };
      }
    }

    // Update the user profile
    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        name: validatedData.name,
        email: validatedData.email,
        bio: validatedData.bio || '',
        // Note: focus field doesn't exist in the user model yet
        // You'll need to add it to the Prisma schema if you want to persist it
      },
    });

    // Revalidate the profile page to show updated data
    revalidatePath('/profile');

    return {
      success: true,
      user: updatedUser,
    };
  } catch (error) {
    console.error('Error updating profile:', error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.message || 'Invalid input data',
      };
    }

    return {
      success: false,
      error: 'Failed to update profile. Please try again.',
    };
  }
}

// Server action for updating profile picture (placeholder for future Supabase integration)
export async function updateProfilePicture(imageUrl: string) {
  try {
    const user = await getCurrentUser();

    // Update the user's image field
    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        image: imageUrl,
      },
    });

    // Revalidate the profile page
    revalidatePath('/profile');

    return {
      success: true,
      user: updatedUser,
    };
  } catch (error) {
    console.error('Error updating profile picture:', error);

    return {
      success: false,
      error: 'Failed to update profile picture. Please try again.',
    };
  }
}
