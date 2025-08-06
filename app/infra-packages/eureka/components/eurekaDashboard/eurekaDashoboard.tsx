import StatusCard from "./StatusCard";
import InstanceTable from "./InstanceTable";
import { Lightbulb, Server, Database, CheckCircle, MapPin } from "lucide-react";
import { MiniDonutChart, MiniBarChart } from "@/components/eureka-chart";
import { useEurekaSummary } from "@/hooks/useEurekaData";
import StatusCardSkeleton from "./StatusCardSkeleton";
import InstanceTableSkeleton from "./InstanceTableSkeleton";
import { useEffect, useState } from "react";

interface EurekaDashboardType {
  onTabChange: (any: string) => void;
}

export default function EurekaDashboard({ onTabChange }: EurekaDashboardType) {
  // 3초 지연 로직 추가
  // const [delayed, setDelayed] = useState(true);
  // useEffect(() => {
  //   const timer = setTimeout(() => setDelayed(false), 2000);
  //   return () => clearTimeout(timer);
  // }, []);
  const { data, isLoading, isError, isFetching } = useEurekaSummary();

  const loading = isLoading || isFetching || !data;

  if (isError) return <div>데이터를 불러올 수 없습니다</div>;
  else
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
          {isLoading ? (
            <>
              <StatusCardSkeleton colSpan={2} />
              <StatusCardSkeleton colSpan={2} />
              <StatusCardSkeleton colSpan={2} />
              <StatusCardSkeleton colSpan={3} />
              <StatusCardSkeleton colSpan={3} />
            </>
          ) : (
            <>
              <StatusCard
                icon={
                  <Lightbulb className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                }
                title="자기 보호 모드"
                desc="자기 보호 모드 활성화 여부"
                count={data?.selfPreservation ? "ON" : "OFF"}
                themeColor="rose"
                colSpan={2}
              />

              <StatusCard
                icon={
                  <Server className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                }
                title="전체 서비스"
                desc="등록된 서비스 수"
                count={data?.totalServices}
                themeColor="blue"
                colSpan={2}
                onTabChange={onTabChange}
              />

              <StatusCard
                icon={
                  <Database className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                }
                title="전체 인스턴스"
                desc="총 인스턴스 수"
                count={data?.totalInstances}
                themeColor="amber"
                colSpan={2}
              />

              <StatusCard
                icon={
                  <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                }
                title="활성 인스턴스"
                desc="정상 작동 중"
                count={data?.statusCount.UP}
                themeColor="emerald"
                colSpan={3}
                chart={
                  <MiniDonutChart
                    data={Object.entries(data?.statusCount ?? {}).map(
                      ([name, value]) => ({
                        name,
                        value,
                        color:
                          name === "UP"
                            ? "#10b981"
                            : name === "DOWN"
                            ? "#ef4444"
                            : "#f59e0b",
                        percentage: (value / (data?.totalInstances ?? 1)) * 100,
                      })
                    )}
                    size={50}
                  />
                }
                legend={
                  <div className="flex flex-wrap gap-x-4 gap-y-1 justify-start">
                    {Object.entries(data?.statusCount ?? {}).map(
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
                          <span className="text-[10px] text-gray-500">
                            ({value})
                          </span>
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
                count={Object.keys(data?.zoneCount ?? {}).length}
                themeColor="purple"
                colSpan={3}
                chart={
                  <MiniBarChart
                    data={Object.entries(data?.zoneCount ?? {}).map(
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
                    {Object.entries(data?.zoneCount ?? {}).map(
                      ([name, value], index) => (
                        <div key={index} className="flex items-center gap-1">
                          <div
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{
                              backgroundColor:
                                index === 0 ? "#3b82f6" : "#8b5cf6",
                            }}
                          />
                          <span className="text-[10px] font-medium text-gray-700 dark:text-gray-300">
                            {name}
                          </span>
                          <span className="text-[10px] text-gray-500">
                            ({value})
                          </span>
                        </div>
                      )
                    )}
                  </div>
                }
              />
            </>
          )}
        </div>
        {loading ? <InstanceTableSkeleton /> : <InstanceTable data={data} />}
      </div>
    );
}
