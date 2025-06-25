"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
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
  GitCommit,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useCreateUploadFile } from "@/hooks/use-config-data";

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

// 샘플 파일 구조
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

// 파일 템플릿
const fileTemplates = [
  { name: "Empty file", extension: "", content: "" },
  {
    name: "README.md",
    extension: "md",
    content: "# Project Title\n\nDescription of your project.",
  },
  {
    name: "package.json",
    extension: "json",
    content: '{\n  "name": "my-project",\n  "version": "1.0.0"\n}',
  },
  {
    name: "index.js",
    extension: "js",
    content: "console.log('Hello, World!');",
  },
  {
    name: "style.css",
    extension: "css",
    content: "/* Add your styles here */",
  },
];

export default function CreateFilePage() {
  const searchParams = useSearchParams();
  const branch = searchParams.get("branch") || "main";
  const path = searchParams.get("path") || "";

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedStructureItem, setSelectedStructureItem] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileContent, setFileContent] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [commitMessage, setCommitMessage] = useState("");
  const [commitDescription, setCommitDescription] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fileExtension = fileName.split(".").pop();

  const { mutate: createUploadFileMutate } = useCreateUploadFile(
    "admin",
    "configs_repo",
    "main",
    fileName,
    commitMessage
  );

  const createFile = () => {
    if (fileContent.length > 0) {
      const formData = new FormData();
      formData.append("file", "");
      formData.append("content", fileContent); // 필요 시 텍스트 추가

      createUploadFileMutate({ formData });
    }
  };

  const handleBack = () => {
    const params = new URLSearchParams();
    params.set("branch", branch);
    if (path) params.set("path", path);
    window.location.href = `/infra-packages/config/projects?${params.toString()}`;
  };

  const handleTemplateChange = (templateName: string) => {
    const template = fileTemplates.find((t) => t.name === templateName);
    if (template) {
      setSelectedTemplate(templateName);
      setFileName(template.name);
      setFileContent(template.content);
    }
  };

  const handleSave = async () => {
    if (!fileName.trim()) {
      alert("Please enter a file name");
      return;
    }
    if (!commitMessage.trim()) {
      alert("Please enter a commit message");
      return;
    }

    setIsSaving(true);
    try {
      // 실제 저장 로직 구현
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 시뮬레이션
      alert("File created successfully!");
      handleBack();
    } catch (error) {
      alert("Failed to create file");
    } finally {
      setIsSaving(false);
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
    { name: "config", href: `/infra-packages/config/projects` },
    { name: "Create new file", href: "" },
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

                {/* Template Selection */}
                {/* <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200/50">
                  <Label
                    htmlFor="template"
                    className="text-sm font-medium text-blue-900 mb-2 block"
                  >
                    Choose a file template
                  </Label>
                  <Select
                    value={selectedTemplate}
                    onValueChange={handleTemplateChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a template" />
                    </SelectTrigger>
                    <SelectContent>
                      {fileTemplates.map((template) => (
                        <SelectItem key={template.name} value={template.name}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div> */}

                {/* Editor/Preview Content */}
                <div className="border border-blue-200/50 rounded-xl shadow-lg bg-white/70 backdrop-blur-sm mb-6">
                  <div className="flex items-center justify-between p-4 border-b border-blue-100 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
                    <div className="flex align-items flex-1">
                      <Label
                        htmlFor="fileName"
                        className="text-sm font-medium text-blue-900 mb-2 block"
                      ></Label>
                      <Input
                        id="fileName"
                        value={fileName}
                        onChange={(e) => setFileName(e.target.value)}
                        className="font-mono"
                        placeholder="Enter file name..."
                      />
                    </div>
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
                    </div>
                  </div>
                  <div className="p-6">
                    {isPreview ? (
                      renderPreview()
                    ) : (
                      <Textarea
                        value={fileContent}
                        onChange={(e) => setFileContent(e.target.value)}
                        className="py-2 px-3 min-h-[400px] font-mono text-sm resize-none border-0 focus-visible:ring-0 p-0"
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
                      Commit New File
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
                        placeholder="Create new file"
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
                        placeholder="Add more details about your new file..."
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
                      <Button
                        onClick={createFile}
                        disabled={
                          !fileName.trim() || !commitMessage.trim() || isSaving
                        }
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        {isSaving ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                            Creating...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Create File
                          </>
                        )}
                      </Button>
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
