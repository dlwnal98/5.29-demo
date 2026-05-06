import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useModifyFile, useFetchOriginFileDetail } from "@/hooks/use-config-data";

interface BreadcrumbItem {
  name: string;
  href: string;
}

interface FileStructureItem {
  name: string;
  type: "folder" | "file";
  level: number;
  extension?: string;
}

const fileStructure: FileStructureItem[] = [
  { name: ".github", type: "folder", level: 0 },
  { name: "workflows", type: "folder", level: 1 },
  { name: "ci.yml", type: "file", level: 2, extension: "yml" },
  { name: "src", type: "folder", level: 0 },
  { name: "components", type: "folder", level: 1 },
  { name: "ui", type: "folder", level: 2 },
  { name: "button.tsx", type: "file", level: 3, extension: "tsx" },
  { name: "input.tsx", type: "file", level: 3, extension: "tsx" },
  { name: "layout", type: "folder", level: 1 },
  { name: "header.tsx", type: "file", level: 2, extension: "tsx" },
  { name: "public", type: "folder", level: 0 },
  { name: "images", type: "folder", level: 1 },
  { name: "logo.png", type: "file", level: 2, extension: "png" },
  { name: "package.json", type: "file", level: 0, extension: "json" },
  { name: "README.md", type: "file", level: 0, extension: "md" },
  { name: "next.config.js", type: "file", level: 0, extension: "js" },
];

export function useEditProjectPage() {
  const [searchParams] = useSearchParams();
  const branch = searchParams.get("branch") || "main";
  const dir = searchParams.get("dir") || "";
  const originalFileName = searchParams.get("file") || "";

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedStructureItem, setSelectedStructureItem] = useState(originalFileName);
  const [fileName, setFileName] = useState(originalFileName);
  const [commitMessage, setCommitMessage] = useState("");
  const [fileContent, setFileContent] = useState<string | undefined>(undefined);

  const detailFilePath = dir ? `${dir}/${originalFileName}` : originalFileName;

  const {
    data: fileDetailData,
    refetch,
    isLoading: isFileDetailLoading,
  } = useFetchOriginFileDetail("admin", "configs_repo", branch, detailFilePath);

  const { mutate: modifyFileMutate } = useModifyFile(
    "admin",
    "configs_repo",
    branch,
    originalFileName,
    fileDetailData?.sha ?? "",
    commitMessage,
    fileContent ?? "",
    {
      onSuccess: () => {
        refetch();
      },
    }
  );

  const modifyFile = () => {
    modifyFileMutate();
  };

  const handleBack = () => {
    const params = new URLSearchParams();
    params.set("branch", branch);
    params.set("file", fileName);
    if (dir) params.set("dir", dir);
    window.location.href = `/infra-packages/config/projects/view?${params.toString()}`;
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const generateBreadcrumbItems = (): BreadcrumbItem[] => {
    const items: BreadcrumbItem[] = [
      {
        name: "config",
        href: `/infra-packages/config/projects?branch=${branch}`,
      },
    ];

    const lastItem: BreadcrumbItem = {
      name: `Edit ${fileName}`,
      href: "",
    };

    if (dir) {
      items.push({
        name: dir,
        href: `/infra-packages/config/projects?branch=${branch}&dir=${dir}`,
      });
    }

    return [...items, lastItem];
  };

  const displayContent = fileContent !== undefined ? fileContent : fileDetailData?.textContent;

  return {
    branch,
    sidebarOpen,
    selectedStructureItem,
    fileName,
    fileContent: displayContent,
    commitMessage,
    isFileDetailLoading,
    fileStructure,
    breadcrumbItems: generateBreadcrumbItems(),
    setSelectedStructureItem,
    setFileName,
    setFileContent,
    setCommitMessage,
    toggleSidebar,
    handleBack,
    modifyFile,
  };
}
