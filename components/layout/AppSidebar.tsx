'use client';

import { ThemeToggle, CollapseThemeToggle } from '../theme-toggle';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Settings } from 'lucide-react';
import { projectsData, navItems, userMenuItems } from '@/constants/app-layout-data';
import { usePathname, useRouter } from 'next/navigation';
import { useState, type Dispatch, type SetStateAction } from 'react';
import type { NavButtonProps, SubNavItem } from '@/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface AppSidebarProps {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: Dispatch<SetStateAction<boolean>>;
  projectSlug?: string;
}

// SubNavButton 컴포넌트 - 2단계 서브메뉴용
const SubNavButton = ({
  subItem,
  sidebarCollapsed,
  pathname,
}: {
  subItem: SubNavItem;
  sidebarCollapsed: boolean;
  pathname: string;
}) => {
  const SubIcon = subItem.icon;
  const [isSubOpen, setIsSubOpen] = useState(false);
  const router = useRouter();

  const isSubActive =
    pathname === subItem.href ||
    pathname.includes(subItem.href ?? '') ||
    (subItem.subItems && subItem.subItems.some((subSubItem) => pathname === subSubItem.href));

  const handleSubClick = () => {
    if (subItem.subItems) {
      setIsSubOpen(!isSubOpen);
    } else if (subItem.href) {
      router.push(subItem.href);
    }
  };

  const handleSubSubItemClick = (href: string) => {
    router.push(href);
  };

  if (subItem.subItems) {
    return (
      <Collapsible
        open={isSubOpen}
        onOpenChange={setIsSubOpen}
        className="transition-all duration-100 ease-in-out"
      >
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={`w-full justify-start hover:bg-blue-50 dark:hover:bg-gray-800 transition-all duration-100 transform hover:translate-x-1 ${
              isSubActive ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' : ''
            }`}
            onClick={handleSubClick}
          >
            <SubIcon className="h-3 w-3" />
            <span className="ml-2 text-sm flex-1 text-left">{subItem.label}</span>
            <div className="flex items-center space-x-1">
              {isSubOpen ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </div>
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="collapsible-content overflow-hidden transition-all duration-100 ease-in-out">
          <div className="ml-4 space-y-1 py-1">
            {subItem.subItems.map((subSubItem) => {
              const SubSubIcon = subSubItem.icon;
              const normalizePath = (path: string) => path.replace(/\/$/, '').split('?')[0];

              const isSubSubActive = normalizePath(pathname) === normalizePath(subSubItem.href);
              return (
                <Button
                  key={subSubItem.href}
                  variant="ghost"
                  size="sm"
                  className={`w-full justify-start hover:bg-blue-50 dark:hover:bg-gray-800 transition-all duration-100 transform hover:translate-x-2 ${
                    isSubSubActive
                      ? 'bg-blue-50 dark:bg-blue-800 text-blue-600 dark:text-blue-400'
                      : ''
                  }`}
                  onClick={() => handleSubSubItemClick(subSubItem.href)}
                >
                  <SubSubIcon className="h-3 w-3" />
                  <span className="ml-2 text-xs">{subSubItem.label}</span>
                </Button>
              );
            })}
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className={`w-full justify-start hover:bg-blue-50 dark:hover:bg-gray-800 transition-all duration-100 transform hover:translate-x-1 ${
        isSubActive ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' : ''
      }`}
      onClick={handleSubClick}
    >
      <SubIcon className="h-3 w-3" />
      <span className="ml-2 text-sm">{subItem.label}</span>
    </Button>
  );
};

// NavButton 컴포넌트는 별도 파일로 분리 가능
const NavButton = ({ item, sidebarCollapsed, onClick, pathname }: NavButtonProps) => {
  const Icon = item.icon;
  const [isOpen, setIsOpen] = useState(
    item.label === 'Infra Packages' || item.label === 'Services'
  ); // Services 1은 기본적으로 열려있음
  const router = useRouter();

  const isActive =
    pathname === item.href ||
    pathname.includes(item.href ?? 'string') ||
    (item.subItems &&
      item.subItems.some(
        (subItem) =>
          pathname === subItem.href ||
          (subItem.subItems && subItem.subItems.some((subSubItem) => pathname === subSubItem.href))
      ));

  const handleClick = () => {
    if (item.subItems) {
      setIsOpen(!isOpen);
    } else if (item.href) {
      router.push(item.href);
    }
    onClick?.();
  };

  const handleSubItemClick = (href: string) => {
    router.push(href);
  };

  if (item.subItems) {
    return (
      <TooltipProvider>
        <Collapsible
          open={isOpen}
          onOpenChange={setIsOpen}
          className="transition-all duration-100 ease-in-out"
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className={`w-full ${
                    sidebarCollapsed ? 'justify-center px-2' : 'justify-start'
                  } hover:bg-blue-50 dark:hover:bg-gray-800 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 text-blue-700 dark:text-blue-300 border-l-4 border-blue-600'
                      : ''
                  }`}
                  size="sm"
                  onClick={handleClick}
                >
                  <Icon className="h-4 w-4" />
                  {!sidebarCollapsed && (
                    <>
                      <span className="ml-2 flex-1 text-left">{item.label}</span>
                      <div className="flex items-center space-x-1">
                        {isOpen ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </div>
                    </>
                  )}
                </Button>
              </CollapsibleTrigger>
            </TooltipTrigger>
            {sidebarCollapsed && (
              <TooltipContent side="right" className="p-0">
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg">
                  <div className="p-1">
                    {item.subItems.map((subItem) => {
                      const SubIcon = subItem.icon;
                      return (
                        <div key={subItem.label}>
                          {subItem.subItems ? (
                            <div className="px-3 py-2">
                              <div className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                <SubIcon className="h-3 w-3" />
                                <span>{subItem.label}</span>
                              </div>
                              <div className="ml-5 space-y-1">
                                {subItem.subItems.map((subSubItem) => {
                                  const SubSubIcon = subSubItem.icon;
                                  return (
                                    <button
                                      key={subSubItem.href}
                                      className="w-full flex items-center space-x-2 px-2 py-1 text-xs hover:bg-blue-50 dark:hover:bg-gray-700 rounded"
                                      onClick={() => handleSubItemClick(subSubItem.href)}
                                    >
                                      <SubSubIcon className="h-3 w-3" />
                                      <span>{subSubItem.label}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          ) : (
                            <button
                              className="w-full flex items-center space-x-2 px-3 py-2 text-sm hover:bg-blue-50 dark:hover:bg-gray-700 rounded"
                              onClick={() => handleSubItemClick(subItem.href!)}
                            >
                              <SubIcon className="h-3 w-3" />
                              <span>{subItem.label}</span>
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </TooltipContent>
            )}
          </Tooltip>
          {!sidebarCollapsed && (
            <CollapsibleContent className="collapsible-content overflow-hidden transition-all duration-100 ease-in-out">
              <div className="ml-6 space-y-1 py-1">
                {item.subItems.map((subItem) => (
                  <SubNavButton
                    key={subItem.label}
                    subItem={subItem}
                    sidebarCollapsed={sidebarCollapsed}
                    pathname={pathname}
                  />
                ))}
              </div>
            </CollapsibleContent>
          )}
        </Collapsible>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            className={`w-full ${
              sidebarCollapsed ? 'justify-center px-2' : 'justify-start'
            } hover:bg-blue-50 dark:hover:bg-gray-800 ${
              isActive
                ? 'bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 text-blue-700 dark:text-blue-300 border-l-4 border-blue-600'
                : ''
            }`}
            size="sm"
            onClick={handleClick}
          >
            <Icon className="h-4 w-4" />
            {!sidebarCollapsed && <span className="ml-2">{item.label}</span>}
          </Button>
        </TooltipTrigger>
        {sidebarCollapsed && <TooltipContent side="right">{item.label}</TooltipContent>}
      </Tooltip>
    </TooltipProvider>
  );
};

export function AppSidebar({
  sidebarCollapsed,
  setSidebarCollapsed,
  projectSlug,
}: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const currentProject = projectSlug ? projectsData.find((p) => p.slug === projectSlug) : null;
  const isProjectPage = pathname?.startsWith('/project/');

  const [isHovered, setIsHovered] = useState(false);

  const handleUserMenuClick = (action: string) => {
    switch (action) {
      case 'profile':
        router.push('/profile');
        break;
      case 'account':
        router.push('/settings/account');
        break;
      case 'settings':
        router.push('/settings');
        break;
      case 'logout':
        router.push('/login');
        break;
      default:
        break;
    }
  };

  return (
    <aside
      className={`fixed top-14 z-40 h-[calc(100vh-3.5rem)] border-r border-blue-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60 transition-all duration-500 ease-in-out transform ${
        sidebarCollapsed ? 'w-16' : 'w-[220px]'
        // sidebarCollapsed && !isHovered ? "w-16" : "w-[220px]"
      }`}
      // onMouseEnter={() => setIsHovered(true)}
      // onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex h-full flex-col">
        {/* Context Information - Only show for project pages */}
        {isProjectPage && currentProject && !sidebarCollapsed && (
          <div className="border-b border-blue-200/50 dark:border-gray-700/50 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/50 dark:to-indigo-900/50">
            <div className="space-y-3">
              <div>
                <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-[5px]">
                  {currentProject.name}
                </h2>
                <div className="flex items-center space-x-2">
                  <Badge
                    variant="secondary"
                    className={`text-xs ${
                      currentProject.visibility === 'Public'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                        : 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
                    }`}
                  >
                    {currentProject.visibility}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-2 space-y-1">
          {navItems.map((item) => (
            <NavButton
              key={item.label}
              item={item}
              sidebarCollapsed={sidebarCollapsed}
              pathname={pathname}
            />
          ))}
        </nav>

        {/* User Profile Section */}
        <div className="border-t border-blue-200/50 dark:border-gray-700/50 p-4">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed ? (
              <>
                <div className="flex items-center space-x-3 w-full">
                  <Avatar className="h-10 w-10 flex items-center justify-center bg-gradient-to-br shadow-lg from-blue-600 to-indigo-600 text-white text-sm font-bold">
                    JD
                  </Avatar>
                  <div className="flex-1 min-w-0 text-left">
                    <h3 className="text-sm font-semibold truncate">John Doe</h3>
                    <p className="text-xs text-muted-foreground">john@example.com</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-auto justify-end p-3 h-auto hover:bg-blue-50 dark:hover:bg-gray-800"
                    >
                      <Settings />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="start" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">John Doe</p>
                        <p className="text-xs leading-none text-muted-foreground">userID</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {userMenuItems.map((item) => (
                      <DropdownMenuItem
                        key={item.action}
                        onClick={() => handleUserMenuClick(item.action)}
                      >
                        {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                        <span>{item.label}</span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-center p-2 hover:bg-blue-50 dark:hover:bg-gray-800"
                    >
                      <Avatar className="h-8 w-8 flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-xs font-bold">
                        JD
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="start" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">John Doe</p>
                        <p className="text-xs leading-none text-muted-foreground">userID</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {userMenuItems.map((item) => (
                      <DropdownMenuItem
                        key={item.action}
                        onClick={() => handleUserMenuClick(item.action)}
                      >
                        {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                        <span>{item.label}</span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>
        </div>

        {/* Theme Toggle */}
        {!sidebarCollapsed ? (
          <div className=" p-2 flex justify-end">
            <ThemeToggle />
          </div>
        ) : (
          <div className="p-2 flex justify-center">
            <CollapseThemeToggle />
          </div>
        )}
      </div>
    </aside>
  );
}
