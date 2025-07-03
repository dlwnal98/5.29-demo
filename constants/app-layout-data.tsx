import {
  LayoutDashboard,
  Users,
  Settings,
  User,
  LogOut,
  Shield,
  Server,
  Network,
  Cloud,
  Key,
  Activity,
  FileText,
  Layers,
  Route,
  Zap,
} from "lucide-react"
import type { NavItem, UserMenuItem, Project } from "@/types"

export const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Services",
    icon: Server,
    subItems: [
      {
        label: "API Management",
        href: "/services/api-management",
        icon: Route,
        subItems: [
          {
            label: "리소스",
            href: "/services/api-management/resources",
            icon: Layers,
          },
          {
            label: "스테이지",
            href: "/services/api-management/stages",
            icon: Zap,
          },
        ],
      },
      {
        label: "API Keys",
        href: "/services/apikeys",
        icon: Key,
      },
    ],
  },
  {
    label: "Infra Packages",
    icon: Cloud,
    subItems: [
      {
        label: "Eureka",
        href: "/infra-packages/eureka",
        icon: Network,
      },
      {
        label: "Gateway",
        href: "/infra-packages/gateway",
        icon: Shield,
      },
      {
        label: "Config",
        icon: Settings,
        subItems: [
          {
            label: "Projects",
            href: "/infra-packages/config/projects",
            icon: FileText,
          },
          {
            label: "Secret Key",
            href: "/infra-packages/config/secret-key",
            icon: Key,
          },
        ],
      },
      {
        label: "Auth",
        href: "/infra-packages/auth",
        icon: Shield,
      },
    ],
  },
  {
    label: "Members",
    href: "/members",
    icon: Users,
  },
  {
    label: "Monitoring",
    href: "/monitoring",
    icon: Activity,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

export const userMenuItems: UserMenuItem[] = [
  {
    label: "Profile",
    action: "profile",
    icon: User,
  },
  {
    label: "Account",
    action: "account",
    icon: Settings,
  },
  {
    label: "Settings",
    action: "settings",
    icon: Settings,
  },
  {
    label: "Logout",
    action: "logout",
    icon: LogOut,
  },
]

export const projectsData: Project[] = [
  {
    id: "1",
    name: "E-commerce Platform",
    slug: "ecommerce-platform",
    description: "Full-stack e-commerce solution with React and Node.js",
    visibility: "Private",
    lastUpdated: "2 hours ago",
    status: "Active",
    tech: ["React", "Node.js", "PostgreSQL"],
  },
  {
    id: "2",
    name: "Mobile Banking App",
    slug: "mobile-banking",
    description: "Secure mobile banking application with biometric authentication",
    visibility: "Private",
    lastUpdated: "1 day ago",
    status: "In Development",
    tech: ["React Native", "Express", "MongoDB"],
  },
  {
    id: "3",
    name: "Analytics Dashboard",
    slug: "analytics-dashboard",
    description: "Real-time analytics dashboard for business intelligence",
    visibility: "Public",
    lastUpdated: "3 days ago",
    status: "Active",
    tech: ["Vue.js", "Python", "Redis"],
  },
]
