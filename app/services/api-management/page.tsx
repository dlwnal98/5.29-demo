"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Activity,
  Code,
  Shield,
  Settings,
  BarChart3,
  Zap,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Plus,
  Edit,
  Trash2,
  Eye,
  Copy,
  Download,
  Upload,
  RefreshCw,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

export default function ApiManagementPage() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("productId");
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    {
      title: "총 API 수",
      value: "24",
      change: "+12%",
      icon: Code,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      title: "활성 API",
      value: "18",
      change: "+8%",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
    {
      title: "일일 요청",
      value: "1.2M",
      change: "+23%",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
    },
    {
      title: "응답 시간",
      value: "145ms",
      change: "-5%",
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
    },
  ];

  const apis = [
    {
      id: "api_001",
      name: "User Authentication API",
      version: "v2.1",
      status: "active",
      method: "POST",
      endpoint: "/auth/login",
      requests: "45.2K",
      latency: "120ms",
      uptime: "99.9%",
    },
    {
      id: "api_002",
      name: "Payment Processing API",
      version: "v1.8",
      status: "active",
      method: "POST",
      endpoint: "/payments/process",
      requests: "23.1K",
      latency: "180ms",
      uptime: "99.8%",
    },
    {
      id: "api_003",
      name: "Data Analytics API",
      version: "v3.0",
      status: "maintenance",
      method: "GET",
      endpoint: "/analytics/reports",
      requests: "12.5K",
      latency: "95ms",
      uptime: "98.5%",
    },
    {
      id: "api_004",
      name: "File Upload API",
      version: "v1.2",
      status: "inactive",
      method: "POST",
      endpoint: "/files/upload",
      requests: "8.7K",
      latency: "250ms",
      uptime: "97.2%",
    },
  ];

  if (isLoading) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/services">Services</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>API Management</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              API PLAN
            </CardTitle>
            <CardDescription>API 플랜을 관리하고 확장합니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => toast.success("새 API가 생성되었습니다.")}
              >
                <Plus className="h-4 w-4 mr-2" />새 API 생성
              </Button>
              <Button
                variant="outline"
                onClick={() => toast.info("API 문서를 가져옵니다.")}
              >
                <Upload className="h-4 w-4 mr-2" />
                API 가져오기
              </Button>
              <Button
                variant="outline"
                onClick={() => toast.info("API 문서를 내보냅니다.")}
              >
                <Download className="h-4 w-4 mr-2" />
                문서 내보내기
              </Button>
              <Button
                variant="outline"
                onClick={() => toast.success("데이터가 새로고침되었습니다.")}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                새로고침
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-5 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
            <TabsTrigger
              value="overview"
              className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
            >
              <BarChart3 className="h-4 w-4" />
              개요
            </TabsTrigger>
            <TabsTrigger
              value="apis"
              className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
            >
              <Code className="h-4 w-4" />
              API 목록
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
            >
              <TrendingUp className="h-4 w-4" />
              분석
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
            >
              <Shield className="h-4 w-4" />
              보안
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
            >
              <Settings className="h-4 w-4" />
              설정
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-green-500" />
                    실시간 모니터링
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        현재 활성 연결
                      </span>
                      <span className="font-semibold text-green-600">
                        1,247
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        평균 응답 시간
                      </span>
                      <span className="font-semibold text-blue-600">145ms</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        오류율
                      </span>
                      <span className="font-semibold text-red-600">0.02%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    최근 알림
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                      <span className="text-sm">API 응답 시간 증가 감지</span>
                    </div>
                    <div className="flex items-center gap-3 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">새로운 API 버전 배포 완료</span>
                    </div>
                    <div className="flex items-center gap-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">보안 업데이트 적용됨</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="apis" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-blue-500" />
                  API 목록
                </CardTitle>
                <CardDescription>
                  등록된 모든 API를 관리하고 모니터링하세요
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {apis.map((api) => (
                    <div
                      key={api.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-all duration-300 hover:border-blue-300 dark:hover:border-blue-600"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Badge
                            variant={
                              api.method === "GET" ? "secondary" : "default"
                            }
                            className={`${
                              api.method === "GET"
                                ? "bg-green-100 text-green-800"
                                : api.method === "POST"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-orange-100 text-orange-800"
                            }`}
                          >
                            {api.method}
                          </Badge>
                          <h3 className="font-semibold text-lg">{api.name}</h3>
                          <Badge variant="outline">{api.version}</Badge>
                        </div>
                        <Badge
                          variant={
                            api.status === "active"
                              ? "default"
                              : api.status === "maintenance"
                              ? "secondary"
                              : "destructive"
                          }
                          className={`${
                            api.status === "active"
                              ? "bg-green-100 text-green-800"
                              : api.status === "maintenance"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {api.status === "active"
                            ? "활성"
                            : api.status === "maintenance"
                            ? "유지보수"
                            : "비활성"}
                        </Badge>
                      </div>

                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                          {api.endpoint}
                        </code>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">요청 수:</span>
                          <span className="font-semibold ml-2">
                            {api.requests}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">지연 시간:</span>
                          <span className="font-semibold ml-2">
                            {api.latency}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">가동률:</span>
                          <span className="font-semibold ml-2 text-green-600">
                            {api.uptime}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            toast.info(`${api.name} API를 편집합니다.`)
                          }
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          편집
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            toast.info(
                              `${api.name} API 상세 정보를 확인합니다.`
                            )
                          }
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          상세보기
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            toast.success(`${api.name} API가 복제되었습니다.`)
                          }
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          복제
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            toast.error(`${api.name} API가 삭제되었습니다.`)
                          }
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          삭제
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-500" />
                  성능 분석
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    분석 데이터 준비 중
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    API 사용량 및 성능 분석 차트가 곧 제공됩니다.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-red-500" />
                  보안 설정
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="api-key-auth">API 키 인증</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      API 접근을 위한 키 기반 인증을 활성화합니다.
                    </p>
                  </div>
                  <Switch id="api-key-auth" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="rate-limiting">요청 제한</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      API 요청 빈도를 제한하여 남용을 방지합니다.
                    </p>
                  </div>
                  <Switch id="rate-limiting" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="cors">CORS 설정</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      크로스 오리진 요청을 허용합니다.
                    </p>
                  </div>
                  <Switch id="cors" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-gray-500" />
                  일반 설정
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="api-name">API 서비스 이름</Label>
                  <Input id="api-name" defaultValue="My API Service" />
                </div>

                <div>
                  <Label htmlFor="base-url">기본 URL</Label>
                  <Input id="base-url" defaultValue="https://api.example.com" />
                </div>

                <div>
                  <Label htmlFor="timeout">타임아웃 (초)</Label>
                  <Input id="timeout" type="number" defaultValue="30" />
                </div>

                <Button
                  className="w-full"
                  onClick={() => toast.success("설정이 저장되었습니다.")}
                >
                  설정 저장
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
