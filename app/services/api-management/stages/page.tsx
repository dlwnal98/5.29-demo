"use client"

import { useState } from "react"
import { AppLayout } from "@/components/layout/AppLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Plus,
  Search,
  Folder,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  MoreHorizontal,
  Edit,
  Trash2,
  Play,
  Settings,
  Activity,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface StageItem {
  id: string
  name: string
  type: "folder" | "stage"
  path: string
  status?: "active" | "inactive" | "deploying"
  environment?: string
  children?: StageItem[]
  isExpanded?: boolean
}

interface DeploymentRecord {
  id: string
  date: string
  status: "active" | "inactive" | "failed"
  description: string
  deploymentId: string
}

const mockStages: StageItem[] = [
  {
    id: "1",
    name: "production",
    type: "folder",
    path: "/production",
    isExpanded: true,
    children: [
      {
        id: "2",
        name: "v1",
        type: "stage",
        path: "/production/v1",
        status: "active",
        environment: "production",
      },
      {
        id: "3",
        name: "v2",
        type: "stage",
        path: "/production/v2",
        status: "inactive",
        environment: "production",
      },
    ],
  },
  {
    id: "4",
    name: "staging",
    type: "folder",
    path: "/staging",
    isExpanded: false,
    children: [
      {
        id: "5",
        name: "test",
        type: "stage",
        path: "/staging/test",
        status: "active",
        environment: "staging",
      },
    ],
  },
  {
    id: "6",
    name: "development",
    type: "stage",
    path: "/development",
    status: "deploying",
    environment: "development",
  },
]

const mockDeployments: DeploymentRecord[] = [
  {
    id: "1",
    date: "July 03, 2025, 08:26 (UTC+09:00)",
    status: "inactive",
    description: "-",
    deploymentId: "eemowu",
  },
  {
    id: "2",
    date: "July 03, 2025, 08:26 (UTC+09:00)",
    status: "inactive",
    description: "-",
    deploymentId: "jje6x",
  },
  {
    id: "3",
    date: "July 02, 2025, 17:44 (UTC+09:00)",
    status: "active",
    description: "활성",
    deploymentId: "xf40pg",
  },
  {
    id: "4",
    date: "July 02, 2025, 17:42 (UTC+09:00)",
    status: "inactive",
    description: "-",
    deploymentId: "ussiri",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-700 border-green-200"
    case "inactive":
      return "bg-gray-100 text-gray-700 border-gray-200"
    case "deploying":
      return "bg-blue-100 text-blue-700 border-blue-200"
    case "failed":
      return "bg-red-100 text-red-700 border-red-200"
    default:
      return "bg-gray-100 text-gray-700 border-gray-200"
  }
}

const getDeploymentStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-700"
    case "inactive":
      return "bg-gray-100 text-gray-700"
    case "failed":
      return "bg-red-100 text-red-700"
    default:
      return "bg-gray-100 text-gray-700"
  }
}

function StageTreeItem({
  item,
  level = 0,
  onToggle,
  onEdit,
  onDelete,
  onStageClick,
}: {
  item: StageItem
  level?: number
  onToggle: (id: string) => void
  onEdit: (item: StageItem) => void
  onDelete: (item: StageItem) => void
  onStageClick: (item: StageItem) => void
}) {
  const paddingLeft = level * 24

  return (
    <div>
      <div
        className="flex items-center justify-between p-3 hover:bg-gray-50 border-b border-gray-100 group"
        style={{ paddingLeft: `${paddingLeft + 12}px` }}
      >
        <div className="flex items-center space-x-3 flex-1">
          <div className="flex items-center space-x-2">
            {item.type === "folder" && (
              <button onClick={() => onToggle(item.id)} className="p-1 hover:bg-gray-200 rounded">
                {item.isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-500" />
                )}
              </button>
            )}
            {item.type === "folder" ? (
              item.isExpanded ? (
                <FolderOpen className="h-5 w-5 text-blue-500" />
              ) : (
                <Folder className="h-5 w-5 text-blue-500" />
              )
            ) : (
              <div className="w-5 h-5 bg-purple-100 rounded border border-purple-200 flex items-center justify-center">
                <Play className="w-3 h-3 text-purple-600" />
              </div>
            )}
          </div>
          <div className="flex-1 cursor-pointer" onClick={() => item.type === "stage" && onStageClick(item)}>
            <div className="font-medium text-gray-900">{item.name}</div>
            <div className="text-sm text-gray-500">{item.path}</div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {item.status && (
            <Badge variant="outline" className={`text-xs px-2 py-1 ${getStatusColor(item.status)}`}>
              {item.status === "active" ? "활성" : item.status === "inactive" ? "비활성" : "배포중"}
            </Badge>
          )}
          {item.environment && (
            <Badge variant="secondary" className="text-xs">
              {item.environment}
            </Badge>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(item)}>
                <Edit className="h-4 w-4 mr-2" />
                편집
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(item)} className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                삭제
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {item.isExpanded &&
        item.children &&
        item.children.map((child) => (
          <StageTreeItem
            key={child.id}
            item={child}
            level={level + 1}
            onToggle={onToggle}
            onEdit={onEdit}
            onDelete={onDelete}
            onStageClick={onStageClick}
          />
        ))}
    </div>
  )
}

