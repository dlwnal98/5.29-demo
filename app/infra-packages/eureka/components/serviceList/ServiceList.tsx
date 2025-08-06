"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import ServiceCard from "./ServiceCard";
import { useEurekaServices } from "@/hooks/useEurekaData";
import ServiceCardSkeleton from "./ServiceCardSkeleton";

export default function ServiceList() {
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

  // 검색 필터링 함수 추가
  const filteredServices = servicesData?.filter((service) => {
    const trimmedSearch = searchTerm.trim();

    // 검색어가 비어있으면 모든 서비스 표시
    if (!trimmedSearch) return true;

    // 서비스명 검색 (한글, 영문 모두 대소문자 구분 없이)
    const serviceNameMatch = service.serviceName
      .toLowerCase()
      .includes(trimmedSearch.toLowerCase());

    // IP 주소 검색 (숫자와 점으로 구성된 IP 주소 검색)
    const ipMatch = service.instances.some((instance) => {
      const ipParts = instance.ip.split(".");
      const searchParts = trimmedSearch.split(".");

      // IP 주소 형식으로 검색하는 경우
      if (searchParts.length > 1) {
        return instance.ip.includes(trimmedSearch);
      }

      // 숫자 검색 (한 자리 숫자 포함)
      if (/^\d+$/.test(trimmedSearch)) {
        return (
          ipParts.some((part) => part.includes(trimmedSearch)) ||
          instance.ip.includes(trimmedSearch)
        );
      }

      return instance.ip.toLowerCase().includes(trimmedSearch.toLowerCase());
    });

    // 포트 번호 검색 (숫자만)
    const portMatch = service.instances.some((instance) => {
      // 숫자 검색 (한 자리 숫자 포함)
      if (/^\d+$/.test(trimmedSearch)) {
        return instance.port.toString().includes(trimmedSearch);
      }
      return false;
    });

    return serviceNameMatch || ipMatch || portMatch;
  });
  if (isError) return <div>데이터를 불러올 수 없습니다</div>;
  else
    return (
      //   검색
      <div>
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Input
                placeholder="서비스명, IP, 포트로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10 px-4 w-80 bg-white/50 dark:bg-gray-800/50 border-gray-200 rounded-full dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </div>
          </div>
        </div>

        {/* 서비스 목록 */}
        <div className="grid grid-rows-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <>
              {[...Array(servicesData?.length)].map((_, i) => (
                <ServiceCardSkeleton />
              ))}
            </>
          ) : (
            <ServiceCard servicesData={filteredServices ?? []} />
          )}
        </div>
      </div>
    );
}
