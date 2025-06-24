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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  Trash2,
  User,
  History,
  GitCommit,
  Settings,
} from "lucide-react";

// 샘플 데이터 (파일 내용 포함)
const initialFileData = [
  {
    name: ".github",
    type: "folder",
    lastCommit: "Add GitHub workflows",
    commitTime: "2 days ago",
    author: "john-doe",
    content: null,
  },
  {
    name: "src",
    type: "folder",
    lastCommit: "Refactor components structure",
    commitTime: "3 days ago",
    author: "jane-smith",
    content: null,
  },
  {
    name: "public",
    type: "folder",
    lastCommit: "Add new assets",
    commitTime: "1 week ago",
    author: "mike-wilson",
    content: null,
  },
  {
    name: "package.json",
    type: "file",
    extension: "json",
    lastCommit: "Update dependencies",
    commitTime: "1 day ago",
    author: "john-doe",
    content: `{
  "name": "my-project",
  "version": "1.0.0",
  "description": "A modern web application",
  "main": "index.js",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "tailwindcss": "^3.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "typescript": "^5.0.0"
  }
}`,
  },
  {
    name: "README.md",
    type: "file",
    extension: "md",
    lastCommit: "Update documentation",
    commitTime: "2 days ago",
    author: "jane-smith",
    content: `# My Project

A modern web application built with Next.js and React.

## Features

- 🚀 Fast and responsive
- 🎨 Beautiful UI with Tailwind CSS
- 📱 Mobile-first design
- 🔒 Secure authentication
- 📊 Real-time analytics

## Getting Started

First, install the dependencies:

\`\`\`bash
npm install
# or
yarn install
\`\`\`

Then, run the development server:

\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

\`\`\`
├── src/
│   ├── components/
│   ├── pages/
│   └── styles/
├── public/
└── package.json
\`\`\`

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License.`,
  },
  {
    name: "next.config.js",
    type: "file",
    extension: "js",
    lastCommit: "Configure build settings",
    commitTime: "5 days ago",
    author: "mike-wilson",
    content: `/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['example.com'],
  },
  async redirects() {
    return [
      {
        source: '/old-page',
        destination: '/new-page',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig`,
  },
];

// 최근 커밋 정보
const latestCommit = {
  hash: "a1b2c3d",
  message: "Update documentation and fix styling issues",
  author: "jane-smith",
  time: "2 hours ago",
  avatar: "/placeholder-user.jpg",
};

// 브랜치 목록
const branches = ["main", "develop", "feature/auth", "hotfix/security"];

