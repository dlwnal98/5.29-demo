import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  ChevronRight,
  Copy,
  Download,
  Trash2,
  Settings,
} from "lucide-react";
import { getMethodStyle } from "@/lib/etc";
import DeploymentList from "./components/DeploymentList";
import { StageResourceTree } from "./components/StageResourceTree";
import type { ApiResource, ApiMethod, SelectedWholeStageInfo, SelectedMethod } from "./types";

interface StagesPageViewProps {
  resourceTree: ApiResource[];
  selectedWholeStageInfo: SelectedWholeStageInfo;
  selectedMethod: SelectedMethod | null;
  expandedPaths: Set<string>;
  selectedStageEndpointUrl: string;
  onResourceClick: (resource: ApiResource, type: "stage" | "resource") => void;
  onMethodClick: (method: ApiMethod, resource: ApiResource) => void;
  onToggleExpanded: (resource: ApiResource, parentPath?: string) => void;
  onCopyUrl: () => void;
  onCopyMethodUrl: (url: string) => void;
  onExportApi: () => void;
  onOpenCreateModal: () => void;
  onOpenEditModal: () => void;
  onOpenDeleteDialog: () => void;
  getResourceKey: (resource: ApiResource, parentPath?: string) => string;
}

export default function StagesPageView({
  resourceTree,
  selectedWholeStageInfo,
  selectedMethod,
  expandedPaths,
  selectedStageEndpointUrl,
  onResourceClick,
  onMethodClick,
  onToggleExpanded,
  onCopyUrl,
  onCopyMethodUrl,
  onExportApi,
  onOpenCreateModal,
  onOpenEditModal,
  onOpenDeleteDialog,
  getResourceKey,
}: StagesPageViewProps) {

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/services">Services</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/services/api-management">
              API Management
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Stages</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="ml-2">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Stages
          </h1>
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
                size={"sm"}
                variant={"outline"}
                className="rounded-full h-[25px] !gap-1 border-2 border-blue-500 text-[#0F74E1] font-bold hover:text-blue-700 hover:bg-blue-50"
                onClick={onOpenCreateModal}
              >
                스테이지 생성
              </Button>
            </div>
            <div className="space-y-1">
              {resourceTree?.map((resource) => (
                <StageResourceTree
                  key={resource.id}
                  resource={resource}
                  selectedWholeStageInfo={selectedWholeStageInfo}
                  selectedMethod={selectedMethod}
                  expandedPaths={expandedPaths}
                  onResourceClick={onResourceClick}
                  onMethodClick={onMethodClick}
                  onToggleExpanded={onToggleExpanded}
                  getResourceKey={getResourceKey}
                />
              ))}
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
                        )}`}
                      >
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
                        onClick={() => onCopyMethodUrl(selectedMethod.url)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : selectedWholeStageInfo.type === "resource" ? (
              /* Resource Detail View */
              <Card>
                <CardHeader>
                  <CardTitle>
                    메서드 - {selectedWholeStageInfo.resource.path}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        메서드 ({selectedWholeStageInfo?.resource?.methods?.length})
                      </Label>
                      {(selectedWholeStageInfo?.resource?.methods?.length ?? 0) > 0 ? (
                        <div className="mt-2 space-y-2">
                          {selectedWholeStageInfo?.resource?.methods?.map(
                            (method) => (
                              <div
                                key={method.id}
                                className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                                onClick={() =>
                                  onMethodClick(
                                    method,
                                    selectedWholeStageInfo.resource as ApiResource
                                  )
                                }
                              >
                                <div className="flex items-center gap-3">
                                  <span
                                    className={`px-2 py-1 rounded text-sm font-mono !font-bold ${getMethodStyle(
                                      method.type
                                    )}`}
                                  >
                                    {method.type}
                                  </span>
                                  <div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                      {method.info?.summary}
                                    </div>
                                  </div>
                                </div>
                                <ChevronRight className="h-4 w-4 text-gray-400" />
                              </div>
                            )
                          )}
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
                        onClick={onOpenEditModal}
                        className="text-gray-600 hover:text-gray-700 hover:bg-gray-50 border-gray-200"
                        title="스테이지 수정"
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={onExportApi}
                        className="text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200 bg-transparent"
                        title="API 내보내기"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={onOpenDeleteDialog}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                        title="스테이지 삭제"
                      >
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
                            onClick={onCopyUrl}
                            className="text-blue-600 hover:text-blue-700 text-sm font-mono flex items-center gap-1"
                          >
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
                deploymentId: selectedWholeStageInfo.resource.deploymentId || "",
                stageId: selectedWholeStageInfo.resource.stageId || "",
                name: selectedWholeStageInfo.resource.name || "",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
