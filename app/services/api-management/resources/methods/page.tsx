"use client"

import { AppLayout } from "@/components/layout/AppLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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
  ChevronDown,
  ChevronRight,
  Globe,
  Box,
  Plus,
  Trash2,
  AlertCircle,
  Key,
  CheckCircle,
} from "lucide-react"
import { useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { toast } from "sonner"

interface QueryParameter {
  id: string
  name: string
  description: string
  type: string
  isArray: boolean
  required: boolean
  cacheKey: boolean
}

interface Header {
  id: string
  name: string
  description: string
  type: string
  required: boolean
}

interface FormData {
  id: string
  name: string
  description: string
  type: string
  isArray: boolean
  required: boolean
}

interface BodyModel {
  id: string
  name: string
  description: string
  model: string
}

interface MockHeader {
  id: string
  name: string
  value: string
}

interface ApiKey {
  id: string
  name: string
  description: string
  value: string
}

export default function CreateMethodPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const resourceId = searchParams.get("resourceId")
  const resourcePath = searchParams.get("resourcePath")

  const [methodForm, setMethodForm] = useState({
    methodType: "",
    integrationType: "http",
    // HTTP Integration
    httpProxyIntegration: true,
    httpMethod: "",
    endpointUrl: "",
    customEndpointUrl: "",
    contentHandling: "패스스루",
    timeout: "29000",
    // Mock Integration
    statusCode: "200",
    mockResponse: "",
    // Common
    authorization: "없음",
    requestValidator: "없음",
    apiKeyRequired: false,
    selectedApiKey: "",
    operationName: "GetPets",
  })

  const [mockHeaders, setMockHeaders] = useState<MockHeader[]>([{ id: "1", name: "", value: "" }])

  const [apiKeys] = useState<ApiKey[]>([
    {
      id: "1",
      name: "Production API Key",
      description: "프로덕션 환경용 API 키",
      value: "prod-api-key-123",
    },
    {
      id: "2",
      name: "Development API Key",
      description: "개발 환경용 API 키",
      value: "dev-api-key-456",
    },
    {
      id: "3",
      name: "Test API Key",
      description: "테스트 환경용 API 키",
      value: "test-api-key-789",
    },
  ])

  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false)
  const [showCustomUrlInput, setShowCustomUrlInput] = useState(false)

  // 기본값을 모두 false로 설정 (닫힌 상태)
  const [openSections, setOpenSections] = useState({
    methodRequest: false,
    urlQuery: false,
    httpHeaders: false,
    requestBody: false,
  })

  const [queryParameters, setQueryParameters] = useState<QueryParameter[]>([
    {
      id: "1",
      name: "",
      description: "",
      type: "string",
      isArray: false,
      required: false,
      cacheKey: false,
    },
  ])

  const [headers, setHeaders] = useState<Header[]>([
    {
      id: "1",
      name: "",
      description: "",
      type: "string",
      required: false,
    },
  ])

  const [formData, setFormData] = useState<FormData[]>([
    {
      id: "1",
      name: "",
      description: "",
      type: "string",
      isArray: false,
      required: false,
    },
  ])

  const [bodyModels, setBodyModels] = useState<BodyModel[]>([
    {
      id: "1",
      name: "",
      description: "",
      model: "",
    },
  ])

  const [contentTypes, setContentTypes] = useState<string[]>([])
  const [newContentType, setNewContentType] = useState("")
  const [contentTypeError, setContentTypeError] = useState("")

  // HTTP Method options
  const httpMethods = ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"]

  // Predefined endpoint URLs
  const endpointUrls = [
    "https://api.endpoint.com/",
    "https://jsonplaceholder.typicode.com/",
    "https://httpbin.org/",
    "https://reqres.in/api/",
    "https://api.github.com/",
  ]

  const handleBack = () => {
    router.push(`/services/api-management/resources?resourceId=${resourceId}`)
  }

  const handleCreateMethod = () => {
    if (!methodForm.methodType) {
      toast.error("메서드 유형을 선택해주세요.")
      return
    }

    if (methodForm.integrationType === "http" && !methodForm.httpMethod) {
      toast.error("HTTP 메서드를 선택해주세요.")
      return
    }

    if (methodForm.integrationType === "http") {
      const finalUrl = showCustomUrlInput ? methodForm.customEndpointUrl : methodForm.endpointUrl
      if (!finalUrl) {
        toast.error("엔드포인트 URL을 입력해주세요.")
        return
      }
    }

    // 실제 저장 로직 구현
    const methodData = {
      ...methodForm,
      finalEndpointUrl: showCustomUrlInput ? methodForm.customEndpointUrl : methodForm.endpointUrl,
      queryParameters: queryParameters.filter((param) => param.name),
      headers: headers.filter((header) => header.name),
      formData: formData.filter((data) => data.name),
      bodyModels: bodyModels.filter((model) => model.name),
      contentTypes,
      mockHeaders: mockHeaders.filter((header) => header.name),
    }

    console.log("Saving method data:", methodData)

    toast.success("메서드가 성공적으로 생성되었습니다.")
    handleBack()
  }

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const handleApiKeyToggle = (checked: boolean) => {
    if (checked) {
      setIsApiKeyModalOpen(true)
    } else {
      setMethodForm({
        ...methodForm,
        apiKeyRequired: false,
        selectedApiKey: "",
      })
    }
  }

  const handleApiKeySelect = (apiKeyId: string) => {
    setMethodForm({
      ...methodForm,
      apiKeyRequired: true,
      selectedApiKey: apiKeyId,
    })
    setIsApiKeyModalOpen(false)
    toast.success("API 키가 선택되었습니다.")
  }

  const handleApiKeyModalCancel = () => {
    setMethodForm({ ...methodForm, apiKeyRequired: false, selectedApiKey: "" })
    setIsApiKeyModalOpen(false)
  }

  const handleEndpointUrlChange = (value: string) => {
    if (value === "custom") {
      setShowCustomUrlInput(true)
      setMethodForm({ ...methodForm, endpointUrl: "" })
    } else {
      setShowCustomUrlInput(false)
      setMethodForm({ ...methodForm, endpointUrl: value, customEndpointUrl: "" })
    }
  }

  const addMockHeader = () => {
    const newHeader: MockHeader = {
      id: Date.now().toString(),
      name: "",
      value: "",
    }
    setMockHeaders([...mockHeaders, newHeader])
  }

  const updateMockHeader = (id: string, field: keyof MockHeader, value: string) => {
    setMockHeaders(mockHeaders.map((header) => (header.id === id ? { ...header, [field]: value } : header)))
  }

  const removeMockHeader = (id: string) => {
    if (mockHeaders.length > 1) {
      setMockHeaders(mockHeaders.filter((header) => header.id !== id))
    }
  }

  const addQueryParameter = () => {
    const newParam: QueryParameter = {
      id: Date.now().toString(),
      name: "",
      description: "",
      type: "string",
      isArray: false,
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

  const addHeader = () => {
    const newHeader: Header = {
      id: Date.now().toString(),
      name: "",
      description: "",
      type: "string",
      required: false,
    }
    setHeaders([...headers, newHeader])
  }

  const updateHeader = (id: string, field: keyof Header, value: any) => {
    setHeaders(headers.map((header) => (header.id === id ? { ...header, [field]: value } : header)))
  }

  const removeHeader = (id: string) => {
    setHeaders(headers.filter((header) => header.id !== id))
  }

  const addFormData = () => {
    const newFormData: FormData = {
      id: Date.now().toString(),
      name: "",
      description: "",
      type: "string",
      isArray: false,
      required: false,
    }
    setFormData([...formData, newFormData])
  }

  const updateFormData = (id: string, field: keyof FormData, value: any) => {
    setFormData(formData.map((data) => (data.id === id ? { ...data, [field]: value } : data)))
  }

  const removeFormData = (id: string) => {
    setFormData(formData.filter((data) => data.id !== id))
  }

  const addBodyModel = () => {
    const newModel: BodyModel = {
      id: Date.now().toString(),
      name: "",
      description: "",
      model: "",
    }
    setBodyModels([...bodyModels, newModel])
  }

  const updateBodyModel = (id: string, field: keyof BodyModel, value: any) => {
    setBodyModels(bodyModels.map((model) => (model.id === id ? { ...model, [field]: value } : model)))
  }

  const removeBodyModel = (id: string) => {
    setBodyModels(bodyModels.filter((model) => model.id !== id))
  }

  const addContentType = () => {
    if (!newContentType.trim()) {
      setContentTypeError("필수 입력값입니다.")
      return
    }
    setContentTypes([...contentTypes, newContentType])
    setNewContentType("")
    setContentTypeError("")
  }

  const removeContentType = (index: number) => {
    setContentTypes(contentTypes.filter((_, i) => i !== index))
  }

  const IntegrationIcon = ({ type }: { type: string }) => {
    switch (type) {
      case "http":
        return <Globe className="h-8 w-8 text-blue-500" />
      case "mock":
        return <Box className="h-8 w-8 text-purple-500" />
      default:
        return <Box className="h-8 w-8 text-gray-500" />
    }
  }

  // Get selected API key info
  const selectedApiKeyInfo = apiKeys.find((key) => key.id === methodForm.selectedApiKey)

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
              <BreadcrumbLink href="/services/api-management/resources">리소스</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>메서드 생성</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">
                메서드 생성
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                리소스: <span className="font-mono text-blue-600">{resourcePath}</span>
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleBack}>
              취소
            </Button>
            <Button onClick={handleCreateMethod} className="bg-orange-500 hover:bg-orange-600 text-white">
              저장
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* Left Panel - Method Creation Form */}
          <div className="space-y-6">
            <Card>
              <div className="pt-4"></div>
              <CardContent className="space-y-6">
                {/* Method Details */}
                <div>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="method-type" className="text-[16px] font-semibold mb-4">
                        메서드 유형
                      </Label>
                      <Select
                        value={methodForm.methodType}
                        onValueChange={(value) => setMethodForm({ ...methodForm, methodType: value })}
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="메서드 유형 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="GET">GET</SelectItem>
                          <SelectItem value="POST">POST</SelectItem>
                          <SelectItem value="PUT">PUT</SelectItem>
                          <SelectItem value="DELETE">DELETE</SelectItem>
                          <SelectItem value="PATCH">PATCH</SelectItem>
                          <SelectItem value="OPTIONS">OPTIONS</SelectItem>
                          <SelectItem value="HEAD">HEAD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Integration Type */}
                <div>
                  <h3 className="text-[16px] font-semibold mb-4">통합 유형</h3>
                  <RadioGroup
                    value={methodForm.integrationType}
                    onValueChange={(value) => setMethodForm({ ...methodForm, integrationType: value })}
                    className="space-y-4"
                  >
                    {/* HTTP */}
                    <div
                      className={`border rounded-lg p-4 transition-all ${methodForm.integrationType === "http"
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                        : "border-gray-200 hover:border-gray-300"
                        }`}
                    >
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="http" id="http" />
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <IntegrationIcon type="http" />
                            <div>
                              <Label htmlFor="http" className="text-base font-medium cursor-pointer">
                                HTTP
                              </Label>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                기존 HTTP 엔드포인트와 통합합니다.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Mock */}
                    <div
                      className={`border rounded-lg p-4 transition-all ${methodForm.integrationType === "mock"
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                        : "border-gray-200 hover:border-gray-300"
                        }`}
                    >
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="mock" id="mock" />
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <IntegrationIcon type="mock" />
                            <div>
                              <Label htmlFor="mock" className="text-base font-medium cursor-pointer">
                                Mock
                              </Label>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                API Gateway 내에서 모의 응답을 생성하여 응답을 생성합니다.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                {/* HTTP Configuration */}
                {methodForm.integrationType === "http" && (
                  <div className="space-y-6">
                    {/* API Key Toggle */}
                    <div className="border border-blue-200 rounded-lg p-4 bg-blue-50 dark:bg-blue-950/20">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <Label className="text-sm font-medium flex items-center gap-2">
                            <Key className="h-4 w-4" />
                            API 키가 필요함
                          </Label>
                          <p className="text-xs text-gray-500 mt-1">API 키 인증을 활성화합니다</p>
                        </div>
                        <Switch checked={methodForm.apiKeyRequired} onCheckedChange={handleApiKeyToggle} />
                      </div>

                      {/* Selected API Key Info - More Prominent Display */}
                      {methodForm.selectedApiKey && selectedApiKeyInfo && (
                        <div className="mt-4 p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 rounded-lg">
                          <div className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-semibold text-green-900 dark:text-green-100">선택된 API 키</h4>
                                <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs rounded-full font-medium">
                                  활성화됨
                                </span>
                              </div>
                              <p className="font-medium text-gray-900 dark:text-white mb-1">
                                {selectedApiKeyInfo.name}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                {selectedApiKeyInfo.description}
                              </p>
                              <div className="bg-white dark:bg-gray-800 p-2 rounded border">
                                <p className="text-xs font-mono text-gray-700 dark:text-gray-300">
                                  {selectedApiKeyInfo.value}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Endpoint URL */}
                    <div>
                      <Label className="text-[16px] font-semibold mb-4">엔드포인트 URL</Label>
                      {!showCustomUrlInput ? (
                        <Select value={methodForm.endpointUrl} onValueChange={handleEndpointUrlChange}>
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="엔드포인트 URL 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            {endpointUrls.map((url) => (
                              <SelectItem key={url} value={url}>
                                {url}
                              </SelectItem>
                            ))}
                            <SelectItem value="custom">
                              <div className="flex items-center gap-2">
                                <Plus className="h-4 w-4" />
                                직접 입력
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="mt-2 space-y-2">
                          <div className="flex gap-2">
                            <Input
                              placeholder="https://your-api-endpoint.com/"
                              value={methodForm.customEndpointUrl}
                              onChange={(e) =>
                                setMethodForm({
                                  ...methodForm,
                                  customEndpointUrl: e.target.value,
                                })
                              }
                              className="flex-1"
                            />
                            <Button
                              variant="outline"
                              onClick={() => {
                                setShowCustomUrlInput(false)
                                setMethodForm({
                                  ...methodForm,
                                  customEndpointUrl: "",
                                  endpointUrl: "",
                                })
                              }}
                            >
                              취소
                            </Button>
                          </div>
                          <p className="text-xs text-gray-500">직접 엔드포인트 URL을 입력하세요</p>
                        </div>
                      )}
                    </div>

                    {/* 요청 검사기 */}
                    <div>
                      <Label className="text-[16px] font-semibold mb-4m">요청 검사기</Label>
                      <Select
                        value={methodForm.requestValidator}
                        onValueChange={(value) =>
                          setMethodForm({
                            ...methodForm,
                            requestValidator: value,
                          })
                        }
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="없음">없음</SelectItem>
                          <SelectItem value="본문 검증">본문 검증</SelectItem>
                          <SelectItem value="파라미터 검증">파라미터 검증</SelectItem>
                          <SelectItem value="본문 및 파라미터 검증">본문 및 파라미터 검증</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {/* Mock Configuration */}
                {methodForm.integrationType === "mock" && (
                  <div className="space-y-6">
                    {/* Status Code */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Label className="text-base font-medium">Status Code</Label>
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      </div>
                      <Input
                        value={methodForm.statusCode}
                        onChange={(e) =>
                          setMethodForm({
                            ...methodForm,
                            statusCode: e.target.value,
                          })
                        }
                        className="w-full"
                        placeholder="200"
                      />
                    </div>

                    {/* Header */}
                    <div>
                      <Label className="text-base font-medium mb-3 block">Header</Label>
                      <div className="space-y-3">
                        {mockHeaders.map((header, index) => (
                          <div key={header.id} className="flex gap-3 items-center">
                            <div className="flex-1">
                              <Input
                                value={header.name}
                                onChange={(e) => updateMockHeader(header.id, "name", e.target.value)}
                                placeholder="이름"
                              />
                            </div>
                            <div className="flex-1">
                              <Input
                                value={header.value}
                                onChange={(e) => updateMockHeader(header.id, "value", e.target.value)}
                                placeholder="값"
                              />
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2"
                                onClick={addMockHeader}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                              {mockHeaders.length > 1 && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => removeMockHeader(header.id)}
                                  className="px-2 py-2"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Response */}
                    <div>
                      <Label className="text-base font-medium mb-3 block">Response</Label>
                      <div className="relative">
                        <Textarea
                          value={methodForm.mockResponse}
                          onChange={(e) =>
                            setMethodForm({
                              ...methodForm,
                              mockResponse: e.target.value,
                            })
                          }
                          placeholder="응답 데이터를 입력하세요"
                          className="min-h-[120px] resize-none"
                          maxLength={1500}
                        />
                        <div className="absolute bottom-2 right-2 text-xs text-gray-500">
                          {methodForm.mockResponse.length}/1500 자
                        </div>
                      </div>
                    </div>

                    {/* API Key Toggle for Mock */}
                    <div className="border border-blue-200 rounded-lg p-4 bg-blue-50 dark:bg-blue-950/20">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <Label className="text-sm font-medium flex items-center gap-2">
                            <Key className="h-4 w-4" />
                            API 키가 필요함
                          </Label>
                          <p className="text-xs text-gray-500 mt-1">API 키 인증을 활성화합니다</p>
                        </div>
                        <Switch checked={methodForm.apiKeyRequired} onCheckedChange={handleApiKeyToggle} />
                      </div>

                      {/* Selected API Key Info for Mock */}
                      {methodForm.selectedApiKey && selectedApiKeyInfo && (
                        <div className="mt-4 p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 rounded-lg">
                          <div className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-semibold text-green-900 dark:text-green-100">선택된 API 키</h4>
                                <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs rounded-full font-medium">
                                  활성화됨
                                </span>
                              </div>
                              <p className="font-medium text-gray-900 dark:text-white mb-1">
                                {selectedApiKeyInfo.name}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                {selectedApiKeyInfo.description}
                              </p>
                              <div className="bg-white dark:bg-gray-800 p-2 rounded border">
                                <p className="text-xs font-mono text-gray-700 dark:text-gray-300">
                                  {selectedApiKeyInfo.value}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Endpoint URL for Mock */}
                    <div>
                      <Label className="text-base font-medium">엔드포인트 URL</Label>
                      {!showCustomUrlInput ? (
                        <Select value={methodForm.endpointUrl} onValueChange={handleEndpointUrlChange}>
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="엔드포인트 URL 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            {endpointUrls.map((url) => (
                              <SelectItem key={url} value={url}>
                                {url}
                              </SelectItem>
                            ))}
                            <SelectItem value="custom">
                              <div className="flex items-center gap-2">
                                <Plus className="h-4 w-4" />
                                직접 입력
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="mt-2 space-y-2">
                          <div className="flex gap-2">
                            <Input
                              placeholder="https://your-api-endpoint.com/"
                              value={methodForm.customEndpointUrl}
                              onChange={(e) =>
                                setMethodForm({
                                  ...methodForm,
                                  customEndpointUrl: e.target.value,
                                })
                              }
                              className="flex-1"
                            />
                            <Button
                              variant="outline"
                              onClick={() => {
                                setShowCustomUrlInput(false)
                                setMethodForm({
                                  ...methodForm,
                                  customEndpointUrl: "",
                                  endpointUrl: "",
                                })
                              }}
                            >
                              취소
                            </Button>
                          </div>
                          <p className="text-xs text-gray-500">직접 엔드포인트 URL을 입력하세요</p>
                        </div>
                      )}
                    </div>

                    {/* 요청 검사기 for Mock */}
                    <div>
                      <Label className="text-sm font-medium">요청 검사기</Label>
                      <Select
                        value={methodForm.requestValidator}
                        onValueChange={(value) =>
                          setMethodForm({
                            ...methodForm,
                            requestValidator: value,
                          })
                        }
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="없음">없음</SelectItem>
                          <SelectItem value="본문 검증">본문 검증</SelectItem>
                          <SelectItem value="파라미터 검증">파라미터 검증</SelectItem>
                          <SelectItem value="본문 및 파라미터 검증">본문 및 파라미터 검증</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Collapsible Sections */}
          <div className="space-y-4">
            {/* URL Query String Parameters */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <Collapsible open={openSections.urlQuery} onOpenChange={() => toggleSection("urlQuery")}>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between p-4 h-auto bg-green-50 hover:bg-green-100 dark:bg-green-950/20 dark:hover:bg-green-950/30 border-0 rounded-none"
                  >
                    <span className="text-lg font-semibold text-green-900 dark:text-green-100">
                      URL 쿼리 문자열 파라미터
                    </span>
                    {openSections.urlQuery ? (
                      <ChevronDown className="h-5 w-5 text-green-700" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-green-700" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="p-6 bg-white dark:bg-gray-900">
                    <div className="space-y-4">
                      <div className=" dark:bg-blue-950/20 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-900 dark:text-blue-100 mb-3">쿼리 스트링</h4>

                        {queryParameters.map((param, index) => (
                          <div key={param.id} className="grid grid-cols-12 gap-3 items-center mb-3">
                            <div className="col-span-2">
                              <Input
                                placeholder="이름"
                                value={param.name}
                                onChange={(e) => updateQueryParameter(param.id, "name", e.target.value)}
                                className={param.name === "" ? "border-red-300" : ""}
                              />
                            </div>
                            <div className="col-span-3">
                              <Input
                                placeholder="설명"
                                value={param.description}
                                onChange={(e) => updateQueryParameter(param.id, "description", e.target.value)}
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
                              <div className="flex items-center space-x-2">
                                <Label className="text-xs">Array</Label>
                                <Switch
                                  checked={param.isArray}
                                  onCheckedChange={(checked) => updateQueryParameter(param.id, "isArray", checked)}
                                  size="sm"
                                />
                              </div>
                            </div>
                            <div className="col-span-1 flex justify-center">
                              <div className="flex items-center space-x-2">
                                <Label className="text-xs">Required</Label>
                                <Switch
                                  checked={param.required}
                                  onCheckedChange={(checked) => updateQueryParameter(param.id, "required", checked)}
                                  size="sm"
                                />
                              </div>
                            </div>
                            <div className="col-span-3 flex gap-2 justify-end">
                              <Button
                                size="sm"
                                className="bg-blue-500 hover:bg-blue-600 text-white"
                                onClick={addQueryParameter}
                              >
                                <Plus className="h-4 w-4 mr-1" />
                                추가
                              </Button>
                              {queryParameters.length > 1 && (
                                <Button size="sm" variant="outline" onClick={() => removeQueryParameter(param.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}

                        {queryParameters.some((param) => param.name === "") && (
                          <div className="flex items-center gap-2 text-red-600 text-sm mt-2">
                            <AlertCircle className="h-4 w-4" />
                            <span>이름은 비워둘 수 없습니다.</span>
                          </div>
                        )}
                      </div>

                      {/* <Button
                        variant="outline"
                        className="text-blue-600 border-blue-300 hover:bg-blue-50 bg-transparent"
                        onClick={addQueryParameter}
                      >
                        쿼리 문자열 추가
                      </Button> */}
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>

            {/* HTTP Request Headers */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <Collapsible open={openSections.httpHeaders} onOpenChange={() => toggleSection("httpHeaders")}>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between p-4 h-auto bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/20 dark:hover:bg-purple-950/30 border-0 rounded-none"
                  >
                    <span className="text-lg font-semibold text-purple-900 dark:text-purple-100">HTTP 요청 헤더</span>
                    {openSections.httpHeaders ? (
                      <ChevronDown className="h-5 w-5 text-purple-700" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-purple-700" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="p-6 bg-white dark:bg-gray-900">
                    <div className="space-y-4">
                      <div className="dark:bg-green-950/20 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-900 dark:text-green-100 mb-3">헤더</h4>

                        {headers.map((header, index) => (
                          <div key={header.id} className="grid grid-cols-12 gap-3 items-center mb-3">
                            <div className="col-span-3">
                              <Input
                                placeholder="이름"
                                value={header.name}
                                onChange={(e) => updateHeader(header.id, "name", e.target.value)}
                              />
                            </div>
                            <div className="col-span-4">
                              <Input
                                placeholder="설명"
                                value={header.description}
                                onChange={(e) => updateHeader(header.id, "description", e.target.value)}
                              />
                            </div>
                            <div className="col-span-2">
                              <Select
                                value={header.type}
                                onValueChange={(value) => updateHeader(header.id, "type", value)}
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
                              <div className="flex items-center space-x-2">
                                <Label className="text-xs">Required</Label>
                                <Switch
                                  checked={header.required}
                                  onCheckedChange={(checked) => updateHeader(header.id, "required", checked)}
                                  size="sm"
                                />
                              </div>
                            </div>
                            <div className="col-span-2 flex gap-2 justify-end">
                              <Button
                                size="sm"
                                className="bg-blue-500 hover:bg-blue-600 text-white"
                                onClick={addHeader}
                              >
                                <Plus className="h-4 w-4 mr-1" />
                                추가
                              </Button>
                              {headers.length > 1 && (
                                <Button size="sm" variant="outline" onClick={() => removeHeader(header.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>

            {/* Request Body */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <Collapsible open={openSections.requestBody} onOpenChange={() => toggleSection("requestBody")}>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between p-4 h-auto bg-orange-50 hover:bg-orange-100 dark:bg-orange-950/20 dark:hover:bg-orange-950/30 border-0 rounded-none"
                  >
                    <span className="text-lg font-semibold text-orange-900 dark:text-orange-100">요청 본문</span>
                    {openSections.requestBody ? (
                      <ChevronDown className="h-5 w-5 text-orange-700" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-orange-700" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="p-6 bg-white dark:bg-gray-900 space-y-6">
                    {/* Form Data Section */}
                    <div className="dark:bg-purple-950/20 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 dark:text-purple-100 mb-3">폼 데이터</h4>

                      {formData.map((data, index) => (
                        <div key={data.id} className="grid grid-cols-12 gap-3 items-center mb-3">
                          <div className="col-span-2">
                            <Input
                              placeholder="이름"
                              value={data.name}
                              onChange={(e) => updateFormData(data.id, "name", e.target.value)}
                            />
                          </div>
                          <div className="col-span-3">
                            <Input
                              placeholder="설명"
                              value={data.description}
                              onChange={(e) => updateFormData(data.id, "description", e.target.value)}
                            />
                          </div>
                          <div className="col-span-2">
                            <Select value={data.type} onValueChange={(value) => updateFormData(data.id, "type", value)}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="string">string</SelectItem>
                                <SelectItem value="number">number</SelectItem>
                                <SelectItem value="boolean">boolean</SelectItem>
                                <SelectItem value="file">file</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="col-span-1 flex justify-center">
                            <div className="flex items-center space-x-2">
                              <Label className="text-xs">Array</Label>
                              <Switch
                                checked={data.isArray}
                                onCheckedChange={(checked) => updateFormData(data.id, "isArray", checked)}
                                size="sm"
                              />
                            </div>
                          </div>
                          <div className="col-span-1 flex justify-center">
                            <div className="flex items-center space-x-2">
                              <Label className="text-xs">Required</Label>
                              <Switch
                                checked={data.required}
                                onCheckedChange={(checked) => updateFormData(data.id, "required", checked)}
                                size="sm"
                              />
                            </div>
                          </div>
                          <div className="col-span-3 flex gap-2 justify-end">
                            <Button
                              size="sm"
                              className="bg-blue-500 hover:bg-blue-600 text-white"
                              onClick={addFormData}
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              추가
                            </Button>
                            {formData.length > 1 && (
                              <Button size="sm" variant="outline" onClick={() => removeFormData(data.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Body Models Section */}
                    <div className="dark:bg-orange-950/20 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 dark:text-orange-100 mb-3">바디</h4>

                      {bodyModels.map((model, index) => (
                        <div key={model.id} className="grid grid-cols-12 gap-3 items-center mb-3">
                          <div className="col-span-3">
                            <Input
                              placeholder="이름"
                              value={model.name}
                              onChange={(e) => updateBodyModel(model.id, "name", e.target.value)}
                            />
                          </div>
                          <div className="col-span-4">
                            <Input
                              placeholder="설명"
                              value={model.description}
                              onChange={(e) => updateBodyModel(model.id, "description", e.target.value)}
                            />
                          </div>
                          <div className="col-span-3">
                            <Select
                              value={model.model}
                              onValueChange={(value) => updateBodyModel(model.id, "model", value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="모델" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="User">User</SelectItem>
                                <SelectItem value="Product">Product</SelectItem>
                                <SelectItem value="Order">Order</SelectItem>
                                <SelectItem value="Custom">Custom</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="col-span-2 flex gap-2 justify-end">
                            <Button
                              size="sm"
                              className="bg-blue-500 hover:bg-blue-600 text-white"
                              onClick={addBodyModel}
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              추가
                            </Button>
                            {bodyModels.length > 1 && (
                              <Button size="sm" variant="outline" onClick={() => removeBodyModel(model.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Content Type Section */}
                    <div className="dark:bg-gray-800 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">컨텐츠 타입</h4>

                      <div className="flex gap-2 mb-3">
                        <Input
                          placeholder="컨텐츠 타입"
                          value={newContentType}
                          onChange={(e) => {
                            setNewContentType(e.target.value)
                            if (contentTypeError) setContentTypeError("")
                          }}
                          className={contentTypeError ? "border-red-300" : ""}
                        />
                        <Button className="bg-blue-500 hover:bg-blue-600 text-white" onClick={addContentType}>
                          <Plus className="h-4 w-4 mr-1" />
                          추가
                        </Button>
                      </div>

                      {contentTypeError && (
                        <div className="flex items-center gap-2 text-red-600 text-sm mb-3">
                          <AlertCircle className="h-4 w-4" />
                          <span>{contentTypeError}</span>
                        </div>
                      )}

                      {contentTypes.length > 0 && (
                        <div className="space-y-2">
                          {contentTypes.map((type, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between bg-white dark:bg-gray-700 p-2 rounded border"
                            >
                              <span className="text-sm">{type}</span>
                              <Button size="sm" variant="ghost" onClick={() => removeContentType(index)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <Button variant="outline" className="text-blue-600 border-blue-300 hover:bg-blue-50 bg-transparent">
                      모델 추가
                    </Button>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>
        </div>

        {/* API Key Selection Modal */}
        <Dialog open={isApiKeyModalOpen} onOpenChange={setIsApiKeyModalOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">API 키 선택</DialogTitle>
            </DialogHeader>

            <div className="py-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">이 메서드에 사용할 API 키를 선택하세요.</p>

              <div className="space-y-3">
                {apiKeys.map((apiKey) => (
                  <div
                    key={apiKey.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all"
                    onClick={() => handleApiKeySelect(apiKey.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{apiKey.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{apiKey.description}</p>
                        <p className="text-xs font-mono text-gray-500 mt-2">{apiKey.value}</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={handleApiKeyModalCancel}>
                취소
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  )
}
