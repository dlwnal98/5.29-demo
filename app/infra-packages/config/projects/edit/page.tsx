"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
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
  Save,
  Eye,
  GitBranch,
  Folder,
  File,
  FileText,
  Code,
  ImageIcon,
  Archive,
  Menu,
  User,
  Calendar,
  GitCommit,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  useModifyFile,
  useFetchOriginFileDetail,
} from "@/hooks/use-config-data";
import { getFileIcon } from "@/lib/etc";
import { Skeleton } from "@/components/ui/skeleton";

// 샘플 파일 구조 (동일)
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

export default function EditFilePage() {
  const searchParams = useSearchParams();
  const branch = searchParams.get("branch") || "main";
  const dir = searchParams.get("dir") || "";
  const originalFileName = searchParams.get("file") || "";

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedStructureItem, setSelectedStructureItem] =
    useState(originalFileName);
  const [fileName, setFileName] = useState(originalFileName);
  const [commitMessage, setCommitMessage] = useState("");

  const detailFilePath = dir ? `${dir}/${originalFileName}` : originalFileName;

  const {
    data: fileDetailData,
    refetch,
    isLoading: isFileDetailLoading,
  } = useFetchOriginFileDetail("admin", "configs_repo", branch, detailFilePath);
  const [fileContent, setFileContent] = useState(fileDetailData?.textContent);

  const { mutate: modifyFileMutate } = useModifyFile(
    "admin",
    "configs_repo",
    branch,
    originalFileName, // 수정할 때는 파일 이름 변경 안됨
    fileDetailData?.sha ?? "", // 커밋하면 목록조회에서 sha 정보 바뀌는데 그거 불러와서 넣어야함
    commitMessage,
    fileContent ?? "",
    {
      onSuccess: () => {
        // 🔁 수정 성공 시 최신 sha 다시 요청
        refetch();
      },
    }
  );

  console.log(fileDetailData?.sha);

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
  console.log(fileContent);
  const currentUrl = new URL(window.location.href);
  const pathname = currentUrl.pathname;

  // 1. 경로에서 "/view" 제거
  const newPath = pathname.replace(/\/edit$/, "");

  // 2. 쿼리스트링에서 "file" 제거
  const params = currentUrl.searchParams;
  params.delete("file");

  // 3. 최종 URL 생성
  const newUrl = `${newPath}${
    params.toString() ? `?${params.toString()}` : ""
  }`;

  const generateBreadcrumbItems = () => {
    const items = [
      {
        name: "config",
        href: `/infra-packages/config/projects?branch=${branch}`,
      },
    ];

    const lastItem = {
      name: `Edit ${fileName}`,
      href: "",
    };

    // 디렉토리가 있는 경우
    if (dir) {
      items.push({
        name: dir,
        href: `/infra-packages/config/projects?branch=${branch}&dir=${dir}`,
      });
    }

    return [...items, lastItem];
  };

  const breadcrumbItems = generateBreadcrumbItems();

  return (
    <AppLayout projectSlug="config">
      <div className="bg-transparent h-[calc(100vh-4rem)]">
        <div className="flex h-full">
          {/* Left Sidebar - File Structure */}
          {sidebarOpen && (
            <div className="w-60 border-r border-blue-200/50 bg-white/70 backdrop-blur-sm flex flex-col">
              <div className="p-4 border-b border-blue-100 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 flex-shrink-0">
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

                <div className="border border-blue-200/50 rounded-xl shadow-lg bg-white/70 backdrop-blur-sm mb-6">
                  <div className="flex items-center justify-between p-4 border-b border-blue-100 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
                    {isFileDetailLoading ? (
                      <div className="flex align-items flex-1">
                        <Skeleton className="h-4 w-20 mb-2" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                    ) : (
                      <div className="flex align-items flex-1">
                        <Label
                          htmlFor="fileName"
                          className="text-sm font-medium text-blue-900 mb-2 block"
                        >
                          {/* File Name */}
                        </Label>
                        <Input
                          id="fileName"
                          value={fileName}
                          disabled
                          onChange={(e) => setFileName(e.target.value)}
                          className="font-mono"
                          placeholder="Enter file name..."
                        />
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    {isFileDetailLoading ? (
                      // 파일 내용 스켈레톤 UI
                      <div className="space-y-3">
                        {/* 여러 줄의 코드 스켈레톤 */}
                        {Array.from({ length: 20 }).map((_, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2"
                          >
                            <Skeleton className="h-4 w-8" /> {/* 라인 번호 */}
                            <Skeleton className="h-4 flex-1" />{" "}
                            {/* 코드 내용 */}
                          </div>
                        ))}
                      </div>
                    ) : (
                      (fileContent || fileDetailData?.textContent) && (
                        <Textarea
                          value={
                            fileContent
                              ? fileContent
                              : fileDetailData?.textContent
                          }
                          onChange={(e) => setFileContent(e.target.value)}
                          className="min-h-[400px] font-mono text-sm resize-none border-0 p-4"
                          placeholder="Enter file content..."
                        />
                      )
                    )}
                  </div>
                </div>

                {/* Commit Section */}
                <div className="border border-blue-200/50 rounded-xl shadow-lg bg-white/70 backdrop-blur-sm">
                  <div className="p-4 border-b border-blue-100 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
                    <h2 className="font-medium text-blue-900 flex items-center">
                      <GitCommit className="h-4 w-4 mr-2" />
                      Commit Changes
                    </h2>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <Label
                        htmlFor="commitMessage"
                        className="text-sm font-medium mb-2 block"
                      >
                        Commit Message *
                      </Label>
                      <Input
                        id="commitMessage"
                        value={commitMessage}
                        onChange={(e) => setCommitMessage(e.target.value)}
                        placeholder="Update file content"
                        className="font-mono"
                      />
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button variant="outline" onClick={handleBack}>
                        Cancel
                      </Button>
                      <Button
                        variant={"default"}
                        size="sm"
                        onClick={modifyFile}
                        className={"bg-blue-600 hover:bg-blue-700"}
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
