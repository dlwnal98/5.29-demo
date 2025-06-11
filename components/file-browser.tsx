"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
import { CreateDirectoryModal } from "@/components/create-directory-modal";
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
  Settings,
  Download,
  Eye,
  Edit,
  Trash2,
  Copy,
  ExternalLink,
  Calendar,
  User,
  HardDrive,
} from "lucide-react";

// 샘플 데이터 (파일 내용 포함)
const initialFileData = [
  {
    name: ".github",
    type: "folder",
    size: "-",
    lastCommit: "Add GitHub workflows",
    commitTime: "2 days ago",
    author: "john-doe",
    content: null,
  },
  {
    name: "src",
    type: "folder",
    size: "-",
    lastCommit: "Refactor components structure",
    commitTime: "3 days ago",
    author: "jane-smith",
    content: null,
  },
  {
    name: "public",
    type: "folder",
    size: "-",
    lastCommit: "Add new assets",
    commitTime: "1 week ago",
    author: "mike-wilson",
    content: null,
  },
  {
    name: "package.json",
    type: "file",
    extension: "json",
    size: "2.1 KB",
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
    size: "4.2 KB",
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
    size: "856 B",
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
  {
    name: "tailwind.config.ts",
    type: "file",
    extension: "ts",
    size: "1.3 KB",
    lastCommit: "Update Tailwind configuration",
    commitTime: "1 week ago",
    author: "john-doe",
    content: `import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config`,
  },
  {
    name: "screenshot.png",
    type: "file",
    extension: "png",
    size: "245 KB",
    lastCommit: "Add project screenshot",
    commitTime: "2 weeks ago",
    author: "jane-smith",
    content: "/placeholder.svg?height=400&width=600",
  },
];

const breadcrumbItems = [
  { name: "my-project", href: "/" },
  { name: "main", href: "/tree/main" },
];

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

function FilePreview({
  file,
  projectSlug,
  currentPath,
}: {
  file: any;
  projectSlug: string;
  currentPath: string;
}) {
  if (!file || file.type === "folder") {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <div className="text-center">
          <Folder className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Select a file to preview its contents</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (file.extension) {
      case "md":
        return (
          <div className="prose prose-sm max-w-none">
            <pre className="whitespace-pre-wrap font-mono text-sm bg-gray-50 p-4 rounded-lg overflow-auto">
              {file.content}
            </pre>
          </div>
        );
      case "json":
        return (
          <pre className="language-json bg-gray-50 p-4 rounded-lg overflow-auto text-sm font-mono">
            {file.content}
          </pre>
        );
      case "js":
      case "ts":
      case "tsx":
      case "jsx":
        return (
          <pre className="language-javascript bg-gray-50 p-4 rounded-lg overflow-auto text-sm font-mono">
            {file.content}
          </pre>
        );
      case "png":
      case "jpg":
      case "jpeg":
      case "gif":
      case "svg":
        return (
          <div className="flex items-center justify-center p-8">
            <img
              src={file.content || "/placeholder.svg"}
              alt={file.name}
              className="max-w-full max-h-96 rounded-lg shadow-lg"
            />
          </div>
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

  return (
    <div className="space-y-4">
      {/* File Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200/50">
        <div className="flex items-center space-x-3">
          {getFileIcon(file.type, file.extension)}
          <div>
            <h3 className="font-semibold text-blue-900">{file.name}</h3>
            <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
              <span className="flex items-center">
                <HardDrive className="h-3 w-3 mr-1" />
                {file.size}
              </span>
              <span className="flex items-center">
                <User className="h-3 w-3 mr-1" />
                {file.author}
              </span>
              <span className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                {file.commitTime}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="border-blue-200 hover:bg-blue-50"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-blue-200 hover:bg-blue-50"
            onClick={() => {
              const params = new URLSearchParams();
              params.set("branch", "main"); // You might want to get this from props
              if (currentPath) params.set("path", currentPath);
              params.set("file", file.name);
              window.location.href = `/project/${projectSlug}/edit?${params.toString()}`;
            }}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-blue-200 hover:bg-blue-50"
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-blue-200 hover:bg-blue-50"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Open
          </Button>
        </div>
      </div>

      {/* File Content */}
      <div className="border border-blue-200/50 rounded-lg bg-white/70 backdrop-blur-sm">
        <div className="p-4 border-b border-blue-100 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-blue-900">File Contents</h4>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              {file.extension?.toUpperCase() || "FILE"}
            </Badge>
          </div>
        </div>
        <div className="max-h-96 overflow-auto">{renderContent()}</div>
      </div>

      {/* File Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white/70 backdrop-blur-sm border border-blue-200/50 rounded-lg">
          <h5 className="font-medium text-blue-900 mb-2">Last Commit</h5>
          <p className="text-sm text-muted-foreground">{file.lastCommit}</p>
        </div>
        <div className="p-4 bg-white/70 backdrop-blur-sm border border-blue-200/50 rounded-lg">
          <h5 className="font-medium text-blue-900 mb-2">File Size</h5>
          <p className="text-sm text-muted-foreground">{file.size}</p>
        </div>
        <div className="p-4 bg-white/70 backdrop-blur-sm border border-blue-200/50 rounded-lg">
          <h5 className="font-medium text-blue-900 mb-2">Last Modified</h5>
          <p className="text-sm text-muted-foreground">{file.commitTime}</p>
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

  const filteredFiles = fileData.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFileClick = (file: any) => {
    setSelectedFile(file);
  };

  const handleDirectoryCreated = (directoryName: string) => {
    // 새 폴더를 파일 목록에 추가
    const newDirectory = {
      name: directoryName,
      type: "folder",
      size: "-",
      lastCommit: "Create directory",
      commitTime: "just now",
      author: "current-user",
      content: null,
    };

    setFileData((prevData) => [newDirectory, ...prevData]);
  };

  // Update breadcrumb items to include project name
  const breadcrumbItems = [
    { name: "Projects", href: "/" },
    { name: projectSlug, href: `/project/${projectSlug}` },
    // { name: "main", href: `/project/${projectSlug}/tree/main` },
  ];

  return (
    <div className="bg-transparent">
      <div className="container mx-auto px-4 py-6">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            {/* Branch Selector */}
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
                <DropdownMenuItem onClick={() => setCurrentBranch("main")}>
                  main
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCurrentBranch("develop")}>
                  develop
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setCurrentBranch("feature/auth")}
                >
                  feature/auth
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Breadcrumb */}
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbItems.map((item, index) => (
                  <div key={item.name} className="flex items-center">
                    {index > 0 && <BreadcrumbSeparator />}
                    <BreadcrumbItem>
                      {index === breadcrumbItems.length - 1 ? (
                        <BreadcrumbPage>{item.name}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink href={item.href}>
                          {item.name}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </div>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
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
                    window.location.href = `/project/${projectSlug}/create?${params.toString()}`;
                  }}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Create new file
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload files
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setIsCreateDirectoryModalOpen(true)}
                >
                  <Folder className="h-4 w-4 mr-2" />
                  Create new directory
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
                <TableHead className="w-[30%] text-blue-700 font-semibold">
                  Last commit
                </TableHead>
                <TableHead className="w-[15%] text-blue-700 font-semibold">
                  Last update
                </TableHead>
                <TableHead className="w-[10%] text-blue-700 font-semibold">
                  Size
                </TableHead>
                <TableHead className="w-[5%]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFiles.map((file, index) => (
                <TableRow
                  key={index}
                  className={`hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 ${
                    selectedFile?.name === file.name
                      ? "bg-gradient-to-r from-blue-100 to-indigo-100"
                      : ""
                  }`}
                >
                  <TableCell>
                    <div
                      className="flex items-center space-x-3 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (file.type === "folder") {
                          // Navigate to folder
                          const newPath = currentPath
                            ? `${currentPath}/${file.name}`
                            : file.name;
                          const params = new URLSearchParams();
                          params.set("branch", currentBranch);
                          params.set("path", newPath);
                          window.location.href = `/project/${projectSlug}?${params.toString()}`;
                        } else {
                          // Select file for preview
                          handleFileClick(file);
                        }
                      }}
                    >
                      {getFileIcon(file.type, file.extension)}
                      <span className="font-medium">{file.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm">{file.lastCommit}</span>
                      <span className="text-xs text-muted-foreground">
                        by {file.author}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {file.commitTime}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {file.size}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-blue-100"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            const params = new URLSearchParams();
                            params.set("branch", currentBranch);
                            if (currentPath) params.set("path", currentPath);
                            params.set("file", file.name);
                            window.location.href = `/project/${projectSlug}/edit?${params.toString()}`;
                          }}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* File Preview Section */}
        <div className="border border-blue-200/50 rounded-xl shadow-lg bg-white/70 backdrop-blur-sm">
          <div className="p-4 border-b border-blue-100 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
            <h2 className="text-lg font-semibold text-blue-900 flex items-center">
              <Eye className="h-5 w-5 mr-2" />
              File Preview
            </h2>
          </div>
          <div className="p-6">
            <FilePreview
              file={selectedFile}
              projectSlug={projectSlug}
              currentPath={currentPath}
            />
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-sm text-muted-foreground">
          <p>{filteredFiles.length} items • Last updated 2 days ago</p>
        </div>

        {/* Create Directory Modal */}
        <CreateDirectoryModal
          isOpen={isCreateDirectoryModalOpen}
          onClose={() => setIsCreateDirectoryModalOpen(false)}
          projectSlug={projectSlug}
          branch={currentBranch}
          currentPath={currentPath}
          onDirectoryCreated={handleDirectoryCreated}
        />
      </div>
    </div>
  );
}
