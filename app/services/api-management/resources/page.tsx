'use client';

import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { ArrowLeft, Rocket, SquarePlus, SquareMinus, Eye } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast, Toaster } from 'sonner';
import type { Resource, Method } from '@/types/resource';
import { getMethodStyle } from '@/lib/etc';
import DeployResourceDialog from './components/DeployResourceDialog';
import { ResourceDetailCard } from './components/ResourceDetailCard';
import MethodDetailCard from './components/MethodDetailCard';
import { ResourceCreateDialog } from './components/ResourceCreateDialog';
import { useGetOpenAPIDoc } from '@/hooks/use-resources';
import { useAuthStore } from '@/store/store';

export default function ApiResourcesPage() {
  const router = useRouter();
  const leftSidebarRef = useRef<HTMLDivElement>(null);
  const rightContentRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const currentApiId = searchParams.get('apiId');
  const currentApiName = searchParams.get('apiName');
  const userData = useAuthStore((state) => state.user);

  //mockData2 대신 들어가면 됨
  const { data: openAPIDocData, refetch } = useGetOpenAPIDoc(currentApiId || '');
  console.log(openAPIDocData);

  // OpenAPI 문서로 리소스 폴더구조 데이터 수정
  function convertOpenApiToResources(openApiPaths: any): Resource[] {
    const excludedKeys = ['x-cors-policy', 'x-resource-id', 'x-resource-name'];

    let resources = Object.entries(openApiPaths).map(([path, methods]: [string, any], idx) => ({
      id: idx,
      path: path,
      name: methods['x-resource-name'],
      description: methods['x-resource-description'] || '',
      resourceId: methods['x-resource-id'],
      cors: methods['x-cors-policy'],
      methods: Object.entries(methods)
        .filter(([type]) => !excludedKeys.includes(type))
        .map(([type, methodObj]: [string, any], mIdx) => ({
          id: mIdx,
          type: type?.toUpperCase(),
          resourcePath: path,
          // summary: methodObj.summary,
          // description: methodObj.description,
          // apiKeys: methodObj['x-api-keys'] || '',
          // endpointUrl: methodObj['endpointUrl'] || '',
          info: methodObj,
        })),
    }));

    return resources;
  }

  // 기존 useState(Resource[]) 부분을 mockData2 기반으로 초기화
  const [resources, setResources] = useState<Resource[]>(
    // convertOpenApiToResources(mockData2.paths)
    convertOpenApiToResources(openAPIDocData?.paths ?? [])
  );
  const [selectedResource, setSelectedResource] = useState<Resource>(resources[0]);
  const [selectedMethod, setSelectedMethod] = useState<Method | null>(null);
  const [expandedResources, setExpandedResources] = useState<Set<string>>(new Set(['root']));
  const [activeTab, setActiveTab] = useState('method-request');
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deploymentData, setDeploymentData] = useState({
    stage: '',
    version: '',
    description: '',
    newStageName: '',
  });

  useEffect(() => {
    if (openAPIDocData?.paths) {
      setResources(convertOpenApiToResources(openAPIDocData.paths));
    }
  }, [openAPIDocData]);

  // useEffect(() => {
  //   if (resources) {
  //     setExpandedResources((prev) => {
  //       const newSet = new Set(prev);
  //       resources.forEach((resource) => {
  //         newSet.add(resource.id); // resource가 객체라면 적절한 string 키 사용
  //       });
  //       return newSet;
  //     });
  //   }
  // }, [resources]);

  // ✅ 모든 리소스를 한 번만 펼치는 로직
  useEffect(() => {
    if (resources.length > 0) {
      // 모든 리소스 id를 초기 expandedResources로 설정
      setExpandedResources(new Set(resources.map((r) => String(r.id))));
    }
  }, [resources]);

  // Sync heights
  useEffect(() => {
    const syncHeights = () => {
      if (leftSidebarRef.current && rightContentRef.current) {
        const rightHeight = rightContentRef.current.offsetHeight;
        leftSidebarRef.current.style.height = `${rightHeight}px`;
      }
    };

    syncHeights();
    window.addEventListener('resize', syncHeights);

    // Use MutationObserver to detect content changes
    const observer = new MutationObserver(syncHeights);
    if (rightContentRef.current) {
      observer.observe(rightContentRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
      });
    }

    return () => {
      window.removeEventListener('resize', syncHeights);
      observer.disconnect();
    };
  }, [selectedMethod, activeTab]);

  const handleMethodClick = (method: Method, resource: Resource) => {
    setSelectedMethod(method);
    setSelectedResource(resource);
    setActiveTab('method-request');
    // setIsEditMode(false);
  };

  // 리소스 클릭 핸들러 수정
  const handleResourceClick = (resource: Resource) => {
    setSelectedResource(resource);
    setSelectedMethod(null); // 메서드 선택 해제
    // toggleResourceExpansion(resource.id);
  };

  const handleDeploy = () => {
    setDeploymentData({
      stage: '',
      version: '',
      description: '',
      newStageName: '',
    });
    setIsDeployModalOpen(true);
  };

  // 리소스 확장/축소 토글 함수
  const toggleResourceExpansion = (resourceId: string) => {
    const newExpanded = new Set(expandedResources);
    console.log(resourceId, newExpanded);

    if (newExpanded.has(resourceId)) {
      newExpanded.delete(resourceId);
    } else {
      newExpanded.add(resourceId);
    }
    setExpandedResources(newExpanded);
  };

  console.log(resources);

  // 트리 구조 리소스 목록 렌더링 함수
  const renderResourceTree = () => {
    return (
      <div className="space-y-1">
        {resources.map((resource, index) => {
          console.log(expandedResources);
          console.log(resource);
          const isExpanded = expandedResources.has(resource.id);
          const hasMethods = resource.methods.length > 0;
          const isSelected = selectedResource?.id === resource.id;
          const isRoot = resource.path === '/';

          return (
            <div key={resource.id} className={resource.path === '/' ? '' : 'pl-2'}>
              {/* 리소스 항목 */}
              <div
                className={`flex items-center gap-2 py-1 px-2 mb-1 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded ${
                  isSelected
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    : isExpanded
                      ? 'text-blue'
                      : ''
                }`}
                onClick={() => handleResourceClick(resource)}>
                {/* 확장/축소 버튼 */}
                {isRoot || hasMethods ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleResourceExpansion(resource.id);
                    }}>
                    {isExpanded ? (
                      <SquareMinus className="h-3 w-3" />
                    ) : (
                      <SquarePlus className="h-3 w-3" />
                    )}
                    {/* <span className="font-medium text-sm">{resource.path}</span> */}
                  </button>
                ) : (
                  <div className="w-2" />
                )}
                <span className="font-medium text-sm">{resource.path}</span>
              </div>

              {/* 메서드 목록 */}
              {hasMethods && isExpanded && (
                <div className="ml-6 space-y-1">
                  {resource.methods.map((method) => {
                    const isMethodSelected = selectedMethod?.id === method.id;
                    return (
                      <div
                        key={method.id}
                        className={`flex items-center justify-between w-[100%] gap-2 py-1 px-2 cursor-pointer dark:hover:bg-green-900/20 ${
                          isMethodSelected
                            ? 'bg-white dark:bg-gray-900/30 text-gray-700 dark:text-gray-300'
                            : 'text-gray-600 dark:text-gray-400'
                        }`}
                        onClick={() => handleMethodClick(method, resource)}>
                        <div className="space-x-1">
                          <span
                            className={`${getMethodStyle(method.type)} !font-mono !font-medium !text-xs !px-1.5 !py-0.5 rounded`}>
                            {method.type}
                          </span>
                          <span className="text-[12px]">- {method.info.summary}</span>
                        </div>
                        {isMethodSelected && <Eye width={'14px'} />}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <AppLayout>
      <Toaster position="bottom-center" richColors expand={true} />

      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/services/api-management">Services</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/services/api-management">API Management</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>리소스 : {currentApiName}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/services/api-management')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">리소스</h1>
          </div>
          <div className="flex items-center justify-end p-2 gap-2">
            <Button
              size="sm"
              onClick={() => handleDeploy()}
              className="text-sm rounded-full !px-4 h-[28px] bg-orange-500 hover:bg-orange-600 text-white text-xs lg:text-sm">
              API 배포
              {/* <Rocket className="h-4 w-4" /> */}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* 리소스 목록 */}
          <div className="col-span-3">
            <div
              ref={leftSidebarRef}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-2 overflow-auto">
              <div className="flex items-center justify-end p-2 gap-2">
                <Button
                  size="sm"
                  variant={'outline'}
                  onClick={() => setIsCreateModalOpen(true)}
                  // className="bg-blue-500 hover:bg-blue-600 text-white text-xs lg:text-sm"
                  className="rounded-full h-[25px] !gap-1 border-2 border-blue-500 text-[#0F74E1] font-bold hover:text-blue-700 hover:bg-blue-50">
                  리소스 생성
                </Button>
              </div>
              {/* 트리 구조 리소스 목록 렌더링 */}
              {renderResourceTree()}
            </div>
          </div>

          {/* Main Right Content */}
          <div className="col-span-9">
            <div ref={rightContentRef}>
              {selectedMethod ? (
                /* Method Detail View */
                <MethodDetailCard selectedMethod={selectedMethod} />
              ) : (
                /* Resource Detail View */
                <ResourceDetailCard
                  selectedResource={selectedResource}
                  setSelectedResource={setSelectedResource}
                  handleMethodClick={handleMethodClick}
                  apiId={currentApiId || ''}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Create Resource Modal */}
      <ResourceCreateDialog
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        apiId={currentApiId || ''}
        userKey={userData?.userKey || ''}
        onCreated={refetch}
      />

      <DeployResourceDialog
        open={isDeployModalOpen}
        onOpenChange={setIsDeployModalOpen}
        apiId={currentApiId || ''}
        userKey={userData?.userKey || ''}
        organizationId={userData?.organizationId || ''}
      />
    </AppLayout>
  );
}
