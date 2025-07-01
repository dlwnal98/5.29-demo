"use client"

import { AppLayout } from "@/components/layout/AppLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
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
  Filter,
  ChevronDown,
  ChevronUp,
  Info,
  Settings,
  ExternalLink,
  Activity,
  Code,
  FileText,
  Edit,
  Trash2,
  Copy,
  Eye,
  Download,
  Upload,
} from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface Product {
  id: string
  name: string
  description: string
  status: "active" | "inactive"
  createdDate: string
  expanded?: boolean
}

export default function ServicesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [products, setProducts] = useState<Product[]>([
    {
      id: "ialbk21583",
      name: "클라우드",
      description: "클라우드 마켓플레이스",
      status: "active",
      createdDate: "2025-06",
      expanded: false,
    },
    {
      id: "72vwSwjtzi",
      name: "인식 생성",
      description: "테스트",
      status: "inactive",
      createdDate: "2025-05",
      expanded: false,
    },
    {
      id: "by7e2wj923",
      name: "test gw",
      description: "게이트웨이 테스트",
      status: "inactive",
      createdDate: "2025-04",
      expanded: false,
    },
  ])

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    status: "active" as "active" | "inactive",
  })

  const router = useRouter()

  const handleApiManagement = (productId: string) => {
    router.push(`/services/api-management?productId=${productId}`)
  }

  const handleRefresh = () => {
    toast.success("페이지가 새로고침되었습니다.")
    window.location.reload()
  }

  const handleCreateProduct = () => {
    if (!newProduct.name.trim()) {
      toast.error("제품 이름을 입력해주세요.")
      return
    }

    const product: Product = {
      id: `prod_${Date.now()}`,
      name: newProduct.name,
      description: newProduct.description,
      status: newProduct.status,
      createdDate: new Date().toISOString().slice(0, 7),
      expanded: false,
    }

    setProducts([product, ...products])
    setNewProduct({ name: "", description: "", status: "active" })
    setIsCreateModalOpen(false)
    toast.success("제품이 생성되었습니다.")
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setIsEditModalOpen(true)
  }

  const handleUpdateProduct = () => {
    if (!editingProduct) return

    setProducts(products.map((p) => (p.id === editingProduct.id ? editingProduct : p)))
    setIsEditModalOpen(false)
    setEditingProduct(null)
    toast.success("제품이 수정되었습니다.")
  }

  const handleDeleteProduct = (productId: string) => {
    setProducts(products.filter((p) => p.id !== productId))
    toast.success("제품이 삭제되었습니다.")
  }

  const handleCopyProduct = (product: Product) => {
    const copiedProduct: Product = {
      ...product,
      id: `${product.id}_copy_${Date.now()}`,
      name: `${product.name} (복사본)`,
      expanded: false,
    }
    setProducts([copiedProduct, ...products])
    toast.success("제품이 복사되었습니다.")
  }

  const toggleProductExpansion = (productId: string) => {
    setProducts(products.map((p) => (p.id === productId ? { ...p, expanded: !p.expanded } : p)))
  }

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()),
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
              <BreadcrumbPage>My Products</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Products</h1>
            <Info className="h-5 w-5 text-blue-500" />
          </div>
          <div className="flex items-center gap-3">
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Product 생성
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>새 제품 생성</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">제품 이름</Label>
                    <Input
                      id="name"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      placeholder="제품 이름을 입력하세요"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">설명</Label>
                    <Textarea
                      id="description"
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                      placeholder="제품 설명을 입력하세요"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="status"
                      checked={newProduct.status === "active"}
                      onCheckedChange={(checked) =>
                        setNewProduct({ ...newProduct, status: checked ? "active" : "inactive" })
                      }
                    />
                    <Label htmlFor="status">활성화</Label>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                      취소
                    </Button>
                    <Button onClick={handleCreateProduct}>생성</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button variant="outline" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              새로 고침
            </Button>
          </div>
        </div>

        {/* Action Buttons and Search */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => {
                  const selectedProducts = products.filter(
                    (_, index) => document.querySelector(`input[data-product-id="${products[index].id}"]`)?.checked,
                  )
                  if (selectedProducts.length === 0) {
                    toast.error("수정할 제품을 선택해주세요.")
                    return
                  }
                  if (selectedProducts.length > 1) {
                    toast.error("한 번에 하나의 제품만 수정할 수 있습니다.")
                    return
                  }
                  handleEditProduct(selectedProducts[0])
                }}
              >
                <Edit className="h-4 w-4 mr-2" />
                수정
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  const checkboxes = document.querySelectorAll("input[data-product-id]:checked")
                  if (checkboxes.length === 0) {
                    toast.error("삭제할 제품을 선택해주세요.")
                    return
                  }
                  checkboxes.forEach((checkbox) => {
                    const productId = checkbox.getAttribute("data-product-id")
                    if (productId) handleDeleteProduct(productId)
                  })
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                삭제
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Product 이름"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                필터
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    구독 방식: 전체
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>전체</DropdownMenuItem>
                  <DropdownMenuItem>유료</DropdownMenuItem>
                  <DropdownMenuItem>무료</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    개체: 전체
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>전체</DropdownMenuItem>
                  <DropdownMenuItem>활성</DropdownMenuItem>
                  <DropdownMenuItem>비활성</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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

          {/* Products Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <input type="checkbox" className="rounded" />
                </TableHead>
                <TableHead>Product ID</TableHead>
                <TableHead>Product 이름</TableHead>
                <TableHead>설명</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>APIs</TableHead>
                <TableHead>Catalog</TableHead>
                <TableHead>생성일</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product, index) => (
                <>
                  <TableRow
                    key={product.id}
                    className={product.status === "active" ? "bg-blue-50 dark:bg-blue-900/20" : ""}
                  >
                    <TableCell>
                      <input type="checkbox" className="rounded" data-product-id={product.id} />
                    </TableCell>
                    <TableCell className="font-medium text-blue-600">{product.id}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.description}</TableCell>
                    <TableCell>
                      <Badge variant={product.status === "active" ? "default" : "secondary"}>
                        {product.status === "active" ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleApiManagement(product.id)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Code className="h-4 w-4" />
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => toast.info("카탈로그 페이지로 이동합니다.")}>
                        <FileText className="h-4 w-4" />
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{product.createdDate}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => toggleProductExpansion(product.id)}>
                        {product.expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </Button>
                    </TableCell>
                  </TableRow>
                  {product.expanded && (
                    <TableRow>
                      <TableCell colSpan={9} className="bg-gray-50 dark:bg-gray-800/50">
                        <div className="p-4 space-y-4">
                          <div className="flex gap-2 flex-wrap">
                            <Button variant="outline" size="sm" onClick={() => handleEditProduct(product)}>
                              <Edit className="h-4 w-4 mr-2" />
                              편집
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleDeleteProduct(product.id)}>
                              <Trash2 className="h-4 w-4 mr-2" />
                              삭제
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleCopyProduct(product)}>
                              <Copy className="h-4 w-4 mr-2" />
                              복제
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => toast.info("상세 정보를 확인합니다.")}>
                              <Eye className="h-4 w-4 mr-2" />
                              상세보기
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => toast.info("설정 페이지로 이동합니다.")}>
                              <Settings className="h-4 w-4 mr-2" />
                              설정
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => toast.info("데이터를 내보냅니다.")}>
                              <Download className="h-4 w-4 mr-2" />
                              내보내기
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => toast.info("데이터를 가져옵니다.")}>
                              <Upload className="h-4 w-4 mr-2" />
                              가져오기
                            </Button>
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            <p>
                              <strong>생성일:</strong> {product.createdDate}
                            </p>
                            <p>
                              <strong>상태:</strong> {product.status === "active" ? "활성" : "비활성"}
                            </p>
                            <p>
                              <strong>설명:</strong> {product.description}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* API Monitoring Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 mb-6 p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-500" />
            API 모니터링
          </h3>
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">0</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">성공</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">0</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">요청</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">0</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">실패</div>
            </div>
          </div>
        </div>

        {/* APIs Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Code className="h-5 w-5 text-blue-500" />
              APIs
            </h3>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>API 이름</TableHead>
                <TableHead>정의된 메서드</TableHead>
                <TableHead>Stage Document</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>
                  <span className="text-blue-600 font-medium">stt</span>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">1</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="link"
                      size="sm"
                      className="text-blue-600 p-0"
                      onClick={() => toast.info("neverett 문서를 확인합니다.")}
                    >
                      neverett
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                    <Button
                      variant="link"
                      size="sm"
                      className="text-blue-600 p-0"
                      onClick={() => toast.info("pvstt 문서를 확인합니다.")}
                    >
                      pvstt
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
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

        {/* Edit Product Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>제품 수정</DialogTitle>
            </DialogHeader>
            {editingProduct && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-name">제품 이름</Label>
                  <Input
                    id="edit-name"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    placeholder="제품 이름을 입력하세요"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-description">설명</Label>
                  <Textarea
                    id="edit-description"
                    value={editingProduct.description}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    placeholder="제품 설명을 입력하세요"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit-status"
                    checked={editingProduct.status === "active"}
                    onCheckedChange={(checked) =>
                      setEditingProduct({ ...editingProduct, status: checked ? "active" : "inactive" })
                    }
                  />
                  <Label htmlFor="edit-status">활성화</Label>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                    취소
                  </Button>
                  <Button onClick={handleUpdateProduct}>수정</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  )
}
