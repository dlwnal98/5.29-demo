import { DeleteConfirmationModal } from "@/pages/infra-packages/config/projects/components/DeleteConfirmationModal";
import { useViewProjectPage } from "./hooks/useViewProjectPage";
import ViewProjectPageView from "./ViewProjectPageView";

export default function ViewProjectPage() {
  const {
    branch,
    fileName,
    fileDetailData,
    isFileDetailLoading,
    fileExtension,
    sidebarOpen,
    selectedStructureItem,
    showDeleteModal,
    fileData,
    fileStructure,
    breadcrumbItems,
    setSelectedStructureItem,
    toggleSidebar,
    handleBack,
    handleEdit,
    handleCommitHistory,
    openDeleteModal,
    closeDeleteModal,
  } = useViewProjectPage();

  return (
    <>
      <ViewProjectPageView
        branch={branch}
        fileName={fileName}
        fileDetailData={fileDetailData}
        isFileDetailLoading={isFileDetailLoading}
        fileExtension={fileExtension}
        sidebarOpen={sidebarOpen}
        selectedStructureItem={selectedStructureItem}
        fileStructure={fileStructure}
        breadcrumbItems={breadcrumbItems}
        onStructureItemSelect={setSelectedStructureItem}
        onToggleSidebar={toggleSidebar}
        onBack={handleBack}
        onEdit={handleEdit}
        onCommitHistory={handleCommitHistory}
        onDelete={openDeleteModal}
      />
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={closeDeleteModal}
        fileName={fileName}
        fileData={fileData}
      />
    </>
  );
}
