import { Suspense } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Toaster } from "sonner";
import ApiManagementPageView from "./ApiManagementPageView";
import ApiCreateDialog from "./components/ApiCreateDialog";
import ApiModifyDialog from "./components/ApiModifyDialog";
import ApiDeleteDialog from "./components/ApiDeleteDialog";
import ApiExportDialog from "./components/ApiExportDialog";
import { useApiManagementPage } from "./hooks/useApiManagementPage";

export default function ApiManagementPage() {
  const {
    userKey,
    tenantId,
    searchTerm,
    filteredPlans,
    currentPage,
    totalPages,
    selectedAPIId,
    selectedApiName,
    modifyApiForm,
    isCreateModalOpen,
    isModifyModalOpen,
    isDeleteModalOpen,
    isExportModalOpen,
    setCurrentPage,
    onApiClick,
    onSearchTermChange,
    onOpenCreateModal,
    onCloseCreateModal,
    onOpenModifyModal,
    onCloseModifyModal,
    onOpenDeleteModal,
    onCloseDeleteModal,
    onAPIExport,
    onOpenExportModal,
    onCloseExportModal,
    onAfterCreate,
  } = useApiManagementPage();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <>
        <ApiManagementPageView
          searchTerm={searchTerm}
          filteredPlans={filteredPlans}
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          onApiClick={onApiClick}
          onSearchTermChange={onSearchTermChange}
          onOpenCreateModal={onOpenCreateModal}
          onOpenModifyModal={onOpenModifyModal}
          onOpenDeleteModal={onOpenDeleteModal}
          onOpenExportModal={onOpenExportModal}
        />

        <ApiCreateDialog
          userKey={userKey}
          tenantId={tenantId}
          open={isCreateModalOpen}
          onOpenChange={(open) => !open && onCloseCreateModal()}
          apiList={filteredPlans}
          onAfterCreate={onAfterCreate}
        />

        <ApiModifyDialog
          open={isModifyModalOpen}
          onOpenChange={(open) => !open && onCloseModifyModal()}
          existingValue={modifyApiForm}
          selectedAPIId={selectedAPIId}
          userKey={userKey}
        />

        <ApiDeleteDialog
          open={isDeleteModalOpen}
          onOpenChange={(open) => !open && onCloseDeleteModal()}
          selectedAPIId={selectedAPIId}
          apiName={selectedApiName}
        />

        <ApiExportDialog
          open={isExportModalOpen}
          onOpenChange={(open) => !open && onCloseExportModal()}
          selectedAPIId={selectedAPIId}
          apiName={selectedApiName}
        />
      </>
    </Suspense>
  );
}
