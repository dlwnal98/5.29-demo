import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { MiniBarChart } from "@/components/eureka-chart";

interface ZoneCardProps {
  zoneCount: Record<string, number>;
}

export function ZoneCard({ zoneCount }: ZoneCardProps) {
  return (
    <Card className="col-span-3 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">가용존</CardTitle>
        <MapPin className="h-4 w-4 text-purple-600 dark:text-purple-400" />
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
              {Object.keys(zoneCount).length}
            </div>
            <p className="text-xs text-purple-600 dark:text-purple-400">
              활성 가용존
            </p>
          </div>
          <MiniBarChart
            data={Object.entries(zoneCount).map(([name, value], index) => ({
              name,
              value,
              color: index === 0 ? "#3b82f6" : "#8b5cf6",
            }))}
            width={50}
            height={30}
          />
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 justify-start">
          {Object.entries(zoneCount).map(([name, value], index) => (
            <div key={index} className="flex items-center gap-1">
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: index === 0 ? "#3b82f6" : "#8b5cf6" }}
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
