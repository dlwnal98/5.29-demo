// components/layout/sidebar/SidebarItem.tsx
import { Button } from '@/components/ui/button';
import {
    clearSelectedApiInfo,
    setSelectedApiInfo,
    selectedApiName,
} from '@/constants/app-layout-data';
import { useState, useEffect } from 'react';
import type { SubNavItem } from '@/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';


// 2depth 메뉴
const SubNavButton = ({
    subItem,
    pathname,
}: {
    subItem: SubNavItem;
    pathname: string;
}) => {
    const router = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
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
            router(subItem.href);
        }
    };


    const handleSubOpenChange = (open: boolean) => {
        // API Management가 API Management 경로에 있을 때는 강제로 열린 상태 유지
        if ((subItem.label === 'API Management' && isApiManagementPath) || (subItem.label === 'Config' && isConfigPath)) {
            setIsSubOpen(true);
            return;
        }
        setIsSubOpen(open);
    };

    const handleSubSubItemClick = (label: string, href: string) => {
        // 특정 API 선택 시 생기는 하위 메뉴를 초기화해야 하는 메뉴들
        const clearApiInfoMenus = ['API Plan', 'Route Endpoints', 'API Keys', 'Usage Dashboard'];
        if (clearApiInfoMenus.includes(label)) {
            clearSelectedApiInfo();
        }
        router(href);
    };

    // resource 페이지가 아닐 때 selectedApiInfo를 초기화
    useEffect(() => {
        const isResourcePage =
            pathname.startsWith('/services/api-management/resources') ||
            pathname.startsWith('/services/api-management/models') ||
            pathname.startsWith('/services/api-management/stages');
        if (!isResourcePage) {
            clearSelectedApiInfo();
        }
    }, [pathname]);


    // 3depth 메뉴가 있다면
    if (subItem.subItems) {
        return (
            <Collapsible
                open={isSubOpen}
                onOpenChange={handleSubOpenChange}
                className="transition-all duration-100 ease-in-out">
                <CollapsibleTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        className={`w-full !h-10 text-[13px] justify-start bg-transparent hover:bg-blue-50 dark:hover:bg-gray-800  hover:rounded-[8px] ${isSubActive
                            ? 'bg-blue-50 font-bold hover:bg-blue-50 rounded-[8px] dark:bg-blue-800 dark:text-blue-400'
                            : 'text-[#8c8c8c]'
                            }`}
                        onClick={handleSubClick}>
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
                                    className={`w-full !h-10  text-[13px] justify-start bg-transparent hover:bg-blue-50 dark:hover:bg-gray-800 hover:rounded-[8px] ${isSubSubActive
                                        ? 'bg-blue-50 font-bold hover:bg-blue-50 rounded-[8px] dark:bg-blue-800 dark:text-blue-400'
                                        : 'text-[#8c8c8c]'
                                        }`}
                                    onClick={() => handleSubSubItemClick(subSubItem.label, subSubItem.href!)}>
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
            className={`w-full justify-start bg-transparent hover:bg-blue-50 dark:hover:bg-gray-800 hover:rounded-[8px] ${isSubActive
                ? 'bg-blue-50 font-bold rounded-[8px] dark:bg-blue-900 dark:text-blue-300'
                : 'text-[#8c8c8c]'
                }`}
            onClick={handleSubClick}>
            <span className="text-[13px]">{subItem.label}</span>
        </Button>
    );
};


