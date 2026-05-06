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
import { getFileIcon } from "@/libs/etc";

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

interface FileExtension {
  id: number;
  name: string;
}

interface CreateProjectPageViewProps {
  branch: string;
  sidebarOpen: boolean;
  selectedStructureItem: string;
  fileName: string;
  fileContent: string;
  commitMessage: string;
  isSaving: boolean;
  selectExtension: string;
  fileStructure: FileStructureItem[];
  fileExtensionData: FileExtension[];
  breadcrumbItems: BreadcrumbItemType[];
  isCreateDisabled: boolean;
  onStructureItemSelect: (name: string) => void;
  onFileNameChange: (value: string) => void;
  onFileContentChange: (value: string) => void;
  onCommitMessageChange: (value: string) => void;
  onExtensionChange: (value: string) => void;
  onToggleSidebar: () => void;
  onBack: () => void;
  onCreateFile: () => void;
}

export default function CreateProjectPageView({
  branch,
  sidebarOpen,
  selectedStructureItem,
  fileName,
  fileContent,
  commitMessage,
  isSaving,
  selectExtension,
  fileStructure,
  fileExtensionData,
  breadcrumbItems,
  isCreateDisabled,
  onStructureItemSelect,
  onFileNameChange,
  onFileContentChange,
  onCommitMessageChange,
  onExtensionChange,
  onToggleSidebar,
  onBack,
  onCreateFile,
}: CreateProjectPageViewProps) {
  return (
    <div className="bg-transparent h-[calc(100vh-4rem)]">
      <div className="flex h-full">
        {/* Left Sidebar - File Structure */}
        {sidebarOpen && (
          <div className="w-60 border-r border-blue-200/50 bg-white/70 backdrop-blur-sm dark:border-gray-600/50 dark:bg-gray-800/70 flex flex-col">
            <div className="border-b border-blue-100 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:border-gray-700 dark:from-gray-700/50 dark:to-gray-600/50 flex-shrink-0">
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

              {/* Editor/Preview Content */}
              <div className="border border-blue-200/50 rounded-xl shadow-lg bg-white/70 backdrop-blur-sm dark:border-gray-600/50 dark:bg-gray-800/70 mb-6">
                <div className="flex items-center justify-between p-4 border-b border-blue-100 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:border-gray-700 dark:from-gray-700/50 dark:to-gray-600/50">
                  <div className="flex align-items flex-1 space-x-1 gap-2">
                    <Label
                      htmlFor="fileName"
                      className="text-sm font-medium text-blue-900 dark:text-blue-400 mb-2 block"
                    />
                    <Input
                      id="fileName"
                      value={fileName}
                      onChange={(e) => onFileNameChange(e.target.value)}
                      className="font-mono"
                      placeholder="Enter file name..."
                    />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-[auto] border-blue-200 hover:border-blue-300 hover:bg-blue-50 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-700"
                        >
                          {selectExtension}
                          <ChevronDown className="h-4 w-4 ml-2" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {fileExtensionData?.map((extension, index) => (
                          <DropdownMenuItem
                            key={index}
                            onClick={() => onExtensionChange(extension.name)}
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
                    onChange={(e) => onFileContentChange(e.target.value)}
                    className="p-4 min-h-[400px] font-mono text-sm resize-none border-0 focus-visible:outline-0 outline-none"
                    placeholder="Enter file content..."
                  />
                </div>
              </div>

              {/* Commit Section */}
              <div className="border border-blue-200/50 rounded-xl shadow-lg bg-white/70 backdrop-blur-sm dark:border-gray-600/50 dark:bg-gray-800/70">
                <div className="p-4 border-b border-blue-100 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:border-gray-700 dark:from-gray-700/50 dark:to-gray-600/50">
                  <h2 className="font-medium text-blue-900 dark:text-blue-400 flex items-center">
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
                      onChange={(e) => onCommitMessageChange(e.target.value)}
                      placeholder="Create new file"
                      className="font-mono"
                    />
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" onClick={onBack} disabled={isSaving}>
                      Cancel
                    </Button>
                    <Button
                      onClick={onCreateFile}
                      disabled={isCreateDisabled}
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
  );
}
