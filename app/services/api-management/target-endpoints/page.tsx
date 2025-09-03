'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import CreateEndpointDialog from './components/createEndpointDialog';
import ModifyEndpointDialog from './components/modifyEndpointDialog';
import DeleteEndpointDialog from './components/deleteEndpointDialog';
import { useGetEndpointsList } from '@/hooks/use-endpoints';

export interface TargetEndpoint {
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
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    const updatedEndpoints = endpoints.filter((endpoint) => !selectedIds.includes(endpoint.id));
    setEndpoints(updatedEndpoints);
    setSelectedIds([]);
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

        {/* 페이지 헤더 */}
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

            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4" />
              Endpoint 생성
            </Button>
          </div>
        </div>

        {/* Target Endpoints 리스트 */}
        <Card>
          <div className="pt-4"></div>
          <CardContent>
            <Table>
              <TableHeader className="hover:bg-white">
                <TableRow className="hover:bg-white">
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
                    <TableRow key={endpoint.id} className="hover:bg-white">
                      <TableCell className="font-medium">{endpoint.targetId}</TableCell>
                      <TableCell className="font-mono text-sm">{endpoint.url}</TableCell>
                      <TableCell>{endpoint.createdAt}</TableCell>
                      <TableCell>{endpoint.description}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            className="text-white hover:text-white bg-slate-500 hover:bg-slate-500"
                            size="sm"
                            onClick={() => handleEdit(endpoint)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteSingle(endpoint)}
                            className="bg-destructive">
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

        {/* Endpoint 생성 */}
        <CreateEndpointDialog
          isCreateModalOpen={isCreateModalOpen}
          formData={formData}
          setFormData={setFormData}
          handleModalClose={handleModalClose}
          handleCreateSubmit={handleCreateSubmit}
        />

        {/* Endpoint 수정 */}
        <ModifyEndpointDialog
          isEditModalOpen={isEditModalOpen}
          formData={formData}
          setFormData={setFormData}
          handleModalClose={handleModalClose}
          handleEditSubmit={handleEditSubmit}
        />

        {/* Endpoint 삭제 */}
        <DeleteEndpointDialog
          isDeleteModalOpen={isDeleteModalOpen}
          selectedIds={selectedIds}
          endpoints={endpoints}
          handleModalClose={handleModalClose}
          handleDeleteConfirm={handleDeleteConfirm}
        />
      </div>
    </AppLayout>
  );
}
