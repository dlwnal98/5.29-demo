'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Search, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface TargetEndpoint {
  id: string;
  targetId: string;
  url: string;
  createdAt: string;
  description: string;
}

const mockEndpoints: TargetEndpoint[] = [
  {
    id: '1',
    targetId: 'endpoint-001',
    url: 'https://api.example.com/v1',
    createdAt: '2024-01-15',
    description: '메인 API 서버 엔드포인트',
  },
  {
    id: '2',
    targetId: 'endpoint-002',
    url: 'https://staging-api.example.com/v1',
    createdAt: '2024-01-20',
    description: '스테이징 환경 API 엔드포인트',
  },
  {
    id: '3',
    targetId: 'endpoint-003',
    url: 'https://dev-api.example.com/v1',
    createdAt: '2024-01-25',
    description: '개발 환경 API 엔드포인트',
  },
];

export default function TargetEndpointsPage() {
  const [endpoints, setEndpoints] = useState<TargetEndpoint[]>(mockEndpoints);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEndpoint, setSelectedEndpoint] = useState<TargetEndpoint | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [deleteType, setDeleteType] = useState<'selected' | 'all'>('selected');
  const [formData, setFormData] = useState({
    targetId: '',
    url: '',
    description: '',
  });

  const filteredEndpoints = endpoints.filter(
    (endpoint) =>
      endpoint.targetId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      endpoint.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
      endpoint.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectAll = (checked: boolean) => {
    setIsSelectAll(checked);
    if (checked) {
      setSelectedIds(filteredEndpoints.map((endpoint) => endpoint.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id));
      setIsSelectAll(false);
    }
  };

  const handleCreate = () => {
    setFormData({ targetId: '', url: '', description: '' });
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

  const handleDelete = () => {
    if (selectedIds.length > 0) {
      setDeleteType('selected');
    } else {
      setDeleteType('all');
    }
    setIsDeleteModalOpen(true);
  };

  const handleCreateSubmit = () => {
    if (!formData.url) {
      toast.error('필수 필드를 모두 입력해주세요.');
      return;
    }

    const newEndpoint: TargetEndpoint = {
      id: Date.now().toString(),
      targetId: `endpoint-${Date.now()}`,
      url: formData.url,
      description: formData.description,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setEndpoints([...endpoints, newEndpoint]);
    setIsCreateModalOpen(false);
    setFormData({ targetId: '', url: '', description: '' });
    toast.success('Target Endpoint가 성공적으로 생성되었습니다.');
  };

  const handleEditSubmit = () => {
    if (!formData.url || !selectedEndpoint) {
      toast.error('필수 필드를 모두 입력해주세요.');
      return;
    }

    const updatedEndpoints = endpoints.map((endpoint) =>
      endpoint.id === selectedEndpoint.id
        ? {
            ...endpoint,
            url: formData.url,
            description: formData.description,
          }
        : endpoint
    );

    setEndpoints(updatedEndpoints);
    setIsEditModalOpen(false);
    setSelectedEndpoint(null);
    setFormData({ targetId: '', url: '', description: '' });
    toast.success('Target Endpoint가 성공적으로 수정되었습니다.');
  };

  const handleDeleteSingle = (endpoint: TargetEndpoint) => {
    setSelectedEndpoint(endpoint);
    setSelectedIds([endpoint.id]);
    setDeleteType('selected');
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deleteType === 'selected' && selectedIds.length > 0) {
      const updatedEndpoints = endpoints.filter((endpoint) => !selectedIds.includes(endpoint.id));
      setEndpoints(updatedEndpoints);
      setSelectedIds([]);
      setIsSelectAll(false);

      if (selectedIds.length === 1 && selectedEndpoint) {
        toast.success(
          `Target Endpoint "${selectedEndpoint.targetId}"가 성공적으로 삭제되었습니다.`
        );
      } else {
        toast.success(`${selectedIds.length}개의 Target Endpoint가 성공적으로 삭제되었습니다.`);
      }
    } else if (deleteType === 'all') {
      setEndpoints([]);
      setSelectedIds([]);
      setIsSelectAll(false);
      toast.success('모든 Target Endpoint가 성공적으로 삭제되었습니다.');
    }

    setIsDeleteModalOpen(false);
    setSelectedEndpoint(null);
  };

  const handleModalClose = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedEndpoint(null);
    setFormData({ targetId: '', url: '', description: '' });
  };

  const getDeleteModalContent = () => {
    if (deleteType === 'selected') {
      if (selectedEndpoint && selectedIds.length === 1) {
        // 개별 삭제인 경우
        return {
          title: 'Target Endpoint 삭제',
          description: `선택된 Target Endpoint가 영구적으로 삭제됩니다.`,
          details: `• ${selectedEndpoint.targetId} (${selectedEndpoint.url})`,
        };
      } else {
        // 다중 선택 삭제인 경우
        return {
          title: '선택된 Target Endpoint 삭제',
          description: `선택된 ${selectedIds.length}개의 Target Endpoint가 영구적으로 삭제됩니다.`,
          details: selectedIds
            .map((id) => {
              const endpoint = endpoints.find((e) => e.id === id);
              return endpoint ? `• ${endpoint.targetId} (${endpoint.url})` : '';
            })
            .filter(Boolean)
            .join('\n'),
        };
      }
    } else {
      return {
        title: '모든 Target Endpoint 삭제',
        description: `총 ${endpoints.length}개의 모든 Target Endpoint가 영구적으로 삭제됩니다.`,
        details: '이 작업은 모든 데이터를 완전히 제거하며, 복구할 수 없습니다.',
      };
    }
  };

  const modalContent = getDeleteModalContent();

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
              <BreadcrumbLink href="/services/api-management">API Management</BreadcrumbLink>
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
            <h1 className="text-2xl font-bold text-gray-900">Target Endpoints</h1>
            <p className="text-gray-600 mt-1">API 대상 엔드포인트를 관리하세요.</p>
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
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4" />
              Endpoint 생성
            </Button>
          </div>
        </div>

        {/* Target Endpoints List */}
        <Card>
          <div className="pt-4"></div>
          <CardContent>
            <Table>
              <TableHeader className="hover:bg-white">
                <TableRow className="hover:bg-white">
                  <TableHead className="w-12">
                    <Checkbox
                      checked={isSelectAll}
                      onCheckedChange={handleSelectAll}
                      aria-label="전체 선택"
                    />
                  </TableHead>
                  <TableHead>Target ID</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>생성일자</TableHead>
                  <TableHead>설명</TableHead>
                  <TableHead className="text-center w-3">수정</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEndpoints.length > 0 ? (
                  filteredEndpoints.map((endpoint) => (
                    <TableRow key={endpoint.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.includes(endpoint.id)}
                          onCheckedChange={(checked) =>
                            handleSelectItem(endpoint.id, checked as boolean)
                          }
                          aria-label={`${endpoint.targetId} 선택`}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{endpoint.targetId}</TableCell>
                      <TableCell className="font-mono text-sm">{endpoint.url}</TableCell>
                      <TableCell>{endpoint.createdAt}</TableCell>
                      <TableCell>{endpoint.description}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            className="text-white hover:text-white bg-slate-500 hover:bg-slate-500"
                            size="sm"
                            onClick={() => handleEdit(endpoint)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteSingle(endpoint)}
                            className="bg-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
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
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://api.example.com/v1"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="create-description" className="text-sm font-medium">
                  설명
                </Label>
                <Textarea
                  id="create-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://api.example.com/v1"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="edit-description" className="text-sm font-medium">
                  설명
                </Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
          <DialogContent className="sm:max-w-lg">
            <DialogHeader className="space-y-4">
              <DialogTitle className="flex items-center text-red-600">
                <AlertTriangle className="h-5 w-5 mr-2" />
                {modalContent.title}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="font-semibold text-red-800 mb-2">
                  ⚠️ 이 작업은 실행 취소할 수 없습니다.
                </p>
                <p className="text-red-700 text-sm mb-3">
                  {modalContent.description}
                  <br />
                  연결된 모든 API와 설정이 영향을 받을 수 있습니다.
                </p>
                {deleteType === 'all' && (
                  <div className="bg-red-100 border border-red-300 rounded p-3 mt-3">
                    <p className="text-red-800 font-semibold text-sm">🚨 전체 삭제 경고</p>
                    <p className="text-red-700 text-xs mt-1">
                      모든 Target Endpoint 데이터가 완전히 제거되며, 이는 시스템 전체에 영향을 줄 수
                      있습니다.
                    </p>
                  </div>
                )}
              </div>

              {deleteType === 'selected' && selectedIds.length > 0 && (
                <div className="bg-gray-50 p-3 rounded max-h-32 overflow-y-auto">
                  <p className="text-sm font-medium mb-2">삭제될 항목:</p>
                  {selectedIds.map((id) => {
                    const endpoint = endpoints.find((e) => e.id === id);
                    return endpoint ? (
                      <div key={id} className="text-xs text-gray-600 mb-1">
                        • <strong>{endpoint.targetId}</strong> - {endpoint.url}
                      </div>
                    ) : null;
                  })}
                </div>
              )}

              {deleteType === 'all' && (
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm font-medium text-gray-800">
                    총 <strong className="text-red-600">{endpoints.length}개</strong>의 Target
                    Endpoint가 삭제됩니다.
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
                {deleteType === 'selected' ? `선택 삭제 (${selectedIds.length}개)` : '전체 삭제'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
