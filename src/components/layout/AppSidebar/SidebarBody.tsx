import { getNavItems, clearSelectedApiInfo } from "@/constants/app-layout-data";
import { SidebarItem } from "./SidebarItem";
import { useAuthStore } from "@/stores/store";
import { useLocation } from "react-router-dom";

export function SidebarBody({ sidebarCollapsed }: any) {
    const { pathname } = useLocation();
    const userInfo = useAuthStore((state) => state.user);

    // API Management 경로가 아닐 때 selectedApiInfo를 초기화
    // getNavItems() 호출 전에 동기적으로 실행되어야 함
    const isApiManagementPath = pathname.startsWith('/services/api-management');
    if (!isApiManagementPath) {
        clearSelectedApiInfo();
    }

    // pathname이 변경될 때마다 getNavItems()를 다시 호출하여 최신 상태 반영
    const navItems = getNavItems();

    return (
        <nav className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-none">
            {navItems.map((item) => (
                item?.access?.includes(userInfo?.role) && (
                    <SidebarItem key={item.label} item={item} sidebarCollapsed={sidebarCollapsed} />
                )
            ))}
        </nav>
    )
}