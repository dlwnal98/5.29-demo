import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

interface SelfPreservationCardProps {
  isEnabled: boolean;
}

export function SelfPreservationCard({ isEnabled }: SelfPreservationCardProps) {
  return (
    <Card className="col-span-2 bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-900/20 dark:to-rose-800/20 border-rose-200 dark:border-rose-800">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">자기 보호 모드</CardTitle>
        <Lightbulb className="h-4 w-4 text-rose-600 dark:text-rose-400" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-rose-700 dark:text-rose-300">
          {isEnabled ? "ON" : "OFF"}
        </div>
        <p className="text-xs text-rose-600 dark:text-rose-400">
          자기 보호 모드 활성화 여부
        </p>
      </CardContent>
    </Card>
  );
}
