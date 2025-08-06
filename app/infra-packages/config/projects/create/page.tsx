"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  GitBranch,
  Folder,
  Menu,
  GitCommit,
  ChevronDown,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useCreateUploadFile } from "@/hooks/use-config-data";
import { getFileIcon } from "@/lib/etc";

type fileExtensionProp = {
  id: number;
  name: string;
};

const fileExtensionData: fileExtensionProp[] = [
  { id: 1, name: "yml" },
  { id: 2, name: "yaml" },
  { id: 3, name: "md" },
  { id: 4, name: "properties" },
];

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

export default function CreateFilePage() {
  const searchParams = useSearchParams();
  const branch = searchParams.get("branch") || "main";
  const dir = searchParams.get("dir") || "";

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedStructureItem, setSelectedStructureItem] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileContent, setFileContent] = useState("");
  const [commitMessage, setCommitMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [selectExtension, setSelectExtension] = useState("yml");

  const detailFilePath = dir
    ? `${dir}/${fileName}.${selectExtension}`
    : `${fileName}.${selectExtension}`;

  const { mutate: createUploadFileMutate } = useCreateUploadFile(
    "admin",
    "configs_repo",
    "main",
    detailFilePath, //새로운 파일 이름
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
    if (dir) params.set("dir", dir);
    window.location.href = `/infra-packages/config/projects?${params.toString()}`;
  };

  const currentUrl = new URL(window.location.href);
  const pathname = currentUrl.pathname;

  // 1. 경로에서 "/view" 제거
  const newPath = pathname.replace(/\/create$/, "");

  // 2. 쿼리스트링에서 "file" 제거
  const params = currentUrl.searchParams;
  params.delete("file");

  // 3. 최종 URL 생성
  const newUrl = `${newPath}${
    params.toString() ? `?${params.toString()}` : ""
  }`;



  // 동적으로 breadcrumb 생성
  const generateBreadcrumbItems = () => {
    const items = [
      {
        name: "config",
        href: `/infra-packages/config/projects?branch=${branch}`,
      }
    ];

    const lastItem = {
      name: "Create new file",
      href: "",
    };

    // 디렉토리가 있는 경우
    if (dir) {
      items.push({
        name: dir,
        href: `/infra-packages/config/projects?branch=${branch}&dir=${dir}`,
      });
    }


    return [...items, lastItem];
  };

  const breadcrumbItems = generateBreadcrumbItems();
  return (
    <AppLayout projectSlug="config">
      <div className="bg-transparent h-[calc(100vh-4rem)]">
        <div className="flex h-full">
          {/* Left Sidebar - File Structure */}
          {sidebarOpen && (
            <div className="w-60 border-r border-blue-200/50 bg-white/70 backdrop-blur-sm flex flex-col">
              <div className=" border-b border-blue-100 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 flex-shrink-0">
                <h3 className="font-semibold text-blue-900 flex items-center">
                  <Folder className="h-4 w-4 mr-2" />
                  File Structure
                </h3>
             
              </div>
              <div className="flex-1 overflow-y-auto">
                <div className="p-4 space-y-1">
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
                        getFileIcon(item?.extension || "")
                      )}
                      <span className="text-sm">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto">
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

                {/* Editor/Preview Content */}
                <div className="border border-blue-200/50 rounded-xl shadow-lg bg-white/70 backdrop-blur-sm mb-6">
                  <div className="flex items-center justify-between p-4 border-b border-blue-100 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
                    <div className="flex align-items flex-1 space-x-1 gap-2">
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
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-[auto] border-blue-200 hover:border-blue-300 hover:bg-blue-50"
                          >
                            {/* <GitBranch className="h-4 w-4 mr-2 text-blue-500" /> */}
                            {selectExtension}
                            <ChevronDown className="h-4 w-4 ml-2" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {fileExtensionData?.map((extension, index) => (
                            <DropdownMenuItem
                              key={index}
                              onClick={() => setSelectExtension(extension.name)}
                            >
                              {extension.name}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <div className="p-6">
                    <Textarea
                      value={fileContent}
                      onChange={(e) => setFileContent(e.target.value)}
                      className="p-4 min-h-[400px] font-mono text-sm resize-none border-0 focus-visible: outline-0 outline-none"
                      placeholder="Enter file content..."
                    />
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
