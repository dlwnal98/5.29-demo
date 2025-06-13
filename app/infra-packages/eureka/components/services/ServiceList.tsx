import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { ServiceCard } from "./ServiceCard";

interface Service {
  serviceName: string;
  instanceCount: number;
  statusSummary: {
    UP: number;
    DOWN: number;
  };
  zones: string[];
  versions: string[];
  instances: {
    instanceId: string;
    ip: string;
    port: number;
    isPortEnabled: boolean;
    status: string;
    zone: string;
    gitCommit: string;
    lastUpdatedTimestamp: number;
  }[];
}

interface ServiceListProps {
  services: Service[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function ServiceList({
  services,
  searchTerm,
  onSearchChange,
}: ServiceListProps) {
  const filteredServices = services.filter((service) => {
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

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="서비스명, IP, 포트로 검색..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>
      <div className="space-y-4">
        {filteredServices.map((service) => (
          <ServiceCard
            key={service.serviceName}
            serviceName={service.serviceName}
            instanceCount={service.instanceCount}
            statusSummary={service.statusSummary}
            zones={service.zones}
            versions={service.versions}
            instances={service.instances}
          />
        ))}
      </div>
    </div>
  );
}