function getFileIcon(type: string, extension?: string) {
  if (type === "folder") {
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
function BranchManagementModal({
  isOpen,
  onClose,
  branches,
  onCreateBranch,
  onDeleteBranch,
}: {
  isOpen: boolean;
  onClose: () => void;
  branches: string[];
  onCreateBranch: (name: string) => void;
  onDeleteBranch: (name: string) => void;
}) {
  const [newBranchName, setNewBranchName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateBranch = () => {
    if (newBranchName.trim()) {
      onCreateBranch(newBranchName.trim());
      setNewBranchName("");
      setIsCreating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <GitBranch className="h-5 w-5 mr-2 text-blue-600" />
            Branch Management
          </DialogTitle>
          <DialogDescription>
            Create new branches or delete existing ones
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Create New Branch */}
          <div className="border rounded-lg p-4 bg-blue-50/50">
            <h4 className="font-medium text-blue-900 mb-3">
              Create New Branch
            </h4>
            <div className="flex space-x-2">
              <Input
                placeholder="Enter branch name"
                value={newBranchName}
                onChange={(e) => setNewBranchName(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={handleCreateBranch}
                disabled={!newBranchName.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-1" />
                Create
              </Button>
            </div>
          </div>

          {/* Existing Branches */}
          <div className="border rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">
              Existing Branches
            </h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {branches.map((branch) => (
                <div
                  key={branch}
                  className="flex items-center justify-between p-2 rounded hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-2">
                    <GitBranch className="h-4 w-4 text-gray-500" />
                    <span className="font-mono text-sm">{branch}</span>
                    {branch === "main" && (
                      <Badge variant="secondary" className="text-xs">
                        Default
                      </Badge>
                    )}
                  </div>
                  {branch !== "main" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteBranch(branch)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

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

export function FileBrowser({ projectSlug }: FileBrowserProps) {
  const [currentBranch, setCurrentBranch] = useState("main");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [currentPath, setCurrentPath] = useState("");
  const [fileData, setFileData] = useState(initialFileData);
  const [isCreateDirectoryModalOpen, setIsCreateDirectoryModalOpen] =
    useState(false);
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [branchList, setBranchList] = useState(branches);

  const filteredFiles = fileData.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFileClick = (file: any) => {
    if (file.type === "file") {
      // 파일 뷰어 페이지로 이동
      const params = new URLSearchParams();
      params.set("branch", currentBranch);
      if (currentPath) params.set("path", currentPath);
      params.set("file", file.name);
      window.location.href = `/infra-packages/config/view?${params.toString()}`;
    } else if (file.type === "folder") {
      // 폴더 클릭 시 해당 폴더로 이동
      const newPath = currentPath ? `${currentPath}/${file.name}` : file.name;
      const params = new URLSearchParams();
      params.set("branch", currentBranch);
      params.set("path", newPath);
      window.location.href = `/infra-packages/config?${params.toString()}`;
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
    window.location.href = `/infra-packages/config/commit?${params.toString()}`;
  };

  const handleDirectoryCreated = (directoryName: string) => {
    const newDirectory = {
      name: directoryName,
      type: "folder",
      lastCommit: "Create directory",
      commitTime: "just now",
      author: "current-user",
      content: null,
    };
    setFileData((prevData) => [newDirectory, ...prevData]);
  };

  const handleCreateBranch = (branchName: string) => {
    setBranchList((prev) => [...prev, branchName]);
  };

  const handleDeleteBranch = (branchName: string) => {
    setBranchList((prev) => prev.filter((b) => b !== branchName));
  };

  const handleEditReadme = () => {
    const params = new URLSearchParams();
    params.set("branch", currentBranch);
    if (currentPath) params.set("path", currentPath);
    params.set("file", "README.md");
    window.location.href = `/infra-packages/config/edit?${params.toString()}`;
  };

  const handleCommitHistory = () => {
    const params = new URLSearchParams();
    params.set("branch", currentBranch);
    if (currentPath) params.set("path", currentPath);
    window.location.href = `/infra-packages/config/commits?${params.toString()}`;
  };

  const handleUploadFiles = () => {
    const params = new URLSearchParams();
    params.set("branch", currentBranch);
    if (currentPath) params.set("path", currentPath);
    window.location.href = `/infra-packages/config/upload?${params.toString()}`;
  };

  // 자동으로 README.md 선택
  useState(() => {
    const readmeFile = fileData.find((f) => f.name === "README.md");
    if (readmeFile) {
      setSelectedFile(readmeFile);
    }
  });

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
                    className="w-32 border-blue-200 hover:border-blue-300 hover:bg-blue-50"
                  >
                    <GitBranch className="h-4 w-4 mr-2 text-blue-500" />
                    {currentBranch}
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {branchList.map((branch) => (
                    <DropdownMenuItem
                      key={branch}
                      onClick={() => setCurrentBranch(branch)}
                    >
                      {branch}
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
                    window.location.href = `/infra-packages/config/create?${params.toString()}`;
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
                  {latestCommit.author}
                </span>
                <Badge
                  variant="secondary"
                  className="text-[13px] font-lightbold border border-gray-200/50"
                >
                  <GitCommit className="h-3 w-3 mr-1" />
                  {latestCommit.hash}
                </Badge>
                <span className="text-gray-600">{latestCommit.message}</span>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                <span className="flex items-center">{latestCommit.time}</span>
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
              {filteredFiles.map((file, index) => (
                <TableRow
                  key={index}
                  className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200"
                >
                  <TableCell>
                    <button
                      onClick={() => handleFileClick(file)}
                      className="flex items-center space-x-3 hover:text-blue-600 transition-colors w-full text-left"
                    >
                      {getFileIcon(file.type, file.extension)}
                      <span className="font-medium">{file.name}</span>
                    </button>
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={(e) => handleCommitClick(file, e)}
                      className="text-sm text-gray-600 hover:text-blue-600 transition-colors text-left w-full"
                    >
                      {file.lastCommit}
                    </button>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground text-right">
                    {file.commitTime}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* README.md Preview Section */}
        <div className="border border-blue-200/50 rounded-xl shadow-lg bg-white/70 backdrop-blur-sm">
          <div className=" flex justify-between align-items p-4 border-b border-blue-100 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
            <h2 className="text-lg font-semibold text-blue-900 flex items-center">
              <Eye className="h-5 w-5 mr-2" />
              README.md
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
                  {selectedFile?.content}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Modals */}
        <BranchManagementModal
          isOpen={isBranchModalOpen}
          onClose={() => setIsBranchModalOpen(false)}
          branches={branchList}
          onCreateBranch={handleCreateBranch}
          onDeleteBranch={handleDeleteBranch}
        />
      </div>
    </div>
  );
}
