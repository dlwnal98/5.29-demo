import { AppLayout } from "@/components/layout/AppLayout";
import { useUploadProjectPage } from "./hooks/useUploadProjectPage";
import UploadProjectPageView from "./UploadProjectPageView";

export default function UploadProjectPage() {
  const {
    branch,
    sidebarOpen,
    selectedStructureItem,
    uploadedFiles,
    commitMessage,
    isUploading,
    isDragOver,
    fileInputRef,
    fileStructure,
    breadcrumbItems,
    isUploadDisabled,
    setSelectedStructureItem,
    setCommitMessage,
    toggleSidebar,
    handleBack,
    handleFileSelect,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    removeFile,
    triggerFileInput,
    formatFileSize,
    uploadFile,
  } = useUploadProjectPage();

  return (
    <AppLayout projectSlug="config">
      <UploadProjectPageView
        branch={branch}
        sidebarOpen={sidebarOpen}
        selectedStructureItem={selectedStructureItem}
        uploadedFiles={uploadedFiles}
        commitMessage={commitMessage}
        isUploading={isUploading}
        isDragOver={isDragOver}
        fileInputRef={fileInputRef}
        fileStructure={fileStructure}
        breadcrumbItems={breadcrumbItems}
        isUploadDisabled={isUploadDisabled}
        onStructureItemSelect={setSelectedStructureItem}
        onCommitMessageChange={setCommitMessage}
        onToggleSidebar={toggleSidebar}
        onBack={handleBack}
        onFileSelect={handleFileSelect}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onRemoveFile={removeFile}
        onTriggerFileInput={triggerFileInput}
        formatFileSize={formatFileSize}
        onUploadFile={uploadFile}
      />
    </AppLayout>
  );
}
