// components/layout/sidebar/SidebarHeader.tsx
import { Waves } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const SidebarHeader = ({ sidebarCollapsed, projectInfo }: { sidebarCollapsed: boolean; projectInfo: any }) => (
    <div className="flex flex-col">
        {/* 프로젝트 컨텍스트 (상단) */}
        {projectInfo && !sidebarCollapsed && (
            <div className="border-b border-blue-200/50 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/50 dark:to-indigo-900/50">
                <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-[5px]">{projectInfo.name}</h2>
                <Badge variant="secondary" className="text-xs">{projectInfo.visibility}</Badge>
            </div>
        )}

        {/* 브랜드 로고 */}
        <div className={`flex justify-center items-center p-4 pb-3 ${sidebarCollapsed ? 'justify-center' : 'space-x-2'}`}>
            <a href="/dashboard" className="flex items-center space-x-2">
                <div className="h-6 w-6 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                    <Waves className="h-4 w-4 text-white" />
                </div>
                {!sidebarCollapsed && (
                    <span className="font-bold text-[18px] bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Clalink APIM
                    </span>
                )}
            </a>
        </div>
        <div className="h-px bg-[#e2e8f0] dark:bg-gray-700 mx-6" />
    </div>
);