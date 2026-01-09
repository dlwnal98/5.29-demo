import { Suspense } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Toaster } from "sonner";
import ApiManagementPageView from "./ApiManagementPageView";
import ApiCreateDialog from "./components/ApiCreateDialog";
import ApiModifyDialog from "./components/ApiModifyDialog";
import ApiDeleteDialog from "./components/ApiDeleteDialog";
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
    setCurrentPage,
    onApiClick,
    onSearchTermChange,
    onOpenCreateModal,
    onCloseCreateModal,
    onOpenModifyModal,
    onCloseModifyModal,
    onOpenDeleteModal,
    onCloseDeleteModal,
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
        />

        <ApiCreateDialog
          userKey={userKey}
          tenantId={tenantId}
          open={isCreateModalOpen}
          onOpenChange={(open) => !open && onCloseCreateModal()}
          apiList={filteredPlans}
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
          userKey={userKey}
          apiName={selectedApiName}
        />
      </>
    </Suspense>
  );
}
