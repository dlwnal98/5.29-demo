import { AppLayout } from "@/components/layout/AppLayout";
import { Toaster } from "sonner";
import ResourcesGridPageView from "./ResourcesGridPageView";
import { ResourceCreateDialog } from "./components/ResourceCreateDialog";
import DeployResourceDialog from "./components/DeployResourceDialog";
import ResourceExportDialog from "./components/ResourceExportDialog";
import { useResourcesPage } from "./hooks/useResourcesPage";
import { useResourceCreateDialog } from "./hooks/useResourceCreateDialog";
import { useDeployResourceDialog } from "./hooks/useDeployResourceDialog";

export default function ResourcesGridPage() {
    const {
        leftSidebarRef,
        rightContentRef,
        tree,
        selectedResource,
        selectedMethod,
        expandedResources,
        currentApiId,
        currentApiName,
        userKey,
        tenantId,
        isDeployModalOpen,
        isCreateModalOpen,
        isExportModalOpen,
        setSelectedResource,
        setCreatedResourceId,
        onNavigateBack,
        onResourceClick,
        onMethodClick,
        onToggleResourceExpansion,
        onOpenDeployModal,
        onCloseDeployModal,
        onOpenCreateModal,
        onCloseCreateModal,
        onOpenExportModal,
        onCloseExportModal,
        onMethodDeleted,
        onResourceDeleted,
        onCorsSettingsSaved,
    } = useResourcesPage();

    // ResourceCreateDialog hook
    const resourceCreateDialog = useResourceCreateDialog({
        open: isCreateModalOpen,
        apiId: currentApiId,
        userKey,
        onOpenChange: (open) => !open && onCloseCreateModal(),
        setCreatedResourceId,
    });

    // DeployResourceDialog hook
    const deployDialog = useDeployResourceDialog({
        open: isDeployModalOpen,
        apiId: currentApiId,
        userKey,
        tenantId,
        onOpenChange: (open) => !open && onCloseDeployModal(),
    });

    return (
        <>
            <ResourcesGridPageView
                leftSidebarRef={leftSidebarRef}
                rightContentRef={rightContentRef}
                tree={tree}
                selectedResource={selectedResource}
                selectedMethod={selectedMethod}
                expandedResources={expandedResources}
                currentApiId={currentApiId}
                currentApiName={currentApiName}
                onNavigateBack={onNavigateBack}
                onResourceClick={onResourceClick}
                onMethodClick={onMethodClick}
                onToggleResourceExpansion={onToggleResourceExpansion}
                onOpenDeployModal={onOpenDeployModal}
                onOpenExportModal={onOpenExportModal}
                onOpenCreateModal={onOpenCreateModal}
                setSelectedResource={setSelectedResource}
                setCreatedResourceId={setCreatedResourceId}
                onMethodDeleted={onMethodDeleted}
                onResourceDeleted={onResourceDeleted}
                onCorsSettingsSaved={onCorsSettingsSaved}
                userKey={userKey}
            />

            <ResourceCreateDialog
                open={isCreateModalOpen}
                onOpenChange={(open) => !open && onCloseCreateModal()}
                createResourceForm={resourceCreateDialog.createResourceForm}
                resourcePaths={resourceCreateDialog.resourcePaths}
                pathPattern={resourceCreateDialog.pathPattern}
                checkUrl={resourceCreateDialog.checkUrl}
                isPending={resourceCreateDialog.isPending}
                onCreateResource={resourceCreateDialog.onCreateResource}
                onResourceNameChange={resourceCreateDialog.onResourceNameChange}
                onDescriptionChange={resourceCreateDialog.onDescriptionChange}
                onEnableCorsChange={resourceCreateDialog.onEnableCorsChange}
                onPathPatternChange={resourceCreateDialog.onPathPatternChange}
                onCancel={resourceCreateDialog.onCancel}
            />

            <DeployResourceDialog
                open={isDeployModalOpen}
                onOpenChange={(open) => !open && onCloseDeployModal()}
                deploymentData={deployDialog.deploymentData}
                stageForDeployment={deployDialog.stageForDeployment}
                isValidDeploy={deployDialog.isValidDeploy}
                isPending={deployDialog.isPending}
                onDeploySubmit={deployDialog.onDeploySubmit}
                onStageChange={deployDialog.onStageChange}
                onNewStageNameChange={deployDialog.onNewStageNameChange}
                onStageDescriptionChange={deployDialog.onStageDescriptionChange}
                onDescriptionChange={deployDialog.onDescriptionChange}
                onDeployModalClose={deployDialog.onDeployModalClose}
            />

            <ResourceExportDialog
                open={isExportModalOpen}
                onOpenChange={(open) => !open && onCloseExportModal()}
                apiId={currentApiId}
                apiName={currentApiName}
            />
        </>
    );
}
