import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useCreateUploadFile } from "@/hooks/use-config-data";

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

interface FileExtension {
  id: number;
  name: string;
}

const fileExtensionData: FileExtension[] = [
  { id: 1, name: "yml" },
  { id: 2, name: "yaml" },
  { id: 3, name: "md" },
  { id: 4, name: "properties" },
];

export function useCreateProjectPage() {
  const [searchParams] = useSearchParams();
  const branch = searchParams.get("branch") || "main";
  const dir = searchParams.get("dir") || "";

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedStructureItem, setSelectedStructureItem] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileContent, setFileContent] = useState("");
  const [commitMessage, setCommitMessage] = useState("");
  const [isSaving] = useState(false);
  const [selectExtension, setSelectExtension] = useState("yml");

  const detailFilePath = dir
    ? `${dir}/${fileName}.${selectExtension}`
    : `${fileName}.${selectExtension}`;

  const { mutate: createUploadFileMutate } = useCreateUploadFile(
    "admin",
    "configs_repo",
    "main",
    detailFilePath,
    commitMessage
  );

  const createFile = () => {
    if (fileContent.length > 0) {
      const formData = new FormData();
      formData.append("file", "");
      formData.append("content", fileContent);
      createUploadFileMutate({ formData });
    }
  };

  const handleBack = () => {
    const params = new URLSearchParams();
    params.set("branch", branch);
    if (dir) params.set("dir", dir);
    window.location.href = `/infra-packages/config/projects?${params.toString()}`;
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
      name: "Create new file",
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

  const isCreateDisabled = !fileName.trim() || !commitMessage.trim() || isSaving;

  return {
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
    breadcrumbItems: generateBreadcrumbItems(),
    isCreateDisabled,
    setSelectedStructureItem,
    setFileName,
    setFileContent,
    setCommitMessage,
    setSelectExtension,
    toggleSidebar,
    handleBack,
    createFile,
  };
}
