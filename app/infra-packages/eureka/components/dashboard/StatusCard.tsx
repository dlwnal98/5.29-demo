import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { MiniDonutChart } from "@/components/eureka-chart";

interface StatusCardProps {
  statusCount: {
    UP: number;
    DOWN: number;
    OUT_OF_SERVICE: number;
  };
  totalInstances: number;
}

export function StatusCard({ statusCount, totalInstances }: StatusCardProps) {
  return (
    <Card className="col-span-3 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border-emerald-200 dark:border-emerald-800">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">활성 인스턴스</CardTitle>
        <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
              {statusCount.UP}
            </div>
            <p className="text-xs text-emerald-600 dark:text-emerald-400">
              정상 작동 중
            </p>
          </div>
          <MiniDonutChart
            data={Object.entries(statusCount).map(([name, value]) => ({
              name,
              value,
              color:
                name === "UP"
                  ? "#10b981"
                  : name === "DOWN"
                  ? "#ef4444"
                  : "#f59e0b",
              percentage: (value / totalInstances) * 100,
            }))}
            size={50}
          />
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 justify-start">
          {Object.entries(statusCount).map(([name, value]) => (
            <div key={name} className="flex items-center gap-1">
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{
                  backgroundColor:
                    name === "UP"
                      ? "#10b981"
                      : name === "DOWN"
                      ? "#ef4444"
                      : "#f59e0b",
                }}
              />
              <span className="text-[10px] font-medium text-gray-700 dark:text-gray-300">
                {name}
              </span>
              <span className="text-[10px] text-gray-500">({value})</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
