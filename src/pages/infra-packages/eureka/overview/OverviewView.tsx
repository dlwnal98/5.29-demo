import { ReactNode } from "react";
import StatusCard from "./components/StatusCard";
import InstanceTable from "./components/InstanceTable";
import StatusCardSkeleton from "./components/StatusCardSkeleton";
import InstanceTableSkeleton from "./components/InstanceTableSkeleton";
import { Lightbulb, Server, Database, CheckCircle, MapPin } from "lucide-react";
import { MiniDonutChart, MiniBarChart } from "@/pages/infra-packages/eureka/overview/components/Charts";
import { EurekaSummary } from "@/types/eureka";

interface StatusCardConfig {
  icon: ReactNode;
  title: string;
  desc: string;
  count: string | number | undefined;
  themeColor: string;
  colSpan: number;
  chart?: ReactNode;
  legend?: ReactNode;
  onTabChange?: (tab: string) => void;
}

interface OverviewViewProps {
  data?: EurekaSummary | undefined;
  isLoading?: boolean;
  loading?: boolean;
  onTabChange: (tab: string) => void;
}

function getStatusColor(name: string): string {
  if (name === "UP") return "#10b981";
  if (name === "DOWN") return "#ef4444";
  return "#f59e0b";
}

function StatusLegend({ entries }: { entries: [string, number][] }) {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1 justify-start">
      {entries.map(([name, value]) => (
        <div key={name} className="flex items-center gap-1">
          <div
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: getStatusColor(name) }}
          />
          <span className="text-[10px] font-medium text-gray-700 dark:text-gray-300">
            {name}
          </span>
          <span className="text-[10px] text-gray-500">({value})</span>
        </div>
      ))}
    </div>
  );
}

function ZoneLegend({ entries }: { entries: [string, number][] }) {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1 justify-start">
      {entries.map(([name, value], index) => (
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
  );
}

function buildStatusCardConfigs(
  data: EurekaSummary | undefined,
  onTabChange: (tab: string) => void
): StatusCardConfig[] {
  const statusEntries = Object.entries(data?.statusCount ?? {}) as [string, number][];
  const zoneEntries = Object.entries(data?.zoneCount ?? {}) as [string, number][];

  return [
    {
      icon: <Lightbulb className="h-4 w-4 text-rose-600 dark:text-rose-400" />,
      title: "자기 보호 모드",
      desc: "자기 보호 모드 활성화 여부",
      count: data?.selfPreservation ? "ON" : "OFF",
      themeColor: "rose",
      colSpan: 2,
    },
    {
      icon: <Server className="h-4 w-4 text-blue-600 dark:text-blue-400" />,
      title: "전체 서비스",
      desc: "등록된 서비스 수",
      count: data?.totalServices,
      themeColor: "blue",
      colSpan: 2,
      onTabChange,
    },
    {
      icon: <Database className="h-4 w-4 text-amber-600 dark:text-amber-400" />,
      title: "전체 인스턴스",
      desc: "총 인스턴스 수",
      count: data?.totalInstances,
      themeColor: "amber",
      colSpan: 2,
    },
    {
      icon: <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />,
      title: "활성 인스턴스",
      desc: "정상 작동 중",
      count: data?.statusCount.UP,
      themeColor: "emerald",
      colSpan: 3,
      chart: (
        <MiniDonutChart
          data={statusEntries.map(([name, value]) => ({
            name,
            value,
            color: getStatusColor(name),
            percentage: (value / (data?.totalInstances ?? 1)) * 100,
          }))}
          size={50}
        />
      ),
      legend: <StatusLegend entries={statusEntries} />,
    },
    {
      icon: <MapPin className="h-4 w-4 text-purple-600 dark:text-purple-400" />,
      title: "가용존",
      desc: "활성 가용존",
      count: Object.keys(data?.zoneCount ?? {}).length,
      themeColor: "purple",
      colSpan: 3,
      chart: (
        <MiniBarChart
          data={zoneEntries.map(([name, value], index) => ({
            name,
            value,
            color: index === 0 ? "#3b82f6" : "#8b5cf6",
          }))}
          width={50}
          height={30}
        />
      ),
      legend: <ZoneLegend entries={zoneEntries} />,
    },
  ];
}

export default function OverviewView({
  data,
  isLoading,
  loading,
  onTabChange,
}: OverviewViewProps) {
  const statusCardConfigs = buildStatusCardConfigs(data, onTabChange);

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
            {statusCardConfigs.map((config, index) => (
              <StatusCard
                key={index}
                icon={config.icon}
                title={config.title}
                desc={config.desc}
                count={config.count}
                themeColor={config.themeColor}
                colSpan={config.colSpan}
                chart={config.chart}
                legend={config.legend}
                onTabChange={config.onTabChange}
              />
            ))}
          </>
        )}
      </div>
      {loading ? <InstanceTableSkeleton /> : <InstanceTable data={data} />}
    </div>
  );
}
