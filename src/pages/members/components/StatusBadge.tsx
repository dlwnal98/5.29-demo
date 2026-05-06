import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  active: number;
}

export default function StatusBadge({ active }: StatusBadgeProps) {
  return active === 1 ? (
    <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800">
      ACTIVE
    </Badge>
  ) : (
    <Badge className="bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200 border-red-200 dark:border-red-700">
      INACTIVE
    </Badge>
  );
}
