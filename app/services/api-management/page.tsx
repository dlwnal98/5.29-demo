"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Search,
  Settings,
  Rocket,
  Globe,
  Shield,
  Clock,
} from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";

interface ApiItem {
  id: string;
  name: string;
  description: string;
  apiId: string;
  protocol: string;
  endpointType: string;
  createdDate: string;
  selected: boolean;
}

interface ApiPlan {
  id: string;
  name: string;
  planId: string;
  description: string;
  protocol: "HTTP" | "HTTPS";
  createdAt: string;
  status: "active" | "inactive" | "draft";
}

const mockApiPlans: ApiPlan[] = [
  {
    id: "1",
    name: "User Management API",
    planId: "plan-001",
    description: "사용자 관리를 위한 REST API",
    protocol: "HTTPS",
    createdAt: "2024-01-15",
    status: "active",
  },
  {
    id: "2",
    name: "Product Catalog API",
    planId: "plan-002",
    description: "상품 카탈로그 조회 및 관리 API",
    protocol: "HTTPS",
    createdAt: "2024-01-20",
    status: "active",
  },
  {
    id: "3",
    name: "Payment Processing API",
    planId: "plan-003",
    description: "결제 처리를 위한 보안 API",
    protocol: "HTTPS",
    createdAt: "2024-01-25",
    status: "draft",
  },
  {
    id: "4",
    name: "Analytics API",
    planId: "plan-004",
    description: "데이터 분석 및 리포팅 API",
    protocol: "HTTP",
    createdAt: "2024-01-30",
    status: "inactive",
  },
];

