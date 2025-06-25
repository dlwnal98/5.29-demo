"use client";

import { useState } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
} from "lucide-react";

interface FileCreatorProps {
  projectSlug: string;
  branch: string;
  currentPath: string;
}

// 파일 템플릿
const fileTemplates = {
  empty: {
    name: "Empty File",
    content: "",
    description: "Start with a blank file",
  },
  "react-component": {
    name: "React Component",
    content: `import React from 'react'

interface Props {
  // Define your props here
}

const Component: React.FC<Props> = () => {
  return (
    <div>
      {/* Your component content */}
    </div>
  )
}

export default Component`,
    description: "React functional component template",
  },
  "typescript-interface": {
    name: "TypeScript Interface",
    content: `export interface MyInterface {
  id: string
  name: string
  // Add more properties as needed
}`,
    description: "TypeScript interface definition",
  },
  readme: {
    name: "README.md",
    content: `# Project Title

Brief description of your project.

## Installation

\`\`\`bash
npm install
\`\`\`

## Usage

\`\`\`bash
npm start
\`\`\`

## Contributing

Please read CONTRIBUTING.md for details on our code of conduct.

## License

This project is licensed under the MIT License.`,
    description: "Standard README template",
  },
  "package-json": {
    name: "package.json",
    content: `{
  "name": "my-project",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "jest"
  },
  "keywords": [],
  "author": "",
  "license": "MIT",
  "dependencies": {},
  "devDependencies": {}
}`,
    description: "Node.js package.json template",
  },
  gitignore: {
    name: ".gitignore",
    content: `# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Production
/build
/dist

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db`,
    description: "Git ignore file template",
  },
};

export function FileCreator({
  projectSlug,
  branch,
  currentPath,
}: FileCreatorProps) {
  const [fileName, setFileName] = useState("");
  const [fileContent, setFileContent] = useState("");
  const [commitMessage, setCommitMessage] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // 브레드크럼 생성
  const breadcrumbItems = [
    { name: "Projects", href: "/" },
    {
      name: projectSlug,
      href: `/infra-packages/config/projects/${projectSlug}`,
    },
    {
      name: branch,
      href: `/infra-packages/config/projects/${projectSlug}?branch=${branch}`,
    },
  ];

  if (currentPath) {
    const pathParts = currentPath.split("/").filter(Boolean);
    pathParts.forEach((part, index) => {
      const path = pathParts.slice(0, index + 1).join("/");
      breadcrumbItems.push({
        name: part,
        href: `/infra-packages/config/projects/${projectSlug}?branch=${branch}&path=${path}`,
      });
    });
  }

  breadcrumbItems.push({ name: "Create File", href: "" });

  const handleTemplateChange = (templateKey: string) => {
    setSelectedTemplate(templateKey);
    if (
      templateKey &&
      fileTemplates[templateKey as keyof typeof fileTemplates]
    ) {
      const template = fileTemplates[templateKey as keyof typeof fileTemplates];
      setFileContent(template.content);
      if (!fileName && template.name !== "Empty File") {
        setFileName(template.name);
      }
    } else {
      setFileContent("");
    }
  };

  const handleSave = async () => {
    setError("");
    setSuccess(false);

    if (!fileName.trim()) {
      setError("File name is required");
      return;
    }

    if (!commitMessage.trim()) {
      setError("Commit message is required");
      return;
    }

    setIsLoading(true);

    try {
      // 여기서 실제 파일 생성 API 호출
      await new Promise((resolve) => setTimeout(resolve, 2000)); // 시뮬레이션

      setSuccess(true);
      setTimeout(() => {
        // 파일 브라우저로 리다이렉트
        window.location.href = `/infra-packages/config/projects/${projectSlug}?branch=${branch}&path=${currentPath}`;
      }, 1500);
    } catch (err) {
      setError("Failed to create file. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    window.location.href = `/infra-packages/config/projects/${projectSlug}?branch=${branch}&path=${currentPath}`;
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
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* File Details */}
          <div className="lg:col-span-1">
            <Card className="border-blue-200/50 bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-blue-900 flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  File Details
                </CardTitle>
                <CardDescription>Configure your new file</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Template Selection */}
                <div className="space-y-2">
                  <Label htmlFor="template">Template</Label>
                  <Select
                    value={selectedTemplate}
                    onValueChange={handleTemplateChange}
                  >
                    <SelectTrigger className="border-blue-200 focus:border-blue-400">
                      <SelectValue placeholder="Choose a template" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(fileTemplates).map(([key, template]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex flex-col">
                            <span>{template.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {template.description}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* File Name */}
                <div className="space-y-2">
                  <Label htmlFor="filename">File Name</Label>
                  <div className="flex items-center space-x-2">
                    {fileName && getFileIcon(fileName)}
                    <Input
                      id="filename"
                      value={fileName}
                      onChange={(e) => setFileName(e.target.value)}
                      placeholder="Enter file name (e.g., index.js)"
                      className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
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
                    placeholder="Add new file"
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
                    <span className="text-sm">File created successfully!</span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-2 pt-4">
                  <Button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Create File
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
          </div>

          {/* File Editor */}
          <div className="lg:col-span-2">
            <Card className="border-blue-200/50 bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-blue-900 flex items-center">
                    <Code className="h-5 w-5 mr-2" />
                    File Content
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
                    ? "Preview your file content"
                    : "Write your file content"}
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
                    placeholder="Enter your file content here..."
                    className="min-h-96 max-h-96 font-mono text-sm border-blue-200 focus:border-blue-400 focus:ring-blue-400 resize-none"
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* File Path Info */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200/50">
          <div className="flex items-center space-x-2 text-sm text-blue-700">
            <Folder className="h-4 w-4" />
            <span>
              File will be created at:{" "}
              <code className="bg-blue-100 px-2 py-1 rounded">
                {currentPath
                  ? `${currentPath}/${fileName || "filename"}`
                  : fileName || "filename"}
              </code>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
