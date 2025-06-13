import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database } from "lucide-react";

interface InstanceCountCardProps {
  totalInstances: number;
}

export function InstanceCountCard({ totalInstances }: InstanceCountCardProps) {
  return (
    <Card className="col-span-2 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-amber-200 dark:border-amber-800">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">전체 인스턴스</CardTitle>
        <Database className="h-4 w-4 text-amber-600 dark:text-amber-400" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">
          {totalInstances}
        </div>
        <p className="text-xs text-amber-600 dark:text-amber-400">
          총 인스턴스 수
        </p>
      </CardContent>
    </Card>
  );
}
