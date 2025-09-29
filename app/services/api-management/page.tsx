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
import { Plus, Search, Settings, Trash2 } from 'lucide-react';
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
import { APIListData } from '@/hooks/use-apimanagement';

export default function ApiManagementPage() {
  const userData = useAuthStore((state) => state.user);

  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);
  const [isMethodDeleteDialogOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedApiName, setSelectedApiName] = useState('');
  const [selectedAPIId, setSelectedAPIId] = useState('');
  const [modifyApiForm, setModifyApiForm] = useState({
    name: '',
    description: '',
  });

  // 페이지네이션
  const [currentPage, setCurrentPage] = useState(0);
  const usersPerPage = 20;

  const { data: apisData } = useGetAPIList(
    userData?.organizationId || '',
    currentPage,
    usersPerPage
  );

  const filteredPlans = apisData?.filter(
    (plan) =>
      plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.apiId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const safeFilteredUsers = filteredPlans ?? [];

  const totalPages = Math.ceil(safeFilteredUsers.length / usersPerPage);

  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const currentUsers = safeFilteredUsers?.slice(startIndex, endIndex);

  const handleApiClick = (api: APIListData) => {
    // API 정보를 sessionStorage에 저장하고 사이드바에 설정
    setSelectedApiInfo(api.name, api.apiId);

    setSelectedAPIId(api.apiId);
    router.push(`/services/api-management/resources?apiId=${api.apiId}&apiName=${api.name}`);
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AppLayout>
        <Toaster position="bottom-center" richColors expand={true} />
        <div className="space-y-6 container px-4 py-6 mx-auto">
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
                  placeholder="검색어를 입력하세요."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg">
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
                    <TableHead className="w-[10%]">ID</TableHead>
                    <TableHead className="w-[25%]">이름</TableHead>
                    <TableHead className="w-auto">설명</TableHead>
                    <TableHead className="w-[10%]">수정일자</TableHead>
                    <TableHead className="w-[8%] text-center">작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {safeFilteredUsers?.length > 0 ? (
                    safeFilteredUsers?.map((plan) => (
                      <TableRow
                        key={plan.apiId}
                        onClick={() => handleApiClick(plan)}
                        className="hover:cursor-pointer">
                        <TableCell className="font-mono text-sm">{plan.apiId}</TableCell>

                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <span className="text-blue-600 font-medium hover:cursor-pointer">
                              {plan.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">{plan.description}</TableCell>
                        <TableCell className="max-w-xs truncate">
                          {new Date(plan.updatedAt).toLocaleDateString()}
                        </TableCell>
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
                                setSelectedAPIId(plan.apiId);
                              }}>
                              <Settings className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="hover:bg-destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedAPIId(plan.apiId);
                                setSelectedApiName(plan.name);
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

          {totalPages > 1 && (
            <CommonPagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
              groupSize={5}
            />
          )}

          <ApiCreateModal
            userKey={userData?.userKey || ''}
            organizationId={userData?.organizationId || ''}
            open={isCreateModalOpen}
            onOpenChange={setIsCreateModalOpen}
            apiList={safeFilteredUsers}
          />

          <ApiModifyModal
            open={isModifyModalOpen}
            onOpenChange={setIsModifyModalOpen}
            existingValue={modifyApiForm}
            selectedAPIId={selectedAPIId}
            userKey={userData?.userKey || ''}
          />

          <ApiDeleteModal
            open={isMethodDeleteDialogOpen}
            onOpenChange={setIsDeleteModalOpen}
            selectedAPIId={selectedAPIId}
            userKey={userData?.userKey || ''}
            apiName={selectedApiName}
          />
        </div>
      </AppLayout>
    </Suspense>
  );
}
