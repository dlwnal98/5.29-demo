"use client"

import { useState } from "react"
import { AppLayout } from "@/components/layout/AppLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Checkbox } from "@/components/ui/checkbox"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Plus, Search, Edit, Trash2, AlertTriangle, Calendar } from "lucide-react"
import { toast } from "sonner"

interface TargetEndpoint {
  id: string
  targetId: string
  url: string
  description: string
  createdAt: string
}

export default function TargetEndpointsPage() {
  const [endpoints, setEndpoints] = useState<TargetEndpoint[]>([
    {
      id: "1",
      targetId: "target-001",
      url: "https://api.example.com/v1",
      description: "메인 API 엔드포인트",
      createdAt: "2024-01-15",
    },
    {
      id: "2",
      targetId: "target-002",
      url: "https://staging-api.example.com/v1",
      description: "스테이징 환경 API 엔드포인트",
      createdAt: "2024-01-20",
    },
    {
      id: "3",
      targetId: "target-003",
      url: "https://dev-api.example.com/v1",
      description: "개발 환경 API 엔드포인트",
      createdAt: "2024-01-25",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedEndpoints, setSelectedEndpoints] = useState<string[]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingEndpoint, setEditingEndpoint] = useState<TargetEndpoint | null>(null)
  const [deleteType, setDeleteType] = useState<"selected" | "all">("selected")

  const [newEndpoint, setNewEndpoint] = useState({
    targetId: "",
    url: "",
    description: "",
  })

  const filteredEndpoints = endpoints.filter(
    (endpoint) =>
      endpoint.targetId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      endpoint.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
      endpoint.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedEndpoints(filteredEndpoints.map((endpoint) => endpoint.id))
    } else {
      setSelectedEndpoints([])
    }
  }

  const handleSelectEndpoint = (endpointId: string, checked: boolean) => {
    if (checked) {
      setSelectedEndpoints([...selectedEndpoints, endpointId])
    } else {
      setSelectedEndpoints(selectedEndpoints.filter((id) => id !== endpointId))
    }
  }

  const handleCreateEndpoint = () => {
    if (!newEndpoint.targetId || !newEndpoint.url) {
      toast.error("Target ID와 URL은 필수 입력값입니다.")
      return
    }

    const endpoint: TargetEndpoint = {
      id: Date.now().toString(),
      targetId: newEndpoint.targetId,
      url: newEndpoint.url,
      description: newEndpoint.description,
      createdAt: new Date().toISOString().split("T")[0],
    }

    setEndpoints([...endpoints, endpoint])
    setNewEndpoint({ targetId: "", url: "", description: "" })
    setIsCreateModalOpen(false)
    toast.success("Target Endpoint가 성공적으로 생성되었습니다.")
  }

  const handleEditEndpoint = (endpoint: TargetEndpoint) => {
    setEditingEndpoint(endpoint)
    setNewEndpoint({
      targetId: endpoint.targetId,
      url: endpoint.url,
      description: endpoint.description,
    })
    setIsEditModalOpen(true)
  }

  const handleUpdateEndpoint = () => {
    if (!newEndpoint.targetId || !newEndpoint.url || !editingEndpoint) {
      toast.error("Target ID와 URL은 필수 입력값입니다.")
      return
    }

    setEndpoints(
      endpoints.map((endpoint) =>
        endpoint.id === editingEndpoint.id
          ? {
              ...endpoint,
              targetId: newEndpoint.targetId,
              url: newEndpoint.url,
              description: newEndpoint.description,
            }
          : endpoint,
      ),
    )

    setNewEndpoint({ targetId: "", url: "", description: "" })
    setEditingEndpoint(null)
    setIsEditModalOpen(false)
    toast.success("Target Endpoint가 성공적으로 수정되었습니다.")
  }

  const handleDeleteClick = () => {
    if (selectedEndpoints.length > 0) {
      setDeleteType("selected")
    } else {
      setDeleteType("all")
    }
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (deleteType === "selected") {
      setEndpoints(endpoints.filter((endpoint) => !selectedEndpoints.includes(endpoint.id)))
      toast.success(`${selectedEndpoints.length}개의 Target Endpoint가 삭제되었습니다.`)
      setSelectedEndpoints([])
    } else {
      setEndpoints([])
      toast.success("모든 Target Endpoint가 삭제되었습니다.")
    }
    setIsDeleteDialogOpen(false)
  }

  const selectedEndpointDetails = endpoints.filter((endpoint) => selectedEndpoints.includes(endpoint.id))

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
              <BreadcrumbPage>Target Endpoints</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Target Endpoints
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">API 대상 엔드포인트를 관리합니다</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setIsCreateModalOpen(true)} className="bg-blue-500 hover:bg-blue-600 text-white">
              <Plus className="h-4 w-4 mr-2" />
              생성
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteClick}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {selectedEndpoints.length > 0 ? `선택 삭제 (${selectedEndpoints.length}개)` : "전체 삭제"}
            </Button>
          </div>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Target ID, URL, 설명으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle>Target Endpoints 목록</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={filteredEndpoints.length > 0 && selectedEndpoints.length === filteredEndpoints.length}
                      onCheckedChange={handleSelectAll}
                      aria-label="전체 선택"
                    />
                  </TableHead>
                  <TableHead>Target ID</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    생성일자
                  </TableHead>
                  <TableHead>설명</TableHead>
                  <TableHead className="text-right">작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEndpoints.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      {searchTerm ? "검색 결과가 없습니다." : "등록된 Target Endpoint가 없습니다."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEndpoints.map((endpoint) => (
                    <TableRow key={endpoint.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedEndpoints.includes(endpoint.id)}
                          onCheckedChange={(checked) => handleSelectEndpoint(endpoint.id, !!checked)}
                          aria-label={`${endpoint.targetId} 선택`}
                        />
                      </TableCell>
                      <TableCell className="font-mono text-sm">{endpoint.targetId}</TableCell>
                      <TableCell className="font-mono text-sm text-blue-600">{endpoint.url}</TableCell>
                      <TableCell className="text-gray-600">{endpoint.createdAt}</TableCell>
                      <TableCell>{endpoint.description}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => handleEditEndpoint(endpoint)}>
                          <Edit className="h-4 w-4 mr-1" />
                          수정
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Create Modal */}
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
                Target Endpoint 생성
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="targetId" className="text-sm font-medium">
                  Target ID *
                </Label>
                <Input
                  id="targetId"
                  value={newEndpoint.targetId}
                  onChange={(e) => setNewEndpoint({ ...newEndpoint, targetId: e.target.value })}
                  placeholder="target-001"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="url" className="text-sm font-medium">
                  URL *
                </Label>
                <Input
                  id="url"
                  value={newEndpoint.url}
                  onChange={(e) => setNewEndpoint({ ...newEndpoint, url: e.target.value })}
                  placeholder="https://api.example.com/v1"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-sm font-medium">
                  설명
                </Label>
                <Textarea
                  id="description"
                  value={newEndpoint.description}
                  onChange={(e) => setNewEndpoint({ ...newEndpoint, description: e.target.value })}
                  placeholder="엔드포인트에 대한 설명을 입력하세요"
                  className="mt-1"
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreateModalOpen(false)
                  setNewEndpoint({ targetId: "", url: "", description: "" })
                }}
              >
                취소
              </Button>
              <Button onClick={handleCreateEndpoint} className="bg-blue-500 hover:bg-blue-600 text-white">
                생성
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
                Target Endpoint 수정
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="editTargetId" className="text-sm font-medium">
                  Target ID *
                </Label>
                <Input
                  id="editTargetId"
                  value={newEndpoint.targetId}
                  onChange={(e) => setNewEndpoint({ ...newEndpoint, targetId: e.target.value })}
                  placeholder="target-001"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="editUrl" className="text-sm font-medium">
                  URL *
                </Label>
                <Input
                  id="editUrl"
                  value={newEndpoint.url}
                  onChange={(e) => setNewEndpoint({ ...newEndpoint, url: e.target.value })}
                  placeholder="https://api.example.com/v1"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="editDescription" className="text-sm font-medium">
                  설명
                </Label>
                <Textarea
                  id="editDescription"
                  value={newEndpoint.description}
                  onChange={(e) => setNewEndpoint({ ...newEndpoint, description: e.target.value })}
                  placeholder="엔드포인트에 대한 설명을 입력하세요"
                  className="mt-1"
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditModalOpen(false)
                  setEditingEndpoint(null)
                  setNewEndpoint({ targetId: "", url: "", description: "" })
                }}
              >
                취소
              </Button>
              <Button onClick={handleUpdateEndpoint} className="bg-blue-500 hover:bg-blue-600 text-white">
                수정
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent className="sm:max-w-[500px]">
            <AlertDialogHeader>
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <AlertDialogTitle className="text-lg font-semibold text-red-900 dark:text-red-100">
                    {deleteType === "selected" ? "선택된 항목 삭제" : "전체 삭제"}
                  </AlertDialogTitle>
                </div>
              </div>
            </AlertDialogHeader>

            <AlertDialogDescription asChild>
              <div className="space-y-4">
                {deleteType === "selected" ? (
                  <>
                    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                      <p className="text-red-800 dark:text-red-200 font-medium mb-2">
                        ⚠️ 다음 {selectedEndpoints.length}개의 Target Endpoint가 영구적으로 삭제됩니다:
                      </p>
                      <div className="max-h-32 overflow-y-auto space-y-1">
                        {selectedEndpointDetails.map((endpoint) => (
                          <div key={endpoint.id} className="text-sm text-red-700 dark:text-red-300">
                            • {endpoint.targetId} ({endpoint.url})
                          </div>
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      이 작업은 되돌릴 수 없습니다. 정말로 선택된 Target Endpoint들을 삭제하시겠습니까?
                    </p>
                  </>
                ) : (
                  <>
                    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                      <p className="text-red-800 dark:text-red-200 font-medium">
                        🚨 모든 Target Endpoint ({endpoints.length}개)가 영구적으로 삭제됩니다!
                      </p>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      <strong>경고:</strong> 이 작업은 되돌릴 수 없으며, 모든 데이터가 완전히 삭제됩니다. 정말로 모든
                      Target Endpoint를 삭제하시겠습니까?
                    </p>
                  </>
                )}
              </div>
            </AlertDialogDescription>

            <AlertDialogFooter className="gap-2">
              <AlertDialogCancel>취소</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700 text-white">
                {deleteType === "selected" ? `${selectedEndpoints.length}개 삭제` : "전체 삭제"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppLayout>
  )
}
