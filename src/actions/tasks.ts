'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateUniqueSlug } from '@/lib/slugify';
import { headers } from 'next/headers';

// Validation schemas
const CreateTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters'),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  dueDate: z
    .string()
    .optional()
    .transform(val => (val ? new Date(val) : undefined)),
  learningGoalId: z.cuid(),
});

const UpdateTaskSchema = CreateTaskSchema.partial().extend({
  id: z.cuid(),
});

const ToggleTaskSchema = z.object({
  id: z.cuid(),
  completed: z.boolean(),
});

const DeleteTaskSchema = z.object({
  id: z.cuid(),
});

// Helper function to get current user
async function getCurrentUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  return session.user;
}

// Helper function to check if goal belongs to user
async function verifyGoalOwnership(goalId: string, userId: string) {
  const goal = await prisma.learningGoal.findFirst({
    where: {
      id: goalId,
      userId: userId,
    },
  });

  if (!goal) {
    throw new Error('Goal not found or access denied');
  }

  return goal;
}

// Create a new task
export async function createTask(data: {
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
  learningGoalId: string;
}) {
  try {
    const user = await getCurrentUser();

    const rawData = {
      title: data.title,
      description: data.description || '',
      priority: data.priority || 'medium',
      dueDate: data.dueDate || '',
      learningGoalId: data.learningGoalId,
    };

    const validatedData = CreateTaskSchema.parse(rawData);

    // Verify goal ownership
    await verifyGoalOwnership(validatedData.learningGoalId, user.id);

    // Generate unique slug for the task within the goal
    const existingTasks = await prisma.task.findMany({
      where: { learningGoalId: validatedData.learningGoalId },
      select: { slug: true },
    });
    const existingSlugList = existingTasks.map(task => task.slug);
    const slug = generateUniqueSlug(validatedData.title, existingSlugList);

    // Create the task
    const task = await prisma.task.create({
      data: {
        ...validatedData,
        slug,
        completed: false,
      },
    });

    // Update goal progress based on completed tasks
    await updateGoalProgress(validatedData.learningGoalId);

    // Get goal slug for revalidation
    const goal = await prisma.learningGoal.findUnique({
      where: { id: validatedData.learningGoalId },
      select: { slug: true },
    });

    revalidatePath('/dashboard');
    if (goal) {
      revalidatePath(`/goals/${goal.slug}`);
    }
    return { success: true, task };
  } catch (error) {
    console.error('Error creating task:', error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Validation failed',
        details: error.message,
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create task',
    };
  }
}

// Update an existing task
export async function updateTask(data: {
  id: string;
  title?: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
  learningGoalId?: string;
}) {
  try {
    const user = await getCurrentUser();

    const rawData = {
      id: data.id,
      title: data.title || '',
      description: data.description || '',
      priority: data.priority || 'medium',
      dueDate: data.dueDate || '',
      learningGoalId: data.learningGoalId || '',
    };

    const validatedData = UpdateTaskSchema.parse(rawData);

    // Get the task and verify ownership through goal
    const task = await prisma.task.findFirst({
      where: { id: validatedData.id },
      include: { learningGoal: true },
    });

    if (!task || task.learningGoal.userId !== user.id) {
      return {
        success: false,
        error: 'Task not found or access denied',
      };
    }

    // Generate new slug if title is being updated
    let updateData: any = { ...validatedData, id: undefined };
    if (validatedData.title && validatedData.title !== task.title) {
      const existingTasks = await prisma.task.findMany({
        where: {
          learningGoalId: task.learningGoalId,
          id: { not: validatedData.id },
        },
        select: { slug: true },
      });
      const existingSlugList = existingTasks.map(t => t.slug);
      const newSlug = generateUniqueSlug(validatedData.title, existingSlugList);
      updateData.slug = newSlug;
    }

    // Update the task
    const updatedTask = await prisma.task.update({
      where: { id: validatedData.id },
      data: updateData,
    });

    // Update goal progress
    await updateGoalProgress(task.learningGoalId);

    // Get goal slug for revalidation
    const goal = await prisma.learningGoal.findUnique({
      where: { id: task.learningGoalId },
      select: { slug: true },
    });

    revalidatePath('/dashboard');
    if (goal) {
      revalidatePath(`/goals/${goal.slug}`);
    }
    return { success: true, task: updatedTask };
  } catch (error) {
    console.error('Error updating task:', error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Validation failed',
        details: error.message,
      };
    }

    return {
      success: false,
      error: 'Failed to update task',
    };
  }
}

