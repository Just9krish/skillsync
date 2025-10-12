import { CreateGoalDialog } from '@/components/goals/create-goal-dialog';
import { GoalCard } from './_components/card-goal';
import { getUserGoals } from '@/actions/goals';

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
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-12 h-12 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">No goals yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first learning goal to get started
              </p>
              <CreateGoalDialog />
            </div>
          )}
        </div>

        {/* AI Insights Section */}
        <div className="lg:col-span-1">{/* <AIInsights /> */}</div>
      </div>
    </div>
  );
}