export default function StagesPage() {
  const router = useRouter()
  const [stages, setStages] = useState<StageItem[]>(mockStages)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStage, setSelectedStage] = useState<StageItem | null>(null)
  const [deploymentSearchTerm, setDeploymentSearchTerm] = useState("")

  const handleToggle = (id: string) => {
    const updateStages = (items: StageItem[]): StageItem[] => {
      return items.map((item) => {
        if (item.id === id) {
          return { ...item, isExpanded: !item.isExpanded }
        }
        if (item.children) {
          return { ...item, children: updateStages(item.children) }
        }
        return item
      })
    }
    setStages(updateStages(stages))
  }

  const handleEdit = (item: StageItem) => {
    console.log("Edit stage:", item)
  }

  const handleDelete = (item: StageItem) => {
    console.log("Delete stage:", item)
  }

  const handleStageClick = (item: StageItem) => {
    setSelectedStage(item)
  }

  const filteredStages = stages.filter((stage) => stage.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const filteredDeployments = mockDeployments.filter(
    (deployment) =>
      deployment.deploymentId.toLowerCase().includes(deploymentSearchTerm.toLowerCase()) ||
      deployment.description.toLowerCase().includes(deploymentSearchTerm.toLowerCase()),
  )

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
              <BreadcrumbPage>스테이지</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">스테이지</h1>
            <p className="text-gray-600 mt-1">API 스테이지를 관리하고 배포를 구성하세요.</p>
          </div>
          <Button onClick={() => router.push("/services/api-management/stages/create")}>
            <Plus className="h-4 w-4 mr-2" />
            스테이지 생성
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Stage List */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>스테이지 목록</CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="스테이지 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="border rounded-lg">
                {filteredStages.length > 0 ? (
                  filteredStages.map((stage) => (
                    <StageTreeItem
                      key={stage.id}
                      item={stage}
                      onToggle={handleToggle}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onStageClick={handleStageClick}
                    />
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    <div className="text-lg font-medium mb-2">스테이지가 없습니다</div>
                    <p className="text-sm">새로운 스테이지를 생성해보세요.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Stage Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>스테이지 세부 정보</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedStage ? (
                <Tabs defaultValue="info" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="info">기본 정보</TabsTrigger>
                    <TabsTrigger value="deployments">배포 기록</TabsTrigger>
                  </TabsList>
                  <TabsContent value="info" className="space-y-4">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">스테이지 이름</label>
                        <p className="text-gray-900 mt-1">{selectedStage.name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">경로</label>
                        <p className="text-gray-900 mt-1">{selectedStage.path}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">환경</label>
                        <p className="text-gray-900 mt-1">{selectedStage.environment}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">상태</label>
                        <div className="mt-1">
                          <Badge variant="outline" className={`${getStatusColor(selectedStage.status || "inactive")}`}>
                            {selectedStage.status === "active"
                              ? "활성"
                              : selectedStage.status === "inactive"
                                ? "비활성"
                                : "배포중"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="deployments" className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Activity className="h-4 w-4" />
                          <span className="font-medium">배포 ({mockDeployments.length}) 전체</span>
                        </div>
                        <Button variant="outline" size="sm">
                          배포 배포 만들기
                        </Button>
                      </div>

                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          placeholder="배포 찾기"
                          value={deploymentSearchTerm}
                          onChange={(e) => setDeploymentSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>

                      <div className="border rounded-lg overflow-hidden">
                        <div className="bg-gray-50 px-4 py-2 border-b">
                          <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-600">
                            <div className="col-span-1"></div>
                            <div className="col-span-3">배포 날짜</div>
                            <div className="col-span-2">상태</div>
                            <div className="col-span-3">설명</div>
                            <div className="col-span-3">배포 ID</div>
                          </div>
                        </div>

                        <div className="divide-y">
                          {filteredDeployments.map((deployment) => (
                            <div key={deployment.id} className="px-4 py-3 hover:bg-gray-50">
                              <div className="grid grid-cols-12 gap-4 items-center">
                                <div className="col-span-1">
                                  <input type="radio" name="deployment" className="h-4 w-4 text-blue-600" />
                                </div>
                                <div className="col-span-3 text-sm text-gray-900">{deployment.date}</div>
                                <div className="col-span-2">
                                  {deployment.status === "active" ? (
                                    <Badge className={`text-xs ${getDeploymentStatusColor(deployment.status)}`}>
                                      활성
                                    </Badge>
                                  ) : (
                                    <span className="text-sm text-gray-500">-</span>
                                  )}
                                </div>
                                <div className="col-span-3 text-sm text-gray-900">{deployment.description}</div>
                                <div className="col-span-3 text-sm text-gray-900">{deployment.deploymentId}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <ChevronRight className="h-4 w-4 rotate-180" />
                          </button>
                          <span className="font-medium text-gray-900">1</span>
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </div>
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <Settings className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-lg font-medium mb-2">스테이지를 선택하세요</div>
                  <p className="text-sm">왼쪽 목록에서 스테이지를 클릭하여 세부 정보를 확인하세요.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
