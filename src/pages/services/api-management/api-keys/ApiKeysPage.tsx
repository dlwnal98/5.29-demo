import { AppLayout } from "@/components/layout/AppLayout";
import { Toaster } from "sonner";
import { useApiKeysPage } from "./hooks/useApiKeysPage";
import ApiKeysPageView from "./ApiKeysPageView";
import CreateAPIKeyDialog from "./components/CreateAPIKeyDialog";
import ModifyAPIKeyDialog from "./components/ModifyAPIKeyDialog";
import DeleteAPIKeyDialog from "./components/DeleteAPIKeyDialog";
import CopyAPIKeyDialog from "./components/CopyAPIKeyDialog";

export default function ApiKeysPage() {
  const {
    currentApiKeys,
    editingApiKey,
    deletingApiKey,
    copyApiKey,
    newApiKey,
    searchTerm,
    currentPage,
    totalPages,
    isCreateModalOpen,
    isEditModalOpen,
    isDeleteModalOpen,
    isCopyModalOpen,
    setSearchTerm,
    setCurrentPage,
    setNewApiKey,
    setEditingApiKey,
    handleCreate,
    handleRefresh,
    handleEdit,
    handleUpdate,
    handleDeleteClick,
    handleDeleteConfirm,
    handleCopyApiKey,
    openCreateModal,
    closeCreateModal,
    closeEditModal,
    closeDeleteModal,
    closeCopyModal,
  } = useApiKeysPage();

  return (
    <AppLayout>
      <Toaster position="bottom-center" richColors expand={true} />

      <ApiKeysPageView
        currentApiKeys={currentApiKeys}
        searchTerm={searchTerm}
        currentPage={currentPage}
        totalPages={totalPages}
        onSearchTermChange={setSearchTerm}
        onPageChange={setCurrentPage}
        onRefresh={handleRefresh}
        onCreateClick={openCreateModal}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        onCopy={handleCopyApiKey}
      />

      {/* API key 생성 */}
      <CreateAPIKeyDialog
        isOpen={isCreateModalOpen}
        newApiKey={newApiKey}
        onClose={closeCreateModal}
        onNewApiKeyChange={setNewApiKey}
        onSubmit={handleCreate}
      />

      {/* API key 수정 */}
      <ModifyAPIKeyDialog
        isOpen={isEditModalOpen}
        editingApiKey={editingApiKey}
        onClose={closeEditModal}
        onEditingApiKeyChange={setEditingApiKey}
        onSubmit={handleUpdate}
      />

      {/* API key 삭제 */}
      <DeleteAPIKeyDialog
        isOpen={isDeleteModalOpen}
        deletingApiKey={deletingApiKey}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteConfirm}
      />

      {/* API key 복사 */}
      <CopyAPIKeyDialog
        isOpen={isCopyModalOpen}
        copyApiKey={copyApiKey}
        onClose={closeCopyModal}
      />
    </AppLayout>
  );
}
