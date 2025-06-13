import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Server } from "lucide-react";

interface ServiceCountCardProps {
  totalServices: number;
}

export function ServiceCountCard({ totalServices }: ServiceCountCardProps) {
  return (
    <Card className="col-span-2 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">전체 서비스</CardTitle>
        <Server className="h-4 w-4 text-blue-600 dark:text-blue-400" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
          {totalServices}
        </div>
        <p className="text-xs text-blue-600 dark:text-blue-400">
          등록된 서비스 수
        </p>
      </CardContent>
    </Card>
  );
}
