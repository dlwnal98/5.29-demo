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
    selectedWholeStageInfo,
    selectedMethod,
    expandedPaths,
    selectedStageEndpointUrl,
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
    onResourceClick,
    onMethodClick,
    onToggleExpanded,
    onCopyUrl,
    onCopyMethodUrl,
    onExportApi,
    onStageOpenApiData,
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
    getResourceKey,
  } = useStagesPage();

  const { handleDeleteStage } = useDeleteStageAction({
    userKey,
    stageDetailData: stageDetailData,
    onOpenChange: onCloseDeleteDialog,
    onSuccess: onAfterStageDelete,
  });


  return (
    <>
      <StagesPageView
        stagesListData={stagesListData}
        selectedWholeStageInfo={selectedWholeStageInfo}
        selectedMethod={selectedMethod}
        expandedPaths={expandedPaths}
        selectedStageEndpointUrl={selectedStageEndpointUrl}
        // Stage Resource Tree 관련
        selectedStageId={selectedStageId}
        stageResourcesMap={stageResourcesMap}
        expandedStages={expandedStages}
        expandedResources={expandedResources}
        selectedResource={selectedResource}
        selectedTreeMethod={selectedTreeMethod}
        stageDetailData={stageDetailData}
        refreshStageDetailData={refreshStageDetailData}
        onResourceClick={onResourceClick}
        onMethodClick={onMethodClick}
        onToggleExpanded={onToggleExpanded}
        onCopyUrl={onCopyUrl}
        onCopyMethodUrl={onCopyMethodUrl}
        onExportApi={onExportApi}
        onStageOpenApiData={onStageOpenApiData}
        onToggleResourceExpansion={onToggleResourceExpansion}
        onTreeResourceClick={onTreeResourceClick}
        onTreeMethodClick={onTreeMethodClick}
        onOpenCreateModal={onOpenCreateModal}
        onOpenEditModal={onOpenEditModal}
        onOpenDeleteDialog={onOpenDeleteDialog}
        onOpenExportModal={onOpenExportModal}
        getResourceKey={getResourceKey}
      />

      <CreateStageDialog
        open={isCreateStageModalOpen}
        onOpenChange={(open) => !open && onCloseCreateModal()}
        tenantId={tenantId}
        userKey={userKey}
        apiId={apiId}
        onSuccess={onAfterStageCreate}
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
        userKey={userKey}
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
