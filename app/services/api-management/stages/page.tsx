'use client';

import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  ArrowLeft,
  ChevronRight,
  Copy,
  Download,
  Trash2,
  SquarePlus,
  SquareMinus,
  Settings,
  Eye,
} from 'lucide-react';
import { useEffect, useState, useMemo, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast, Toaster } from 'sonner';
import { useClipboard } from 'use-clipboard-copy';
import CreateStageDialog from './components/CreateStageDialog';
import { useAuthStore } from '@/store/store';
import ModifyStageDialog from './components/ModifyStageDialog';
import DeleteStageDialog from './components/DeleteStageDialog';
import { useGetStagesDocData } from '@/hooks/use-stages';
import { buildTree } from '@/lib/etc';
import { usePathname } from 'next/navigation';
import DeploymentList from './components/DeploymentList';
import { useDeployStore } from '@/store/deployStore';
import { getMethodStyle } from '@/lib/etc';
import { requestGet } from '@/lib/apiClient';

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
  url: string;
  deploymentId: string;
}

interface SelectedMethod {
  resourceId: string;
  resourcePath: string;
  method: ApiMethod;
  url: string;
}

export default function StagesPage() {
  const userData = useAuthStore((state) => state.user);
  const params = useSearchParams();
  const apiId = params.get('apiId');
  const pathname = usePathname();
  const clipboard = useClipboard();

  const { data: stagesDocData = [] } = useGetStagesDocData(apiId || '', pathname);

  const [selectedWholeStageInfo, setSelectedWholeStageInfo] = useState<any>({
    resource: {},
    type: 'stage',
  });
  const [selectedMethod, setSelectedMethod] = useState<SelectedMethod | null>(null);
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set(['hello']));
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateStageModalOpen, setIsCreateStageModalOpen] = useState(false);
  const [isDeleteStageDialogOpen, setIsDeleteStageDialogOpen] = useState(false);
  const [selectedStageEndpointUrl, setSelectedStageEndpointUrl] = useState('');

  const resourceTree = useMemo(() => buildTree(stagesDocData), [stagesDocData]);

  // useEffect(() => {
  //   if (stagesDocData.length === 0) return;
  // }, [stagesDocData]);

  const getFinalEndpoint = async (stageId: string) => {
    const res = await requestGet(`/api/v1/gateway/stage/${stageId}`);
    // const res = await requestGet(`/api/v1/gateway/stage/${'nEBJGwKdAAAk'}`);

    setSelectedStageEndpointUrl(res.data.baseUrl);
  };

  const prevLengthRef = useRef(0);

  useEffect(() => {
    if (resourceTree.length === 0) return;

    const prevLength = prevLengthRef.current;
    prevLengthRef.current = resourceTree.length;

    const currentId = selectedWholeStageInfo.resource?.deploymentId;
    const updated = currentId ? findResourceById(resourceTree, currentId) : null;

    if (!currentId) {
      // ✅ 기본값 (처음 진입)
      getFinalEndpoint(resourceTree[0]?.stageId);
      setSelectedWholeStageInfo({ resource: resourceTree[0], type: 'stage' });
      return;
    }

    if (!updated) {
      // ✅ 선택된 스테이지가 삭제된 경우
      getFinalEndpoint(resourceTree[0]?.stageId);
      setSelectedWholeStageInfo({ resource: resourceTree[0], type: 'stage' });
      return;
    }

    if (resourceTree.length > prevLength) {
      // ✅ 새 스테이지가 생성된 경우 (길이 증가)
      getFinalEndpoint(resourceTree[0]?.stageId);
      setSelectedWholeStageInfo({ resource: resourceTree[0], type: 'stage' });
      return;
    }

    // ✅ 직접 선택한 경우 → 그대로 유지하면서 최신 데이터만 반영
    getFinalEndpoint(updated?.stageId);
    setSelectedWholeStageInfo((prev) => ({
      ...prev,
      resource: updated,
    }));
  }, [resourceTree]);

  console.log(resourceTree, selectedWholeStageInfo);

  function findResourceById(tree: any[], id: string): any | null {
    for (const node of tree) {
      if (node.deploymentId === id) return node;
      if (node.children) {
        const found = findResourceById(node.children, id);
        if (found) return found;
      }
    }
    return null;
  }

  const getResourceKey = (resource: ApiResource, parentPath = '') => {
    return `${parentPath}${resource.path}-${resource.id}`;
  };

  const handleResourceClick = (resource: any, type: 'stage' | 'resource') => {
    setSelectedWholeStageInfo({ resource, type });
    setSelectedMethod(null);
  };

  const handleMethodClick = (method: ApiMethod, resource: ApiResource) => {
    console.log(selectedWholeStageInfo.resource.path, method.path, resource.path);

    // const methodUrl = `${selectedWholeStageInfo.resource.path}${method.path}`;
    const methodUrl = `${selectedStageEndpointUrl}${resource.path}`;
    setSelectedMethod({
      resourceId: resource.id,
      resourcePath: resource.path,
      method,
      url: methodUrl,
    });
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

  const handleCopyUrl = () => {
    clipboard.copy(selectedWholeStageInfo.resource.path);
    toast.success('URL이 클립보드에 복사되었습니다.');
  };

  const handleCopyMethodUrl = (url: string) => {
    clipboard.copy(url);
    toast.success('메서드 URL이 클립보드에 복사되었습니다.');
  };

  const handleExportApi = () => {
    toast.success('API 내보내기가 시작되었습니다.');
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
            selectedWholeStageInfo?.resource?.id === resource.id
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
            className={`font-medium  text-sm ${selectedWholeStageInfo.id !== resource.id ? '' : 'text-blue-700 dark:text-gray-300'}`}>
            {isStage ? resource.name : resource.name === '/' ? '/' : `/${resource.name}`}
          </span>
        </div>
        {hasChildren && isExpanded && (
          <div className="space-y-1">
            {/* ✅ methods 먼저 */}
            {resource.methods?.map((method, index) => (
              <div
                key={`${resource.id}-${method.id}-${index}`}
                className={`flex items-center justify-between gap-2 h-[32px] py-1 px-2 text-xs cursor-pointer dark:hover:bg-green-900/20 rounded ${
                  selectedMethod?.method.id === method.id
                    ? 'bg-white dark:bg-green-900/30 text-gray-700 dark:text-green-300'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
                onClick={() => handleMethodClick(method, resource)}>
                <div className="space-x-1" style={{ paddingLeft: `${level * 8 + 13}px` }}>
                  <span
                    className={` ${getMethodStyle(method.type)} !font-mono !font-bold !text-xs !px-1.5 !py-0.5 rounded`}
                    title={method.info.summary}>
                    {method.type}
                  </span>
                </div>
                {selectedMethod?.method.id === method.id && <Eye className="w-4 h-4" />}
              </div>
            ))}

            {/* ✅ children 나중에 */}
            {resource.children?.map((child) => renderResourceTree(child, level + 1, resourceKey))}
          </div>
        )}
      </div>
    );
  };

  console.log(selectedWholeStageInfo);

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
              <BreadcrumbPage>Stages</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className=" ml-2">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Stages</h1>
            <p className="text-gray-600 mt-1">
              배포된 API의 실행 환경을 구분하는 Stage들을 관리하세요.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar - Resource Tree */}
          <div className="col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 h-full">
              <div className="flex items-center justify-end p-2">
                <Button
                  size={'sm'}
                  variant={'outline'}
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
                          className={`px-2 py-1 rounded text-xl font-mono ${getMethodStyle(
                            selectedMethod.method.type
                          )}`}>
                          {selectedMethod.method.type}
                        </span>
                        {selectedMethod.method.path} - 메서드 상세
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
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
              ) : selectedWholeStageInfo.type === 'resource' ? (
                /* Resource Detail View */
                <Card>
                  <CardHeader>
                    <CardTitle>메서드 - {selectedWholeStageInfo.resource.path}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          메서드 ({selectedWholeStageInfo?.resource?.methods?.length})
                        </Label>
                        {selectedWholeStageInfo?.resource?.methods?.length > 0 ? (
                          <div className="mt-2 space-y-2">
                            {selectedWholeStageInfo?.resource?.methods?.map((method) => (
                              <div
                                key={method.id}
                                className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                                onClick={() => handleMethodClick(method, selectedWholeStageInfo)}>
                                <div className="flex items-center gap-3">
                                  <span
                                    className={`px-2 py-1 rounded text-sm font-mono !font-bold ${getMethodStyle(method.type)}`}>
                                    {method.type}
                                  </span>
                                  <div>
                                    {/* <div className="font-medium">{method.resourcePath}</div> */}
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

                  <div className="p-4 space-y-2">
                    {selectedWholeStageInfo.resource.name ? (
                      <div className="grid grid-cols-3 gap-6">
                        <div>
                          <div className="space-y-4">
                            <div>
                              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                스테이지 이름
                              </Label>
                              <div className="mt-1 text-blue-600 font-medium">
                                {selectedWholeStageInfo.resource.name}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="py-3 px-1 text-[15px]">
                        생성된 스테이지가 존재하지 않습니다.
                      </div>
                    )}
                    {selectedWholeStageInfo.resource.description && (
                      <div className="grid grid-cols-3 gap-6">
                        <div>
                          <div className="space-y-4">
                            <div>
                              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                스테이지 설명
                              </Label>
                              <div className="mt-1 text-blue-600 font-medium">
                                {selectedWholeStageInfo.resource.description}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {selectedWholeStageInfo.resource.path && (
                      <div className="mt-3 space-y-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            URL
                          </Label>
                          <div className="mt-1 flex items-center gap-2">
                            <button
                              onClick={handleCopyUrl}
                              className="text-blue-600 hover:text-blue-700 text-sm font-mono flex items-center gap-1">
                              {selectedStageEndpointUrl}
                              <Copy className="ml-2 h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              <DeploymentList
                selectedStage={{
                  deploymentId: selectedWholeStageInfo.resource.deploymentId,
                  stageId: selectedWholeStageInfo.resource.stageId,
                  name: selectedWholeStageInfo.resource.name,
                }}
              />
            </div>
          </div>
        </div>

        {/* Create Stage Modal */}
        <CreateStageDialog
          open={isCreateStageModalOpen}
          onOpenChange={setIsCreateStageModalOpen}
          organizationId={userData?.organizationId || ''}
          userKey={userData?.userKey || ''}
          apiId={apiId || ''}
        />

        {/* Edit Stage Modal */}
        <ModifyStageDialog
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          selectedStage={{
            name: selectedWholeStageInfo.resource.name,
            description: selectedWholeStageInfo.resource.description,
            stageId: selectedWholeStageInfo.resource.stageId,
          }}
        />

        {/* Delete Stage Confirmation Dialog */}
        <DeleteStageDialog
          open={isDeleteStageDialogOpen}
          onOpenChange={setIsDeleteStageDialogOpen}
          userKey={userData?.userKey || ''}
          selectedStage={{
            name: selectedWholeStageInfo.resource.name,
            stageId: selectedWholeStageInfo.resource.stageId,
          }}
        />
      </div>
    </AppLayout>
  );
}
