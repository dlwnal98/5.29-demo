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
              <BreadcrumbPage>API Plan</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Quick Actions */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              API PLAN
            </h1>
          </div>
          <div className="space-x-2">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              API Key 생성
            </Button>
            <Button variant="outline" onClick={() => window.location.reload()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              새로 고침
            </Button>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-5 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
            <TabsTrigger
              value="apis"
              className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
            >
              <Code className="h-4 w-4" />
              API 목록
            </TabsTrigger>
            <TabsTrigger
              value="overview"
              className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
            >
              <BarChart3 className="h-4 w-4" />
              개요
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
                          <h3 className="font-semibold text-lg">{api.name}</h3>
                        </div>
                      </div>

                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                          {api.endpoint}
                        </code>
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
