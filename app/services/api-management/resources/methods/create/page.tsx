"use client"

import { useState } from "react"
import { AppLayout } from "@/components/layout/AppLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Plus, ChevronDown, ChevronRight, Trash2, Save, Key } from "lucide-react"
import { useRouter } from "next/navigation"

interface QueryParam {
  id: string
  name: string
  type: string
  required: boolean
  description: string
}

interface Header {
  id: string
  name: string
  type: string
  required: boolean
  description: string
}

interface RequestBody {
  id: string
  name: string
  type: string
  required: boolean
  description: string
}

interface ApiKey {
  id: string
  name: string
  description: string
  value: string
}

const mockApiKeys: ApiKey[] = [
  {
    id: "1",
    name: "Production API Key",
    description: "프로덕션 환경용 API 키",
    value: "prod_key_123456789",
  },
  {
    id: "2",
    name: "Development API Key",
    description: "개발 환경용 API 키",
    value: "dev_key_987654321",
  },
  {
    id: "3",
    name: "Testing API Key",
    description: "테스트 환경용 API 키",
    value: "test_key_456789123",
  },
]

export default function CreateMethodPage() {
  const router = useRouter()
  const [methodType, setMethodType] = useState("GET")
  const [resourcePath, setResourcePath] = useState("")
  const [methodName, setMethodName] = useState("")
  const [description, setDescription] = useState("")
  const [apiKeyRequired, setApiKeyRequired] = useState(false)
  const [selectedApiKey, setSelectedApiKey] = useState<ApiKey | null>(null)
  const [showApiKeyModal, setShowApiKeyModal] = useState(false)

  // Query Parameters
  const [queryParams, setQueryParams] = useState<QueryParam[]>([])
  const [queryParamsOpen, setQueryParamsOpen] = useState(false)

  // Headers
  const [headers, setHeaders] = useState<Header[]>([])
  const [headersOpen, setHeadersOpen] = useState(false)

  // Request Body
  const [requestBodies, setRequestBodies] = useState<RequestBody[]>([])
  const [requestBodyOpen, setRequestBodyOpen] = useState(false)

  const handleApiKeyToggle = (checked: boolean) => {
    if (checked) {
      setApiKeyRequired(true)
      setShowApiKeyModal(true)
    } else {
      setApiKeyRequired(false)
      setSelectedApiKey(null)
    }
  }

  const handleApiKeySelect = (apiKey: ApiKey) => {
    setSelectedApiKey(apiKey)
    setShowApiKeyModal(false)
  }

  const handleApiKeyModalCancel = () => {
    setShowApiKeyModal(false)
    setApiKeyRequired(false)
    setSelectedApiKey(null)
  }

  const addQueryParam = () => {
    const newParam: QueryParam = {
      id: Date.now().toString(),
      name: "",
      type: "string",
      required: false,
      description: "",
    }
    setQueryParams([...queryParams, newParam])
  }

  const updateQueryParam = (id: string, field: keyof QueryParam, value: any) => {
    setQueryParams(queryParams.map((param) => (param.id === id ? { ...param, [field]: value } : param)))
  }

  const removeQueryParam = (id: string) => {
    setQueryParams(queryParams.filter((param) => param.id !== id))
  }

  const addHeader = () => {
    const newHeader: Header = {
      id: Date.now().toString(),
      name: "",
      type: "string",
      required: false,
      description: "",
    }
    setHeaders([...headers, newHeader])
  }

  const updateHeader = (id: string, field: keyof Header, value: any) => {
    setHeaders(headers.map((header) => (header.id === id ? { ...header, [field]: value } : header)))
  }

  const removeHeader = (id: string) => {
    setHeaders(headers.filter((header) => header.id !== id))
  }

  const addRequestBody = () => {
    const newBody: RequestBody = {
      id: Date.now().toString(),
      name: "",
      type: "string",
      required: false,
      description: "",
    }
    setRequestBodies([...requestBodies, newBody])
  }

  const updateRequestBody = (id: string, field: keyof RequestBody, value: any) => {
    setRequestBodies(requestBodies.map((body) => (body.id === id ? { ...body, [field]: value } : body)))
  }

  const removeRequestBody = (id: string) => {
    setRequestBodies(requestBodies.filter((body) => body.id !== id))
  }

  const handleSave = () => {
    console.log("Saving method:", {
      methodType,
      resourcePath,
      methodName,
      description,
      apiKeyRequired,
      selectedApiKey,
      queryParams,
      headers,
      requestBodies,
    })
    router.push("/services/api-management/resources/methods")
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <Breadcrumb>
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
              <BreadcrumbLink href="/services/api-management/resources/methods">메서드</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>메서드 생성</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">메서드 생성</h1>
            <p className="text-gray-600 mt-1">새로운 API 메서드를 생성하고 구성하세요.</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => router.back()}>
              취소
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              저장
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Method Details */}
          <Card>
            <CardHeader>
              <CardTitle>메서드 세부 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="method-type">HTTP 메서드</Label>
                  <Select value={methodType} onValueChange={setMethodType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GET">GET</SelectItem>
                      <SelectItem value="POST">POST</SelectItem>
                      <SelectItem value="PUT">PUT</SelectItem>
                      <SelectItem value="DELETE">DELETE</SelectItem>
                      <SelectItem value="PATCH">PATCH</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="resource-path">리소스 경로</Label>
                  <Input
                    id="resource-path"
                    value={resourcePath}
                    onChange={(e) => setResourcePath(e.target.value)}
                    placeholder="/users/{id}"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="method-name">메서드 이름</Label>
                <Input
                  id="method-name"
                  value={methodName}
                  onChange={(e) => setMethodName(e.target.value)}
                  placeholder="사용자 정보 조회"
                />
              </div>

              <div>
                <Label htmlFor="description">설명</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="메서드에 대한 설명을 입력하세요"
                  rows={3}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="api-key-required">API 키가 필요함</Label>
                  <p className="text-sm text-gray-500">이 메서드에 API 키 인증이 필요한지 설정합니다.</p>
                </div>
                <Switch id="api-key-required" checked={apiKeyRequired} onCheckedChange={handleApiKeyToggle} />
              </div>

              {selectedApiKey && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Key className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-900">선택된 API 키: {selectedApiKey.name}</span>
                  </div>
                  <p className="text-sm text-blue-700 mt-1">{selectedApiKey.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Request Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>요청 구성</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* URL Query String Parameters */}
              <Collapsible open={queryParamsOpen} onOpenChange={setQueryParamsOpen}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                    <span className="font-medium">URL 쿼리 문자열 파라미터</span>
                    {queryParamsOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-3 mt-3">
                  {queryParams.map((param) => (
                    <div key={param.id} className="grid grid-cols-12 gap-2 items-end">
                      <div className="col-span-3">
                        <Label className="text-xs">이름</Label>
                        <Input
                          value={param.name}
                          onChange={(e) => updateQueryParam(param.id, "name", e.target.value)}
                          placeholder="param"
                          size="sm"
                        />
                      </div>
                      <div className="col-span-2">
                        <Label className="text-xs">타입</Label>
                        <Select value={param.type} onValueChange={(value) => updateQueryParam(param.id, "type", value)}>
                          <SelectTrigger className="h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="string">String</SelectItem>
                            <SelectItem value="number">Number</SelectItem>
                            <SelectItem value="boolean">Boolean</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-1 flex items-center">
                        <div className="space-y-1">
                          <Label className="text-xs">필수</Label>
                          <div className="flex justify-center">
                            <input
                              type="checkbox"
                              checked={param.required}
                              onChange={(e) => updateQueryParam(param.id, "required", e.target.checked)}
                              className="h-4 w-4"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-span-5">
                        <Label className="text-xs">설명</Label>
                        <Input
                          value={param.description}
                          onChange={(e) => updateQueryParam(param.id, "description", e.target.value)}
                          placeholder="파라미터 설명"
                          size="sm"
                        />
                      </div>
                      <div className="col-span-1 flex justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeQueryParam(param.id)}
                          className="h-9 w-9 p-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-end">
                    <Button variant="outline" size="sm" onClick={addQueryParam}>
                      <Plus className="h-4 w-4 mr-2" />
                      추가
                    </Button>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* HTTP Request Headers */}
              <Collapsible open={headersOpen} onOpenChange={setHeadersOpen}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                    <span className="font-medium">HTTP 요청 헤더</span>
                    {headersOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-3 mt-3">
                  {headers.map((header) => (
                    <div key={header.id} className="grid grid-cols-12 gap-2 items-end">
                      <div className="col-span-3">
                        <Label className="text-xs">이름</Label>
                        <Input
                          value={header.name}
                          onChange={(e) => updateHeader(header.id, "name", e.target.value)}
                          placeholder="Content-Type"
                          size="sm"
                        />
                      </div>
                      <div className="col-span-2">
                        <Label className="text-xs">타입</Label>
                        <Select value={header.type} onValueChange={(value) => updateHeader(header.id, "type", value)}>
                          <SelectTrigger className="h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="string">String</SelectItem>
                            <SelectItem value="number">Number</SelectItem>
                            <SelectItem value="boolean">Boolean</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-1 flex items-center">
                        <div className="space-y-1">
                          <Label className="text-xs">필수</Label>
                          <div className="flex justify-center">
                            <input
                              type="checkbox"
                              checked={header.required}
                              onChange={(e) => updateHeader(header.id, "required", e.target.checked)}
                              className="h-4 w-4"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-span-5">
                        <Label className="text-xs">설명</Label>
                        <Input
                          value={header.description}
                          onChange={(e) => updateHeader(header.id, "description", e.target.value)}
                          placeholder="헤더 설명"
                          size="sm"
                        />
                      </div>
                      <div className="col-span-1 flex justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeHeader(header.id)}
                          className="h-9 w-9 p-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-end">
                    <Button variant="outline" size="sm" onClick={addHeader}>
                      <Plus className="h-4 w-4 mr-2" />
                      추가
                    </Button>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Request Body */}
              <Collapsible open={requestBodyOpen} onOpenChange={setRequestBodyOpen}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                    <span className="font-medium">요청 본문</span>
                    {requestBodyOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-3 mt-3">
                  {requestBodies.map((body) => (
                    <div key={body.id} className="grid grid-cols-12 gap-2 items-end">
                      <div className="col-span-3">
                        <Label className="text-xs">이름</Label>
                        <Input
                          value={body.name}
                          onChange={(e) => updateRequestBody(body.id, "name", e.target.value)}
                          placeholder="field"
                          size="sm"
                        />
                      </div>
                      <div className="col-span-2">
                        <Label className="text-xs">타입</Label>
                        <Select value={body.type} onValueChange={(value) => updateRequestBody(body.id, "type", value)}>
                          <SelectTrigger className="h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="string">String</SelectItem>
                            <SelectItem value="number">Number</SelectItem>
                            <SelectItem value="boolean">Boolean</SelectItem>
                            <SelectItem value="object">Object</SelectItem>
                            <SelectItem value="array">Array</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-1 flex items-center">
                        <div className="space-y-1">
                          <Label className="text-xs">필수</Label>
                          <div className="flex justify-center">
                            <input
                              type="checkbox"
                              checked={body.required}
                              onChange={(e) => updateRequestBody(body.id, "required", e.target.checked)}
                              className="h-4 w-4"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-span-5">
                        <Label className="text-xs">설명</Label>
                        <Input
                          value={body.description}
                          onChange={(e) => updateRequestBody(body.id, "description", e.target.value)}
                          placeholder="필드 설명"
                          size="sm"
                        />
                      </div>
                      <div className="col-span-1 flex justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeRequestBody(body.id)}
                          className="h-9 w-9 p-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-end">
                    <Button variant="outline" size="sm" onClick={addRequestBody}>
                      <Plus className="h-4 w-4 mr-2" />
                      추가
                    </Button>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </CardContent>
          </Card>
        </div>

        {/* API Key Selection Modal */}
        <Dialog open={showApiKeyModal} onOpenChange={setShowApiKeyModal}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>API 키 선택</DialogTitle>
              <DialogDescription>이 메서드에 사용할 API 키를 선택하세요.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {mockApiKeys.map((apiKey) => (
                <div
                  key={apiKey.id}
                  className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedApiKey?.id === apiKey.id ? "border-blue-500 bg-blue-50" : "border-gray-200"
                  }`}
                  onClick={() => handleApiKeySelect(apiKey)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      <Key className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{apiKey.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{apiKey.description}</p>
                      <p className="text-xs text-gray-500 mt-2 font-mono bg-gray-100 px-2 py-1 rounded">
                        {apiKey.value}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <DialogFooter>
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
