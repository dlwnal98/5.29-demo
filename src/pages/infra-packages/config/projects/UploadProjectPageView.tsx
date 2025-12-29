import type React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Upload,
  X,
  GitBranch,
  Folder,
  Menu,
  GitCommit,
} from "lucide-react";
import { getFileIcon } from "@/lib/etc";

interface BreadcrumbItemType {
  name: string;
  href: string;
}

interface FileStructureItem {
  name: string;
  type: "folder" | "file";
  level: number;
  extension?: string;
}

interface UploadProjectPageViewProps {
  branch: string;
  sidebarOpen: boolean;
  selectedStructureItem: string;
  uploadedFiles: File[];
  commitMessage: string;
  isUploading: boolean;
  isDragOver: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  fileStructure: FileStructureItem[];
  breadcrumbItems: BreadcrumbItemType[];
  isUploadDisabled: boolean;
  onStructureItemSelect: (name: string) => void;
  onCommitMessageChange: (value: string) => void;
  onToggleSidebar: () => void;
  onBack: () => void;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDrop: (event: React.DragEvent) => void;
  onDragOver: (event: React.DragEvent) => void;
  onDragLeave: (event: React.DragEvent) => void;
  onRemoveFile: (index: number) => void;
  onTriggerFileInput: () => void;
  formatFileSize: (bytes: number) => string;
  onUploadFile: () => void;
}

export default function UploadProjectPageView({
  branch,
  sidebarOpen,
  selectedStructureItem,
  uploadedFiles,
  commitMessage,
  isUploading,
  isDragOver,
  fileInputRef,
  fileStructure,
  breadcrumbItems,
  isUploadDisabled,
  onStructureItemSelect,
  onCommitMessageChange,
  onToggleSidebar,
  onBack,
  onFileSelect,
  onDrop,
  onDragOver,
  onDragLeave,
  onRemoveFile,
  onTriggerFileInput,
  formatFileSize,
  onUploadFile,
}: UploadProjectPageViewProps) {
  return (
    <div className="bg-transparent">
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Left Sidebar - File Structure */}
        {sidebarOpen && (
          <div className="w-60 border-r border-blue-200/50 bg-white/70 backdrop-blur-sm">
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
                    onClick={() => onStructureItemSelect(item.name)}
                  >
                    {item.type === "folder" ? (
                      <Folder className="h-4 w-4 text-blue-500" />
                    ) : (
                      getFileIcon(item?.extension ?? "")
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
                    onClick={onToggleSidebar}
                    className="border-blue-200 hover:bg-blue-50"
                  >
                    <Menu className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={onBack}
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
                  <Badge variant="outline" className="border-blue-200 text-blue-700">
                    <GitBranch className="h-3 w-3 mr-1" />
                    {branch}
                  </Badge>
                </div>
              </div>

              {/* Upload Area */}
              <div className="border border-blue-200/50 rounded-xl shadow-lg bg-white/70 backdrop-blur-sm mb-6">
                <div className="p-5">
                  {/* Drag & Drop Area */}
                  {uploadedFiles.length === 0 && (
                    <div
                      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                        isDragOver
                          ? "border-blue-400 bg-blue-50"
                          : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                      }`}
                      onDrop={onDrop}
                      onDragOver={onDragOver}
                      onDragLeave={onDragLeave}
                    >
                      <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-lg font-medium text-gray-700 mb-2">
                        Drag and drop files here
                      </p>
                      <p className="text-sm text-gray-500 mb-4">
                        or click to select files
                      </p>
                      <Button
                        onClick={onTriggerFileInput}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Choose Files
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        onChange={onFileSelect}
                        className="hidden"
                      />
                    </div>
                  )}

                  {/* Uploaded Files List */}
                  {uploadedFiles.length > 0 && (
                    <div>
                      <div className="space-y-2">
                        {uploadedFiles.map((file, index) => {
                          const extension = file.name.split(".").pop();
                          return (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                              <div className="flex items-center space-x-3">
                                {getFileIcon(extension ?? "")}
                                <div>
                                  <p className="font-medium text-sm">{file.name}</p>
                                  <p className="text-xs text-gray-500">
                                    {formatFileSize(file.size)}
                                  </p>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onRemoveFile(index)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Commit Section */}
              <div className="border border-blue-200/50 rounded-xl shadow-lg bg-white/70 backdrop-blur-sm">
                <div className="p-4 border-b border-blue-100 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
                  <h2 className="font-medium text-blue-900 flex items-center">
                    <GitCommit className="h-4 w-4 mr-2" />
                    Commit Files
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
                      onChange={(e) => onCommitMessageChange(e.target.value)}
                      placeholder="Upload files"
                      className="font-mono"
                    />
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" onClick={onBack} disabled={isUploading}>
                      Cancel
                    </Button>
                    <Button
                      onClick={onUploadFile}
                      disabled={isUploadDisabled}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      {isUploading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Files
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
  );
}
