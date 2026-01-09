import { useEurekaSummary } from "@/hooks/use-eurekaData";
import { EurekaSummary } from "@/types/eureka";

interface UseEurekaDashboardReturn {
  data: EurekaSummary | undefined;
  isLoading: boolean;
  isError: boolean;
  isFetching: boolean;
  loading: boolean;
}

export function useEurekaDashboard(): UseEurekaDashboardReturn {
  const { data, isLoading, isError, isFetching } = useEurekaSummary();

  const loading = isLoading || isFetching || !data;

  return {
    data,
    isLoading,
    isError,
    isFetching,
    loading,
  };
}
