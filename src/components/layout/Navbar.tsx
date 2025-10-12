'use client';

import { Search, Bell } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';

export const Navbar = () => {
  return (
    <header className="fixed left-64 right-0 top-0 z-30 h-16 border-b border-border bg-card/80 backdrop-blur-lg">
      <div className="flex h-full items-center justify-between px-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search goals, tasks..."
            className="pl-10 bg-background"
          />
        </div>

        {/* <div className="flex items-center gap-4">
          <button className="relative rounded-full p-2 hover:bg-accent transition-colors">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-accent" />
          </button>

          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>SK</AvatarFallback>
          </Avatar>
        </div> */}
      </div>
    </header>
  );
};
