import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Edit,
  Trash2,
  GitBranch,
  Folder,
  File,
  Menu,
  History,
  Eye,
} from "lucide-react";
import { getFileIcon } from "@/lib/etc";
import MarkdownViewer from "@/pages/infra-packages/config/projects/components/markdown-viewer";
import { Skeleton } from "@/components/ui/skeleton";

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

interface FileDetailData {
  path?: string;
  textContent?: string;
  sha?: string;
}

interface ViewProjectPageViewProps {
  branch: string;
  fileName: string;
  fileDetailData: FileDetailData | undefined;
  isFileDetailLoading: boolean;
  fileExtension: string | undefined;
  sidebarOpen: boolean;
  selectedStructureItem: string;
  fileStructure: FileStructureItem[];
  breadcrumbItems: BreadcrumbItemType[];
  onStructureItemSelect: (name: string) => void;
  onToggleSidebar: () => void;
  onBack: () => void;
  onEdit: () => void;
  onCommitHistory: () => void;
  onDelete: () => void;
}

function ContentSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 15 }).map((_, index) => (
        <div key={index} className="flex items-center space-x-2">
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-4 flex-1" />
        </div>
      ))}
    </div>
  );
}

function renderFileContent(
  fileDetailData: FileDetailData | undefined,
  fileExtension: string | undefined
) {
  if (!fileDetailData) return null;

  switch (fileExtension) {
    case "md":
      return <MarkdownViewer content={fileDetailData.textContent || ""} />;
    case "json":
      return (
        <pre className="language-json p-4 rounded-lg overflow-auto text-sm font-mono">
          {fileDetailData.textContent}
        </pre>
      );
    case "js":
    case "ts":
    case "tsx":
    case "jsx":
    case "yaml":
    case "yml":
    case "properties":
      return (
        <pre className="language-javascript p-4 rounded-lg overflow-auto text-sm font-mono">
          {fileDetailData.textContent}
        </pre>
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
}

export default function ViewProjectPageView({
  branch,
  fileName,
  fileDetailData,
  isFileDetailLoading,
  fileExtension,
  sidebarOpen,
  selectedStructureItem,
  fileStructure,
  breadcrumbItems,
  onStructureItemSelect,
  onToggleSidebar,
  onBack,
  onEdit,
  onCommitHistory,
  onDelete,
}: ViewProjectPageViewProps) {
  return (
    <div className="bg-transparent h-[calc(100vh-4rem)]">
      <div className="flex h-full">
        {/* Left Sidebar - File Structure */}
        {sidebarOpen && (
          <div className="w-60 border-r border-blue-200/50 bg-white/70 backdrop-blur-sm dark:border-gray-600/50 dark:bg-gray-800/70">
            <div className="p-4 border-b border-blue-100 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:border-gray-700 dark:from-gray-700/50 dark:to-gray-600/50">
              <h3 className="font-semibold text-blue-900 dark:text-blue-400 flex items-center">
                <Folder className="h-4 w-4 mr-2" />
                File Structure
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 space-y-1">
                {fileStructure.map((item, index) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-2 p-2 rounded cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-700 ${selectedStructureItem === item.name ? "bg-blue-100 dark:bg-gray-700" : ""
                      }`}
                    style={{ paddingLeft: `${item.level * 16 + 8}px` }}
                    onClick={() => onStructureItemSelect(item.name)}
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
                    onClick={onToggleSidebar}
                    className="border-blue-200 hover:bg-blue-50 dark:border-gray-600 dark:hover:bg-gray-700"
                  >
                    <Menu className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={onBack}
                    className="border-blue-200 hover:bg-blue-50 dark:border-gray-600 dark:hover:bg-gray-700"
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
                  <Badge variant="outline" className="border-blue-200 text-blue-700 dark:border-gray-700 dark:text-blue-500">
                    <GitBranch className="h-3 w-3 mr-1" />
                    {branch}
                  </Badge>
                </div>
              </div>

              {/* File Content */}
              <div className="border border-blue-200/50 rounded-xl shadow-lg bg-white/70 backdrop-blur-sm dark:border-gray-600/50 dark:bg-gray-800/70">
                <div className="flex items-center justify-between p-4 border-b border-blue-100 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:border-gray-700 dark:from-gray-700/50 dark:to-gray-600/50">
                  {isFileDetailLoading ? (
                    <>
                      <div className="flex items-center">
                        <Skeleton className="h-5 w-5 mr-2" />
                        <Skeleton className="h-6 w-32" />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                      </div>
                    </>
                  ) : (
                    <>
                      <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-400 flex items-center">
                        <Eye className="h-5 w-5 mr-2" />
                        {fileName}
                      </h2>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={onCommitHistory}
                          className="border-blue-200 hover:bg-blue-50 dark:border-gray-600 dark:hover:bg-gray-700"
                        >
                          <History className="h-4 w-4" />
                        </Button>

                        <Button
                          onClick={onEdit}
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          title="edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={onDelete}
                          title="delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
                <div className="p-6">
                  {isFileDetailLoading ? (
                    <ContentSkeleton />
                  ) : (
                    renderFileContent(fileDetailData, fileExtension)
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
