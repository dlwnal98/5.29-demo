"use client"

import { AppLayout } from "@/components/layout/AppLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ArrowLeft,
  Trash2,
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  CheckCircle,
  XCircle,
  Shield,
  AlertTriangle,
  X,
  ExternalLink,
  Rocket,
  Edit,
  Monitor,
  Play,
  Copy,
  ChevronLeft,
  Send,
  Code,
  FileText,
  ArrowRight,
} from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { toast } from "sonner"

interface Resource {
  id: string
  path: string
  name: string
  corsEnabled: boolean
  children?: Resource[]
  methods: Method[]
}

interface Method {
  id: string
  type: string
  permissions: string
  apiKey: string
  resourcePath: string
}

interface Stage {
  id: string
  name: string
  description: string
}

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

interface TestResponse {
  status: number
  statusText: string
  headers: Record<string, string>
  body: string
  responseTime: number
}

export default function ApiResourcesPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const apiId = searchParams.get("apiId")
  const apiName = searchParams.get("apiName")
  const leftSidebarRef = useRef<HTMLDivElement>(null)
  const rightContentRef = useRef<HTMLDivElement>(null)

  const [resources, setResources] = useState<Resource[]>([
    {
      id: "root",
      path: "/",
      name: "Root",
      corsEnabled: true,
      methods: [],
      children: [
        {
          id: "rmd",
          path: "/rmd",
          name: "RMD Resource",
          corsEnabled: false,
          methods: [
            {
              id: "get-rmd",
              type: "GET",
              permissions: "읽기",
              apiKey: "required",
              resourcePath: "/rmd",
            },
          ],
        },
      ],
    },
  ])

  const [stages] = useState<Stage[]>([
    { id: "hello", name: "hello", description: "Hello stage for testing" },
    { id: "nexfron", name: "nexfron", description: "Nexfron production stage" },
    { id: "new", name: "*새 스테이지*", description: "Create a new stage" },
    { id: "none", name: "스테이지 없음", description: "Deploy without stage" },
  ])

  const [selectedResource, setSelectedResource] = useState<Resource>(resources[0])
  const [selectedMethod, setSelectedMethod] = useState<Method | null>(null)
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set(["/", "/rmd"]))
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isMethodDeleteDialogOpen, setIsMethodDeleteDialogOpen] = useState(false)
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false)
  const [createResourceForm, setCreateResourceForm] = useState({
    path: "",
    name: "",
    corsEnabled: false,
  })
  const [deployForm, setDeployForm] = useState({
    stage: "",
    description: "",
  })

  // Method Detail States
  const [activeTab, setActiveTab] = useState("method-request")
  const [selectedFlowStep, setSelectedFlowStep] = useState("")
  const [methodRequestSettings, setMethodRequestSettings] = useState({
    authorization: "NONE",
    requestValidator: "없음",
    apiKeyRequired: false,
    sdkOperationName: "메서드 및 경로에 따라 생성됨",
  })
  const [responseHeaders, setResponseHeaders] = useState<ResponseHeader[]>([])
  const [responseBodies, setResponseBodies] = useState<ResponseBody[]>([
    { id: "1", contentType: "application/json", model: "Empty" },
  ])

  // Test Tab States
  const [testSettings, setTestSettings] = useState({
    queryString: "",
    headers: "",
    requestBody: "",
    contentType: "application/json",
  })
  const [testResponse, setTestResponse] = useState<TestResponse | null>(null)
  const [isTestLoading, setIsTestLoading] = useState(false)

  // Sync heights
  useEffect(() => {
    const syncHeights = () => {
      if (leftSidebarRef.current && rightContentRef.current) {
        const rightHeight = rightContentRef.current.offsetHeight
        leftSidebarRef.current.style.height = `${rightHeight}px`
      }
    }

    syncHeights()
    window.addEventListener("resize", syncHeights)

    // Use MutationObserver to detect content changes
    const observer = new MutationObserver(syncHeights)
    if (rightContentRef.current) {
      observer.observe(rightContentRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
      })
    }

    return () => {
      window.removeEventListener("resize", syncHeights)
      observer.disconnect()
    }
  }, [selectedMethod, activeTab])

  const handleBack = () => {
    router.push("/services/api-management")
  }

  const toggleExpanded = (path: string) => {
    const newExpanded = new Set(expandedPaths)
    if (newExpanded.has(path)) {
      newExpanded.delete(path)
    } else {
      newExpanded.add(path)
    }
    setExpandedPaths(newExpanded)
  }

  const handleCreateResource = () => {
    if (!createResourceForm.path.trim() || !createResourceForm.name.trim()) {
      toast.error("리소스 경로와 이름을 입력해주세요.")
      return
    }

    const newResource: Resource = {
      id: Date.now().toString(),
      path: createResourceForm.path,
      name: createResourceForm.name,
      corsEnabled: createResourceForm.corsEnabled,
      methods: [],
    }

    setResources([...resources, newResource])
    setIsCreateModalOpen(false)
    setCreateResourceForm({ path: "", name: "", corsEnabled: false })
    toast.success(`리소스 '${newResource.name}'이(가) 생성되었습니다.`)
  }

  const handleDeleteResource = () => {
    if (selectedResource.id === "root") {
      toast.error("루트 리소스는 삭제할 수 없습니다.")
      return
    }

    setIsDeleteDialogOpen(false)
    toast.success(`리소스 '${selectedResource.name}'이(가) 삭제되었습니다.`)
  }

  const handleDeleteMethod = () => {
    if (selectedMethod) {
      toast.success(`메서드 '${selectedMethod.type} ${selectedMethod.resourcePath}'이(가) 삭제되었습니다.`)
      setSelectedMethod(null)
      setIsMethodDeleteDialogOpen(false)
    }
  }

  const handleCreateMethod = () => {
    router.push(
      `/services/api-management/resources/methods?resourceId=${selectedResource.id}&resourcePath=${selectedResource.path}`,
    )
  }

  const handleMethodClick = (method: Method, resource: Resource) => {
    setSelectedMethod(method)
    setSelectedResource(resource)
    setActiveTab("method-request")
  }

  const handleBackToResource = () => {
    setSelectedMethod(null)
  }

  const handleDeploy = () => {
    if (!deployForm.stage) {
      toast.error("스테이지를 선택해주세요.")
      return
    }

    const selectedStage = stages.find((s) => s.id === deployForm.stage)

    toast.success(`API가 '${selectedStage?.name}' 스테이지에 성공적으로 배포되었습니다.`)
    setIsDeployModalOpen(false)
    setDeployForm({ stage: "", description: "" })
  }

  const handleCopyArn = () => {
    const arn = `arn:aws:execute-api:ap-northeast-2:446785114695:yr5g5hoch/*/${selectedMethod?.type}${selectedMethod?.resourcePath}`
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

  const handleTest = async () => {
    if (!selectedMethod) return

    setIsTestLoading(true)
    const startTime = Date.now()

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000))

      const endTime = Date.now()
      const responseTime = endTime - startTime

      // Mock response based on method type
      const mockResponse: TestResponse = {
        status: 200,
        statusText: "OK",
        headers: {
          "Content-Type": testSettings.contentType,
          "Access-Control-Allow-Origin": "*",
          "X-Response-Time": `${responseTime}ms`,
        },
        body:
          selectedMethod.type === "GET"
            ? JSON.stringify({ message: "Success", data: { id: 1, name: "Test Data" } }, null, 2)
            : JSON.stringify({ message: "Created successfully", id: Date.now() }, null, 2),
        responseTime,
      }

      setTestResponse(mockResponse)
      toast.success("API 테스트가 완료되었습니다.")
    } catch (error) {
      const endTime = Date.now()
      const responseTime = endTime - startTime

      setTestResponse({
        status: 500,
        statusText: "Internal Server Error",
        headers: {
          "Content-Type": "application/json",
          "X-Response-Time": `${responseTime}ms`,
        },
        body: JSON.stringify({ error: "Internal server error", message: "Something went wrong" }, null, 2),
        responseTime,
      })
      toast.error("API 테스트 중 오류가 발생했습니다.")
    } finally {
      setIsTestLoading(false)
    }
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

  const renderResourceTree = (resource: Resource, level = 0) => {
    const isExpanded = expandedPaths.has(resource.path)
    const hasChildren = resource.children && resource.children.length > 0

    return (
      <div key={resource.id}>
        <div
          className={`flex items-center gap-2 py-2 px-3 mb-1 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md ${selectedResource.id === resource.id && !selectedMethod
            ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
            : ""
            }`}
          style={{ paddingLeft: `${level * 20 + 12}px` }}
          onClick={() => {
            setSelectedResource(resource)
            setSelectedMethod(null)
          }}
        >
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                toggleExpanded(resource.path)
              }}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronRight className="h-4 w-4 text-gray-500" />
              )}
            </button>
          )}
          {!hasChildren && <div className="w-4" />}

          {hasChildren ? (
            isExpanded ? (
              <FolderOpen className="h-4 w-4 text-blue-500" />
            ) : (
              <Folder className="h-4 w-4 text-blue-500" />
            )
          ) : (
            <></>
          )}

          <span className="font-medium">{resource.path}</span>
        </div>

        {hasChildren &&
          isExpanded &&
          resource.children?.map((child) => (
            <div key={child.id}>
              {renderResourceTree(child, level + 1)}
              {child.methods.map((method) => (
                <div
                  key={method.id}
                  className={`flex items-center gap-2 py-1 px-3 text-sm cursor-pointer hover:bg-green-50 dark:hover:bg-green-900/20 rounded-md ${selectedMethod?.id === method.id
                    ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                    : "text-gray-600 dark:text-gray-400"
                    }`}
                  style={{ paddingLeft: `${(level + 2) * 20 + 12}px` }}
                  onClick={() => handleMethodClick(method, child)}
                >
                  <div className="w-4" />
                  {/* <div className="w-4 h-4 bg-green-100 rounded border border-green-300 flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                  </div> */}
                  <span className="font-mono text-xs bg-green-100 text-green-800 px-2 py-1 rounded">{method.type}</span>
                </div>
              ))}
            </div>
          ))}
      </div>
    )
  }

  const availableResourcePaths = ["/", "/api", "/users", "/products", "/orders"]

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
              <BreadcrumbLink href="/services/api-management">API Management</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>리소스</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">리소스</h1>
          </div>
          {/* <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={() => setIsDeployModalOpen(true)}>
            <Rocket className="h-4 w-4 mr-2" />
            API 배포
          </Button> */}
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar - Resource Tree */}
          <div className="col-span-3">
            <div
              ref={leftSidebarRef}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 overflow-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">리소스 목록</h3>
                <Button
                  size="sm"
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 h-7"
                >
                  리소스 생성
                </Button>
              </div>
              <div className="space-y-1">{resources.map((resource) => renderResourceTree(resource))}</div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-9">
            <div ref={rightContentRef}>
              {selectedMethod ? (
                /* Method Detail View */
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  {/* Method Header */}
                  <div className="border-b border-gray-200 dark:border-gray-700 p-6">
                    <div className=" mb-4">
                      {/* <Button variant="outline" size="sm" onClick={handleBackToResource}>
                          <ArrowLeft className="h-4 w-4" />
                        </Button> */}
                      <div>
                        <div className="flex items-center justify-between mb-4">

                          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {selectedMethod.resourcePath} - {selectedMethod.type} - 메서드 상세
                          </h1>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 bg-transparent"
                              onClick={() => setIsMethodDeleteDialogOpen(true)}
                            >
                              삭제
                            </Button>
                            <Button className="bg-orange-500 hover:bg-orange-600 text-white">API 배포</Button>

                          </div>
                        </div>
                        <div className="mt-2">
                          <div className="flex items-center gap-2  mb-2">
                            <div className="w-16 text-sm text-gray-600 dark:text-gray-400">메서드 ID</div>
                            <div className="font-mono text-sm">saqzyo</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-16 text-sm text-gray-600 dark:text-gray-400">URL</span>
                            <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded">
                              <code className="text-sm font-mono">
                                arn:aws:execute-api:ap-northeast-2:446785114695:yr5g5hoch/*/{selectedMethod.type}
                                {selectedMethod.resourcePath}
                              </code>
                              <Button size="sm" variant="ghost" onClick={handleCopyArn}>
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Updated Flow Diagram - matching the provided image */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                      <div className="flex items-center justify-between">
                        {/* Client */}
                        <div className="flex flex-col items-center">
                          <div className="w-12 h-12 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center mb-2">
                            <Monitor className="h-6 w-6 text-gray-600" />
                          </div>
                          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">클라이언트</span>
                        </div>

                        <div className="space-y-3">
                          <ArrowLeft className="h-4 w-4 text-gray-400 rotate-180 mx-2" />
                          <ArrowRight className="h-4 w-4 text-gray-400 rotate-180 mx-2" />
                        </div>


                        {/* Method Request & Response */}
                        <div className="flex flex-col items-center ">
                          <div
                            className={`bg-blue-100 dark:bg-blue-900/30 rounded-lg p-3 text-center cursor-pointer transition-all mb-2 ${selectedFlowStep === "method-request"
                              ? "bg-blue-200 dark:bg-blue-800 "
                              : ""
                              }`}
                            onClick={() => handleFlowStepClick("method-request")}
                          >
                            <div className="text-xs font-medium text-blue-700 dark:text-blue-300">메서드 요청</div>
                          </div>

                          <div
                            className={`bg-blue-100 dark:bg-blue-900/30 rounded-lg p-3 text-center  cursor-pointer transition-all ${selectedFlowStep === "method-response"
                              ? "bg-blue-200 dark:bg-blue-800"
                              : ""
                              }`}
                            onClick={() => handleFlowStepClick("method-response")}
                          >
                            <div className="text-xs font-medium text-blue-700 dark:text-blue-300">메서드 응답</div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <ArrowLeft className="h-4 w-4 text-gray-400 rotate-180 mx-2" />
                          <ArrowRight className="h-4 w-4 text-gray-400 rotate-180 mx-2" />
                        </div>



                        {/* HTTP Response */}
                        <div className="flex flex-col items-center">
                          <div className="bg-white border-2 border-gray-300 rounded-lg p-3 mb-2 min-w-[80px]">
                            <div className="text-center">
                              <div className="text-xs font-bold text-gray-600">HTTP</div>
                              <div className="text-xs text-gray-500">응답</div>
                            </div>
                          </div>
                          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">HTTP 응답</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Method Tabs */}
                  <div className="p-6">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="method-request">메서드 요청</TabsTrigger>
                        <TabsTrigger value="method-response">메서드 응답</TabsTrigger>
                        <TabsTrigger value="test">테스트</TabsTrigger>
                      </TabsList>

                      {/* Method Request Tab */}
                      <TabsContent value="method-request" className="space-y-6 mt-6">
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">메서드 요청 설정</h3>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4 mr-2" />
                              편집
                            </Button>
                          </div>

                          <div className="grid grid-cols-2 gap-6">
                            <div>
                              <div className="space-y-2">
                                <div>
                                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    권한 부여
                                  </Label>
                                  <div className="mt-1 text-sm text-gray-900 dark:text-white">
                                    {methodRequestSettings.authorization}
                                  </div>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    요청 검사기
                                  </Label>
                                  <div className="mt-1 text-sm text-gray-900 dark:text-white">
                                    {methodRequestSettings.requestValidator}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="space-y-2">
                                <div>
                                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    API 키가 필요함
                                  </Label>
                                  <div className="mt-1 text-sm text-gray-900 dark:text-white">
                                    {methodRequestSettings.apiKeyRequired ? "True" : "False"}
                                  </div>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    SDK 작업 이름
                                  </Label>
                                  <div className="mt-1 text-sm text-gray-900 dark:text-white">
                                    {methodRequestSettings.sdkOperationName}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* URL Query String Parameters */}
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-md font-semibold text-gray-900 dark:text-white">
                              URL 쿼리 문자열 파라미터 (0)
                            </h4>
                            <div className="flex items-center gap-2">
                              <ChevronLeft className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-600 dark:text-gray-400">1</span>
                              <ChevronRight className="h-4 w-4 text-gray-400" />
                            </div>
                          </div>
                          <div className="text-center py-6">
                            <p className="text-gray-500 dark:text-gray-400 mb-2">URL 쿼리 문자열 파라미터 없음</p>
                            <p className="text-sm text-gray-400 dark:text-gray-500">
                              정의된 URL 쿼리 문자열 파라미터가 없습니다
                            </p>
                          </div>
                        </div>
                      </TabsContent>

                      {/* Method Response Tab */}
                      <TabsContent value="method-response" className="space-y-6 mt-6">
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-4">
                              <h3 className="text-lg font-bold text-gray-900 dark:text-white">메서드 응답</h3>
                            </div>
                            <Button className="bg-blue-500 hover:bg-blue-600 text-white" onClick={handleCreateResponse}>
                              응답 생성
                            </Button>
                          </div>

                          {/* Response 200 */}
                          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border">
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="text-md font-semibold text-gray-900 dark:text-white">응답 200</h4>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={handleEditResponse}>
                                  편집
                                </Button>
                                <Button variant="outline" size="sm" onClick={handleDeleteResponse}>
                                  삭제
                                </Button>
                              </div>
                            </div>

                            <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-900 dark:text-white">application/json</span>
                                <span className="text-sm text-gray-600 dark:text-gray-400">Empty</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      {/* Enhanced Test Tab */}
                      <TabsContent value="test" className="space-y-6 mt-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Request Section */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                <Send className="h-5 w-5" />
                                요청 설정
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              {/* Method and URL */}
                              <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <span
                                  className={`px-3 py-1 rounded text-sm font-mono font-bold ${selectedMethod.type === "GET"
                                    ? "bg-green-100 text-green-800"
                                    : selectedMethod.type === "POST"
                                      ? "bg-blue-100 text-blue-800"
                                      : selectedMethod.type === "PUT"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : selectedMethod.type === "DELETE"
                                          ? "bg-red-100 text-red-800"
                                          : "bg-gray-100 text-gray-800"
                                    }`}
                                >
                                  {selectedMethod.type}
                                </span>
                                <code className="flex-1 text-sm bg-white dark:bg-gray-700 px-3 py-2 rounded border">
                                  https://api.example.com{selectedMethod.resourcePath}
                                </code>
                              </div>

                              {/* Query Parameters */}
                              <div>
                                <Label className="text-sm font-medium text-gray-900 dark:text-white mb-2 block">
                                  쿼리 파라미터
                                </Label>
                                <Input
                                  value={testSettings.queryString}
                                  onChange={(e) => setTestSettings({ ...testSettings, queryString: e.target.value })}
                                  placeholder="key1=value1&key2=value2"
                                  className="font-mono text-sm"
                                />
                              </div>

                              {/* Headers */}
                              <div>
                                <Label className="text-sm font-medium text-gray-900 dark:text-white mb-2 block">
                                  헤더
                                </Label>
                                <Textarea
                                  value={testSettings.headers}
                                  onChange={(e) => setTestSettings({ ...testSettings, headers: e.target.value })}
                                  placeholder={`Authorization: Bearer token\nContent-Type: application/json\nX-Custom-Header: value`}
                                  className="min-h-[80px] font-mono text-sm"
                                />
                              </div>

                              {/* Request Body (for POST, PUT, PATCH) */}
                              {["POST", "PUT", "PATCH"].includes(selectedMethod.type) && (
                                <div>
                                  <div className="flex items-center justify-between mb-2">
                                    <Label className="text-sm font-medium text-gray-900 dark:text-white">
                                      요청 본문
                                    </Label>
                                    <Select
                                      value={testSettings.contentType}
                                      onValueChange={(value) =>
                                        setTestSettings({ ...testSettings, contentType: value })
                                      }
                                    >
                                      <SelectTrigger className="w-48">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="application/json">application/json</SelectItem>
                                        <SelectItem value="application/xml">application/xml</SelectItem>
                                        <SelectItem value="text/plain">text/plain</SelectItem>
                                        <SelectItem value="application/x-www-form-urlencoded">
                                          form-urlencoded
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <Textarea
                                    value={testSettings.requestBody}
                                    onChange={(e) => setTestSettings({ ...testSettings, requestBody: e.target.value })}
                                    placeholder={
                                      testSettings.contentType === "application/json"
                                        ? `{\n  "name": "John Doe",\n  "email": "john@example.com"\n}`
                                        : "Request body content"
                                    }
                                    className="min-h-[120px] font-mono text-sm"
                                  />
                                </div>
                              )}

                              {/* Test Button */}
                              <Button
                                className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                                onClick={handleTest}
                                disabled={isTestLoading}
                              >
                                {isTestLoading ? (
                                  <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    테스트 중...
                                  </>
                                ) : (
                                  <>
                                    <Play className="h-4 w-4 mr-2" />
                                    테스트 실행
                                  </>
                                )}
                              </Button>
                            </CardContent>
                          </Card>

                          {/* Response Section */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                응답 결과
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              {testResponse ? (
                                <div className="space-y-4">
                                  {/* Status */}
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium">상태:</span>
                                    <span
                                      className={`px-2 py-1 rounded text-sm font-mono ${testResponse.status >= 200 && testResponse.status < 300
                                        ? "bg-green-100 text-green-800"
                                        : testResponse.status >= 400
                                          ? "bg-red-100 text-red-800"
                                          : "bg-yellow-100 text-yellow-800"
                                        }`}
                                    >
                                      {testResponse.status} {testResponse.statusText}
                                    </span>
                                    <span className="text-sm text-gray-500 ml-auto">{testResponse.responseTime}ms</span>
                                  </div>

                                  {/* Headers */}
                                  <div>
                                    <Label className="text-sm font-medium text-gray-900 dark:text-white mb-2 block">
                                      응답 헤더
                                    </Label>
                                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                                      <pre className="text-xs font-mono text-gray-700 dark:text-gray-300">
                                        {Object.entries(testResponse.headers)
                                          .map(([key, value]) => `${key}: ${value}`)
                                          .join("\n")}
                                      </pre>
                                    </div>
                                  </div>

                                  {/* Body */}
                                  <div>
                                    <Label className="text-sm font-medium text-gray-900 dark:text-white mb-2 block">
                                      응답 본문
                                    </Label>
                                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 max-h-64 overflow-auto">
                                      <pre className="text-xs font-mono text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                        {testResponse.body}
                                      </pre>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="text-center py-12">
                                  <Code className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                  <p className="text-gray-500 dark:text-gray-400 mb-2">응답 대기 중</p>
                                  <p className="text-sm text-gray-400 dark:text-gray-500">
                                    테스트 실행 버튼을 클릭하여 API를 테스트하세요
                                  </p>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              ) : (
                /* Resource Detail View */
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  {/* Resource Details Header */}
                  <div className="border-b border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">리소스 세부 정보</h2>
                      <div className="flex items-center gap-3">
                        {/* <div className="flex items-center gap-2">
                          {selectedResource.corsEnabled ? (
                            <>
                              <CheckCircle className="h-5 w-5 text-green-500" />
                              <span className="text-sm text-green-600 font-medium">CORS 활성화</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="h-5 w-5 text-red-500" />
                              <span className="text-sm text-red-600 font-medium">CORS 비활성화</span>
                            </>
                          )}
                        </div> */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsDeleteDialogOpen(true)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          리소스 삭제
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                      <div>
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">리소스 ID</Label>
                        <div className="mt-1 text-sm font-mono text-gray-900 dark:text-gray-400">jtgiezhqj1</div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">경로</Label>
                        <div className="mt-1 text-lg font-mono text-gray-900 dark:text-white">
                          {selectedResource.path}
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">CORS 활성화 여부</Label>
                        <div className="mt-1 text-sm font-mono text-gray-600 dark:text-gray-400">   {selectedResource.corsEnabled ? (
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            <span className="text-sm text-green-600 font-medium">active</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <XCircle className="h-5 w-5 text-red-500" />
                            <span className="text-sm text-red-600 font-medium">disabled</span>
                          </div>
                        )}</div>
                      </div>
                    </div>
                  </div>

                  {/* Methods Section */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        메서드 ({selectedResource.methods.length})
                      </h3>
                      <div className="flex gap-2">
                        {/* <Button variant="outline" size="sm">
                          삭제
                        </Button> */}
                        <Button
                          size="sm"
                          onClick={handleCreateMethod}
                          className="bg-blue-500 hover:bg-blue-600 text-white"
                        >
                          메서드 생성
                        </Button>
                      </div>
                    </div>

                    {selectedResource.methods.length > 0 ? (
                      <Table>
                        <TableHeader className="hover:bg-white dark:hover:bg-gray-700">
                          <TableRow className="hover:bg-white dark:hover:bg-gray-700">
                            <TableHead>메서드 유형</TableHead>
                            <TableHead>권한 부여</TableHead>
                            <TableHead>API 키</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedResource.methods.map((method) => (
                            <TableRow
                              key={method.id}
                              className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                              onClick={() => handleMethodClick(method, selectedResource)}
                            >
                              <TableCell>
                                <span className="font-mono text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                                  {method.type}
                                </span>
                              </TableCell>
                              <TableCell>{method.permissions}</TableCell>
                              <TableCell>{method.apiKey}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-center py-12">
                        <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 dark:text-gray-400 mb-2">메서드 없음</p>
                        <p className="text-sm text-gray-500">정의된 메서드가 없습니다.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Create Resource Modal */}
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-blue-600">Resource 생성</DialogTitle>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Resource Path and Name - Side by Side */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="resource-path" className="text-sm font-medium text-gray-700 mb-2 block">
                    리소스 경로
                  </Label>
                  <Select
                    value={createResourceForm.path}
                    onValueChange={(value) =>
                      setCreateResourceForm({
                        ...createResourceForm,
                        path: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="경로를 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableResourcePaths.map((path) => (
                        <SelectItem key={path} value={path}>
                          {path}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="resource-name" className="text-sm font-medium text-gray-700 mb-2 block">
                    리소스 이름
                  </Label>
                  <Input
                    id="resource-name"
                    placeholder="my-resource"
                    value={createResourceForm.name}
                    onChange={(e) =>
                      setCreateResourceForm({
                        ...createResourceForm,
                        name: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              {/* CORS Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <Label htmlFor="cors-toggle" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    원본에서 CORS
                  </Label>
                  <p className="text-xs text-gray-500 mt-1">Cross-Origin Resource Sharing을 활성화합니다</p>
                </div>
                <Switch
                  id="cors-toggle"
                  checked={createResourceForm.corsEnabled}
                  onCheckedChange={(checked) =>
                    setCreateResourceForm({
                      ...createResourceForm,
                      corsEnabled: checked,
                    })
                  }
                />
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreateModalOpen(false)
                  setCreateResourceForm({
                    path: "",
                    name: "",
                    corsEnabled: false,
                  })
                }}
              >
                취소
              </Button>
              <Button onClick={handleCreateResource} className="bg-blue-500 hover:bg-blue-600 text-white">
                생성
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Deploy API Modal */}
        <Dialog open={isDeployModalOpen} onOpenChange={setIsDeployModalOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">Deploy API</DialogTitle>
              <Button variant="ghost" size="sm" onClick={() => setIsDeployModalOpen(false)} className="h-6 w-6 p-0">
                <X className="h-4 w-4" />
              </Button>
            </DialogHeader>

            <div className="space-y-6">
              {/* Description */}
              <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                API를 배포할 스테이지를 생성하거나 선택합니다. 배포 기록을 사용하여 스테이지의 활성 배포를 되돌리거나
                변경할 수 있습니다.{" "}
                <button className="text-blue-600 hover:text-blue-700 inline-flex items-center gap-1">
                  Learn more
                  <ExternalLink className="h-3 w-3" />
                </button>
              </div>

              {/* Stage Selection */}
              <div>
                <Label
                  htmlFor="stage-select"
                  className="text-base font-semibold text-gray-900 dark:text-white mb-3 block"
                >
                  스테이지
                </Label>
                <Select
                  value={deployForm.stage}
                  onValueChange={(value) => setDeployForm({ ...deployForm, stage: value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="옵션을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {stages.map((stage) => (
                      <SelectItem key={stage.id} value={stage.id}>
                        {stage.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Deploy Description */}
              <div>
                <Label
                  htmlFor="deploy-description"
                  className="text-base font-semibold text-gray-900 dark:text-white mb-3 block"
                >
                  배포 설명
                </Label>
                <Textarea
                  id="deploy-description"
                  placeholder="배포에 대한 설명을 입력하세요..."
                  value={deployForm.description}
                  onChange={(e) =>
                    setDeployForm({
                      ...deployForm,
                      description: e.target.value,
                    })
                  }
                  className="min-h-[120px] resize-none"
                />
              </div>
            </div>

            <DialogFooter className="gap-3 pt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setIsDeployModalOpen(false)
                  setDeployForm({ stage: "", description: "" })
                }}
                className="px-6"
              >
                취소
              </Button>
              <Button onClick={handleDeploy} className="bg-orange-500 hover:bg-orange-600 text-white px-8">
                배포
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Resource Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                리소스 삭제 확인
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-600">
                <div className="space-y-2">
                  <p className="font-semibold">⚠️ 경고: 이 작업은 되돌릴 수 없습니다!</p>
                  <p>
                    리소스 <span className="font-mono bg-gray-100 px-2 py-1 rounded">{selectedResource.path}</span>
                    을(를) 삭제하시겠습니까?
                  </p>
                  <p className="text-sm text-red-600">
                    • 이 리소스와 연결된 모든 메서드가 삭제됩니다
                    <br />• API 호출이 실패할 수 있습니다
                    <br />• 이 작업은 즉시 적용되며 복구할 수 없습니다
                  </p>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>취소</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteResource} className="bg-red-600 hover:bg-red-700 text-white">
                삭제하기
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Delete Method Confirmation Dialog */}
        <AlertDialog open={isMethodDeleteDialogOpen} onOpenChange={setIsMethodDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                메서드 삭제 확인
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-600">
                <div className="space-y-3">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="font-semibold text-red-800 mb-2">🚨 위험: 이 작업은 되돌릴 수 없습니다!</p>
                    <p className="text-red-700 text-sm">
                      메서드{" "}
                      <strong>
                        {selectedMethod?.type} {selectedMethod?.resourcePath}
                      </strong>
                      를 영구적으로 삭제합니다.
                    </p>
                  </div>
                  <div className="text-sm text-red-600 space-y-1">
                    <p>
                      ⚠️ <strong>삭제 시 발생하는 문제:</strong>
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>
                        이 메서드를 사용하는 모든 API 호출이 <strong>즉시 실패</strong>합니다
                      </li>
                      <li>연결된 통합 설정과 응답 매핑이 모두 삭제됩니다</li>
                      <li>API 배포 시 이 메서드가 완전히 제거됩니다</li>
                      <li>클라이언트 애플리케이션에서 404 오류가 발생할 수 있습니다</li>
                      <li>삭제된 메서드는 복구할 수 없습니다</li>
                    </ul>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-yellow-800 text-sm">
                      <strong>권장사항:</strong> 삭제하기 전에 이 메서드를 사용하는 모든 클라이언트가 업데이트되었는지
                      확인하세요.
                    </p>
                  </div>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>취소</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteMethod} className="bg-red-600 hover:bg-red-700 text-white">
                <Trash2 className="h-4 w-4 mr-2" />
                영구 삭제
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppLayout>
  )
}
