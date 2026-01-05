import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  useFetchBranchList,
  useFetchConfigFileList,
  useFetchOriginFileDetail,
} from "@/hooks/use-config-data";

function sortByTypeAndName(data: any[]) {
  if (!Array.isArray(data)) return [];
  return [...data].sort((a, b) => {
    // 1. 타입이 다르면 dir을 우선
    if (a.type !== b.type) {
      return a.type === "dir" ? -1 : 1;
    }
    // 2. 타입이 같으면 알파벳 순 정렬
    return a.name.localeCompare(b.name);
  });
}

export function useFileBrowser() {
  const [currentParams, setCurrentParams] = useSearchParams();

  const [currentBranch, setCurrentBranch] = useState(
    currentParams.get("branch") ?? "main"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);

  const { data: configFileListData, isLoading: isFileListLoading } =
    useFetchConfigFileList(
      "admin",
      "configs_repo",
      currentBranch,
      currentParams.get("dir") ?? ""
    );

  const { data: branchListData, isLoading: isBranchListLoading } =
    useFetchBranchList("admin", "configs_repo");

  const mdFile = configFileListData?.find((item) => item.name.endsWith(".md"));

  // 여기서는 무조건 md 파일만 상세조회하는 거라 mdFile로 고정
  const { data: originFileDetailData, isLoading: isMdLoading } =
    useFetchOriginFileDetail(
      "admin",
      "configs_repo",
      currentBranch,
      mdFile?.name ?? "README.md" // md 파일 미리보기를 위해서
    );

  const handleFileClick = (file: any) => {
    // 파일 뷰어 페이지로 이동
    if (file.type === "file") {
      const params = new URLSearchParams(currentParams.toString());
      params.set("file", file.name);
      window.location.href = `/infra-packages/config/projects/view?${params.toString()}`;

      // 폴더 클릭 시 해당 폴더로 이동
    } else if (file.type === "dir") {
      const params = new URLSearchParams(currentParams.toString());
      params.set("dir", file.path ?? "");
      window.location.href = `/infra-packages/config/projects?${params.toString()}`;
    }
  };

  const handleEditReadme = (filename: any) => {
    const params = new URLSearchParams(currentParams.toString());
    params.set("file", filename ?? "README.md");
    window.location.href = `/infra-packages/config/projects/edit?${params.toString()}`;
  };

  const handleUploadFiles = () => {
    const params = new URLSearchParams(currentParams.toString());
    window.location.href = `/infra-packages/config/projects/upload?${params.toString()}`;
  };

  const handleCreateFile = () => {
    const params = new URLSearchParams(currentParams.toString());
    window.location.href = `/infra-packages/config/projects/create?${params.toString()}`;
  };

  const handleBack = () => {
    window.location.href = `/infra-packages/config/projects?branch=${currentBranch}`;
  };

  const handleBranchChange = (branchName: string) => {
    setCurrentBranch(branchName);
    setCurrentParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set("branch", branchName);
      return params;
    });
  };

  const openBranchModal = () => setIsBranchModalOpen(true);
  const closeBranchModal = () => setIsBranchModalOpen(false);

  const openGitTea = () => {
    window.open("http://1.224.162.188:51435", "_blank", "noopener,noreferrer");
  };

  const sortedData = sortByTypeAndName(configFileListData ?? []);

  const currentDir = currentParams.get("dir");
  const currentBranchParam = currentParams.get("branch");

  const breadcrumbItems = [
    {
      name: "config",
      href: `/infra-packages/config/projects?branch=${currentBranchParam}`,
    },
    { name: currentDir, href: "" },
  ];

  return {
    // State
    currentBranch,
    searchQuery,
    isBranchModalOpen,
    currentDir,

    // Data
    sortedData,
    branchListData,
    mdFile,
    originFileDetailData,
    breadcrumbItems,

    // Loading states
    isFileListLoading,
    isBranchListLoading,
    isMdLoading,

    // Handlers
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
  };
}
