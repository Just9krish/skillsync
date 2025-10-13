import { notFound } from 'next/navigation';
import { getGoalBySlug } from '@/actions/goals';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import {
  Sparkles,
  Calendar,
  Clock,
  Tag,
  AlertCircle,
  CheckSquare,
} from 'lucide-react';
import { AddTaskDialog } from './_components/add-task-dialog';
import { TaskItem } from './_components/task-item';
import { sortTasksByPriorityAndDeadline } from '@/lib/task-utils';

interface GoalPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function GoalDetail({ params }: GoalPageProps) {
  const { slug } = await params;
  const { goal } = await getGoalBySlug(slug);

  if (!goal) {
    notFound();
  }

  const completedTasks = goal.tasks.filter(task => task.completed).length;
  const progress =
    goal.tasks.length > 0 ? (completedTasks / goal.tasks.length) * 100 : 0;

  // Sort tasks by priority and deadline
  const sortedTasks = sortTasksByPriorityAndDeadline(goal.tasks);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getDaysUntil = (date: Date) => {
    const today = new Date();
    const target = new Date(date);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-3xl font-bold">{goal.title}</h1>
                <Badge
                  variant={goal.status === 'active' ? 'default' : 'secondary'}
                >
                  {goal.status}
                </Badge>
              </div>
              {goal.description && (
                <p className="text-muted-foreground mt-2  ">
                  {goal.description}
                </p>
              )}
            </div>

            {/* Tags */}
            {goal.tags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                {goal.tags.map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {goal.deadline && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">Deadline</p>
                    <p className="font-medium">{formatDate(goal.deadline)}</p>
                    <p className="text-xs text-muted-foreground">
                      {getDaysUntil(goal.deadline) > 0
                        ? `${getDaysUntil(goal.deadline)} days left`
                        : 'Overdue'}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Created</p>
                  <p className="font-medium">{formatDate(goal.createdAt)}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Tasks</p>
                  <p className="font-medium">
                    {completedTasks} / {goal.tasks.length} completed
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Circle */}
          <div className="text-center flex-shrink-0">
            <div className="relative inline-flex h-32 w-32">
              <svg className="h-full w-full -rotate-90">
                <circle
                  className="text-muted stroke-current"
                  strokeWidth="10"
                  fill="transparent"
                  r="56"
                  cx="64"
                  cy="64"
                />
                <circle
                  className="text-primary stroke-current transition-all duration-300"
                  strokeWidth="10"
                  strokeLinecap="round"
                  fill="transparent"
                  r="56"
                  cx="64"
                  cy="64"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${2 * Math.PI * 56 * (1 - progress / 100)}`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold">
                  {Math.round(progress)}%
                </span>
                <span className="text-xs text-muted-foreground">Complete</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Tasks Section */}
        <div className="lg:col-span-2">
          <Card className="p-6 border-border  ">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold">Tasks</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {completedTasks} of {goal.tasks.length} tasks completed
                </p>
              </div>
              <div className="flex items-center gap-2">
                <AddTaskDialog goalId={goal.id} />
              </div>
            </div>

            {goal.tasks.length > 0 && (
              <div className="mb-6">
                <Progress value={progress} className="h-2" />
              </div>
            )}

            {/* Tasks List */}
            <div className="space-y-3">
              {goal.tasks.length === 0 ? (
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <CheckSquare className="h-6 w-6" />
                    </EmptyMedia>
                    <EmptyTitle>No tasks yet</EmptyTitle>
                    <EmptyDescription>
                      Add your first task to get started on this goal.
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              ) : (
                sortedTasks.map(task => <TaskItem key={task.id} task={task} />)
              )}
            </div>
          </Card>
        </div>

        {/* AI Learning Path */}
        <div className="lg:col-span-1">
          <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">AI Learning Path</h3>
            </div>

            {goal.aiContent.length > 0 ? (
              <div className="space-y-3">
                {goal.aiContent.map((content, index) => (
                  <div key={content.id} className="flex gap-3">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">
                      {index + 1}
                    </div>
                    <p className="text-sm">{content.title}</p>
                  </div>
                ))}
              </div>
            ) : (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Sparkles className="h-6 w-6" />
                  </EmptyMedia>
                  <EmptyTitle>No AI content generated yet</EmptyTitle>
                  <EmptyDescription>
                    Generate an AI-powered learning path for this goal.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}

            <button className="w-full mt-6 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium transition-colors">
              <Sparkles className="h-4 w-4 mr-2 inline" />
              Generate AI Path
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
}
