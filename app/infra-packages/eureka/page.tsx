"use client"

import { useState } from "react"
import { AppLayout } from "@/components/app-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
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
  Lightbulb
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// Mock data
const mockEurekaData = {
  overview: {
    totalServices: 12,
    totalInstances: 45,
    activeInstances: 42,
    selfPreservationMode: true,
    zones: ["us-east-1a", "us-east-1b", "us-east-1c"],
    instancesByStatus: [
      { name: "UP", value: 42, color: "#10b981", percentage: 93.3 },
      { name: "DOWN", value: 2, color: "#ef4444", percentage: 4.4 },
      { name: "OUT_OF_SERVICE", value: 1, color: "#f59e0b", percentage: 2.2 },
    ],
    instancesByZone: [
      { name: "us-east-1a", value: 15, color: "#3b82f6", percentage: 33.3 },
      { name: "us-east-1b", value: 18, color: "#8b5cf6", percentage: 40.0 },
      { name: "us-east-1c", value: 12, color: "#06b6d4", percentage: 26.7 },
    ],
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
      instanceCount: 3,
      instances: [
        {
          instanceId: "user-service-001",
          status: "UP",
          ipAddr: "192.168.1.10",
          hostName: "user-service-001.local",
          port: 8080,
          isPortEnabled: true,
          securePort: 8443,
          isSecurePortEnabled: true,
          zone: "us-east-1a",
          version: "v1.2.3",
          dataCenter: "us-east-1",
          overriddenStatus: "UNKNOWN",
          actionType: "ADDED",
          isCoordinatingDiscoveryServer: false,
          leaseInfo: {
            renewalIntervalInSecs: 30,
            durationInSecs: 90,
            registrationTimestamp: "2024-01-15T09:00:00Z",
            lastRenewalTimestamp: "2024-01-15T10:30:00Z",
          },
          lastUpdatedTimestamp: "2024-01-15T10:30:00Z",
          lastDirtyTimestamp: "2024-01-15T10:29:45Z",
          homePageUrl: "http://192.168.1.10:8080/",
          statusPageUrl: "http://192.168.1.10:8080/actuator/info",
          healthCheckUrl: "http://192.168.1.10:8080/actuator/health",
          vipAddress: "user-service",
          secureVipAddress: "user-service",
          metadata: {
            version: "v1.2.3",
            gitCommit: "abc123ef",
            managementPort: "8081",
            team: "backend-team",
          },
        },
        {
          instanceId: "user-service-002",
          status: "UP",
          ipAddr: "192.168.1.11",
          hostName: "user-service-002.local",
          port: 8080,
          isPortEnabled: true,
          securePort: 8443,
          isSecurePortEnabled: true,
          zone: "us-east-1b",
          version: "v1.2.3",
          dataCenter: "us-east-1",
          overriddenStatus: "UNKNOWN",
          actionType: "ADDED",
          isCoordinatingDiscoveryServer: false,
          leaseInfo: {
            renewalIntervalInSecs: 30,
            durationInSecs: 90,
            registrationTimestamp: "2024-01-15T09:00:00Z",
            lastRenewalTimestamp: "2024-01-15T10:29:00Z",
          },
          lastUpdatedTimestamp: "2024-01-15T10:29:00Z",
          lastDirtyTimestamp: "2024-01-15T10:28:45Z",
          homePageUrl: "http://192.168.1.11:8080/",
          statusPageUrl: "http://192.168.1.11:8080/actuator/info",
          healthCheckUrl: "http://192.168.1.11:8080/actuator/health",
          vipAddress: "user-service",
          secureVipAddress: "user-service",
          metadata: {
            version: "v1.2.3",
            gitCommit: "def456gh",
            managementPort: "8081",
            team: "backend-team",
          },
        },
        {
          instanceId: "user-service-003",
          status: "DOWN",
          ipAddr: "192.168.1.12",
          hostName: "user-service-003.local",
          port: 8080,
          isPortEnabled: true,
          securePort: 8443,
          isSecurePortEnabled: false,
          zone: "us-east-1c",
          version: "v1.2.2",
          dataCenter: "us-east-1",
          overriddenStatus: "UNKNOWN",
          actionType: "MODIFIED",
          isCoordinatingDiscoveryServer: false,
          leaseInfo: {
            renewalIntervalInSecs: 30,
            durationInSecs: 90,
            registrationTimestamp: "2024-01-15T09:00:00Z",
            lastRenewalTimestamp: "2024-01-15T10:20:00Z",
          },
          lastUpdatedTimestamp: "2024-01-15T10:25:00Z",
          lastDirtyTimestamp: "2024-01-15T10:24:45Z",
          homePageUrl: "http://192.168.1.12:8080/",
          statusPageUrl: "http://192.168.1.12:8080/actuator/info",
          healthCheckUrl: "http://192.168.1.12:8080/actuator/health",
          vipAddress: "user-service",
          secureVipAddress: "user-service",
          metadata: {
            version: "v1.2.2",
            gitCommit: "ghi789jk",
            managementPort: "8081",
            team: "backend-team",
          },
        },
      ],
    },
    {
      name: "payment-service",
      instanceCount: 2,
      instances: [
        {
          instanceId: "payment-service-001",
          status: "UP",
          ipAddr: "192.168.1.20",
          hostName: "payment-service-001.local",
          port: 8081,
          isPortEnabled: true,
          securePort: 8444,
          isSecurePortEnabled: true,
          zone: "us-east-1a",
          version: "v2.1.0",
          dataCenter: "us-east-1",
          overriddenStatus: "UNKNOWN",
          actionType: "ADDED",
          isCoordinatingDiscoveryServer: true,
          leaseInfo: {
            renewalIntervalInSecs: 30,
            durationInSecs: 90,
            registrationTimestamp: "2024-01-15T09:00:00Z",
            lastRenewalTimestamp: "2024-01-15T10:28:00Z",
          },
          lastUpdatedTimestamp: "2024-01-15T10:28:00Z",
          lastDirtyTimestamp: "2024-01-15T10:27:45Z",
          homePageUrl: "http://192.168.1.20:8081/",
          statusPageUrl: "http://192.168.1.20:8081/actuator/info",
          healthCheckUrl: "http://192.168.1.20:8081/actuator/health",
          vipAddress: "payment-service",
          secureVipAddress: "payment-service",
          metadata: {
            version: "v2.1.0",
            gitCommit: "lmn012op",
            managementPort: "8082",
            team: "payment-team",
          },
        },
        {
          instanceId: "payment-service-002",
          status: "DOWN",
          ipAddr: "192.168.1.21",
          hostName: "payment-service-002.local",
          port: 8081,
          isPortEnabled: true,
          securePort: 8444,
          isSecurePortEnabled: true,
          zone: "us-east-1c",
          version: "v2.1.0",
          dataCenter: "us-east-1",
          overriddenStatus: "OUT_OF_SERVICE",
          actionType: "MODIFIED",
          isCoordinatingDiscoveryServer: false,
          leaseInfo: {
            renewalIntervalInSecs: 30,
            durationInSecs: 90,
            registrationTimestamp: "2024-01-15T09:00:00Z",
            lastRenewalTimestamp: "2024-01-15T10:20:00Z",
          },
          lastUpdatedTimestamp: "2024-01-15T10:25:00Z",
          lastDirtyTimestamp: "2024-01-15T10:24:45Z",
          homePageUrl: "http://192.168.1.21:8081/",
          statusPageUrl: "http://192.168.1.21:8081/actuator/info",
          healthCheckUrl: "http://192.168.1.21:8081/actuator/health",
          vipAddress: "payment-service",
          secureVipAddress: "payment-service",
          metadata: {
            version: "v2.1.0",
            gitCommit: "qrs345tu",
            managementPort: "8082",
            team: "payment-team",
          },
        },
      ],
    },
  ],
}

