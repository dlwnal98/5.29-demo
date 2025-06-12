"use client"

import { useState } from "react"
import { AppLayout } from "@/components/app-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
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
  RefreshCw,
  Eye,
  Network,
  Database,
} from "lucide-react"

// Mock data
const mockEurekaData = {
  overview: {
    totalServices: 12,
    totalInstances: 45,
    selfPreservation: true,
    zones: ["us-east-1a", "us-east-1b", "us-east-1c"],
    instancesByStatus: {
      UP: 42,
      DOWN: 2,
      OUT_OF_SERVICE: 1,
    },
    instancesByZone: {
      "us-east-1a": 15,
      "us-east-1b": 18,
      "us-east-1c": 12,
    },
    recentChanges: [
      { instanceId: "auth-server:8081", status: "UP", timestamp: "1718087200000", service: "AUTH-SERVER" },
      {
        instanceId: "payment-service-002",
        status: "DOWN",
        timestamp: "2024-01-15T10:25:00Z",
        service: "payment-service",
      },
      {
        instanceId: "notification-service-001",
        status: "UP",
        timestamp: "2024-01-15T10:20:00Z",
        service: "notification-service",
      },
    ],
  },
  services: [
    {
      name: "user-service",
      instanceCount: 8,
      status: "UP",
      zones: ["us-east-1a", "us-east-1b"],
      versions: ["v1.2.3", "v1.2.2"],
      instances: [
        {
          instanceId: "user-service-001",
          host: "192.168.1.10",
          port: 8080,
          status: "UP",
          zone: "us-east-1a",
          commitHash: "abc123ef",
          lastUpdated: "2024-01-15T10:30:00Z",
        },
        {
          instanceId: "user-service-002",
          host: "192.168.1.11",
          port: 8080,
          status: "UP",
          zone: "us-east-1b",
          commitHash: "def456gh",
          lastUpdated: "2024-01-15T10:29:00Z",
        },
      ],
    },
    {
      name: "payment-service",
      instanceCount: 6,
      status: "PARTIAL",
      zones: ["us-east-1a", "us-east-1c"],
      versions: ["v2.1.0"],
      instances: [
        {
          instanceId: "payment-service-001",
          host: "192.168.1.20",
          port: 8081,
          status: "UP",
          zone: "us-east-1a",
          commitHash: "ghi789jk",
          lastUpdated: "2024-01-15T10:28:00Z",
        },
        {
          instanceId: "payment-service-002",
          host: "192.168.1.21",
          port: 8081,
          status: "DOWN",
          zone: "us-east-1c",
          commitHash: "lmn012op",
          lastUpdated: "2024-01-15T10:25:00Z",
        },
      ],
    },
  ],
}

const mockInstanceDetail = {
  instanceId: "user-service-001",
  status: "UP",
  host: "192.168.1.10",
  port: 8080,
  securePort: 8443,
  httpEnabled: true,
  httpsEnabled: true,
  datacenter: "us-east-1",
  renewalInterval: 30,
  metadata: {
    "management.port": "8081",
    "git.commit": "abc123ef",
    "git.branch": "main",
    "build.version": "v1.2.3",
  },
  homePageUrl: "http://192.168.1.10:8080/",
  statusPageUrl: "http://192.168.1.10:8080/actuator/info",
  healthCheckUrl: "http://192.168.1.10:8080/actuator/health",
  vipAddress: "user-service",
  secureVipAddress: "user-service",
  isCoordinator: false,
  lastUpdated: "2024-01-15T10:30:00Z",
  lastDirtyTimestamp: "2024-01-15T10:29:45Z",
  actionType: "ADDED",
}

