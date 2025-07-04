"use client"

import type React from "react"
import { useState } from "react"
import { AppLayout } from "@/components/layout/AppLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, Settings, Rocket,RefreshCw } from "lucide-react"
import { useSearchParams, useRouter } from "next/navigation"
import { toast } from "sonner"

interface ApiItem {
  id: string
  name: string
  description: string
  apiId: string
  protocol: string
  endpointType: string
  createdDate: string
  selected: boolean
}

interface ApiPlan {
  id: string
  name: string
  planId: string
  description: string
  createdAt: string
  status: "active" | "inactive" | "draft"
}

const mockApiPlans: ApiPlan[] = [
  {
    id: "1",
    name: "User Management API",
    planId: "plan-001",
    description: "사용자 관리를 위한 REST API",
    createdAt: "2024-01-15 14:44:23",
    status: "active",
  },
  {
    id: "2",
    name: "Product Catalog API",
    planId: "plan-002",
    description: "상품 카탈로그 조회 및 관리 API",
    createdAt: "2024-01-20 14:44:23",
    status: "active",
  },
  {
    id: "3",
    name: "Payment Processing API",
    planId: "plan-003",
    description: "결제 처리를 위한 보안 API",
    createdAt: "2024-01-25 14:44:23",
    status: "draft",
  },
  {
    id: "4",
    name: "Analytics API",
    planId: "plan-004",
    description: "데이터 분석 및 리포팅 API",
    createdAt: "2024-01-30 14:44:23",
    status: "inactive",
  },
]

const mockApiExamples = `{
  "openapi": "3.0.0",
  "info": {
    "title": "Pet Store API",
    "version": "1.0.0",
    "description": "A sample API that uses a petstore as an example"
  },
  "servers": [
    {
      "url": "https://petstore.swagger.io/v2"
    }
  ],
  "paths": {
    "/pets": {
      "get": {
        "summary": "List all pets",
        "operationId": "listPets",
        "tags": ["pets"],
        "parameters": [
          {
            "name": "limit",
            "in": "query",
            "description": "How many items to return at one time",
            "required": false,
            "schema": {
              "type": "integer",
              "format": "int32"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "A paged array of pets",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Pets"
                }
              }
            }
          }
        }
      },
      "post": {
        "summary": "Create a pet",
        "operationId": "createPets",
        "tags": ["pets"],
        "responses": {
          "201": {
            "description": "Null response"
          }
        }
      }
    }
  },
  "components": {
    "schemas": {
      "Pet": {
        "type": "object",
        "required": ["id", "name"],
        "properties": {
          "id": {
            "type": "integer",
            "format": "int64"
          },
          "name": {
            "type": "string"
          },
          "tag": {
            "type": "string"
          }
        }
      },
      "Pets": {
        "type": "array",
        "items": {
          "$ref": "#/components/schemas/Pet"
        }
      }
    }
  }
}`;

