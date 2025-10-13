'use client';

import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSearch } from '@/context/search-context';
import { SearchResults } from './search-results';
import { useClickOutside } from '@/hooks/use-click-outside';
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts';
import { cn } from '@/lib/utils';

export function SearchInput() {
  const {
    query,
    setQuery,
    results,
    isSearching,
    isOpen,
    setIsOpen,
    selectedIndex,
    navigateToResult,
    handleKeyDown,
    clearSearch,
  } = useSearch();

  const searchRef = useClickOutside<HTMLDivElement>(() => {
    if (isOpen) {
      setIsOpen(false);
    }
  });

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: 'k',
      metaKey: true,
      callback: () => {
        const input = document.querySelector(
          'input[placeholder="Search goals, tasks..."]'
        ) as HTMLInputElement;
        if (input) {
          input.focus();
        }
      },
    },
    {
      key: 'Escape',
      callback: () => {
        if (isOpen) {
          setIsOpen(false);
          setQuery('');
        }
      },
    },
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (value.trim()) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  const handleInputFocus = () => {
    if (query.trim()) {
      setIsOpen(true);
    }
  };

  const handleClear = () => {
    clearSearch();
  };

  return (
    <div ref={searchRef} className="relative flex-1 max-w-xl">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder="Search goals, tasks..."
          className="pl-10 pr-10 bg-background"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0 hover:bg-accent"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-md shadow-lg z-50">
          <div className="p-2 border-b border-border">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                {results.length > 0
                  ? `${results.length} results`
                  : 'No results'}
              </span>
              <div className="text-xs text-muted-foreground">
                Use ↑↓ to navigate, Enter to select, Esc to close
              </div>
            </div>
          </div>
          <SearchResults
            results={results}
            selectedIndex={selectedIndex}
            onResultClick={navigateToResult}
            isSearching={isSearching}
          />
        </div>
      )}
    </div>
  );
}
