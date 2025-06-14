"use client";

import type React from "react";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Search,
  Menu,
  X,
  Settings,
  ChevronDown,
  ChevronRight,
  WaypointsIcon as Gateway,
} from "lucide-react";
import { ThemeToggle, CollapseThemeToggle } from "./theme-toggle";
import { NotificationDropdown } from "./notification-dropdown";
import { AppLayoutProps, NavButtonProps } from "@/types";
import {
  projectsData,
  navItems,
  userMenuItems,
} from "@/constants/app-layout-data";

const NavButton = ({
  item,
  sidebarCollapsed,
  onClick,
  pathname,
}: NavButtonProps) => {
  const Icon = item.icon;
  const [isOpen, setIsOpen] = useState(item.label === "Infra Packages"); // Services 1은 기본적으로 열려있음
  const router = useRouter();

  const isActive =
    pathname === item.href ||
    (item.subItems &&
      item.subItems.some((subItem) => pathname === subItem.href));

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
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="transition-all duration-300 ease-in-out"
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className={`w-full ${
                  sidebarCollapsed ? "justify-center px-2" : "justify-start"
                } hover:bg-blue-50 dark:hover:bg-gray-800 ${
                  isActive
                    ? "bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 text-blue-700 dark:text-blue-300 border-l-4 border-blue-600"
                    : ""
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
            <TooltipContent side="right">{item.label}</TooltipContent>
          )}
        </Tooltip>
        {!sidebarCollapsed && (
          <CollapsibleContent className="collapsible-content overflow-hidden transition-all duration-300 ease-in-out">
            <div className="ml-6 space-y-1 py-1">
              {item.subItems.map((subItem) => {
                const SubIcon = subItem.icon;
                const isSubActive = pathname === subItem.href;
                return (
                  <Button
                    key={subItem.href}
                    variant="ghost"
                    size="sm"
                    className={`w-full justify-start hover:bg-blue-50 dark:hover:bg-gray-800 transition-all duration-200 transform hover:translate-x-1 ${
                      isSubActive
                        ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                        : ""
                    }`}
                    onClick={() => handleSubItemClick(subItem.href)}
                  >
                    <SubIcon className="h-3 w-3" />
                    <span className="ml-2 text-sm">{subItem.label}</span>
                  </Button>
                );
              })}
            </div>
          </CollapsibleContent>
        )}
      </Collapsible>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          className={`w-full ${
            sidebarCollapsed ? "justify-center px-2" : "justify-start"
          } hover:bg-blue-50 dark:hover:bg-gray-800 ${
            isActive
              ? "bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 text-blue-700 dark:text-blue-300 border-l-4 border-blue-600"
              : ""
          }`}
          size="sm"
          onClick={handleClick}
        >
          <Icon className="h-4 w-4" />
          {!sidebarCollapsed && <span className="ml-2">{item.label}</span>}
        </Button>
      </TooltipTrigger>
      {sidebarCollapsed && (
        <TooltipContent side="right">{item.label}</TooltipContent>
      )}
    </Tooltip>
  );
};

export function AppLayout({ children, projectSlug }: AppLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  const currentProject = projectSlug
    ? projectsData.find((p) => p.slug === projectSlug)
    : null;
  const isDashboard = pathname === "/dashboard";
  const isProjectPage = pathname?.startsWith("/project/");

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageLoaded(false);
  };

  const handleUserMenuClick = (action: string) => {
    switch (action) {
      case "profile":
        router.push("/profile");
        break;
      case "account":
        router.push("/settings/account");
        break;
      case "settings":
        router.push("/settings");
        break;
      case "logout":
        router.push("/login");
        break;
      default:
        break;
    }
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Header */}
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
              <a className="mr-6 flex items-center space-x-2" href="/dashboard">
                <div className="h-7 w-7">
                  <img src={"/nexfron_favicon.png"} alt="NEXFRON" />
                </div>
                <span className="hidden font-extrabold text-[20px] sm:inline-block text-black dark:text-white">
                  NEXFRON
                </span>
              </a>
            </div>

            <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
              {/* <div className="w-full flex-1 md:w-auto md:flex-none">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search projects, issues, merge requests..."
                    className="pl-8 md:w-[300px] lg:w-[400px] border-blue-200 dark:border-gray-700 focus:border-blue-400 focus:ring-blue-400 dark:bg-gray-800"
                  />
                </div>
              </div> */}
              <nav className="flex items-center space-x-2">
                <NotificationDropdown />
              </nav>
            </div>
          </div>
        </header>

        <div className="flex">
          {/* Sidebar */}
          <aside
            className={`fixed top-14 z-40 h-[calc(100vh-3.5rem)] border-r border-blue-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60 transition-all duration-500 ease-in-out transform ${
              sidebarCollapsed ? "w-16" : "w-[270px]"
            }`}
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
                            currentProject.visibility === "Public"
                              ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                              : "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300"
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
                          <h3 className="text-sm font-semibold truncate">
                            John Doe
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            john@example.com
                          </p>
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
                        <DropdownMenuContent
                          className="w-56"
                          align="start"
                          forceMount
                        >
                          <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                              <p className="text-sm font-medium leading-none">
                                John Doe
                              </p>
                              <p className="text-xs leading-none text-muted-foreground">
                                Developer
                              </p>
                            </div>
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {userMenuItems.map((item) => (
                            <DropdownMenuItem
                              key={item.action}
                              onClick={() => handleUserMenuClick(item.action)}
                            >
                              <item.icon className="mr-2 h-4 w-4" />
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
                        <DropdownMenuContent
                          className="w-56"
                          align="start"
                          forceMount
                        >
                          <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                              <p className="text-sm font-medium leading-none">
                                John Doe
                              </p>
                              <p className="text-xs leading-none text-muted-foreground">
                                john@example.com
                              </p>
                            </div>
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {userMenuItems.map((item) => (
                            <DropdownMenuItem
                              key={item.action}
                              onClick={() => handleUserMenuClick(item.action)}
                            >
                              <item.icon className="mr-2 h-4 w-4" />
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

          {/* Main Content */}
          <main
            className={`flex-1 transition-all duration-300 ${
              sidebarCollapsed ? "ml-16" : "ml-[270px]"
            }`}
          >
            {children}
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
