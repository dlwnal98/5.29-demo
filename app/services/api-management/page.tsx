'use client';

import type React from 'react';
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
import { Plus, Search, Settings, RefreshCw, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Toaster } from 'sonner';
import { setSelectedApiInfo } from '@/constants/app-layout-data';
import { Suspense } from 'react';
import ApiCreateModal from './components/ApiCreateModal';
import ApiModifyModal from './components/ApiModifyModal';
import { ApiDeleteModal } from './components/ApiDeleteModal';
import CommonPagination from '@/components/common-pagination';
import { useAuthStore } from '@/store/store';
import { useGetAPIList } from '@/hooks/use-apimanagement';

export interface Apis {
  apiId: string;
  organizationId: string;
  name: string;
  description: string;
  version: string;
  enabled: boolean;
}

const apisData: Apis[] = [
  {
    apiId: 'API123456789',
    organizationId: 'ORG123456789',
    name: 'User Management API',
    description: '사용자 관리 API',
    version: '1.0.0',
    enabled: true,
  },
  {
    apiId: 'API987654321',
    organizationId: 'ORG123456789',
    name: 'Product Catalog API',
    description: '상품 카탈로그 API',
    version: '2.1.0',
    enabled: true,
  },
];

export default function ApiManagementPage() {
  // 유저 토큰 내 정보
  const userData = useAuthStore((state) => state.user);

  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);
  const [isMethodDeleteDialogOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAPIId, setSelectedAPIId] = useState('');
  // Modify API Modal State
  const [modifyApiForm, setModifyApiForm] = useState({
    // type: 'new', // 이거 데이터에 있어야함
    name: '',
    description: '',
  });

  const filteredPlans = apisData.filter(
    (plan) =>
      plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.apiId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 페이지네이션
  const safeFilteredUsers = filteredPlans ?? [];

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const totalPages = Math.ceil(safeFilteredUsers.length / usersPerPage);

  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const currentUsers = safeFilteredUsers?.slice(startIndex, endIndex);

  // const { data: apisData } = useGetAPIList(userData?.organizationId,currentPage,usersPerPage);

  const router = useRouter();

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleApiClick = (api: Apis) => {
    // API 정보를 localStorage에 저장하고 사이드바에 설정
    setSelectedApiInfo(api.name, api.apiId);

    setSelectedAPIId(api.apiId);
    // Navigate to API resource creation page
    router.push(`/services/api-management/resources?apiId=${api.apiId}&apiName=${api.name}`);
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AppLayout>
        <Toaster position="bottom-center" richColors expand={true} />
        <div className="space-y-6 container px-4 py-6">
          {/* Breadcrumb */}
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/services/api-management">Services</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>API Management</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">APIs</h1>
              <p className="text-gray-600 mt-1">API 계획을 관리하고 배포하세요.</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="API Plan 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4 " />
              </Button>
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="h-4 w-4" />
                API 생성
              </Button>
            </div>
          </div>

          {/* -------------------------API List------------------------- */}
          <Card>
            <div className="pt-4"></div>
            <CardContent>
              <Table>
                <TableHeader className="hover:bg-white">
                  <TableRow className="hover:bg-white">
                    <TableHead className="w-[20%]">이름</TableHead>
                    <TableHead className="w-3">ID</TableHead>
                    <TableHead>설명</TableHead>
                    <TableHead className="w-3 text-center">작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPlans.length > 0 ? (
                    filteredPlans.map((plan) => (
                      <TableRow
                        key={plan.apiId}
                        onClick={() => handleApiClick(plan)}
                        className="hover:cursor-pointer">
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium hover:cursor-pointer">{plan.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{plan.apiId}</TableCell>
                        <TableCell className="max-w-xs truncate">{plan.description}</TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              className="text-white hover:text-white bg-slate-500 hover:bg-slate-500"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsModifyModalOpen(true);
                                setModifyApiForm((prev) => ({
                                  ...prev,
                                  name: plan.name,
                                  description: plan.description,
                                }));
                              }}>
                              <Settings className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="hover:bg-destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsDeleteModalOpen(true);
                              }}>
                              <Trash2 />
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

          {/* Pagination */}
          {totalPages > 1 && (
            <CommonPagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
              groupSize={5}
            />
          )}

          {/* Create API Modal */}
          <ApiCreateModal
            userId={userData?.userId}
            userKey={userData?.userKey}
            organizationId={userData?.organizationId}
            open={isCreateModalOpen}
            onOpenChange={setIsCreateModalOpen}
          />

          {/* Modify API Plan */}
          <ApiModifyModal
            open={isModifyModalOpen}
            onOpenChange={setIsModifyModalOpen}
            existingValue={modifyApiForm}
            selectedAPIId={selectedAPIId}
            userId={userData?.userId || ''}
          />

          <ApiDeleteModal
            open={isMethodDeleteDialogOpen}
            onOpenChange={setIsDeleteModalOpen}
            selectedAPIId={selectedAPIId}
          />
        </div>
      </AppLayout>
    </Suspense>
  );
}
