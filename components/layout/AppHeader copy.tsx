import { Dispatch, SetStateAction } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NotificationDropdown } from '../notification-dropdown';
import { Menu, X, Waves, PanelLeft } from 'lucide-react';
import { TooltipProvider } from '@/components/ui/tooltip';

interface AppHeaderProps {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: Dispatch<SetStateAction<boolean>>;
}

export function AppHeader({ sidebarCollapsed, setSidebarCollapsed }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-blue-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60">
      <div className="flex h-14 items-center justify-between px-4">
        <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
          <PanelLeft className="h-5 w-5" stroke={'#7E8796'} />
        </button>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <div className="relative">
              <Input
                type="search"
                placeholder="Search projects, issues, merge requests..."
                className="pl-8 md:w-[300px] lg:w-[400px] border-blue-200 dark:border-gray-700 focus:border-blue-400 focus:ring-blue-400 dark:bg-gray-800"
              />
            </div>
          </div>
          <nav className="flex items-center space-x-2">
            <NotificationDropdown />
          </nav>
        </div>
      </div>
    </header>
  );
}
