'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { generateUniqueSlug } from '@/lib/slugify';
import { getCurrentUser } from '@/lib/auth-utils';

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


// Create a new learning goal
export async function createGoal(data: {
  title: string;
  description?: string;
  tags?: string;
  deadline?: string;
  status?: 'active' | 'paused' | 'cancelled';
}) {
  try {
    const user = await getCurrentUser();

    // Parse and validate form data
    const tags = data.tags
      ? data.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)
      : [];

    const rawData = {
      title: data.title,
      description: data.description || '',
      tags,
      deadline: data.deadline || '',
      status: data.status || 'active',
    };

    const validatedData = CreateGoalSchema.parse(rawData);

    // Generate unique slug
    const existingSlugs = await prisma.learningGoal.findMany({
      select: { slug: true },
    });
    const existingSlugList = existingSlugs.map(goal => goal.slug);
    const slug = generateUniqueSlug(validatedData.title, existingSlugList);

    // Create the goal
    const goal = await prisma.learningGoal.create({
      data: {
        ...validatedData,
        slug,
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
export async function updateGoal(data: {
  id: string;
  title?: string;
  description?: string;
  tags?: string[];
  deadline?: string;
  status?: 'active' | 'completed' | 'paused' | 'cancelled';
}) {
  try {
    const user = await getCurrentUser();

    const validatedData = UpdateGoalSchema.parse(data);

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

    // Generate new slug if title is being updated
    let updateData: any = { ...validatedData, id: undefined };
    if (validatedData.title && validatedData.title !== existingGoal.title) {
      const existingSlugs = await prisma.learningGoal.findMany({
        select: { slug: true },
        where: { id: { not: validatedData.id } },
      });
      const existingSlugList = existingSlugs.map(goal => goal.slug);
      const newSlug = generateUniqueSlug(validatedData.title, existingSlugList);
      updateData.slug = newSlug;
    }

    // Update the goal
    const goal = await prisma.learningGoal.update({
      where: { id: validatedData.id },
      data: updateData,
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
export async function deleteGoal(data: { id: string; }) {
  try {
    const user = await getCurrentUser();

    const validatedData = DeleteGoalSchema.parse(data);

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

// Get a single goal by slug
export async function getGoalBySlug(slug: string) {
  try {
    const user = await getCurrentUser();

    const goal = await prisma.learningGoal.findFirst({
      where: {
        slug,
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
export async function updateGoalProgress(data: {
  goalId: string;
  progress: number;
}) {
  try {
    const user = await getCurrentUser();

    const { goalId, progress } = data;

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
