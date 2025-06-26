"use client";

import React from "react";
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
import { Avatar } from "@/components/ui/avatar";
import {
  ArrowLeft,
  GitBranch,
  Copy,
  File,
  Plus,
  Minus,
  RotateCcw,
  GitCommit,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import {
  useFetchFileCommitDetail,
  useFetchFileCommitList,
  useFetchFileDiff,
} from "@/hooks/use-config-data";
import { RollbackConfirmationModal } from "@/components/rollback-confirmation-modal";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { formatTimeAgo } from "@/lib/etc";

function parseDiffLines(diffLines: string[]) {
  const result: {
    left?: string;
    right?: string;
    type: "add" | "del" | "context";
  }[] = [];
  let i = 0;
  while (i < diffLines.length) {
    const line = diffLines[i];
    if (line.startsWith("-") && !line.startsWith("---")) {
      // 삭제 라인
      if (
        diffLines[i + 1]?.startsWith("+") &&
        !diffLines[i + 1]?.startsWith("+++")
      ) {
        // 바로 다음이 추가 라인인 경우
        result.push({ left: line, right: diffLines[i + 1], type: "change" });
        i += 2;
      } else {
        result.push({ left: line, type: "del" });
        i += 1;
      }
    } else if (line.startsWith("+") && !line.startsWith("+++")) {
      // 추가 라인 (이미 위에서 처리된 경우는 제외)
      result.push({ right: line, type: "add" });
      i += 1;
    } else {
      // context 라인
      result.push({ left: line, right: line, type: "context" });
      i += 1;
    }
  }
  return result;
}

export default function CommitPage() {
  const searchParams = useSearchParams();
  const branch = searchParams.get("branch") || "main";
  const commitOldHash = searchParams.get("commit") || "";
  const commitNewHash = searchParams.get("latest") || "";
  const dir = searchParams.get("dir") || "";
  const fileName = searchParams.get("file") || "";

  console.log(searchParams.get("sha"));

  console.log(searchParams.getAll);

  const { data: commitListData } = useFetchFileCommitList(
    "admin",
    "configs_repo",
    branch,
    fileName // 파일 이름
  );


  const { toast } = useToast();

  const selectShaArr =
    commitListData?.filter(
      (list) => list.sha.slice(0, 6) === searchParams.get("commit")
    ) ?? [];
  const selectSha = selectShaArr[0]?.sha;

  const latestShaArr =
    commitListData?.filter(
      (list) => list.sha.slice(0, 6) === searchParams.get("latest")
    ) ?? [];
  const latestSha = latestShaArr[0]?.sha;

  console.log(selectSha,latestSha);

  const { data: commitDetailData } = useFetchFileCommitDetail(
    "admin",
    "configs_repo",
    selectSha // sha
  );


  const { data: fileDiffData } = useFetchFileDiff(
    "admin",
    "configs_repo",
    "README.md", // path : 파일 이름
    selectSha,
    latestSha
  );

  const [rollbackModal, setRollbackModal] = useState<{
    isOpen: boolean;
  }>({ isOpen: false });

  const handleRollbackClick = () => {
    setRollbackModal({ isOpen: true });
  };

  const handleBack = () => {
    const params = new URLSearchParams();
    params.set("branch", branch);
    params.set("file", fileName);
    if (dir) params.set("dir", dir);
    window.location.href = `/infra-packages/config/projects/commits?${params.toString()}`;
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "added":
        return <Plus className="h-3 w-3" />;
      case "deleted":
        return <Minus className="h-3 w-3" />;
      case "modified":
        return <File className="h-3 w-3" />;
      default:
        return <File className="h-3 w-3" />;
    }
  };



  const currentUrl = new URL(window.location.href);
  const pathname = currentUrl.pathname;

  // 1. 경로에서 "/view" 제거
  const newPath = pathname.replace(/\/commits$/, "");

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
      const commitUrl = [{
        name: "commits",
        href: `/infra-packages/config/projects/commits?branch=${branch}&dir=${dir}&file=${fileName}`,

      },{
        name: "commit",
        href: "",
      }];
  
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
          href: `/infra-packages/config/projects/view?branch=${branch}&dir=${dir}&file=${fileName}`,
        });
      }
  
      return [...items, ...commitUrl];
    };
  
  const breadcrumbItems = generateBreadcrumbItems();



  const parsedDiff = fileDiffData ? parseDiffLines(fileDiffData) : [];

  return (
    <AppLayout projectSlug="config">
      <div className="bg-transparent">
        <div className="container mx-auto px-4 py-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
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

          {/* Commit Info - 한 줄로 변경 */}
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-10 w-10 flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-medium">
                  {commitDetailData?.author?.username.charAt(0).toUpperCase()}
                </Avatar>
                <div className="flex items-center space-x-4">
                  <span className="font-medium text-gray-900">
                    {commitDetailData?.author?.username}
                  </span>
                  <code className="flex items-center bg-white px-2 py-1 rounded font-mono text-sm">
                    <GitCommit className="h-3 w-3 text-gray-400" />
                    {commitDetailData?.sha?.slice(0, 6)}
                  </code>
                  <span className="text-gray-900">
                    {commitDetailData?.commit?.message}
                  </span>
                  <span className="text-sm text-gray-500">
                    {formatTimeAgo(commitDetailData?.created)}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>
                    {commitDetailData?.stats?.filesChanged} files changed
                  </span>
                  <span className="text-green-600">
                    +{commitDetailData?.stats?.additions}
                  </span>
                  <span className="text-red-600">
                    -{commitDetailData?.stats?.deletions}
                  </span>
                </div>
                {/* <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRollbackClick();
                  }}
                  className="hover:bg-white/50"
                >
                  <Copy className="h-4 w-4" />
                </Button> */}
              </div>
            </div>
          </div>

          {/* File Changes */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Changed Files
            </h2>

            {/* {commitDetailData.commit.map((change, index) => ( */}
            <div
              // key={index}
              className="border border-blue-200/50 rounded-xl shadow-lg bg-white/70 backdrop-blur-sm"
            >
              {/* File Header */}
              <div className="p-4 border-b border-blue-100 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <File className="h-5 w-5 text-gray-500" />
                    <span className="font-medium text-gray-900">
                      {commitDetailData?.files[0]?.filename}
                    </span>
                    <Badge
                      className={`text-xs ${getStatusColor(
                        commitDetailData?.files[0]?.status
                      )}`}
                    >
                      {/* {getStatusIcon(commitDetailData?.files?.status)} */}
                      <span className="ml-1">
                        {commitDetailData?.files[0]?.status}
                      </span>
                    </Badge>
                    {/* <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRollbackClick();
                      }}
                      className="hover:bg-red-100 p-1 h-auto text-red-600 hover:text-red-700"
                    >
                      <RotateCcw className="h-3 w-3" />
                    </Button> */}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    {/* <span className="text-green-600">
                      +{commitDetailData?.stats?.additions}
                    </span>
                    <span className="text-red-600">
                      -{commitDetailData?.stats?.deletions}
                    </span> */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRollbackClick();
                      }}
                      className="hover:bg-red-100 p-1 h-auto text-red-600 hover:text-red-700"
                    >
                      <RotateCcw className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Diff Content */}
              <div className="p-6">
                <div className="grid grid-cols-2 text-sm font-mono overflow-x-auto">
                  {parsedDiff?.length === 0 ? (
                    <>변경 이력이 없습니다</>
                  ) : (
                    <>
                      <div className="font-bold border-b px-2 py-1">이전</div>
                      <div className="font-bold border-b px-2 py-1">변경</div>
                      {parsedDiff.map((row, idx) => (
                        <React.Fragment key={idx}>
                          <div
                            className={`px-2 py-1 whitespace-pre ${
                              row.type === "del" || row?.type === "change"
                                ? "bg-red-50 text-red-800"
                                : row.type === "context"
                                ? "bg-gray-50 text-gray-700"
                                : ""
                            }`}
                          >
                            {row.left || ""}
                          </div>
                          <div
                            className={`px-2 py-1 whitespace-pre ${
                              row.type === "add" || row?.type === "change"
                                ? "bg-green-50 text-green-800"
                                : row.type === "context"
                                ? "bg-gray-50 text-gray-700"
                                : ""
                            }`}
                          >
                            {row.right || ""}
                          </div>
                        </React.Fragment>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </div>
            {/* ))}
            </div>

            {/* Summary */}
            {/* <div className="mt-8 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200/50">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>
                  Showing {commitDetailData?.stats?.total} changed files with{" "}
                  <span className="text-green-600 font-medium">
                    {commitDetailData?.stats?.additions} additions
                  </span>{" "}
                  and{" "}
                  <span className="text-red-600 font-medium">
                    {commitDetailData?.stats?.deletions} deletions
                  </span>
                </span>
                <span>{commitDetailData?.created}</span>
              </div>
            </div> */}
          </div>
        </div>
      </div>
      {/* Rollback Modal */}
      <RollbackConfirmationModal
        isOpen={rollbackModal.isOpen}
        onClose={() => setRollbackModal({ isOpen: false })}
        branch={branch}
        fileName={fileName}
        commitHash={selectSha || ""}
        commitMessage={commitDetailData?.commit?.message || ""}
        // onConfirm={handleRollbackConfirm}
      />
    </AppLayout>
  );
}