// Toggle task completion
export async function toggleTaskCompletion(data: {
  id: string;
  completed: boolean;
}) {
  try {
    const user = await getCurrentUser();

    const validatedData = ToggleTaskSchema.parse(data);

    // Get the task and verify ownership through goal
    const task = await prisma.task.findFirst({
      where: { id: validatedData.id },
      include: { learningGoal: true },
    });

    if (!task || task.learningGoal.userId !== user.id) {
      return {
        success: false,
        error: 'Task not found or access denied',
      };
    }

    // Update the task
    const updatedTask = await prisma.task.update({
      where: { id: validatedData.id },
      data: { completed: validatedData.completed },
    });

    // Update goal progress
    await updateGoalProgress(task.learningGoalId);

    // Get goal slug for revalidation
    const goal = await prisma.learningGoal.findUnique({
      where: { id: task.learningGoalId },
      select: { slug: true },
    });

    revalidatePath('/dashboard');
    if (goal) {
      revalidatePath(`/goals/${goal.slug}`);
    }
    return { success: true, task: updatedTask };
  } catch (error) {
    console.error('Error toggling task completion:', error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Validation failed',
        details: error.message,
      };
    }

    return {
      success: false,
      error: 'Failed to toggle task completion',
    };
  }
}

// Delete a task
export async function deleteTask(data: { id: string }) {
  try {
    const user = await getCurrentUser();

    const validatedData = DeleteTaskSchema.parse(data);

    // Get the task and verify ownership through goal
    const task = await prisma.task.findFirst({
      where: { id: validatedData.id },
      include: { learningGoal: true },
    });

    if (!task || task.learningGoal.userId !== user.id) {
      return {
        success: false,
        error: 'Task not found or access denied',
      };
    }

    // Delete the task
    await prisma.task.delete({
      where: { id: validatedData.id },
    });

    // Update goal progress
    await updateGoalProgress(task.learningGoalId);

    // Get goal slug for revalidation
    const goal = await prisma.learningGoal.findUnique({
      where: { id: task.learningGoalId },
      select: { slug: true },
    });

    revalidatePath('/dashboard');
    if (goal) {
      revalidatePath(`/goals/${goal.slug}`);
    }
    return { success: true };
  } catch (error) {
    console.error('Error deleting task:', error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Validation failed',
        details: error.message,
      };
    }

    return {
      success: false,
      error: 'Failed to delete task',
    };
  }
}

// Helper function to update goal progress based on completed tasks
async function updateGoalProgress(goalId: string) {
  try {
    const tasks = await prisma.task.findMany({
      where: { learningGoalId: goalId },
    });

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;

    const progress =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Update goal progress and status
    const newStatus = progress === 100 ? 'completed' : 'active';

    await prisma.learningGoal.update({
      where: { id: goalId },
      data: {
        progress,
        status: newStatus,
      },
    });
  } catch (error) {
    console.error('Error updating goal progress:', error);
  }
}

// Get tasks for a specific goal
export async function getTasksByGoalId(goalId: string) {
  try {
    const user = await getCurrentUser();

    // Verify goal ownership
    await verifyGoalOwnership(goalId, user.id);

    const tasks = await prisma.task.findMany({
      where: { learningGoalId: goalId },
      orderBy: [
        { completed: 'asc' },
        { priority: 'desc' },
        { dueDate: 'asc' },
        { createdAt: 'asc' },
      ],
    });

    return { success: true, tasks };
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch tasks',
      tasks: [],
    };
  }
}
