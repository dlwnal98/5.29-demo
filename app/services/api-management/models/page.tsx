'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
import { Plus, Trash2, Search } from 'lucide-react';
import CreateModelDialog from './components/CreateModelDialog';
import ModifyModelDialog from './components/ModifyModelDialog';
import DeleteModelDialog from './components/DeleteModelDialog';
import { ModelData, useGetModelList } from '@/hooks/use-model';
import { useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/store';

export default function ModelsPage() {
  const [selectedModel, setSelectedModel] = useState<ModelData | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const params = useSearchParams();
  const apiId = params.get('apiId');
  const userData = useAuthStore((state) => state.user);

  const { data: models = [] } = useGetModelList(apiId || '');

  const openEditModal = (model: ModelData) => {
    setSelectedModel(model);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (model: ModelData) => {
    setSelectedModel(model);
    setIsDeleteModalOpen(true);
  };

  return (
    <AppLayout>
      <div className="space-y-6 container px-4 py-6">
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
              <BreadcrumbPage>Models</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Models</h1>
            <p className="text-gray-600 mt-1">
              모델을 사용하여 API에서 사용하는 다양한 요청 및 응답의 본문 형식을 정의합니다.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => {
                // resetForm();
                setIsCreateModalOpen(true);
              }}
              // className="bg-orange-500 hover:bg-orange-600 text-white"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg">
              <Plus className="h-4 w-4 mr-2" />
              모델 생성
            </Button>
          </div>
        </div>

        {/* Models Table */}
        <Card>
          <div className="pt-4"></div>
          <CardContent>
            <Table>
              <TableHeader className="hover:bg-white">
                <TableRow className="hover:bg-white">
                  <TableHead className="text-center w-[10%]">ID</TableHead>
                  <TableHead>이름</TableHead>
                  <TableHead>설명</TableHead>
                  <TableHead className="text-center w-[8%]">작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="[&_tr:nth-last-child(2)]:border-0">
                {models.length > 0 ? (
                  models.map((model) => (
                    <>
                      <TableRow key={model.modelId}>
                        <TableCell>
                          <span className="font-mono font-medium text-blue-600">
                            {model.modelId}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className=" font-medium ">{model.modelName}</span>
                        </TableCell>
                        <TableCell className="max-w-md">
                          <span className="text-gray-600 truncate block">{model.description}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end space-x-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditModal(model);
                              }}
                              className="h-8 w-8 p-0">
                              <Search className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                openDeleteModal(model);
                              }}
                              className="h-8 w-8 p-0 text-red-600 bg-white hover:text-red-700 hover:bg-red-50 border-red-200">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    </>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      검색 결과가 없습니다.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Create Model Modal */}
        <CreateModelDialog
          open={isCreateModalOpen}
          onOpenChange={setIsCreateModalOpen}
          apiId={apiId || ''}
          userKey={userData?.userKey || ''}
        />
        {/* Edit Model Modal */}

        <ModifyModelDialog
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          selectedModel={selectedModel || {}}
          userKey={userData?.userKey || ''}
        />

        {/* Delete Confirmation Modal */}
        <DeleteModelDialog
          open={isDeleteModalOpen}
          onOpenChange={setIsDeleteModalOpen}
          modelId={selectedModel?.modelId || ''}
          modelName={selectedModel?.modelName || ''}
          userKey={userData?.userKey || ''}
        />
      </div>
    </AppLayout>
  );
}
