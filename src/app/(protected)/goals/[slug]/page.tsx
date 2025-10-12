import { notFound } from 'next/navigation';
import { getGoalBySlug } from '@/actions/goals';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Calendar, Circle } from 'lucide-react';
import { AddTaskDialog } from './_components/add-task-dialog';
import { TaskItem } from './_components/task-item';

interface GoalPageProps {
  params: {
    slug: string;
  };
}

export default async function GoalDetail({ params }: GoalPageProps) {
  const { goal } = await getGoalBySlug(params.slug);

  if (!goal) {
    notFound();
  }

  const completedTasks = goal.tasks.filter(task => task.completed).length;
  const progress =
    goal.tasks.length > 0 ? (completedTasks / goal.tasks.length) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
        <div className="flex items-start justify-between mb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">{goal.title}</h1>
              <Badge variant="secondary">{goal.tags[0] || 'General'}</Badge>
            </div>
            <p className="text-muted-foreground">
              {goal.description || 'No description provided'}
            </p>
            {goal.deadline && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Due: {new Date(goal.deadline).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          <div className="text-center">
            <div className="relative inline-flex h-24 w-24">
              <svg className="h-full w-full -rotate-90">
                <circle
                  className="text-muted stroke-current"
                  strokeWidth="8"
                  fill="transparent"
                  r="40"
                  cx="48"
                  cy="48"
                />
                <circle
                  className="text-primary stroke-current"
                  strokeWidth="8"
                  strokeLinecap="round"
                  fill="transparent"
                  r="40"
                  cx="48"
                  cy="48"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - progress / 100)}`}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xl font-bold">
                {Math.round(progress)}%
              </span>
            </div>
          </div>
        </div>

        {goal.tags.length > 0 && (
          <div className="flex items-center gap-1 flex-wrap">
            {goal.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Tasks Section */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Tasks</h2>
              <AddTaskDialog goalId={goal.id} />
            </div>

            <div className="space-y-3">
              {goal.tasks.length > 0 ? (
                goal.tasks.map(task => <TaskItem key={task.id} task={task} />)
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Circle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No tasks yet. Add your first task to get started!</p>
                </div>
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
              <div className="text-center py-4 text-muted-foreground">
                <p className="text-sm">No AI content generated yet</p>
              </div>
            )}

            <Button className="w-full mt-6">
              <Sparkles className="h-4 w-4 mr-2" />
              Generate AI Path
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
