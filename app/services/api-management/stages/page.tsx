'use client';

import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  ArrowLeft,
  ChevronRight,
  ChevronDown,
  Copy,
  Download,
  RotateCcw,
  Trash2,
  AlertTriangle,
  SquarePlus,
  SquareMinus,
  Settings,
  Search,
  ChevronLeft,
  Eye,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast, Toaster } from 'sonner';
import { useClipboard } from 'use-clipboard-copy';
import CreateStageDialog from './components/CreateStageDialog';
import { useAuthStore } from '@/store/store';
import ModifyStageDialog from './components/ModifyStageDialog';
import DeleteStageDialog from './components/DeleteStageDialog';
import {
  useGetStagesDocData,
  useGetDeployHistoryData,
  useActivatePreviousDeployment,
} from '@/hooks/use-stages';
import { buildTree } from '@/lib/etc';

interface ApiResource {
  id: string;
  path: string;
  name: string;
  children?: ApiResource[];
  methods: ApiMethod[];
}

interface ApiMethod {
  id: string;
  type: string;
  path: string;
  endpointUrl: string;
  description: string;
}

interface Stage {
  stageId?: string;
  id: string;
  name: string;
  description: string;
  cacheEnabled: boolean;
  throttleRate: number;
  burstRate: number;
  url: string;
  lastDeployed: string;
  deploymentId: string;
}

interface DeploymentRecord {
  id: string;
  stageName: string;
  date: string;
  status: 'active' | 'inactive' | 'failed';
  description: string;
  deploymentId: string;
  resources?: ApiResource[];
}

interface SelectedMethod {
  resourceId: string;
  resourcePath: string;
  method: ApiMethod;
  url: string;
}

// interface SelectedResource {
//   resource: ApiResource;
//   type: 'stage' | 'resource';
// }

