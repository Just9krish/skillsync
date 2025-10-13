'use client';

import { SearchResult } from '@/context/search-context';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, Target, CheckSquare, Clock } from 'lucide-react';
import {
  getPriorityColor,
  isTaskOverdue,
  isTaskDueSoon,
} from '@/lib/task-utils';
import { cn } from '@/lib/utils';
import { formatShortDate } from '@/lib/date-utils';

interface SearchResultsProps {
  results: SearchResult[];
  selectedIndex: number;
  onResultClick: (result: SearchResult) => void;
  isSearching: boolean;
}

export function SearchResults({
  results,
  selectedIndex,
  onResultClick,
  isSearching,
}: SearchResultsProps) {
  if (isSearching) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground">
        <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2" />
        Searching...
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground">
        No results found
      </div>
    );
  }

  return (
    <div className="max-h-96 overflow-y-auto">
      {results.map((result, index) => (
        <SearchResultItem
          key={`${result.type}-${result.id}`}
          result={result}
          isSelected={index === selectedIndex}
          onClick={() => onResultClick(result)}
        />
      ))}
    </div>
  );
}

interface SearchResultItemProps {
  result: SearchResult;
  isSelected: boolean;
  onClick: () => void;
}

function SearchResultItem({
  result,
  isSelected,
  onClick,
}: SearchResultItemProps) {
  if (result.type === 'goal') {
    return (
      <div
        className={cn(
          'p-3 cursor-pointer border-b border-border hover:bg-accent/50 transition-colors',
          isSelected && 'bg-accent'
        )}
        onClick={onClick}
      >
        <div className="flex items-start gap-3">
          <Target className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium text-sm truncate">{result.title}</h4>
              <Badge variant="outline" className="text-xs">
                Goal
              </Badge>
            </div>
            {result.description && (
              <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                {result.description}
              </p>
            )}
            <div className="text-xs text-muted-foreground">
              {result._count && <span>{result._count.tasks} tasks</span>}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Task result
  return (
    <div
      className={cn(
        'p-3 cursor-pointer border-b border-border hover:bg-accent/50 transition-colors',
        isSelected && 'bg-accent'
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <CheckSquare className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4
              className={cn(
                'font-medium text-sm truncate',
                result.completed && 'line-through text-muted-foreground'
              )}
            >
              {result.title}
            </h4>
            <Badge variant="outline" className="text-xs">
              Task
            </Badge>
            {result.priority && (
              <Badge
                variant={getPriorityColor(result.priority as any)}
                className="text-xs"
              >
                {result.priority}
              </Badge>
            )}
          </div>
          {result.description && (
            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
              {result.description}
            </p>
          )}
          <div className="text-xs text-muted-foreground">
            {result.learningGoal && <span>in {result.learningGoal.title}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
