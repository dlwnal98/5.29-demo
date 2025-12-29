import { getNavItems } from "@/constants/app-layout-data";
import { SidebarItem } from "./SidebarItem";
import { useAuthStore } from "@/store/store";

export function SidebarNav({ sidebarCollapsed }: any) {

    const navItems = getNavItems();
    const userInfo = useAuthStore((state) => state.user);
    console.log(userInfo?.role)

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