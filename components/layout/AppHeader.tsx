import { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NotificationDropdown } from "../notification-dropdown";
import { Menu, X, Waves } from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";

interface AppHeaderProps {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: Dispatch<SetStateAction<boolean>>;
}

export function AppHeader({
  sidebarCollapsed,
  setSidebarCollapsed,
}: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-blue-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60">
      <div className="flex h-14 items-center px-4">
        <div className="mr-4 flex">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="mr-2 hover:bg-blue-100 dark:hover:bg-gray-800"
          >
            {!sidebarCollapsed ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </Button>
          {/* <a className="mr-6 flex items-center space-x-2" href="/dashboard">
            <div className="h-7 w-7">
              <img src={"/nexfron_favicon.png"} alt="NEXFRON" />
            </div>
            <span className="hidden font-extrabold text-[20px] sm:inline-block text-black dark:text-white">
              NEXFRON
            </span>
          </a> */}

          <a className="mr-6 flex items-center space-x-2" href="/dashboard">
            <div className="h-6 w-6 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
              <Waves className="h-4 w-4 text-white" />
            </div>
            <span className="hidden font-bold  text-[18px] sm:inline-block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Clalink APIM
            </span>
          </a>
        </div>
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
