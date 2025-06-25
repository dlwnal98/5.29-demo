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

// 파일 아이콘 함수
function getFileIcon(extension?: string) {
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

// 샘플 파일 데이터
const fileData = {
  "README.md": {
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
    size: "4.2 KB",
    lastCommit: {
      hash: "a1b2c3d",
      message: "Update documentation",
      author: "jane-smith",
      time: "2 hours ago",
    },
  },
  "package.json": {
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
    size: "2.1 KB",
    lastCommit: {
      hash: "f6g7h8i",
      message: "Update dependencies",
      author: "john-doe",
      time: "1 day ago",
    },
  },
};

export default function EditFilePage() {
  const searchParams = useSearchParams();
  const branch = searchParams.get("branch") || "main";
  const path = searchParams.get("path") || "";
  const originalFileName = searchParams.get("file") || "";

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedStructureItem, setSelectedStructureItem] =
    useState(originalFileName);
  const [fileName, setFileName] = useState(originalFileName);
  const [fileContent, setFileContent] = useState(
    fileData[originalFileName as keyof typeof fileData]?.content || ""
  );
  const [commitMessage, setCommitMessage] = useState("");
  const [commitDescription, setCommitDescription] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const currentFile = fileData[originalFileName as keyof typeof fileData];
  const fileExtension = fileName.split(".").pop();

  const { mutate: modifyFileMutate } = useModifyFile(
    "admin",
    "configs_repo",
    branch,
    originalFileName, // 수정할 때는 파일 이름 변경 안됨
    "d57a83e6a05e1a582bbf8f1b4ea38bbb0b3204da", // 커밋하면 목록조회에서 sha 정보 바뀌는데 그거 불러와서 넣어야함
    "commits", // 커밋메세지,
    "# Clalink Config Server\n\n[![Java](https://img.shields.io/badge/Java-21-blue.svg)](https://adoptopenjdk.net/) [![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.0-brightgreen.svg)](https://spring.io/projects/spring-boot) [![Spring Cloud](https://img.shields.io/badge/Spring%20Cloud-2025.0.0-blue.svg)](https://spring.io/projects/spring-cloud) [![License: Nexfron](https://img.shields.io/badge/license-Nexfron-blue.svg)](LICENSE)\n\n## 프로젝트 개요\n\nClalink Config Server는 Spring Cloud Confi"
  );

  const modifyFile = () => {
    modifyFileMutate();
  };

  const { data: fileDetailData } = useFetchOriginFileDetail(
    "admin",
    "configs_repo",
    branch,
    originalFileName
  );

  const handleBack = () => {
    const params = new URLSearchParams();
    params.set("branch", branch);
    if (path) params.set("path", path);
    window.location.href = `/infra-packages/config/projects?${params.toString()}`;
  };

  const handlePreview = () => {
    const params = new URLSearchParams();
    params.set("branch", branch);
    if (path) params.set("path", path);
    params.set("file", fileName);
    window.location.href = `/infra-packages/config/projects/view?${params.toString()}`;
  };

  const handleSave = async () => {
    if (!commitMessage.trim()) {
      alert("Please enter a commit message");
      return;
    }

    setIsSaving(true);
    try {
      // 실제 저장 로직 구현
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 시뮬레이션
      alert("File saved successfully!");
      handleBack();
    } catch (error) {
      alert("Failed to save file");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCommitClick = () => {
    if (currentFile?.lastCommit) {
      const params = new URLSearchParams();
      params.set("branch", branch);
      params.set("commit", currentFile.lastCommit.hash);
      if (path) params.set("path", path);
      window.location.href = `/infra-packages/config/projects/commit?${params.toString()}`;
    }
  };

  const renderPreview = () => {
    switch (fileExtension) {
      case "md":
        return (
          <div className="prose prose-sm max-w-none">
            <pre className="whitespace-pre-wrap font-mono text-sm bg-gray-50 p-4 rounded-lg overflow-auto">
              {fileContent}
            </pre>
          </div>
        );
      case "json":
        return (
          <pre className="language-json bg-gray-50 p-4 rounded-lg overflow-auto text-sm font-mono">
            {fileContent}
          </pre>
        );
      default:
        return (
          <pre className="bg-gray-50 p-4 rounded-lg overflow-auto text-sm font-mono">
            {fileContent}
          </pre>
        );
    }
  };

  const breadcrumbItems = [
    // { name: "/", href: "/" },
    { name: "config", href: `/infra-packages/config/projects` },
    { name: `Edit ${fileName}`, href: "" },
  ];

  return (
    <AppLayout projectSlug="config">
      <div className="bg-transparent">
        <div className="flex h-[calc(100vh-4rem)]">
          {/* Left Sidebar - File Structure */}
          {sidebarOpen && (
            <div className="w-80 border-r border-blue-200/50 bg-white/70 backdrop-blur-sm">
              <div className="p-4 border-b border-blue-100 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
                <h3 className="font-semibold text-blue-900 flex items-center">
                  <Folder className="h-4 w-4 mr-2" />
                  File Structure
                </h3>
              </div>
              <div className="p-4 overflow-y-auto h-full">
                <div className="space-y-1">
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
                        getFileIcon(item.extension)
                      )}
                      <span className="text-sm">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto">
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

                {/* File Name Editor */}
                {/* <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200/50">
                  <div className="flex items-center space-x-3">
                    {getFileIcon(fileExtension)}
                    <div className="flex-1">
                      <Label
                        htmlFor="fileName"
                        className="text-sm font-medium text-blue-900 mb-2 block"
                      >
                        File Name
                      </Label>
                      <Input
                        id="fileName"
                        value={fileName}
                        onChange={(e) => setFileName(e.target.value)}
                        className="font-mono"
                        placeholder="Enter file name..."
                      />
                    </div>
                  </div>
                </div> */}

                {/* Editor/Preview Content */}
                <div className="border border-blue-200/50 rounded-xl shadow-lg bg-white/70 backdrop-blur-sm mb-6">
                  <div className="flex items-center justify-between p-4 border-b border-blue-100 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
                    {/* <h2 className="font-medium text-blue-900"> */}
                    {/* {isPreview ? "Preview" : "Edit File"} */}
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
                    {/* </h2> */}
                    {/* Editor/Preview Toggle */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant={!isPreview ? "default" : "outline"}
                          size="sm"
                          onClick={() => setIsPreview(false)}
                          className={
                            !isPreview
                              ? "bg-blue-600 hover:bg-blue-700"
                              : "border-blue-200 hover:bg-blue-50"
                          }
                        >
                          Edit
                        </Button>
                        <Button
                          variant={isPreview ? "default" : "outline"}
                          size="sm"
                          onClick={() => setIsPreview(true)}
                          className={
                            isPreview
                              ? "bg-blue-600 hover:bg-blue-700"
                              : "border-blue-200 hover:bg-blue-50"
                          }
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </Button>
                      </div>
                      <Button
                        onClick={handlePreview}
                        variant="outline"
                        className="border-blue-200 hover:bg-blue-50"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View File
                      </Button>
                    </div>
                  </div>
                  <div className="p-6">
                    {isPreview ? (
                      renderPreview()
                    ) : (
                      <Textarea
                        value={fileDetailData?.textContent}
                        onChange={(e) => setFileContent(e.target.value)}
                        className="min-h-[400px] font-mono text-sm resize-none border-0 focus-visible:ring-0 p-0"
                        placeholder="Enter file content..."
                      />
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
                    <div>
                      <Label
                        htmlFor="commitDescription"
                        className="text-sm font-medium mb-2 block"
                      >
                        Extended Description (optional)
                      </Label>
                      <Textarea
                        id="commitDescription"
                        value={commitDescription}
                        onChange={(e) => setCommitDescription(e.target.value)}
                        placeholder="Add more details about your changes..."
                        className="min-h-[100px] font-mono text-sm"
                      />
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button
                        variant="outline"
                        onClick={handleBack}
                        disabled={isSaving}
                      >
                        Cancel
                      </Button>
                      {/* <Button
                        onClick={modifyFile}
                        disabled={!commitMessage.trim() || isSaving}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        {isSaving ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                            Committing...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Commit Changes
                          </>
                        )}
                      </Button> */}
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
