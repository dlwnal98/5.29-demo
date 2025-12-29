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
    Settings,
} from 'lucide-react';
import {
    userMenuItems,
} from '@/constants/app-layout-data';
import { useAuthStore } from '@/store/store';
import { useNavigate } from 'react-router-dom';


export default function UserProfileMenu({ sidebarCollapsed }: any) {
    const navigate = useNavigate();
    const userInfo = useAuthStore((state) => state.user);


    const handleLogout = async () => {
        useAuthStore.getState().clearAuth();
        window.location.replace('/');
    };


    const handleUserMenuClick = (action: string) => {
        switch (action) {
            case 'account':
                navigate('/settings/account');
                break;
            case 'logout':
                handleLogout();
                break;
            default:
                break;
        }
    };


    return (
        <div className="border-t border-blue-200/50 dark:border-gray-700/50 py-4">
            <div className="flex items-center justify-between">

                {/* 사이드바 펼쳐져 있을 때 */}
                {!sidebarCollapsed ? (
                    <>
                        <div className="flex items-center space-x-2 w-full">
                            <Avatar className="h-10 w-10 flex items-center justify-center bg-gradient-to-br shadow-lg from-blue-600 to-indigo-600 text-white text-sm font-bold">
                                {userInfo?.name?.slice(0, 1)}
                            </Avatar>
                            <div className="flex-1 min-w-0 text-left space-y-1">
                                <Badge
                                    variant="outline"
                                    className="!mt-2 text-xs bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-800">
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
                                    className="w-auto justify-end p-2 h-auto  bg-transparent hover:bg-blue-50 dark:hover:bg-gray-700">
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
                                        className="hover:cursor-pointer">
                                        {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                                        <span>{item.label}</span>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </>

                    // 사이드 닫혔을 때
                ) : (
                    <>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full justify-center p-2 hover:bg-blue-50 bg-transparent  dark:hover:bg-gray-800">
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
                                        className="!mt-2 text-xs bg-blue-50 text-blue-700 border-blue-200  dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-800">
                                        {userInfo?.organizationName || 'NEXFRON'}
                                    </Badge>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {userMenuItems.map((item) => (
                                    <DropdownMenuItem
                                        key={item.action}
                                        onClick={() => handleUserMenuClick(item.action)}>
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
    )
}