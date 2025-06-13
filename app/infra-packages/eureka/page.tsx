"use client";

import { useState, useRef } from "react";
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Server,
  Activity,
  Globe,
  Shield,
  Clock,
  MapPin,
  AlertCircle,
  CheckCircle,
  XCircle,
  Network,
  Database,
  Lightbulb,
  Search,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  eurekaDashboardData,
  eurekaServicesData,
  instanceData,
} from "@/constants/eurekaData";
import { MiniDonutChart, MiniBarChart } from "@/components/eureka-chart";

export default function EurekaPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedInstance, setSelectedInstance] = useState<any>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);
  const [refreshing, setRefreshing] = useState(false);

  // 상태 추가
  const [searchTerm, setSearchTerm] = useState("");

  // 검색 필터링 함수 추가
  const filteredServices = eurekaServicesData.filter((service) => {
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

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "UP":
        return <CheckCircle className="w-4 h-4" />;
      case "DOWN":
        return <XCircle className="w-4 h-4" />;
      case "OUT_OF_SERVICE":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const StatusBadge = ({ status }: { status: string }) => (
    <Badge
      variant={
        status === "UP"
          ? "default"
          : status === "DOWN"
          ? "destructive"
          : "secondary"
      }
      className="flex items-center gap-1"
    >
      {getStatusIcon(status)}
      {status}
    </Badge>
  );

  // 인스턴스 변경 시 스크롤을 최상위로 이동하는 함수
  const handleInstanceChange = (instance: any) => {
    setSelectedInstance(instance);
    // 다음 렌더링 후 스크롤 이동
    setTimeout(() => {
      if (modalContentRef.current) {
        modalContentRef.current.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 100);
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Main Content */}

        {/* 탭 메뉴 */}
        <div className="border-b border-gray-200 dark:border-gray-800">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab("overview")}
              className={`py-4 px-1 relative font-medium text-sm transition-colors ${
                activeTab === "overview"
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              <span className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                전역 대시보드
              </span>
              {activeTab === "overview" && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 dark:bg-blue-400"></span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("services")}
              className={`py-4 px-1 relative font-medium text-sm transition-colors ${
                activeTab === "services"
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              <span className="flex items-center gap-2">
                <Server className="w-4 h-4" />
                서비스 목록
              </span>
              {activeTab === "services" && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 dark:bg-blue-400"></span>
              )}
            </button>
          </div>
        </div>
        {/* Overview Tab */}
        {/* Metrics Cards */}
        {activeTab === "overview" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
              <Card className="col-span-2 bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-900/20 dark:to-rose-800/20 border-rose-200 dark:border-rose-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    자기 보호 모드
                  </CardTitle>
                  <Lightbulb className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-rose-700 dark:text-rose-300">
                    ON
                  </div>
                  <p className="text-xs text-rose-600 dark:text-rose-400">
                    자기 보호 모드 활성화 여부{" "}
                  </p>
                </CardContent>
              </Card>

              <Card className="col-span-2 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    전체 서비스
                  </CardTitle>
                  <Server className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                    {eurekaDashboardData.totalServices}
                  </div>
                  <p className="text-xs text-blue-600 dark:text-blue-400">
                    등록된 서비스 수
                  </p>
                </CardContent>
              </Card>

              <Card className="col-span-2 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-amber-200 dark:border-amber-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    전체 인스턴스
                  </CardTitle>
                  <Database className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">
                    {eurekaDashboardData.totalInstances}
                  </div>
                  <p className="text-xs text-amber-600 dark:text-amber-400">
                    총 인스턴스 수
                  </p>
                </CardContent>
              </Card>

              {/* 활성 인스턴스 카드에 미니 도넛 차트 추가 */}
              <Card className="col-span-3 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border-emerald-200 dark:border-emerald-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    활성 인스턴스
                  </CardTitle>
                  <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                        {eurekaDashboardData.statusCount.UP}
                      </div>
                      <p className="text-xs text-emerald-600 dark:text-emerald-400">
                        정상 작동 중
                      </p>
                    </div>
                    <MiniDonutChart
                      data={Object.entries(eurekaDashboardData.statusCount).map(
                        ([name, value]) => ({
                          name,
                          value,
                          color:
                            name === "UP"
                              ? "#10b981"
                              : name === "DOWN"
                              ? "#ef4444"
                              : "#f59e0b",
                          percentage:
                            (value / eurekaDashboardData.totalInstances) * 100,
                        })
                      )}
                      size={50}
                    />
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 justify-start">
                    {Object.entries(eurekaDashboardData.statusCount).map(
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
                </CardContent>
              </Card>

              {/* 가용존 카드에 미니 바 차트 추가 */}
              <Card className="col-span-3 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">가용존</CardTitle>
                  <MapPin className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                        {Object.keys(eurekaDashboardData.zoneCount).length}
                      </div>
                      <p className="text-xs text-purple-600 dark:text-purple-400">
                        활성 가용존
                      </p>
                    </div>
                    <MiniBarChart
                      data={Object.entries(eurekaDashboardData.zoneCount).map(
                        ([name, value], index) => ({
                          name,
                          value,
                          color: index === 0 ? "#3b82f6" : "#8b5cf6",
                        })
                      )}
                      width={50}
                      height={30}
                    />
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 justify-start">
                    {Object.entries(eurekaDashboardData.zoneCount).map(
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
                </CardContent>
              </Card>
            </div>

            <Card className="border-blue-200/50 bg-white/70 backdrop-blur-sm dark:bg-[#303C9D1F]">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    최근 등록/변경된 인스턴스
                  </h3>
                  <Badge variant="secondary" className="text-[14px]">
                    {eurekaDashboardData.recentInstances.length}개
                  </Badge>
                </div>

                <div className="max-h-80 overflow-y-auto">
                  <div className="space-y-1">
                    {/* 테이블 헤더 */}
                    <div className="grid grid-cols-12 gap-3 px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-t-lg">
                      <div className="col-span-4">서비스명</div>
                      <div className="col-span-3">인스턴스 ID</div>
                      <div className="col-span-1">상태</div>
                      <div className="col-span-4 text-center">등록시간</div>
                    </div>

                    {/* 테이블 바디 */}
                    {eurekaDashboardData.recentInstances.map(
                      (instance, index) => (
                        <div
                          key={instance.instanceId}
                          className="grid grid-cols-12 gap-3 px-3 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors border-b border-gray-100 dark:border-gray-800 last:border-b-0"
                        >
                          <div className="col-span-4 flex items-center space-x-2">
                            <span className="font-medium text-gray-900 dark:text-white truncate">
                              {instance.serviceName}
                            </span>
                          </div>

                          <div className="col-span-3 flex items-center">
                            <span className="text-gray-600 dark:text-gray-300 truncate text-xs font-mono">
                              {instance.instanceId}
                            </span>
                          </div>

                          <div className="col-span-1 flex items-center">
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                instance.status === "UP"
                                  ? "text-green-700 bg-green-50 border-green-200 dark:text-green-100 dark:bg-green-900/30 dark:border-green-800"
                                  : instance.status === "DOWN"
                                  ? "text-red-700 bg-red-50 border-red-200 dark:text-red-100 dark:bg-red-900/30 dark:border-red-800"
                                  : "text-yellow-700 bg-yellow-50 border-yellow-200 dark:text-yellow-100 dark:bg-yellow-900/30 dark:border-yellow-800"
                              }`}
                            >
                              {instance.status}
                            </Badge>
                          </div>

                          <div className="col-span-4 flex items-center justify-center">
                            <span className="text-gray-500 dark:text-gray-400 text-xs ">
                              {instance.lastUpdated}
                            </span>
                          </div>
                        </div>
                      )
                    )}

                    {eurekaDashboardData.recentInstances.length === 0 && (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <Server className="h-12 w-12 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                        <p>최근 등록된 인스턴스가 없습니다.</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        {/* </TabsContent> */}
        {/* Services Tab */}
        {activeTab === "services" && (
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredServices.map((service) => (
                <Card
                  key={service.serviceName}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {service.serviceName}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <span>인스턴스 목록</span>
                      <Badge variant="secondary" className="text-[13px]">
                        {service.instances.length}개
                      </Badge>
                    </div>
                    <div className="space-y-2 max-h-60 overflow-y-auto scrollbar-hide">
                      {service.instances.map((instance) => {
                        const zoneIndex = service.zones.indexOf(instance.zone);
                        const matchedVersion =
                          service.versions[zoneIndex] || "unknown";
                        return (
                          <div
                            key={instance.instanceId}
                            className="flex items-center justify-between p-3 rounded bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                            onClick={() => handleInstanceChange(instance)}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-2 h-2 rounded-full ${
                                  instance.status === "UP"
                                    ? "bg-green-500"
                                    : "bg-red-500"
                                } animate-pulse`}
                              />
                              <div>
                                <div className="text-sm font-medium">
                                  {instance.instanceId}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {instance.ip}:{instance.port} • v
                                  {matchedVersion}
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col items-end text-right space-y-1">
                              <StatusBadge status={instance.status} />
                              <div className="flex gap-1">
                                <Badge variant="outline" className="text-xs">
                                  {instance.zone}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Instance Detail Modal */}
        <Dialog
          open={!!selectedInstance}
          onOpenChange={() => setSelectedInstance(null)}
        >
          <DialogContent
            ref={modalContentRef}
            className="max-w-4xl max-h-[80vh] overflow-y-auto rounded-lg"
          >
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                <span>{instanceData.app || "서비스"} - 인스턴스 상세 정보</span>
                {selectedInstance && (
                  <Badge variant="outline" className="ml-2">
                    {instanceData.instanceId}
                  </Badge>
                )}
              </DialogTitle>
            </DialogHeader>

            {selectedInstance && (
              <div className="space-y-6">
                {/* Status Info */}
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Activity className="w-4 h-4 text-blue-500" />
                    <span className="font-medium">상태 정보</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        현재 상태
                      </span>
                      <StatusBadge status={instanceData.status} />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        덮어쓴 상태
                      </span>
                      <Badge variant="secondary">
                        {instanceData.overriddenStatus}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        마지막 이벤트
                      </span>
                      <Badge variant="outline">{instanceData.actionType}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        코디네이터 역할
                      </span>
                      <Badge
                        variant={
                          instanceData.isCoordinatingDiscoveryServer
                            ? "default"
                            : "secondary"
                        }
                      >
                        {instanceData.isCoordinatingDiscoveryServer
                          ? "예"
                          : "아니오"}
                      </Badge>
                    </div>
                  </div>
                </Card>

                {/* Network Info */}
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Network className="w-4 h-4 text-green-500" />
                    <span className="font-medium">네트워크 정보</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        IP 주소
                      </span>
                      <span className="text-sm font-medium">
                        {instanceData.ipAddr}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        호스트명
                      </span>
                      <span className="text-sm font-medium">
                        {instanceData.hostName}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        HTTP 포트
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {instanceData.port}
                        </span>
                        {instanceData.isPortEnabled ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        HTTPS 포트
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {instanceData.securePort}
                        </span>
                        {instanceData.isSecurePortEnabled ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        데이터센터
                      </span>
                      <span className="text-sm font-medium">
                        {instanceData.dataCenter}
                      </span>
                    </div>
                  </div>
                </Card>

                {/* Lease Info */}
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="w-4 h-4 text-purple-500" />
                    <span className="font-medium">갱신 정보</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        갱신 주기
                      </span>
                      <span className="text-sm font-medium">
                        {instanceData.leaseInfo.renewalIntervalInSecs}초
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        지속 시간
                      </span>
                      <span className="text-sm font-medium">
                        {instanceData.leaseInfo.durationInSecs}초
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        최근 갱신
                      </span>
                      <span className="text-sm font-medium">
                        {new Date(
                          instanceData.lastUpdatedTimestamp
                        ).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        마지막 Dirty
                      </span>
                      <span className="text-sm font-medium">
                        {new Date(
                          instanceData.lastDirtyTimestamp
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </Card>

                {/* URLs */}
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Globe className="w-4 h-4 text-blue-500" />
                    <span className="font-medium">주요 진입 지점 URL</span>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        홈페이지 URL
                      </div>
                      <div className="text-sm font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded">
                        {instanceData.homePageUrl}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        상태 페이지 URL
                      </div>
                      <div className="text-sm font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded">
                        {instanceData.statusPageUrl}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        헬스체크 URL
                      </div>
                      <div className="text-sm font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded">
                        {instanceData.healthCheckUrl}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          VIP 주소
                        </div>
                        <div className="text-sm font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded">
                          {instanceData.vipAddress}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          보안 VIP 주소
                        </div>
                        <div className="text-sm font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded">
                          {instanceData.secureVipAddress}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Metadata */}
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Shield className="w-4 h-4 text-orange-500" />
                    <span className="font-medium">메타데이터</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(instanceData.metadata).map(
                      ([key, value]) => (
                        <div
                          key={key}
                          className="flex justify-between items-center bg-gray-0 dark:bg-gray-800/50 rounded"
                        >
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {key}
                          </span>
                          <span className="text-sm font-medium">
                            {String(value)}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </Card>
              </div>
            )}
            {selectedInstance && (
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Server className="w-4 h-4 text-blue-500" />
                  <span className="font-medium">다른 인스턴스 목록</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {eurekaServicesData
                    .find((service) =>
                      service.instances.some(
                        (inst) =>
                          inst.instanceId === selectedInstance.instanceId
                      )
                    )
                    ?.instances.map((instance) => (
                      <Badge
                        key={instance.instanceId}
                        variant={
                          instance.instanceId === selectedInstance.instanceId
                            ? "default"
                            : "outline"
                        }
                        className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                          instance.instanceId === selectedInstance.instanceId
                            ? "bg-blue-600 text-white"
                            : "hover:bg-blue-50 dark:hover:bg-blue-900/30"
                        }`}
                        onClick={() => handleInstanceChange(instance)}
                      >
                        <div
                          className={`w-2 h-2 rounded-full mr-2 ${
                            instance.status === "UP"
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        />
                        {instance.instanceId.split("-").pop()}
                      </Badge>
                    ))}
                </div>
              </Card>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
