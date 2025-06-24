"use client"

import type { ReactNode } from "react"
import { AppHeader } from "./AppHeader"
import { AppSidebar } from "./AppSidebar"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"

interface AppLayoutProps {
  children: ReactNode
  projectSlug?: string
}

export function AppLayout({ children, projectSlug }: AppLayoutProps) {
  const pathname = usePathname()
  const isFileViewPage = pathname?.includes("/config/view")

  // /config/view 페이지일 때는 사이드바를 접은 상태로 시작
  const [sidebarCollapsed, setSidebarCollapsed] = useState(isFileViewPage || false)

  // 경로 변경 시 사이드바 상태 업데이트
  useEffect(() => {
    if (pathname?.includes("/config/view")) {
      setSidebarCollapsed(true)
    }
  }, [pathname])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <AppHeader sidebarCollapsed={sidebarCollapsed} setSidebarCollapsed={setSidebarCollapsed} />
      <div className="flex">
        <AppSidebar
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
          projectSlug={projectSlug}
        />
        <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? "ml-16" : "ml-[220px]"}`}>
          {children}
        </main>
      </div>
    </div>
  )
}