// 미니 도넛 차트 컴포넌트
const MiniDonutChart = ({ data, size = 60 }: { data: any[]; size?: number }) => {
  const radius = size / 2 - 5
  const circumference = 2 * Math.PI * radius
  let cumulativePercentage = 0

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="4"
          className="dark:stroke-gray-700"
        />
        {data.map((item, index) => {
          const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`
          const strokeDashoffset = (-cumulativePercentage * circumference) / 100
          cumulativePercentage += item.percentage

          return (
            <circle
              key={index}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={item.color}
              strokeWidth="4"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-300"
            />
          )
        })}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
          {data.reduce((sum, item) => sum + item.value, 0)}
        </span>
      </div>
    </div>
  )
}

// 미니 바 차트 컴포넌트
const MiniBarChart = ({ data, width = 60, height = 40 }: { data: any[]; width?: number; height?: number }) => {
  const maxValue = Math.max(...data.map((item) => item.value))
  const barWidth = width / data.length - 2

  return (
    <div className="flex items-end justify-center gap-1" style={{ width, height }}>
      {data.map((item, index) => {
        const barHeight = (item.value / maxValue) * height
        return (
          <div
            key={index}
            className="rounded-t transition-all duration-300 hover:opacity-80"
            style={{
              width: barWidth,
              height: barHeight,
              backgroundColor: item.color,
            }}
          />
        )
      })}
    </div>
  )
}

// 대형 도넛 차트 컴포넌트
const LargeDonutChart = ({ data, size = 200 }: { data: any[]; size?: number }) => {
  const radius = size / 2 - 20
  const circumference = 2 * Math.PI * radius
  let cumulativePercentage = 0

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="8"
          className="dark:stroke-gray-700"
        />
        {data.map((item, index) => {
          const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`
          const strokeDashoffset = (-cumulativePercentage * circumference) / 100
          cumulativePercentage += item.percentage

          return (
            <circle
              key={index}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={item.color}
              strokeWidth="8"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-500 hover:stroke-opacity-80"
            />
          )
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-gray-700 dark:text-gray-300">
          {data.reduce((sum, item) => sum + item.value, 0)}
        </span>
        <span className="text-xs text-gray-500">총 인스턴스</span>
      </div>
    </div>
  )
}

// 대형 바 차트 컴포넌트
const LargeBarChart = ({ data, width = 300, height = 200 }: { data: any[]; width?: number; height?: number }) => {
  const maxValue = Math.max(...data.map((item) => item.value))
  const barWidth = (width - 40) / data.length - 10

  return (
    <div className="flex flex-col items-center" style={{ width, height }}>
      <div className="flex items-end justify-center gap-2 flex-1" style={{ height: height - 40 }}>
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * (height - 60)
          return (
            <div key={index} className="flex flex-col items-center gap-2">
              <div className="text-xs font-bold text-gray-700 dark:text-gray-300">{item.value}</div>
              <div
                className="rounded-t transition-all duration-500 hover:opacity-80"
                style={{
                  width: barWidth,
                  height: barHeight,
                  backgroundColor: item.color,
                }}
              />
              <div className="text-xs text-gray-500 text-center max-w-16 truncate">{item.name}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function EurekaPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [selectedInstance, setSelectedInstance] = useState<any>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [selfPreservationMode, setSelfPreservationMode] = useState(mockEurekaData.overview.selfPreservationMode)

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
      className="flex items-center gap-1"
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
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              전역 대시보드
            </TabsTrigger>
            <TabsTrigger value="services" className="flex items-center gap-2">
              <Server className="w-4 h-4" />
              서비스 목록
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
               <Card className="col-span-2 bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-900/20 dark:to-rose-800/20 border-rose-200 dark:border-rose-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">자기 보호 모드</CardTitle>
                    <Lightbulb className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-rose-700 dark:text-rose-300">
                    ON
                  </div>
                  <p className="text-xs text-rose-600 dark:text-rose-400">자기 보호 모드 활성화 여부 </p>
                </CardContent>
              </Card>

              <Card className="col-span-2 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
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

              <Card className="col-span-2 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-amber-200 dark:border-amber-800">
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

              {/* 활성 인스턴스 카드에 미니 도넛 차트 추가 */}
              <Card className="col-span-3 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border-emerald-200 dark:border-emerald-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">활성 인스턴스</CardTitle>
                  <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                        {mockEurekaData.overview.activeInstances}
                      </div>
                      <p className="text-xs text-emerald-600 dark:text-emerald-400">정상 작동 중</p>
                    </div>
                    <MiniDonutChart data={mockEurekaData.overview.instancesByStatus} size={50} />
                  </div>
                  <div className="flex flex-wrap justify-center gap-2 pt-1">
                    {mockEurekaData.overview.instancesByStatus.map((item, index) => (
                      <div key={index} className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                        <span className="text-[10px] font-medium text-gray-700 dark:text-gray-300">{item.name}</span>
                        <span className="text-[10px] text-gray-500">({item.value})</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 가용존 카드에 미니 바 차트 추가 */}
              <Card className="col-span-3 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">가용존</CardTitle>
                  <MapPin className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                        {mockEurekaData.overview.zones.length}
                      </div>
                      <p className="text-xs text-purple-600 dark:text-purple-400">활성 가용존</p>
                    </div>
                    <MiniBarChart data={mockEurekaData.overview.instancesByZone} width={50} height={30} />
                  </div>
                  <div className="flex flex-wrap justify-center gap-2 pt-1">
                    {mockEurekaData.overview.instancesByZone.map((zone, index) => (
                      <div key={index} className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: zone.color }} />
                        <span className="text-[10px] font-medium text-gray-700 dark:text-gray-300">{zone.name}</span>
                        <span className="text-[10px] text-gray-500">({zone.value})</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            {/* 자기보호모드 카드 추가 */}
            {/* <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">자기보호모드</CardTitle>
                  <ShieldCheck className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-bold text-orange-700 dark:text-orange-300">
                        {selfPreservationMode ? "활성화" : "비활성화"}
                      </div>
                      <p className="text-xs text-orange-600 dark:text-orange-400">네트워크 분할 보호</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={selfPreservationMode}
                        onCheckedChange={setSelfPreservationMode}
                        className="data-[state=checked]:bg-orange-500"
                      />
                      {selfPreservationMode && <Zap className="w-4 h-4 text-orange-500 animate-pulse" />}
                    </div>
                  </div>
                </CardContent>
              </Card> */}

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockEurekaData.services.map((service) => (
                <Card key={service.name} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Server className="w-5 h-5 relative top-[3px]" />
                      {service.name}
                      <Badge variant="outline" className="ml-auto">
                        {service.instanceCount} Instance
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="text-sm text-gray-600 dark:text-gray-400">인스턴스 목록</div>
                      {service.instances.map((instance) => (
                        <div
                          key={instance.instanceId}
                          className="flex items-center justify-between p-3 rounded bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                          onClick={() => setSelectedInstance(instance)}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                instance.status === "UP" ? "bg-green-500" : "bg-red-500"
                              } animate-pulse`}
                            />
                            <div>
                              <div className="text-sm font-medium">{instance.instanceId}</div>
                              <div className="text-xs text-gray-500">
                                {instance.ipAddr}:{instance.port} • {instance.version}
                              </div>
                            </div>
                          </div>
                          <div className="text-right space-y-1">
                            <StatusBadge status={instance.status} />
                            <div className="flex gap-1">
                              <Badge variant="outline" className="text-xs">
                                {instance.zone}
                              </Badge>
                              {/* <Badge variant="secondary" className="text-xs">
                                {instance.version}
                              </Badge> */}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Instance Detail Modal */}
        <Dialog open={!!selectedInstance} onOpenChange={() => setSelectedInstance(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto rounded-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                인스턴스 상세 정보
                {selectedInstance && (
                  <Badge variant="outline" className="ml-2">
                    {selectedInstance.instanceId}
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
                      <span className="text-sm text-gray-600 dark:text-gray-400">현재 상태</span>
                      <StatusBadge status={selectedInstance.status} />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">덮어쓴 상태</span>
                      <Badge variant="secondary">{selectedInstance.overriddenStatus}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">마지막 이벤트</span>
                      <Badge variant="outline">{selectedInstance.actionType}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">코디네이터 역할</span>
                      <Badge variant={selectedInstance.isCoordinatingDiscoveryServer ? "default" : "secondary"}>
                        {selectedInstance.isCoordinatingDiscoveryServer ? "예" : "아니오"}
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
                      <span className="text-sm text-gray-600 dark:text-gray-400">IP 주소</span>
                      <span className="text-sm font-medium">{selectedInstance.ipAddr}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">호스트명</span>
                      <span className="text-sm font-medium">{selectedInstance.hostName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">HTTP 포트</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{selectedInstance.port}</span>
                        {selectedInstance.isPortEnabled ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">HTTPS 포트</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{selectedInstance.securePort}</span>
                        {selectedInstance.isSecurePortEnabled ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">데이터센터</span>
                      <span className="text-sm font-medium">{selectedInstance.dataCenter}</span>
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
                      <span className="text-sm text-gray-600 dark:text-gray-400">갱신 주기</span>
                      <span className="text-sm font-medium">{selectedInstance.leaseInfo.renewalIntervalInSecs}초</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">지속 시간</span>
                      <span className="text-sm font-medium">{selectedInstance.leaseInfo.durationInSecs}초</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">최근 갱신</span>
                      <span className="text-sm font-medium">
                        {new Date(selectedInstance.lastUpdatedTimestamp).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">마지막 Dirty</span>
                      <span className="text-sm font-medium">
                        {new Date(selectedInstance.lastDirtyTimestamp).toLocaleString()}
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
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">홈페이지 URL</div>
                      <div className="text-sm font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded">
                        {selectedInstance.homePageUrl}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">상태 페이지 URL</div>
                      <div className="text-sm font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded">
                        {selectedInstance.statusPageUrl}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">헬스체크 URL</div>
                      <div className="text-sm font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded">
                        {selectedInstance.healthCheckUrl}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">VIP 주소</div>
                        <div className="text-sm font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded">
                          {selectedInstance.vipAddress}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">보안 VIP 주소</div>
                        <div className="text-sm font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded">
                          {selectedInstance.secureVipAddress}
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
                    {Object.entries(selectedInstance.metadata).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800/50 rounded"
                      >
                        <span className="text-sm text-gray-600 dark:text-gray-400">{key}</span>
                        <span className="text-sm font-medium">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  )
}
