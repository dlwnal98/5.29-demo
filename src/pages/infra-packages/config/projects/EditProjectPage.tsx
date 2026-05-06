import { AppLayout } from "@/components/layout/AppLayout";
import { useEditProjectPage } from "./hooks/useEditProjectPage";
import EditProjectPageView from "./EditProjectPageView";

export default function EditProjectPage() {
  const {
    branch,
    sidebarOpen,
    selectedStructureItem,
    fileName,
    fileContent,
    commitMessage,
    isFileDetailLoading,
    fileStructure,
    breadcrumbItems,
    setSelectedStructureItem,
    setFileContent,
    setCommitMessage,
    toggleSidebar,
    handleBack,
    modifyFile,
  } = useEditProjectPage();

  return (
    <>
      <EditProjectPageView
        branch={branch}
        sidebarOpen={sidebarOpen}
        selectedStructureItem={selectedStructureItem}
        fileName={fileName}
        fileContent={fileContent}
        commitMessage={commitMessage}
        isFileDetailLoading={isFileDetailLoading}
        fileStructure={fileStructure}
        breadcrumbItems={breadcrumbItems}
        onStructureItemSelect={setSelectedStructureItem}
        onFileContentChange={setFileContent}
        onCommitMessageChange={setCommitMessage}
        onToggleSidebar={toggleSidebar}
        onBack={handleBack}
        onModifyFile={modifyFile}
      />
    </>
  );
}
