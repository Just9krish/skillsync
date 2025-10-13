'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from 'react';
import { useRouter } from 'next/navigation';
import { searchGoalsAndTasks } from '@/actions/search';
import { toast } from 'sonner';

export interface SearchResult {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  type: 'goal' | 'task';
  // Goal specific fields
  progress?: number;
  status?: string;
  createdAt?: Date;
  _count?: { tasks: number };
  // Task specific fields
  completed?: boolean;
  priority?: string;
  dueDate?: Date | null;
  learningGoal?: {
    id: string;
    title: string;
    slug: string;
  };
}

interface SearchContextType {
  query: string;
  setQuery: (query: string) => void;
  results: SearchResult[];
  isSearching: boolean;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  search: (query: string) => Promise<void>;
  navigateToResult: (result: SearchResult) => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  clearSearch: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}

interface SearchProviderProps {
  children: React.ReactNode;
}

export function SearchProvider({ children }: SearchProviderProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const searchTimeoutRef = useRef<NodeJS.Timeout>(null);

  const search = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await searchGoalsAndTasks({
        query: searchQuery,
        limit: 20,
      });

      if (response.success && response.results) {
        const allResults = [
          ...response.results.goals,
          ...response.results.tasks,
        ];
        setResults(allResults);
        if (allResults.length > 0) {
          setSelectedIndex(0);
        }
      } else {
        toast.error(response.error || 'Search failed');
        setResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Search failed');
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const navigateToResult = useCallback(
    (result: SearchResult) => {
      if (result.type === 'goal') {
        router.push(`/goals/${result.slug}`);
      } else if (result.type === 'task' && result.learningGoal) {
        router.push(`/goals/${result.learningGoal.slug}`);
      }
      setIsOpen(false);
      setQuery('');
      setResults([]);
    },
    [router]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen || results.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => (prev + 1) % results.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(
            prev => (prev - 1 + results.length) % results.length
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (results[selectedIndex]) {
            navigateToResult(results[selectedIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          setIsOpen(false);
          setQuery('');
          setResults([]);
          break;
      }
    },
    [isOpen, results, selectedIndex, navigateToResult]
  );

  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    setSelectedIndex(0);
  }, []);

  // Debounced search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (query.trim()) {
      searchTimeoutRef.current = setTimeout(() => {
        search(query);
      }, 300);
    } else {
      setResults([]);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query, search]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  const value: SearchContextType = {
    query,
    setQuery,
    results,
    isSearching,
    isOpen,
    setIsOpen,
    selectedIndex,
    setSelectedIndex,
    search,
    navigateToResult,
    handleKeyDown,
    clearSearch,
  };

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
}
