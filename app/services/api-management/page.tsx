'use client';

import type React from 'react';
import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import { toast, Toaster } from 'sonner';
import { setSelectedApiInfo } from '@/constants/app-layout-data';
import { Suspense } from 'react';
import Pagination from '@/components/Pagination';
import ApiCreateModal from './components/ApiCreateModal';
import ApiModifyModal from './components/ApiModifyModal';
import { ApiDeleteModal } from './components/ApiDeleteModal';

interface ApiItem {
  id: string;
  name: string;
  description: string;
  apiId: string;
  protocol: string;
  endpointType: string;
  createdDate: string;
  selected: boolean;
}

export interface Apis {
  id: string;
  name: string;
  planId: string;
  description: string;
  createdAt: string;
  status: 'active' | 'inactive' | 'draft';
}

const mockApiPlans: Apis[] = [
  {
    id: '1',
    name: 'User Management API',
    planId: 'plan-001',
    description: '사용자 관리를 위한 REST API',
    createdAt: '2024-01-15 14:44:23',
    status: 'active',
  },
  {
    id: '2',
    name: 'Product Catalog API',
    planId: 'plan-002',
    description: '상품 카탈로그 조회 및 관리 API',
    createdAt: '2024-01-20 14:44:23',
    status: 'active',
  },
  {
    id: '3',
    name: 'Payment Processing API',
    planId: 'plan-003',
    description: '결제 처리를 위한 보안 API',
    createdAt: '2024-01-25 14:44:23',
    status: 'draft',
  },
  {
    id: '4',
    name: 'Analytics API',
    planId: 'plan-004',
    description: '데이터 분석 및 리포팅 API',
    createdAt: '2024-01-30 14:44:23',
    status: 'inactive',
  },
];

export default function ApiManagementPage() {
  // const [apiPlans, setApiPlans] = useState();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);
  const [isMethodDeleteDialogOpen, setIsDeleteModalOpen] = useState(false);
  const [apiToDelete, setApiToDelete] = useState<Apis | null>(null);
  // Create API Modal State
  const [createApiForm, setCreateApiForm] = useState({
    type: 'new',
    name: '',
    description: '',
    sourceApiId: '',
    swaggerContent: '',
    selectedExample: '',
  });

  // Modify API Modal State
  const [modifyApiForm, setModifyApiForm] = useState({
    type: 'new',
    name: '',
    description: '',
  });

  // Swagger states
  const [swaggerFile, setSwaggerFile] = useState<File | null>(null);

  const filteredPlans = mockApiPlans.filter(
    (plan) =>
      plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.planId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-amber-100 text-amber-700 border-amber-200';
    }
  };

  const router = useRouter();

  const [apis, setApis] = useState<ApiItem[]>([
    {
      id: '1',
      name: 'test',
      description: '테스트용',
      apiId: 'yrr5q5hoch',
      protocol: 'REST',
      endpointType: '지역',
      createdDate: '2025-05-21',
      selected: false,
    },
  ]);

  const handleRefresh = () => {
    toast.success('API 목록이 새로고침되었습니다.');
    // Simulate refresh
    setApis([...apis]);
  };

  const handleCreateApi = () => {
    if (!createApiForm.name.trim()) {
      toast.error('API 이름을 입력해주세요.');
      return;
    }

    // 타입별 추가 검증
    if (createApiForm.type === 'copy' && !createApiForm.sourceApiId) {
      toast.error('복사할 API를 선택해주세요.');
      return;
    }

    if (createApiForm.type === 'swagger' && !createApiForm.swaggerContent.trim()) {
      toast.error('Swagger 내용을 입력하거나 파일을 업로드해주세요.');
      return;
    }

    if (createApiForm.type === 'example' && !createApiForm.selectedExample) {
      toast.error('API 예제를 선택해주세요.');
      return;
    }

    const newApi: ApiItem = {
      id: Date.now().toString(),
      name: createApiForm.name,
      description: createApiForm.description,
      apiId: Math.random().toString(36).substring(2, 12),
      protocol: 'REST',
      endpointType: '지역',
      createdDate: new Date().toISOString().split('T')[0],
      selected: false,
    };

    setApis([...apis, newApi]);
    setIsCreateModalOpen(false);
    setCreateApiForm({
      type: 'new',
      name: '',
      description: '',
      sourceApiId: '',
      swaggerContent: '',
      selectedExample: '',
    });
    78;
    setSwaggerFile(null);
    toast.success(`API '${newApi.name}'이(가) 생성되었습니다.`);

    // api 생성 요청이 성공했을 때
    // const planId = newApi.apiId;
    // const name = newApi.name;
    // router.push(`/services/api-management/resources?apiId=${planId}&apiName=${name}`);
  };

  const handleModifyApi = () => {
    if (!modifyApiForm.name.trim()) {
      toast.error('API 이름을 입력해주세요.');
      return;
    }

    const newApi: ApiItem = {
      id: Date.now().toString(),
      name: modifyApiForm.name,
      description: modifyApiForm.description,
      apiId: Math.random().toString(36).substring(2, 12),
      protocol: 'REST',
      endpointType: '지역',
      createdDate: new Date().toISOString().split('T')[0],
      selected: false,
    };

    setApis([...apis, newApi]);
    setIsModifyModalOpen(false);
    setModifyApiForm({ type: 'new', name: '', description: '' });
    toast.success(`API '${newApi.name}'이(가) 수정되었습니다.`);
  };

  const handleApiClick = (api: Apis) => {
    // API 정보를 localStorage에 저장하고 사이드바에 설정
    setSelectedApiInfo(api.name, api.planId);
    // Navigate to API resource creation page
    router.push(`/services/api-management/resources?apiId=${api.planId}&apiName=${api.name}`);
  };

  const handleDeleteApi = () => {
    if (apiToDelete) {
      toast.success(` '${apiToDelete.name} Api' 가 삭제되었습니다.`);
      setApiToDelete(null);
      setIsDeleteModalOpen(false);
    }
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
                    <TableHead>이름</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>설명</TableHead>
                    <TableHead>배포 상태</TableHead>
                    <TableHead>생성일</TableHead>
                    <TableHead className="w-3 text-center">작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPlans.length > 0 ? (
                    filteredPlans.map((plan) => (
                      <TableRow
                        key={plan.id}
                        onClick={() => handleApiClick(plan)}
                        className="hover:cursor-pointer"
                      >
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium hover:cursor-pointer">{plan.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{plan.planId}</TableCell>
                        <TableCell className="max-w-xs truncate">{plan.description}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className={getStatusColor(plan.status)}>
                              {plan.status}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <span>{plan.createdAt}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              className="text-white hover:text-white bg-slate-500 hover:bg-slate-500"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsModifyModalOpen(true);
                              }}
                            >
                              <Settings className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="hover:bg-destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsDeleteModalOpen(true);
                              }}
                            >
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
          <Pagination />

          {/* Create API Modal */}
          <ApiCreateModal
            open={isCreateModalOpen}
            onOpenChange={setIsCreateModalOpen}
            onSuccess={handleCreateApi}
          />

          {/* Modify API Plan */}
          <ApiModifyModal
            open={isModifyModalOpen}
            onOpenChange={setIsModifyModalOpen}
            initialValue={{ name: modifyApiForm.name, description: modifyApiForm.description }}
            onSuccess={handleModifyApi}
          />

          <ApiDeleteModal
            open={isMethodDeleteDialogOpen}
            onOpenChange={setIsDeleteModalOpen}
            apiToDelete={apiToDelete}
            handleDeleteApi={handleDeleteApi}
          />
        </div>
      </AppLayout>
    </Suspense>
  );
}
