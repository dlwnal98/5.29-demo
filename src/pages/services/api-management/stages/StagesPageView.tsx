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
import { getMethodStyle } from "@/libs/etc";
import DeploymentList from "./components/DeploymentList";
import { StageResourceTree } from "./components/StageResourceTree";
import type { ApiResource, ApiMethod, SelectedWholeStageInfo, SelectedMethod } from "./types";

interface StagesPageViewProps {
  stagesListData: any;
  deploymentHistoryData: any;
  // Stage Resource Tree 관련
  stageResourcesMap: Record<string, any[]>;
  expandedStages: Set<string>;
  expandedResources: string[];
  selectedResource: any | null;
  selectedTreeMethod: any | null;
  stageDetailData: any | null;
  refreshStageDetailData: () => Promise<void>;
  onCopyUrl: () => void;
  onCopyMethodUrl: (url: string) => void;
  onOpenCreateModal: () => void;
  onOpenEditModal: () => void;
  onOpenDeleteDialog: () => void;
  onOpenExportModal: () => void;
  onStageOpenApiData: (stageId: string) => void;
  onToggleResourceExpansion: (resourceId: string) => void;
  onTreeResourceClick: (resource: any) => void;
  onTreeMethodClick: (method: any, resource: any) => void;
}

export default function StagesPageView({
  stagesListData,
  deploymentHistoryData,
  // Stage Resource Tree 관련
  stageResourcesMap,
  expandedStages,
  expandedResources,
  selectedResource,
  selectedTreeMethod,
  stageDetailData,
  refreshStageDetailData,
  onCopyUrl,
  onCopyMethodUrl,
  onOpenCreateModal,
  onOpenEditModal,
  onOpenDeleteDialog,
  onOpenExportModal,
  onStageOpenApiData,
  onToggleResourceExpansion,
  onTreeResourceClick,
  onTreeMethodClick,
}: StagesPageViewProps) {
  console.log(stageDetailData)
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
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage stages to divide the execution environment of deployed APIs.
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
                Create Stage
              </Button>
            </div>
            <div className="space-y-1">
              <StageResourceTree
                stagesListData={stagesListData}
                stageResourcesMap={stageResourcesMap}
                expandedStages={expandedStages}
                expandedResources={expandedResources}
                selectedResource={selectedResource}
                selectedTreeMethod={selectedTreeMethod}
                onStageOpenApiData={onStageOpenApiData}
                onToggleResourceExpansion={onToggleResourceExpansion}
                onTreeResourceClick={onTreeResourceClick}
                onTreeMethodClick={onTreeMethodClick}
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-span-9">
          <div className="space-y-6">
            {selectedTreeMethod ? (
              /* Method Detail View */
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 rounded text-xl font-mono ${getMethodStyle(
                          selectedTreeMethod.type
                        )}`}
                      >
                        {selectedTreeMethod.type}
                      </span>
                      {selectedTreeMethod.path} - Method Detail
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Method Type
                    </Label>
                    <div className="mt-1 text-gray-900 dark:text-gray-100">
                      {selectedTreeMethod.type}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Path
                    </Label>
                    <div className="mt-1 flex items-center gap-2">
                      <code className="text-gray-900 dark:text-gray-100 font-mono">
                        {`${stageDetailData?.endpoint?.fullEndpoint}${selectedTreeMethod.resourcePath}`}
                      </code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onCopyMethodUrl(`${stageDetailData?.endpoint?.fullEndpoint}${selectedTreeMethod.resourcePath}`)}
                        className="h-6 w-6 p-0"
                        title="Copy Path"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  {selectedTreeMethod.info?.summary && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Summary
                      </Label>
                      <div className="mt-1 text-gray-900 dark:text-gray-100">
                        {selectedTreeMethod.info.summary}
                      </div>
                    </div>
                  )}
                  {selectedTreeMethod.info?.description && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Description
                      </Label>
                      <div className="mt-1 text-gray-900 dark:text-gray-100">
                        {selectedTreeMethod.info.description}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : selectedResource ? (
              /* Resource Detail View */
              <Card>
                <CardHeader>
                  <CardTitle>
                    Resource - {selectedResource.path || `/${selectedResource.name}`}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Methods ({selectedResource?.methods?.length || 0})
                      </Label>
                      {(selectedResource?.methods?.length ?? 0) > 0 ? (
                        <div className="mt-2 space-y-2">
                          {selectedResource?.methods?.map((method: any) => (
                            <div
                              key={method.id}
                              className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                              onClick={() => onTreeMethodClick(method, selectedResource)}
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
                          ))}
                        </div>
                      ) : (
                        <div className="mt-2 text-center py-8 text-gray-500 dark:text-gray-400">
                          This resource has no defined methods.
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : stageDetailData ? (
              /* Stage Details */
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="border-b border-gray-200 dark:border-gray-700 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Stage Details
                      </h2>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={onOpenEditModal}
                        className="text-gray-600 hover:text-gray-700 hover:bg-gray-50 border-gray-200"
                        title="Stage Edit"
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={onOpenExportModal}
                        className="text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200 bg-transparent"
                        title="Export API"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={onOpenDeleteDialog}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                        title="Delete Stage"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="p-4 space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Stage ID
                    </Label>
                    <div className="mt-1 text-blue-600 font-medium">
                      {stageDetailData.stageId}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Stage Name
                    </Label>
                    <div className="mt-1 text-blue-600 font-medium">
                      {stageDetailData.stageName}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Stage Path
                    </Label>
                    <div className="mt-1 flex items-center gap-2">
                      <code className="text-blue-600 font-mono">
                        {stageDetailData?.endpoint?.fullEndpoint}
                      </code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onCopyMethodUrl(stageDetailData.endpoint?.fullEndpoint || "")}
                        className="h-6 w-6 p-0"
                        title="Copy Path"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  {stageDetailData.description && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Description
                      </Label>
                      <div className="mt-1 text-gray-900 dark:text-gray-100">
                        {stageDetailData.description}
                      </div>
                    </div>
                  )}
                  {stageDetailData.baseUrl && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Base URL
                      </Label>
                      <div className="mt-1 flex items-center gap-2">
                        <code className="text-blue-600 text-sm font-mono">
                          {stageDetailData.baseUrl}
                        </code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={onCopyUrl}
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                  {stageDetailData.createdAt && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Created At
                      </Label>
                      <div className="mt-1 text-gray-900 dark:text-gray-100">
                        {new Date(stageDetailData.createdAt).toLocaleString('ko-KR')}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* 초기 상태 - 스테이지 선택 안됨 */
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                  Please select a stage from the left.
                </div>
              </div>
            )}
            {stagesListData && stagesListData.length > 0 ? (
              <DeploymentList
                selectedStage={{
                  activeDeploymentId: stageDetailData?.activeDeploymentId || "",
                  stageId: stageDetailData?.stageId || "",
                  name: stageDetailData?.stageName || "",
                }}
                onActiveDeploymentChanged={refreshStageDetailData}
                deploymentHistoryData={deploymentHistoryData}
              />
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 flex-1 min-h-[calc(100vh-450px)]" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
