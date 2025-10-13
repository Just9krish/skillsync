'use server';

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth-utils';

const SearchSchema = z.object({
  query: z.string().min(1, 'Search query is required'),
  limit: z.number().min(1).max(50).default(10),
});

export async function searchGoalsAndTasks(data: {
  query: string;
  limit?: number;
}) {
  try {
    const user = await getCurrentUser();
    const { query, limit = 10 } = SearchSchema.parse(data);

    // Search goals
    const goals = await prisma.learningGoal.findMany({
      where: {
        userId: user.id,
        OR: [
          {
            title: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            tags: {
              hasSome: [query],
            },
          },
        ],
      },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        progress: true,
        status: true,
        createdAt: true,
        _count: {
          select: {
            tasks: true,
          },
        },
      },
      take: Math.ceil(limit / 2),
    });

    // Search tasks
    const tasks = await prisma.task.findMany({
      where: {
        learningGoal: {
          userId: user.id,
        },
        OR: [
          {
            title: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        completed: true,
        priority: true,
        dueDate: true,
        createdAt: true,
        learningGoal: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
      take: Math.ceil(limit / 2),
    });

    return {
      success: true,
      results: {
        goals: goals.map(goal => ({
          ...goal,
          type: 'goal' as const,
        })),
        tasks: tasks.map(task => ({
          ...task,
          type: 'task' as const,
        })),
      },
    };
  } catch (error) {
    console.error('Error searching:', error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Invalid search parameters',
        details: error.message,
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Search failed',
      results: {
        goals: [],
        tasks: [],
      },
    };
  }
}
