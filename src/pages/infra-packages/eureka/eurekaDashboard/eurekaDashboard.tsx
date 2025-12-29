import { useEurekaDashboard } from "./hooks/useEurekaDashboard";
import EurekaDashboardView from "./EurekaDashboardView";

interface EurekaDashboardProps {
  onTabChange: (tab: string) => void;
}

export default function EurekaDashboard({ onTabChange }: EurekaDashboardProps) {
  const { data, isLoading, isError, loading } = useEurekaDashboard();

  if (isError) return <div>데이터를 불러올 수 없습니다</div>;

  return (
    <EurekaDashboardView
      data={data}
      isLoading={isLoading}
      loading={loading}
      onTabChange={onTabChange}
    />
  );
}
