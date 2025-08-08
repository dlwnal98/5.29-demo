import type { Project, NavItem } from '@/types';
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
  Boxes,
  NotebookText,
  Blocks,
  ChartSpline,
} from 'lucide-react';

// 사이드 바

export const projectsData: Project[] = [
  {
    slug: 'my-project',
    name: 'my-project',
    avatar: 'MP',
    visibility: 'Public',
    stars: 24,
    forks: 8,
    status: 'Active',
    lastCommit: '2 hours ago',
    contributors: 5,
  },
  {
    slug: 'another-project',
    name: 'another-project',
    avatar: 'AP',
    visibility: 'Private',
    stars: 12,
    forks: 4,
    status: 'Active',
    lastCommit: '1 day ago',
    contributors: 3,
  },
];

// localStorage에서 API 정보 가져오기
const getStoredApiInfo = () => {
  if (typeof window !== 'undefined') {
    const storedName = localStorage.getItem('selectedApiName');
    const storedId = localStorage.getItem('selectedApiId');
    return { name: storedName, id: storedId };
  }
  return { name: null, id: null };
};

// localStorage에 API 정보 저장하기
const setStoredApiInfo = (name: string | null, id: string | null) => {
  if (typeof window !== 'undefined') {
    if (name && id) {
      localStorage.setItem('selectedApiName', name);
      localStorage.setItem('selectedApiId', id);
    } else {
      localStorage.removeItem('selectedApiName');
      localStorage.removeItem('selectedApiId');
    }
  }
};

// 초기값을 localStorage에서 가져오기
const initialApiInfo = getStoredApiInfo();
export let selectedApiName: string | null = initialApiInfo.name;
export let selectedApiId: string | null = initialApiInfo.id;

export const setSelectedApiName = (name: string | null) => {
  selectedApiName = name;
  setStoredApiInfo(name, selectedApiId);
};

export const setSelectedApiId = (id: string | null) => {
  selectedApiId = id;
  setStoredApiInfo(selectedApiName, id);
};

// API 정보를 함께 설정하는 함수
export const setSelectedApiInfo = (name: string | null, id: string | null) => {
  selectedApiName = name;
  selectedApiId = id;
  setStoredApiInfo(name, id);
};

// API 정보 초기화 함수
export const clearSelectedApiInfo = () => {
  selectedApiName = null;
  selectedApiId = null;
  setStoredApiInfo(null, null);
};

export const getNavItems = (): NavItem[] => [
  {
    icon: ChartSpline,
    label: 'Dashboard',
    href: '/dashboard',
    isActive: true,
    access: ['SUPER'],
  },
  {
    icon: Blocks,
    label: 'Infra Packages',
    href: '/infra-packages',
    access: ['SUPER'],
    subItems: [
      {
        icon: Gateway,
        label: 'Gateway',
        href: '/infra-packages/gateway',
      },
      {
        icon: Cog,
        label: 'Config',
        href: '/infra-packages/config',
        subItems: [
          {
            icon: FolderOpen,
            label: 'Projects',
            href: '/infra-packages/config/projects?branch=main',
          },
          {
            icon: Key,
            label: 'Secret Key',
            href: '/infra-packages/config/secret-key',
          },
        ],
      },
      {
        icon: Server,
        label: 'Eureka',
        href: '/infra-packages/eureka',
      },
      {
        icon: Lock,
        label: 'Auth',
        href: '/infra-packages/auth',
        subItems: [
          {
            icon: FolderOpen,
            label: 'OAuth',
            href: '/infra-packages/auth/ouath',
          },
          {
            icon: Key,
            label: 'Key',
            href: '/infra-packages/auth/key',
          },
        ],
      },
      {
        icon: Package,
        label: 'Instance Module',
        href: '/infra-packages/instance-module',
      },
    ],
  },
  {
    label: 'Services',
    href: '/services',
    icon: Server,
    access: ['SUPER', 'ADMIN', 'MEMBER'],
    subItems: [
      {
        label: 'API Management',
        href: '/services/api-management',
        icon: Shield,
        subItems: [
          {
            label: 'APIs',
            href: '/services/api-management',
            icon: Globe,
          },
          ...(selectedApiName
            ? [
                { separator: true } as any,
                {
                  label: `API : ${selectedApiName}`,
                  href: `/services/api-management/resources?apiId=${selectedApiId}&apiName=${selectedApiName}`,
                  icon: Globe,
                },
                {
                  label: 'Stages',
                  href: `/services/api-management/stages?apiId=${selectedApiId}&apiName=${selectedApiName}`,
                  icon: Layers,
                },
                {
                  label: 'Models',
                  href: `/services/api-management/models?apiId=${selectedApiId}&apiName=${selectedApiName}`,
                  icon: Box,
                },
                { separator: true } as any,
              ]
            : []),
          {
            label: 'Target Endpoints',
            href: '/services/api-management/target-endpoints',
            icon: Target,
          },
          {
            label: 'API Keys',
            href: '/services/api-management/api-keys',
            icon: Key,
          },
        ],
      },
    ],
  },
  {
    icon: Users,
    label: 'Members',
    href: '/members',
    access: ['SUPER', 'ADMIN'],
  },
  {
    icon: NotebookText,
    label: 'Organization Manage',
    href: '/organization-manage',
    access: ['SUPER'],
  },
  {
    icon: Settings,
    label: 'Settings',
    href: '/settings',
    access: ['SUPER'],
  },
];

export const userMenuItems = [
  {
    icon: UserCog,
    label: '계정 설정',
    action: 'account',
  },
  {
    icon: LogOut,
    label: '로그아웃',
    action: 'logout',
  },
];