export default function EurekaPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [selectedInstance, setSelectedInstance] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = async () => {
    setRefreshing(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setRefreshing(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "UP":
        return "text-green-600 dark:text-green-400"
      case "DOWN":
        return "text-red-600 dark:text-red-400"
      case "OUT_OF_SERVICE":
        return "text-yellow-600 dark:text-yellow-400"
      case "PARTIAL":
        return "text-orange-600 dark:text-orange-400"
      default:
        return "text-gray-600 dark:text-gray-400"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "UP":
        return <CheckCircle className="w-4 h-4" />
      case "DOWN":
        return <XCircle className="w-4 h-4" />
      case "OUT_OF_SERVICE":
        return <AlertCircle className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  const StatusBadge = ({ status }: { status: string }) => (
    <Badge
      variant={status === "UP" ? "default" : status === "DOWN" ? "destructive" : "secondary"}
      className="flex items-center gap-1 animate-pulse"
    >
      {getStatusIcon(status)}
      {status}
    </Badge>
  )

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-6 space-y-6">

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              전역 대시보드
            </TabsTrigger>
            <TabsTrigger value="services" className="flex items-center gap-2">
              <Server className="w-4 h-4" />
              서비스 목록
            </TabsTrigger>
            <TabsTrigger value="instances" className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              인스턴스 상세
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">전체 서비스</CardTitle>
                  <Server className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                    {mockEurekaData.overview.totalServices}
                  </div>
                  <p className="text-xs text-blue-600 dark:text-blue-400">등록된 서비스 수</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-amber-200 dark:border-amber-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">전체 인스턴스</CardTitle>
                  <Database className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">
                    {mockEurekaData.overview.totalInstances}
                  </div>
                  <p className="text-xs text-amber-600 dark:text-amber-400">총 인스턴스 수</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border-emerald-200 dark:border-emerald-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">활성 인스턴스</CardTitle>
                  <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </CardHeader>
               
                <CardContent className="space-y-2 mt-2">
                  {Object.entries(mockEurekaData.overview.instancesByStatus).map(([status, count]) => (
                    <div key={status} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            status === "UP" ? "bg-green-500" : status === "DOWN" ? "bg-red-500" : "bg-yellow-500"
                          } animate-pulse`}
                        />
                        <span className={`text-[12px] font-bold ${
                            status === "UP" ? "text-emerald-700 dark:text-emerald-300" : status === "DOWN" ? "text-red-700 dark:text-red-300" : "text-yellow-700 dark:text-yellow-300"
                          }`}>{status}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={(count / mockEurekaData.overview.totalInstances) * 100} status={status as "UP" | "DOWN" | "OUT_OF_SERVICE"} className="w-20 h-2" />
                        <span className={`text-[12px] font-bold ${
                            status === "UP" ? "text-emerald-700 dark:text-emerald-300" : status === "DOWN" ? "text-red-700 dark:text-red-300" : "text-yellow-700 dark:text-yellow-300"
                          }`}>{count}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">가용존</CardTitle>
                  <MapPin className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </CardHeader>
              
                <CardContent className="space-y-2 mt-2">
                  {Object.entries(mockEurekaData.overview.instancesByZone).map(([zone, count]) => (
                    <div key={zone} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-blue-500" />
                        <span className="text-[12px] font-bold">{zone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={(count / mockEurekaData.overview.totalInstances) * 100} className="w-20 h-2" status={"InstancesByZone"} />
                        <span className="text-sm font-bold">{count}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Recent Changes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                 최근 등록/변경된 인스턴스 목록
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockEurekaData.overview.recentChanges.map((change, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            change.status === "UP" ? "bg-green-500 animate-pulse" : "bg-red-500 animate-pulse"
                          }`}
                        />
                        <div>
                          <div className="font-medium">{change.service}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">{change.instanceId}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <StatusBadge status={change.status} />
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(change.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mockEurekaData.services.map((service) => (
                <Card key={service.name} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Server className="w-5 h-5" />
                        {service.name}
                      </CardTitle>
                      <StatusBadge status={service.status} />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">인스턴스 수</div>
                        <div className="text-2xl font-bold">{service.instanceCount}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">가용존</div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {service.zones.map((zone) => (
                            <Badge key={zone} variant="outline" className="text-xs">
                              {zone}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">버전</div>
                      <div className="flex flex-wrap gap-1">
                        {service.versions.map((version) => (
                          <Badge key={version} variant="secondary" className="text-xs">
                            {version}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm text-gray-600 dark:text-gray-400">인스턴스 목록</div>
                      {service.instances.map((instance) => (
                        <div
                          key={instance.instanceId}
                          className="flex items-center justify-between p-2 rounded bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                          onClick={() => {
                            setSelectedInstance(instance.instanceId)
                            setActiveTab("instances")
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                instance.status === "UP" ? "bg-green-500" : "bg-red-500"
                              } animate-pulse`}
                            />
                            <div>
                              <div className="text-sm font-medium">{instance.instanceId}</div>
                              <div className="text-xs text-gray-500">
                                {instance.host}:{instance.port} • {instance.zone}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline" className="text-xs">
                              {instance.commitHash}
                            </Badge>
                            <div className="text-xs text-gray-500 mt-1">
                              {new Date(instance.lastUpdated).toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setSelectedService(service.name)
                        setActiveTab("instances")
                      }}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      상세 보기
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Instance Detail Tab */}
          <TabsContent value="instances" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  인스턴스 상세 정보
                  {selectedInstance && (
                    <Badge variant="outline" className="ml-2">
                      {selectedInstance}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="w-4 h-4 text-blue-500" />
                      <span className="font-medium">상태 정보</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">상태</span>
                        <StatusBadge status={mockInstanceDetail.status} />
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">데이터센터</span>
                        <span className="text-sm font-medium">{mockInstanceDetail.datacenter}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">코디네이터</span>
                        <Badge variant={mockInstanceDetail.isCoordinator ? "default" : "secondary"}>
                          {mockInstanceDetail.isCoordinator ? "예" : "아니오"}
                        </Badge>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Network className="w-4 h-4 text-green-500" />
                      <span className="font-medium">네트워크 정보</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">호스트</span>
                        <span className="text-sm font-medium">{mockInstanceDetail.host}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">HTTP 포트</span>
                        <Badge variant={mockInstanceDetail.httpEnabled ? "default" : "secondary"}>
                          {mockInstanceDetail.port}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">HTTPS 포트</span>
                        <Badge variant={mockInstanceDetail.httpsEnabled ? "default" : "secondary"}>
                          {mockInstanceDetail.securePort}
                        </Badge>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-purple-500" />
                      <span className="font-medium">갱신 정보</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">갱신 주기</span>
                        <span className="text-sm font-medium">{mockInstanceDetail.renewalInterval}초</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">최근 갱신</span>
                        <span className="text-sm font-medium">
                          {new Date(mockInstanceDetail.lastUpdated).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">마지막 이벤트</span>
                        <Badge variant="outline">{mockInstanceDetail.actionType}</Badge>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* URLs */}
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Globe className="w-4 h-4 text-blue-500" />
                    <span className="font-medium">진입점 URL</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">홈페이지</div>
                      <div className="text-sm font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded">
                        {mockInstanceDetail.homePageUrl}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">상태 페이지</div>
                      <div className="text-sm font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded">
                        {mockInstanceDetail.statusPageUrl}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">헬스체크</div>
                      <div className="text-sm font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded">
                        {mockInstanceDetail.healthCheckUrl}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">VIP 주소</div>
                      <div className="text-sm font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded">
                        {mockInstanceDetail.vipAddress}
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
                    {Object.entries(mockInstanceDetail.metadata).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800/50 rounded"
                      >
                        <span className="text-sm text-gray-600 dark:text-gray-400">{key}</span>
                        <span className="text-sm font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}
