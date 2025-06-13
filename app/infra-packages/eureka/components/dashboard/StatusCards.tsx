import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { eurekaDashboardData } from "@/constants/eurekaData";
import { Lightbulb, Server, Database, CheckCircle, MapPin } from "lucide-react";
import { MiniDonutChart, MiniBarChart } from "@/components/eureka-chart";

export function StatusCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
      <StatusCard
        icon={
          <Lightbulb className="h-4 w-4 text-rose-600 dark:text-rose-400" />
        }
        title="자기 보호 모드"
        desc="자기 보호 모드 활성화 여부"
        count={eurekaDashboardData.selfPreservation ? "ON" : "OFF"}
        themeColor="rose"
        colSpan={2}
      />

      <StatusCard
        icon={<Server className="h-4 w-4 text-blue-600 dark:text-blue-400" />}
        title="전체 서비스"
        desc="등록된 서비스 수"
        count={eurekaDashboardData.totalServices}
        themeColor="blue"
        colSpan={2}
      />

      <StatusCard
        icon={
          <Database className="h-4 w-4 text-amber-600 dark:text-amber-400" />
        }
        title="전체 인스턴스"
        desc="총 인스턴스 수"
        count={eurekaDashboardData.totalInstances}
        themeColor="amber"
        colSpan={2}
      />

      <StatusCard
        icon={
          <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
        }
        title="활성 인스턴스"
        desc="정상 작동 중"
        count={eurekaDashboardData.statusCount.UP}
        themeColor="emerald"
        colSpan={3}
        chart={
          <MiniDonutChart
            data={Object.entries(eurekaDashboardData.statusCount).map(
              ([name, value]) => ({
                name,
                value,
                color:
                  name === "UP"
                    ? "#10b981"
                    : name === "DOWN"
                    ? "#ef4444"
                    : "#f59e0b",
                percentage: (value / eurekaDashboardData.totalInstances) * 100,
              })
            )}
            size={50}
          />
        }
        legend={
          <div className="flex flex-wrap gap-x-4 gap-y-1 justify-start">
            {Object.entries(eurekaDashboardData.statusCount).map(
              ([name, value]) => (
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
              )
            )}
          </div>
        }
      />

      <StatusCard
        icon={
          <MapPin className="h-4 w-4 text-purple-600 dark:text-purple-400" />
        }
        title="가용존"
        desc="활성 가용존"
        count={Object.keys(eurekaDashboardData.zoneCount).length}
        themeColor="purple"
        colSpan={3}
        chart={
          <MiniBarChart
            data={Object.entries(eurekaDashboardData.zoneCount).map(
              ([name, value], index) => ({
                name,
                value,
                color: index === 0 ? "#3b82f6" : "#8b5cf6",
              })
            )}
            width={50}
            height={30}
          />
        }
        legend={
          <div className="flex flex-wrap gap-x-4 gap-y-1 justify-start">
            {Object.entries(eurekaDashboardData.zoneCount).map(
              ([name, value], index) => (
                <div key={index} className="flex items-center gap-1">
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor: index === 0 ? "#3b82f6" : "#8b5cf6",
                    }}
                  />
                  <span className="text-[10px] font-medium text-gray-700 dark:text-gray-300">
                    {name}
                  </span>
                  <span className="text-[10px] text-gray-500">({value})</span>
                </div>
              )
            )}
          </div>
        }
      />
    </div>
  );
}

interface StatusCardProps {
  icon: ReactNode;
  title: string;
  desc: string;
  count: string | number;
  themeColor: string;
  chart?: ReactNode;
  legend?: ReactNode;
  colSpan: number;
}

export function StatusCard({
  icon,
  title,
  desc,
  count,
  themeColor,
  chart,
  legend,
  colSpan,
}: StatusCardProps) {
  return (
    <Card
      className={`col-span-${colSpan} bg-gradient-to-br from-${themeColor}-50 to-${themeColor}-100 dark:from-${themeColor}-900/20 dark:to-${themeColor}-800/20 border-${themeColor}-200 dark:border-${themeColor}-800`}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <div
              className={`text-2xl font-bold text-${themeColor}-700 dark:text-${themeColor}-300`}
            >
              {count}
            </div>
            <p
              className={`text-xs text-${themeColor}-600 dark:text-${themeColor}-400`}
            >
              {desc}
            </p>
          </div>
          {chart}
        </div>
        {legend}
      </CardContent>
    </Card>
  );
}
