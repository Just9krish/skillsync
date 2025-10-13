'use client';

import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Trash2 } from 'lucide-react';
import { toggleTaskCompletion, deleteTask } from '@/actions/tasks';
import { toast } from 'sonner';

interface TaskItemProps {
  task: {
    id: string;
    title: string;
    description: string | null;
    completed: boolean;
    priority: string;
    dueDate: Date | null;
    createdAt: Date;
    updatedAt: Date;
  };
}

export function TaskItem({ task }: TaskItemProps) {
  const [isToggling, setIsToggling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggle = async () => {
    setIsToggling(true);
    try {
      const result = await toggleTaskCompletion({
        id: task.id,
        completed: !task.completed,
      });

      if (!result.success) {
        toast.error(result.error || 'Failed to update task');
        console.error('Error toggling task:', result.error);
      } else {
        toast.success(
          `Task ${!task.completed ? 'completed' : 'marked as pending'}`
        );
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Error toggling task:', error);
    } finally {
      setIsToggling(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    setIsDeleting(true);
    try {
      const result = await deleteTask({ id: task.id });

      if (!result.success) {
        toast.error(result.error || 'Failed to delete task');
        console.error('Error deleting task:', result.error);
      } else {
        toast.success('Task deleted successfully');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Error deleting task:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const getPriorityColor = (priority: string) => {
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
  };

  const formatDate = (date: Date | null) => {
    if (!date) return null;
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(date));
  };

  const getDaysUntil = (date: Date | null) => {
    if (!date) return null;
    const today = new Date();
    const target = new Date(date);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="group p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-accent/30 transition-all">
      <div className="flex items-start gap-3">
        <Checkbox
          checked={task.completed}
          onCheckedChange={handleToggle}
          disabled={isToggling}
          className="mt-1"
        />

        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <h4
                className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}
              >
                {task.title}
              </h4>
              {task.description && (
                <p
                  className={`text-sm mt-1 ${task.completed ? 'line-through text-muted-foreground' : 'text-muted-foreground'}`}
                >
                  {task.description}
                </p>
              )}
            </div>

            <Badge
              variant={getPriorityColor(task.priority) as any}
              className="flex-shrink-0"
            >
              {task.priority}
            </Badge>
          </div>

          {task.dueDate && (
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>Due: {formatDate(task.dueDate)}</span>
                {!task.completed &&
                  getDaysUntil(task.dueDate) &&
                  getDaysUntil(task.dueDate)! < 3 &&
                  getDaysUntil(task.dueDate)! >= 0 && (
                    <Badge variant="destructive" className="ml-2 text-xs">
                      Due soon
                    </Badge>
                  )}
                {!task.completed &&
                  getDaysUntil(task.dueDate) &&
                  getDaysUntil(task.dueDate)! < 0 && (
                    <Badge variant="destructive" className="ml-2 text-xs">
                      Overdue
                    </Badge>
                  )}
              </div>
            </div>
          )}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          disabled={isDeleting}
          className="text-destructive hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
