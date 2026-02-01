import { useApiKeysPage } from "./hooks/useApiKeysPage";
import ApiKeysPageView from "./ApiKeysPageView";
import CreateAPIKeyDialog from "./components/CreateAPIKeyDialog";
import DeleteAPIKeyDialog from "./components/DeleteAPIKeyDialog";
import CopyAPIKeyDialog from "./components/CopyAPIKeyDialog";

export default function ApiKeysPage() {
  const {
    currentApiKeys,
    deletingApiKey,
    copyApiKey,
    newApiKey,
    apiKeyDetail,
    searchTerm,
    currentPage,
    totalPages,
    isCreateModalOpen,
    isDeleteModalOpen,
    isCopyModalOpen,
    isDetailModalOpen,
    isDetailLoading,
    setSearchTerm,
    setCurrentPage,
    setNewApiKey,
    handleCreate,
    handleRefresh,
    handleDeleteClick,
    handleDeleteConfirm,
    handleCopyApiKey,
    handleViewDetail,
    openCreateModal,
    closeCreateModal,
    closeDeleteModal,
    closeCopyModal,
    closeDetailModal,
    handleRefreshDetail,
  } = useApiKeysPage();

  return (
    <>

      <ApiKeysPageView
        currentApiKeys={currentApiKeys}
        searchTerm={searchTerm}
        currentPage={currentPage}
        totalPages={totalPages}
        onSearchTermChange={setSearchTerm}
        onPageChange={setCurrentPage}
        onCreateClick={openCreateModal}
        onDelete={handleDeleteClick}
        onCopy={handleCopyApiKey}
        onViewDetail={handleViewDetail}
        isDetailModalOpen={isDetailModalOpen}
        onDetailModalClose={closeDetailModal}
        apiKeyDetail={apiKeyDetail}
        isDetailLoading={isDetailLoading}
        onDetailRefresh={handleRefreshDetail}
      />

      {/* API key 생성 */}
      <CreateAPIKeyDialog
        isOpen={isCreateModalOpen}
        newApiKey={newApiKey}
        onClose={closeCreateModal}
        onNewApiKeyChange={setNewApiKey}
        onSubmit={handleCreate}
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
    </>
  );
}
