import type { LucideIcon } from 'lucide-react';

export interface Project {
  slug: string;
  name: string;
  avatar: string;
  visibility: 'Public' | 'Private';
  stars: number;
  forks: number;
  status: string;
  lastCommit: string;
  contributors: number;
}

export interface SubNavItem {
  icon: LucideIcon;
  label: string;
  href?: string;
  subItems?: SubNavItem[];
  separator?: boolean;
}

export interface NavItem {
  icon: LucideIcon;
  label: string;
  href?: string;
  isActive?: boolean;
  subItems?: SubNavItem[];
  access?: string[];
}

export interface NavButtonProps {
  item: NavItem;
  sidebarCollapsed: boolean;
  onClick?: () => void;
  pathname: string;
}
