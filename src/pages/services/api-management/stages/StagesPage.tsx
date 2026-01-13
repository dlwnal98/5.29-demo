import StagesPageView from "./StagesPageView";
import CreateStageDialog from "./components/CreateStageDialog";
import ModifyStageDialog from "./components/ModifyStageDialog";
import DeleteStageDialog from "./components/DeleteStageDialog";
import { useStagesPage } from "./hooks/useStagesPage";
import { useDeleteStageAction } from "./hooks/useDeleteStageAction";


export default function StagesPage() {
  const {
    userKey,
    tenantId,
    apiId,
    resourceTree,
    stagesListData,
    selectedWholeStageInfo,
    selectedMethod,
    expandedPaths,
    selectedStageEndpointUrl,
    isEditModalOpen,
    isCreateStageModalOpen,
    isDeleteStageDialogOpen,
    onResourceClick,
    onMethodClick,
    onToggleExpanded,
    onCopyUrl,
    onCopyMethodUrl,
    onExportApi,
    onOpenCreateModal,
    onCloseCreateModal,
    onOpenEditModal,
    onCloseEditModal,
    onOpenDeleteDialog,
    onCloseDeleteDialog,
    getResourceKey,
  } = useStagesPage();

  const { handleDeleteStage } = useDeleteStageAction({
    userKey,
    selectedStage: selectedWholeStageInfo.resource,
    onOpenChange: onCloseDeleteDialog,
  });


  return (
    <>
      <StagesPageView
        resourceTree={resourceTree}
        stagesListData={stagesListData}
        selectedWholeStageInfo={selectedWholeStageInfo}
        selectedMethod={selectedMethod}
        expandedPaths={expandedPaths}
        selectedStageEndpointUrl={selectedStageEndpointUrl}
        onResourceClick={onResourceClick}
        onMethodClick={onMethodClick}
        onToggleExpanded={onToggleExpanded}
        onCopyUrl={onCopyUrl}
        onCopyMethodUrl={onCopyMethodUrl}
        onExportApi={onExportApi}
        onOpenCreateModal={onOpenCreateModal}
        onOpenEditModal={onOpenEditModal}
        onOpenDeleteDialog={onOpenDeleteDialog}
        getResourceKey={getResourceKey}
      />

      <CreateStageDialog
        open={isCreateStageModalOpen}
        onOpenChange={(open) => !open && onCloseCreateModal()}
        tenantId={tenantId}
        userKey={userKey}
        apiId={apiId}
      />

      <ModifyStageDialog
        open={isEditModalOpen}
        onOpenChange={(open) => !open && onCloseEditModal()}
        selectedStage={{
          name: selectedWholeStageInfo.resource.name || "",
          description: selectedWholeStageInfo.resource.description || "",
          stageId: selectedWholeStageInfo.resource.stageId || "",
        }}
      />

      <DeleteStageDialog
        open={isDeleteStageDialogOpen}
        onOpenChange={(open) => !open && onCloseDeleteDialog()}
        userKey={userKey}
        selectedStage={{
          name: selectedWholeStageInfo.resource.name || "",
          stageId: selectedWholeStageInfo.resource.stageId || "",
        }}
        deleteStage={handleDeleteStage}
      />
    </>
  );
}
