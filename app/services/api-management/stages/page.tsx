"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

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
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  ArrowLeft,
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  Edit,
  Copy,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ApiResource {
  id: string;
  path: string;
  name: string;
  children?: ApiResource[];
  methods: string[];
}

interface Stage {
  id: string;
  name: string;
  description: string;
  cacheEnabled: boolean;
  throttleRate: number;
  burstRate: number;
  url: string;
  lastDeployed: string;
  deploymentId: string;
}

interface DeploymentRecord {
  id: string;
  date: string;
  status: "active" | "inactive" | "failed";
  description: string;
  deploymentId: string;
}

interface SelectedMethod {
  resourceId: string;
  resourcePath: string;
  method: string;
  url: string;
}

export default function StagesPage() {
  const router = useRouter();

  const mockDeployments: DeploymentRecord[] = [
    {
      id: "1",
      date: "July 03, 2025, 08:26 (UTC+09:00)",
      status: "inactive",
      description: "-",
      deploymentId: "eemowu",
    },
    {
      id: "2",
      date: "July 03, 2025, 08:26 (UTC+09:00)",
      status: "inactive",
      description: "-",
      deploymentId: "jje6x",
    },
    {
      id: "3",
      date: "July 02, 2025, 17:44 (UTC+09:00)",
      status: "active",
      description: "활성",
      deploymentId: "xf40pg",
    },
    {
      id: "4",
      date: "July 02, 2025, 17:42 (UTC+09:00)",
      status: "inactive",
      description: "-",
      deploymentId: "ussiri",
    },
  ];

  const [apiResources] = useState<ApiResource[]>([
    {
      id: "hello",
      path: "/",
      name: "hello",
      children: [
        {
          id: "root",
          path: "/",
          name: "/",
          children: [
            {
              id: "rnd",
              path: "/rnd",
              name: "/rnd",
              methods: ["GET"],
            },
          ],
          methods: [],
        },
      ],
      methods: [],
    },
    {
      id: "nexfron",
      path: "/nexfron",
      name: "nexfron",
      methods: [],
    },
  ]);

  const [selectedStage, setSelectedStage] = useState<Stage>({
    id: "hello",
    name: "hello",
    description: "",
    cacheEnabled: false,
    throttleRate: 10000,
    burstRate: 5000,
    url: "https://ynr5g5hoch.execute-api.ap-northeast-2.amazonaws.com/hello",
    lastDeployed: "July 02, 2025, 17:44 (UTC+09:00)",
    deploymentId: "xf40bg",
  });

  const [selectedMethod, setSelectedMethod] = useState<SelectedMethod | null>(
    null
  );

  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(
    new Set(["/", "hello"])
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateStageModalOpen, setIsCreateStageModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("variables");

  const [editForm, setEditForm] = useState({
    name: selectedStage.name,
    description: selectedStage.description,
    apiCacheEnabled: false,
    methodLevelCacheEnabled: false,
    throttlingEnabled: false,
    wafProfile: "없음",
    clientCertificate: "없음",
  });

  const [createStageForm, setCreateStageForm] = useState({
    name: "",
    description: "",
  });

  const toggleExpanded = (path: string) => {
    const newExpanded = new Set(expandedPaths);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedPaths(newExpanded);
  };

  const handleBack = () => {
    router.push("/services/api-management");
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(selectedStage.url);
    toast.success("URL이 클립보드에 복사되었습니다.");
  };

  const handleCopyMethodUrl = () => {
    if (selectedMethod) {
      navigator.clipboard.writeText(selectedMethod.url);
      toast.success("메서드 URL이 클립보드에 복사되었습니다.");
    }
  };

  const handleEditSave = () => {
    setSelectedStage({
      ...selectedStage,
      name: editForm.name,
      description: editForm.description,
    });
    setIsEditModalOpen(false);
    toast.success("스테이지가 성공적으로 업데이트되었습니다.");
  };

  const handleCreateStage = () => {
    if (!createStageForm.name.trim()) {
      toast.error("스테이지 이름을 입력해주세요.");
      return;
    }

    toast.success(`스테이지 '${createStageForm.name}'이(가) 생성되었습니다.`);
    setIsCreateStageModalOpen(false);
    setCreateStageForm({ name: "", description: "" });
  };

  const handleMethodClick = (
    resourceId: string,
    resourcePath: string,
    method: string
  ) => {
    const methodUrl = `${selectedStage.url}${resourcePath}`;
    setSelectedMethod({
      resourceId,
      resourcePath,
      method,
      url: methodUrl,
    });
  };

  const getDeploymentStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "inactive":
        return "bg-gray-100 text-gray-700";
      case "failed":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };
  const [deploymentSearchTerm, setDeploymentSearchTerm] = useState("");

  const filteredDeployments = mockDeployments.filter(
    (deployment) =>
      deployment.deploymentId
        .toLowerCase()
        .includes(deploymentSearchTerm.toLowerCase()) ||
      deployment.description
        .toLowerCase()
        .includes(deploymentSearchTerm.toLowerCase())
  );

  const renderResourceTree = (resource: ApiResource, level = 0) => {
    const isExpanded = expandedPaths.has(resource.id);
    const hasChildren = resource.children && resource.children.length > 0;

    return (
      <div key={resource.id}>
        <div
          className={`flex items-center gap-2 py-1 px-2 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded text-sm ${
            selectedStage.id === resource.id
              ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
              : ""
          }`}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={() => {
            if (resource.id === "hello" || resource.id === "nexfron") {
              setSelectedStage({
                ...selectedStage,
                id: resource.id,
                name: resource.name,
              });
              setSelectedMethod(null); // 스테이지 변경 시 선택된 메서드 초기화
            }
          }}
        >
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleExpanded(resource.id);
              }}
            >
              {isExpanded ? (
                <ChevronDown className="h-3 w-3 text-gray-500" />
              ) : (
                <ChevronRight className="h-3 w-3 text-gray-500" />
              )}
            </button>
          )}
          {!hasChildren && <div className="w-3" />}

          {hasChildren ? (
            isExpanded ? (
              <FolderOpen className="h-3 w-3 text-blue-500" />
            ) : (
              <Folder className="h-3 w-3 text-blue-500" />
            )
          ) : (
            <div className="w-3 h-3 bg-blue-100 rounded border border-blue-300 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
            </div>
          )}

          <span className="font-medium text-blue-600">{resource.name}</span>
        </div>

        {hasChildren &&
          isExpanded &&
          resource.children?.map((child) => (
            <div key={child.id}>
              {renderResourceTree(child, level + 1)}
              {child.methods.map((method, index) => (
                <div
                  key={`${child.id}-${method}-${index}`}
                  className={`flex items-center gap-2 py-1 px-2 text-xs cursor-pointer hover:bg-green-50 dark:hover:bg-green-900/20 rounded ${
                    selectedMethod?.resourceId === child.id &&
                    selectedMethod?.method === method
                      ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                  style={{ paddingLeft: `${(level + 2) * 16 + 8}px` }}
                  onClick={() =>
                    handleMethodClick(child.id, child.path, method)
                  }
                >
                  <div className="w-3" />
                  <div className="w-3 h-3 bg-green-100 rounded border border-green-300 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  </div>
                  <span className="font-mono text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded">
                    {method}
                  </span>
                </div>
              ))}
            </div>
          ))}
      </div>
    );
  };

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
              <BreadcrumbPage>스테이지</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              스테이지
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Button
              className="bg-orange-500 hover:bg-orange-600 text-white"
              onClick={() => setIsCreateStageModalOpen(true)}
            >
              스테이지 생성
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar - Resource Tree */}
          <div className="col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 h-full">
              <div className="space-y-1">
                {apiResources.map((resource) => renderResourceTree(resource))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-9">
            <div className="space-y-6">
              {/* Stage Details */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="border-b border-gray-200 dark:border-gray-700 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        스테이지 세부 정보
                      </h2>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditModalOpen(true)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      편집
                    </Button>
                  </div>
                </div>

                <div className="p-4">
                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            스테이지 이름
                          </Label>
                          <div className="mt-1 text-blue-600 font-medium">
                            {selectedStage.name}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        URL 호출
                      </Label>
                      <div className="mt-1 flex items-center gap-2">
                        <button
                          onClick={handleCopyUrl}
                          className="text-blue-600 hover:text-blue-700 text-sm font-mono flex items-center gap-1"
                        >
                          {selectedStage.url}
                          <Copy className="h-3 w-3" />
                        </button>
                      </div>
                    </div>

                    {/* Selected Method URL */}
                    {selectedMethod && (
                      <div>
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          선택된 메서드 URL ({selectedMethod.method})
                        </Label>
                        <div className="mt-1 flex items-center gap-2">
                          <button
                            onClick={handleCopyMethodUrl}
                            className="text-green-600 hover:text-green-700 text-sm font-mono flex items-center gap-1 bg-green-50 px-2 py-1 rounded border border-green-200"
                          >
                            {selectedMethod.url}
                            <Copy className="h-3 w-3" />
                          </button>
                        </div>
                        <div className="mt-1 text-xs text-gray-500">
                          리소스 경로: {selectedMethod.resourcePath}
                        </div>
                      </div>
                    )}

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            배포 ({mockDeployments.length})
                          </Label>
                        </div>
                      </div>

                      <div className="border rounded-lg overflow-hidden">
                        <div className="bg-gray-50 px-4 py-2 border-b">
                          <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-600">
                            <div className="col-span-3">배포 날짜</div>
                            <div className="col-span-2">상태</div>
                            <div className="col-span-3">설명</div>
                            <div className="col-span-3">배포 ID</div>
                          </div>
                        </div>

                        <div className="divide-y">
                          {filteredDeployments.map((deployment) => (
                            <div
                              key={deployment.id}
                              className="px-4 py-3 hover:bg-gray-50"
                            >
                              <div className="grid grid-cols-12 gap-4 items-center">
                                <div className="col-span-3 text-sm text-gray-900">
                                  {deployment.date}
                                </div>
                                <div className="col-span-2">
                                  {deployment.status === "active" ? (
                                    <Badge
                                      className={`text-xs ${getDeploymentStatusColor(
                                        deployment.status
                                      )}`}
                                    >
                                      활성
                                    </Badge>
                                  ) : (
                                    <span className="text-sm text-gray-500">
                                      -
                                    </span>
                                  )}
                                </div>
                                <div className="col-span-3 text-sm text-gray-900">
                                  {deployment.description}
                                </div>
                                <div className="col-span-3 text-sm text-gray-900">
                                  {deployment.deploymentId}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <ChevronRight className="h-4 w-4 rotate-180" />
                          </button>
                          <span className="font-medium text-gray-900">1</span>
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Stage Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
                스테이지 편집
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Stage Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  스테이지 세부 정보
                </h3>
                <div>
                  <Label
                    htmlFor="stage-name"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    스테이지 이름
                  </Label>
                  <Input
                    id="stage-name"
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="stage-description"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    스테이지 설명 -{" "}
                    <span className="text-gray-500">선택 사항</span>
                  </Label>
                  <Textarea
                    id="stage-description"
                    value={editForm.description}
                    onChange={(e) =>
                      setEditForm({ ...editForm, description: e.target.value })
                    }
                    className="mt-1 min-h-[100px]"
                  />
                </div>
              </div>

             

             

            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
              >
                취소
              </Button>
              <Button
                onClick={handleEditSave}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                저장
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Create Stage Modal */}
        <Dialog
          open={isCreateStageModalOpen}
          onOpenChange={setIsCreateStageModalOpen}
        >
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
                스테이지 생성
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div>
                <Label
                  htmlFor="create-stage-name"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  스테이지 이름 *
                </Label>
                <Input
                  id="create-stage-name"
                  value={createStageForm.name}
                  onChange={(e) =>
                    setCreateStageForm({
                      ...createStageForm,
                      name: e.target.value,
                    })
                  }
                  placeholder="스테이지 이름을 입력하세요"
                  className="mt-1"
                />
              </div>
              <div>
                <Label
                  htmlFor="create-stage-description"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  스테이지 설명
                </Label>
                <Textarea
                  id="create-stage-description"
                  value={createStageForm.description}
                  onChange={(e) =>
                    setCreateStageForm({
                      ...createStageForm,
                      description: e.target.value,
                    })
                  }
                  placeholder="스테이지 설명을 입력하세요 (선택사항)"
                  className="mt-1"
                />
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreateStageModalOpen(false);
                  setCreateStageForm({ name: "", description: "" });
                }}
              >
                취소
              </Button>
              <Button
                onClick={handleCreateStage}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                생성
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
