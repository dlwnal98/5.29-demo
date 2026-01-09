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
import MarkdownViewer from "./markdown-viewer";
import { formatTimeAgo } from "@/libs/etc";
import { getFileIcon } from "@/libs/etc";
import { Skeleton } from "@/components/ui/skeleton";
import { BranchListProps } from "@/types/config";

interface BreadcrumbItemType {
  name: string | null;
  href: string;
}

interface FileBrowserViewProps {
  currentBranch: string;
  searchQuery: string;
  currentDir: string | null;
  sortedData: any[];
  branchListData: BranchListProps[] | undefined;
  mdFile: any | undefined;
  originFileDetailData: any | undefined;
  breadcrumbItems: BreadcrumbItemType[];
  isFileListLoading: boolean;
  isMdLoading: boolean;
  onSearchQueryChange: (value: string) => void;
  onFileClick: (file: any) => void;
  onEditReadme: (filename: any) => void;
  onUploadFiles: () => void;
  onCreateFile: () => void;
  onBack: () => void;
  onBranchChange: (branchName: string) => void;
  onOpenBranchModal: () => void;
  onOpenGitTea: () => void;
}

export default function FileBrowserView({
  currentBranch,
  searchQuery,
  currentDir,
  sortedData,
  branchListData,
  mdFile,
  originFileDetailData,
  breadcrumbItems,
  isFileListLoading,
  isMdLoading,
  onSearchQueryChange,
  onFileClick,
  onEditReadme,
  onUploadFiles,
  onCreateFile,
  onBack,
  onBranchChange,
  onOpenBranchModal,
  onOpenGitTea,
}: FileBrowserViewProps) {
  return (
    <div className="bg-transparent">
      <div className="mx-auto px-4 py-6">
        {/* 네비바 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            {/* 브랜치 선택 */}
            {currentDir && (
              <Button
                variant="outline"
                onClick={onBack}
                className="border-blue-200 hover:bg-blue-50 dark:border-gray-600 dark:hover:bg-gray-700"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <div className="flex items-center space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-[auto] border-blue-200 hover:border-blue-300 hover:bg-blue-50 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-700"
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
                      className="cursor-pointer"
                      onClick={() => onBranchChange(branch.name)}
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
                onClick={onOpenBranchModal}
                className="border-blue-200 hover:bg-blue-50 dark:border-gray-600 dark:hover:bg-gray-700"
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onOpenGitTea}
                title="GitTea로 이동"
                className="border-blue-200 hover:bg-blue-50 dark:border-gray-600 dark:hover:bg-gray-700"
              >
                <img src="/gittea_logo.svg" alt="GitTea Logo" className="w-[25px]" />
              </Button>
              {currentDir && (
                <Breadcrumb>
                  <BreadcrumbList>
                    {breadcrumbItems.map((item, index) => (
                      <div key={item.name} className="flex items-center">
                        {index > 0 && <BreadcrumbSeparator className="mr-1 sm:mr-2" />}
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
              )}
            </div>
          </div>

          {/* 서치, 파일추가 버튼 */}
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => onSearchQueryChange(e.target.value)}
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
                <DropdownMenuItem onClick={onCreateFile}>
                  <FileText className="h-4 w-4 mr-2" />
                  Create new file
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onUploadFiles}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload files
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* File Table */}
        <div className="border border-blue-200/50 rounded-xl shadow-lg bg-white/70 backdrop-blur-sm dark:border-gray-600/50 dark:bg-gray-800/70 mb-6">
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
                <TableRow className="border-b border-blue-100 dark:border-gray-700">
                  <TableHead className="w-[40%] text-blue-700 dark:text-blue-400 font-semibold">
                    Name
                  </TableHead>
                  <TableHead className="w-[20%] text-blue-700 dark:text-blue-400 font-semibold text-right">
                    Last Modified
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedData?.map((file: any, index: number) => (
                  <TableRow
                    key={index}
                    className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-200 "
                  >
                    <TableCell>
                      <button
                        onClick={() => onFileClick(file)}
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
          <div className="border border-blue-200/50 rounded-xl shadow-lg bg-white/70 backdrop-blur-sm dark:border-gray-600/50 dark:bg-gray-800/70">
            <div className=" flex justify-between align-items p-4 border-b border-blue-100 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:border-gray-700 dark:from-gray-700/50 dark:to-gray-600/50">
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
                  <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-400 flex items-center">
                    <Eye className="h-5 w-5 mr-2" />
                    {mdFile?.name}
                  </h2>
                  <Button
                    onClick={() => onEditReadme(mdFile.name)}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
            <div className="border border-blue-200/50 rounded-lg bg-white/70 backdrop-blur-sm dark:border-gray-600/50 dark:bg-gray-800/70">
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
                      <MarkdownViewer content={originFileDetailData?.textContent} />
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
