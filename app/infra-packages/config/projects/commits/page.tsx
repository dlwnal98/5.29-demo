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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar } from "@/components/ui/avatar";
import {
  ArrowLeft,
  GitCommit,
  GitBranch,
  Copy,
  ExternalLink,
  RotateCcw,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useFetchFileCommitList } from "@/hooks/use-config-data";
import { RollbackConfirmationModal } from "@/components/rollback-confirmation-modal";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function CommitsPage() {
  const searchParams = useSearchParams();
  const branch = searchParams.get("branch") || "main";
  const path = searchParams.get("path") || "";

  // 파일 별 커밋 이력 조회
  const { data: commitListData } = useFetchFileCommitList(
    "admin",
    "configs_repo",
    "main",
    "README.md" // 파일 이름
  );

  const { toast } = useToast();

  const [rollbackModal, setRollbackModal] = useState<{
    isOpen: boolean;
    commit?: any;
  }>({ isOpen: false });

  const handleRollbackClick = (commit: any) => {
    setRollbackModal({ isOpen: true, commit });
  };

  const latestCommitArr = commitListData?.[0];
  const latestCommit = latestCommitArr?.sha?.slice(0, 6);

  const handleCommitClick = (commit: any) => {
    const params = new URLSearchParams();
    params.set("branch", branch);
    params.set("commit", commit.hash);
    if (path) params.set("path", path);
    window.location.href = `/infra-packages/config/projects/commit?sha=${commit?.sha?.slice(
      0,
      6
    )}&latest=${latestCommit}`;
  };

  const handleBack = () => {
    const params = new URLSearchParams();
    params.set("branch", branch);
    if (path) params.set("path", path);
    window.location.href = `/infra-packages/config/projects?${params.toString()}`;
  };

  const breadcrumbItems = [
    { name: "config", href: `/infra-packages/config/projects` },
    { name: "Commits", href: "" },
  ];

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

          {/* Commit History */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">
                Commit History
              </h1>
              <p className="text-sm text-gray-500">
                {commitListData?.length} commits
              </p>
            </div>

            <div className="border border-blue-200/50 rounded-xl shadow-lg bg-white/70 backdrop-blur-sm">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-blue-100">
                    <TableHead className="w-[150px] text-blue-700 font-semibold">
                      Name
                    </TableHead>
                    <TableHead className="w-[100px] text-blue-700 font-semibold">
                      Commit
                    </TableHead>
                    <TableHead className="text-blue-700 font-semibold">
                      Message
                    </TableHead>
                    <TableHead className="w-[120px] text-blue-700 font-semibold">
                      Date
                    </TableHead>
                    <TableHead className="w-[100px] text-blue-700 font-semibold">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {commitListData?.map((commit, index) => (
                    <TableRow
                      key={commit.sha}
                      className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200"
                    >
                      <TableCell className=" flex items-center">
                        <Avatar className="h-7 w-7 flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs font-bold">
                          {commit.authorName.charAt(0).toUpperCase()}
                        </Avatar>
                        <span className="font-medium text-sm ml-[8px]">
                          {commit.authorName}
                        </span>
                      </TableCell>
                      <TableCell>
                        {/* <div className="flex items-center space-x-2"> */}
                        <code className="flex items-center space-x-2 text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                          <GitCommit className="h-3 w-3 text-gray-400" />
                          {commit.sha}
                        </code>
                        {/* </div> */}
                      </TableCell>
                      <TableCell>
                        <button
                          onClick={() => handleCommitClick(commit)}
                          className="text-sm hover:text-blue-600 transition-colors text-left w-full"
                        >
                          {commit.message}
                        </button>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-500">
                          {commit.commitTime}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigator.clipboard.writeText(commit.sha);
                            }}
                            className="hover:bg-blue-100 p-1 h-auto"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCommitClick(commit);
                            }}
                            className="hover:bg-blue-100 p-1 h-auto"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                          {/* <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRollbackClick(commit);
                            }}
                            className="hover:bg-red-100 p-1 h-auto text-red-600 hover:text-red-700"
                          >
                            <RotateCcw className="h-3 w-3" />
                          </Button> */}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
      {/* Rollback Modal */}
      {/* <RollbackConfirmationModal
        isOpen={rollbackModal.isOpen}
        onClose={() => setRollbackModal({ isOpen: false })}
        commitHash={rollbackModal.commit?.sha || ""}
        commitMessage={rollbackModal.commit?.message || ""}
        // onConfirm={handleRollbackConfirm}
      /> */}
    </AppLayout>
  );
}
