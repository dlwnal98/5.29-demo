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
  GitBranch,
  Folder,
  File,
  Menu,
  History,
  Eye,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { DeleteConfirmationModal } from "@/components/delete-confirmation-modal";
import {
  useFetchOriginFileDetail,
  useFetchConfigFileInfo,
} from "@/hooks/use-config-data";
import { getFileIcon } from "@/lib/etc";
import MarkdownViewer from "@/app/infra-packages/config/projects/components/markdown-viewer";
import { goToBaseProjectUrl } from "@/lib/etc";
import { Skeleton } from "@/components/ui/skeleton";

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
  const currentParams = useSearchParams();
  const branch = currentParams.get("branch") || "main";
  const dir = currentParams.get("dir") || "";
  const fileName = currentParams.get("file") || "";

  const [selectedStructureItem, setSelectedStructureItem] = useState(fileName);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [commitComment, setCommitComment] = useState("테스트 커밋입니다.");

  const detailFilePath = dir ? `${dir}/${fileName}` : fileName;

  const { data: fileDetailData, isLoading: isFileDetailLoading } = useFetchOriginFileDetail(
    "admin",
    "configs_repo",
    branch,
    detailFilePath
  );

  // const { data: fileInfoData } = useFetchConfigFileInfo(
  //   "admin",
  //   "configs_repo",
  //   branch,
  //   detailFilePath
  // );

  // 파일 삭제할 때
  const fileData = {
    owner: "admin",
    repo: "configs_repo",
    branch: branch,
    path: detailFilePath,
    sha: fileDetailData?.sha ?? "",
    message: commitComment,
  };

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

  const fileExtension = fileDetailData?.path.split(".").pop();

  const renderFileContent = () => {
    if (!fileDetailData) return null;

    switch (fileExtension) {
      case "md":
        return <MarkdownViewer content={fileDetailData.textContent} />;
      case "json":
        return (
          <pre className="language-json p-4 rounded-lg overflow-auto text-sm font-mono">
            {fileDetailData.textContent}
          </pre>
        );
      case "js":
      case "ts":
      case "tsx":
      case "jsx":
      case "yaml":
      case "yml":
      case "properties":
        return (
          <pre className="language-javascript p-4 rounded-lg overflow-auto text-sm font-mono">
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

  const currentUrl = new URL(window.location.href);
  const pathname = currentUrl.pathname;

  // 1. 경로에서 "/view" 제거
  const newPath = pathname.replace(/\/view$/, "");

  // 2. 쿼리스트링에서 "file" 제거
  const params = currentUrl.searchParams;
  params.delete("file");
  params.delete("dir");

  // 3. 최종 URL 생성
  const newUrl = `${newPath}${
    params.toString() ? `?${params.toString()}` : ""
  }`;

  // 동적으로 breadcrumb 생성
  const generateBreadcrumbItems = () => {
    const items = [
      {
        name: "config",
        href: newUrl,
      }
    ];

    // 디렉토리가 있는 경우
    if (dir) {
      items.push({
        name: dir,
        href: `/infra-packages/config/projects?branch=${branch}&dir=${dir}`,
      });
    }

    // 파일명이 있는 경우
    if (fileName) {
      items.push({
        name: fileName,
        href: "",
      });
    }

    return items;
  };

  const breadcrumbItems = generateBreadcrumbItems();

  return (
    <AppLayout projectSlug="config">
      <div className="bg-transparent h-[calc(100vh-4rem)]">
      <div className="flex h-full">
          {/* Left Sidebar - File Structure */}
          {sidebarOpen && (
            <div className="w-60 border-r border-blue-200/50 bg-white/70 backdrop-blur-sm">
              <div className="p-4 border-b border-blue-100 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
                <h3 className="font-semibold text-blue-900 flex items-center">
                  <Folder className="h-4 w-4 mr-2" />
                  File Structure
                </h3>
              </div>
              <div className="flex-1 overflow-y-auto">
              <div className="p-4 space-y-1">
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
                        getFileIcon(item?.extension || "")
                      )}
                      <span className="text-sm">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto">
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

                {/* File Content */}
                <div className="border border-blue-200/50 rounded-xl shadow-lg bg-white/70 backdrop-blur-sm">
                 
                  <div className="flex items-center justify-between p-4 border-b border-blue-100 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
                    {isFileDetailLoading ? (
                      <>
                        <div className="flex items-center">
                          <Skeleton className="h-5 w-5 mr-2" />
                          <Skeleton className="h-6 w-32" />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Skeleton className="h-8 w-8" />
                          <Skeleton className="h-8 w-8" />
                          <Skeleton className="h-8 w-8" />
                        </div>
                      </>
                    ) : (
                      <>
                        <h2 className="text-lg font-semibold text-blue-900 flex items-center">
                          <Eye className="h-5 w-5 mr-2" />
                          {fileName}
                        </h2>
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
                            onClick={handleEdit}
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            title="edit"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setShowDeleteModal(true)}
                            title="delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="p-6">
                    {isFileDetailLoading ? (
                      // 파일 내용 스켈레톤 UI
                      <div className="space-y-3">
                        {/* 여러 줄의 코드 스켈레톤 */}
                        {Array.from({ length: 15 }).map((_, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Skeleton className="h-4 w-8" /> {/* 라인 번호 */}
                            <Skeleton className="h-4 flex-1" /> {/* 코드 내용 */}
                          </div>
                        ))}
                      </div>
                    ) : (
                      renderFileContent()
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        fileName={fileName}
        fileData={fileData}
      />
    </AppLayout>
  );
}
