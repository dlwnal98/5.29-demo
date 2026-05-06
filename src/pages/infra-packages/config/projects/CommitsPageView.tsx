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
import { ArrowLeft, GitCommit, GitBranch } from "lucide-react";
import { formatTimeAgo } from "@/libs/etc";
import { Skeleton } from "@/components/ui/skeleton";

interface BreadcrumbItemType {
  name: string;
  href: string;
}

interface CommitData {
  sha: string;
  authorName: string;
  message: string;
  commitTime: string | Date;
}

interface CommitsPageViewProps {
  branch: string;
  breadcrumbItems: BreadcrumbItemType[];
  commitListData: CommitData[] | undefined;
  isLoading: boolean;
  onBack: () => void;
  onCommitClick: (commitHash: string) => void;
}

function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <TableRow
          key={index}
          className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:bg-gradient-to-r dark:from-gray-700 dark:to-gray-600 transition-all duration-200"
        >
          <TableCell>
            <div className="flex items-center">
              <Skeleton className="h-7 w-7 rounded-full" />
              <Skeleton className="h-4 w-20 ml-2" />
            </div>
          </TableCell>
          <TableCell>
            <Skeleton className="h-6 w-16" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-full max-w-md" />
          </TableCell>
          <TableCell className="text-right">
            <Skeleton className="h-4 w-20 ml-auto" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

export default function CommitsPageView({
  branch,
  breadcrumbItems,
  commitListData,
  isLoading,
  onBack,
  onCommitClick,
}: CommitsPageViewProps) {
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

        {/* Commit History */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Commit History</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isLoading ? (
                <Skeleton className="h-4 w-16" />
              ) : (
                `${commitListData?.length || 0} commits`
              )}
            </p>
          </div>

          <div className="border border-blue-200/50 rounded-xl shadow-lg bg-white/70 backdrop-blur-sm dark:border-gray-600/50 dark:bg-gray-800/70">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-blue-100 dark:border-gray-700">
                  <TableHead className="w-[150px] text-blue-700 dark:text-blue-400 font-semibold">
                    Name
                  </TableHead>
                  <TableHead className="w-[100px] text-blue-700 dark:text-blue-400 font-semibold">
                    Commit
                  </TableHead>
                  <TableHead className="text-blue-700 dark:text-blue-400 font-semibold">Message</TableHead>
                  <TableHead className="w-[120px] text-blue-700 dark:text-blue-400 font-semibold text-right">
                    Date
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableSkeleton />
                ) : commitListData && commitListData.length > 0 ? (
                  <>
                    {commitListData.map((commit) => (
                      <TableRow
                        key={commit.sha}
                        className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-200"
                      >
                        <TableCell className="flex items-center">
                          <Avatar className="h-7 w-7 flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs font-bold">
                            {commit.authorName.charAt(0).toUpperCase()}
                          </Avatar>
                          <span className="font-medium text-sm ml-[8px]">
                            {commit.authorName}
                          </span>
                        </TableCell>
                        <TableCell>
                          <code className="flex items-center space-x-2 text-xs font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                            <GitCommit className="h-3 w-3 text-gray-400" />
                            {commit.sha.slice(0, 6)}
                          </code>
                        </TableCell>
                        <TableCell>
                          <button
                            onClick={() => onCommitClick(commit.sha.slice(0, 6))}
                            className="text-sm hover:text-blue-600 transition-colors text-left w-full"
                          >
                            {commit.message}
                          </button>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="text-sm text-gray-500 dark:text-gray-400 text-right">
                            {formatTimeAgo(commit.commitTime as string)}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </>
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-gray-500 dark:text-gray-400">
                      커밋 이력이 없습니다.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
