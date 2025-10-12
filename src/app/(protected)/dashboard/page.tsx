import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GoalCard } from './_components/card-goal';

const goals = [
  {
    id: '1',
    title: 'Master React & TypeScript',
    description: 'Build advanced web applications with modern React patterns',
    progress: 65,
    category: 'Development',
  },
  {
    id: '2',
    title: 'Learn Data Structures',
    description:
      'Master algorithms and data structures for technical interviews',
    progress: 42,
    category: 'Computer Science',
  },
  {
    id: '3',
    title: 'UI/UX Design Fundamentals',
    description: 'Create beautiful and intuitive user interfaces',
    progress: 78,
    category: 'Design',
  },
];

export default function DashboardPage() {
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
        <Button size="lg" className="gap-2">
          <Plus className="h-5 w-5" />
          Add Goal
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Goals Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid gap-6">
            {goals.map(goal => (
              <GoalCard key={goal.id} {...goal} />
            ))}
          </div>
        </div>

        {/* AI Insights Section */}
        <div className="lg:col-span-1">{/* <AIInsights /> */}</div>
      </div>
    </div>
  );
}
