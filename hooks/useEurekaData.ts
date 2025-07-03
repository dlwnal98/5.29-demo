import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { EurekaServices, EurekaInstance, EurekaSummary } from "../types/eureka";

const fetchEurekaSummary = async () => {
  const { data } = await axios.get("/admin/summary");
  return data;
};

export function useEurekaSummary() {
  return useQuery<EurekaSummary>({
    queryKey: ["summary"],
    queryFn: fetchEurekaSummary,
    staleTime: Infinity, // 캐시 무한히 신선하다고 간주
    refetchOnWindowFocus: false, // 포커스돼도 재요청 안 함
    refetchOnMount: false, // 마운��� 시 재요청 안 함
    refetchOnReconnect: false, // 재접속 시 재요청 안 함
    enabled: true, // 자동 호출은 한 번만 발생 (true가 기본)
  });
}

const fetchEurekaServices = async () => {
  const { data } = await axios.get("/admin/services");
  return data;
};

export function useEurekaServices() {
  return useQuery<EurekaServices[]>({
    queryKey: ["services"],
    queryFn: fetchEurekaServices,
    // refetchInterval: 5000,
    // staleTime: 1000,
    // retry: 3,
    // retryDelay: 1000,
    staleTime: Infinity, // 캐시 무한히 신선하다고 간주
    refetchOnWindowFocus: false, // 포커스돼도 재요청 안 함
    refetchOnMount: false, // 마운트 시 재요청 안 함
    refetchOnReconnect: false, // 재접속 시 재요청 안 함
    enabled: true, // 자동 호출은 한 번만 발생 (true가 기본)
  });
}

const fetchEurekaInstances = async (instanceId: string) => {
  const { data } = await axios.get(`/admin/instance/${instanceId}`);
  return data;
};

export function useEurekaInstances(instanceId?: string) {
  return useQuery<EurekaInstance>({
    queryKey: ["instances", instanceId],
    queryFn: () => fetchEurekaInstances(instanceId!),
    enabled: !!instanceId, // instanceId가 있을 때만 실행
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}
