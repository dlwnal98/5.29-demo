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
import {
  Menu,
  Minus,
  Plus,
  Settings,
  X,
  Waves,
  PanelLeftClose,
  PanelLeftOpen,
  PanelLeft,
} from 'lucide-react';
import {
  projectsData,
  getNavItems,
  userMenuItems,
  clearSelectedApiInfo,
  setSelectedApiInfo,
  selectedApiName,
} from '@/constants/app-layout-data';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState, type Dispatch, type SetStateAction, useEffect } from 'react';
import type { NavButtonProps, SubNavItem } from '@/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { decodeJWT } from '@/hooks/decodeToken';
import { useAuthStore } from '@/store/store';

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
  const router = useRouter();
  const searchParams = useSearchParams();
  const isApiManagementPath = pathname.startsWith('/services/api-management');
  const isConfigPath =
    pathname.startsWith('/infra-packages/config/projects') ||
    pathname.startsWith('/infra-packages/config/secret-key');

  // API Management는 항상 열린 상태로 유지
  const [isSubOpen, setIsSubOpen] = useState(() => {
    return subItem.label === 'API Management' ? isApiManagementPath : false;
  });

  useEffect(() => {
    if (
      (subItem.label === 'API Management' && isApiManagementPath && !isSubOpen) ||
      (subItem.label === 'Config' && isConfigPath && !isSubOpen)
    ) {
      setIsSubOpen(true);
    }
  }, [pathname, subItem.label, isApiManagementPath, isConfigPath, isSubOpen]);

  // URL에서 API 정보 복원
  useEffect(() => {
    if (isApiManagementPath && !selectedApiName) {
      const apiId = searchParams.get('apiId');
      const apiName = searchParams.get('apiName');

      if (apiId && apiName) {
        setSelectedApiInfo(apiName, apiId);
      }
    }
  }, [pathname, searchParams, isApiManagementPath]);

  // separator 처리
  if (subItem.separator) {
    return (
      <div className="my-2">
        <div className="h-px bg-gray-200 dark:bg-gray-700 mx-2" />
      </div>
    );
  }

  const isSubActive =
    pathname === subItem.href ||
    pathname.includes(subItem.href ?? '') ||
    (subItem.subItems && subItem.subItems.some((subSubItem) => pathname === subSubItem.href));

  const handleSubClick = () => {
    if (subItem.subItems) {
      // API Management인 경우 API Management 경로에서는 닫지 않음
      if (
        (subItem.label === 'API Management' && isApiManagementPath) ||
        (subItem.label === 'Config' && isConfigPath)
      ) {
        return;
      }
      setIsSubOpen(!isSubOpen);
    } else if (subItem.href) {
      router.push(subItem.href);
    }
  };

  const handleSubOpenChange = (open: boolean) => {
    // API Management가 API Management 경로에 있을 때는 강제로 열린 상태 유지
    if (subItem.label === 'API Management' && isApiManagementPath) {
      setIsSubOpen(true);
      return;
    }
    setIsSubOpen(open);
  };

  const handleSubSubItemClick = (label: string, href: string) => {
    if (label === 'APIs') {
      // APIs 메뉴를 클릭했을 때만 API 정보 초기화
      clearSelectedApiInfo();
    }
    router.push(href);
  };

  // resource 페이지가 아닐 때 selectedApiInfo를 초기화
  useEffect(() => {
    // resource 관련 경로들
    const isResourcePage =
      pathname.startsWith('/services/api-management/resources') ||
      pathname.startsWith('/services/api-management/models') ||
      pathname.startsWith('/services/api-management/stages');
    if (!isResourcePage) {
      clearSelectedApiInfo();
    }
  }, [pathname]);

  if (subItem.subItems) {
    return (
      <Collapsible
        open={isSubOpen}
        onOpenChange={handleSubOpenChange}
        className="transition-all duration-100 ease-in-out"
      >
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={`w-full !h-10  text-[13px] justify-start hover:bg-blue-50 dark:hover:bg-gray-800 hover:rounded-[8px] ${
              isSubActive
                ? 'bg-blue-50 font-bold hover:bg-blue-50 rounded-[8px] dark:bg-blue-800 dark:text-blue-400'
                : 'text-[#8c8c8c]'
            }`}
            onClick={handleSubClick}
          >
            <span className="flex-1 text-left">{subItem.label}</span>
            <div className="flex items-center space-x-1">
              {isSubOpen ? (
                <ChevronDown className="!h-[14px] !w-[14px]" strokeWidth={2.5} />
              ) : (
                <ChevronRight className="!h-[14px] !w-[14px]" strokeWidth={2.5} />
              )}
            </div>
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="collapsible-content overflow-hidden transition-all duration-100 ease-in-out">
          <div className="ml-3 space-y-1 py-1">
            {subItem.subItems.map((subSubItem, index) => {
              // separator 처리
              if (subSubItem.separator) {
                return (
                  <div key={`separator-${index}`} className="my-2">
                    <div className="h-px bg-gray-200 dark:bg-gray-700 mx-2" />
                  </div>
                );
              }

              const normalizePath = (path: string) => path.replace(/\/$/, '').split('?')[0];

              const isSubSubActive = normalizePath(pathname) === normalizePath(subSubItem.href!);
              return (
                <Button
                  key={subSubItem.href || `item-${index}`}
                  variant="ghost"
                  size="sm"
                  className={`w-full !h-10  text-[13px] justify-start hover:bg-blue-50 dark:hover:bg-gray-800 hover:rounded-[8px] ${
                    isSubSubActive
                      ? 'bg-blue-50 font-bold hover:bg-blue-50 rounded-[8px] dark:bg-blue-800 dark:text-blue-400'
                      : 'text-[#8c8c8c]'
                  }`}
                  onClick={() => handleSubSubItemClick(subSubItem.label, subSubItem.href!)}
                >
                  <span className="text-xs">{subSubItem.label}</span>
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
      className={`w-full justify-start hover:bg-blue-50 dark:hover:bg-gray-800 hover:rounded-[8px] ${
        isSubActive
          ? 'bg-blue-50 font-bold rounded-[8px] dark:bg-blue-900 dark:text-blue-300'
          : 'text-[#8c8c8c]'
      }`}
      onClick={handleSubClick}
    >
      <span className="text-[13px]">{subItem.label}</span>
    </Button>
  );
};

// NavButton 컴포넌트
const NavButton = ({ item, sidebarCollapsed, onClick, pathname }: NavButtonProps) => {
  const Icon = item.icon;
  const router = useRouter();
  const isApiManagementPath = pathname.startsWith('/services/api-management');

  // // Services는 API Management 경로에서 항상 열린 상태로 유지
  // const [isOpen, setIsOpen] = useState(() => {
  //   if (item.label === 'Services' && isApiManagementPath) return true;
  //   return item.label === 'Infra Packages' || item.label === 'Services';
  // });

  // Services는 API Management 경로에서 항상 열린 상태로 유지
  const [isOpen, setIsOpen] = useState(() => {
    if (isApiManagementPath) return true;
    return item.label === 'Infra Packages';
  });

  useEffect(() => {
    // if (item.label === 'Services' && isApiManagementPath && !isOpen) {
    //   setIsOpen(true);
    // }

    if (isApiManagementPath && !isOpen) {
      setIsOpen(true);
    }
  }, [pathname, item.label, isApiManagementPath, isOpen]);

  // separator 처리
  if (item.separator) {
    return (
      <div className="my-2">
        <div className="h-px bg-gray-200 dark:bg-gray-700 mx-2" />
      </div>
    );
  }

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
      // Services 메뉴가 API Management 경로에 있을 때는 토글하지 않음
      if (item.label === 'Services' && isApiManagementPath) {
        return;
      }
      setIsOpen(!isOpen);
    } else if (item.href) {
      router.push(item.href);
    }
    onClick?.();
  };

  const handleOpenChange = (open: boolean) => {
    // Services가 API Management 경로에 있을 때는 강제로 열린 상태 유지
    if (item.label === 'Services' && isApiManagementPath) {
      setIsOpen(true);
      return;
    }
    setIsOpen(open);
  };

  const handleSubItemClick = (href: string) => {
    router.push(href);
  };

  const userInfo = useAuthStore((state) => state.user);

  if (item.subItems) {
    return (
      <TooltipProvider>
        <Collapsible
          open={isOpen}
          onOpenChange={handleOpenChange}
          className="transition-all duration-100 ease-in-out"
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className={`w-full !h-10  text-[13px]  ${
                    sidebarCollapsed ? 'justify-center px-2' : 'justify-start'
                  }  hover:bg-blue-50 dark:hover:bg-gray-800 hover:rounded-[8px] ${
                    isActive
                      ? 'bg-blue-50 font-bold hover:bg-blue-50 rounded-[8px] dark:bg-blue-800 dark:text-blue-400'
                      : 'text-[#8c8c8c]'
                  }`}
                  size="sm"
                  onClick={handleClick}
                >
                  <Icon className="h-4 w-4" strokeWidth={2.5} />
                  {!sidebarCollapsed && (
                    <>
                      <span className=" flex-1 text-left">{item.label}</span>
                      <div>
                        {isOpen ? (
                          <ChevronDown className="h-4 w-4" strokeWidth={2.5} />
                        ) : (
                          <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
                        )}
                      </div>
                    </>
                  )}
                </Button>
              </CollapsibleTrigger>
            </TooltipTrigger>
            {sidebarCollapsed && (
              <TooltipContent side="right" className="p-0 relative top-[60px]">
                <div className="  bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg">
                  <div className="p-1">
                    {item.subItems.map((subItem, index) => {
                      // separator 처리
                      if (subItem.separator) {
                        return (
                          <div key={`separator-${index}`} className="my-1">
                            <div className="h-px bg-gray-200 dark:bg-gray-700 mx-2" />
                          </div>
                        );
                      }

                      const SubIcon = subItem.icon;
                      return (
                        <div key={subItem.label || `item-${index}`}>
                          {subItem.subItems ? (
                            <div className="p-2 space-y-1">
                              <div className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                <SubIcon className="h-3 w-3" />
                                <span>{subItem.label}</span>
                              </div>
                              <div className="ml-2 pl-2 space-y-1 border-l border-gray-300 ">
                                {subItem.subItems.map((subSubItem, subIndex) => {
                                  // separator 처리
                                  if (subSubItem.separator) {
                                    return (
                                      <div key={`sub-separator-${subIndex}`} className="my-1">
                                        <div className="h-px bg-gray-200 dark:bg-gray-700 mx-2" />
                                      </div>
                                    );
                                  }

                                  const SubSubIcon = subSubItem.icon;
                                  return (
                                    <button
                                      key={subSubItem.href || `sub-item-${subIndex}`}
                                      className="w-full flex items-center space-x-2 p-2 text-xs hover:bg-blue-50 dark:hover:bg-gray-700 rounded-[8px] hover:rounded-[8px]"
                                      onClick={() => handleSubItemClick(subSubItem.href!)}
                                    >
                                      {/* <SubSubIcon className="h-3 w-3" /> */}
                                      <span>{subSubItem.label}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          ) : (
                            <button
                              className="w-full flex items-center space-x-2 p-2 text-sm hover:bg-blue-50 dark:hover:bg-gray-700 rounded-[8px] hover:rounded-[8px]"
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
              <div
                className={
                  userInfo?.role === 'SUPER'
                    ? 'ml-5 pl-[5px] space-y-1 py-1'
                    : 'ml-5 pl-[5px] space-y-1 py-1'
                }
              >
                {item.subItems.map((subItem, index) => (
                  <SubNavButton
                    key={subItem.label || `sub-${index}`}
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
            className={`w-full !h-10 text-[13px]  ${
              sidebarCollapsed ? 'justify-center px-2' : 'justify-start'
            } hover:bg-blue-50 dark:hover:bg-gray-800 hover:rounded-[8px] ${
              isActive
                ? 'bg-blue-50 font-bold hover:bg-blue-50 rounded-[8px] dark:bg-blue-800 dark:text-blue-400'
                : 'text-[#8c8c8c]'
            }`}
            size="sm"
            onClick={handleClick}
          >
            <Icon className="h-4 w-4" strokeWidth={2.5} />
            {!sidebarCollapsed && <span>{item.label}</span>}
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
  const [navItems, setNavItems] = useState(getNavItems());

  useEffect(() => {
    setNavItems(getNavItems());
  }, []);

  // resource 페이지가 아닐 때 selectedApiInfo를 초기화
  useEffect(() => {
    // resource 관련 경로들
    const isResourcePage =
      pathname.startsWith('/services/api-management/resources') ||
      pathname.startsWith('/services/api-management/models') ||
      pathname.startsWith('/services/api-management/stages');
    if (!isResourcePage) {
      clearSelectedApiInfo();
    }
  }, [pathname]);

  //예시 코드
  const handleLogout = async () => {
    useAuthStore.getState().clearAuth();

    window.location.replace('/');
  };

  const handleUserMenuClick = (action: string) => {
    switch (action) {
      case 'account':
        router.push('/settings/account');
        break;
      case 'logout':
        handleLogout();
        break;
      default:
        break;
    }
  };

  const getStoredTokenInfo = () => {
    if (typeof window !== 'undefined') {
      const accessToken = localStorage.getItem('access_token');
      const refreshToken = localStorage.getItem('refresh_token');
      const expiresAt = localStorage.getItem('expires_at');
      return { accessToken: accessToken, refreshToken: refreshToken, expiresAt: expiresAt };
    }
    return { accessToken: null, refreshToken: null, expiresAt: null };
  };

  const tokenInfo = getStoredTokenInfo();

  const setTokens = useAuthStore((state) => state.setTokens);

  useEffect(() => {
    if (tokenInfo.accessToken) {
      console.log(1);
      setTokens(tokenInfo.accessToken, tokenInfo.refreshToken, tokenInfo.expiresAt); // 디코딩 후 상태에 저장
      // useAuthStore.getState().setTokens(accessToken, refreshToken, String(expiresAt));
    }
  }, [tokenInfo.accessToken, tokenInfo.refreshToken, tokenInfo.refreshToken]);

  const userInfo = useAuthStore((state) => state.user);
  console.log(userInfo);

  return (
    <aside
      className={`fixed top-0 z-40 h-[100vh] border-r border-blue-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60 transition-all duration-500 ease-in-out transform ${
        sidebarCollapsed ? 'w-16' : 'w-[250px]'
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
        <nav className="scrollbar-none flex-1 overflow-y-auto p-4 space-y-1">
          {!sidebarCollapsed ? (
            <div className="flex justify-center items-center  px-1 pt-4 pb-4">
              <a className="flex items-center space-x-2" href="/dashboard">
                <div className="h-6 w-6 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                  <Waves className="h-4 w-4 text-white" />
                </div>
                <span className="hidden font-bold  text-[18px] sm:inline-block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Clalink APIM
                </span>
              </a>
              {/* <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
                <PanelLeft className="h-5 w-5" stroke={'#7E8796'} />
              </button> */}
            </div>
          ) : (
            <div className="flex flex-col items-center px-1 pt-4 pb-4">
              <a className="flex items-center space-x-2" href="/dashboard">
                <div className="h-6 w-6 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                  <Waves className="h-4 w-4 text-white" />
                </div>
              </a>
            </div>
          )}

          <div className="h-px bg-[#e2e8f0] dark:bg-gray-700 mx-2" />

          {navItems.map((item) => {
            if (item?.access?.includes(userInfo?.role)) {
              return (
                <NavButton
                  key={item.label}
                  item={item}
                  sidebarCollapsed={sidebarCollapsed}
                  pathname={pathname}
                />
              );
            }
          })}
        </nav>

        {/* User Profile Section */}
        <div className="border-t border-blue-200/50 dark:border-gray-700/50 p-4">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed ? (
              <>
                <div className="flex items-center space-x-3 w-full">
                  <Avatar className="h-10 w-10 flex items-center justify-center bg-gradient-to-br shadow-lg from-blue-600 to-indigo-600 text-white text-sm font-bold">
                    {userInfo?.name?.slice(0, 1)}
                  </Avatar>
                  <div className="flex-1 min-w-0 text-left space-y-1">
                    <Badge
                      variant="outline"
                      className="!mt-2 text-xs bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-800"
                    >
                      {userInfo?.organizationName || 'NEXFRON'}
                    </Badge>
                    <h3 className="text-sm font-semibold truncate ml-2">{userInfo?.name}</h3>
                    <p className="text-xs text-muted-foreground ml-2">{userInfo?.email}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-auto justify-end p-2 h-auto hover:bg-blue-50 dark:hover:bg-gray-800"
                    >
                      <Settings />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 p-2" align="start" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-2">
                        {/* <p className="text-sm font-medium leading-none">{userInfo?.name}</p> */}
                        <p className="text-[14px] leading-none text-muted-foreground">
                          @{userInfo?.userId}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {userMenuItems.map((item) => (
                      <DropdownMenuItem
                        key={item.action}
                        onClick={() => handleUserMenuClick(item.action)}
                        className="hover:cursor-pointer"
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
                        {userInfo?.name?.slice(0, 1)}
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="start" forceMount>
                    <DropdownMenuLabel className="font-normal flex items-center justify-between">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{userInfo?.name}</p>
                        <p className="text-[14px] leading-none text-muted-foreground">
                          @{userInfo?.userId}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className="!mt-2 text-xs bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-800"
                      >
                        {userInfo?.organizationName || 'NEXFRON'}
                      </Badge>
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
