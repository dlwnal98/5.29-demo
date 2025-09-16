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
import { ArrowLeft, SquarePlus, SquareMinus, Eye } from 'lucide-react';
import { useState, useRef, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Toaster } from 'sonner';
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

  const { data: openAPIDocData, refetch } = useGetOpenAPIDoc(currentApiId || '');
  console.log(openAPIDocData);

  // interface Resource {
  //   id: number;
  //   path: string;
  //   name: string;
  //   description?: string;
  //   cors?: any;
  //   children?: Resource[];
  //   methods?: Method[];
  // }
  function buildTree(flatData) {
    const excludedKeys = ['x-cors-policy', 'x-resource-id', 'summary', 'description', 'parameters'];

    const paths = Object.keys(flatData);
    if (paths.length === 0) return [];

    // 1️⃣ 첫 번째 path를 root로 고정
    const rootPath = paths[0];
    const rootNode = {
      id: 'node-root',
      name: '/',
      path: '/',
      methods: Object.entries(flatData[rootPath])
        .filter(([type]) => !excludedKeys.includes(type))
        .map(([type, methodObj], mIdx) => ({
          id: `root-method-${mIdx}`,
          type: type?.toUpperCase(),
          resourcePath: rootPath,
          info: methodObj,
        })),
      children: [],
    };

    // 2️⃣ 나머지 path들을 children으로 계층적 추가
    paths.slice(1).forEach((path) => {
      const segments = path.split('/').filter(Boolean);
      let currentLevel = rootNode.children;

      segments.forEach((segment, idx) => {
        const fullPath = '/' + segments.slice(0, idx + 1).join('/');
        let existingNode = currentLevel.find((node) => node.path === fullPath);

        if (!existingNode) {
          existingNode = {
            id: `node-${fullPath}`,
            name: segment,
            path: fullPath,
            description: flatData[path]?.description || '',
            resourceId: flatData[path]?.['x-resource-id'],
            cors: flatData[path]?.['x-cors-policy'],
            methods:
              idx === segments.length - 1
                ? Object.entries(flatData[path])
                    .filter(([type]) => !excludedKeys.includes(type))
                    .map(([type, methodObj], mIdx) => ({
                      id: `${fullPath}-method-${mIdx}`,
                      type: type?.toUpperCase(),
                      resourcePath: path,
                      info: methodObj,
                    }))
                : [],
            children: [],
          };
          currentLevel.push(existingNode);
        }

        // 다음 레벨로 내려가기
        currentLevel = existingNode.children;
      });
    });

    return [rootNode];
  }

  const tree = buildTree(openAPIDocData?.paths ?? {});

  const [resources, setResources] = useState<Resource[]>(tree);

  const [selectedResource, setSelectedResource] = useState<Resource>(resources[0]);
  const [selectedMethod, setSelectedMethod] = useState<Method | null>(null);
  const [expandedResources, setExpandedResources] = useState<number[]>();
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
      setResources(tree);
    }
  }, [openAPIDocData]);

  // ✅ 모든 리소스를 한 번만 펼치는 로직
  useEffect(() => {
    if (resources.length > 0) {
      // 새로고침 시 루트 선택
      setSelectedResource((prev) => prev ?? resources.find((r) => r.path === '/'));

      // expandedResources 업데이트
      setExpandedResources((prev) => {
        const prevExpanded = prev ?? [];
        const newIds = resources.map((r) => r.id).filter((id) => !prevExpanded.includes(id));
        return [...prevExpanded, ...newIds];
      });
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
  };

  // 리소스 클릭 핸들러 수정
  // const handleResourceClick = (resource: Resource) => {
  //   setSelectedResource(resource);
  //   setSelectedMethod(null); // 메서드 선택 해제
  //   toggleResourceExpansion(resource.id);
  // };

  const handleDeploy = () => {
    setDeploymentData({
      stage: '',
      version: '',
      description: '',
      newStageName: '',
    });
    setIsDeployModalOpen(true);
  };

  // // 리소스 확장/축소 토글 함수
  // const toggleResourceExpansion = (resourceId: number) => {
  //   let newExpanded = [...(expandedResources ?? [])];
  //   console.log(resourceId, newExpanded);

  //   if (newExpanded.includes(resourceId)) {
  //     // 이미 있으면 제거
  //     newExpanded = newExpanded.filter((id) => id !== resourceId);
  //   } else {
  //     // 없으면 추가
  //     newExpanded.push(resourceId);
  //   }

  //   // 상태 업데이트
  //   setExpandedResources(newExpanded);
  // };

  console.log(selectedResource);
  console.log(resources);

  // const [resources, setResources] = useState<Resource[]>([]);
  // const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  // const [selectedMethod, setSelectedMethod] = useState<Method | null>(null);
  // const [expandedResources, setExpandedResources] = useState<string[]>([]); // id는 string(fullPath)로

  // OpenAPI 데이터 들어오면 트리로 변환
  useEffect(() => {
    if (openAPIDocData?.paths) {
      const tree = buildTree(openAPIDocData.paths);
      setResources(tree);
    }
  }, [openAPIDocData]);

  // 1️⃣ 루트 기본 선택 & 2️⃣ 모든 노드 expand
  useEffect(() => {
    if (resources.length === 0) return;

    const root = resources[0];
    setSelectedResource(root);

    // 모든 노드 id 수집 (재귀)
    const collectAllIds = (list: Resource[], acc: string[] = []) => {
      list.forEach((res) => {
        acc.push(res.id);
        if (res.children?.length) collectAllIds(res.children, acc);
      });
      return acc;
    };

    setExpandedResources(collectAllIds([root]));
  }, [resources]);

  // 3️⃣ 새 리소스 생성 시 마지막 노드 선택 + methods 있으면 expand
  useEffect(() => {
    if (resources.length === 0) return;

    const root = resources[0];
    const lastChild = root.children[root.children.length - 1];
    if (!lastChild) return;

    setSelectedResource(lastChild);

    if (lastChild.methods?.length) {
      setExpandedResources((prev) => [...new Set([...(prev ?? []), lastChild.id])]);
    }
  }, [resources]);

  // 리소스 클릭
  const handleResourceClick = (res: Resource) => {
    setSelectedResource(res);
    setSelectedMethod(null);
    toggleResourceExpansion(res.id);
  };

  // expand toggle
  const toggleResourceExpansion = (id: string) => {
    setExpandedResources((prev) =>
      prev?.includes(id) ? prev.filter((x) => x !== id) : [...(prev ?? []), id]
    );
  };

  // 재귀 렌더링
  const renderResourceTree = (list: Resource[]) => {
    return (
      <div className="space-y-1">
        {list.map((res) => {
          const isExpanded = expandedResources?.includes(res.id);
          const isSelected = selectedResource?.id === res.id;

          return (
            // <div key={res.id} className={res.path === '/' ? '' : 'pl-2'}>
            <div key={res.id}>
              <div
                className={`flex items-center gap-2 py-1 px-2 mb-1 cursor-pointer rounded ${
                  isSelected
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    : ''
                }`}
                onClick={() => handleResourceClick(res)}>
                {(res.children?.length ?? 0) > 0 || (res.methods?.length ?? 0) > 0 ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleResourceExpansion(res.id);
                    }}>
                    {isExpanded ? (
                      <SquareMinus className="h-3 w-3" />
                    ) : (
                      <SquarePlus className="h-3 w-3" />
                    )}
                  </button>
                ) : (
                  <div className="w-2" />
                )}
                <span className="font-medium text-sm">
                  {res.name === '/' ? '/' : `/${res.name}`}
                </span>
              </div>

              {/* methods */}
              {isExpanded && res.methods?.length > 0 && (
                <div className="ml-6 space-y-1">
                  {res.methods.map((m) => {
                    const isMethodSelected = selectedMethod?.id === m.id;
                    return (
                      <div
                        key={m.id}
                        className={`flex items-center w-[100%] gap-2 py-1 px-2 cursor-pointer dark:hover:bg-green-900/20 ${
                          isMethodSelected
                            ? 'bg-white dark:bg-gray-900/30 text-gray-700 dark:text-gray-300'
                            : 'text-gray-600 dark:text-gray-400'
                        }`}
                        onClick={() => {
                          setSelectedMethod(m);
                          setSelectedResource(res);
                        }}>
                        <span
                          className={`${getMethodStyle(m.type)} !font-mono !font-medium !text-xs !px-1.5 !py-0.5 rounded`}>
                          {m.type}
                        </span>

                        {/* <span className="text-[12px]">- {m.info.summary}</span> */}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* children 재귀 */}
              {isExpanded && res.children?.length > 0 && (
                <div className="ml-4">{renderResourceTree(res.children)}</div>
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
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-3">
            <div
              ref={leftSidebarRef}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-2 overflow-auto">
              <div className="flex items-center justify-end p-2 gap-2">
                <Button
                  size="sm"
                  variant={'outline'}
                  onClick={() => setIsCreateModalOpen(true)}
                  className="rounded-full h-[25px] !gap-1 border-2 border-blue-500 text-[#0F74E1] font-bold hover:text-blue-700 hover:bg-blue-50">
                  리소스 생성
                </Button>
              </div>
              {renderResourceTree(tree)}
            </div>
          </div>

          <div className="col-span-9">
            <div ref={rightContentRef}>
              {selectedMethod ? (
                <MethodDetailCard selectedMethod={selectedMethod} />
              ) : (
                <ResourceDetailCard
                  selectedResource={selectedResource}
                  setSelectedResource={setSelectedResource}
                  handleMethodClick={handleMethodClick}
                  apiId={currentApiId || ''}
                  onRemoved={refetch}
                />
              )}
            </div>
          </div>
        </div>
      </div>

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
