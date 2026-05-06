import { useSearchParams } from "react-router-dom";
import { useFetchFileCommitList } from "@/hooks/use-config-data";

interface BreadcrumbItem {
  name: string;
  href: string;
}

interface CommitData {
  sha: string;
  authorName: string;
  message: string;
  commitTime: string | Date;
}

export function useCommitsPage() {
  const [searchParams] = useSearchParams();
  const branch = searchParams.get("branch") || "main";
  const dir = searchParams.get("dir") || "";
  const fileName = searchParams.get("file") || "";

  const { data: commitListData, isLoading } = useFetchFileCommitList(
    "admin",
    "configs_repo",
    branch,
    fileName
  );

  const latestCommitArr = commitListData?.[0];
  const latestCommit = latestCommitArr?.sha?.slice(0, 6);

  const handleCommitClick = (commitHash: string) => {
    const params = new URLSearchParams();
    params.set("branch", branch);
    params.set("file", fileName);
    params.set("commit", commitHash);
    params.set("latest", latestCommit || "");

    if (dir) params.set("dir", dir);
    window.location.href = `/infra-packages/config/projects/commit?${params.toString()}`;
  };

  const handleBack = () => {
    const params = new URLSearchParams();
    params.set("branch", branch);
    params.set("file", fileName);
    if (dir) params.set("dir", dir);
    window.location.href = `/infra-packages/config/projects/view?${params.toString()}`;
  };

  const generateBreadcrumbItems = (): BreadcrumbItem[] => {
    const currentUrl = new URL(window.location.href);
    const pathname = currentUrl.pathname;
    const newPath = pathname.replace(/\/commits$/, "");
    const params = currentUrl.searchParams;
    params.delete("file");
    params.delete("dir");
    const newUrl = `${newPath}${params.toString() ? `?${params.toString()}` : ""}`;

    const items: BreadcrumbItem[] = [{ name: "config", href: newUrl }];
    const commitsUrl: BreadcrumbItem = { name: "commits", href: "" };

    if (dir) {
      items.push({
        name: dir,
        href: `/infra-packages/config/projects?branch=${branch}&dir=${dir}`,
      });
    }

    if (fileName) {
      items.push({
        name: fileName,
        href: `/infra-packages/config/projects/view?branch=${branch}&dir=${dir}&file=${fileName}`,
      });
    }

    return [...items, commitsUrl];
  };

  return {
    branch,
    commitListData: commitListData as CommitData[] | undefined,
    isLoading,
    breadcrumbItems: generateBreadcrumbItems(),
    handleCommitClick,
    handleBack,
  };
}
