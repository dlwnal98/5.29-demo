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
import { useAuthStore, useMethodEditStore } from '@/store/store';
import { resoureceBuildTree } from '@/lib/etc';

export default function ApiResourcesPage() {
  const router = useRouter();
  const leftSidebarRef = useRef<HTMLDivElement>(null);
  const rightContentRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const currentApiId = searchParams.get('apiId');
  const currentApiName = searchParams.get('apiName');
  const userData = useAuthStore((state) => state.user);
  const setIsMethodEdit = useMethodEditStore((state) => state.setIsEdit);
  const isMethodEdit = useMethodEditStore((state) => state.isEdit);

  const { data: openAPIDocData, refetch } = useGetOpenAPIDoc(currentApiId || '');

  // const tree = resoureceBuildTree(openAPIDocData?.paths ?? {});
  // console.log(isMethodEdit);

  // useEffect(() => {
  //   console.log(isMethodEdit);
  //   if (openAPIDocData?.paths) {
  //     setResources(tree);
  //   }
  // }, [openAPIDocData, isMethodEdit]);

  const tree = useMemo(() => {
    return resoureceBuildTree(openAPIDocData?.paths ?? {});
  }, [openAPIDocData]);

  useEffect(() => {
    if (openAPIDocData?.paths) {
      setResources(tree);
    }
  }, [tree, isMethodEdit]);

  const [resources, setResources] = useState<Resource[]>(tree);

  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<Method | null>(null);
  const [selectedMethodId, setSelectedMethodId] = useState('');
  const [expandedResources, setExpandedResources] = useState<string[]>();
  const [activeTab, setActiveTab] = useState('method-request');
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createdResourceId, setCreatedResourceId] = useState('');
  const [createdMethodId, setCreatedMethodId] = useState('');

  // 페이지 진입시 sessionStorage에서 생성된 메서드 ID 확인
  useEffect(() => {
    const methodId = sessionStorage.getItem('createdMethodId');
    if (methodId) {
      setCreatedMethodId(methodId);
      sessionStorage.removeItem('createdMethodId');
    }
  }, []);

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
    setSelectedMethodId(method.id);
    setSelectedResource(resource);
    setActiveTab('method-request');
  };

  const handleDeploy = () => {
    setIsDeployModalOpen(true);
  };

  // 메서드 수정 후 자동 재선택 로직
  useEffect(() => {
    // selectedMethodId가 없거나 편집 모드일 때는 실행하지 않음
    if (!selectedMethodId || isMethodEdit || !tree.length) return;

    // tree에서 selectedMethodId와 일치하는 메서드를 재귀적으로 찾는 함수
    const findMethodById = (resources: Resource[]): Method | null => {
      for (const resource of resources) {
        // 현재 리소스의 메서드들 검색
        if (resource.methods && resource.methods.length > 0) {
          const foundMethod = resource.methods.find((m) => m.id === selectedMethodId);
          if (foundMethod) {
            // 메서드를 찾으면 해당 리소스 정보도 함께 업데이트
            setSelectedResource(resource);
            return foundMethod;
          }
        }
        // 자식 리소스에서 재귀 검색
        if (resource.children && resource.children.length > 0) {
          const foundMethod = findMethodById(resource.children);
          if (foundMethod) return foundMethod;
        }
      }
      return null;
    };

    // 갱신된 메서드 찾기
    const updatedMethod = findMethodById(tree);
    if (updatedMethod) {
      // 새로운 메서드 객체로 상태 업데이트 (참조 변경으로 자식 컴포넌트 리렌더링 트리거)
      setSelectedMethod(updatedMethod);
    } else {
      // 메서드를 찾지 못한 경우 (삭제됨)
      // selectedMethod가 있었는데 찾지 못했다면 삭제된 것으로 판단
      if (selectedMethod) {
        setSelectedMethod(null);
        setSelectedMethodId('');
      }
    }
  }, [tree, isMethodEdit, selectedMethodId]);

  // OpenAPI 데이터 들어오면 트리로 변환
  // useEffect(() => {
  //   if (openAPIDocData?.paths) {
  //     const tree = resoureceBuildTree(openAPIDocData.paths);
  //     setResources(tree);
  //   }
  // }, [openAPIDocData, isMethodEdit]);

  const findInTree = (list: Resource[], id: string): boolean => {
    for (const res of list) {
      if (res.id === id) return true;
      if (res.children && findInTree(res.children, id)) return true;
    }
    return false;
  };

  // createdMethodId가 있을 때 tree가 갱신되면 메서드 찾기
  useEffect(() => {
    if (!createdMethodId || !tree.length) return;

    // tree에서 메서드 찾기
    const findMethodById = (list: Resource[]): { method: Method; resource: Resource } | null => {
      for (const resource of list) {
        // 현재 리소스의 메서드들 검색
        if (resource.methods && resource.methods.length > 0) {
          const foundMethod = resource.methods.find(
            (m) =>
              m.info?.['x-method-id'] === createdMethodId || m.info?.methodId === createdMethodId
          );
          if (foundMethod) {
            return { method: foundMethod, resource };
          }
        }
        // 자식 리소스에서 재귀 검색
        if (resource.children && resource.children.length > 0) {
          const result = findMethodById(resource.children);
          if (result) return result;
        }
      }
      return null;
    };

    const result = findMethodById(tree);
    if (result) {
      setSelectedResource(result.resource);
      setSelectedMethod(result.method);
      setSelectedMethodId(result.method.id);
      setCreatedMethodId(''); // 초기화
    }
  }, [tree, createdMethodId]);

  useEffect(() => {
    if (!resources.length) return;

    const root = resources[0];

    // 모든 노드 expand
    const collectAllIds = (list: Resource[], acc: string[] = []): string[] => {
      list.forEach((res) => {
        acc.push(res.id);
        if (res.children?.length) collectAllIds(res.children, acc);
      });
      return acc;
    };
    setExpandedResources(collectAllIds([root]));

    // ✅ 생성된 리소스가 있는 경우 → 그걸 선택
    if (createdResourceId) {
      const findResourceById = (list: Resource[]): Resource | null => {
        for (const res of list) {
          if (res.id === createdResourceId) return res;
          if (res.children) {
            const child = findResourceById(res.children);
            if (child) return child;
          }
        }
        return null;
      };

      const newSelected = findResourceById(resources);
      if (newSelected) {
        setSelectedResource(newSelected);
        setSelectedMethod(null);
        setSelectedMethodId('');
        setCreatedResourceId('');
        return;
      }
    }

    // ✅ 삭제된 경우 → 선택된 리소스가 현재 리스트에 없으면 루트로
    if (selectedResource && !findInTree(resources, selectedResource.id)) {
      setSelectedResource(root);
      setSelectedMethod(null);
      setSelectedMethodId('');
      return;
    }

    // ✅ 최초 렌더일 때 → 루트 선택
    if (!selectedResource) {
      setSelectedResource(root);
    }
  }, [resources, createdResourceId]);

  // 리소스 클릭
  const handleResourceClick = (res: Resource) => {
    setSelectedResource(res);
    setSelectedMethod(null);
    // toggleResourceExpansion(res.id);
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
                          setSelectedMethodId(m.id);
                          setSelectedResource(res);
                          setIsMethodEdit(false);
                        }}>
                        <span
                          className={`${getMethodStyle(m.type)} !font-mono !font-bold !text-xs !px-1.5 !py-0.5 rounded`}
                          title={m.info.summary}>
                          {m.type}
                        </span>
                        {isMethodSelected && <Eye className="w-3 h-3" />}
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
              <BreadcrumbPage>Resource : {currentApiName}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/services/api-management')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Resources</h1>
              <p className="text-gray-600 mt-1">
                API Gateway에서 엔드포인트 경로(URI)를 정의하는 객체들을 관리하세요.
              </p>
            </div>
          </div>
          <div className="flex items-center justify-end p-2 gap-2">
            <Button
              size="sm"
              onClick={() => handleDeploy()}
              className="h-[77vh] text-sm rounded-full !px-4 h-[28px] bg-orange-500 hover:bg-orange-600 text-white text-xs lg:text-sm">
              API 배포
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-3">
            <div
              ref={leftSidebarRef}
              className=" h-[77vh] bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-2 overflow-auto">
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
              {/* {selectedMethod ? (
                <MethodDetailCard selectedMethod={selectedMethod} />
              ) : selectedResource ? (
                <ResourceDetailCard
                  selectedResource={selectedResource}
                  setSelectedResource={setSelectedResource}
                  handleMethodClick={handleMethodClick}
                  apiId={currentApiId || ''}
                  setCreatedResourceId={setCreatedResourceId}
                  onMethodDeleted={() => {
                    setSelectedMethod(null);
                    setSelectedMethodId('');
                  }}
                  onResourceDeleted={() => {
                    setSelectedMethod(null);
                    setSelectedMethodId('');
                    setCreatedMethodId('');
                  }}
                />
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                  <p className="text-gray-500 dark:text-gray-400">리소스를 선택해주세요.</p>
                </div>
              )} */}
              {selectedMethod ? (
                <MethodDetailCard selectedMethod={selectedMethod} />
              ) : (
                <ResourceDetailCard
                  selectedResource={selectedResource}
                  setSelectedResource={setSelectedResource}
                  handleMethodClick={handleMethodClick}
                  apiId={currentApiId || ''}
                  setCreatedResourceId={setCreatedResourceId}
                  onMethodDeleted={() => {
                    setSelectedMethod(null);
                    setSelectedMethodId('');
                  }}
                  onResourceDeleted={() => {
                    setSelectedMethod(null);
                    setSelectedMethodId('');
                    setCreatedMethodId('');
                  }}
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
        setCreatedResourceId={setCreatedResourceId}
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