// 1depth 메뉴
export const SidebarItem = ({ item, sidebarCollapsed }: { item: any; sidebarCollapsed: boolean; }) => {
    const { pathname } = useLocation();
    const Icon = item.icon;
    const router = useNavigate();
    const isApiManagementPath = pathname.startsWith('/services/api-management');

    // Services는 API Management 경로에서 항상 열린 상태로 유지
    const [isOpen, setIsOpen] = useState(() => {
        if (isApiManagementPath) return true;
        return item.label === 'Infra Packages';
    });

    // useEffect(() => {
    //     if (isApiManagementPath && !isOpen) {
    //         console.log('설마')
    //         // setIsOpen(true);
    //         setIsOpen(false);
    //     }
    // }, [pathname, item.label, isApiManagementPath, isOpen]);

    // separator 처리
    if (item?.separator) {
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
            router(item.href);
        }
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
        router(href);
    };

    // 2depth 메뉴가 있다면
    if (item.subItems) {
        return (
            <TooltipProvider>
                <Collapsible
                    open={isOpen}
                    onOpenChange={handleOpenChange}
                    className="transition-all duration-100 ease-in-out">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <CollapsibleTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className={`w-full !h-10  text-[13px] bg-transparent  ${sidebarCollapsed ? 'justify-center px-2' : 'justify-start'
                                        }  hover:bg-blue-50 dark:hover:bg-gray-800 hover:rounded-[8px] ${isActive
                                            ? 'bg-blue-50 font-bold hover:bg-blue-50 rounded-[8px] dark:bg-blue-800 dark:text-blue-400'
                                            : 'text-[#8c8c8c]'
                                        }`}
                                    size="sm"
                                    onClick={handleClick}>
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

                        {/* 사이드바 닫혔을 때 */}
                        {sidebarCollapsed && (
                            <TooltipContent side="right" className="p-0 relative top-[60px]">
                                <div className="  bg-white bg-transparent border border-gray-200 dark:border-gray-700 rounded-md shadow-lg">
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

                                                            {/* 3depth 메뉴 */}
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

                                                                    return (
                                                                        <button
                                                                            key={subSubItem.href || `sub-item-${subIndex}`}
                                                                            className="w-full flex items-center space-x-2 p-2   bg-transparent text-xs hover:bg-blue-50 dark:hover:bg-gray-700 rounded-[8px] hover:rounded-[8px]"
                                                                            onClick={() => handleSubItemClick(subSubItem.href!)}>
                                                                            <span>{subSubItem.label}</span>
                                                                        </button>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            className="w-full flex items-center space-x-2 p-2   bg-transparent text-sm hover:bg-blue-50 dark:hover:bg-gray-700 rounded-[8px] hover:rounded-[8px] "
                                                            onClick={() => handleSubItemClick(subItem.href!)}>
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


                    {/* 사이드바 열렸을 때 */}
                    {!sidebarCollapsed && (
                        <CollapsibleContent className="collapsible-content overflow-hidden transition-all duration-100 ease-in-out">
                            <div
                                className={
                                    'ml-5 pl-[5px] space-y-1 py-1'
                                }>
                                {item.subItems.map((subItem, index) => (
                                    <SubNavButton
                                        key={subItem.label || `sub-${index}`}
                                        subItem={subItem}
                                        pathname={pathname}
                                    />
                                ))}
                            </div>
                        </CollapsibleContent>
                    )}
                </Collapsible>
            </TooltipProvider>
        );
    } else return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="ghost"
                        className={`w-full !h-10 text-[13px]  bg-transparent ${sidebarCollapsed ? 'justify-center px-2' : 'justify-start'
                            } hover:bg-blue-50 dark:hover:bg-gray-800 hover:rounded-[8px] ${isActive
                                ? 'bg-blue-50 font-bold hover:bg-blue-50 rounded-[8px] dark:bg-blue-800 dark:text-blue-400'
                                : 'text-[#8c8c8c]'
                            }`}
                        size="sm"
                        onClick={handleClick}>
                        <Icon className="h-4 w-4" strokeWidth={2.5} />
                        {!sidebarCollapsed && <span>{item.label}</span>}
                    </Button>
                </TooltipTrigger>
                {sidebarCollapsed && <TooltipContent side="right">{item.label}</TooltipContent>}
            </Tooltip>
        </TooltipProvider>
    );
};