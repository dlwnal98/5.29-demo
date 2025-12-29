import { AppLayout } from "@/components/layout/AppLayout";
import StagesPageView from "./StagesPageView";
import CreateStageDialog from "./components/CreateStageDialog";
import ModifyStageDialog from "./components/ModifyStageDialog";
import DeleteStageDialog from "./components/DeleteStageDialog";
import { useStagesPage } from "./hooks/useStagesPage";

export default function StagesPage() {
  const {
    userKey,
    organizationId,
    apiId,
    resourceTree,
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

  return (
    <AppLayout>
      <StagesPageView
        resourceTree={resourceTree}
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
        organizationId={organizationId}
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
      />
    </AppLayout>
  );
}
