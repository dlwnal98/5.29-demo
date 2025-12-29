// components/layout/sidebar/index.tsx
import { SidebarFooter } from "./SidebarFooter";
import { SidebarHeader } from "./SidebarHeader";
import type { Dispatch, SetStateAction } from "react";
import { projectsData } from "@/constants/app-layout-data";
import { SidebarNav } from "./SidebarNav";


interface AppSidebarProps {
    sidebarCollapsed: boolean;
    setSidebarCollapsed: Dispatch<SetStateAction<boolean>>;
    projectSlug?: string;
}


export function AppSidebar({ sidebarCollapsed, projectSlug }: AppSidebarProps) {
    const currentProject = projectSlug ? projectsData.find(p => p.slug === projectSlug) : null;



    return (
        <aside className={`fixed top-0 z-40 h-[100vh] border-b border-blue-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60 transition-all duration-500 ${sidebarCollapsed ? 'w-16' : 'w-[250px]'} ...`}>
            <div className="flex h-full flex-col">
                {/* 1. 헤더 섹션 */}
                <SidebarHeader sidebarCollapsed={sidebarCollapsed} projectInfo={currentProject} />

                {/* 2. 네비게이션 섹션 */}
                <SidebarNav sidebarCollapsed={sidebarCollapsed} />

                {/* 3. 푸터 섹션 */}
                <SidebarFooter sidebarCollapsed={sidebarCollapsed} />
            </div>
        </aside>
    );
}