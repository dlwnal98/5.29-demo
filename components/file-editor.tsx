"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  FileText,
  Code,
  ImageIcon,
  Settings,
  Save,
  Eye,
  GitBranch,
  Folder,
  AlertCircle,
  CheckCircle,
  Clock,
  User,
  Calendar,
} from "lucide-react";

interface FileEditorProps {
  projectSlug: string;
  branch: string;
  currentPath: string;
  fileName: string;
}

// 샘플 파일 데이터 (실제로는 API에서 가져올 것)
const getFileData = (fileName: string) => {
  const fileDatabase: Record<string, any> = {
    "package.json": {
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
    "README.md": {
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
    "next.config.js": {
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
    "tailwind.config.ts": {
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
  };

  return fileDatabase[fileName] || null;
};

export function FileEditor({
  projectSlug,
  branch,
  currentPath,
  fileName,
}: FileEditorProps) {
  const [fileContent, setFileContent] = useState("");
  const [originalContent, setOriginalContent] = useState("");
  const [commitMessage, setCommitMessage] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingFile, setIsLoadingFile] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [fileData, setFileData] = useState<any>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // 브레드크럼 생성
  const breadcrumbItems = [
    { name: projectSlug, href: `/infra-packages/config/projects` },
    {
      name: branch,
      href: `/infra-packages/config/projects?branch=${branch}`,
    },
  ];

  if (currentPath) {
    const pathParts = currentPath.split("/").filter(Boolean);
    pathParts.forEach((part, index) => {
      const path = pathParts.slice(0, index + 1).join("/");
      breadcrumbItems.push({
        name: part,
        href: `/infra-packages/config/projects?branch=${branch}&path=${path}`,
      });
    });
  }

  breadcrumbItems.push({ name: fileName, href: "" });
  breadcrumbItems.push({ name: "Edit", href: "" });

  // 파일 데이터 로드
  useEffect(() => {
    const loadFile = async () => {
      setIsLoadingFile(true);
      try {
        // 실제로는 API 호출
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const data = getFileData(fileName);

        if (data) {
          setFileData(data);
          setFileContent(data.content);
          setOriginalContent(data.content);
          setCommitMessage(`Update ${fileName}`);
        } else {
          setError("File not found");
        }
      } catch (err) {
        setError("Failed to load file");
      } finally {
        setIsLoadingFile(false);
      }
    };

    if (fileName) {
      loadFile();
    }
  }, [fileName]);

  // 변경사항 감지
  useEffect(() => {
    setHasChanges(fileContent !== originalContent);
  }, [fileContent, originalContent]);

  const handleSave = async () => {
    setError("");
    setSuccess(false);

    if (!commitMessage.trim()) {
      setError("Commit message is required");
      return;
    }

    if (!hasChanges) {
      setError("No changes to save");
      return;
    }

    setIsLoading(true);

    try {
      // 여기서 실제 파일 저장 API 호출
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setSuccess(true);
      setOriginalContent(fileContent);
      setHasChanges(false);

      setTimeout(() => {
        // 파일 브라우저로 리다이렉트
        window.location.href = `/infra-packages/config/projects?branch=${branch}&path=${currentPath}`;
      }, 1500);
    } catch (err) {
      setError("Failed to save file. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      const confirmed = window.confirm(
        "You have unsaved changes. Are you sure you want to leave?"
      );
      if (!confirmed) return;
    }
    window.location.href = `/infra-packages/config/projects?branch=${branch}&path=${currentPath}`;
  };

  const getFileIcon = (filename: string) => {
    const ext = filename.split(".").pop()?.toLowerCase();
    switch (ext) {
      case "md":
        return <FileText className="h-4 w-4 text-indigo-500" />;
      case "js":
      case "ts":
      case "tsx":
      case "jsx":
      case "json":
        return <Code className="h-4 w-4 text-amber-500" />;
      case "png":
      case "jpg":
      case "jpeg":
      case "gif":
      case "svg":
        return <ImageIcon className="h-4 w-4 text-green-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  if (isLoadingFile) {
    return (
      <div className="bg-transparent">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading file...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!fileData) {
    return (
      <div className="bg-transparent">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertCircle className="h-8 w-8 mx-auto mb-4 text-red-500" />
              <p className="text-muted-foreground">File not found</p>
              <Button onClick={handleCancel} className="mt-4">
                Go Back
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-transparent">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="border-blue-200 hover:bg-blue-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            {/* Breadcrumb */}
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
            <Badge variant="outline" className="border-blue-200 text-blue-700">
              <GitBranch className="h-3 w-3 mr-1" />
              {branch}
            </Badge>
            {currentPath && (
              <Badge
                variant="outline"
                className="border-blue-200 text-blue-700"
              >
                <Folder className="h-3 w-3 mr-1" />
                {currentPath}
              </Badge>
            )}
            {hasChanges && (
              <Badge
                variant="outline"
                className="border-orange-200 text-orange-700 bg-orange-50"
              >
                <Clock className="h-3 w-3 mr-1" />
                Unsaved
              </Badge>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* File Details */}
          <div className="lg:col-span-1">
            <Card className="border-blue-200/50 bg-white/70 backdrop-blur-sm mb-6">
              <CardHeader>
                <CardTitle className="text-blue-900 flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  File Details
                </CardTitle>
                <CardDescription>Edit file settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* File Name (Read-only) */}
                <div className="space-y-2">
                  <Label htmlFor="filename">File Name</Label>
                  <div className="flex items-center space-x-2">
                    {getFileIcon(fileName)}
                    <Input
                      id="filename"
                      value={fileName}
                      readOnly
                      className="border-blue-200 bg-gray-50 cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Commit Message */}
                <div className="space-y-2">
                  <Label htmlFor="commit">Commit Message</Label>
                  <Input
                    id="commit"
                    value={commitMessage}
                    onChange={(e) => setCommitMessage(e.target.value)}
                    placeholder="Update file"
                    className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                  />
                </div>

                {/* Error/Success Messages */}
                {error && (
                  <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                {success && (
                  <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-lg">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">File saved successfully!</span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-2 pt-4">
                  <Button
                    onClick={handleSave}
                    disabled={isLoading || !hasChanges}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    className="border-blue-200 hover:bg-blue-50"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* File Info */}
            <Card className="border-blue-200/50 bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-blue-900 text-sm">
                  File Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Size</span>
                  <span>{fileData.size}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Last commit</span>
                  <span className="truncate ml-2">{fileData.lastCommit}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center">
                    <User className="h-3 w-3 mr-1" />
                    Author
                  </span>
                  <span>{fileData.author}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    Modified
                  </span>
                  <span>{fileData.commitTime}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* File Editor */}
          <div className="lg:col-span-2">
            <Card className="border-blue-200/50 bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-blue-900 flex items-center">
                    <Code className="h-5 w-5 mr-2" />
                    File Content
                    {hasChanges && (
                      <span className="ml-2 text-orange-600 text-sm">
                        • Modified
                      </span>
                    )}
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant={isPreview ? "outline" : "default"}
                      size="sm"
                      onClick={() => setIsPreview(false)}
                      className={
                        !isPreview
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "border-blue-200 hover:bg-blue-50"
                      }
                    >
                      <Code className="h-4 w-4 mr-1" />
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
                      <Eye className="h-4 w-4 mr-1" />
                      Preview
                    </Button>
                  </div>
                </div>
                <CardDescription>
                  {isPreview
                    ? "Preview your changes"
                    : "Edit your file content"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isPreview ? (
                  <div className="border border-blue-200 rounded-lg p-4 bg-gray-50 min-h-96 max-h-96 overflow-auto">
                    {fileName.endsWith(".md") ? (
                      <div className="prose prose-sm max-w-none">
                        <pre className="whitespace-pre-wrap font-mono text-sm">
                          {fileContent}
                        </pre>
                      </div>
                    ) : (
                      <pre className="whitespace-pre-wrap font-mono text-sm">
                        {fileContent}
                      </pre>
                    )}
                  </div>
                ) : (
                  <Textarea
                    value={fileContent}
                    onChange={(e) => setFileContent(e.target.value)}
                    placeholder="Edit your file content here..."
                    className="min-h-96 max-h-96 font-mono text-sm border-blue-200 focus:border-blue-400 focus:ring-blue-400 resize-none"
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* File Path Info */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-blue-700">
              <Folder className="h-4 w-4" />
              <span>
                Editing:{" "}
                <code className="bg-blue-100 px-2 py-1 rounded">
                  {currentPath ? `${currentPath}/${fileName}` : fileName}
                </code>
              </span>
            </div>
            {hasChanges && (
              <div className="text-sm text-orange-600 flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                You have unsaved changes
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
