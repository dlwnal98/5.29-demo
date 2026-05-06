import { useState, useEffect, useMemo } from "react";
import { useEurekaServices } from "@/hooks/use-eurekaData";
import { EurekaServices } from "@/types/eureka";

interface UseServiceListReturn {
  servicesData: EurekaServices[] | undefined;
  filteredServices: EurekaServices[] | undefined;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  loading: boolean;
}

export function useServiceList(): UseServiceListReturn {
  const [searchTerm, setSearchTerm] = useState("");
  const [delayed, setDelayed] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setDelayed(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const {
    data: servicesData,
    isLoading,
    isFetching,
    isError,
  } = useEurekaServices();

  const loading = isLoading || isFetching || delayed || !servicesData;

  const filteredServices = useMemo(() => {
    return servicesData?.filter((service) => {
      const trimmedSearch = searchTerm.trim();

      if (!trimmedSearch) return true;

      const serviceNameMatch = service.serviceName
        .toLowerCase()
        .includes(trimmedSearch.toLowerCase());

      const ipMatch = service.instances.some((instance) => {
        const ipParts = instance.ip.split(".");
        const searchParts = trimmedSearch.split(".");

        if (searchParts.length > 1) {
          return instance.ip.includes(trimmedSearch);
        }

        if (/^\d+$/.test(trimmedSearch)) {
          return (
            ipParts.some((part) => part.includes(trimmedSearch)) ||
            instance.ip.includes(trimmedSearch)
          );
        }

        return instance.ip.toLowerCase().includes(trimmedSearch.toLowerCase());
      });

      const portMatch = service.instances.some((instance) => {
        if (/^\d+$/.test(trimmedSearch)) {
          return instance.port.toString().includes(trimmedSearch);
        }
        return false;
      });

      return serviceNameMatch || ipMatch || portMatch;
    });
  }, [servicesData, searchTerm]);

  return {
    servicesData,
    filteredServices,
    searchTerm,
    setSearchTerm,
    isLoading,
    isFetching,
    isError,
    loading,
  };
}
