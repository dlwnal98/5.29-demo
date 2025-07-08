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
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Trash2,
  ChevronRight,
  CheckCircle,
  XCircle,
  Shield,
  AlertTriangle,
  X,
  Edit,
  Monitor,
  Play,
  Copy,
  ChevronLeft,
  Send,
  Code,
  FileText,
  ArrowRight,
  Globe,
  Settings,
  Plus,
} from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { mockData2 } from "@/lib/data"

interface Resource {
  id: string
  path: string
  name: string
  corsEnabled: boolean
  corsSettings?: CorsSettings
  children?: Resource[]
  methods: Method[]
}

interface Method {
  id: string
  type: string
  permissions: string
  apiKey: string
  resourcePath: string
  endpointUrl: string
  summary: string
  description: string
  parameters: any[]
  requestBody: any
  responses: Record<string, any>
  security: any
  requestValidator?: string
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

interface CorsSettings {
  allowMethods: string[]
  allowHeaders: string
  allowOrigin: string
  exposeHeaders: string
  maxAge: string
  allowCredentials: boolean
}

interface QueryParameter {
  id: string
  name: string
  description: string
  type: string
  required: boolean
  cacheKey: boolean
}

interface RequestHeader {
  id: string
  name: string
  description: string
  type: string
  required: boolean
}

interface RequestBodyModel {
  id: string
  contentType: string
  modelName: string
  modelId: string
}

interface Model {
  id: string
  name: string
  description: string
  schema: string
}

export default function ApiResourcesPage() {
  const router = useRouter()
  const leftSidebarRef = useRef<HTMLDivElement>(null)
  const rightContentRef = useRef<HTMLDivElement>(null)

  // mockData2의 OpenAPI 구조를 기존 Resource/Method[] 형태로 변환하는 함수 추가
  function convertOpenApiToResources(openApiPaths: any): Resource[] {
    return Object.entries(openApiPaths).map(([path, methods]: [string, any], idx) => ({
      id: `resource-${idx}`,
      path,
      name: path.replace(/^\//, "") || "root",
      corsEnabled: false, // mockData2에는 cors 정보 없음
      methods: Object.entries(methods).map(([type, methodObj]: [string, any], mIdx) => ({
        id: methodObj["x-methodId"] || "-",
        type: type.toUpperCase(),
        permissions: methodObj["x-permissions"] || "-",
        apiKey: methodObj["x-apiKeyId"] || "-",
        resourcePath: path,
        endpointUrl: (mockData2.spec.servers?.[0]?.url || "") + path,
        summary: methodObj.summary,
        description: methodObj.description,
        parameters: methodObj.parameters,
        requestBody: methodObj.requestBody,
        responses: methodObj.responses,
        security: methodObj.security,
        requestValidator: "없음",
      })),
    }))
  }

  // 기존 useState(Resource[]) 부분을 mockData2 기반으로 초기화
  const [resources, setResources] = useState<Resource[]>(convertOpenApiToResources(mockData2.spec.paths))

  const [selectedResource, setSelectedResource] = useState<Resource>(resources[0])
  const [selectedMethod, setSelectedMethod] = useState<Method | null>(null)
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set(["/", "/rmd"]))
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isMethodDeleteDialogOpen, setIsMethodDeleteDialogOpen] = useState(false)
  const [isCorsModalOpen, setIsCorsModalOpen] = useState(false)
  const [methodToDelete, setMethodToDelete] = useState<Method | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)

  // Edit form states
  const [editForm, setEditForm] = useState({
    apiKeyRequired: false,
    sdkOperationName: "",
    requestValidator: "없음",
  })

  const [queryParameters, setQueryParameters] = useState<QueryParameter[]>([])
  const [requestHeaders, setRequestHeaders] = useState<RequestHeader[]>([
    {
      id: "1",
      name: "Content-Type",
      description: "요청 콘텐츠 타입",
      type: "string",
      required: true,
    },
  ])
  const [requestBodyModels, setRequestBodyModels] = useState<RequestBodyModel[]>([])

  // Available models
  const [availableModels, setAvailableModels] = useState<Model[]>([
    {
      id: "1",
      name: "User",
      description: "사용자 정보 모델",
      schema: `{
  "type": "object",
  "properties": {
    "id": {
      "type": "integer",
      "description": "사용자 ID"
    },
    "name": {
      "type": "string",
      "description": "사용자 이름"
    },
    "email": {
      "type": "string",
      "format": "email",
      "description": "이메일 주소"
    }
  },
  "required": ["id", "name", "email"]
}`,
    },
    {
      id: "2",
      name: "Product",
      description: "상품 정보 모델",
      schema: `{
  "type": "object",
  "properties": {
    "id": {
      "type": "integer",
      "description": "상품 ID"
    },
    "name": {
      "type": "string",
      "description": "상품명"
    },
    "price": {
      "type": "number",
      "minimum": 0,
      "description": "가격"
    }
  },
  "required": ["id", "name", "price"]
}`,
    },
    {
      id: "3",
      name: "Order",
      description: "주문 정보 모델",
      schema: `{
  "type": "object",
  "properties": {
    "orderId": {
      "type": "string",
      "description": "주문 ID"
    },
    "userId": {
      "type": "integer",
      "description": "사용자 ID"
    },
    "items": {
      "type": "array",
      "items": {
        "$ref": "#/components/schemas/Product"
      }
    },
    "totalAmount": {
      "type": "number",
      "description": "총 금액"
    }
  },
  "required": ["orderId", "userId", "items", "totalAmount"]
}`,
    },
  ])

  const [createResourceForm, setCreateResourceForm] = useState({
    path: "",
    name: "",
    corsEnabled: false,
    corsSettings: {
      allowMethods: [] as string[],
      allowHeaders: "",
      allowOrigin: "*",
      exposeHeaders: "",
      maxAge: "",
      allowCredentials: false,
    },
  })

  const [corsForm, setCorsForm] = useState<CorsSettings>({
    allowMethods: [],
    allowHeaders: "",
    allowOrigin: "*",
    exposeHeaders: "",
    maxAge: "",
    allowCredentials: false,
  })

  // Method Detail States
  const [activeTab, setActiveTab] = useState("method-request")
  const [selectedFlowStep, setSelectedFlowStep] = useState("")

  // Test Tab States
  const [testSettings, setTestSettings] = useState({
    queryString: "",
    headers: "",
    requestBody: "",
    contentType: "application/json",
  })
  const [testResponse, setTestResponse] = useState<TestResponse | null>(null)
  const [isTestLoading, setIsTestLoading] = useState(false)

  // Available HTTP methods for CORS
  const httpMethods = ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"]

  // Request validators
  const requestValidators = [
    { value: "없음", label: "없음" },
    { value: "본문 검증", label: "본문 검증" },
    { value: "파라미터 검증", label: "파라미터 검증" },
    { value: "본문 및 파라미터 검증", label: "본문 및 파라미터 검증" },
  ]

  // Initialize edit form when method changes
  useEffect(() => {
    if (selectedMethod) {
      setEditForm({
        apiKeyRequired: selectedMethod.apiKey !== "-",
        sdkOperationName: selectedMethod.summary || "",
        requestValidator: selectedMethod.requestValidator || "없음",
      })

      // Initialize query parameters
      const queryParams =
        selectedMethod.parameters
          ?.filter((p: any) => p.in === "query")
          .map((p: any, index: number) => ({
            id: `query-${index}`,
            name: p.name,
            description: p.description || "",
            type: p.schema?.type || "string",
            required: p.required || false,
            cacheKey: false,
          })) || []
      setQueryParameters(queryParams)

      // Initialize request headers
      const headerParams =
        selectedMethod.parameters
          ?.filter((p: any) => p.in === "header")
          .map((p: any, index: number) => ({
            id: `header-${index}`,
            name: p.name,
            description: p.description || "",
            type: p.schema?.type || "string",
            required: p.required || false,
          })) || []

      // Add default Content-Type header if not exists
      const hasContentType = headerParams.some((h) => h.name.toLowerCase() === "content-type")
      if (!hasContentType) {
        headerParams.unshift({
          id: "content-type",
          name: "Content-Type",
          description: "요청 콘텐츠 타입",
          type: "string",
          required: true,
        })
      }
      setRequestHeaders(headerParams)

      // Initialize request body models
      if (selectedMethod.requestBody?.content) {
        const bodyModels = Object.entries(selectedMethod.requestBody.content).map(
          ([contentType, content]: [string, any], index: number) => ({
            id: `body-${index}`,
            contentType,
            modelName: content.schema?.$ref ? content.schema.$ref.split("/").pop() : "Empty",
            modelId: content.schema?.$ref ? content.schema.$ref.split("/").pop() : "",
          }),
        )
        setRequestBodyModels(bodyModels)
      } else {
        setRequestBodyModels([])
      }
    }
  }, [selectedMethod])

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
      corsSettings: createResourceForm.corsEnabled ? createResourceForm.corsSettings : undefined,
      methods: [],
    }

    setResources([...resources, newResource])
    setIsCreateModalOpen(false)
    setCreateResourceForm({
      path: "",
      name: "",
      corsEnabled: false,
      corsSettings: {
        allowMethods: [],
        allowHeaders: "",
        allowOrigin: "*",
        exposeHeaders: "",
        maxAge: "",
        allowCredentials: false,
      },
    })
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
    if (methodToDelete) {
      toast.success(`메서드 '${methodToDelete.type} ${methodToDelete.resourcePath}'이(가) 삭제되었습니다.`)
      setMethodToDelete(null)
      setIsMethodDeleteDialogOpen(false)
    }
  }

  const handleCreateMethod = () => {
    router.push(
      `/services/api-management/resources/methods?resourceId=${selectedResource.id}&resourcePath=${selectedResource.path}`,
    )
  }

  const handleMethodClick = (method: Method, resource: Resource) => {
    console.log(method, resource)
    setSelectedMethod(method)
    setSelectedResource(resource)
    setActiveTab("method-request")
    setIsEditMode(false)
  }

  const handleBackToResource = () => {
    setSelectedMethod(null)
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

  const handleCorsClick = () => {
    if (selectedResource.corsEnabled && selectedResource.corsSettings) {
      setCorsForm(selectedResource.corsSettings)
      setIsCorsModalOpen(true)
    }
  }

  const handleCorsUpdate = () => {
    // Update CORS settings logic here
    toast.success("CORS 설정이 업데이트되었습니다.")
    setIsCorsModalOpen(false)
  }

  const addCorsMethod = (method: string) => {
    if (!corsForm.allowMethods.includes(method)) {
      setCorsForm({
        ...corsForm,
        allowMethods: [...corsForm.allowMethods, method],
      })
    }
  }

  const removeCorsMethod = (method: string) => {
    setCorsForm({
      ...corsForm,
      allowMethods: corsForm.allowMethods.filter((m) => m !== method),
    })
  }

  const addCreateFormCorsMethod = (method: string) => {
    if (!createResourceForm.corsSettings.allowMethods.includes(method)) {
      setCreateResourceForm({
        ...createResourceForm,
        corsSettings: {
          ...createResourceForm.corsSettings,
          allowMethods: [...createResourceForm.corsSettings.allowMethods, method],
        },
      })
    }
  }

  const removeCreateFormCorsMethod = (method: string) => {
    setCreateResourceForm({
      ...createResourceForm,
      corsSettings: {
        ...createResourceForm.corsSettings,
        allowMethods: createResourceForm.corsSettings.allowMethods.filter((m) => m !== method),
      },
    })
  }

  const handleEditMethod = () => {
    setIsEditMode(true)
  }

  const handleSaveEdit = () => {
    setIsEditMode(false)
    toast.success("메서드 설정이 저장되었습니다.")
  }

  const handleCancelEdit = () => {
    setIsEditMode(false)
    // Reset form to original values
    if (selectedMethod) {
      setEditForm({
        apiKeyRequired: selectedMethod.apiKey !== "-",
        sdkOperationName: selectedMethod.summary || "",
        requestValidator: selectedMethod.requestValidator || "없음",
      })
    }
  }

  // Query Parameter functions
  const addQueryParameter = () => {
    const newParam: QueryParameter = {
      id: Date.now().toString(),
      name: "",
      description: "",
      type: "string",
      required: false,
      cacheKey: false,
    }
    setQueryParameters([...queryParameters, newParam])
  }

  const updateQueryParameter = (id: string, field: keyof QueryParameter, value: any) => {
    setQueryParameters(queryParameters.map((param) => (param.id === id ? { ...param, [field]: value } : param)))
  }

  const removeQueryParameter = (id: string) => {
    setQueryParameters(queryParameters.filter((param) => param.id !== id))
  }

  // Request Header functions
  const addRequestHeader = () => {
    const newHeader: RequestHeader = {
      id: Date.now().toString(),
      name: "",
      description: "",
      type: "string",
      required: false,
    }
    setRequestHeaders([...requestHeaders, newHeader])
  }

  const updateRequestHeader = (id: string, field: keyof RequestHeader, value: any) => {
    setRequestHeaders(requestHeaders.map((header) => (header.id === id ? { ...header, [field]: value } : header)))
  }

  const removeRequestHeader = (id: string) => {
    // Don't allow removing Content-Type header
    const header = requestHeaders.find((h) => h.id === id)
    if (header?.name === "Content-Type") {
      toast.error("Content-Type 헤더는 삭제할 수 없습니다.")
      return
    }
    setRequestHeaders(requestHeaders.filter((header) => header.id !== id))
  }

  // Request Body Model functions
  const addRequestBodyModel = () => {
    const newModel: RequestBodyModel = {
      id: Date.now().toString(),
      contentType: "application/json",
      modelName: "",
      modelId: "",
    }
    setRequestBodyModels([...requestBodyModels, newModel])
  }

  const updateRequestBodyModel = (id: string, field: keyof RequestBodyModel, value: any) => {
    setRequestBodyModels(requestBodyModels.map((model) => (model.id === id ? { ...model, [field]: value } : model)))
  }

  const removeRequestBodyModel = (id: string) => {
    setRequestBodyModels(requestBodyModels.filter((model) => model.id !== id))
  }

  // Model management functions
  const deleteModel = (modelId: string) => {
    setAvailableModels(availableModels.filter((model) => model.id !== modelId))
    // Also remove from request body models if used
    setRequestBodyModels(requestBodyModels.filter((model) => model.modelId !== modelId))
    toast.success("모델이 삭제되었습니다.")
  }

  type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" | "HEAD"

  function getMethodStyle(method: HttpMethod): string {
    console.log(method)
    const base = " font-medium font-mono text-xs px-2 py-1 rounded border"

    const styles: Record<HttpMethod, string> = {
      GET: `${base} bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-300 dark:border-green-500`,
      POST: `${base} bg-blue-100  dark:bg-blue-900/30  text-blue-700  dark:text-blue-300  border-blue-300  dark:border-blue-500`,
      PUT: `${base} bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-500`,
      DELETE: `${base} bg-red-100   dark:bg-red-900/30   text-red-700   dark:text-red-300   border-red-300   dark:border-red-500`,
      PATCH: `${base} bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-500`,
      OPTIONS: `${base} bg-gray-100  dark:bg-gray-900/30  text-gray-700  dark:text-gray-300  border-gray-300  dark:border-gray-500`,
      HEAD: `${base} bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-500`,
    }

    return styles[method] ?? base
  }

  const [selectedPath, setSelectedPath] = useState<string | null>(null)
  const [search, setSearch] = useState<string>("")

  const renderResourcePaths = Object.entries(mockData2?.spec?.paths)

  const renderResourceTree = () => {
    return (
      <div>
        {renderResourcePaths.map(([path, methods]) => {
          const isPathSelected = selectedPath === path && !selectedMethod
          console.log(path, methods)
          return (
            <div key={path}>
              <div
                className={`flex items-center gap-2 py-2 px-3 mb-1 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md ${
                  isPathSelected ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300" : ""
                }`}
                style={{ paddingLeft: `0` }}
                onClick={() => {
                  setSelectedPath(path)
                  setSelectedMethod(null)
                }}
              >
                {/* 폴더/아이콘 등은 없으므로 w-4로 맞춰줌 */}
                <div className="w-4" />
                <span className="font-mono font-medium">{path}</span>
              </div>
              {selectedPath === path && (
                <ul>
                  {Object.keys(methods).map((method) => {
                    const isMethodSelected = selectedMethod?.id === method
                    return (
                      <li
                        key={method}
                        className={`flex items-center gap-2 py-1 px-3 text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-green-900/20 rounded-md ${
                          isMethodSelected
                            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                            : "text-gray-600 dark:text-gray-400"
                        }`}
                        style={{ paddingLeft: `10px` }} // (level + 2) * 20 + 12, level=0
                        onClick={() => {
                          console.log((methods as any)[method])
                          // OpenAPI 객체를 Method 타입으로 변환
                          const openApiMethod = (methods as any)[method]
                          const convertedMethod: Method = {
                            id: `method-${path}-${method}`,
                            type: method.toUpperCase(),
                            permissions: openApiMethod["x-permissions"] || "-",
                            apiKey: openApiMethod["x-apiKeyId"] || "-",
                            resourcePath: path,
                            endpointUrl: (mockData2.spec.servers?.[0]?.url || "") + path,
                            summary: openApiMethod.summary || "",
                            description: openApiMethod.description || "",
                            parameters: openApiMethod.parameters || [],
                            requestBody: openApiMethod.requestBody || null,
                            responses: openApiMethod.responses || {},
                            security: openApiMethod.security || null,
                            requestValidator: "없음",
                          }
                          setSelectedMethod(convertedMethod)
                        }}
                      >
                        <div className="w-4" />
                        <span className={`${getMethodStyle(method?.toUpperCase() as HttpMethod)}`}>
                          {method.toUpperCase()}
                        </span>
                        <span>- {(methods as any)[method].summary}</span>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          )
        })}
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
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar - Resource Tree */}
          {/* 리소스 목록 */}
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

              {/* renderResourceTree */}
              <div className="space-y-1">{renderResourceTree()}</div>
            </div>
          </div>

          {/* Main Right Content */}
          <div className="col-span-9">
            <div ref={rightContentRef}>
              {selectedMethod ? (
                /* Method Detail View */
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  {/* Method Header */}
                  <div className="border-b border-gray-200 dark:border-gray-700 p-6">
                    <div className=" mb-4">
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
                          </div>
                        </div>
                        <div className="mt-2">
                          <div className="flex items-center gap-2  mb-2">
                            <div className="w-16 text-sm text-gray-600 dark:text-gray-400">메서드 ID</div>
                            <div className="font-mono text-sm">{selectedMethod.id}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-16 text-sm text-gray-600 dark:text-gray-400">URL</span>
                            <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded">
                              <code className="text-sm font-mono">{selectedMethod.endpointUrl}</code>
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
                            className={`bg-blue-100 dark:bg-blue-900/30 rounded-lg p-3 text-center cursor-pointer transition-all mb-2 ${
                              selectedFlowStep === "method-request" ? "bg-blue-200 dark:bg-blue-800 " : ""
                            }`}
                            onClick={() => handleFlowStepClick("method-request")}
                          >
                            <div className="text-xs font-medium text-blue-700 dark:text-blue-300">메서드 요청</div>
                          </div>

                          <div
                            className={`bg-blue-100 dark:bg-blue-900/30 rounded-lg p-3 text-center  cursor-pointer transition-all ${
                              selectedFlowStep === "method-response" ? "bg-blue-200 dark:bg-blue-800" : ""
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
                        {!isEditMode ? (
                          // View Mode
                          <>
                            {/* Method Request Settings */}
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">메서드 요청 설정</h3>
                                <Button variant="outline" size="sm" onClick={handleEditMethod}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  편집
                                </Button>
                              </div>

                              <div className="grid grid-cols-3 gap-6">
                                <div>
                                  <div className="space-y-3">
                                    <div>
                                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        API 키가 필요함
                                      </Label>
                                      <div className="mt-1 text-sm text-gray-900 dark:text-white">
                                        {selectedMethod.apiKey !== "-" ? "True" : "False"}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <div className="space-y-3">
                                    <div>
                                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        요청 검사기
                                      </Label>
                                      <div className="mt-1 text-sm text-gray-900 dark:text-white">
                                        {selectedMethod.requestValidator || "없음"}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <div className="space-y-3">
                                    <div>
                                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        SDK 작업 이름
                                      </Label>
                                      <div className="mt-1 text-sm text-gray-900 dark:text-white">
                                        {selectedMethod.summary || "메서드 및 경로에 따라 생성됨"}
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
                                  URL 쿼리 문자열 파라미터 ({queryParameters.length})
                                </h4>
                                <div className="flex items-center gap-2">
                                  <ChevronLeft className="h-4 w-4 text-gray-400" />
                                  <span className="text-sm text-gray-600 dark:text-gray-400">1</span>
                                  <ChevronRight className="h-4 w-4 text-gray-400" />
                                </div>
                              </div>
                              {queryParameters.length > 0 ? (
                                <div className="space-y-2">
                                  <div className="grid grid-cols-3 gap-4 text-sm font-medium text-gray-600 dark:text-gray-400 border-b pb-2">
                                    <div>이름</div>
                                    <div>필수</div>
                                    <div>캐싱</div>
                                  </div>
                                  {queryParameters.map((param) => (
                                    <div
                                      key={param.id}
                                      className="grid grid-cols-3 gap-4 p-3 bg-white dark:bg-gray-800 rounded border"
                                    >
                                      <div className="font-medium">{param.name}</div>
                                      <div className="text-sm">
                                        {param.required ? (
                                          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">True</Badge>
                                        ) : (
                                          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">False</Badge>
                                        )}
                                      </div>
                                      <div className="text-sm">
                                        <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
                                          {param.cacheKey ? "활성" : "비활성"}
                                        </Badge>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-center py-6">
                                  <p className="text-gray-500 dark:text-gray-400 mb-2">요청 쿼리 문자열 없음</p>
                                  <p className="text-sm text-gray-400 dark:text-gray-500">
                                    정의된 요청 쿼리 문자열이 없습니다
                                  </p>
                                </div>
                              )}
                            </div>

                            {/* HTTP Request Headers */}
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-4">
                                <h4 className="text-md font-semibold text-gray-900 dark:text-white">
                                  HTTP 요청 헤더 ({requestHeaders.length})
                                </h4>
                                <div className="flex items-center gap-2">
                                  <ChevronLeft className="h-4 w-4 text-gray-400" />
                                  <span className="text-sm text-gray-600 dark:text-gray-400">1</span>
                                  <ChevronRight className="h-4 w-4 text-gray-400" />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="grid grid-cols-3 gap-4 text-sm font-medium text-gray-600 dark:text-gray-400 border-b pb-2">
                                  <div>이름</div>
                                  <div>필수</div>
                                  <div>캐싱</div>
                                </div>
                                {requestHeaders.map((header) => (
                                  <div
                                    key={header.id}
                                    className="grid grid-cols-3 gap-4 p-3 bg-white dark:bg-gray-800 rounded border"
                                  >
                                    <div className="font-medium">{header.name}</div>
                                    <div className="text-sm">
                                      {header.required ? (
                                        <Badge className="bg-red-100 text-red-800 hover:bg-red-100">True</Badge>
                                      ) : (
                                        <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">False</Badge>
                                      )}
                                    </div>
                                    <div className="text-sm">
                                      <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">비활성</Badge>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Request Body */}
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-4">
                                <h4 className="text-md font-semibold text-gray-900 dark:text-white">
                                  요청 본문 ({requestBodyModels.length})
                                </h4>
                                <div className="flex items-center gap-2">
                                  <ChevronLeft className="h-4 w-4 text-gray-400" />
                                  <span className="text-sm text-gray-600 dark:text-gray-400">1</span>
                                  <ChevronRight className="h-4 w-4 text-gray-400" />
                                </div>
                              </div>
                              {requestBodyModels.length > 0 ? (
                                <div className="space-y-2">
                                  <div className="grid grid-cols-2 gap-4 text-sm font-medium text-gray-600 dark:text-gray-400 border-b pb-2">
                                    <div>콘텐츠 유형</div>
                                    <div>이름</div>
                                  </div>
                                  {requestBodyModels.map((model) => (
                                    <div
                                      key={model.id}
                                      className="grid grid-cols-2 gap-4 p-3 bg-white dark:bg-gray-800 rounded border"
                                    >
                                      <div className="font-medium">{model.contentType}</div>
                                      <div className="text-sm text-gray-600 dark:text-gray-400">
                                        {model.modelName || "Empty"}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-center py-6">
                                  <p className="text-gray-500 dark:text-gray-400 mb-2">요청 본문 없음</p>
                                  <p className="text-sm text-gray-400 dark:text-gray-500">
                                    정의된 요청 본문이 없습니다
                                  </p>
                                </div>
                              )}
                            </div>
                          </>
                        ) : (
                          // Edit Mode
                          <div className="space-y-6">
                            <div className="flex items-center justify-between">
                              <h3 className="text-lg font-bold text-gray-900 dark:text-white">메서드 요청 편집</h3>
                              <div className="flex gap-2">
                                <Button variant="outline" onClick={handleCancelEdit}>
                                  취소
                                </Button>
                                <Button onClick={handleSaveEdit} className="bg-blue-500 hover:bg-blue-600 text-white">
                                  저장
                                </Button>
                              </div>
                            </div>

                            {/* Method Request Settings Edit */}
                            <Card>
                              <CardHeader>
                                <CardTitle>메서드 요청 설정</CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <div className="grid grid-cols-3 gap-4">
                                  <div>
                                    <Label className="text-sm font-medium">API 키가 필요함</Label>
                                    <Switch
                                      checked={editForm.apiKeyRequired}
                                      onCheckedChange={(checked) =>
                                        setEditForm({ ...editForm, apiKeyRequired: checked })
                                      }
                                      className="mt-2"
                                    />
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">요청 검사기</Label>
                                    <Select
                                      value={editForm.requestValidator}
                                      onValueChange={(value) => setEditForm({ ...editForm, requestValidator: value })}
                                    >
                                      <SelectTrigger className="mt-2">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {requestValidators.map((validator) => (
                                          <SelectItem key={validator.value} value={validator.value}>
                                            {validator.label}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">SDK 작업 이름</Label>
                                    <Input
                                      value={editForm.sdkOperationName}
                                      onChange={(e) => setEditForm({ ...editForm, sdkOperationName: e.target.value })}
                                      placeholder="작업 이름을 입력하세요"
                                      className="mt-2"
                                    />
                                  </div>
                                </div>
                              </CardContent>
                            </Card>

                            {/* URL Query String Parameters Edit */}
                            <Card>
                              <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                  URL 쿼리 문자열 파라미터
                                  <Button
                                    size="sm"
                                    onClick={addQueryParameter}
                                    className="bg-blue-500 hover:bg-blue-600 text-white"
                                  >
                                    <Plus className="h-4 w-4 mr-1" />
                                    추가
                                  </Button>
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-3">
                                  {queryParameters.map((param) => (
                                    <div key={param.id} className="grid grid-cols-12 gap-3 items-center">
                                      <div className="col-span-3">
                                        <Input
                                          value={param.name}
                                          onChange={(e) => updateQueryParameter(param.id, "name", e.target.value)}
                                          placeholder="파라미터 이름"
                                        />
                                      </div>
                                      <div className="col-span-3">
                                        <Input
                                          value={param.description}
                                          onChange={(e) =>
                                            updateQueryParameter(param.id, "description", e.target.value)
                                          }
                                          placeholder="설명"
                                        />
                                      </div>
                                      <div className="col-span-2">
                                        <Select
                                          value={param.type}
                                          onValueChange={(value) => updateQueryParameter(param.id, "type", value)}
                                        >
                                          <SelectTrigger>
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="string">string</SelectItem>
                                            <SelectItem value="number">number</SelectItem>
                                            <SelectItem value="boolean">boolean</SelectItem>
                                            <SelectItem value="array">array</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div className="col-span-1 flex justify-center">
                                        <Switch
                                          checked={param.required}
                                          onCheckedChange={(checked) =>
                                            updateQueryParameter(param.id, "required", checked)
                                          }
                                        />
                                      </div>
                                      <div className="col-span-1 flex justify-center">
                                        <Switch
                                          checked={param.cacheKey}
                                          onCheckedChange={(checked) =>
                                            updateQueryParameter(param.id, "cacheKey", checked)
                                          }
                                        />
                                      </div>
                                      <div className="col-span-2 flex justify-end">
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => removeQueryParameter(param.id)}
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </div>
                                  ))}
                                  {queryParameters.length === 0 && (
                                    <div className="text-center py-6 text-gray-500">
                                      쿼리 파라미터가 없습니다. 추가 버튼을 클릭하여 새 파라미터를 추가하세요.
                                    </div>
                                  )}
                                </div>
                              </CardContent>
                            </Card>

                            {/* HTTP Request Headers Edit */}
                            <Card>
                              <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                  HTTP 요청 헤더
                                  <Button
                                    size="sm"
                                    onClick={addRequestHeader}
                                    className="bg-blue-500 hover:bg-blue-600 text-white"
                                  >
                                    <Plus className="h-4 w-4 mr-1" />
                                    추가
                                  </Button>
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-3">
                                  {requestHeaders.map((header) => (
                                    <div key={header.id} className="grid grid-cols-12 gap-3 items-center">
                                      <div className="col-span-4">
                                        <Input
                                          value={header.name}
                                          onChange={(e) => updateRequestHeader(header.id, "name", e.target.value)}
                                          placeholder="헤더 이름"
                                          disabled={header.name === "Content-Type"}
                                        />
                                      </div>
                                      <div className="col-span-4">
                                        <Input
                                          value={header.description}
                                          onChange={(e) =>
                                            updateRequestHeader(header.id, "description", e.target.value)
                                          }
                                          placeholder="설명"
                                        />
                                      </div>
                                      <div className="col-span-2">
                                        <Select
                                          value={header.type}
                                          onValueChange={(value) => updateRequestHeader(header.id, "type", value)}
                                        >
                                          <SelectTrigger>
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="string">string</SelectItem>
                                            <SelectItem value="number">number</SelectItem>
                                            <SelectItem value="boolean">boolean</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div className="col-span-1 flex justify-center">
                                        <Switch
                                          checked={header.required}
                                          onCheckedChange={(checked) =>
                                            updateRequestHeader(header.id, "required", checked)
                                          }
                                          disabled={header.name === "Content-Type"}
                                        />
                                      </div>
                                      <div className="col-span-1 flex justify-end">
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => removeRequestHeader(header.id)}
                                          disabled={header.name === "Content-Type"}
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </CardContent>
                            </Card>

                            {/* Request Body Edit */}
                            <Card>
                              <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                  요청 본문
                                  <Button
                                    size="sm"
                                    onClick={addRequestBodyModel}
                                    className="bg-blue-500 hover:bg-blue-600 text-white"
                                  >
                                    <Plus className="h-4 w-4 mr-1" />
                                    추가
                                  </Button>
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-3">
                                  {requestBodyModels.map((model) => (
                                    <div key={model.id} className="grid grid-cols-12 gap-3 items-center">
                                      <div className="col-span-4">
                                        <Select
                                          value={model.contentType}
                                          onValueChange={(value) =>
                                            updateRequestBodyModel(model.id, "contentType", value)
                                          }
                                        >
                                          <SelectTrigger>
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="application/json">application/json</SelectItem>
                                            <SelectItem value="application/xml">application/xml</SelectItem>
                                            <SelectItem value="text/plain">text/plain</SelectItem>
                                            <SelectItem value="application/x-www-form-urlencoded">
                                              application/x-www-form-urlencoded
                                            </SelectItem>
                                            <SelectItem value="multipart/form-data">multipart/form-data</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div className="col-span-4">
                                        <Input
                                          value={model.modelName}
                                          onChange={(e) =>
                                            updateRequestBodyModel(model.id, "modelName", e.target.value)
                                          }
                                          placeholder="모델 이름"
                                        />
                                      </div>
                                      <div className="col-span-3">
                                        <Select
                                          value={model.modelId}
                                          onValueChange={(value) => {
                                            const selectedModel = availableModels.find((m) => m.id === value)
                                            updateRequestBodyModel(model.id, "modelId", value)
                                            if (selectedModel) {
                                              updateRequestBodyModel(model.id, "modelName", selectedModel.name)
                                            }
                                          }}
                                        >
                                          <SelectTrigger>
                                            <SelectValue placeholder="모델 선택" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {availableModels.map((availableModel) => (
                                              <SelectItem key={availableModel.id} value={availableModel.id}>
                                                <div className="flex items-center justify-between w-full">
                                                  <span>{availableModel.name}</span>
                                                  <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={(e) => {
                                                      e.stopPropagation()
                                                      deleteModel(availableModel.id)
                                                    }}
                                                    className="ml-2 h-6 w-6 p-0 text-red-500 hover:text-red-700"
                                                  >
                                                    <Trash2 className="h-3 w-3" />
                                                  </Button>
                                                </div>
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div className="col-span-1 flex justify-end">
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => removeRequestBodyModel(model.id)}
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </div>
                                  ))}
                                  {requestBodyModels.length === 0 && (
                                    <div className="text-center py-6 text-gray-500">
                                      요청 본문이 없습니다. 추가 버튼을 클릭하여 새 요청 본문을 추가하세요.
                                    </div>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        )}
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
                        <div className="space-y-6">
                          {/* Request Section */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                <Send className="h-5 w-5" />
                                요청 설정
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                              {/* Method and URL */}
                              <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <span
                                  className={`px-3 py-1 rounded text-sm font-mono font-bold ${
                                    selectedMethod.type === "GET"
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
                                  {selectedMethod.endpointUrl}
                                </code>
                                <Button
                                  className="bg-orange-500 hover:bg-orange-600 text-white px-6"
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
                                      Send
                                    </>
                                  )}
                                </Button>
                              </div>

                              {/* Query Parameters */}
                              {selectedMethod.parameters?.filter((p: any) => p.in === "query").length > 0 && (
                                <div>
                                  <Label className="text-base font-medium text-gray-900 dark:text-white mb-3 block">
                                    Query Parameters
                                  </Label>
                                  <div className="space-y-2">
                                    {selectedMethod.parameters
                                      .filter((param: any) => param.in === "query")
                                      .map((param: any, index: number) => (
                                        <div key={param.name} className="grid grid-cols-12 gap-3 items-center">
                                          <div className="col-span-1 flex justify-center">
                                            <input
                                              type="checkbox"
                                              defaultChecked={param.required}
                                              className="rounded border-gray-300"
                                            />
                                          </div>
                                          <div className="col-span-3">
                                            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                              {param.name}
                                              {param.required && <span className="text-red-500 ml-1">*</span>}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                              {param.schema?.type || "string"}
                                            </div>
                                          </div>
                                          <div className="col-span-8">
                                            <Input placeholder={`Enter ${param.name}`} className="w-full" />
                                          </div>
                                        </div>
                                      ))}
                                  </div>
                                </div>
                              )}

                              {/* Path Parameters */}
                              {selectedMethod.parameters?.filter((p: any) => p.in === "path").length > 0 && (
                                <div>
                                  <Label className="text-base font-medium text-gray-900 dark:text-white mb-3 block">
                                    Path Parameters
                                  </Label>
                                  <div className="space-y-2">
                                    {selectedMethod.parameters
                                      .filter((param: any) => param.in === "path")
                                      .map((param: any) => (
                                        <div key={param.name} className="grid grid-cols-12 gap-3 items-center">
                                          <div className="col-span-1 flex justify-center">
                                            <input
                                              type="checkbox"
                                              defaultChecked={true}
                                              disabled
                                              className="rounded border-gray-300"
                                            />
                                          </div>
                                          <div className="col-span-3">
                                            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                              {param.name}
                                              <span className="text-red-500 ml-1">*</span>
                                            </div>
                                            <div className="text-xs text-gray-500">
                                              {param.schema?.type || "string"}
                                            </div>
                                          </div>
                                          <div className="col-span-8">
                                            <Input placeholder={`Enter ${param.name}`} className="w-full" required />
                                          </div>
                                        </div>
                                      ))}
                                  </div>
                                </div>
                              )}

                              {/* Headers */}
                              <div>
                                <Label className="text-base font-medium text-gray-900 dark:text-white mb-3 block">
                                  Headers
                                </Label>
                                <div className="space-y-2">
                                  {/* Common Headers */}
                                  <div className="grid grid-cols-12 gap-3 items-center">
                                    <div className="col-span-1 flex justify-center">
                                      <input
                                        type="checkbox"
                                        defaultChecked={selectedMethod.apiKey !== "-"}
                                        className="rounded border-gray-300"
                                      />
                                    </div>
                                    <div className="col-span-3">
                                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Authorization
                                      </div>
                                      <div className="text-xs text-gray-500">Authentication</div>
                                    </div>
                                    <div className="col-span-8">
                                      <Select>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select auth type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="bearer">Bearer Token</SelectItem>
                                          <SelectItem value="basic">Basic Auth</SelectItem>
                                          <SelectItem value="apikey">API Key</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-12 gap-3 items-center">
                                    <div className="col-span-1 flex justify-center">
                                      <input
                                        type="checkbox"
                                        defaultChecked={["POST", "PUT", "PATCH"].includes(selectedMethod.type)}
                                        className="rounded border-gray-300"
                                      />
                                    </div>
                                    <div className="col-span-3">
                                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Content-Type
                                      </div>
                                      <div className="text-xs text-gray-500">Media type</div>
                                    </div>
                                    <div className="col-span-8">
                                      <Select defaultValue="application/json">
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="application/json">application/json</SelectItem>
                                          <SelectItem value="application/xml">application/xml</SelectItem>
                                          <SelectItem value="text/plain">text/plain</SelectItem>
                                          <SelectItem value="application/x-www-form-urlencoded">
                                            application/x-www-form-urlencoded
                                          </SelectItem>
                                          <SelectItem value="multipart/form-data">multipart/form-data</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-12 gap-3 items-center">
                                    <div className="col-span-1 flex justify-center">
                                      <input type="checkbox" className="rounded border-gray-300" />
                                    </div>
                                    <div className="col-span-3">
                                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Accept</div>
                                      <div className="text-xs text-gray-500">Response type</div>
                                    </div>
                                    <div className="col-span-8">
                                      <Select>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select accept type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="application/json">application/json</SelectItem>
                                          <SelectItem value="application/xml">application/xml</SelectItem>
                                          <SelectItem value="text/html">text/html</SelectItem>
                                          <SelectItem value="*/*">*/*</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-12 gap-3 items-center">
                                    <div className="col-span-1 flex justify-center">
                                      <input type="checkbox" className="rounded border-gray-300" />
                                    </div>
                                    <div className="col-span-3">
                                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        User-Agent
                                      </div>
                                      <div className="text-xs text-gray-500">Client info</div>
                                    </div>
                                    <div className="col-span-8">
                                      <Select>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select user agent" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="postman">Postman Runtime/7.29.2</SelectItem>
                                          <SelectItem value="chrome">Mozilla/5.0 (Chrome)</SelectItem>
                                          <SelectItem value="firefox">Mozilla/5.0 (Firefox)</SelectItem>
                                          <SelectItem value="custom">Custom</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Request Body (for POST, PUT, PATCH) */}
                              {["POST", "PUT", "PATCH"].includes(selectedMethod.type) && (
                                <div>
                                  <Label className="text-base font-medium text-gray-900 dark:text-white mb-3 block">
                                    Request Body
                                  </Label>
                                  <div className="space-y-3">
                                    <div className="flex gap-2">
                                      <Button variant="outline" size="sm" className="bg-blue-50 text-blue-600">
                                        JSON
                                      </Button>
                                      <Button variant="outline" size="sm">
                                        XML
                                      </Button>
                                      <Button variant="outline" size="sm">
                                        Form Data
                                      </Button>
                                      <Button variant="outline" size="sm">
                                        Raw
                                      </Button>
                                    </div>
                                    <Textarea
                                      value={testSettings.requestBody}
                                      onChange={(e) =>
                                        setTestSettings({
                                          ...testSettings,
                                          requestBody: e.target.value,
                                        })
                                      }
                                      placeholder={`{
  "name": "John Doe",
  "email": "john@example.com"
}`}
                                      className="min-h-[150px] font-mono text-sm"
                                    />
                                  </div>
                                </div>
                              )}
                            </CardContent>
                          </Card>

                          {/* Response Section */}
                          {testResponse && (
                            <Card>
                              <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                  <FileText className="h-5 w-5" />
                                  응답 결과
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-4">
                                  {/* Status and Time */}
                                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <div className="flex items-center gap-4">
                                      <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium">Status:</span>
                                        <span
                                          className={`px-2 py-1 rounded text-sm font-mono ${
                                            testResponse.status >= 200 && testResponse.status < 300
                                              ? "bg-green-100 text-green-800"
                                              : testResponse.status >= 400
                                                ? "bg-red-100 text-red-800"
                                                : "bg-yellow-100 text-yellow-800"
                                          }`}
                                        >
                                          {testResponse.status} {testResponse.statusText}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium">Time:</span>
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                          {testResponse.responseTime}ms
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium">Size:</span>
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                          {new Blob([testResponse.body]).size} bytes
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Response Tabs */}
                                  <Tabs defaultValue="body" className="w-full">
                                    <TabsList className="grid w-full grid-cols-3">
                                      <TabsTrigger value="body">Body</TabsTrigger>
                                      <TabsTrigger value="headers">
                                        Headers ({Object.keys(testResponse.headers).length})
                                      </TabsTrigger>
                                      <TabsTrigger value="test-results">Test Results</TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="body" className="mt-4">
                                      <div className="space-y-2">
                                        <div className="flex gap-2">
                                          <Button variant="outline" size="sm" className="bg-blue-50 text-blue-600">
                                            Pretty
                                          </Button>
                                          <Button variant="outline" size="sm">
                                            Raw
                                          </Button>
                                          <Button variant="outline" size="sm">
                                            Preview
                                          </Button>
                                        </div>
                                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 max-h-96 overflow-auto">
                                          <pre className="text-sm font-mono text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                            {JSON.stringify(JSON.parse(testResponse.body), null, 2)}
                                          </pre>
                                        </div>
                                      </div>
                                    </TabsContent>

                                    <TabsContent value="headers" className="mt-4">
                                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                                        <div className="space-y-2">
                                          {Object.entries(testResponse.headers).map(([key, value]) => (
                                            <div
                                              key={key}
                                              className="grid grid-cols-3 gap-4 py-2 border-b border-gray-200 dark:border-gray-600 last:border-b-0"
                                            >
                                              <div className="font-medium text-sm text-gray-700 dark:text-gray-300">
                                                {key}
                                              </div>
                                              <div className="col-span-2 text-sm text-gray-600 dark:text-gray-400 font-mono">
                                                {value}
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </TabsContent>

                                    <TabsContent value="test-results" className="mt-4">
                                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                                        <div className="space-y-3">
                                          <div className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                            <span className="text-sm">Status code is 200</span>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                            <span className="text-sm">Response time is less than 2000ms</span>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                            <span className="text-sm">Content-Type header is present</span>
                                          </div>
                                        </div>
                                      </div>
                                    </TabsContent>
                                  </Tabs>
                                </div>
                              </CardContent>
                            </Card>
                          )}

                          {/* Empty State when no response */}
                          {!testResponse && (
                            <div className="text-center py-12 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                              <Code className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                              <p className="text-gray-500 dark:text-gray-400 mb-2">응답 대기 중</p>
                              <p className="text-sm text-gray-400 dark:text-gray-500">
                                Send 버튼을 클릭하여 API를 테스트하세요
                              </p>
                            </div>
                          )}
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
                        <div className="mt-1 text-sm font-mono text-gray-900 dark:text-gray-400">{mockData2?._id}</div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">경로</Label>
                        <div className="mt-1 text-lg font-mono text-gray-900 dark:text-white">
                          {selectedResource.path}
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">CORS 활성화 여부</Label>
                        <div className="mt-1 text-sm font-mono text-gray-600 dark:text-gray-400">
                          {selectedResource.corsEnabled ? (
                            <div
                              className="flex items-center gap-2 cursor-pointer hover:bg-green-50 dark:hover:bg-green-900/20 p-2 rounded transition-colors"
                              onClick={handleCorsClick}
                            >
                              <CheckCircle className="h-5 w-5 text-green-500" />
                              <span className="text-sm text-green-600 font-medium">active</span>
                              <Settings className="h-4 w-4 text-green-500 ml-1" />
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <XCircle className="h-5 w-5 text-red-500" />
                              <span className="text-sm text-red-600 font-medium">disabled</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Methods Section */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className={`text-lg font-semibold text-gray-900 dark:text-white`}>
                        메서드 ({selectedResource.methods.length})
                      </h3>
                      <div className="flex gap-2">
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
                            <TableHead>엔드포인트 URL</TableHead>
                            <TableHead className="w-[100px]">작업</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedResource.methods.map((method) => (
                            <TableRow
                              key={method.id}
                              className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                              <TableCell
                                onClick={() => {
                                  console.log(method)
                                  handleMethodClick(method, selectedResource)
                                }}
                              >
                                <span
                                  className={`${getMethodStyle(method.type.toUpperCase() as HttpMethod)} font-mono text-sm px-2 py-1 rounded`}
                                >
                                  {method.type}
                                </span>
                              </TableCell>
                              <TableCell onClick={() => handleMethodClick(method, selectedResource)}>
                                {method.permissions}
                              </TableCell>
                              <TableCell onClick={() => handleMethodClick(method, selectedResource)}>
                                {method.apiKey}
                              </TableCell>
                              <TableCell onClick={() => handleMethodClick(method, selectedResource)}>
                                <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                  {method.endpointUrl}
                                </code>
                              </TableCell>
                              <TableCell>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 bg-transparent"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setMethodToDelete(method)
                                    setIsMethodDeleteDialogOpen(true)
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TableCell>
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
      </div>

      {/* Create Resource Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-scroll">
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

            {/* CORS Settings - Only show when CORS is enabled */}
            {createResourceForm.corsEnabled && (
              <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4 space-y-4">
                <h4 className="font-medium text-blue-900 dark:text-blue-100">CORS 설정</h4>

                {/* Access-Control-Allow-Method */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Access-Control-Allow-Method
                  </Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {createResourceForm.corsSettings.allowMethods.map((method) => (
                      <Badge
                        key={method}
                        className={`${
                          method === "GET"
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : method === "POST"
                              ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                              : method === "HEAD"
                                ? "bg-purple-100 text-purple-800 hover:bg-purple-100"
                                : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                        } cursor-pointer`}
                        onClick={() => removeCreateFormCorsMethod(method)}
                      >
                        {method}
                        <X className="h-3 w-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                  <Select onValueChange={addCreateFormCorsMethod}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="메서드 추가" />
                    </SelectTrigger>
                    <SelectContent>
                      {httpMethods
                        .filter((method) => !createResourceForm.corsSettings.allowMethods.includes(method))
                        .map((method) => (
                          <SelectItem key={method} value={method}>
                            {method}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Access-Control-Allow-Headers */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Access-Control-Allow-Headers
                  </Label>
                  <Input
                    value={createResourceForm.corsSettings.allowHeaders}
                    onChange={(e) =>
                      setCreateResourceForm({
                        ...createResourceForm,
                        corsSettings: {
                          ...createResourceForm.corsSettings,
                          allowHeaders: e.target.value,
                        },
                      })
                    }
                    placeholder="content-type,x-ncp-apigw-api-key,x-ncp-apigw-timestamp"
                  />
                </div>

                {/* Access-Control-Allow-Origin */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Access-Control-Allow-Origin
                  </Label>
                  <Input
                    value={createResourceForm.corsSettings.allowOrigin}
                    onChange={(e) =>
                      setCreateResourceForm({
                        ...createResourceForm,
                        corsSettings: {
                          ...createResourceForm.corsSettings,
                          allowOrigin: e.target.value,
                        },
                      })
                    }
                    placeholder="*"
                  />
                </div>

                {/* Access-Control-Expose-Headers */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Access-Control-Expose-Headers
                  </Label>
                  <Input
                    value={createResourceForm.corsSettings.exposeHeaders}
                    onChange={(e) =>
                      setCreateResourceForm({
                        ...createResourceForm,
                        corsSettings: {
                          ...createResourceForm.corsSettings,
                          exposeHeaders: e.target.value,
                        },
                      })
                    }
                    placeholder="헤더 이름들을 쉼표로 구분"
                  />
                </div>

                {/* Access-Control-Max-Age */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Access-Control-Max-Age
                  </Label>
                  <Input
                    value={createResourceForm.corsSettings.maxAge}
                    onChange={(e) =>
                      setCreateResourceForm({
                        ...createResourceForm,
                        corsSettings: {
                          ...createResourceForm.corsSettings,
                          maxAge: e.target.value,
                        },
                      })
                    }
                    placeholder="86400"
                  />
                </div>

                {/* Access-Control-Allow-Credentials */}
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Access-Control-Allow-Credentials
                  </Label>
                  <Switch
                    checked={createResourceForm.corsSettings.allowCredentials}
                    onCheckedChange={(checked) =>
                      setCreateResourceForm({
                        ...createResourceForm,
                        corsSettings: {
                          ...createResourceForm.corsSettings,
                          allowCredentials: checked,
                        },
                      })
                    }
                  />
                </div>
              </div>
            )}
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
                  corsSettings: {
                    allowMethods: [],
                    allowHeaders: "",
                    allowOrigin: "*",
                    exposeHeaders: "",
                    maxAge: "",
                    allowCredentials: false,
                  },
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

      {/* CORS Settings Modal */}
      <Dialog open={isCorsModalOpen} onOpenChange={setIsCorsModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-blue-600 flex items-center gap-2">
              <Globe className="h-5 w-5" />
              CORS 설정
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Access-Control-Allow-Method */}
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Access-Control-Allow-Method
              </Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {corsForm.allowMethods.map((method) => (
                  <Badge
                    key={method}
                    className={`${
                      method === "GET"
                        ? "bg-green-100 text-green-800 hover:bg-green-100"
                        : method === "POST"
                          ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                          : method === "HEAD"
                            ? "bg-purple-100 text-purple-800 hover:bg-purple-100"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                    } cursor-pointer`}
                    onClick={() => removeCorsMethod(method)}
                  >
                    {method}
                    <X className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
              </div>
              <Select onValueChange={addCorsMethod}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="메서드 추가" />
                </SelectTrigger>
                <SelectContent>
                  {httpMethods
                    .filter((method) => !corsForm.allowMethods.includes(method))
                    .map((method) => (
                      <SelectItem key={method} value={method}>
                        {method}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* Access-Control-Allow-Headers */}
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Access-Control-Allow-Headers
              </Label>
              <Input
                value={corsForm.allowHeaders}
                onChange={(e) => setCorsForm({ ...corsForm, allowHeaders: e.target.value })}
                placeholder="content-type,x-ncp-apigw-api-key,x-ncp-apigw-timestamp"
              />
            </div>

            {/* Access-Control-Allow-Origin */}
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Access-Control-Allow-Origin
              </Label>
              <Input
                value={corsForm.allowOrigin}
                onChange={(e) => setCorsForm({ ...corsForm, allowOrigin: e.target.value })}
                placeholder="*"
              />
            </div>

            {/* Access-Control-Expose-Headers */}
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Access-Control-Expose-Headers
              </Label>
              <Input
                value={corsForm.exposeHeaders}
                onChange={(e) => setCorsForm({ ...corsForm, exposeHeaders: e.target.value })}
                placeholder="헤더 이름들을 쉼표로 구분"
              />
            </div>

            {/* Access-Control-Max-Age */}
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Access-Control-Max-Age
              </Label>
              <Input
                value={corsForm.maxAge}
                onChange={(e) => setCorsForm({ ...corsForm, maxAge: e.target.value })}
                placeholder="86400"
              />
            </div>

            {/* Access-Control-Allow-Credentials */}
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Access-Control-Allow-Credentials
              </Label>
              <Switch
                checked={corsForm.allowCredentials}
                onChange={(checked) => setCorsForm({ ...corsForm, allowCredentials: checked })}
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsCorsModalOpen(false)}>
              취소
            </Button>
            <Button onClick={handleCorsUpdate} className="bg-blue-500 hover:bg-blue-600 text-white">
              저장
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
                      {methodToDelete?.type} {methodToDelete?.resourcePath}
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
                  </ul>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteMethod} className="bg-red-600 hover:bg-red-700 text-white">
              삭제하기
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  )
}