export default function ApiManagementPage() {
  const [apiPlans, setApiPlans] = useState<ApiPlan[]>(mockApiPlans)
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<ApiPlan | null>(null)
  const [deploymentData, setDeploymentData] = useState({
    stage: "",
    version: "",
    description: "",
    newStageName: "",
    newStageDescription: "",
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isModifyModalOpen, setIsModifyModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortConfig, setSortConfig] = useState<{
    key: keyof ApiItem
    direction: "asc" | "desc"
  } | null>(null)

  // Create API Modal State
  const [createApiForm, setCreateApiForm] = useState({
    type: "new",
    name: "",
    description: "",
    sourceApiId: "",
    swaggerContent: "",
    selectedExample: "",
  })

  // Modify API Modal State
  const [modifyApiForm, setModifyApiForm] = useState({
    type: "new",
    name: "",
    description: "",
  })

  // Swagger states
  const [swaggerFile, setSwaggerFile] = useState<File | null>(null)
  const [swaggerPreview, setSwaggerPreview] = useState("")
  const [showSwaggerPreview, setShowSwaggerPreview] = useState(false)

  const filteredPlans = apiPlans.filter(
    (plan) =>
      plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.planId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDeploy = (plan: ApiPlan) => {
    setSelectedPlan(plan)
    setDeploymentData({
      stage: "",
      version: "",
      description: "",
      newStageName: "",
      newStageDescription: "",
    })
    setIsDeployModalOpen(true)
  }

  const handleDeploySubmit = () => {
    if (deploymentData.stage === "new") {
      if (!deploymentData.newStageName.trim()) {
        toast.error("새 스테이지 이름을 입력해주세요.")
        return
      }
      // 새 스테이지 생성 로직
      toast.success(
        `새 스테이지 '${deploymentData.newStageName}'가 생성되고 ${selectedPlan?.name}이(가) 성공적으로 배포되었습니다.`,
      )
    } else {
      if (!deploymentData.stage) {
        toast.error("배포 스테이지를 선택해주세요.")
        return
      }
      toast.success(`${selectedPlan?.name}이(가) ${deploymentData.stage} 스테이지에 성공적으로 배포되었습니다.`)
    }

    setIsDeployModalOpen(false)
    setSelectedPlan(null)
    setDeploymentData({
      stage: "",
      version: "",
      description: "",
      newStageName: "",
      newStageDescription: "",
    })
  }

  const handleDeployModalClose = () => {
    setIsDeployModalOpen(false)
    setSelectedPlan(null)
    setDeploymentData({
      stage: "",
      version: "",
      description: "",
      newStageName: "",
      newStageDescription: "",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700 border-green-200"
      case "inactive":
        return "bg-gray-100 text-gray-700 border-gray-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const searchParams = useSearchParams()
  const router = useRouter()
  const productId = searchParams.get("productId")

  const [apis, setApis] = useState<ApiItem[]>([
    {
      id: "1",
      name: "test",
      description: "테스트용",
      apiId: "yrr5q5hoch",
      protocol: "REST",
      endpointType: "지역",
      createdDate: "2025-05-21",
      selected: false,
    },
  ])

  const handleSort = (key: keyof ApiItem) => {
    let direction: "asc" | "desc" = "asc"
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key, direction })
  }

  const sortedApis = [...apis].sort((a, b) => {
    if (!sortConfig) return 0

    const aValue = a[sortConfig.key]
    const bValue = b[sortConfig.key]

    if (aValue < bValue) {
      return sortConfig.direction === "asc" ? -1 : 1
    }
    if (aValue > bValue) {
      return sortConfig.direction === "asc" ? 1 : -1
    }
    return 0
  })



  const handleRefresh = () => {
    toast.success("API 목록이 새로고침되었습니다.")
    // Simulate refresh
    setApis([...apis])
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSwaggerFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setCreateApiForm({ ...createApiForm, swaggerContent: content })
        setSwaggerPreview(content)
      }
      reader.readAsText(file)
    }
  }

  const handleSwaggerPreview = () => {
    if (createApiForm.swaggerContent) {
      setSwaggerPreview(createApiForm.swaggerContent)
      setShowSwaggerPreview(true)
    } else {
      toast.error("미리보기할 내용이 없습니다.")
    }
  }

  const handleCreateApi = () => {
    if (!createApiForm.name.trim()) {
      toast.error("API 이름을 입력해주세요.")
      return
    }

    // 타입별 추가 검증
    if (createApiForm.type === "copy" && !createApiForm.sourceApiId) {
      toast.error("복사할 API를 선택해주세요.")
      return
    }

    if (createApiForm.type === "swagger" && !createApiForm.swaggerContent.trim()) {
      toast.error("Swagger 내용을 입력하거나 파일을 업로드해주세요.")
      return
    }

    if (createApiForm.type === "example" && !createApiForm.selectedExample) {
      toast.error("API 예제를 선택해주세요.")
      return
    }

    const newApi: ApiItem = {
      id: Date.now().toString(),
      name: createApiForm.name,
      description: createApiForm.description,
      apiId: Math.random().toString(36).substring(2, 12),
      protocol: "REST",
      endpointType: "지역",
      createdDate: new Date().toISOString().split("T")[0],
      selected: false,
    }

    setApis([...apis, newApi])
    setIsCreateModalOpen(false)
    setCreateApiForm({
      type: "new",
      name: "",
      description: "",
      sourceApiId: "",
      swaggerContent: "",
      selectedExample: "",
    })
    setSwaggerFile(null)
    setSwaggerPreview("")
    setShowSwaggerPreview(false)
    toast.success(`API '${newApi.name}'이(가) 생성되었습니다.`)
  }

  const handleModifyApi = () => {
    if (!modifyApiForm.name.trim()) {
      toast.error("API 이름을 입력해주세요.")
      return
    }

    const newApi: ApiItem = {
      id: Date.now().toString(),
      name: modifyApiForm.name,
      description: modifyApiForm.description,
      apiId: Math.random().toString(36).substring(2, 12),
      protocol: "REST",
      endpointType: "지역",
      createdDate: new Date().toISOString().split("T")[0],
      selected: false,
    }

    setApis([...apis, newApi])
    setIsModifyModalOpen(false)
    setModifyApiForm({ type: "new", name: "", description: "" })
    toast.success(`API '${newApi.name}'이(가) 수정되었습니다.`)
  }

  const handleApiClick = (api: ApiPlan) => {
    // Navigate to API resource creation page
    router.push(`/services/api-management/resources?apiId=${api.planId}&apiName=${api.name}`)
  }

  const renderCreateApiContent = () => {
    switch (createApiForm.type) {
      case "copy":
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                복사할 API 선택 <span className="text-red-500">*</span>
              </Label>
              <Select
                value={createApiForm.sourceApiId}
                onValueChange={(value) => setCreateApiForm({ ...createApiForm, sourceApiId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="복사할 API를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {mockApiPlans.map((api) => (
                    <SelectItem key={api.id} value={api.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{api.name}</span>
                        <span className="text-xs text-gray-500">{api.planId}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case "swagger":
        return (
          <div className="space-y-4">
            <Tabs defaultValue="swagger" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="swagger">Swagger</TabsTrigger>
                <TabsTrigger value="preview">미리보기</TabsTrigger>
              </TabsList>

              <TabsContent value="swagger" className="space-y-4">
                {/* File Upload Area */}
                <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center bg-blue-50">
                  <div className="space-y-3">
                    <div className="text-blue-600 text-lg">+</div>
                    <p className="text-gray-600">Drop files here or click to upload.</p>
                    <input
                      type="file"
                      accept=".json,.yaml,.yml"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="swagger-upload"
                    />
                    <label
                      htmlFor="swagger-upload"
                      className="inline-block cursor-pointer text-blue-600 hover:text-blue-700"
                    >
                      파일 선택
                    </label>
                  </div>
                  {swaggerFile && (
                    <p className="mt-3 text-sm text-green-600 font-medium">선택된 파일: {swaggerFile.name}</p>
                  )}
                </div>

                {/* Warning Options */}
                <div className="space-y-3">
                  <RadioGroup defaultValue="ignore" className="flex space-x-6">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="fail" id="warning-fail" />
                      <Label htmlFor="warning-fail" className="text-sm">
                        경고 실패
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="ignore" id="warning-ignore" />
                      <Label htmlFor="warning-ignore" className="text-sm">
                        경고 무시
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Text Input Area */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="col-span-1">
                    <Textarea
                      placeholder="1"
                      className="min-h-[300px] font-mono text-sm resize-none bg-gray-50"
                      readOnly
                      value="1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11\n12\n13\n14\n15\n16\n17\n18\n19\n20"
                    />
                  </div>
                  <div className="col-span-3">
                    <Textarea
                      placeholder="Swagger JSON 또는 YAML 내용을 입력하세요..."
                      value={createApiForm.swaggerContent}
                      onChange={(e) =>
                        setCreateApiForm({
                          ...createApiForm,
                          swaggerContent: e.target.value,
                        })
                      }
                      className="min-h-[300px] font-mono text-sm resize-none"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="preview" className="space-y-4">
                {createApiForm.swaggerContent ? (
                  <div className="border rounded-lg bg-gray-50">
                    <div className="p-3 border-b bg-white">
                      <Label className="text-sm font-medium text-gray-700">Swagger 미리보기</Label>
                    </div>
                    <div className="p-4">
                      <pre className="text-xs bg-white p-4 rounded border max-h-96 overflow-auto font-mono">
                        {createApiForm.swaggerContent}
                      </pre>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <p>미리보기할 내용이 없습니다.</p>
                    <p className="text-sm">Swagger 탭에서 내용을 입력해주세요.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )

      case "example":
        return (
          <div className="space-y-4">
           
              <div className="border rounded-lg bg-gray-50">
               
                <div className="p-4">
                  <div className="bg-white rounded border max-h-96 overflow-auto">
                    <pre className="text-xs p-4 font-mono leading-relaxed">
                      {mockApiExamples}
                    </pre>
                  </div>
                </div>
              </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <AppLayout>
      <div className="space-y-6 container px-4 py-6">
        {/* Breadcrumb */}
        <Breadcrumb>
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

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">API Plans</h1>
            <p className="text-gray-600 mt-1">API 계획을 관리하고 배포하세요.</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="API Plan 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
               <Button variant="outline" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 " />
            </Button>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              API Plan 생성
            </Button>
          </div>
        </div>

        {/* API Plans List */}
        <Card>
          <div className="pt-6"></div>
          <CardContent>
            <Table>
              <TableHeader className="hover:bg-white">
                <TableRow className="hover:bg-white">
                  <TableHead>이름</TableHead>
                  <TableHead>Plan ID</TableHead>
                  <TableHead>설명</TableHead>
                  <TableHead>배포 상태</TableHead>
                  <TableHead>생성일</TableHead>
                  <TableHead className="text-right">작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPlans.length > 0 ? (
                  filteredPlans.map((plan) => (
                    <TableRow key={plan.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium hover:cursor-pointer" onClick={() => handleApiClick(plan)}>
                            {plan.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{plan.planId}</TableCell>
                      <TableCell className="max-w-xs truncate">{plan.description}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className={getStatusColor(plan.status)}>
                            {plan.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span>{plan.createdAt}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end space-x-2">
                          <Button variant="outline" size="sm" onClick={() => setIsModifyModalOpen(true)}>
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleDeploy(plan)}
                            className="bg-orange-500 hover:bg-orange-600 text-white"
                          >
                            <Rocket className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      검색 결과가 없습니다.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Pagination */}
        <div className="flex justify-center mt-6">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              {"<<"}
            </Button>
            <Button variant="outline" size="sm" disabled>
              {"<"}
            </Button>
            <Button size="sm" className="bg-blue-600 text-white">
              1
            </Button>
            <Button variant="outline" size="sm" disabled>
              {">"}
            </Button>
            <Button variant="outline" size="sm" disabled>
              {">>"}
            </Button>
          </div>
        </div>

        {/* Deploy Modal */}
        <Dialog open={isDeployModalOpen} onOpenChange={handleDeployModalClose}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Rocket className="h-5 w-5 mr-2 text-orange-500" />
                API Plan 배포
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {selectedPlan && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-blue-900">배포할 API Plan</p>
                  <p className="text-sm text-blue-700">{selectedPlan.name}</p>
                  <p className="text-xs text-blue-600 font-mono">{selectedPlan.planId}</p>
                </div>
              )}
              
              <div>
                <Label htmlFor="deploy-stage" className="text-sm font-medium">
                  배포 스테이지 *
                </Label>
                <Select
                  value={deploymentData.stage}
                  onValueChange={(value) => setDeploymentData({ ...deploymentData, stage: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="스테이지 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dev">Development</SelectItem>
                    <SelectItem value="staging">Staging</SelectItem>
                    <SelectItem value="prod">Production</SelectItem>
                    <SelectItem value="new">
                      <div className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />새 스테이지 생성
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 새 스테이지 생성 필드들 */}
              {deploymentData.stage === "new" && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <Plus className="h-4 w-4 text-orange-500" />
                    <Label className="text-sm font-medium text-gray-700">새 스테이지 정보</Label>
                  </div>
                  <div>
                    <Label htmlFor="new-stage-name" className="text-sm font-medium">
                      스테이지 이름 *
                    </Label>
                    <Input
                      id="new-stage-name"
                      value={deploymentData.newStageName}
                      onChange={(e) =>
                        setDeploymentData({
                          ...deploymentData,
                          newStageName: e.target.value,
                        })
                      }
                      placeholder="새 스테이지 이름을 입력하세요"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-stage-description" className="text-sm font-medium">
                      스테이지 설명
                    </Label>
                    <Textarea
                      id="new-stage-description"
                      value={deploymentData.newStageDescription}
                      onChange={(e) =>
                        setDeploymentData({
                          ...deploymentData,
                          newStageDescription: e.target.value,
                        })
                      }
                      placeholder="스테이지 설명을 입력하세요 (선택사항)"
                      className="mt-1"
                    />
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="deploy-description" className="text-sm font-medium">
                  배포 설명
                </Label>
                <Textarea
                  id="deploy-description"
                  value={deploymentData.description}
                  onChange={(e) =>
                    setDeploymentData({
                      ...deploymentData,
                      description: e.target.value,
                    })
                  }
                  placeholder="배포에 대한 설명을 입력하세요"
                  className="mt-1"
                />
              </div>
            </div>
            <DialogFooter className="flex space-x-2">
              <Button variant="outline" onClick={handleDeployModalClose}>
                취소
              </Button>
              <Button onClick={handleDeploySubmit} className="bg-orange-500 hover:bg-orange-600 text-white">
                <Rocket className="h-4 w-4 mr-2" />
                배포
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Create API Modal */}
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-blue-600">API Plan 생성</DialogTitle>
              <DialogDescription className="text-gray-600">
                API는 4가지 방법으로 생성할 수 있습니다. (<span className="text-red-500">*</span> 필수 입력 사항입니다.)
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* API Creation Type */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">
                  API 생성 유형 <span className="text-red-500">*</span>
                </Label>
                <RadioGroup
                  value={createApiForm.type}
                  onValueChange={(value) => setCreateApiForm({ ...createApiForm, type: value })}
                  className="grid grid-cols-2 gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="new" id="new" />
                    <Label htmlFor="new" className="text-sm font-medium text-blue-600">
                      새로운 API
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="copy" id="copy" />
                    <Label htmlFor="copy" className="text-sm">
                      API 복사
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="swagger" id="swagger" />
                    <Label htmlFor="swagger" className="text-sm">
                      Swagger에서 가져오기
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="example" id="example" />
                    <Label htmlFor="example" className="text-sm">
                      API 예제
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* API Name */}
              <div>
                <Label htmlFor="api-name" className="text-sm font-medium text-gray-700 mb-2 block">
                  API 이름 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="api-name"
                  placeholder="API 이름을 입력하세요"
                  value={createApiForm.name}
                  onChange={(e) => setCreateApiForm({ ...createApiForm, name: e.target.value })}
                  className="w-full"
                />
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description" className="text-sm font-medium text-gray-700 mb-2 block">
                  설명
                </Label>
                <Textarea
                  id="description"
                  placeholder="설명을 입력하세요"
                  value={createApiForm.description}
                  onChange={(e) =>
                    setCreateApiForm({
                      ...createApiForm,
                      description: e.target.value,
                    })
                  }
                  className="w-full min-h-[100px] resize-none"
                  maxLength={300}
                />
                <div className="text-right text-sm text-gray-500 mt-1">{createApiForm.description.length}/300 자</div>
              </div>

              {/* Type-specific content */}
              {renderCreateApiContent()}
            </div>

            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreateModalOpen(false)
                  setCreateApiForm({
                    type: "new",
                    name: "",
                    description: "",
                    sourceApiId: "",
                    swaggerContent: "",
                    selectedExample: "",
                  })
                  setSwaggerFile(null)
                  setSwaggerPreview("")
                  setShowSwaggerPreview(false)
                }}
              >
                취소
              </Button>
              <Button onClick={handleCreateApi} className="bg-blue-500 hover:bg-blue-600 text-white">
                API 생성
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modify API Plan */}
        <Dialog open={isModifyModalOpen} onOpenChange={setIsModifyModalOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-blue-600">API Plan 수정</DialogTitle>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* API Name */}
              <div>
                <Label htmlFor="api-name" className="text-sm font-medium text-gray-700 mb-2 block">
                  API 이름 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="api-name"
                  placeholder="API 이름을 입력하세요"
                  value={modifyApiForm.name}
                  onChange={(e) => setModifyApiForm({ ...modifyApiForm, name: e.target.value })}
                  className="w-full"
                />
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description" className="text-sm font-medium text-gray-700 mb-2 block">
                  설명
                </Label>
                <Textarea
                  id="description"
                  placeholder="설명을 입력하세요"
                  value={modifyApiForm.description}
                  onChange={(e) =>
                    setModifyApiForm({
                      ...modifyApiForm,
                      description: e.target.value,
                    })
                  }
                  className="w-full min-h-[100px] resize-none"
                  maxLength={300}
                />
                <div className="text-right text-sm text-gray-500 mt-1">{modifyApiForm.description.length}/300 자</div>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsModifyModalOpen(false)
                  setModifyApiForm({ type: "new", name: "", description: "" })
                }}
              >
                취소
              </Button>
              <Button onClick={handleModifyApi} className="bg-blue-500 hover:bg-blue-600 text-white">
                수정
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  )
}
