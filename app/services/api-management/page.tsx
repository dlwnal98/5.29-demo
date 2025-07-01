"use client"

import { AppLayout } from "@/components/layout/AppLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  ArrowLeft,
  Activity,
  Clock,
  AlertTriangle,
  Code,
  BarChart3,
  Shield,
  Settings,
  Play,
  Pause,
  RefreshCw,
  Download,
  Eye,
  Edit,
  Trash2,
} from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"

export default function ApiManagementPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const productId = searchParams.get("productId")

  const handleBack = () => {
    router.push("/services")
  }

  const mockApiData = [
    {
      id: "api_001",
      name: "User Authentication API",
      method: "POST",
      endpoint: "/auth/login",
      status: "active",
      lastCall: "2분 전",
      responseTime: "120ms",
    },
    {
      id: "api_002",
      name: "Get User Profile",
      method: "GET",
      endpoint: "/users/{id}",
      status: "active",
      lastCall: "5분 전",
      responseTime: "85ms",
    },
    {
      id: "api_003",
      name: "Update User Data",
      method: "PUT",
      endpoint: "/users/{id}",
      status: "inactive",
      lastCall: "1시간 전",
      responseTime: "200ms",
    },
  ]

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/vpc">VPC</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/infra-packages/gateway">API Gateway</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/services">My Products</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>API Management</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              뒤로가기
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                API Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Product ID: <span className="font-mono text-blue-600">{productId}</span>
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => toast.info("API 문서를 확인합니다.")}>
              <Eye className="h-4 w-4 mr-2" />
              문서 보기
            </Button>
            <Button onClick={() => toast.info("새 API를 생성합니다.")}>
              <Code className="h-4 w-4 mr-2" />
              API 생성
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">총 API 수</CardTitle>
              <Code className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">24</div>
              <p className="text-xs text-blue-600 dark:text-blue-400">+2 from last month</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">활성 API</CardTitle>
              <Activity className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900 dark:text-green-100">18</div>
              <p className="text-xs text-green-600 dark:text-green-400">75% of total APIs</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">일일 호출</CardTitle>
              <BarChart3 className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">12.5K</div>
              <p className="text-xs text-purple-600 dark:text-purple-400">+15% from yesterday</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">평균 응답시간</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">142ms</div>
              <p className="text-xs text-orange-600 dark:text-orange-400">-8ms from last hour</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              개요
            </TabsTrigger>
            <TabsTrigger value="apis" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              API 목록
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              분석
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              보안
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              설정
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-500" />
                    실시간 모니터링
                  </CardTitle>
                  <CardDescription>API 호출 현황을 실시간으로 확인하세요</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">현재 활성 연결</span>
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                        127 연결
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">초당 요청 수</span>
                      <span className="font-semibold">45 req/s</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">에러율</span>
                      <span className="font-semibold text-green-600">0.02%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    최근 알림
                  </CardTitle>
                  <CardDescription>시스템 상태 및 중요 알림</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium">API 응답 시간 개선</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">평균 응답시간이 20% 향상되었습니다</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium">새로운 API 엔드포인트 추가</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">사용자 프로필 API가 추가되었습니다</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-purple-500" />
                  빠른 작업
                </CardTitle>
                <CardDescription>자주 사용하는 기능들에 빠르게 접근하세요</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button
                    variant="outline"
                    className="h-20 flex-col gap-2 hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-blue-900/20 bg-transparent"
                    onClick={() => toast.info("새 API를 생성합니다.")}
                  >
                    <Code className="h-6 w-6 text-blue-500" />
                    <span className="text-sm">API 생성</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex-col gap-2 hover:bg-green-50 hover:border-green-300 dark:hover:bg-green-900/20 bg-transparent"
                    onClick={() => toast.info("API를 테스트합니다.")}
                  >
                    <Play className="h-6 w-6 text-green-500" />
                    <span className="text-sm">API 테스트</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex-col gap-2 hover:bg-purple-50 hover:border-purple-300 dark:hover:bg-purple-900/20 bg-transparent"
                    onClick={() => toast.info("문서를 확인합니다.")}
                  >
                    <Eye className="h-6 w-6 text-purple-500" />
                    <span className="text-sm">문서 보기</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex-col gap-2 hover:bg-orange-50 hover:border-orange-300 dark:hover:bg-orange-900/20 bg-transparent"
                    onClick={() => toast.info("로그를 다운로드합니다.")}
                  >
                    <Download className="h-6 w-6 text-orange-500" />
                    <span className="text-sm">로그 다운로드</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="apis" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>API 목록</CardTitle>
                    <CardDescription>등록된 모든 API 엔드포인트를 관리하세요</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => toast.info("API 목록을 새로고침합니다.")}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      새로고침
                    </Button>
                    <Button size="sm" onClick={() => toast.info("새 API를 생성합니다.")}>
                      <Code className="h-4 w-4 mr-2" />
                      API 추가
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>API 이름</TableHead>
                      <TableHead>메서드</TableHead>
                      <TableHead>엔드포인트</TableHead>
                      <TableHead>상태</TableHead>
                      <TableHead>마지막 호출</TableHead>
                      <TableHead>응답시간</TableHead>
                      <TableHead>작업</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockApiData.map((api) => (
                      <TableRow key={api.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <TableCell className="font-medium">{api.name}</TableCell>
                        <TableCell>
                          <Badge
                            variant={api.method === "GET" ? "secondary" : api.method === "POST" ? "default" : "outline"}
                          >
                            {api.method}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{api.endpoint}</TableCell>
                        <TableCell>
                          <Badge variant={api.status === "active" ? "default" : "secondary"}>
                            {api.status === "active" ? "활성" : "비활성"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600 dark:text-gray-400">{api.lastCall}</TableCell>
                        <TableCell className="text-sm">{api.responseTime}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toast.info(`${api.name} API를 수정합니다.`)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toast.info(`${api.name} API를 삭제합니다.`)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                toast.info(
                                  api.status === "active"
                                    ? `${api.name} API를 비활성화합니다.`
                                    : `${api.name} API를 활성화합니다.`,
                                )
                              }
                            >
                              {api.status === "active" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-500" />
                  API 사용 분석
                </CardTitle>
                <CardDescription>API 사용 패턴과 성능 지표를 확인하세요</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">분석 차트가 여기에 표시됩니다</p>
                  <Button className="mt-4" onClick={() => toast.info("분석 데이터를 로드합니다.")}>
                    데이터 로드
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-500" />
                  보안 설정
                </CardTitle>
                <CardDescription>API 보안 정책과 접근 제어를 관리하세요</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">API 키 인증</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">API 키를 통한 인증 활성화</p>
                    </div>
                    <Badge
                      variant="default"
                      className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    >
                      활성
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Rate Limiting</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">API 호출 횟수 제한</p>
                    </div>
                    <Badge
                      variant="default"
                      className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    >
                      활성
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">CORS 정책</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Cross-Origin 요청 제어</p>
                    </div>
                    <Badge variant="secondary">설정 필요</Badge>
                  </div>
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
                <CardDescription>API 관리 환경을 설정하세요</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-2">알림 설정</h4>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked />
                        <span className="text-sm">API 오류 알림</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked />
                        <span className="text-sm">성능 저하 알림</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" />
                        <span className="text-sm">일일 리포트</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">데이터 보관</h4>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2">
                        <input type="radio" name="retention" defaultChecked />
                        <span className="text-sm">30일</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="radio" name="retention" />
                        <span className="text-sm">90일</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="radio" name="retention" />
                        <span className="text-sm">1년</span>
                      </label>
                    </div>
                  </div>
                  <Button onClick={() => toast.success("설정이 저장되었습니다.")}>설정 저장</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}
