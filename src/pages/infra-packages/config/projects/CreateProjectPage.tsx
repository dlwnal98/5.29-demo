import { AppLayout } from "@/components/layout/AppLayout";
import { useCreateProjectPage } from "./hooks/useCreateProjectPage";
import CreateProjectPageView from "./CreateProjectPageView";

export default function CreateProjectPage() {
  const {
    branch,
    sidebarOpen,
    selectedStructureItem,
    fileName,
    fileContent,
    commitMessage,
    isSaving,
    selectExtension,
    fileStructure,
    fileExtensionData,
    breadcrumbItems,
    isCreateDisabled,
    setSelectedStructureItem,
    setFileName,
    setFileContent,
    setCommitMessage,
    setSelectExtension,
    toggleSidebar,
    handleBack,
    createFile,
  } = useCreateProjectPage();

  return (
    <AppLayout projectSlug="config">
      <CreateProjectPageView
        branch={branch}
        sidebarOpen={sidebarOpen}
        selectedStructureItem={selectedStructureItem}
        fileName={fileName}
        fileContent={fileContent}
        commitMessage={commitMessage}
        isSaving={isSaving}
        selectExtension={selectExtension}
        fileStructure={fileStructure}
        fileExtensionData={fileExtensionData}
        breadcrumbItems={breadcrumbItems}
        isCreateDisabled={isCreateDisabled}
        onStructureItemSelect={setSelectedStructureItem}
        onFileNameChange={setFileName}
        onFileContentChange={setFileContent}
        onCommitMessageChange={setCommitMessage}
        onExtensionChange={setSelectExtension}
        onToggleSidebar={toggleSidebar}
        onBack={handleBack}
        onCreateFile={createFile}
      />
    </AppLayout>
  );
}
