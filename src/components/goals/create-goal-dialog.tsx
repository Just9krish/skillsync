'use client';

import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createGoal } from '@/actions/goals';

// Form validation schema
const createGoalSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title must be less than 100 characters'),
  description: z.string().optional(),
  tags: z.string().optional(),
  deadline: z.string().optional(),
  status: z.enum(['active', 'paused', 'cancelled']),
});

type CreateGoalFormData = z.infer<typeof createGoalSchema>;

export function CreateGoalDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="gap-2">
          <Plus className="h-5 w-5" />
          Add Goal
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Learning Goal</DialogTitle>
          <DialogDescription>
            Set up a new learning goal to track your progress and stay
            motivated.
          </DialogDescription>
        </DialogHeader>
        <CreateGoalForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

interface CreateGoalFormProps {
  onSuccess: () => void;
}

function CreateGoalForm({ onSuccess }: CreateGoalFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateGoalFormData>({
    resolver: zodResolver(createGoalSchema),
    defaultValues: {
      title: '',
      description: '',
      tags: '',
      deadline: '',
      status: 'active' as const,
    },
  });

  const onSubmit = async (data: CreateGoalFormData) => {
    setIsSubmitting(true);

    try {
      const result = await createGoal(data);

      if (result.success) {
        form.reset();
        onSuccess();
      } else {
        // Handle error - you could show a toast notification here
        console.error('Error creating goal:', result.error);
      }
    } catch (error) {
      console.error('Error creating goal:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title *</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Master React and TypeScript"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe what you want to achieve..."
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., react, typescript, frontend"
                  {...field}
                />
              </FormControl>
              <FormDescription>Separate tags with commas</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="deadline"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deadline</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onSuccess()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Goal'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
