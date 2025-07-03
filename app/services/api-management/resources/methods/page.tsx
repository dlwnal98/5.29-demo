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
import { Plus, Search, Folder, FolderOpen, ChevronRight, ChevronDown, MoreHorizontal, Edit, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"

interface ResourceItem {
  id: string
  name: string
  type: "folder" | "resource"
  path: string
  methods?: string[]
  children?: ResourceItem[]
  isExpanded?: boolean
}

const mockResources: ResourceItem[] = [
  {
    id: "1",
    name: "users",
    type: "folder",
    path: "/users",
    isExpanded: true,
    children: [
      {
        id: "2",
        name: "{id}",
        type: "resource",
        path: "/users/{id}",
        methods: ["GET", "PUT", "DELETE"],
      },
      {
        id: "3",
        name: "profile",
        type: "resource",
        path: "/users/profile",
        methods: ["GET", "POST"],
      },
    ],
  },
  {
    id: "4",
    name: "products",
    type: "folder",
    path: "/products",
    isExpanded: false,
    children: [
      {
        id: "5",
        name: "{productId}",
        type: "resource",
        path: "/products/{productId}",
        methods: ["GET", "PUT", "DELETE"],
      },
      {
        id: "6",
        name: "categories",
        type: "folder",
        path: "/products/categories",
        children: [
          {
            id: "7",
            name: "{categoryId}",
            type: "resource",
            path: "/products/categories/{categoryId}",
            methods: ["GET"],
          },
        ],
      },
    ],
  },
  {
    id: "8",
    name: "orders",
    type: "resource",
    path: "/orders",
    methods: ["GET", "POST"],
  },
]

const getMethodColor = (method: string) => {
  switch (method) {
    case "GET":
      return "bg-green-100 text-green-700 border-green-200"
    case "POST":
      return "bg-blue-100 text-blue-700 border-blue-200"
    case "PUT":
      return "bg-yellow-100 text-yellow-700 border-yellow-200"
    case "DELETE":
      return "bg-red-100 text-red-700 border-red-200"
    case "PATCH":
      return "bg-purple-100 text-purple-700 border-purple-200"
    default:
      return "bg-gray-100 text-gray-700 border-gray-200"
  }
}

function ResourceTreeItem({
  item,
  level = 0,
  onToggle,
  onEdit,
  onDelete,
  onMethodClick,
}: {
  item: ResourceItem
  level?: number
  onToggle: (id: string) => void
  onEdit: (item: ResourceItem) => void
  onDelete: (item: ResourceItem) => void
  onMethodClick: (item: ResourceItem, method: string) => void
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
              <div className="w-5 h-5 bg-green-100 rounded border border-green-200 flex items-center justify-center">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="font-medium text-gray-900">{item.name}</div>
            <div className="text-sm text-gray-500">{item.path}</div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {item.methods && (
            <div className="flex space-x-1">
              {item.methods.map((method) => (
                <Badge
                  key={method}
                  variant="outline"
                  className={`text-xs px-2 py-1 cursor-pointer hover:opacity-80 ${getMethodColor(method)}`}
                  onClick={() => onMethodClick(item, method)}
                >
                  {method}
                </Badge>
              ))}
            </div>
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
          <ResourceTreeItem
            key={child.id}
            item={child}
            level={level + 1}
            onToggle={onToggle}
            onEdit={onEdit}
            onDelete={onDelete}
            onMethodClick={onMethodClick}
          />
        ))}
    </div>
  )
}

export default function MethodsPage() {
  const router = useRouter()
  const [resources, setResources] = useState<ResourceItem[]>(mockResources)
  const [searchTerm, setSearchTerm] = useState("")

  const handleToggle = (id: string) => {
    const updateResources = (items: ResourceItem[]): ResourceItem[] => {
      return items.map((item) => {
        if (item.id === id) {
          return { ...item, isExpanded: !item.isExpanded }
        }
        if (item.children) {
          return { ...item, children: updateResources(item.children) }
        }
        return item
      })
    }
    setResources(updateResources(resources))
  }

  const handleEdit = (item: ResourceItem) => {
    console.log("Edit resource:", item)
  }

  const handleDelete = (item: ResourceItem) => {
    console.log("Delete resource:", item)
  }

  const handleMethodClick = (item: ResourceItem, method: string) => {
    router.push(`/services/api-management/resources/methods/${item.id}?method=${method}`)
  }

  const filteredResources = resources.filter((resource) =>
    resource.name.toLowerCase().includes(searchTerm.toLowerCase()),
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
              <BreadcrumbLink href="/services/api-management/resources">리소스</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>메서드</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">메서드</h1>
            <p className="text-gray-600 mt-1">리소스의 메서드를 관리하고 구성하세요.</p>
          </div>
          <Button onClick={() => router.push("/services/api-management/resources/methods/create")}>
            <Plus className="h-4 w-4 mr-2" />
            메서드 생성
          </Button>
        </div>

        {/* Resource List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>리소스 및 메서드 목록</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="리소스 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="border rounded-lg">
              {filteredResources.length > 0 ? (
                filteredResources.map((resource) => (
                  <ResourceTreeItem
                    key={resource.id}
                    item={resource}
                    onToggle={handleToggle}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onMethodClick={handleMethodClick}
                  />
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <div className="text-lg font-medium mb-2">리소스가 없습니다</div>
                  <p className="text-sm">새로운 리소스를 생성해보세요.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
