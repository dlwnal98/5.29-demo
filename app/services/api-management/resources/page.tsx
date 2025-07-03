"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  Trash2,
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  CheckCircle,
  XCircle,
  Shield,
  AlertTriangle,
  X,
  ExternalLink,
  Rocket,
} from "lucide-react";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";

interface Resource {
  id: string;
  path: string;
  name: string;
  corsEnabled: boolean;
  children?: Resource[];
  methods: Method[];
}

interface Method {
  id: string;
  type: string;
  permissions: string;
  apiKey: string;
}

interface Stage {
  id: string;
  name: string;
  description: string;
}

export default function ApiResourcesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const apiId = searchParams.get("apiId");
  const apiName = searchParams.get("apiName");

  const [resources, setResources] = useState<Resource[]>([
    {
      id: "root",
      path: "/",
      name: "Root",
      corsEnabled: true,
      methods: [],
      children: [
        {
          id: "rmd",
          path: "/rmd",
          name: "RMD Resource",
          corsEnabled: false,
          methods: [
            {
              id: "get-rmd",
              type: "GET",
              permissions: "읽기",
              apiKey: "required",
            },
          ],
        },
      ],
    },
  ]);

  const [stages] = useState<Stage[]>([
    { id: "hello", name: "hello", description: "Hello stage for testing" },
    { id: "nexfron", name: "nexfron", description: "Nexfron production stage" },
    { id: "new", name: "*새 스테이지*", description: "Create a new stage" },
    { id: "none", name: "스테이지 없음", description: "Deploy without stage" },
  ]);

  const [selectedResource, setSelectedResource] = useState<Resource>(
    resources[0]
  );
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(
    new Set(["/", "/rmd"])
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [createResourceForm, setCreateResourceForm] = useState({
    path: "",
    name: "",
    corsEnabled: false,
  });
  const [deployForm, setDeployForm] = useState({
    stage: "",
    description: "",
  });

  const handleBack = () => {
    router.push("/services/api-management");
  };

  const toggleExpanded = (path: string) => {
    const newExpanded = new Set(expandedPaths);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedPaths(newExpanded);
  };

  const handleCreateResource = () => {
    if (!createResourceForm.path.trim() || !createResourceForm.name.trim()) {
      toast.error("리소스 경로와 이름을 입력해주세요.");
      return;
    }

    const newResource: Resource = {
      id: Date.now().toString(),
      path: createResourceForm.path,
      name: createResourceForm.name,
      corsEnabled: createResourceForm.corsEnabled,
      methods: [],
    };

    // Add to resources (simplified - in real app would handle tree structure)
    setResources([...resources, newResource]);
    setIsCreateModalOpen(false);
    setCreateResourceForm({ path: "", name: "", corsEnabled: false });
    toast.success(`리소스 '${newResource.name}'이(가) 생성되었습니다.`);
  };

  const handleDeleteResource = () => {
    if (selectedResource.id === "root") {
      toast.error("루트 리소스는 삭제할 수 없습니다.");
      return;
    }

    // Remove resource (simplified)
    setIsDeleteDialogOpen(false);
    toast.success(`리소스 '${selectedResource.name}'이(가) 삭제되었습니다.`);
  };

  const handleCreateMethod = () => {
    router.push(
      `/services/api-management/resources/methods?resourceId=${selectedResource.id}&resourcePath=${selectedResource.path}`
    );
  };

  const handleMethodClick = (method: Method, resource: Resource) => {
    router.push(`/services/api-management/resources/methods/${method.id}`);
  };

  const handleDeploy = () => {
    if (!deployForm.stage) {
      toast.error("스테이지를 선택해주세요.");
      return;
    }

    const selectedStage = stages.find((s) => s.id === deployForm.stage);

    // Simulate deployment process
    toast.success(
      `API가 '${selectedStage?.name}' 스테이지에 성공적으로 배포되었습니다.`
    );
    setIsDeployModalOpen(false);
    setDeployForm({ stage: "", description: "" });
  };

  const renderResourceTree = (resource: Resource, level = 0) => {
    const isExpanded = expandedPaths.has(resource.path);
    const hasChildren = resource.children && resource.children.length > 0;

    return (
      <div key={resource.id}>
        <div
          className={`flex items-center gap-2 py-2 px-3 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md ${
            selectedResource.id === resource.id
              ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
              : ""
          }`}
          style={{ paddingLeft: `${level * 20 + 12}px` }}
          onClick={() => setSelectedResource(resource)}
        >
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleExpanded(resource.path);
              }}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronRight className="h-4 w-4 text-gray-500" />
              )}
            </button>
          )}
          {!hasChildren && <div className="w-4" />}

          {hasChildren ? (
            isExpanded ? (
              <FolderOpen className="h-4 w-4 text-blue-500" />
            ) : (
              <Folder className="h-4 w-4 text-blue-500" />
            )
          ) : (
            <div className="w-4 h-4 bg-blue-100 rounded border border-blue-300 flex items-center justify-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
            </div>
          )}

          <span className="font-medium">{resource.path}</span>
        </div>

        {hasChildren &&
          isExpanded &&
          resource.children?.map((child) => (
            <div key={child.id}>
              {renderResourceTree(child, level + 1)}
              {child.methods.map((method) => (
                <div
                  key={method.id}
                  className="flex items-center gap-2 py-1 px-3 text-sm text-gray-600 dark:text-gray-400 cursor-pointer hover:bg-green-50 dark:hover:bg-green-900/20 rounded-md"
                  style={{ paddingLeft: `${(level + 2) * 20 + 12}px` }}
                  onClick={() => handleMethodClick(method, child)}
                >
                  <div className="w-4" />
                  <div className="w-4 h-4 bg-green-100 rounded border border-green-300 flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                  </div>
                  <span className="font-mono text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    {method.type}
                  </span>
                </div>
              ))}
            </div>
          ))}
      </div>
    );
  };

  const availableResourcePaths = [
    "/",
    "/api",
    "/users",
    "/products",
    "/orders",
  ];

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/services">Services</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/services/api-management">
                API Management
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>리소스</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              뒤로가기
            </Button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              리소스
            </h1>
          </div>
          <Button
            className="bg-orange-500 hover:bg-orange-600 text-white"
            onClick={() => setIsDeployModalOpen(true)}
          >
            <Rocket className="h-4 w-4 mr-2" />
            API 배포
          </Button>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar - Resource Tree */}
          <div className="col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  리소스 목록
                </h3>
                <Button
                  size="sm"
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 h-7"
                >
                  리소스 생성
                </Button>
              </div>
              <div className="space-y-1">
                {resources.map((resource) => renderResourceTree(resource))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-9">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              {/* Resource Details Header */}
              <div className="border-b border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    리소스 세부 정보
                  </h2>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      {selectedResource.corsEnabled ? (
                        <>
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <span className="text-sm text-green-600 font-medium">
                            CORS 활성화
                          </span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-5 w-5 text-red-500" />
                          <span className="text-sm text-red-600 font-medium">
                            CORS 비활성화
                          </span>
                        </>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsDeleteDialogOpen(true)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      리소스 삭제
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      경로
                    </Label>
                    <div className="mt-1 text-lg font-mono text-gray-900 dark:text-white">
                      {selectedResource.path}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      리소스 ID
                    </Label>
                    <div className="mt-1 text-sm font-mono text-gray-600 dark:text-gray-400">
                      jtgiezhqj1
                    </div>
                  </div>
                </div>
              </div>

              {/* Methods Section */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    메서드 ({selectedResource.methods.length})
                  </h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      삭제
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleCreateMethod}
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      메서드 생성
                    </Button>
                  </div>
                </div>

                {selectedResource.methods.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>메서드 유형</TableHead>
                        <TableHead>권한 부여</TableHead>
                        <TableHead>API 키</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedResource.methods.map((method) => (
                        <TableRow
                          key={method.id}
                          className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                          onClick={() =>
                            handleMethodClick(method, selectedResource)
                          }
                        >
                          <TableCell>
                            <span className="font-mono text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                              {method.type}
                            </span>
                          </TableCell>
                          <TableCell>{method.permissions}</TableCell>
                          <TableCell>{method.apiKey}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-12">
                    <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      메서드 없음
                    </p>
                    <p className="text-sm text-gray-500">
                      정의된 메서드가 없습니다.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Create Resource Modal */}
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-blue-600">
                Resource 생성
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Resource Path and Name - Side by Side */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="resource-path"
                    className="text-sm font-medium text-gray-700 mb-2 block"
                  >
                    리소스 경로
                  </Label>
                  <Select
                    value={createResourceForm.path}
                    onValueChange={(value) =>
                      setCreateResourceForm({
                        ...createResourceForm,
                        path: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="경로를 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableResourcePaths.map((path) => (
                        <SelectItem key={path} value={path}>
                          {path}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label
                    htmlFor="resource-name"
                    className="text-sm font-medium text-gray-700 mb-2 block"
                  >
                    리소스 이름
                  </Label>
                  <Input
                    id="resource-name"
                    placeholder="my-resource"
                    value={createResourceForm.name}
                    onChange={(e) =>
                      setCreateResourceForm({
                        ...createResourceForm,
                        name: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              {/* CORS Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <Label
                    htmlFor="cors-toggle"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    원본에서 CORS
                  </Label>
                  <p className="text-xs text-gray-500 mt-1">
                    Cross-Origin Resource Sharing을 활성화합니다
                  </p>
                </div>
                <Switch
                  id="cors-toggle"
                  checked={createResourceForm.corsEnabled}
                  onCheckedChange={(checked) =>
                    setCreateResourceForm({
                      ...createResourceForm,
                      corsEnabled: checked,
                    })
                  }
                />
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setCreateResourceForm({
                    path: "",
                    name: "",
                    corsEnabled: false,
                  });
                }}
              >
                취소
              </Button>
              <Button
                onClick={handleCreateResource}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                생성
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Deploy API Modal */}
        <Dialog open={isDeployModalOpen} onOpenChange={setIsDeployModalOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                Deploy API
              </DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsDeployModalOpen(false)}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogHeader>

            <div className="space-y-6">
              {/* Description */}
              <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                API를 배포할 스테이지를 생성하거나 선택합니다. 배포 기록을
                사용하여 스테이지의 활성 배포를 되돌리거나 변경할 수 있습니다.{" "}
                <button className="text-blue-600 hover:text-blue-700 inline-flex items-center gap-1">
                  Learn more
                  <ExternalLink className="h-3 w-3" />
                </button>
              </div>

              {/* Stage Selection */}
              <div>
                <Label
                  htmlFor="stage-select"
                  className="text-base font-semibold text-gray-900 dark:text-white mb-3 block"
                >
                  스테이지
                </Label>
                <Select
                  value={deployForm.stage}
                  onValueChange={(value) =>
                    setDeployForm({ ...deployForm, stage: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="옵션을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {stages.map((stage) => (
                      <SelectItem key={stage.id} value={stage.id}>
                        {stage.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Deploy Description */}
              <div>
                <Label
                  htmlFor="deploy-description"
                  className="text-base font-semibold text-gray-900 dark:text-white mb-3 block"
                >
                  배포 설명
                </Label>
                <Textarea
                  id="deploy-description"
                  placeholder="배포에 대한 설명을 입력하세요..."
                  value={deployForm.description}
                  onChange={(e) =>
                    setDeployForm({
                      ...deployForm,
                      description: e.target.value,
                    })
                  }
                  className="min-h-[120px] resize-none"
                />
              </div>
            </div>

            <DialogFooter className="gap-3 pt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setIsDeployModalOpen(false);
                  setDeployForm({ stage: "", description: "" });
                }}
                className="px-6"
              >
                취소
              </Button>
              <Button
                onClick={handleDeploy}
                className="bg-orange-500 hover:bg-orange-600 text-white px-8"
              >
                배포
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                리소스 삭제 확인
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-600">
                <div className="space-y-2">
                  <p className="font-semibold">
                    ⚠️ 경고: 이 작업은 되돌릴 수 없습니다!
                  </p>
                  <p>
                    리소스{" "}
                    <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                      {selectedResource.path}
                    </span>
                    을(를) 삭제하시겠습니까?
                  </p>
                  <p className="text-sm text-red-600">
                    • 이 리소스와 연결된 모든 메서드가 삭제됩니다
                    <br />• API 호출이 실패할 수 있습니다
                    <br />• 이 작업은 즉시 적용되며 복구할 수 없습니다
                  </p>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>취소</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteResource}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                삭제하기
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppLayout>
  );
}
