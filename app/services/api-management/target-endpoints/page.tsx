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
import CreateEndpointDialog from './components/createEndpointDialog';
import ModifyEndpointDialog from './components/modifyEndpointDialog';
import DeleteEndpointDialog from './components/deleteEndpointDialog';
import { useGetEndpointsList } from '@/hooks/use-endpoints';
import { useAuthStore } from '@/store/store';
import { EndpointsData } from '@/hooks/use-endpoints';

export default function TargetEndpointsPage() {
  const userData = useAuthStore((state) => state.user);
  const { data: endpoints = [] } = useGetEndpointsList(userData?.organizationId || '');

  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState('');
  const [formData, setFormData] = useState({
    targetId: '',
    url: '',
    description: '',
  });

  const filteredEndpoints = endpoints?.filter(
    (endpoint) =>
      endpoint.targetId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      endpoint.targetEndpoint.toLowerCase().includes(searchTerm.toLowerCase()) ||
      endpoint.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    setFormData({ targetId: '', url: '', description: '' });
    setIsCreateModalOpen(true);
  };

  const handleEdit = (endpoint: EndpointsData) => {
    setFormData({
      targetId: endpoint.targetId,
      url: endpoint.targetEndpoint,
      description: endpoint.description,
    });
    setIsEditModalOpen(true);
  };

  const handleDeleteSingle = (endpoint: EndpointsData) => {
    setSelectedId(endpoint.targetId);
    setIsDeleteModalOpen(true);
  };

  const handleModalClose = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
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

            <Button
              onClick={handleCreate}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg">
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
                  <TableHead>설명</TableHead>
                  <TableHead>생성일자</TableHead>

                  <TableHead className="text-center w-3">수정</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEndpoints?.length > 0 ? (
                  filteredEndpoints?.map((endpoint, id) => (
                    <TableRow key={id} className="hover:bg-white">
                      <TableCell className="font-medium">{endpoint.targetId}</TableCell>
                      <TableCell className="font-mono text-sm">{endpoint.targetEndpoint}</TableCell>
                      <TableCell>{endpoint.description}</TableCell>
                      <TableCell>{new Date(endpoint.createdAt).toLocaleDateString()}</TableCell>

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
          handleModalClose={handleModalClose}
          organizationId={userData?.organizationId || ''}
          createdBy={userData?.userKey || ''}
        />

        {/* Endpoint 수정 */}
        <ModifyEndpointDialog
          isEditModalOpen={isEditModalOpen}
          formData={formData}
          handleModalClose={handleModalClose}
          updatedBy={userData?.userKey || ''}
          targetId={formData.targetId || ''}
        />

        {/* Endpoint 삭제 */}
        <DeleteEndpointDialog
          isDeleteModalOpen={isDeleteModalOpen}
          handleModalClose={handleModalClose}
          targetId={selectedId || ''}
        />
      </div>
    </AppLayout>
  );
}
