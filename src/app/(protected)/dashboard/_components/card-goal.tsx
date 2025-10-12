'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Sparkles } from 'lucide-react';

interface GoalCardProps {
  title: string;
  description: string;
  progress: number;
  category: string;
  id: string;
}

export const GoalCard = ({
  title,
  description,
  progress,
  category,
  id,
}: GoalCardProps) => {
  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-300 border border-border bg-gradient-to-br from-card to-card/50">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <h3 className="font-semibold text-lg">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <Badge variant="secondary" className="ml-2">
            {category}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" className="flex-1">
            <Sparkles className="h-4 w-4" />
            AI Suggest
          </Button>
          <Button variant="outline" size="sm">
            View Details
          </Button>
        </div>
      </div>
    </Card>
  );
};
