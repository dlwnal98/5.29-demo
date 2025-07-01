"use client"

import { AppLayout } from "@/components/layout/AppLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
  RefreshCw,
  Search,
  ChevronDown,
  Info,
  Edit,
  Trash2,
  Eye,
  ExternalLink,
  Copy,
  RotateCcw,
  Key,
} from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

interface ApiKey {
  id: string
  name: string
  description: string
  status: "active" | "inactive"
  primaryKey: string
  secondaryKey: string
}

export default function ApiKeysPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: "m8iv2tyj8g",
      name: "임시키",
      description: "임시로 만든 키",
      status: "active",
      primaryKey: "pk_live_51234567890abcdef1234567890abcdef12345678",
      secondaryKey: "sk_live_51234567890abcdef1234567890abcdef12345678",
    },
    {
      id: "bdvxa9y5iw",
      name: "apikey001",
      description: "apikey001",
      status: "active",
      primaryKey: "pk_live_98765432109876543210987654321098765432",
      secondaryKey: "sk_live_98765432109876543210987654321098765432",
    },
    {
      id: "6jnesgo4xl",
      name: "name",
      description: "name설명",
      status: "active",
      primaryKey: "pk_live_11223344556677889900112233445566778899",
      secondaryKey: "sk_live_11223344556677889900112233445566778899",
    },
  ])

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [editingApiKey, setEditingApiKey] = useState<ApiKey | null>(null)
  const [viewingApiKey, setViewingApiKey] = useState<ApiKey | null>(null)
  const [newApiKey, setNewApiKey] = useState({
    name: "",
    description: "",
  })

  const generateRandomKey = (prefix: string) => {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789"
    let result = prefix + "_live_"
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  const handleRefresh = () => {
    toast.success("페이지가 새로고침되었습니다.")
    window.location.reload()
  }

  const handleCreateApiKey = () => {
    if (!newApiKey.name.trim()) {
      toast.error("API Key 이름을 입력해주세요.")
      return
    }

    const apiKey: ApiKey = {
      id: Math.random().toString(36).substr(2, 10),
      name: newApiKey.name,
      description: newApiKey.description,
      status: "active",
      primaryKey: generateRandomKey("pk"),
      secondaryKey: generateRandomKey("sk"),
    }

    setApiKeys([apiKey, ...apiKeys])
    setNewApiKey({ name: "", description: "" })
    setIsCreateModalOpen(false)
    toast.success("API Key가 생성되었습니다.")
  }

  const handleEditApiKey = (apiKey: ApiKey) => {
    setEditingApiKey({ ...apiKey })
    setIsEditModalOpen(true)
  }

  const handleUpdateApiKey = () => {
    if (!editingApiKey) return

    setApiKeys(apiKeys.map((key) => (key.id === editingApiKey.id ? editingApiKey : key)))
    setIsEditModalOpen(false)
    setEditingApiKey(null)
    toast.success("API Key가 수정되었습니다.")
  }

  const handleDeleteApiKey = (apiKeyId: string) => {
    setApiKeys(apiKeys.filter((key) => key.id !== apiKeyId))
    toast.success("API Key가 삭제되었습니다.")
  }

  const handleViewDetails = (apiKey: ApiKey) => {
    setViewingApiKey(apiKey)
    setIsDetailModalOpen(true)
  }

  const handleRegenerateKey = (keyType: "primary" | "secondary") => {
    if (!viewingApiKey) return

    const newKey = generateRandomKey(keyType === "primary" ? "pk" : "sk")
    const updatedApiKey = {
      ...viewingApiKey,
      [keyType === "primary" ? "primaryKey" : "secondaryKey"]: newKey,
    }

    setViewingApiKey(updatedApiKey)
    setApiKeys(apiKeys.map((key) => (key.id === updatedApiKey.id ? updatedApiKey : key)))
    toast.success(`${keyType === "primary" ? "Primary" : "Secondary"} Key가 재생성되었습니다.`)
  }

  const handleCopyKey = (key: string, keyType: string) => {
    navigator.clipboard.writeText(key)
    toast.success(`${keyType} Key가 복사되었습니다.`)
  }

  const filteredApiKeys = apiKeys.filter(
    (apiKey) =>
      apiKey.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apiKey.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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
              <BreadcrumbPage>API Keys</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">API Keys</h1>
            <Info className="h-5 w-5 text-blue-500" />
          </div>
          <div className="flex items-center gap-3">
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  API Key 생성
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>새 API Key 생성</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">API Key 이름</Label>
                    <Input
                      id="name"
                      value={newApiKey.name}
                      onChange={(e) => setNewApiKey({ ...newApiKey, name: e.target.value })}
                      placeholder="API Key 이름을 입력하세요"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">설명</Label>
                    <Textarea
                      id="description"
                      value={newApiKey.description}
                      onChange={(e) => setNewApiKey({ ...newApiKey, description: e.target.value })}
                      placeholder="API Key 설명을 입력하세요"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                      취소
                    </Button>
                    <Button onClick={handleCreateApiKey}>생성</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button variant="outline" onClick={() => toast.info("상품에 대해 더 알아보기")}>
              상품 더 알아보기
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" onClick={handleRefresh}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  새로 고침
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={handleRefresh}>자동 새로고침</DropdownMenuItem>
                <DropdownMenuItem onClick={handleRefresh}>수동 새로고침</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Action Buttons and Search */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => {
                  const selectedKeys = apiKeys.filter(
                    (_, index) => document.querySelector(`input[data-key-id="${apiKeys[index].id}"]`)?.checked,
                  )
                  if (selectedKeys.length === 0) {
                    toast.error("수정할 API Key를 선택해주세요.")
                    return
                  }
                  if (selectedKeys.length > 1) {
                    toast.error("한 번에 하나의 API Key만 수정할 수 있습니다.")
                    return
                  }
                  handleEditApiKey(selectedKeys[0])
                }}
              >
                <Edit className="h-4 w-4 mr-2" />
                수정
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  const checkboxes = document.querySelectorAll("input[data-key-id]:checked")
                  if (checkboxes.length === 0) {
                    toast.error("삭제할 API Key를 선택해주세요.")
                    return
                  }
                  checkboxes.forEach((checkbox) => {
                    const keyId = checkbox.getAttribute("data-key-id")
                    if (keyId) handleDeleteApiKey(keyId)
                  })
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                삭제
              </Button>
              <Button variant="outline" onClick={() => toast.info("연결된 Stage를 확인합니다.")}>
                <Eye className="h-4 w-4 mr-2" />
                연결된 Stage 보기
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="API Key 이름"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    20 개씩 보기
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>10 개씩 보기</DropdownMenuItem>
                  <DropdownMenuItem>20 개씩 보기</DropdownMenuItem>
                  <DropdownMenuItem>50 개씩 보기</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* API Keys Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <input type="checkbox" className="rounded" />
                </TableHead>
                <TableHead>API Key ID</TableHead>
                <TableHead>API Key 이름</TableHead>
                <TableHead>설명</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>API keys</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApiKeys.map((apiKey) => (
                <TableRow key={apiKey.id} className="bg-blue-50 dark:bg-blue-900/20">
                  <TableCell>
                    <input type="checkbox" className="rounded" data-key-id={apiKey.id} />
                  </TableCell>
                  <TableCell className="font-medium text-blue-600">{apiKey.id}</TableCell>
                  <TableCell>{apiKey.name}</TableCell>
                  <TableCell>{apiKey.description}</TableCell>
                  <TableCell>
                    <Badge variant={apiKey.status === "active" ? "default" : "secondary"}>
                      {apiKey.status === "active" ? "활성" : "비활성"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(apiKey)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      상세보기
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

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

        {/* Edit API Key Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>API Key 수정</DialogTitle>
            </DialogHeader>
            {editingApiKey && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-name">API Key 이름</Label>
                  <Input
                    id="edit-name"
                    value={editingApiKey.name}
                    onChange={(e) => setEditingApiKey({ ...editingApiKey, name: e.target.value })}
                    placeholder="API Key 이름을 입력하세요"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-description">설명</Label>
                  <Textarea
                    id="edit-description"
                    value={editingApiKey.description}
                    onChange={(e) => setEditingApiKey({ ...editingApiKey, description: e.target.value })}
                    placeholder="API Key 설명을 입력하세요"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                    취소
                  </Button>
                  <Button onClick={handleUpdateApiKey}>수정</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* API Key Details Modal */}
        <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Key className="h-5 w-5 text-blue-500" />
                API Key 상세 정보
              </DialogTitle>
            </DialogHeader>
            {viewingApiKey && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">API Key ID</Label>
                    <p className="text-sm font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded">{viewingApiKey.id}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">이름</Label>
                    <p className="text-sm p-2">{viewingApiKey.name}</p>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-500">설명</Label>
                  <p className="text-sm p-2">{viewingApiKey.description}</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500 mb-2 block">Primary Key</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        value={viewingApiKey.primaryKey}
                        readOnly
                        className="font-mono text-xs bg-gray-50 dark:bg-gray-800"
                      />
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Primary Key 재생성</AlertDialogTitle>
                            <AlertDialogDescription>
                              Primary Key를 재생성하시겠습니까? 기존 키는 더 이상 사용할 수 없게 됩니다.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>취소</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleRegenerateKey("primary")}>재생성</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopyKey(viewingApiKey.primaryKey, "Primary")}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-500 mb-2 block">Secondary Key</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        value={viewingApiKey.secondaryKey}
                        readOnly
                        className="font-mono text-xs bg-gray-50 dark:bg-gray-800"
                      />
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Secondary Key 재생성</AlertDialogTitle>
                            <AlertDialogDescription>
                              Secondary Key를 재생성하시겠습니까? 기존 키는 더 이상 사용할 수 없게 됩니다.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>취소</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleRegenerateKey("secondary")}>
                              재생성
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopyKey(viewingApiKey.secondaryKey, "Secondary")}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDetailModalOpen(false)}>
                    닫기
                  </Button>
                  <Button onClick={() => handleEditApiKey(viewingApiKey)}>
                    <Edit className="h-4 w-4 mr-2" />
                    수정
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  )
}
