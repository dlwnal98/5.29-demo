import { Project, NavItem } from "@/types";
import {
  User,
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
} from "lucide-react";

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
];

export const navItems: NavItem[] = [
  {
    icon: BarChart3,
    label: "Dashboard",
    href: "/dashboard",
    isActive: true,
  },
  {
    icon: Zap,
    label: "Infra Packages",
    subItems: [
      {
        icon: Gateway,
        label: "Gateway",
        href: "/infra-packages/gateway",
      },
      {
        icon: Cog,
        label: "Config",
        // href: "http://1.224.162.188:51435",
        href: "/infra-packages/config",
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
      },
    ],
  },
  {
    icon: Shield,
    label: "Services",
    href: "/services",
  },
  {
    icon: Package,
    label: "Monitoring",
    href: "/monitoring",
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
];

export const userMenuItems = [
  // {
  //   icon: User,
  //   label: "프로필",
  //   action: "profile",
  // },
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
];