export default function ApiManagementPage() {
  const [apiPlans, setApiPlans] = useState<ApiPlan[]>(mockApiPlans);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<ApiPlan | null>(null);
  const [deploymentData, setDeploymentData] = useState({
    stage: "",
    version: "",
    description: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof ApiItem;
    direction: "asc" | "desc";
  } | null>(null);

  // Create API Modal State
  const [createApiForm, setCreateApiForm] = useState({
    type: "new",
    name: "",
    description: "",
  });

  const filteredPlans = apiPlans.filter(
    (plan) =>
      plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.planId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSettings = (plan: ApiPlan) => {
    router.push(`/services/api-management/plans/${plan.id}/settings`);
  };

  const handleDeploy = (plan: ApiPlan) => {
    setSelectedPlan(plan);
    setDeploymentData({ stage: "", version: "", description: "" });
    setIsDeployModalOpen(true);
  };

  const handleDeploySubmit = () => {
    if (!deploymentData.stage || !deploymentData.version) {
      toast.error("필수 필드를 모두 입력해주세요.");
      return;
    }

    // 배포 로직 구현
    toast.success(
      `${selectedPlan?.name}이(가) ${deploymentData.stage} 스테이지에 성공적으로 배포되었습니다.`
    );
    setIsDeployModalOpen(false);
    setSelectedPlan(null);
    setDeploymentData({ stage: "", version: "", description: "" });
  };

  const handleDeployModalClose = () => {
    setIsDeployModalOpen(false);
    setSelectedPlan(null);
    setDeploymentData({ stage: "", version: "", description: "" });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700 border-green-200";
      case "inactive":
        return "bg-gray-100 text-gray-700 border-gray-200";
      case "draft":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getProtocolIcon = (protocol: string) => {
    return protocol === "HTTPS" ? (
      <Shield className="h-4 w-4 text-green-600" />
    ) : (
      <Globe className="h-4 w-4 text-blue-600" />
    );
  };

  const searchParams = useSearchParams();
  const router = useRouter();
  const productId = searchParams.get("productId");

  const [apis, setApis] = useState<ApiItem[]>([
    {
      id: "1",
      name: "test",
      description: "테스트용",
      apiId: "yrr5q5hoch",
      protocol: "REST",
      endpointType: "지역",
      createdDate: "2025-05-21",
      selected: false,
    },
  ]);

  const handleSort = (key: keyof ApiItem) => {
    let direction: "asc" | "desc" = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedApis = [...apis].sort((a, b) => {
    if (!sortConfig) return 0;

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (aValue < bValue) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  const filteredApis = sortedApis.filter(
    (api) =>
      api.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      api.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectAll = (checked: boolean) => {
    setApis(apis.map((api) => ({ ...api, selected: checked })));
  };

  const handleSelectApi = (id: string, checked: boolean) => {
    setApis(
      apis.map((api) => (api.id === id ? { ...api, selected: checked } : api))
    );
  };

  const handleDeleteSelected = () => {
    const selectedApis = apis.filter((api) => api.selected);
    if (selectedApis.length === 0) {
      toast.error("삭제할 API를 선택해주세요.");
      return;
    }

    setApis(apis.filter((api) => !api.selected));
    toast.success(`${selectedApis.length}개의 API가 삭제되었습니다.`);
  };

  const handleRefresh = () => {
    toast.success("API 목록이 새로고침되었습니다.");
    // Simulate refresh
    setApis([...apis]);
  };

  const handleCreateApi = () => {
    if (!createApiForm.name.trim()) {
      toast.error("API 이름을 입력해주세요.");
      return;
    }

    const newApi: ApiItem = {
      id: Date.now().toString(),
      name: createApiForm.name,
      description: createApiForm.description,
      apiId: Math.random().toString(36).substring(2, 12),
      protocol: "REST",
      endpointType: "지역",
      createdDate: new Date().toISOString().split("T")[0],
      selected: false,
    };

    setApis([...apis, newApi]);
    setIsCreateModalOpen(false);
    setCreateApiForm({ type: "new", name: "", description: "" });
    toast.success(`API '${newApi.name}'이(가) 생성되었습니다.`);
  };

  const handleApiClick = (api: ApiPlan) => {
    // Navigate to API resource creation page
    router.push(
      `/services/api-management/resources?apiId=${api.planId}&apiName=${api.name}`
    );
  };

  return (
    <AppLayout>
      <div className="space-y-6 container px-4 py-6">
        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/services">Services</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>API Management</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">API Plans</h1>
            <p className="text-gray-600 mt-1">
              API 계획을 관리하고 배포하세요.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="API Plan 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              API Plan 생성
            </Button>
          </div>
        </div>

        {/* API Plans List */}
        <Card>
          <div className="pt-6"></div>
          <CardContent>
            <Table>
              <TableHeader className="hover:bg-white">
                <TableRow className="hover:bg-white">
                  <TableHead>이름</TableHead>
                  <TableHead>Plan ID</TableHead>
                  <TableHead>설명</TableHead>
                  <TableHead>프로토콜</TableHead>
                  <TableHead>생성일</TableHead>
                  <TableHead className="text-right">작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPlans.length > 0 ? (
                  filteredPlans.map((plan) => (
                    <TableRow key={plan.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span
                            className="font-medium hover:cursor-pointer"
                            onClick={() => handleApiClick(plan)}
                          >
                            {plan.name}
                          </span>
                          <Badge
                            variant="outline"
                            className={getStatusColor(plan.status)}
                          >
                            {plan.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {plan.planId}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {plan.description}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getProtocolIcon(plan.protocol)}
                          <span>{plan.protocol}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span>{plan.createdAt}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSettings(plan)}
                          >
                            <Settings className="h-4 w-4 mr-1" />
                            설정
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleDeploy(plan)}
                            className="bg-orange-500 hover:bg-orange-600 text-white"
                          >
                            <Rocket className="h-4 w-4 mr-1" />
                            배포
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-8 text-gray-500"
                    >
                      검색 결과가 없습니다.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Deploy Modal */}
        <Dialog open={isDeployModalOpen} onOpenChange={handleDeployModalClose}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Rocket className="h-5 w-5 mr-2 text-orange-500" />
                API Plan 배포
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {selectedPlan && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-blue-900">
                    배포할 API Plan
                  </p>
                  <p className="text-sm text-blue-700">{selectedPlan.name}</p>
                  <p className="text-xs text-blue-600 font-mono">
                    {selectedPlan.planId}
                  </p>
                </div>
              )}
              <div>
                <Label htmlFor="deploy-stage" className="text-sm font-medium">
                  배포 스테이지 *
                </Label>
                <Select
                  value={deploymentData.stage}
                  onValueChange={(value) =>
                    setDeploymentData({ ...deploymentData, stage: value })
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="스테이지 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dev">Development</SelectItem>
                    <SelectItem value="staging">Staging</SelectItem>
                    <SelectItem value="prod">Production</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="deploy-version" className="text-sm font-medium">
                  버전 *
                </Label>
                <Input
                  id="deploy-version"
                  value={deploymentData.version}
                  onChange={(e) =>
                    setDeploymentData({
                      ...deploymentData,
                      version: e.target.value,
                    })
                  }
                  placeholder="v1.0.0"
                  className="mt-1"
                />
              </div>
              <div>
                <Label
                  htmlFor="deploy-description"
                  className="text-sm font-medium"
                >
                  배포 설명
                </Label>
                <Textarea
                  id="deploy-description"
                  value={deploymentData.description}
                  onChange={(e) =>
                    setDeploymentData({
                      ...deploymentData,
                      description: e.target.value,
                    })
                  }
                  placeholder="배포에 대한 설명을 입력하세요"
                  className="mt-1"
                />
              </div>
            </div>
            <DialogFooter className="flex space-x-2">
              <Button variant="outline" onClick={handleDeployModalClose}>
                취소
              </Button>
              <Button
                onClick={handleDeploySubmit}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                <Rocket className="h-4 w-4 mr-2" />
                배포
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Create API Modal */}
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-blue-600">
                API 생성
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                API는 4가지 방법으로 생성할 수 있습니다. (
                <span className="text-red-500">*</span> 필수 입력 사항입니다.)
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* API Creation Type */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">
                  API 생성 <span className="text-red-500">*</span>
                </Label>
                <RadioGroup
                  value={createApiForm.type}
                  onValueChange={(value) =>
                    setCreateApiForm({ ...createApiForm, type: value })
                  }
                  className="grid grid-cols-2 gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="new" id="new" />
                    <Label
                      htmlFor="new"
                      className="text-sm font-medium text-blue-600"
                    >
                      새로운 API
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="copy" id="copy" />
                    <Label htmlFor="copy" className="text-sm">
                      API 복사
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="swagger" id="swagger" />
                    <Label htmlFor="swagger" className="text-sm">
                      Swagger에서 가져오기
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="example" id="example" />
                    <Label htmlFor="example" className="text-sm">
                      API 예제
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* API Name */}
              <div>
                <Label
                  htmlFor="api-name"
                  className="text-sm font-medium text-gray-700 mb-2 block"
                >
                  API 이름 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="api-name"
                  placeholder="API 이름을 입력하세요"
                  value={createApiForm.name}
                  onChange={(e) =>
                    setCreateApiForm({ ...createApiForm, name: e.target.value })
                  }
                  className="w-full"
                />
              </div>

              {/* Description */}
              <div>
                <Label
                  htmlFor="description"
                  className="text-sm font-medium text-gray-700 mb-2 block"
                >
                  설명
                </Label>
                <Textarea
                  id="description"
                  placeholder="설명을 입력하세요"
                  value={createApiForm.description}
                  onChange={(e) =>
                    setCreateApiForm({
                      ...createApiForm,
                      description: e.target.value,
                    })
                  }
                  className="w-full min-h-[100px] resize-none"
                  maxLength={300}
                />
                <div className="text-right text-sm text-gray-500 mt-1">
                  {createApiForm.description.length}/300 자
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setCreateApiForm({ type: "new", name: "", description: "" });
                }}
              >
                취소
              </Button>
              <Button
                onClick={handleCreateApi}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                API 생성
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
