import { useCallback } from "react";
import StagesPageView from "./StagesPageView";
import CreateStageDialog from "./components/CreateStageDialog";
import ModifyStageDialog from "./components/ModifyStageDialog";
import DeleteStageDialog from "./components/DeleteStageDialog";
import StageExportDialog from "./components/StageExportDialog";
import { useStagesPage } from "./hooks/useStagesPage";
import { useDeleteStageAction } from "./hooks/useDeleteStageAction";


export default function StagesPage() {
  const {
    userKey,
    tenantId,
    apiId,
    stagesListData,
    deploymentHistoryData,
    selectedWholeStageInfo,
    refetchDeploymentHistory,
    deploymentPage,
    setDeploymentPage,
    deploymentSize,
    setDeploymentSize,
    isEditModalOpen,
    isCreateStageModalOpen,
    isDeleteStageDialogOpen,
    isExportModalOpen,
    // Stage Resource Tree 관련
    selectedStageId,
    stageResourcesMap,
    expandedStages,
    expandedResources,
    selectedResource,
    selectedTreeMethod,
    stageDetailData,
    refreshStageDetailData,
    onAfterStageDelete,
    onAfterStageCreate,
    onCopyUrl,
    onCopyMethodUrl,
    onStageOpenApiData,
    onToggleStageExpansion,
    onToggleResourceExpansion,
    onTreeResourceClick,
    onTreeMethodClick,
    onOpenCreateModal,
    onCloseCreateModal,
    onOpenEditModal,
    onCloseEditModal,
    onOpenDeleteDialog,
    onCloseDeleteDialog,
    onOpenExportModal,
    onCloseExportModal,
    onGetApiKeyValue,
  } = useStagesPage();

  const { handleDeleteStage } = useDeleteStageAction({
    stageDetailData: stageDetailData,
    onOpenChange: onCloseDeleteDialog,
    onSuccess: onAfterStageDelete,
  });

  // Stage 생성 후 refetch 호출
  const handleAfterStageCreateWithRefetch = useCallback(() => {
    onAfterStageCreate();
    refetchDeploymentHistory();
  }, [onAfterStageCreate, refetchDeploymentHistory]);

  // 활성배포 변경 후 refetch 호출
  const handleRefreshStageDetailDataWithRefetch = useCallback(async () => {
    await refreshStageDetailData();
    refetchDeploymentHistory();
  }, [refreshStageDetailData, refetchDeploymentHistory]);

  return (
    <>
      <StagesPageView
        stagesListData={stagesListData}
        deploymentHistoryData={deploymentHistoryData}
        deploymentPage={deploymentPage}
        setDeploymentPage={setDeploymentPage}
        deploymentSize={deploymentSize}
        setDeploymentSize={setDeploymentSize}
        // Stage Resource Tree 관련
        stageResourcesMap={stageResourcesMap}
        selectedWholeStageInfo={selectedWholeStageInfo}
        expandedStages={expandedStages}
        expandedResources={expandedResources}
        selectedResource={selectedResource}
        selectedTreeMethod={selectedTreeMethod}
        selectedStageId={selectedStageId}
        stageDetailData={stageDetailData}
        refreshStageDetailData={handleRefreshStageDetailDataWithRefetch}
        onCopyUrl={onCopyUrl}
        onCopyMethodUrl={onCopyMethodUrl}
        onStageOpenApiData={onStageOpenApiData}
        onToggleStageExpansion={onToggleStageExpansion}
        onToggleResourceExpansion={onToggleResourceExpansion}
        onTreeResourceClick={onTreeResourceClick}
        onTreeMethodClick={onTreeMethodClick}
        onOpenCreateModal={onOpenCreateModal}
        onOpenEditModal={onOpenEditModal}
        onOpenDeleteDialog={onOpenDeleteDialog}
        onOpenExportModal={onOpenExportModal}
        onGetApiKeyValue={onGetApiKeyValue}
      />

      <CreateStageDialog
        deploymentHistoryData={deploymentHistoryData}
        open={isCreateStageModalOpen}
        onOpenChange={(open) => !open && onCloseCreateModal()}
        tenantId={tenantId}
        userKey={userKey}
        apiId={apiId}
        onSuccess={handleAfterStageCreateWithRefetch}
      />

      <ModifyStageDialog
        open={isEditModalOpen}
        userKey={userKey}
        onOpenChange={(open) => !open && onCloseEditModal()}
        stageDetailData={stageDetailData}
        onSuccess={refreshStageDetailData}
      />

      <DeleteStageDialog
        open={isDeleteStageDialogOpen}
        onOpenChange={(open) => !open && onCloseDeleteDialog()}
        stageDetailData={stageDetailData}
        deleteStage={handleDeleteStage}
      />

      <StageExportDialog
        open={isExportModalOpen}
        onOpenChange={(open) => !open && onCloseExportModal()}
        selectedStageId={selectedStageId || ""}
        stageName={stageDetailData?.stageName || ""}
      />
    </>
  );
}
