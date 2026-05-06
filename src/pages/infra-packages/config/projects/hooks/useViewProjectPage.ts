import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useFetchOriginFileDetail } from "@/hooks/use-config-data";

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

export function useViewProjectPage() {
  const [currentParams] = useSearchParams();
  const branch = currentParams.get("branch") || "main";
  const dir = currentParams.get("dir") || "";
  const fileName = currentParams.get("file") || "";

  const [selectedStructureItem, setSelectedStructureItem] = useState(fileName);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [commitComment] = useState("테스트 커밋입니다.");

  const detailFilePath = dir ? `${dir}/${fileName}` : fileName;

  const { data: fileDetailData, isLoading: isFileDetailLoading } =
    useFetchOriginFileDetail("admin", "configs_repo", branch, detailFilePath);

  const fileData = {
    owner: "admin",
    repo: "configs_repo",
    branch: branch,
    path: detailFilePath,
    sha: fileDetailData?.sha ?? "",
    message: commitComment,
  };

  const fileExtension = fileDetailData?.path?.split(".").pop();

  const handleBack = () => {
    const params = new URLSearchParams(currentParams.toString());
    params.set("branch", branch);
    params.delete("file");

    if (dir) params.set("dir", dir);
    window.location.href = `/infra-packages/config/projects?${params.toString()}`;
  };

  const handleEdit = () => {
    const params = new URLSearchParams(currentParams.toString());
    params.set("branch", branch);
    if (dir) params.set("dir", dir);
    params.set("file", fileName);
    window.location.href = `/infra-packages/config/projects/edit?${params.toString()}`;
  };

  const handleCommitHistory = () => {
    const params = new URLSearchParams(currentParams.toString());
    params.set("branch", branch);
    if (dir) params.set("dir", dir);
    window.location.href = `/infra-packages/config/projects/commits?${params.toString()}`;
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const openDeleteModal = () => setShowDeleteModal(true);
  const closeDeleteModal = () => setShowDeleteModal(false);

  const generateBreadcrumbItems = (): BreadcrumbItem[] => {
    const currentUrl = new URL(window.location.href);
    const pathname = currentUrl.pathname;
    const newPath = pathname.replace(/\/view$/, "");
    const params = currentUrl.searchParams;
    params.delete("file");
    params.delete("dir");
    const newUrl = `${newPath}${params.toString() ? `?${params.toString()}` : ""}`;

    const items: BreadcrumbItem[] = [{ name: "config", href: newUrl }];

    if (dir) {
      items.push({
        name: dir,
        href: `/infra-packages/config/projects?branch=${branch}&dir=${dir}`,
      });
    }

    if (fileName) {
      items.push({ name: fileName, href: "" });
    }

    return items;
  };

  return {
    branch,
    fileName,
    fileDetailData,
    isFileDetailLoading,
    fileExtension,
    sidebarOpen,
    selectedStructureItem,
    showDeleteModal,
    fileData,
    fileStructure,
    breadcrumbItems: generateBreadcrumbItems(),
    setSelectedStructureItem,
    toggleSidebar,
    handleBack,
    handleEdit,
    handleCommitHistory,
    openDeleteModal,
    closeDeleteModal,
  };
}
