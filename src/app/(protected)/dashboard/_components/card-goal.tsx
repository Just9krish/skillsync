import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Calendar } from 'lucide-react';
import Link from 'next/link';

interface GoalCardProps {
  title: string;
  slug: string;
  description: string;
  progress: number;
  status: string;
  deadline?: Date | null;
  tags: string[];
}

export const GoalCard = ({
  title,
  slug,
  description,
  progress,
  status,
  deadline,
  tags,
}: GoalCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
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
    <Card className="p-6 hover:shadow-lg transition-all duration-300 border border-border bg-gradient-to-br from-card to-card/50">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <div className="flex items-start gap-2 mb-1">
              <Link href={`/goals/${slug}`}>
                <h3 className="font-semibold text-lg hover:text-primary transition-colors">
                  {title}
                </h3>
              </Link>
              <Badge className={`text-xs ${getStatusColor(status)}`}>
                {status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>

        {tags.length > 0 && (
          <div className="flex items-center gap-1 flex-wrap">
            {tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <span className="text-xs text-muted-foreground">
                +{tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {deadline && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Due: {formatDate(deadline)}</span>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>
    </Card>
  );
};
