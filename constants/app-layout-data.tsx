import type { Project, NavItem } from "@/types"
import {
  LogOut,
  Users,
  BarChart3,
  Package,
  Zap,
  Shield,
  Settings,
  UserCog,
  WaypointsIcon as Gateway,
  Cog,
  Server,
  Lock,
  FolderOpen,
  Key,
  Layers,
  Globe,
  Box,
  Target,
} from "lucide-react"

// 사이드 바

export const projectsData: Project[] = [
  {
    slug: "my-project",
    name: "my-project",
    avatar: "MP",
    visibility: "Public",
    stars: 24,
    forks: 8,
    status: "Active",
    lastCommit: "2 hours ago",
    contributors: 5,
  },
  {
    slug: "another-project",
    name: "another-project",
    avatar: "AP",
    visibility: "Private",
    stars: 12,
    forks: 4,
    status: "Active",
    lastCommit: "1 day ago",
    contributors: 3,
  },
]

export let selectedApiName: string | null = null

export const setSelectedApiName = (name: string | null) => {
  selectedApiName = name
}

export const getNavItems = (): NavItem[] => [
  {
    icon: BarChart3,
    label: "Dashboard",
    href: "/dashboard",
    isActive: true,
  },
  {
    icon: Zap,
    label: "Infra Packages",
    href: "/infra-packages",
    subItems: [
      {
        icon: Gateway,
        label: "Gateway",
        href: "/infra-packages/gateway",
      },
      {
        icon: Cog,
        label: "Config",
        href: "/infra-packages/config",
        subItems: [
          {
            icon: FolderOpen,
            label: "Projects",
            href: "/infra-packages/config/projects?branch=main",
          },
          {
            icon: Key,
            label: "Secret Key",
            href: "/infra-packages/config/secret-key",
          },
        ],
      },
      {
        icon: Server,
        label: "Eureka",
        href: "/infra-packages/eureka",
      },
      {
        icon: Lock,
        label: "Auth",
        href: "/infra-packages/auth",
        subItems: [
          {
            icon: FolderOpen,
            label: "OAuth",
            href: "/infra-packages/auth/ouath",
          },
          {
            icon: Key,
            label: "Key",
            href: "/infra-packages/auth/key",
          },
        ],
      },
      {
        icon: Package,
        label: "Instance Module",
        href: "/infra-packages/instance-module",
      },
    ],
  },
  {
    label: "Services",
    icon: Server,
    subItems: [
      {
        label: "API Management",
        href: "/services/api-management",
        icon: Shield,
        subItems: [
          {
            label: selectedApiName ? `APIs: ${selectedApiName}` : "APIs",
            href: "/services/api-management",
            icon: Globe,
          },
          ...(selectedApiName
            ? [
                {
                  label: "Stages",
                  href: "/services/api-management/stages",
                  icon: Layers,
                },
                {
                  label: "Models",
                  href: "/services/api-management/models",
                  icon: Box,
                },
                { separator: true } as any,
              ]
            : []),
          {
            label: "Target Endpoints",
            href: "/services/api-management/target-endpoints",
            icon: Target,
          },
          {
            label: "API Keys",
            href: "/services/api-management/api-keys",
            icon: Key,
          },
        ],
      },
    ],
  },
  {
    icon: Users,
    label: "Members",
    href: "/members",
  },
  {
    icon: Settings,
    label: "Settings",
    href: "/settings",
  },
]

export const userMenuItems = [
  {
    icon: UserCog,
    label: "계정 설정",
    action: "account",
  },
  {
    icon: LogOut,
    label: "로그아웃",
    action: "logout",
  },
]
