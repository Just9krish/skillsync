'use client';

import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Trash2 } from 'lucide-react';
import { toggleTaskCompletion, deleteTask } from '@/actions/tasks';

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
      await toggleTaskCompletion({
        id: task.id,
        completed: !task.completed,
      });
    } catch (error) {
      console.error('Error toggling task:', error);
    } finally {
      setIsToggling(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    setIsDeleting(true);
    try {
      await deleteTask({ id: task.id });
    } catch (error) {
      console.error('Error deleting task:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
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

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors">
      <Checkbox
        checked={task.completed}
        onCheckedChange={handleToggle}
        disabled={isToggling}
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span
            className={`${
              task.completed ? 'line-through text-muted-foreground' : ''
            }`}
          >
            {task.title}
          </span>
          <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </Badge>
        </div>

        {task.description && (
          <p className="text-sm text-muted-foreground">{task.description}</p>
        )}

        {task.dueDate && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
            <Calendar className="h-3 w-3" />
            <span>Due: {formatDate(task.dueDate)}</span>
          </div>
        )}
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleDelete}
        disabled={isDeleting}
        className="text-destructive hover:text-destructive"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
