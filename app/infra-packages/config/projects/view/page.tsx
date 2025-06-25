"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Download,
  Copy,
  GitCommit,
  User,
  Calendar,
  GitBranch,
  Folder,
  File,
  FileText,
  Code,
  ImageIcon,
  Archive,
  Menu,
  History,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { DeleteConfirmationModal } from "@/components/delete-confirmation-modal";
import {
  useDeleteFile,
  useFetchOriginFileDetail,
  useFetchConfigFileInfo,
} from "@/hooks/use-config-data";

// 파일 아이콘 함수
function getFileIcon(extension?: string) {
  switch (extension) {
    case "md":
      return <FileText className="h-4 w-4 text-indigo-500" />;
    case "json":
    case "js":
    case "ts":
    case "tsx":
    case "jsx":
      return <Code className="h-4 w-4 text-amber-500" />;
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
    case "svg":
      return <ImageIcon className="h-4 w-4 text-green-500" />;
    case "zip":
    case "tar":
    case "gz":
      return <Archive className="h-4 w-4 text-purple-500" />;
    default:
      return <File className="h-4 w-4 text-gray-500" />;
  }
}

// 샘플 파일 구조
const fileStructure = [
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

export default function FileViewPage() {
  const searchParams = useSearchParams();
  const branch = searchParams.get("branch") || "main";
  const path = searchParams.get("path") || "";
  const fileName = searchParams.get("file") || "";

  const [selectedStructureItem, setSelectedStructureItem] = useState(fileName);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // const fileDetailData = fileData[fileName as keyof typeof fileData];

  const { data: fileDetailData } = useFetchOriginFileDetail(
    "admin",
    "configs_repo",
    branch,
    fileName
  );

  const { data: fileInfoData } = useFetchConfigFileInfo(
    "admin",
    "configs_repo",
    branch,
    fileName
  );

  console.log(fileDetailData, fileInfoData);

  const { mutate: deleteFileMutate } = useDeleteFile(
    "admin",
    "configs_repo",
    branch,
    fileName,
    "b0344c4afa3c6184f9a87ff30c05b3ef53f8c123", // 최신 버전 sha
    "commit" // 커밋메세지1
  );

  const deleteFile = () => {
    deleteFileMutate();
  };

  const fileExtension = fileDetailData?.path.split(".").pop();

  const handleBack = () => {
    const params = new URLSearchParams();
    params.set("branch", branch);
    if (path) params.set("path", path);
    window.location.href = `/infra-packages/config/projects?${params.toString()}`;
  };

  const handleEdit = () => {
    const params = new URLSearchParams();
    params.set("branch", branch);
    if (path) params.set("path", path);
    params.set("file", fileName);
    window.location.href = `/infra-packages/config/projects/edit?${params.toString()}`;
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    // 실제 삭제 로직 구현
    alert("File deleted successfully!");
    handleBack();
  };

  const handleCommitClick = () => {
    if (fileInfoData?.last_commit_sha) {
      const params = new URLSearchParams();
      params.set("branch", branch);
      params.set("commit", fileInfoData.last_commit_sha);
      if (path) params.set("path", path);
      window.location.href = `/infra-packages/config/projects/commit?${params.toString()}`;
    }
  };

  const handleCommitHistory = () => {
    const params = new URLSearchParams();
    params.set("branch", branch);
    if (path) params.set("path", path);
    window.location.href = `/infra-packages/config/projects/commits?${params.toString()}`;
  };

  console.log(fileExtension);

  const renderFileContent = () => {
    if (!fileDetailData) return null;

    switch (fileExtension) {
      case "md":
        return (
          <div className="prose prose-sm max-w-none">
            <pre className="whitespace-pre-wrap font-mono text-sm bg-gray-50 p-4 rounded-lg overflow-auto">
              {fileDetailData.textContent}
            </pre>
          </div>
        );
      case "json":
        return (
          <pre className="language-json bg-gray-50 p-4 rounded-lg overflow-auto text-sm font-mono">
            {fileDetailData.textContent}
          </pre>
        );
      case "js":
      case "ts":
      case "tsx":
      case "jsx":
        return (
          <pre className="language-javascript bg-gray-50 p-4 rounded-lg overflow-auto text-sm font-mono">
            {fileDetailData.textContent}
          </pre>
        );
      default:
        return (
          <div className="flex items-center justify-center h-32 text-muted-foreground">
            <div className="text-center">
              <File className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Preview not available for this file type</p>
            </div>
          </div>
        );
    }
  };

  const breadcrumbItems = [
    { name: "config", href: `/infra-packages/config/projects` },
    { name: fileName, href: "" },
  ];

  return (
    <AppLayout projectSlug="config">
      <div className="bg-transparent">
        <div className="flex h-[calc(100vh-4rem)]">
          {/* Left Sidebar - File Structure */}
          {sidebarOpen && (
            <div className="w-80 border-r border-blue-200/50 bg-white/70 backdrop-blur-sm">
              <div className="p-4 border-b border-blue-100 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
                <h3 className="font-semibold text-blue-900 flex items-center">
                  <Folder className="h-4 w-4 mr-2" />
                  File Structure
                </h3>
              </div>
              <div className="p-4 overflow-y-auto h-full">
                <div className="space-y-1">
                  {fileStructure.map((item, index) => (
                    <div
                      key={index}
                      className={`flex items-center space-x-2 p-2 rounded cursor-pointer hover:bg-blue-50 ${
                        selectedStructureItem === item.name ? "bg-blue-100" : ""
                      }`}
                      style={{ paddingLeft: `${item.level * 16 + 8}px` }}
                      onClick={() => setSelectedStructureItem(item.name)}
                    >
                      {item.type === "folder" ? (
                        <Folder className="h-4 w-4 text-blue-500" />
                      ) : (
                        getFileIcon(item.extension)
                      )}
                      <span className="text-sm">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto">
              <div className="container mx-auto px-4 py-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSidebarOpen(!sidebarOpen)}
                      className="border-blue-200 hover:bg-blue-50"
                    >
                      <Menu className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleBack}
                      className="border-blue-200 hover:bg-blue-50"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back
                    </Button>

                    <Breadcrumb>
                      <BreadcrumbList>
                        {breadcrumbItems.map((item, index) => (
                          <div key={item.name} className="flex items-center">
                            {index > 0 && <BreadcrumbSeparator />}
                            <BreadcrumbItem>
                              {index === breadcrumbItems.length - 1 ? (
                                <BreadcrumbPage className="text-blue-600">
                                  {item.name}
                                </BreadcrumbPage>
                              ) : item.href ? (
                                <BreadcrumbLink href={item.href}>
                                  {item.name}
                                </BreadcrumbLink>
                              ) : (
                                <span>{item.name}</span>
                              )}
                            </BreadcrumbItem>
                          </div>
                        ))}
                      </BreadcrumbList>
                    </Breadcrumb>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Badge
                      variant="outline"
                      className="border-blue-200 text-blue-700"
                    >
                      <GitBranch className="h-3 w-3 mr-1" />
                      {branch}
                    </Badge>
                  </div>
                </div>

                {/* Latest Commit Info */}
                {fileInfoData?.last_commit_sha && (
                  <div
                    className="mb-6 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200/50 cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200"
                    onClick={handleCommitClick}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex items-center justify-between flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">
                            {fileInfoData.name}
                          </span>
                          <Badge
                            variant="secondary"
                            className="text-[13px] font-lightbold border border-gray-200/50"
                          >
                            <GitCommit className="h-3 w-3 mr-1" />

                            {fileInfoData.last_commit_sha}
                          </Badge>
                          <span className="text-gray-600">
                            {fileInfoData.name}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                          <span className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {fileInfoData.lastCommitterDate}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* File Content */}
                <div className="border border-blue-200/50 rounded-xl shadow-lg bg-white/70 backdrop-blur-sm">
                  <div className="flex items-center justify-between p-4 border-b border-blue-100 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
                    <h2 className="font-medium text-blue-900">File Contents</h2>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCommitHistory}
                        className="border-blue-200 hover:bg-blue-50"
                      >
                        <History className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          navigator.clipboard.writeText(
                            fileDetailData?.textContent || ""
                          )
                        }
                        title="copy"
                        className="border-blue-200 hover:bg-blue-50"
                      >
                        <Copy className="h-4 w-4" />
                        {/* Copy */}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-blue-200 hover:bg-blue-50"
                        title="download"
                      >
                        <Download className="h-4 w-4" />
                        {/* Download */}
                      </Button>
                      <Button
                        onClick={handleEdit}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        title="edit"
                      >
                        <Edit className="h-4 w-4" />
                        {/* Edit */}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={deleteFile}
                        title="delete"
                      >
                        <Trash2 className="h-4 w-4" />
                        {/* Delete */}
                      </Button>
                    </div>
                  </div>
                  <div className="p-6">{renderFileContent()}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        fileName={fileName}
      />
    </AppLayout>
  );
}
