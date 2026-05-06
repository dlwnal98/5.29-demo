import { AppLayout } from "@/components/layout/AppLayout";
import { useCommitsPage } from "./hooks/useCommitsPage";
import CommitsPageView from "./CommitsPageView";

export default function CommitsPage() {
  const {
    branch,
    commitListData,
    isLoading,
    breadcrumbItems,
    handleCommitClick,
    handleBack,
  } = useCommitsPage();

  return (
    <>
      <CommitsPageView
        branch={branch}
        breadcrumbItems={breadcrumbItems}
        commitListData={commitListData}
        isLoading={isLoading}
        onBack={handleBack}
        onCommitClick={handleCommitClick}
      />
    </>
  );
}
