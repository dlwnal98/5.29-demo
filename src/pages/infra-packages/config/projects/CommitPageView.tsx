import React from "react";
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
import { ArrowLeft, GitBranch, File, RotateCcw, GitCommit } from "lucide-react";
import { formatTimeAgo } from "@/lib/etc";
import { Skeleton } from "@/components/ui/skeleton";

interface DiffLine {
  left?: string;
  right?: string;
  type: "add" | "del" | "context" | "change";
}

interface BreadcrumbItemType {
  name: string;
  href: string;
}

interface CommitDetailData {
  author?: { username: string };
  sha?: string;
  commit?: { message: string };
  created?: string | Date;
  stats?: { filesChanged: number; additions: number; deletions: number };
  files?: Array<{ filename: string; status: string }>;
}

interface CommitPageViewProps {
  branch: string;
  breadcrumbItems: BreadcrumbItemType[];
  commitDetailData: CommitDetailData | undefined;
  isCommitDetailLoading: boolean;
  isFileDiffLoading: boolean;
  parsedDiff: DiffLine[];
  onBack: () => void;
  onRollbackClick: () => void;
  getStatusColor: (status: string) => string;
}

function CommitInfoSkeleton() {
  return (
    <>
      <Skeleton className="h-10 w-10 rounded-full" />
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-6 w-16" />
      <Skeleton className="h-4 w-64" />
      <Skeleton className="h-4 w-20" />
    </>
  );
}

function CommitStatsSkeleton() {
  return (
    <>
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-4 w-16" />
      <Skeleton className="h-4 w-16" />
    </>
  );
}

function DiffSkeleton() {
  return (
    <>
      <div className="font-bold border-b px-2 py-1">이전</div>
      <div className="font-bold border-b px-2 py-1">변경</div>
      {Array.from({ length: 10 }).map((_, index) => (
        <React.Fragment key={index}>
          <div className="px-2 py-1">
            <Skeleton className="h-4 w-full" />
          </div>
          <div className="px-2 py-1">
            <Skeleton className="h-4 w-full" />
          </div>
        </React.Fragment>
      ))}
    </>
  );
}

export default function CommitPageView({
  branch,
  breadcrumbItems,
  commitDetailData,
  isCommitDetailLoading,
  isFileDiffLoading,
  parsedDiff,
  onBack,
  onRollbackClick,
  getStatusColor,
}: CommitPageViewProps) {
  return (
    <div className="bg-transparent">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={onBack}
              className="border-blue-200 hover:bg-blue-50 dark:border-gray-600 dark:hover:bg-gray-700"
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
                        <BreadcrumbLink href={item.href}>{item.name}</BreadcrumbLink>
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
            <Badge variant="outline" className="border-blue-200 text-blue-700 dark:border-gray-700 dark:text-blue-500">
              <GitBranch className="h-3 w-3 mr-1" />
              {branch}
            </Badge>
          </div>
        </div>

        {/* Commit Info */}
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 rounded-lg border border-blue-200/50 dark:border-gray-600/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {isCommitDetailLoading ? (
                <Skeleton className="h-10 w-10 rounded-full" />
              ) : (
                <Avatar className="h-10 w-10 flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-medium">
                  {commitDetailData?.author?.username.charAt(0).toUpperCase()}
                </Avatar>
              )}
              <div className="flex items-center space-x-4">
                {isCommitDetailLoading ? (
                  <CommitInfoSkeleton />
                ) : (
                  <>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {commitDetailData?.author?.username}
                    </span>
                    <code className="flex items-center bg-white dark:bg-gray-700 px-2 py-1 rounded font-mono text-sm">
                      <GitCommit className="h-3 w-3 text-gray-400" />
                      {commitDetailData?.sha?.slice(0, 6)}
                    </code>
                    <span className="text-gray-900 dark:text-gray-100">
                      {commitDetailData?.commit?.message}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {commitDetailData?.created && formatTimeAgo(commitDetailData.created as string)}
                    </span>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {isCommitDetailLoading ? (
                <CommitStatsSkeleton />
              ) : (
                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <span>{commitDetailData?.stats?.filesChanged} files changed</span>
                  <span className="text-green-600">
                    +{commitDetailData?.stats?.additions}
                  </span>
                  <span className="text-red-600">
                    -{commitDetailData?.stats?.deletions}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* File Changes */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Changed Files</h2>

          <div className="border border-blue-200/50 rounded-xl shadow-lg bg-white/70 backdrop-blur-sm dark:border-gray-600/50 dark:bg-gray-800/70">
            {/* File Header */}
            <div className="p-4 border-b border-blue-100 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:border-gray-700 dark:from-gray-700/50 dark:to-gray-600/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <File className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  {isCommitDetailLoading ? (
                    <>
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-5 w-16" />
                    </>
                  ) : (
                    <>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {commitDetailData?.files?.[0]?.filename}
                      </span>
                      <Badge
                        className={`text-xs ${getStatusColor(
                          commitDetailData?.files?.[0]?.status || ""
                        )}`}
                      >
                        <span className="ml-1">
                          {commitDetailData?.files?.[0]?.status}
                        </span>
                      </Badge>
                    </>
                  )}
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  {!isCommitDetailLoading && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRollbackClick();
                      }}
                      className="hover:bg-red-100 p-1 h-auto text-red-600 hover:text-red-700"
                    >
                      <RotateCcw className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Diff Content */}
            <div className="p-6">
              <div className="grid grid-cols-2 text-sm font-mono overflow-x-auto">
                {isFileDiffLoading ? (
                  <DiffSkeleton />
                ) : parsedDiff?.length === 0 ? (
                  <>변경 이력이 없습니다</>
                ) : (
                  <>
                    <div className="font-bold border-b px-2 py-1">이전</div>
                    <div className="font-bold border-b px-2 py-1">변경</div>
                    {parsedDiff.map((row, idx) => (
                      <React.Fragment key={idx}>
                        <div
                          className={`px-2 py-1 whitespace-pre ${row.type === "del" || row?.type === "change"
                            ? "bg-red-50 text-red-800"
                            : row.type === "context"
                              ? "bg-gray-50 text-gray-700"
                              : ""
                            }`}
                        >
                          {row.left || ""}
                        </div>
                        <div
                          className={`px-2 py-1 whitespace-pre ${row.type === "add" || row?.type === "change"
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
        </div>
      </div>
    </div>
  );
}
