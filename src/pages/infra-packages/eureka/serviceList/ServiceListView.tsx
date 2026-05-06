import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import ServiceCard from "./ServiceCard";
import ServiceCardSkeleton from "./ServiceCardSkeleton";
import { EurekaServices } from "@/types/eureka";

interface ServiceListViewProps {
  servicesData: EurekaServices[] | undefined;
  filteredServices: EurekaServices[] | undefined;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  loading: boolean;
}

export default function ServiceListView({
  servicesData,
  filteredServices,
  searchTerm,
  onSearchChange,
  loading,
}: ServiceListViewProps) {
  return (
    <div>
      <div className="flex items-center justify-center mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Input
              placeholder="서비스명, IP, 포트로 검색..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pr-10 px-4 w-80 bg-white/50 dark:bg-gray-800/50 border-gray-200 rounded-full dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          </div>
        </div>
      </div>

      <div className="grid grid-rows-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <>
            {[...Array(servicesData?.length)].map((_, i) => (
              <ServiceCardSkeleton key={i} />
            ))}
          </>
        ) : (
          <ServiceCard servicesData={filteredServices ?? []} />
        )}
      </div>
    </div>
  );
}
