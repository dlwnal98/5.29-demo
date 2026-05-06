import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  useFetchFileCommitDetail,
  useFetchFileCommitList,
  useFetchFileDiff,
} from "@/hooks/use-config-data";

interface DiffLine {
  left?: string;
  right?: string;
  type: "add" | "del" | "context" | "change";
}

function parseDiffLines(diffLines: string[]): DiffLine[] {
  const result: DiffLine[] = [];
  let i = 0;
  while (i < diffLines.length) {
    const line = diffLines[i];
    if (line.startsWith("-") && !line.startsWith("---")) {
      if (diffLines[i + 1]?.startsWith("+") && !diffLines[i + 1]?.startsWith("+++")) {
        result.push({ left: line, right: diffLines[i + 1], type: "change" });
        i += 2;
      } else {
        result.push({ left: line, type: "del" });
        i += 1;
      }
    } else if (line.startsWith("+") && !line.startsWith("+++")) {
      result.push({ right: line, type: "add" });
      i += 1;
    } else {
      result.push({ left: line, right: line, type: "context" });
      i += 1;
    }
  }
  return result;
}

interface BreadcrumbItem {
  name: string;
  href: string;
}

export function useCommitPage() {
  const [searchParams] = useSearchParams();
  const branch = searchParams.get("branch") || "main";
  const commitOldHash = searchParams.get("commit") || "";
  const commitNewHash = searchParams.get("latest") || "";
  const dir = searchParams.get("dir") || "";
  const fileName = searchParams.get("file") || "";

  const [rollbackModal, setRollbackModal] = useState<{ isOpen: boolean }>({
    isOpen: false,
  });

  const { data: commitListData } = useFetchFileCommitList(
    "admin",
    "configs_repo",
    branch,
    fileName
  );

  const selectShaArr = commitListData?.filter(
    (list) => list.sha.slice(0, 6) === commitOldHash
  ) ?? [];
  const selectSha = selectShaArr[0]?.sha;

  const latestShaArr = commitListData?.filter(
    (list) => list.sha.slice(0, 6) === commitNewHash
  ) ?? [];
  const latestSha = latestShaArr[0]?.sha;

  const { data: commitDetailData, isLoading: isCommitDetailLoading } =
    useFetchFileCommitDetail("admin", "configs_repo", selectSha);

  const { data: fileDiffData, isLoading: isFileDiffLoading } = useFetchFileDiff(
    "admin",
    "configs_repo",
    fileName,
    selectSha,
    latestSha
  );

  const parsedDiff = useMemo(
    () => (fileDiffData ? parseDiffLines(fileDiffData) : []),
    [fileDiffData]
  );

  const handleRollbackClick = () => {
    setRollbackModal({ isOpen: true });
  };

  const handleRollbackClose = () => {
    setRollbackModal({ isOpen: false });
  };

  const handleBack = () => {
    const params = new URLSearchParams();
    params.set("branch", branch);
    params.set("file", fileName);
    if (dir) params.set("dir", dir);
    window.location.href = `/infra-packages/config/projects/commits?${params.toString()}`;
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
    const commitUrl: BreadcrumbItem[] = [
      {
        name: "commits",
        href: `/infra-packages/config/projects/commits?branch=${branch}&dir=${dir}&file=${fileName}`,
      },
      { name: "commit", href: "" },
    ];

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

    return [...items, ...commitUrl];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "added":
        return "text-green-600 bg-green-50";
      case "deleted":
        return "text-red-600 bg-red-50";
      case "modified":
        return "text-blue-600 bg-blue-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return {
    branch,
    dir,
    fileName,
    selectSha,
    commitDetailData,
    isCommitDetailLoading,
    isFileDiffLoading,
    parsedDiff,
    rollbackModal,
    breadcrumbItems: generateBreadcrumbItems(),
    handleBack,
    handleRollbackClick,
    handleRollbackClose,
    getStatusColor,
  };
}
