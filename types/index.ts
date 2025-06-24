import type React from "react"
//사이드 바

export interface AppLayoutProps {
  children: React.ReactNode
  projectSlug?: string
}

export interface NavItem {
  icon: React.ElementType
  label: string
  href?: string
  isActive?: boolean
  subItems?: SubNavItem[]
}

export interface SubNavItem {
  icon: React.ElementType
  label: string
  href?: string
  isActive?: boolean
  subItems?: SubSubNavItem[] // 3단계 메뉴 지원을 위해 추가
}

export interface SubSubNavItem {
  icon: React.ElementType
  label: string
  href: string
  isActive?: boolean
}

export interface Project {
  slug: string
  name: string
  avatar: string
  visibility: string
  stars: number
  forks: number
  status: string
  lastCommit: string
  contributors: number
}

export interface NavButtonProps {
  item: NavItem
  sidebarCollapsed: boolean
  onClick?: () => void
  pathname: string
}
