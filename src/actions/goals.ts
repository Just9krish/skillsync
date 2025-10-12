'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Validation schemas
const CreateGoalSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title must be less than 100 characters'),
  description: z.string().optional(),
  tags: z.array(z.string()).default([]),
  deadline: z
    .string()
    .optional()
    .transform(val => (val ? new Date(val) : undefined)),
  status: z
    .enum(['active', 'completed', 'paused', 'cancelled'])
    .default('active'),
});

const UpdateGoalSchema = CreateGoalSchema.partial().extend({
  id: z.cuid(),
});

const DeleteGoalSchema = z.object({
  id: z.cuid(),
});

// Helper function to get current user
async function getCurrentUser() {
  const session = await auth.api.getSession({
    headers: new Headers(),
  });

  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  return session.user;
}

// Create a new learning goal
export async function createGoal(formData: FormData) {
  try {
    const user = await getCurrentUser();

    // Parse and validate form data
    const rawData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      tags: formData.get('tags')
        ? JSON.parse(formData.get('tags') as string)
        : [],
      deadline: formData.get('deadline') as string,
      status: (formData.get('status') as string) || 'active',
    };

    const validatedData = CreateGoalSchema.parse(rawData);

    // Create the goal
    const goal = await prisma.learningGoal.create({
      data: {
        ...validatedData,
        userId: user.id,
        progress: 0,
      },
      include: {
        tasks: true,
        aiContent: true,
      },
    });

    revalidatePath('/dashboard');
    return { success: true, goal };
  } catch (error) {
    console.error('Error creating goal:', error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Validation failed',
        details: error.message,
      };
    }

    return {
      success: false,
      error: 'Failed to create goal',
    };
  }
}

// Update an existing learning goal
export async function updateGoal(formData: FormData) {
  try {
    const user = await getCurrentUser();

    // Parse and validate form data
    const rawData = {
      id: formData.get('id') as string,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      tags: formData.get('tags')
        ? JSON.parse(formData.get('tags') as string)
        : [],
      deadline: formData.get('deadline') as string,
      status: formData.get('status') as string,
    };

    const validatedData = UpdateGoalSchema.parse(rawData);

    // Check if goal belongs to user
    const existingGoal = await prisma.learningGoal.findFirst({
      where: {
        id: validatedData.id,
        userId: user.id,
      },
    });

    if (!existingGoal) {
      return {
        success: false,
        error: 'Goal not found or access denied',
      };
    }

    // Update the goal
    const goal = await prisma.learningGoal.update({
      where: { id: validatedData.id },
      data: {
        ...validatedData,
        id: undefined, // Remove id from update data
      },
      include: {
        tasks: true,
        aiContent: true,
      },
    });

    revalidatePath('/dashboard');
    return { success: true, goal };
  } catch (error) {
    console.error('Error updating goal:', error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Validation failed',
        details: error.message,
      };
    }

    return {
      success: false,
      error: 'Failed to update goal',
    };
  }
}

// Delete a learning goal
export async function deleteGoal(formData: FormData) {
  try {
    const user = await getCurrentUser();

    const rawData = {
      id: formData.get('id') as string,
    };

    const validatedData = DeleteGoalSchema.parse(rawData);

    // Check if goal belongs to user
    const existingGoal = await prisma.learningGoal.findFirst({
      where: {
        id: validatedData.id,
        userId: user.id,
      },
    });

    if (!existingGoal) {
      return {
        success: false,
        error: 'Goal not found or access denied',
      };
    }

    // Delete the goal (cascade will handle tasks and aiContent)
    await prisma.learningGoal.delete({
      where: { id: validatedData.id },
    });

    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Error deleting goal:', error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Validation failed',
        details: error.message,
      };
    }

    return {
      success: false,
      error: 'Failed to delete goal',
    };
  }
}

// Get all goals for the current user
export async function getUserGoals() {
  try {
    const user = await getCurrentUser();

    const goals = await prisma.learningGoal.findMany({
      where: { userId: user.id },
      include: {
        tasks: {
          orderBy: { createdAt: 'asc' },
        },
        aiContent: {
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return { success: true, goals };
  } catch (error) {
    console.error('Error fetching goals:', error);
    return {
      success: false,
      error: 'Failed to fetch goals',
      goals: [],
    };
  }
}

// Get a single goal by ID
export async function getGoalById(goalId: string) {
  try {
    const user = await getCurrentUser();

    const goal = await prisma.learningGoal.findFirst({
      where: {
        id: goalId,
        userId: user.id,
      },
      include: {
        tasks: {
          orderBy: { createdAt: 'asc' },
        },
        aiContent: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!goal) {
      return {
        success: false,
        error: 'Goal not found or access denied',
      };
    }

    return { success: true, goal };
  } catch (error) {
    console.error('Error fetching goal:', error);
    return {
      success: false,
      error: 'Failed to fetch goal',
    };
  }
}

// Update goal progress
export async function updateGoalProgress(formData: FormData) {
  try {
    const user = await getCurrentUser();

    const goalId = formData.get('goalId') as string;
    const progress = parseInt(formData.get('progress') as string);

    if (isNaN(progress) || progress < 0 || progress > 100) {
      return {
        success: false,
        error: 'Progress must be a number between 0 and 100',
      };
    }

    // Check if goal belongs to user
    const existingGoal = await prisma.learningGoal.findFirst({
      where: {
        id: goalId,
        userId: user.id,
      },
    });

    if (!existingGoal) {
      return {
        success: false,
        error: 'Goal not found or access denied',
      };
    }

    // Update progress and status
    const newStatus =
      progress === 100
        ? 'completed'
        : existingGoal.status === 'completed'
          ? 'active'
          : existingGoal.status;

    const goal = await prisma.learningGoal.update({
      where: { id: goalId },
      data: {
        progress,
        status: newStatus,
      },
      include: {
        tasks: true,
        aiContent: true,
      },
    });

    revalidatePath('/dashboard');
    return { success: true, goal };
  } catch (error) {
    console.error('Error updating goal progress:', error);
    return {
      success: false,
      error: 'Failed to update goal progress',
    };
  }
}
