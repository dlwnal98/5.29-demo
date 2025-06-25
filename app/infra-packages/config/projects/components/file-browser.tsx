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
import { Badge } from "@/components/ui/badge";
import {
  ChevronDown,
  File,
  Folder,
  GitBranch,
  Plus,
  Search,
  Upload,
  FileText,
  ImageIcon,
  Code,
  Archive,
  Eye,
  Edit,
  User,
  History,
  GitCommit,
  Settings,
} from "lucide-react";
import { initialFileData, branches } from "@/constants/config-data";
import {
  useFetchBranchList,
  useFetchConfigFileList,
  useFetchVaultKey,
  useFetchOriginFileDetail,
} from "@/hooks/use-config-data";
import BranchManagementModal from "./BranchManagementModal";
import ReactMarkdown from "react-markdown";

interface MarkdownViewerProps {
  content: string;
}

function getFileIcon(type: string, extension?: string) {
  if (type === "dir") {
    return <Folder className="h-4 w-4 text-blue-500" />;
  }

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

// 브랜치 관리 모달 컴포넌트

// README.md 파일 미리보기 컴포넌트
function ReadmePreview({ file, onEdit }: { file: any; onEdit: () => void }) {
  if (!file || file.name !== "README.md") {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <div className="text-center">
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Select README.md to preview its contents</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with Edit Button */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200/50">
        <div className="flex items-center space-x-3">
          <FileText className="h-5 w-5 text-indigo-500" />
          <div>
            <h3 className="font-semibold text-blue-900">{file.name}</h3>
            <p className="text-sm text-muted-foreground">Documentation</p>
          </div>
        </div>
        <Button
          onClick={onEdit}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
      </div>

      {/* Content */}
      <div className="border border-blue-200/50 rounded-lg bg-white/70 backdrop-blur-sm">
        <div className="p-4 border-b border-blue-100 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
          <h4 className="font-medium text-blue-900">README.md</h4>
        </div>
        <div className="p-6 max-h-96 overflow-auto">
          <div className="prose prose-sm max-w-none">
            <pre className="whitespace-pre-wrap font-mono text-sm bg-gray-50 p-4 rounded-lg">
              {file.content}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

interface FileBrowserProps {
  projectSlug: string;
}

export const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ content }) => {
  return (
    <div className="prose max-w-none prose-indigo dark:prose-invert">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
};

export function FileBrowser({ projectSlug }: FileBrowserProps) {
  const { data: configFileListData } = useFetchConfigFileList(
    "admin",
    "configs_repo",
    "main",
    ""
  );
  const { data: branchListData } = useFetchBranchList("admin", "configs_repo");

  console.log(configFileListData, branchListData);
  const mdFiles = configFileListData?.filter((item) =>
    item.name.endsWith(".md")
  );

  const { data: originFileDetailData } = useFetchOriginFileDetail(
    "admin",
    "configs_repo",
    "main",
    mdFiles?.[0]?.name ?? "string"
  );

  const [currentBranch, setCurrentBranch] = useState("main");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [currentPath, setCurrentPath] = useState("");
  const [fileData, setFileData] = useState(initialFileData);
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [selectMdFile, setSelectMdFile] = useState("");

  // 자동으로 README.md 선택
  // useState(() => {
  //   const readmeFile = fileData.find((f) => f.name === "README.md");
  //   if (readmeFile) {
  //     setSelectedFile(readmeFile);
  //   }
  // });

  const handleFileClick = (file: any) => {
    if (file.type === "file") {
      // 파일 뷰어 페이지로 이동
      const params = new URLSearchParams();
      params.set("branch", currentBranch);
      if (currentPath) params.set("path", currentPath);
      params.set("file", file.name);
      window.location.href = `/infra-packages/config/projects/view?${params.toString()}`;
    } else if (file.type === "dir") {
      // 폴더 클릭 시 해당 폴더로 이동
      const newPath = currentPath ? `${currentPath}/${file.name}` : file.name;
      const params = new URLSearchParams();
      params.set("branch", currentBranch);
      params.set("path", newPath);
      window.location.href = `/infra-packages/config/projects?${params.toString()}`;
    } else {
      // 폴더인 경우 README.md 선택
      const readmeFile = fileData.find((f) => f.name === "README.md");
      if (readmeFile) {
        setSelectedFile(readmeFile);
      }
    }
  };

  const handleCommitClick = (file: any, event: React.MouseEvent) => {
    event.stopPropagation();
    // 커밋 상세 페이지로 이동
    const params = new URLSearchParams();
    params.set("branch", currentBranch);
    params.set("commit", "a1b2c3d"); // 실제로는 file.commitHash 등을 사용
    if (currentPath) params.set("path", currentPath);
    window.location.href = `/infra-packages/config/projects/commit?${params.toString()}`;
  };

  const handleCommitHistory = () => {
    const params = new URLSearchParams();
    params.set("branch", currentBranch);
    if (currentPath) params.set("path", currentPath);
    window.location.href = `/infra-packages/config/projects/commits?${params.toString()}`;
  };

  const handleEditReadme = () => {
    const params = new URLSearchParams();
    params.set("branch", currentBranch);
    if (currentPath) params.set("path", currentPath);
    params.set("file", "README.md");
    window.location.href = `/infra-packages/config/projects/edit?${params.toString()}`;
  };

  const handleUploadFiles = () => {
    const params = new URLSearchParams();
    params.set("branch", currentBranch);
    if (currentPath) params.set("path", currentPath);
    window.location.href = `/infra-packages/config/projects/upload?${params.toString()}`;
  };

  return (
    <div className="bg-transparent">
      <div className="mx-auto px-4 py-6">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            {/* Branch Selector */}
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
                      onClick={() => setCurrentBranch(branch.name)}
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
                onClick={handleCommitHistory}
                className="border-blue-200 hover:bg-blue-50"
              >
                <History className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
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
                <DropdownMenuItem
                  onClick={() => {
                    const params = new URLSearchParams();
                    params.set("branch", currentBranch);
                    if (currentPath) params.set("path", currentPath);
                    window.location.href = `/infra-packages/config/projects/create?${params.toString()}`;
                  }}
                >
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

        {/* Latest Commit Info */}
        <div className="mb-4 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200/50">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="h-4 w-4 text-blue-600" />
            </div>
            <div className="flex justify-between flex-1">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-900">
                  {(configFileListData && configFileListData[0]?.author) ||
                    "jumi_lee"}
                </span>
                <Badge
                  variant="secondary"
                  className="text-[13px] font-lightbold border border-gray-200/50"
                >
                  <GitCommit className="h-3 w-3 mr-1" />
                  {configFileListData && configFileListData[0]?.sha}
                </Badge>
                <span className="text-gray-600">
                  {configFileListData && configFileListData[0]?.textContent}
                </span>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                <span className="flex items-center">
                  {configFileListData &&
                    configFileListData[0]?.lastCommitterDate}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* File Table */}
        <div className="border border-blue-200/50 rounded-xl shadow-lg bg-white/70 backdrop-blur-sm mb-6">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-blue-100">
                <TableHead className="w-[40%] text-blue-700 font-semibold">
                  Name
                </TableHead>
                <TableHead className="w-[40%] text-blue-700 font-semibold">
                  Commit Message
                </TableHead>
                <TableHead className="w-[20%] text-blue-700 font-semibold text-right">
                  Last Modified
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {configFileListData?.map((file: any, index: number) => (
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
                  <TableCell>
                    <button
                      onClick={(e) => handleCommitClick(file, e)}
                      className="text-sm text-gray-600 hover:text-blue-600 transition-colors text-left w-full"
                    >
                      {file.textContent}
                    </button>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground text-right">
                    {file.lastCommitterDate}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* README.md Preview Section */}
        {mdFiles && (
          <div className="border border-blue-200/50 rounded-xl shadow-lg bg-white/70 backdrop-blur-sm">
            <div className=" flex justify-between align-items p-4 border-b border-blue-100 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
              <h2 className="text-lg font-semibold text-blue-900 flex items-center">
                <Eye className="h-5 w-5 mr-2" />
                {mdFiles?.[0]?.name}
              </h2>
              <Button
                onClick={handleEditReadme}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>

            <div className="border border-blue-200/50 rounded-lg bg-white/70 backdrop-blur-sm">
              <div className="p-6">
                <div className="prose prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap font-mono text-sm bg-gray-50  rounded-lg">
                    {originFileDetailData && (
                      <MarkdownViewer
                        content={originFileDetailData?.textContent}
                      />
                    )}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modals */}
        <BranchManagementModal
          isOpen={isBranchModalOpen}
          onClose={() => setIsBranchModalOpen(false)}
          branches={branchListData ?? []}
        />
      </div>
    </div>
  );
}
