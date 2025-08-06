"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  ChevronDown,
  GitBranch,
  Plus,
  Search,
  Upload,
  FileText,
  Eye,
  Edit,
  Settings,
  ArrowLeft,
} from "lucide-react";
import {
  useFetchBranchList,
  useFetchConfigFileList,
  useFetchOriginFileDetail,
} from "@/hooks/use-config-data";
import BranchManagementModal from "./BranchManagementModal";
import MarkdownViewer from "./markdown-viewer";
import { formatTimeAgo } from "@/lib/etc";
import { useSearchParams } from "next/navigation";
import { getFileIcon } from "@/lib/etc";
import { Skeleton } from "@/components/ui/skeleton";

// 브랜치 관리 모달 컴포넌트

export function FileBrowser() {
  const currentParams = useSearchParams();

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

  function sortByTypeAndName(data: any) {
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

  const handleBack = () => {
    window.location.href = `/infra-packages/config/projects?branch=${currentBranch}`;

  };

  const sortData = sortByTypeAndName(configFileListData ?? []);



  const breadcrumbItems = [
    { name: "config", href: `/infra-packages/config/projects?branch=${currentParams.get('branch')}` },
    { name: currentParams.get("dir"), href: "" },
  ];

  return (
    <div className="bg-transparent">
      <div className="mx-auto px-4 py-6">
        {/* 네비바 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            {/* 브랜치 선택 */}

            {currentParams.get("dir") && (
              <Button
                variant="outline"
                onClick={handleBack}
                className="border-blue-200 hover:bg-blue-50"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <div className="flex items-center space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-[auto] border-blue-200 hover:border-blue-300 hover:bg-blue-50"
                  >
                    <GitBranch className="h-4 w-4 mr-2 text-blue-500" />
                    {currentBranch}
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {branchListData?.map((branch, index) => (
                    <DropdownMenuItem
                      key={index}
                      onClick={() => {
                        setCurrentBranch(branch.name);
                        const params = new URLSearchParams();
                        params.set("branch", branch.name);
                        window.location.search = params.toString();
                      }}
                    >
                      {branch.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Branch Management Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsBranchModalOpen(true)}
                className="border-blue-200 hover:bg-blue-50"
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  window.open(
                    "http://1.224.162.188:51435",
                    "_blank",
                    "noopener,noreferrer"
                  )
                }
                title="GitTea로 이동"
                className="border-blue-200 hover:bg-blue-50"
              >
                <img
                  src="/gittea_logo.svg"
                  alt="GitTea Logo"
                  className="w-[25px]"
                />
              </Button>
            {currentParams.get("dir") && (

              <Breadcrumb>
                      <BreadcrumbList>
                        {breadcrumbItems.map((item, index) => (
                          <div key={item.name} className="flex items-center">
                            {index > 0 && <BreadcrumbSeparator className="mr-1 sm:mr-2"/>}
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
                    </Breadcrumb>)}
            </div>
        
          </div>

          {/* 서치, 파일추가 버튼 */}
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64 border-blue-200 focus:border-blue-400 focus:ring-blue-400"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg">
                  <Plus className="h-4 w-4 mr-2" />
                  Add file
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={handleCreateFile}>
                  <FileText className="h-4 w-4 mr-2" />
                  Create new file
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleUploadFiles}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload files
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* File Table */}
        <div className="border border-blue-200/50 rounded-xl shadow-lg bg-white/70 backdrop-blur-sm mb-6">
          {isFileListLoading ? (
            <div className="p-6">
              <Skeleton className="h-8 w-full mb-2" />
              <Skeleton className="h-8 w-full mb-2" />
              <Skeleton className="h-8 w-full mb-2" />
              <Skeleton className="h-8 w-full mb-2" />
              <Skeleton className="h-8 w-full mb-2" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-b border-blue-100">
                  <TableHead className="w-[40%] text-blue-700 font-semibold">
                    Name
                  </TableHead>
                  <TableHead className="w-[20%] text-blue-700 font-semibold text-right">
                    Last Modified
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortData?.map((file: any, index: number) => (
                  <TableRow
                    key={index}
                    className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200"
                  >
                    <TableCell>
                      <button
                        onClick={() => handleFileClick(file)}
                        className="flex items-center space-x-3 hover:text-blue-600 transition-colors w-full text-left"
                      >
                        {getFileIcon(file.type, file.name.split(".")[1])}
                        <span className="font-medium">{file.name}</span>
                      </button>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground text-right">
                      {formatTimeAgo(file.lastCommitterDate)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {/* README.md 및 md파일 미리보기 */}
        {mdFile && (
          <div className="border border-blue-200/50 rounded-xl shadow-lg bg-white/70 backdrop-blur-sm">
            <div className=" flex justify-between align-items p-4 border-b border-blue-100 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
              {isFileListLoading ? (
                <>
                  <div className="flex items-center">
                    <Skeleton className="h-5 w-5 mr-2" />
                    <Skeleton className="h-6 w-32" />
                  </div>
                  <Skeleton className="h-8 w-8" />
                </>
              ) : (
                <>
                  <h2 className="text-lg font-semibold text-blue-900 flex items-center">
                    <Eye className="h-5 w-5 mr-2" />
                    {mdFile?.name}
                  </h2>
                  <Button
                    onClick={() => handleEditReadme(mdFile.name)}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
            <div className="border border-blue-200/50 rounded-lg bg-white/70 backdrop-blur-sm">
              <div className="p-6">
                <div className=" p-4 rounded-lg">
                  {isMdLoading ? (
                    <>
                      <Skeleton className="h-6 w-1/2 mb-2" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-2/3 mb-2" />
                    </>
                  ) : (
                    originFileDetailData?.textContent && (
                      <MarkdownViewer
                        content={originFileDetailData?.textContent}
                      />
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 브랜치 생성/삭제 모달 */}
        <BranchManagementModal
          isOpen={isBranchModalOpen}
          onClose={() => setIsBranchModalOpen(false)}
          branches={branchListData ?? []}
        />
      </div>
    </div>
  );
}
