import type React from "react";
import { useState, useRef } from "react";
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

export function useUploadProjectPage() {
  const [searchParams] = useSearchParams();
  const branch = searchParams.get("branch") || "main";
  const dir = searchParams.get("dir") || "";

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedStructureItem, setSelectedStructureItem] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [commitMessage, setCommitMessage] = useState("");
  const [isUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const detailFilePath = dir
    ? `${dir}/${uploadedFiles[0]?.name}`
    : uploadedFiles[0]?.name;

  const { mutate: createUploadFileMutate } = useCreateUploadFile(
    "admin",
    "configs_repo",
    branch,
    detailFilePath,
    commitMessage
  );

  const uploadFile = () => {
    if (uploadedFiles.length > 0) {
      const formData = new FormData();
      formData.append("file", uploadedFiles[0]);
      formData.append("content", "");
      createUploadFileMutate({ formData });
    }
  };

  const handleBack = () => {
    const params = new URLSearchParams();
    params.set("branch", branch);
    if (dir) params.set("path", dir);
    window.location.href = `/infra-packages/config/projects?${params.toString()}`;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
    const files = Array.from(event.dataTransfer.files);
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const triggerFileInput = () => fileInputRef.current?.click();

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const generateBreadcrumbItems = (): BreadcrumbItem[] => {
    const items: BreadcrumbItem[] = [
      {
        name: "config",
        href: `/infra-packages/config/projects?branch=${branch}`,
      },
    ];

    const lastItem: BreadcrumbItem = {
      name: "Upload files",
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

  const isUploadDisabled =
    uploadedFiles.length === 0 || !commitMessage.trim() || isUploading;

  return {
    branch,
    sidebarOpen,
    selectedStructureItem,
    uploadedFiles,
    commitMessage,
    isUploading,
    isDragOver,
    fileInputRef,
    fileStructure,
    breadcrumbItems: generateBreadcrumbItems(),
    isUploadDisabled,
    setSelectedStructureItem,
    setCommitMessage,
    toggleSidebar,
    handleBack,
    handleFileSelect,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    removeFile,
    triggerFileInput,
    formatFileSize,
    uploadFile,
  };
}
