import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchEurekaData = async () => {
  const { data } = await axios.get(
    "http://192.168.123.102:8761/admin/services"
  );
  return data;
};

export function useEurekaData() {
  return useQuery({
    queryKey: ["eureka"],
    queryFn: fetchEurekaData,
    refetchInterval: 10 * 1000, // 10초마다 자동 호출
    staleTime: 0, // 즉시 stale 처리 (매번 refetch 유도)
  });
}
