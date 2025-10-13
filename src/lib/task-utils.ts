import { Task, TaskPriority } from '@/generated/prisma';

export type TaskWithGoal = Task & {
  learningGoal: {
    id: string;
    title: string;
    slug: string;
  };
};

/**
 * Sort tasks by priority and deadline
 * Order: Incomplete first, then by priority (high > medium > low), then by due date (earliest first), then by creation date
 */
export function sortTasksByPriorityAndDeadline(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    // First, sort by completion status (incomplete first)
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }

    // Then by priority (high, medium, low)
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    const aPriority =
      priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
    const bPriority =
      priorityOrder[b.priority as keyof typeof priorityOrder] || 0;

    if (aPriority !== bPriority) {
      return bPriority - aPriority; // Higher priority first
    }

    // Then by due date (earliest first, null dates last)
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    if (a.dueDate && !b.dueDate) return -1;
    if (!a.dueDate && b.dueDate) return 1;

    // Finally by creation date (oldest first)
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });
}

/**
 * Get priority color for UI display
 */
export function getPriorityColor(
  priority: TaskPriority
): 'destructive' | 'default' | 'secondary' {
  switch (priority) {
    case 'high':
      return 'destructive';
    case 'medium':
      return 'default';
    case 'low':
      return 'secondary';
    default:
      return 'default';
  }
}

/**
 * Get priority label for display
 */
export function getPriorityLabel(priority: TaskPriority): string {
  switch (priority) {
    case 'high':
      return 'High';
    case 'medium':
      return 'Medium';
    case 'low':
      return 'Low';
    default:
      return 'Medium';
  }
}

/**
 * Check if a task is overdue
 */
export function isTaskOverdue(task: Task): boolean {
  if (!task.dueDate || task.completed) return false;
  return new Date(task.dueDate) < new Date();
}

/**
 * Check if a task is due soon (within 3 days)
 */
export function isTaskDueSoon(task: Task): boolean {
  if (!task.dueDate || task.completed) return false;
  const today = new Date();
  const dueDate = new Date(task.dueDate);
  const diffTime = dueDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays >= 0 && diffDays <= 3;
}

/**
 * Get days until due date
 */
export function getDaysUntilDue(task: Task): number | null {
  if (!task.dueDate) return null;
  const today = new Date();
  const dueDate = new Date(task.dueDate);
  const diffTime = dueDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
