import CreateModelDialog from './components/CreateModelDialog';
import ModifyModelDialog from './components/ModifyModelDialog';
import DeleteModelDialog from './components/DeleteModelDialog';
import { useModelsPage } from './hooks/useModelsPage';
import ModelsPageView from './ModelsPageView';

export default function ModelsPage() {
  const {
    models,
    selectedModel,
    apiId,
    tenantId,
    userKey,
    isCreateModalOpen,
    isEditModalOpen,
    isDeleteModalOpen,
    openCreateModal,
    closeCreateModal,
    openEditModal,
    closeEditModal,
    openDeleteModal,
    closeDeleteModal,
  } = useModelsPage();
  console.log(models)
  return (
    <>
      <ModelsPageView
        models={models?.content}
        onCreate={openCreateModal}
        onEdit={openEditModal}
        onDelete={openDeleteModal}
      />

      {/* Model 생성 */}
      <CreateModelDialog
        open={isCreateModalOpen}
        onOpenChange={(open) => !open && closeCreateModal()}
        apiId={apiId}
        tenantId={tenantId}
        userKey={userKey}
      />

      {/* Model 수정 */}
      {selectedModel && (
        <ModifyModelDialog
          open={isEditModalOpen}
          onOpenChange={(open) => !open && closeEditModal()}
          selectedModel={selectedModel}
          userKey={userKey}
        />
      )}

      {/* Model 삭제 */}
      {selectedModel && (
        <DeleteModelDialog
          open={isDeleteModalOpen}
          onOpenChange={(open) => !open && closeDeleteModal()}
          modelId={selectedModel?.modelId}
          modelName={selectedModel?.modelName}
          userKey={userKey}
        />
      )}
    </>
  );
}