export default function StagesPage() {
  const router = useRouter();
  const userData = useAuthStore((state) => state.user);
  const params = useSearchParams();
  const apiId = params.get('apiId');

  const { data: stagesDocData = [] } = useGetStagesDocData(apiId || '');
  const { data: deploymentHistoryData } = useGetDeployHistoryData(
    userData?.organizationId || '',
    0,
    20
  );

  //활성배포 변경
  const { mutate: changeDeployment } = useActivatePreviousDeployment({
    onSuccess: () => {
      toast.success('배포가 성공적으로 변경되었습니다.');
      setIsActiveDeploymentModalOpen(false);
      setSelectedDeployment(null);
    },
    onError: () => {
      toast.error('배포 변경에 실패하였습니다.');
    },
  });

  const [selectedStage, setSelectedStage] = useState<Stage>({
    stageId: '',
    id: 'hello',
    name: 'hello',
    description: '',
    cacheEnabled: false,
    throttleRate: 10000,
    burstRate: 5000,
    url: 'https://ynr5g5hoch.execute-api.ap-northeast-2.amazonaws.com/hello',
    lastDeployed: 'July 02, 2025, 17:44 (UTC+09:00)',
    deploymentId: '',
  });

  const [selectedResource, setSelectedResource] = useState<any>({
    // resource: resourceTree[0],
    resource: {},
    type: 'stage',
  });
  const resourceTree = buildTree(stagesDocData);

  useEffect(() => {
    setSelectedResource({ ...selectedResource, resource: resourceTree[0] });
  }, [apiId, selectedStage]);

  const [selectedMethod, setSelectedMethod] = useState<SelectedMethod | null>(null);

  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set(['hello']));
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateStageModalOpen, setIsCreateStageModalOpen] = useState(false);
  const [isDeleteStageDialogOpen, setIsDeleteStageDialogOpen] = useState(false);
  const [isRevokeDeploymentDialogOpen, setIsRevokeDeploymentDialogOpen] = useState(false);
  const [isRollbackModalOpen, setIsRollbackModalOpen] = useState(false);
  const [selectedRollbackDeployment, setSelectedRollbackDeployment] =
    useState<DeploymentRecord | null>(null);

  // 새로운 배포 기록 관련 상태
  const [selectedDeployment, setSelectedDeployment] = useState<string | null>(null);
  const [expandedDeployments, setExpandedDeployments] = useState<Set<string>>(new Set());
  const [deploymentSearchTerm, setDeploymentSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isActiveDeploymentModalOpen, setIsActiveDeploymentModalOpen] = useState(false);
  const itemsPerPage = 10;

  const clipboard = useClipboard();

  const getResourceKey = (resource: ApiResource, parentPath = '') => {
    return `${parentPath}${resource.path}-${resource.id}`;
  };

  const toggleExpanded = (resource: ApiResource, parentPath = '') => {
    const resourceKey = getResourceKey(resource, parentPath);
    const newExpanded = new Set(expandedPaths);
    if (newExpanded.has(resourceKey)) {
      newExpanded.delete(resourceKey);
    } else {
      newExpanded.add(resourceKey);
    }
    setExpandedPaths(newExpanded);
  };

  const handleBack = () => {
    router.push('/services/api-management');
  };

  const handleCopyUrl = () => {
    clipboard.copy(selectedStage.url);
    toast.success('URL이 클립보드에 복사되었습니다.');
  };

  const handleCopyMethodUrl = (url: string) => {
    clipboard.copy(url);
    toast.success('메서드 URL이 클립보드에 복사되었습니다.');
  };

  const handleResourceClick = (resource: any, type: 'stage' | 'resource') => {
    console.log(resource);
    if (type === 'stage') {
      setSelectedStage({
        ...selectedStage,
        stageId: resource.stageId,
        deploymentId: resource.deploymentId,
        description: resource.description,
        id: resource.id,
        name: resource.name,
      });
    }
    setSelectedResource({ resource, type });
    setSelectedMethod(null);
  };
  console.log(selectedStage);

  const handleMethodClick = (method: ApiMethod, resource: ApiResource) => {
    const methodUrl = `${selectedStage.url}${method.path}`;
    setSelectedMethod({
      resourceId: resource.id,
      resourcePath: resource.path,
      method,
      url: methodUrl,
    });
  };

  const handleExportApi = () => {
    toast.success('API 내보내기가 시작되었습니다.');
  };

  const handleRevokeDeployment = () => {
    setIsRevokeDeploymentDialogOpen(false);
    toast.success('배포가 회수되었습니다.');
  };

  const handleRollbackConfirm = () => {
    if (selectedRollbackDeployment) {
      toast.success(`배포 ${selectedRollbackDeployment.deploymentId}로 롤백되었습니다.`);
      setIsRollbackModalOpen(false);
      setSelectedRollbackDeployment(null);
    }
  };

  // 배포 기록 관련 함수들
  const filteredDeployments = deploymentHistoryData?.filter(
    (deployment) =>
      deployment.deploymentId.toLowerCase().includes(deploymentSearchTerm.toLowerCase()) ||
      deployment.description.toLowerCase().includes(deploymentSearchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredDeployments?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDeployments = filteredDeployments?.slice(startIndex, startIndex + itemsPerPage);

  const handleDeploymentSelect = (deploymentId: string) => {
    setSelectedDeployment(deploymentId);
  };

  const toggleDeploymentExpansion = (deploymentId: string) => {
    const newExpanded = new Set(expandedDeployments);
    if (newExpanded.has(deploymentId)) {
      newExpanded.delete(deploymentId);
    } else {
      newExpanded.add(deploymentId);
    }
    setExpandedDeployments(newExpanded);
  };

  const handleActiveDeploymentChange = () => {
    if (!selectedDeployment) return;
    setIsActiveDeploymentModalOpen(true);
  };

  const confirmActiveDeploymentChange = () => {
    if (selectedStage.stageId && selectedDeployment) {
      // const deployment = deploymentHistoryData?.find((d) => d.deploymentId === selectedDeployment);
      changeDeployment({
        stageId: selectedStage.stageId,
        targetDeploymentId: selectedDeployment,
        reason: '테스트 배포변경',
        activatedBy: userData?.userKey || '',
      });
    }
  };

  const renderResourceTree = (resource: any, level = 0, parentPath = '') => {
    const resourceKey = getResourceKey(resource, parentPath);
    const isExpanded = expandedPaths.has(resourceKey);
    const hasChildren =
      (resource.children && resource.children.length > 0) ||
      (resource.methods && resource.methods.length > 0);
    const isStage = level === 0;

    return (
      <div key={resource.id}>
        <Toaster position="bottom-center" richColors expand={true} />
        <div
          className={`flex items-center gap-2 py-1 mb-1 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded text-sm ${
            selectedResource.id === resource.id
              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
              : ''
          }`}
          style={{ paddingLeft: `${level * 8 + 8}px` }}
          onClick={() => handleResourceClick(resource, isStage ? 'stage' : 'resource')}>
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleExpanded(resource, parentPath);
              }}>
              {isExpanded ? (
                <SquareMinus className="h-3 w-3" />
              ) : (
                <SquarePlus className="h-3 w-3" />
              )}
            </button>
          )}
          {!hasChildren && <div className="w-3" />}

          <span
            className={`font-medium ${selectedResource.id !== resource.id ? '' : 'text-blue-700 dark:text-gray-300'}`}>
            {resource.name}
          </span>
        </div>

        {hasChildren && isExpanded && (
          <div className=" space-y-1">
            {resource.children?.map((child) => renderResourceTree(child, level + 1, resourceKey))}
            {resource.methods?.map((method, index) => (
              <div
                key={`${resource.id}-${method.id}-${index}`}
                className={`flex items-center justify-between gap-2 h-[32px] py-1 px-2 text-xs cursor-pointer dark:hover:bg-green-900/20 rounded ${
                  selectedMethod?.method.id === method.id
                    ? 'bg-white dark:bg-green-900/30 dark:text-green-300'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
                style={{ paddingLeft: `${level * 8 + 8}px` }}
                onClick={() => handleMethodClick(method, resource)}>
                <div className="space-x-1" style={{ paddingLeft: `${level * 8 + 8}px` }}>
                  <span
                    className={`font-mono text-xs px-1.5 py-0.5 rounded ${
                      method.type === 'GET'
                        ? 'bg-green-100 text-green-800'
                        : method.type === 'POST'
                          ? 'bg-blue-100 text-blue-800'
                          : method.type === 'PUT'
                            ? 'bg-yellow-100 text-yellow-800'
                            : method.type === 'DELETE'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                    }`}>
                    {method.type}
                  </span>
                  <span className="text-[12px]">- {method.info.summary}</span>
                </div>
                {selectedMethod?.method.id === method.id && <Eye width={'14px'} />}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderDeploymentResourceTree = (resource: ApiResource, level = 0) => {
    const hasChildren =
      (resource.children && resource.children.length > 0) ||
      (resource.methods && resource.methods.length > 0);

    return (
      <div key={resource.id} className="ml-4">
        <div className="flex items-center gap-2 py-1 text-sm">
          <span className="text-gray-600">{resource.path}</span>
        </div>
        {resource.methods && resource.methods.length > 0 && (
          <div className="ml-4 space-y-1">
            {resource.methods?.map((method) => (
              <div key={method.id} className="flex items-center gap-2 py-1">
                <span
                  className={`px-2 py-1 rounded text-xs font-mono ${
                    method.type === 'GET'
                      ? 'bg-green-100 text-green-800'
                      : method.type === 'POST'
                        ? 'bg-blue-100 text-blue-800'
                        : method.type === 'PUT'
                          ? 'bg-yellow-100 text-yellow-800'
                          : method.type === 'DELETE'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                  }`}>
                  {method.type}
                </span>
                <span className="text-sm text-gray-600">{method.description}</span>
              </div>
            ))}
          </div>
        )}
        {resource.children?.map((child) => renderDeploymentResourceTree(child, level + 1))}
      </div>
    );
  };

  // Get current active deployment
  const currentActiveDeployment = deploymentHistoryData?.find((d) => d.status === 'ACTIVE');
  const selectedDeploymentData = selectedDeployment
    ? deploymentHistoryData?.find((d) => d.deploymentId === selectedDeployment)
    : null;

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
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
              <BreadcrumbPage>스테이지</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Stages</h1>
          </div>
          {/* <div className="flex items-center gap-3">
            <Button
              className="bg-orange-500 hover:bg-orange-600 text-white"
              onClick={() => setIsCreateStageModalOpen(true)}>
              스테이지 생성
            </Button>
          </div> */}
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar - Resource Tree */}
          <div className="col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 h-full">
              <div className="flex items-center justify-end p-2">
                <Button
                  size={'sm'}
                  variant={'outline'}
                  // className="bg-orange-500 hover:bg-orange-600 text-white"
                  className="rounded-full h-[25px] !gap-1 border-2 border-blue-500 text-[#0F74E1] font-bold hover:text-blue-700 hover:bg-blue-50"
                  onClick={() => setIsCreateStageModalOpen(true)}>
                  스테이지 생성
                </Button>
              </div>
              <div className="space-y-1">
                {resourceTree?.map((resource) => renderResourceTree(resource))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-9">
            <div className="space-y-6">
              {selectedMethod ? (
                /* Method Detail View */
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <span
                          className={`px-2 py-1 rounded text-xl font-mono ${
                            selectedMethod.method.type === 'GET'
                              ? 'bg-green-100 text-green-800'
                              : selectedMethod.method.type === 'POST'
                                ? 'bg-blue-100 text-blue-800'
                                : selectedMethod.method.type === 'PUT'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : selectedMethod.method.type === 'DELETE'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-gray-100 text-gray-800'
                          }`}>
                          {selectedMethod.method.type}
                        </span>
                        {selectedMethod.method.path} - 메서드 상세
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* <div>
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        설명
                      </Label>
                      <div className="mt-1 text-sm text-gray-900 dark:text-white">
                        {selectedMethod.method.description}
                      </div>
                    </div> */}
                    <div>
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        엔드포인트 URL
                      </Label>
                      <div className="mt-1 flex items-center gap-2">
                        <code className="flex-1 text-sm bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded border font-mono">
                          {selectedMethod.url}
                        </code>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCopyMethodUrl(selectedMethod.url)}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : selectedResource.type === 'resource' ? (
                /* Resource Detail View */
                <Card>
                  <CardHeader>
                    <CardTitle>메서드 - {selectedResource.resource.path}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          메서드 ({selectedResource?.resource?.methods?.length})
                        </Label>
                        {selectedResource?.resource?.methods?.length > 0 ? (
                          <div className="mt-2 space-y-2">
                            {selectedResource?.resource?.methods?.map((method) => (
                              <div
                                key={method.id}
                                className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                                onClick={() => handleMethodClick(method, selectedResource)}>
                                <div className="flex items-center gap-3">
                                  <span
                                    className={`px-2 py-1 rounded text-sm font-mono ${
                                      method.type === 'GET'
                                        ? 'bg-green-100 text-green-800'
                                        : method.type === 'POST'
                                          ? 'bg-blue-100 text-blue-800'
                                          : method.type === 'PUT'
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : method.type === 'DELETE'
                                              ? 'bg-red-100 text-red-800'
                                              : 'bg-gray-100 text-gray-800'
                                    }`}>
                                    {method.type}
                                  </span>
                                  <div>
                                    <div className="font-medium">{method.resourcePath}</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                      {method.info.summary}
                                    </div>
                                  </div>
                                </div>
                                <ChevronRight className="h-4 w-4 text-gray-400" />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="mt-2 text-center py-8 text-gray-500 dark:text-gray-400">
                            이 리소스에는 정의된 메서드가 없습니다.
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                /* Stage Details */
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="border-b border-gray-200 dark:border-gray-700 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                          스테이지 세부 정보
                        </h2>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsEditModalOpen(true)}
                          className="text-gray-600 hover:text-gray-700 hover:bg-gray-50 border-gray-200"
                          title="스테이지 수정">
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleExportApi}
                          className="text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200 bg-transparent"
                          title="API 내보내기">
                          <Download className="h-4 w-4 " />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsDeleteStageDialogOpen(true)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                          title="스테이지 삭제">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="grid grid-cols-3 gap-6">
                      <div>
                        <div className="space-y-4">
                          <div>
                            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              스테이지 이름
                            </Label>
                            <div className="mt-1 text-blue-600 font-medium">
                              {selectedStage.name}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-6">
                      <div>
                        <div className="space-y-4">
                          <div>
                            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              스테이지 설명
                            </Label>
                            <div className="mt-1 text-blue-600 font-medium">
                              {selectedStage.description}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          URL 호출
                        </Label>
                        <div className="mt-1 flex items-center gap-2">
                          <button
                            onClick={handleCopyUrl}
                            className="text-blue-600 hover:text-blue-700 text-sm font-mono flex items-center gap-1">
                            {selectedStage.url}
                            <Copy className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* New Deployment Records Section */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="border-b border-gray-200 dark:border-gray-700 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      배포 ({filteredDeployments?.length})
                    </h2>
                    <Button
                      onClick={handleActiveDeploymentChange}
                      className="bg-blue-500 hover:bg-blue-600 text-white">
                      활성 배포 변경
                    </Button>
                  </div>

                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="배포 찾기"
                      value={deploymentSearchTerm}
                      onChange={(e) => setDeploymentSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="p-4 pt-0">
                  {/* Table Header */}
                  <div className="grid grid-cols-12 gap-4 py-3 border-b border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <div className="col-span-1"></div>
                    <div className="col-span-5">
                      배포 날짜
                      <ChevronDown className="inline h-4 w-4 ml-1" />
                    </div>
                    <div className="col-span-2">
                      상태
                      <ChevronDown className="inline h-4 w-4 ml-1" />
                    </div>

                    <div className="col-span-3">
                      배포 ID
                      <ChevronDown className="inline h-4 w-4 ml-1" />
                    </div>
                    <div className="col-span-1"></div>
                  </div>
                  {/* Deployment Rows */}
                  <div className="space-y-0">
                    {paginatedDeployments?.map((deployment: any) => (
                      <Collapsible
                        key={deployment.deploymentId}
                        open={expandedDeployments.has(deployment.deploymentId)}
                        onOpenChange={() => toggleDeploymentExpansion(deployment.deploymentId)}>
                        <div
                          className={
                            selectedDeployment === deployment.deploymentId
                              ? 'grid grid-cols-12 gap-4 py-3 px-3  cursor-pointer bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500'
                              : 'grid grid-cols-12 gap-4 py-3 px-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer'
                          }>
                          <div className="col-span-1 flex items-center">
                            <input
                              type="radio"
                              name="deployment"
                              checked={selectedDeployment === deployment.deploymentId}
                              onChange={() => handleDeploymentSelect(deployment.deploymentId)}
                              className="h-4 w-4 hover:cursor-pointer ext-blue-600 focus:ring-blue-500 border-gray-300"
                            />
                          </div>
                          <div className="col-span-5 text-sm text-gray-900 dark:text-white">
                            {deployment.deployedAt}
                          </div>
                          <div className="col-span-2">
                            {selectedStage.deploymentId === deployment.deploymentId ? (
                              <div className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-sm text-green-700">활성</span>
                              </div>
                            ) : (
                              <span className="text-sm text-gray-500">-</span>
                            )}
                          </div>

                          <div className="col-span-3 text-sm font-mono text-gray-900 dark:text-white">
                            {deployment.deploymentId}
                          </div>
                          <div className="col-span-1 flex items-center justify-end">
                            <CollapsibleTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                <ChevronDown
                                  className={`h-4 w-4 transition-transform ${
                                    expandedDeployments.has(deployment.deploymentId)
                                      ? 'rotate-180'
                                      : ''
                                  }`}
                                />
                              </Button>
                            </CollapsibleTrigger>
                          </div>
                        </div>

                        <CollapsibleContent>
                          <div className="bg-gray-50 dark:bg-gray-800/50 p-4 border-b border-gray-100 dark:border-gray-700">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                              배포 상세 설명
                            </h4>
                            {deployment.resources && deployment.resources.length > 0 && (
                              <div className="mt-4">
                                <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                                  리소스 목록
                                </h5>
                                <div className="bg-white dark:bg-gray-800 rounded border p-3">
                                  {deployment.resources?.map((resource) =>
                                    renderDeploymentResourceTree(resource)
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    ))}
                  </div>

                  {/* Pagination */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {startIndex + 1}-
                      {Math.min(startIndex + itemsPerPage, filteredDeployments?.length)} of{' '}
                      {filteredDeployments?.length}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="text-sm font-medium">{currentPage}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Active Deployment Change Modal */}
        <Dialog open={isActiveDeploymentModalOpen} onOpenChange={setIsActiveDeploymentModalOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                  활성 배포 변경
                </DialogTitle>
              </div>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="text-sm text-gray-700 dark:text-gray-300">
                '{selectedStage.name}' 스테이지의 활성 배포를 업데이트하시겠습니까?
              </div>

              <div className="space-y-3">
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                    현재 활성 배포
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {currentActiveDeployment?.deploymentId} - {currentActiveDeployment?.date}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                    새 활성 배포
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedDeploymentData?.deploymentId} - {selectedDeploymentData?.date}
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-600 dark:text-gray-400">
                현재 활성 배포가 즉시 새 배포로 교체됩니다.
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setIsActiveDeploymentModalOpen(false)}>
                취소
              </Button>
              <Button
                onClick={confirmActiveDeploymentChange}
                className="bg-orange-500 hover:bg-orange-600 text-white">
                활성 배포 변경
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Stage Modal */}
        <ModifyStageDialog
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          organizationId={userData?.organizationId || ''}
          userKey={userData?.userKey || ''}
          apiId={apiId || ''}
          selectedStage={selectedStage}
        />

        {/* Create Stage Modal */}
        <CreateStageDialog
          open={isCreateStageModalOpen}
          onOpenChange={setIsCreateStageModalOpen}
          organizationId={userData?.organizationId || ''}
          userKey={userData?.userKey || ''}
          apiId={apiId || ''}
          deploymentHistoryData={deploymentHistoryData}
        />

        {/* Rollback Modal */}
        <Dialog open={isRollbackModalOpen} onOpenChange={setIsRollbackModalOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                활성 배포 변경
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="text-sm text-gray-700 dark:text-gray-300">
                '{selectedRollbackDeployment?.stageName}' 스테이지의 활성 배포를
                업데이트하시겠습니까?
              </div>

              <div className="space-y-3">
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                    현재 활성 배포
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {currentActiveDeployment?.deploymentId} - {currentActiveDeployment?.date}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                    새 활성 배포
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedRollbackDeployment?.deploymentId} - {selectedRollbackDeployment?.date}
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-600 dark:text-gray-400">
                현재 활성 배포가 즉시 새 배포로 교체됩니다.
              </div>
            </div>

            <DialogFooter className="gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsRollbackModalOpen(false)}>
                취소
              </Button>
              <Button
                onClick={handleRollbackConfirm}
                className="bg-orange-500 hover:bg-orange-600 text-white">
                활성 배포 변경
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Stage Confirmation Dialog */}
        <DeleteStageDialog
          open={isDeleteStageDialogOpen}
          onOpenChange={setIsDeleteStageDialogOpen}
          userKey={userData?.userKey || ''}
          selectedStage={selectedStage}
        />

        {/* Revoke Deployment Confirmation Dialog */}
        <AlertDialog
          open={isRevokeDeploymentDialogOpen}
          onOpenChange={setIsRevokeDeploymentDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-orange-600">
                <RotateCcw className="h-5 w-5" />
                배포 회수 확인
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-600">
                <div className="space-y-2">
                  <p>
                    스테이지{' '}
                    <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                      {selectedStage.name}
                    </span>
                    의 현재 배포를 회수하시겠습니까?
                  </p>
                  <p className="text-sm text-orange-600">
                    • 현재 활성화된 배포가 중단됩니다
                    <br />• API 엔드포인트가 일시적으로 사용할 수 없게 됩니다
                  </p>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>취소</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleRevokeDeployment}
                className="bg-orange-600 hover:bg-orange-700 text-white">
                회수하기
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppLayout>
  );
}
