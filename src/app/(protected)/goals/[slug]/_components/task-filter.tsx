'use client';

import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type FilterType = 'all' | 'completed' | 'pending';

export function TaskFilter() {
  const [filter, setFilter] = useState<FilterType>('all');

  return (
    <Select
      value={filter}
      onValueChange={(value: FilterType) => setFilter(value)}
    >
      <SelectTrigger className="w-[140px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Tasks</SelectItem>
        <SelectItem value="pending">Pending</SelectItem>
        <SelectItem value="completed">Completed</SelectItem>
      </SelectContent>
    </Select>
  );
}
