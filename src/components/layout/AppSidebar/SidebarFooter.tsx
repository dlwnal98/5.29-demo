// components/layout/sidebar/SidebarFooter.tsx
import { ThemeToggle, CollapseThemeToggle } from './ThemeToggle';
import UserProfileMenu from './UserProfileMenu'; // 드롭다운 부분도 따로 분리 추천

export const SidebarFooter = ({ sidebarCollapsed }: { sidebarCollapsed: boolean; }) => (
    <div className="mt-auto p-4">
        <UserProfileMenu sidebarCollapsed={sidebarCollapsed} />
        <div className={`mt-2 flex ${sidebarCollapsed ? 'justify-center' : 'justify-end'}`}>
            {sidebarCollapsed ? <CollapseThemeToggle /> : <ThemeToggle />}
        </div>
    </div>
);