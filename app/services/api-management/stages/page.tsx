'use client';

import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  ArrowLeft,
  ChevronRight,
  ChevronDown,
  Edit,
  Copy,
  Download,
  RotateCcw,
  Trash2,
  AlertTriangle,
  SquarePlus,
  SquareMinus,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ApiResource {
  id: string;
  path: string;
  name: string;
  children?: ApiResource[];
  methods: ApiMethod[];
}

interface ApiMethod {
  id: string;
  type: string;
  path: string;
  endpointUrl: string;
  description: string;
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
  stageName: string;
  date: string;
  status: 'active' | 'inactive' | 'failed';
  description: string;
  deploymentId: string;
}

interface SelectedMethod {
  resourceId: string;
  resourcePath: string;
  method: ApiMethod;
  url: string;
}

interface SelectedResource {
  resource: ApiResource;
  type: 'stage' | 'resource';
}

export default function StagesPage() {
  const router = useRouter();

  const mockDeployments: DeploymentRecord[] = [
    {
      id: '1',
      stageName: 'hello',
      date: 'July 03, 2025, 08:26 (UTC+09:00)',
      status: 'inactive',
      description: 'Initial deployment',
      deploymentId: 'eemowu',
    },
    {
      id: '2',
      stageName: 'nexfron',
      date: 'July 03, 2025, 08:26 (UTC+09:00)',
      status: 'inactive',
      description: 'Production update',
      deploymentId: 'jje6x',
    },
    {
      id: '3',
      stageName: 'hello',
      date: 'July 02, 2025, 17:44 (UTC+09:00)',
      status: 'active',
      description: 'Bug fix deployment',
      deploymentId: 'xf40pg',
    },
    {
      id: '4',
      stageName: 'nexfron',
      date: 'July 02, 2025, 17:42 (UTC+09:00)',
      status: 'inactive',
      description: 'Feature rollback',
      deploymentId: 'ussiri',
    },
  ];

  const [apiResources] = useState<ApiResource[]>([
    {
      id: 'hello',
      path: '/',
      name: 'hello',
      methods: [],
      children: [
        {
          id: 'root',
          path: '/',
          name: '/',
          methods: [],
          children: [
            {
              id: 'rnd',
              path: '/rnd',
              name: '/rnd',
              methods: [
                {
                  id: 'get-rnd',
                  type: 'GET',
                  path: '/rnd',
                  endpointUrl:
                    'https://ynr5g5hoch.execute-api.ap-northeast-2.amazonaws.com/hello/rnd',
                  description: 'Get random data',
                },
              ],
            },
            {
              id: 'users',
              path: '/users',
              name: '/users',
              methods: [
                {
                  id: 'get-users',
                  type: 'GET',
                  path: '/users',
                  endpointUrl:
                    'https://ynr5g5hoch.execute-api.ap-northeast-2.amazonaws.com/hello/users',
                  description: 'Get all users',
                },
                {
                  id: 'post-users',
                  type: 'POST',
                  path: '/users',
                  endpointUrl:
                    'https://ynr5g5hoch.execute-api.ap-northeast-2.amazonaws.com/hello/users',
                  description: 'Create new user',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'nexfron',
      path: '/nexfron',
      name: 'nexfron',
      methods: [],
      children: [
        {
          id: 'root',
          path: '/',
          name: '/',
          methods: [],
          children: [
            {
              id: 'rnd',
              path: '/rnd',
              name: '/rnd',
              methods: [
                {
                  id: 'get-rnd',
                  type: 'GET',
                  path: '/rnd',
                  endpointUrl:
                    'https://ynr5g5hoch.execute-api.ap-northeast-2.amazonaws.com/hello/rnd',
                  description: 'Get random data',
                },
              ],
            },
          ],
        },
      ],
    },
  ]);

  const [selectedStage, setSelectedStage] = useState<Stage>({
    id: 'hello',
    name: 'hello',
    description: '',
    cacheEnabled: false,
    throttleRate: 10000,
    burstRate: 5000,
    url: 'https://ynr5g5hoch.execute-api.ap-northeast-2.amazonaws.com/hello',
    lastDeployed: 'July 02, 2025, 17:44 (UTC+09:00)',
    deploymentId: 'xf40bg',
  });

  const [selectedResource, setSelectedResource] = useState<SelectedResource>({
    resource: apiResources[0],
    type: 'stage',
  });

  const [selectedMethod, setSelectedMethod] = useState<SelectedMethod | null>(null);

  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set(['hello']));
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateStageModalOpen, setIsCreateStageModalOpen] = useState(false);
  const [isDeleteStageDialogOpen, setIsDeleteStageDialogOpen] = useState(false);
  const [isRevokeDeploymentDialogOpen, setIsRevokeDeploymentDialogOpen] = useState(false);
  const [isDirectUrlInput, setIsDirectUrlInput] = useState(false);
  const [isRollbackModalOpen, setIsRollbackModalOpen] = useState(false);
  const [selectedRollbackDeployment, setSelectedRollbackDeployment] =
    useState<DeploymentRecord | null>(null);

  const [editForm, setEditForm] = useState({
    name: selectedStage.name,
    description: selectedStage.description,
    apiCacheEnabled: false,
    methodLevelCacheEnabled: false,
    throttlingEnabled: false,
    wafProfile: '없음',
    clientCertificate: '없음',
  });

  const [createStageForm, setCreateStageForm] = useState({
    name: '',
    description: '',
  });

  const getResourceKey = (resource: ApiResource, parentPath = '') => {
    // 부모 경로와 현재 리소스의 id를 조합하여 고유한 키 생성
    return `${parentPath}${resource.id}`;
  };

  const toggleExpanded = (resource: ApiResource, parentPath = '') => {
    const resourceKey = getResourceKey(resource, parentPath);
    const newExpanded = new Set(expandedPaths);
    if (newExpanded.has(resourceKey)) {
      newExpanded.delete(resourceKey);
    } else {
      newExpanded.add(resourceKey);
    }
    setExpandedPaths(newExpanded);
  };

  const handleBack = () => {
    router.push('/services/api-management');
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(selectedStage.url);
    toast.success('URL이 클립보드에 복사되었습니다.');
  };

  const handleCopyMethodUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('메서드 URL이 클립보드에 복사되었습니다.');
  };

  const handleEditSave = () => {
    setSelectedStage({
      ...selectedStage,
      name: editForm.name,
      description: editForm.description,
    });
    setIsEditModalOpen(false);
    toast.success('스테이지가 성공적으로 업데이트되었습니다.');
  };

  const handleCreateStage = () => {
    if (!createStageForm.name.trim()) {
      toast.error('스테이지 이름을 입력해주세요.');
      return;
    }

    toast.success(`스테이지 '${createStageForm.name}'이(가) 생성되었습니다.`);
    setIsCreateStageModalOpen(false);
    setCreateStageForm({ name: '', description: '' });
  };

  const handleResourceClick = (resource: ApiResource, type: 'stage' | 'resource') => {
    if (type === 'stage') {
      setSelectedStage({
        ...selectedStage,
        id: resource.id,
        name: resource.name,
      });
    }
    setSelectedResource({ resource, type });
    setSelectedMethod(null);
  };

  const handleMethodClick = (method: ApiMethod, resource: ApiResource) => {
    const methodUrl = `${selectedStage.url}${method.path}`;
    setSelectedMethod({
      resourceId: resource.id,
      resourcePath: resource.path,
      method,
      url: methodUrl,
    });
  };

  const handleExportApi = () => {
    toast.success('API 내보내기가 시작되었습니다.');
  };

  const handleRevokeDeployment = () => {
    setIsRevokeDeploymentDialogOpen(false);
    toast.success('배포가 회수되었습니다.');
  };

  const handleDeleteStage = () => {
    setIsDeleteStageDialogOpen(false);
    toast.success(`스테이지 '${selectedStage.name}'이(가) 삭제되었습니다.`);
  };

  const handleRollbackClick = (deployment: DeploymentRecord) => {
    setSelectedRollbackDeployment(deployment);
    setIsRollbackModalOpen(true);
  };

  const handleRollbackConfirm = () => {
    if (selectedRollbackDeployment) {
      toast.success(`배포 ${selectedRollbackDeployment.deploymentId}로 롤백되었습니다.`);
      setIsRollbackModalOpen(false);
      setSelectedRollbackDeployment(null);
    }
  };

  const getDeploymentStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'inactive':
        return 'bg-gray-100 text-gray-700';
      case 'failed':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const renderResourceTree = (resource: ApiResource, level = 0, parentPath = '') => {
    const resourceKey = getResourceKey(resource, parentPath);
    const isExpanded = expandedPaths.has(resourceKey);
    const hasChildren =
      (resource.children && resource.children.length > 0) ||
      (resource.methods && resource.methods.length > 0);
    const isStage = level === 0;

    return (
      <div key={resource.id}>
        <div
          className={`flex items-center gap-2 py-1 px-2 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded text-sm ${
            selectedResource.resource.id === resource.id
              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
              : ''
          }`}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={() => handleResourceClick(resource, isStage ? 'stage' : 'resource')}
        >
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleExpanded(resource, parentPath);
              }}
            >
              {isExpanded ? (
                <SquareMinus className="h-3 w-3 text-blue-500" />
              ) : (
                <SquarePlus className="h-3 w-3 text-blue-500" />
              )}
            </button>
          )}
          {!hasChildren && <div className="w-3" />}

          <span
            className={`font-medium ${isStage ? 'text-blue-600' : 'text-gray-700 dark:text-gray-300'}`}
          >
            {resource.name}
          </span>
        </div>

        {hasChildren && isExpanded && (
          <>
            {resource.children?.map((child) => renderResourceTree(child, level + 1, resourceKey))}
            {resource.methods?.map((method, index) => (
              <div
                key={`${resource.id}-${method.id}-${index}`}
                className={`flex items-center gap-2 py-1 px-2 text-xs cursor-pointer hover:bg-green-50 dark:hover:bg-green-900/20 rounded ${
                  selectedMethod?.method.id === method.id
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
                style={{ paddingLeft: `${(level + 1) * 16 + 8}px` }}
                onClick={() => handleMethodClick(method, resource)}
              >
                <div className="w-3" />
                <span
                  className={`font-mono text-xs px-1.5 py-0.5 rounded ${
                    method.type === 'GET'
                      ? 'bg-green-100 text-green-800'
                      : method.type === 'POST'
                        ? 'bg-blue-100 text-blue-800'
                        : method.type === 'PUT'
                          ? 'bg-yellow-100 text-yellow-800'
                          : method.type === 'DELETE'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {method.type}
                </span>
              </div>
            ))}
          </>
        )}
      </div>
    );
  };
  const [selectedDeploymentRecord, setSelectedDeploymentRecord] = useState('');

  // Mock deployment records from stages page
  const mockDeploymentRecords = [
    {
      id: '1',
      stageName: 'hello',
      date: 'July 03, 2025, 08:26 (UTC+09:00)',
      status: 'inactive',
      description: 'Initial deployment',
      deploymentId: 'eemowu',
    },
    {
      id: '2',
      stageName: 'nexfron',
      date: 'July 03, 2025, 08:26 (UTC+09:00)',
      status: 'inactive',
      description: 'Production update',
      deploymentId: 'jje6x',
    },
    {
      id: '3',
      stageName: 'hello',
      date: 'July 02, 2025, 17:44 (UTC+09:00)',
      status: 'active',
      description: 'Bug fix deployment',
      deploymentId: 'xf40pg',
    },
    {
      id: '4',
      stageName: 'nexfron',
      date: 'July 02, 2025, 17:42 (UTC+09:00)',
      status: 'inactive',
      description: 'Feature rollback',
      deploymentId: 'ussiri',
    },
  ];

  // Get current active deployment
  const currentActiveDeployment = mockDeployments.find((d) => d.status === 'active');

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
              <BreadcrumbLink href="/services/api-management">API Management</BreadcrumbLink>
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Stages</h1>
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
              {selectedMethod ? (
                /* Method Detail View */
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <span
                          className={`px-2 py-1 rounded text-sm font-mono ${
                            selectedMethod.method.type === 'GET'
                              ? 'bg-green-100 text-green-800'
                              : selectedMethod.method.type === 'POST'
                                ? 'bg-blue-100 text-blue-800'
                                : selectedMethod.method.type === 'PUT'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : selectedMethod.method.type === 'DELETE'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {selectedMethod.method.type}
                        </span>
                        {selectedMethod.method.path} - 메서드 상세
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        설명
                      </Label>
                      <div className="mt-1 text-sm text-gray-900 dark:text-white">
                        {selectedMethod.method.description}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        엔드포인트 URL
                      </Label>
                      <div className="mt-1 flex items-center gap-2">
                        <code className="flex-1 text-sm bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded border font-mono">
                          {selectedMethod.url}
                        </code>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCopyMethodUrl(selectedMethod.url)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : selectedResource.type === 'resource' ? (
                /* Resource Detail View */
                <Card>
                  <CardHeader>
                    <CardTitle>리소스 상세 정보 - {selectedResource.resource.path}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          메서드 ({selectedResource.resource.methods.length})
                        </Label>
                        {selectedResource.resource.methods.length > 0 ? (
                          <div className="mt-2 space-y-2">
                            {selectedResource.resource.methods.map((method) => (
                              <div
                                key={method.id}
                                className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                                onClick={() => handleMethodClick(method, selectedResource.resource)}
                              >
                                <div className="flex items-center gap-3">
                                  <span
                                    className={`px-2 py-1 rounded text-sm font-mono ${
                                      method.type === 'GET'
                                        ? 'bg-green-100 text-green-800'
                                        : method.type === 'POST'
                                          ? 'bg-blue-100 text-blue-800'
                                          : method.type === 'PUT'
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : method.type === 'DELETE'
                                              ? 'bg-red-100 text-red-800'
                                              : 'bg-gray-100 text-gray-800'
                                    }`}
                                  >
                                    {method.type}
                                  </span>
                                  <div>
                                    <div className="font-medium">{method.path}</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                      {method.description}
                                    </div>
                                  </div>
                                </div>
                                <ChevronRight className="h-4 w-4 text-gray-400" />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="mt-2 text-center py-8 text-gray-500 dark:text-gray-400">
                            이 리소스에는 정의된 메서드가 없습니다.
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                /* Stage Details */
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="border-b border-gray-200 dark:border-gray-700 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                          스테이지 세부 정보
                        </h2>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsEditModalOpen(true)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          편집
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              스테이지 작업
                              <ChevronDown className="h-4 w-4 ml-1" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={handleExportApi}>
                              <Download className="h-4 w-4 mr-2" />
                              API 내보내기
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setIsRevokeDeploymentDialogOpen(true)}>
                              <RotateCcw className="h-4 w-4 mr-2" />
                              배포 회수
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setIsDeleteStageDialogOpen(true)}
                              className="text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              스테이지 삭제
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
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
                    </div>
                  </div>
                </div>
              )}

              {/* Deployment Records - Always visible */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="border-b border-gray-200 dark:border-gray-700 p-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      배포 기록 ({mockDeployments.length})
                    </h2>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>스테이지 이름</TableHead>
                        <TableHead className="text-center">배포 날짜</TableHead>
                        <TableHead>활성 상태</TableHead>
                        <TableHead className="text-center">설명</TableHead>
                        <TableHead>배포 ID</TableHead>
                        <TableHead className="w-[100px] text-center">작업</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockDeployments.map((deployment) => (
                        <TableRow key={deployment.id}>
                          <TableCell>
                            <Badge variant="outline" className="font-mono">
                              {deployment.stageName}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">{deployment.date}</TableCell>
                          <TableCell>
                            {deployment.status === 'active' ? (
                              <Badge className={getDeploymentStatusColor(deployment.status)}>
                                활성
                              </Badge>
                            ) : (
                              <span className="text-sm text-gray-500">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-sm">{deployment.description}</TableCell>
                          <TableCell className="font-mono text-sm">
                            {deployment.deploymentId}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              onClick={() => handleRollbackClick(deployment)}
                            >
                              <RotateCcw className="h-4 w-4 mr-1" />
                              롤백
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
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
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="stage-description"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    스테이지 설명 - <span className="text-gray-500">선택 사항</span>
                  </Label>
                  <Textarea
                    id="stage-description"
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    className="mt-1 min-h-[100px]"
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                취소
              </Button>
              <Button onClick={handleEditSave} className="bg-blue-500 hover:bg-blue-600 text-white">
                저장
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Create Stage Modal */}
        <Dialog open={isCreateStageModalOpen} onOpenChange={setIsCreateStageModalOpen}>
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
              <div>
                <Label className="text-sm text-gray-600">배포 여부</Label>
                <div>
                  <span className="text-xs mr-3 text-gray-600">기본값으로 설정 여부</span>
                  <Switch checked={isDirectUrlInput} onCheckedChange={setIsDirectUrlInput} />
                </div>
              </div>
              {isDirectUrlInput && (
                <div>
                  <Label htmlFor="deployment-record">배포 기록 선택</Label>
                  <Select
                    value={selectedDeploymentRecord}
                    onValueChange={setSelectedDeploymentRecord}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="배포 기록을 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockDeploymentRecords.map((record) => (
                        <SelectItem key={record.id} value={record.deploymentId}>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {record.stageName} - {record.deploymentId}
                            </span>
                            <span className="text-xs text-gray-500">
                              {record.date} ({record.status})
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreateStageModalOpen(false);
                  setCreateStageForm({ name: '', description: '' });
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

        {/* Rollback Modal */}
        <Dialog open={isRollbackModalOpen} onOpenChange={setIsRollbackModalOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                활성 배포 변경
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="text-sm text-gray-700 dark:text-gray-300">
                '{selectedRollbackDeployment?.stageName}' 스테이지의 활성 배포를
                업데이트하시겠습니까?
              </div>

              <div className="space-y-3">
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                    현재 활성 배포
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {currentActiveDeployment?.deploymentId} - {currentActiveDeployment?.date}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                    새 활성 배포
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedRollbackDeployment?.deploymentId} - {selectedRollbackDeployment?.date}
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-600 dark:text-gray-400">
                현재 활성 배포가 즉시 새 배포로 교체됩니다.
              </div>
            </div>

            <DialogFooter className="gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsRollbackModalOpen(false)}>
                취소
              </Button>
              <Button
                onClick={handleRollbackConfirm}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                활성 배포 변경
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Stage Confirmation Dialog */}
        <AlertDialog open={isDeleteStageDialogOpen} onOpenChange={setIsDeleteStageDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                스테이지 삭제 확인
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-600">
                <div className="space-y-2">
                  <p className="font-semibold">⚠️ 경고: 이 작업은 되돌릴 수 없습니다!</p>
                  <p>
                    스테이지{' '}
                    <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                      {selectedStage.name}
                    </span>
                    을(를) 삭제하시겠습니까?
                  </p>
                  <p className="text-sm text-red-600">
                    • 이 스테이지의 모든 배포가 중단됩니다
                    <br />• API 호출이 실패할 수 있습니다
                    <br />• 이 작업은 즉시 적용되며 복구할 수 없습니다
                  </p>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>취소</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteStage}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                삭제하기
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Revoke Deployment Confirmation Dialog */}
        <AlertDialog
          open={isRevokeDeploymentDialogOpen}
          onOpenChange={setIsRevokeDeploymentDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-orange-600">
                <RotateCcw className="h-5 w-5" />
                배포 회수 확인
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-600">
                <div className="space-y-2">
                  <p>
                    스테이지{' '}
                    <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                      {selectedStage.name}
                    </span>
                    의 현재 배포를 회수하시겠습니까?
                  </p>
                  <p className="text-sm text-orange-600">
                    • 현재 활성화된 배포가 중단됩니다
                    <br />• API 엔드포인트가 일시적으로 사용할 수 없게 됩니다
                  </p>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>취소</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleRevokeDeployment}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                회수하기
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppLayout>
  );
}
