import { CreateGoalDialog } from '@/components/goals/create-goal-dialog';
import { GoalCard } from './_components/card-goal';
import { getUserGoals } from '@/actions/goals';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Target } from 'lucide-react';

export default async function DashboardPage() {
  const { goals } = await getUserGoals();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
          <p className="text-muted-foreground">
            Continue your learning journey and track your progress
          </p>
        </div>
        <CreateGoalDialog />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Goals Section */}
        <div className="lg:col-span-2 space-y-6">
          {goals.length > 0 ? (
            <div className="grid gap-6">
              {goals.map(goal => (
                <GoalCard
                  key={goal.id}
                  title={goal.title}
                  slug={goal.slug}
                  description={goal.description || ''}
                  progress={goal.progress}
                  status={goal.status}
                  deadline={goal.deadline}
                  tags={goal.tags}
                />
              ))}
            </div>
          ) : (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Target className="h-6 w-6" />
                </EmptyMedia>
                <EmptyTitle>No goals yet</EmptyTitle>
                <EmptyDescription>
                  Create your first learning goal to get started on your
                  journey.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <CreateGoalDialog />
              </EmptyContent>
            </Empty>
          )}
        </div>

        {/* AI Insights Section - Coming Soon */}
        {/* <div className="lg:col-span-1">
          <AIInsights />
        </div> */}
      </div>
    </div>
  );
}
