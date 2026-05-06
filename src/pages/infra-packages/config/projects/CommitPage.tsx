import { AppLayout } from "@/components/layout/AppLayout";
import { RollbackConfirmationModal } from "@/pages/infra-packages/config/projects/components/RollbackConfirmationModal";
import { useCommitPage } from "./hooks/useCommitPage";
import CommitPageView from "./CommitPageView";

export default function CommitPage() {
  const {
    branch,
    fileName,
    selectSha,
    commitDetailData,
    isCommitDetailLoading,
    isFileDiffLoading,
    parsedDiff,
    rollbackModal,
    breadcrumbItems,
    handleBack,
    handleRollbackClick,
    handleRollbackClose,
    getStatusColor,
  } = useCommitPage();

  return (
    <>
      <CommitPageView
        branch={branch}
        breadcrumbItems={breadcrumbItems}
        commitDetailData={commitDetailData}
        isCommitDetailLoading={isCommitDetailLoading}
        isFileDiffLoading={isFileDiffLoading}
        parsedDiff={parsedDiff}
        onBack={handleBack}
        onRollbackClick={handleRollbackClick}
        getStatusColor={getStatusColor}
      />
      <RollbackConfirmationModal
        isOpen={rollbackModal.isOpen}
        onClose={handleRollbackClose}
        branch={branch}
        fileName={fileName}
        commitHash={selectSha || ""}
        commitMessage={commitDetailData?.commit?.message || ""}
      />
    </>
  );
}
