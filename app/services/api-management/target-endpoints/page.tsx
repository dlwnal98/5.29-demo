"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Search, Edit, Trash2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface TargetEndpoint {
  id: string;
  targetId: string;
  url: string;
  createdAt: string;
  description: string;
}

const mockEndpoints: TargetEndpoint[] = [
  {
    id: "1",
    targetId: "endpoint-001",
    url: "https://api.example.com/v1",
    createdAt: "2024-01-15",
    description: "메인 API 서버 엔드포인트",
  },
  {
    id: "2",
    targetId: "endpoint-002",
    url: "https://staging-api.example.com/v1",
    createdAt: "2024-01-20",
    description: "스테이징 환경 API 엔드포인트",
  },
  {
    id: "3",
    targetId: "endpoint-003",
    url: "https://dev-api.example.com/v1",
    createdAt: "2024-01-25",
    description: "개발 환경 API 엔드포인트",
  },
];

export default function TargetEndpointsPage() {
  const [endpoints, setEndpoints] = useState<TargetEndpoint[]>(mockEndpoints);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEndpoint, setSelectedEndpoint] =
    useState<TargetEndpoint | null>(null);
  const [formData, setFormData] = useState({
    targetId: "",
    url: "",
    description: "",
  });

  const filteredEndpoints = endpoints.filter(
    (endpoint) =>
      endpoint.targetId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      endpoint.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
      endpoint.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    setFormData({ targetId: "", url: "", description: "" });
    setIsCreateModalOpen(true);
  };

  const handleEdit = (endpoint: TargetEndpoint) => {
    setSelectedEndpoint(endpoint);
    setFormData({
      targetId: endpoint.targetId,
      url: endpoint.url,
      description: endpoint.description,
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = (endpoint: TargetEndpoint) => {
    setSelectedEndpoint(endpoint);
    setIsDeleteModalOpen(true);
  };

  const handleCreateSubmit = () => {
    if (!formData.targetId || !formData.url) {
      toast.error("필수 필드를 모두 입력해주세요.");
      return;
    }

    const newEndpoint: TargetEndpoint = {
      id: Date.now().toString(),
      targetId: formData.targetId,
      url: formData.url,
      description: formData.description,
      createdAt: new Date().toISOString().split("T")[0],
    };

    setEndpoints([...endpoints, newEndpoint]);
    setIsCreateModalOpen(false);
    setFormData({ targetId: "", url: "", description: "" });
    toast.success("Target Endpoint가 성공적으로 생성되었습니다.");
  };

  const handleEditSubmit = () => {
    if (!formData.targetId || !formData.url || !selectedEndpoint) {
      toast.error("필수 필드를 모두 입력해주세요.");
      return;
    }

    const updatedEndpoints = endpoints.map((endpoint) =>
      endpoint.id === selectedEndpoint.id
        ? {
            ...endpoint,
            targetId: formData.targetId,
            url: formData.url,
            description: formData.description,
          }
        : endpoint
    );

    setEndpoints(updatedEndpoints);
    setIsEditModalOpen(false);
    setSelectedEndpoint(null);
    setFormData({ targetId: "", url: "", description: "" });
    toast.success("Target Endpoint가 성공적으로 수정되었습니다.");
  };

  const handleDeleteConfirm = () => {
    if (!selectedEndpoint) return;

    const updatedEndpoints = endpoints.filter(
      (endpoint) => endpoint.id !== selectedEndpoint.id
    );
    setEndpoints(updatedEndpoints);
    setIsDeleteModalOpen(false);
    setSelectedEndpoint(null);
    toast.success("Target Endpoint가 성공적으로 삭제되었습니다.");
  };

  const handleModalClose = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedEndpoint(null);
    setFormData({ targetId: "", url: "", description: "" });
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/services">Services</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/services/api-management">
                API Management
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Target Endpoints</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Target Endpoints
            </h1>
            <p className="text-gray-600 mt-1">
              API 대상 엔드포인트를 관리하세요.
            </p>
          </div>

          <div className="flex gap-2">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="엔드포인트 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="destructive"
              onClick={() => setIsDeleteModalOpen(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              삭제
            </Button>
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              생성
            </Button>
          </div>
        </div>

        {/* Target Endpoints List */}
        <Card>
          <div className="pt-6"></div>
          <CardContent>
            <Table>
              <TableHeader className="hover:bg-white">
                <TableRow className="hover:bg-white">
                  <TableHead>Target ID</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>생성일자</TableHead>
                  <TableHead>설명</TableHead>
                  <TableHead className="text-right">수정</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEndpoints.length > 0 ? (
                  filteredEndpoints.map((endpoint) => (
                    <TableRow key={endpoint.id}>
                      <TableCell className="font-medium">
                        {endpoint.targetId}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {endpoint.url}
                      </TableCell>
                      <TableCell>{endpoint.createdAt}</TableCell>
                      <TableCell>{endpoint.description}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(endpoint)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-8 text-gray-500"
                    >
                      검색 결과가 없습니다.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Create Modal */}
        <Dialog open={isCreateModalOpen} onOpenChange={handleModalClose}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="mb-2">Target Endpoint 생성</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="create-url" className="text-sm font-medium">
                  Endpoint URL *
                </Label>
                <Input
                  id="create-url"
                  value={formData.url}
                  onChange={(e) =>
                    setFormData({ ...formData, url: e.target.value })
                  }
                  placeholder="https://api.example.com/v1"
                  className="mt-2"
                />
              </div>
              <div>
                <Label
                  htmlFor="create-description"
                  className="text-sm font-medium"
                >
                  설명
                </Label>
                <Textarea
                  id="create-description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="엔드포인트 설명을 입력하세요"
                  className="mt-2"
                />
              </div>
            </div>
            <DialogFooter className="flex space-x-2">
              <Button variant="outline" onClick={handleModalClose}>
                취소
              </Button>
              <Button onClick={handleCreateSubmit}>생성</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={handleModalClose}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="mb-2">Target Endpoint 수정</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-url" className="text-sm font-medium">
                  Endpoint URL *
                </Label>
                <Input
                  id="edit-url"
                  value={formData.url}
                  onChange={(e) =>
                    setFormData({ ...formData, url: e.target.value })
                  }
                  placeholder="https://api.example.com/v1"
                  className="mt-2"
                />
              </div>
              <div>
                <Label
                  htmlFor="edit-description"
                  className="text-sm font-medium"
                >
                  설명
                </Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="엔드포인트 설명을 입력하세요"
                  className="mt-2"
                />
              </div>
            </div>
            <DialogFooter className="flex space-x-2">
              <Button variant="outline" onClick={handleModalClose}>
                취소
              </Button>
              <Button onClick={handleEditSubmit}>수정</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Modal */}
        <Dialog open={isDeleteModalOpen} onOpenChange={handleModalClose}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader className="space-y-4">
              <DialogTitle className="flex items-center text-red-600">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Target Endpoint 삭제
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="font-semibold text-red-800 mb-2">
                  ⚠️ 이 작업은 실행 취소할 수 없습니다.
                </p>
                <p className="text-red-700 text-sm">
                  선택된 Target Endpoint가 영구적으로 삭제됩니다.
                  <br />
                  연결된 모든 API와 설정이 영향을 받을 수 있습니다.
                </p>
              </div>
              {selectedEndpoint && (
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm">
                    <strong>Target ID:</strong> {selectedEndpoint.targetId}
                  </p>
                  <p className="text-sm">
                    <strong>URL:</strong> {selectedEndpoint.url}
                  </p>
                </div>
              )}
            </div>
            <DialogFooter className="flex space-x-2">
              <Button variant="outline" onClick={handleModalClose}>
                취소
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteConfirm}
                className="bg-red-600 hover:bg-red-700"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                삭제
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
