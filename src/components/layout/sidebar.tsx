'use client';

import { Home, Target, MessageSquare, User, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SignOutButton } from '../auth/signout-button';

const navItems = [
  { title: 'Dashboard', icon: Home, path: '/dashboard' },
  { title: 'Goals', icon: Target, path: '/goals' },
  {
    title: 'AI Assistant',
    icon: MessageSquare,
    path: '/ai-assistant',
    upcoming: true,
  },
  { title: 'Profile', icon: User, path: '/profile' },
];

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-sidebar">
      <div className="flex h-16 items-center border-b border-border px-6">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            SkillSync
          </span>
        </div>
      </div>

      <nav className="space-y-1 p-4">
        {navItems.map(item => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="flex-1">{item.title}</span>
              {item.upcoming && (
                <span className="text-xs bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 px-2 py-1 rounded-full">
                  Soon
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4">
        <SignOutButton className="w-full" />
      </div>
    </aside>
  );
};
