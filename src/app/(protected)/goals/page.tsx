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
import { Target, Calendar } from 'lucide-react';
import Link from 'next/link';
import { getUserGoals } from '@/actions/goals';
import { CreateGoalDialog } from '@/components/goals/create-goal-dialog';

export default async function Goals() {
  const { goals } = await getUserGoals();

  return (
    <div className="">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Goals</h1>
          <p className="text-muted-foreground">
            Track and manage all your learning goals
          </p>
        </div>
        <CreateGoalDialog />
      </div>

      {/* Goals Grid */}
      {goals.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {goals.map(goal => (
            <Link key={goal.id} href={`/goals/${goal.slug}`}>
              <Card className="p-6 hover:shadow-lg transition-all duration-300 h-full cursor-pointer group">
                <div className="flex items-start justify-between mb-4">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Target className="h-6 w-6 text-foreground" />
                  </div>
                  <Badge variant="secondary">{goal.tags[0] || 'General'}</Badge>
                </div>

                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  {goal.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {goal.description || 'No description provided'}
                </p>

                {goal.tags.length > 0 && (
                  <div className="flex items-center gap-1 flex-wrap mb-4">
                    {goal.tags.slice(0, 2).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {goal.tags.length > 2 && (
                      <span className="text-xs text-muted-foreground">
                        +{goal.tags.length - 2} more
                      </span>
                    )}
                  </div>
                )}

                {goal.deadline && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Due: {new Date(goal.deadline).toLocaleDateString()}
                    </span>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{goal.progress}%</span>
                  </div>
                  <Progress value={goal.progress} className="h-2" />
                </div>
              </Card>
            </Link>
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
              Create your first learning goal to get started on your journey.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <CreateGoalDialog />
          </EmptyContent>
        </Empty>
      )}
    </div>
  );
}
