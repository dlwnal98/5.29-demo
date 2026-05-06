import { useFileBrowser } from "./hooks/useFileBrowser";
import FileBrowserView from "./FileBrowserView";
import BranchManagementModal from "./BranchManagementModal";

export function FileBrowser() {
  const {
    currentBranch,
    searchQuery,
    isBranchModalOpen,
    currentDir,
    sortedData,
    branchListData,
    mdFile,
    originFileDetailData,
    breadcrumbItems,
    isFileListLoading,
    isMdLoading,
    setSearchQuery,
    handleFileClick,
    handleEditReadme,
    handleUploadFiles,
    handleCreateFile,
    handleBack,
    handleBranchChange,
    openBranchModal,
    closeBranchModal,
    openGitTea,
  } = useFileBrowser();

  return (
    <>
      <FileBrowserView
        currentBranch={currentBranch}
        searchQuery={searchQuery}
        currentDir={currentDir}
        sortedData={sortedData}
        branchListData={branchListData}
        mdFile={mdFile}
        originFileDetailData={originFileDetailData}
        breadcrumbItems={breadcrumbItems}
        isFileListLoading={isFileListLoading}
        isMdLoading={isMdLoading}
        onSearchQueryChange={setSearchQuery}
        onFileClick={handleFileClick}
        onEditReadme={handleEditReadme}
        onUploadFiles={handleUploadFiles}
        onCreateFile={handleCreateFile}
        onBack={handleBack}
        onBranchChange={handleBranchChange}
        onOpenBranchModal={openBranchModal}
        onOpenGitTea={openGitTea}
      />
      <BranchManagementModal
        isOpen={isBranchModalOpen}
        onClose={closeBranchModal}
        branches={branchListData ?? []}
      />
    </>
  );
}
