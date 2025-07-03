"use client"

import { AppLayout } from "@/components/layout/AppLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
  Search,
  RefreshCw,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"
import { useState } from "react"
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

export default function ApiManagementPage() {
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

  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
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
  })

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

  const filteredApis = sortedApis.filter(
    (api) =>
      api.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      api.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSelectAll = (checked: boolean) => {
    setApis(apis.map((api) => ({ ...api, selected: checked })))
  }

  const handleSelectApi = (id: string, checked: boolean) => {
    setApis(apis.map((api) => (api.id === id ? { ...api, selected: checked } : api)))
  }

  const handleDeleteSelected = () => {
    const selectedApis = apis.filter((api) => api.selected)
    if (selectedApis.length === 0) {
      toast.error("삭제할 API를 선택해주세요.")
      return
    }

    setApis(apis.filter((api) => !api.selected))
    toast.success(`${selectedApis.length}개의 API가 삭제되었습니다.`)
  }

  const handleRefresh = () => {
    toast.success("API 목록이 새로고침되었습니다.")
    // Simulate refresh
    setApis([...apis])
  }

  const handleCreateApi = () => {
    if (!createApiForm.name.trim()) {
      toast.error("API 이름을 입력해주세요.")
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
    setCreateApiForm({ type: "new", name: "", description: "" })
    toast.success(`API '${newApi.name}'이(가) 생성되었습니다.`)
  }

  const handleApiClick = (api: ApiItem) => {
    // Navigate to API resource creation page
    router.push(`/services/api-management/resources?apiId=${api.apiId}&apiName=${api.name}`)
  }

  const getSortIcon = (key: keyof ApiItem) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ChevronUp className="h-4 w-4 text-gray-400" />
    }
    return sortConfig.direction === "asc" ? (
      <ChevronUp className="h-4 w-4 text-blue-600" />
    ) : (
      <ChevronDown className="h-4 w-4 text-blue-600" />
    )
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

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              API ({filteredApis.length}/{apis.length})
            </h1>
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="API 찾기"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>

              {/* Action Buttons */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                className="flex items-center gap-2 bg-white hover:bg-gray-50 border-gray-300"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleDeleteSelected}
                className="flex items-center gap-2 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border-red-200 hover:border-red-300"
              >
                삭제
              </Button>

              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md font-medium"
              >
                API 생성
              </Button>
            </div>
          </div>
        </div>

        {/* API Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 dark:bg-gray-700">
                <TableHead className="w-12">
                  <Checkbox
                    checked={apis.length > 0 && apis.every((api) => api.selected)}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center gap-2">
                    이름
                    {getSortIcon("name")}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => handleSort("description")}
                >
                  <div className="flex items-center gap-2">
                    설명
                    {getSortIcon("description")}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => handleSort("apiId")}
                >
                  <div className="flex items-center gap-2">
                    ID
                    {getSortIcon("apiId")}
                  </div>
                </TableHead>
                <TableHead>프로토콜</TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => handleSort("endpointType")}
                >
                  <div className="flex items-center gap-2">
                    API 엔드포인트 유형
                    {getSortIcon("endpointType")}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => handleSort("createdDate")}
                >
                  <div className="flex items-center gap-2">
                    생성일
                    {getSortIcon("createdDate")}
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApis.map((api) => (
                <TableRow key={api.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                  <TableCell>
                    <Checkbox
                      checked={api.selected}
                      onCheckedChange={(checked) => handleSelectApi(api.id, checked as boolean)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </TableCell>
                  <TableCell
                    className="font-medium text-blue-600 hover:text-blue-800 cursor-pointer underline"
                    onClick={() => handleApiClick(api)}
                  >
                    {api.name}
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-300">{api.description}</TableCell>
                  <TableCell className="font-mono text-sm text-gray-500">{api.apiId}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {api.protocol}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-300">{api.endpointType}</TableCell>
                  <TableCell className="text-gray-500 text-sm">{api.createdDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Custom Pagination */}
        <div className="mt-6 flex justify-center">
          <div className="flex items-center gap-1">
            {/* First Page */}
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 hover:text-gray-900"
            >
              <ChevronsLeft className="h-4 w-4" />
            </button>

            {/* Previous Page */}
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 hover:text-gray-900"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {/* Page Number */}
            <button className="px-3 py-2 rounded-md bg-blue-600 text-white font-medium min-w-[40px]">1</button>

            {/* Next Page */}
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              className="p-2 rounded-md hover:bg-gray-100 text-gray-600 hover:text-gray-900"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            {/* Last Page */}
            <button
              onClick={() => setCurrentPage(1)} // Assuming only 1 page for now
              className="p-2 rounded-md hover:bg-gray-100 text-gray-600 hover:text-gray-900"
            >
              <ChevronsRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Create API Modal */}
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-blue-600">API 생성</DialogTitle>
              <DialogDescription className="text-gray-600">
                API는 4가지 방법으로 생성할 수 있습니다. (<span className="text-red-500">*</span> 필수 입력 사항입니다.)
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* API Creation Type */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">
                  API 생성 <span className="text-red-500">*</span>
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
                  onChange={(e) => setCreateApiForm({ ...createApiForm, description: e.target.value })}
                  className="w-full min-h-[100px] resize-none"
                  maxLength={300}
                />
                <div className="text-right text-sm text-gray-500 mt-1">{createApiForm.description.length}/300 자</div>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreateModalOpen(false)
                  setCreateApiForm({ type: "new", name: "", description: "" })
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
      </div>
    </AppLayout>
  )
}
