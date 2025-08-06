'use client';

import type { ReactNode } from 'react';
import { AppHeader } from './AppHeader';
import { AppSidebar } from './AppSidebar';
import { useState, useEffect, Suspense, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import ProtectedRoute from '../ProtectedRoute';

interface AppLayoutProps {
  children: ReactNode;
  projectSlug?: string;
}

export function AppLayout({ children, projectSlug }: AppLayoutProps) {
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // File Structure가 있는 페이지들에서는 기본적으로 사이드바를 접어둠
  useEffect(() => {
    const fileStructurePages = [
      '/infra-packages/config/projects/view',
      '/infra-packages/config/projects/edit',
      '/infra-packages/config/projects/create',
      '/infra-packages/config/projects/upload',
      '/infra-packages/config/projects/commits',
      '/infra-packages/config/projects/commit',
    ];

    const shouldCollapse = fileStructurePages.some((page) => pathname?.startsWith(page));
    setSidebarCollapsed(shouldCollapse);
  }, [pathname]);

  // useCallback으로 핸들러 고정
  const handleSidebarCollapsed = useCallback(() => {
    setSidebarCollapsed((prev) => !prev);
  }, []);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <AppHeader
            sidebarCollapsed={sidebarCollapsed}
            setSidebarCollapsed={handleSidebarCollapsed}
          />
          <div className="flex">
            <AppSidebar
              sidebarCollapsed={sidebarCollapsed}
              setSidebarCollapsed={handleSidebarCollapsed}
              projectSlug={projectSlug}
            />
            <main
              className={`flex-1 transition-all duration-300 ${
                sidebarCollapsed ? 'ml-16' : 'ml-[250px]'
              }`}
            >
              {children}
            </main>
          </div>
        </div>
      </ProtectedRoute>
    </Suspense>
  );
}
