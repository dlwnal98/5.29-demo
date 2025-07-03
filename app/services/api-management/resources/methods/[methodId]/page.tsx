"use client"

import { AppLayout } from "@/components/layout/AppLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ArrowLeft, ChevronLeft, ChevronRight, Copy, Edit, Monitor, Play } from "lucide-react"
import { useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { toast } from "sonner"

interface ResponseHeader {
  id: string
  name: string
  value: string
}

interface ResponseBody {
  id: string
  contentType: string
  model: string
}

export default function MethodDetailPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const resourceId = searchParams.get("resourceId")
  const resourcePath = searchParams.get("resourcePath")
  const methodId = searchParams.get("methodId") || "GET"

  const [activeTab, setActiveTab] = useState("method-request")
  const [selectedFlowStep, setSelectedFlowStep] = useState("")

  // Method Request Settings
  const [methodRequestSettings, setMethodRequestSettings] = useState({
    authorization: "NONE",
    requestValidator: "없음",
    apiKeyRequired: false,
    sdkOperationName: "메서드 및 경로에 따라 생성됨",
  })

  // Method Response Settings
  const [responseHeaders, setResponseHeaders] = useState<ResponseHeader[]>([])
  const [responseBodies, setResponseBodies] = useState<ResponseBody[]>([
    { id: "1", contentType: "application/json", model: "Empty" },
  ])

  // Test Settings
  const [testSettings, setTestSettings] = useState({
    queryString: "param1=value1&param2=value2",
    headers: "header1:value1 header2:value2",
    clientCertificate: "No client certificates have been generated.",
  })

  const handleBack = () => {
    router.push(`/services/api-management/resources?resourceId=${resourceId}&resourcePath=${resourcePath}`)
  }

  const handleCopyArn = () => {
    const arn = "arn:aws:execute-api:ap-northeast-2:446785114695:yr5g5hoch/*/GET/rmd"
    navigator.clipboard.writeText(arn)
    toast.success("ARN이 클립보드에 복사되었습니다.")
  }

  const handleFlowStepClick = (step: string) => {
    setSelectedFlowStep(step)
    if (step === "method-request") {
      setActiveTab("method-request")
    } else if (step === "method-response") {
      setActiveTab("method-response")
    }
  }

  const handleTest = () => {
    toast.success("테스트가 실행되었습니다.")
  }

  const handleCreateResponse = () => {
    toast.success("새 응답이 생성되었습니다.")
  }

  const handleEditResponse = () => {
    toast.success("응답 편집 모드로 전환되었습니다.")
  }

  const handleDeleteResponse = () => {
    toast.success("응답이 삭제되었습니다.")
  }

  return (
    <AppLayout>
      <div className="flex h-screen">
        {/* Left Sidebar - Resource Tree */}
        <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4">
          <div className="mb-4">
            <Button
              variant="outline"
              size="sm"
              className="bg-blue-500 text-white border-blue-500 hover:bg-blue-600 mb-4"
            >
              리소스 생성
            </Button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span>📁</span>
              <span>/</span>
            </div>
            <div className="ml-4 space-y-1">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span>📁</span>
                <span>/rmd</span>
              </div>
              <div className="ml-4">
                <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-sm font-medium">
                  GET
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="container mx-auto px-6 py-6">
            {/* Breadcrumb */}
            <Breadcrumb className="mb-6">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/services">Services</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/services/api-management">API Management</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/services/api-management/resources">리소스</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>메서드 상세</BreadcrumbPage>
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
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">/rmd - GET - 메서드 상세</h1>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">ARN</span>
                    <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded">
                      <code className="text-sm font-mono">
                        arn:aws:execute-api:ap-northeast-2:446785114695:yr5g5hoch/*/GET/rmd
                      </code>
                      <Button size="sm" variant="ghost" onClick={handleCopyArn}>
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm text-gray-600 dark:text-gray-400">리소스 ID</div>
                  <div className="font-mono text-sm">saqzyo</div>
                </div>
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">API 배포</Button>
                <Button variant="outline">삭제</Button>
              </div>
            </div>

            {/* Flow Diagram */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
              <div className="flex items-center justify-between">
                {/* Client */}
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mb-2">
                    <Monitor className="h-8 w-8 text-gray-600 dark:text-gray-400" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">클라이언트</span>
                </div>

                <ArrowLeft className="h-6 w-6 text-gray-400 rotate-180" />

                {/* Method Request */}
                <div
                  className={`flex flex-col items-center cursor-pointer transition-all ${
                    selectedFlowStep === "method-request" ? "bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3" : ""
                  }`}
                  onClick={() => handleFlowStepClick("method-request")}
                >
                  <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-lg mb-2 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
                    메서드 요청
                  </div>
                </div>

                <ArrowLeft className="h-6 w-6 text-gray-400 rotate-180" />

                {/* Method Response */}
                <div
                  className={`flex flex-col items-center cursor-pointer transition-all ${
                    selectedFlowStep === "method-response" ? "bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3" : ""
                  }`}
                  onClick={() => handleFlowStepClick("method-response")}
                >
                  <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-lg mb-2 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
                    메서드 응답
                  </div>
                </div>

                <ArrowLeft className="h-6 w-6 text-gray-400 rotate-180" />

                {/* HTTP Integration */}
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mb-2">
                    <div className="text-center">
                      <div className="text-xs font-bold text-gray-600 dark:text-gray-400">HTTP</div>
                      <div className="text-xs text-gray-500 dark:text-gray-500">통합</div>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">HTTP 통합</span>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="method-request">메서드 요청</TabsTrigger>
                <TabsTrigger value="method-response">메서드 응답</TabsTrigger>
                <TabsTrigger value="test">테스트</TabsTrigger>
              </TabsList>

              {/* Method Request Tab */}
              <TabsContent value="method-request" className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">메서드 요청 설정</h2>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      편집
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">권한 부여</Label>
                          <div className="mt-1 text-sm text-gray-900 dark:text-white">
                            {methodRequestSettings.authorization}
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">요청 검사기</Label>
                          <div className="mt-1 text-sm text-gray-900 dark:text-white">
                            {methodRequestSettings.requestValidator}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            API 키가 필요함
                          </Label>
                          <div className="mt-1 text-sm text-gray-900 dark:text-white">
                            {methodRequestSettings.apiKeyRequired ? "True" : "False"}
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">SDK 작업 이름</Label>
                          <div className="mt-1 text-sm text-gray-900 dark:text-white">
                            {methodRequestSettings.sdkOperationName}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Path Request */}
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">경로 요청 (0)</h3>
                    <div className="flex items-center gap-2">
                      <ChevronLeft className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">1</span>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400 mb-2">요청 경로 없음</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500">정의된 요청 경로 없음</p>
                  </div>
                </div>

                {/* URL Query String Parameters */}
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      URL 쿼리 문자열 파라미터 (0)
                    </h3>
                    <div className="flex items-center gap-2">
                      <ChevronLeft className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">1</span>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">이름</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">필수</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">캐싱</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </Select>
                    </div>
                  </div>
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400 mb-2">URL 쿼리 문자열 파라미터 없음</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500">
                      정의된 URL 쿼리 문자열 파라미터가 없습니다
                    </p>
                  </div>
                </div>
              </TabsContent>

              {/* Method Response Tab */}
              <TabsContent value="method-response" className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">메서드 응답</h2>
                      <Button variant="link" className="text-blue-600 p-0 h-auto text-sm">
                        정보
                      </Button>
                    </div>
                    <Button className="bg-blue-500 hover:bg-blue-600 text-white" onClick={handleCreateResponse}>
                      응답 생성
                    </Button>
                  </div>

                  {/* Response 200 */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">응답 200</h3>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={handleEditResponse}>
                          편집
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleDeleteResponse}>
                          삭제
                        </Button>
                      </div>
                    </div>

                    {/* Response Headers */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-md font-semibold text-gray-900 dark:text-white">응답 헤더 (0)</h4>
                        <div className="flex items-center gap-2">
                          <ChevronLeft className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">1</span>
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-4 mb-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">이름</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </Select>
                        </div>
                      </div>
                      <div className="text-center py-6 border border-gray-200 dark:border-gray-600 rounded-lg">
                        <p className="text-gray-500 dark:text-gray-400 mb-2">응답 헤더 없음</p>
                        <p className="text-sm text-gray-400 dark:text-gray-500">정의된 응답 헤더 없음</p>
                      </div>
                    </div>

                    {/* Response Body */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-md font-semibold text-gray-900 dark:text-white">응답 본문 (1)</h4>
                        <div className="flex items-center gap-2">
                          <ChevronLeft className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">1</span>
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">콘텐츠 유형</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">모델</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </Select>
                        </div>
                      </div>
                      <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-900 dark:text-white">application/json</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">Empty</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Test Tab */}
              <TabsContent value="test" className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">테스트 방법</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    메서드에 대한 테스트 직접 호출을 수행하세요. 테스트 직접 호출 시 API Gateway는 인증을 건너 뛰고
                    메서드를 간접적으로 호출합니다.
                  </p>

                  <div className="space-y-6">
                    {/* Query String */}
                    <div>
                      <Label className="text-base font-medium text-gray-900 dark:text-white mb-3 block">
                        쿼리 문자열
                      </Label>
                      <Input
                        value={testSettings.queryString}
                        onChange={(e) => setTestSettings({ ...testSettings, queryString: e.target.value })}
                        className="w-full"
                        placeholder="param1=value1&param2=value2"
                      />
                    </div>

                    {/* Headers */}
                    <div>
                      <Label className="text-base font-medium text-gray-900 dark:text-white mb-3 block">헤더</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        헤더 이름과 값을 콜론(:)으로 구분하여 입력합니다. 각 헤더를 새 줄에 입력합니다.
                      </p>
                      <Textarea
                        value={testSettings.headers}
                        onChange={(e) => setTestSettings({ ...testSettings, headers: e.target.value })}
                        className="w-full min-h-[100px]"
                        placeholder="header1:value1 header2:value2"
                      />
                    </div>

                    {/* Client Certificate */}
                    <div>
                      <Label className="text-base font-medium text-gray-900 dark:text-white mb-3 block">
                        클라이언트 인증서
                      </Label>
                      <Select value={testSettings.clientCertificate}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="No client certificates have been generated.">
                            No client certificates have been generated.
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Test Button */}
                    <div className="pt-4">
                      <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-2" onClick={handleTest}>
                        <Play className="h-4 w-4 mr-2" />
                        테스트
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
