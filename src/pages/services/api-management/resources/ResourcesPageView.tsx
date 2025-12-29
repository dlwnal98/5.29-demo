import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ArrowLeft, SquarePlus, SquareMinus, Eye } from "lucide-react";
import type { Resource, Method } from "@/types/resource";
import { getMethodStyle } from "@/lib/etc";
import { ResourceDetailCard } from "./components/ResourceDetailCard";
import MethodDetailCard from "./components/MethodDetailCard";
import { RefObject } from "react";

interface ResourcesPageViewProps {
  leftSidebarRef: RefObject<HTMLDivElement>;
  rightContentRef: RefObject<HTMLDivElement>;
  tree: Resource[];
  selectedResource: Resource | null;
  selectedMethod: Method | null;
  expandedResources: string[] | undefined;
  currentApiId: string;
  currentApiName: string;
  onNavigateBack: () => void;
  onResourceClick: (res: Resource) => void;
  onMethodClick: (method: Method, resource: Resource) => void;
  onToggleResourceExpansion: (id: string) => void;
  onOpenDeployModal: () => void;
  onOpenCreateModal: () => void;
  setSelectedResource: (resource: Resource | null) => void;
  setCreatedResourceId: (id: string) => void;
  onMethodDeleted: () => void;
  onResourceDeleted: () => void;
}

export default function ResourcesPageView({
  leftSidebarRef,
  rightContentRef,
  tree,
  selectedResource,
  selectedMethod,
  expandedResources,
  currentApiId,
  currentApiName,
  onNavigateBack,
  onResourceClick,
  onMethodClick,
  onToggleResourceExpansion,
  onOpenDeployModal,
  onOpenCreateModal,
  setSelectedResource,
  setCreatedResourceId,
  onMethodDeleted,
  onResourceDeleted,
}: ResourcesPageViewProps) {
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
                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                    : ""
                }`}
                onClick={() => onResourceClick(res)}
              >
                {(res.children?.length ?? 0) > 0 ||
                (res.methods?.length ?? 0) > 0 ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleResourceExpansion(res.id);
                    }}
                  >
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
                  {res.name === "/" ? "/" : `/${res.name}`}
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
                            ? "bg-white dark:bg-gray-900/30 text-gray-700 dark:text-gray-300"
                            : "text-gray-600 dark:text-gray-400"
                        }`}
                        onClick={() => onMethodClick(m, res)}
                      >
                        <span
                          className={`${getMethodStyle(m.type)} !font-mono !font-bold !text-xs !px-1.5 !py-0.5 rounded`}
                          title={m.info.summary}
                        >
                          {m.type}
                        </span>
                        {isMethodSelected && <Eye className="w-3 h-3" />}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* children recursive */}
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
    <div className="container mx-auto px-4 py-6">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/services/api-management">
              Services
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/services/api-management">
              API Management
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Resource : {currentApiName}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onNavigateBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Resources
            </h1>
            <p className="text-gray-600 mt-1">
              API Gateway에서 엔드포인트 경로(URI)를 정의하는 객체들을
              관리하세요.
            </p>
          </div>
        </div>
        <div className="flex items-center justify-end p-2 gap-2">
          <Button
            size="sm"
            onClick={onOpenDeployModal}
            className="text-sm rounded-full !px-4 h-[28px] bg-orange-500 hover:bg-orange-600 text-white text-xs lg:text-sm"
          >
            API 배포
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-3">
          <div
            ref={leftSidebarRef}
            className="h-[77vh] bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-2 overflow-auto"
          >
            <div className="flex items-center justify-end p-2 gap-2">
              <Button
                size="sm"
                variant={"outline"}
                onClick={onOpenCreateModal}
                className="rounded-full h-[25px] !gap-1 border-2 border-blue-500 text-[#0F74E1] font-bold hover:text-blue-700 hover:bg-blue-50"
              >
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
                handleMethodClick={onMethodClick}
                apiId={currentApiId}
                setCreatedResourceId={setCreatedResourceId}
                onMethodDeleted={onMethodDeleted}
                onResourceDeleted={onResourceDeleted}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
