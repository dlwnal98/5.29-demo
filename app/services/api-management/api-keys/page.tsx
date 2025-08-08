'use client';

import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  Plus,
  RefreshCw,
  Search,
  ChevronDown,
  ChevronRight,
  Edit,
  Trash2,
  Eye,
  Copy,
  AlertTriangle,
  EyeOff,
} from 'lucide-react';
import { useState } from 'react';
import { toast, Toaster } from 'sonner';
import Pagination from '@/components/Pagination';
import { useCreateAPIKey } from '@/hooks/use-apimanagement';
import { useClipboard } from 'use-clipboard-copy';

interface ApiKey {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  primaryKey: string;
  secondaryKey: string;
  createdAt: string;
  usedInMethods: string[];
}

export default function ApiKeysPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: 'm8iv2tyj8g',
      name: '임시키',
      description: '임시로 만든 키',
      status: 'active',
      primaryKey: '',
      secondaryKey: '',
      createdAt: 'July 03, 2025, 09:15 (UTC+09:00)',
      usedInMethods: ['GET /api/users', 'POST /api/orders', 'GET /api/products'],
    },
    {
      id: 'bdvxa9y5iw',
      name: 'apikey001',
      description: 'apikey001',
      status: 'active',
      primaryKey: '',
      secondaryKey: '',
      createdAt: 'July 02, 2025, 14:30 (UTC+09:00)',
      usedInMethods: ['GET /api/analytics', 'POST /api/reports'],
    },
    {
      id: '6jnesgo4xl',
      name: 'name',
      description: 'name설명',
      status: 'active',
      primaryKey: '',
      secondaryKey: '',
      createdAt: 'July 01, 2025, 10:45 (UTC+09:00)',
      usedInMethods: ['DELETE /api/cache', 'PUT /api/settings'],
    },
  ]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [editingApiKey, setEditingApiKey] = useState<ApiKey | null>(null);
  const [deletingApiKey, setDeletingApiKey] = useState<ApiKey | null>(null);
  const [showApiKey, setShowApiKey] = useState<{ [key: string]: boolean }>({});
  const [newApiKey, setNewApiKey] = useState({
    name: '',
    description: '',
    keyGeneration: 'auto',
    customKey: '',
  });

  const clipboard = useClipboard();

  const generateRandomKey = (prefix: string) => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = prefix + '_live_';
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleRefresh = () => {
    toast.success('페이지가 새로고침되었습니다.');
    window.location.reload();
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedKeys(apiKeys.map((key) => key.id));
    } else {
      setSelectedKeys([]);
    }
  };

  const handleSelectKey = (keyId: string, checked: boolean) => {
    if (checked) {
      setSelectedKeys([...selectedKeys, keyId]);
    } else {
      setSelectedKeys(selectedKeys.filter((id) => id !== keyId));
    }
  };

  const toggleExpanded = (keyId: string) => {
    if (expandedKeys.includes(keyId)) {
      setExpandedKeys(expandedKeys.filter((id) => id !== keyId));
    } else {
      setExpandedKeys([...expandedKeys, keyId]);
    }
  };

  // 브랜치 생성
  const { mutate: createAPIKeyMutate } = useCreateAPIKey('user01', 'test', 'rnd2', 'ddd');

  const handleCreateApiKey = () => {
    if (newApiKey.name.trim()) {
      createAPIKeyMutate(
        {
          keyName: newApiKey.name.trim(),
          description: newApiKey.description.trim(),
        },
        {
          onSuccess: (data) => {
            console.log('브랜치 생성 성공:', data);
            // setNewApiKey({name:''});
          },
          onError: (error) => {
            console.error('브랜치 생성 실패:', error);
          },
        }
      );
    }
  };

  const handleCreateApiKey2 = () => {
    if (!newApiKey.name.trim()) {
      toast.error('API Key 이름을 입력해주세요.');
      return;
    }

    const apiKey: ApiKey = {
      id: Math.random().toString(36).substr(2, 10),
      name: newApiKey.name,
      description: newApiKey.description,
      status: 'active',
      primaryKey:
        newApiKey.keyGeneration === 'auto' ? generateRandomKey('pk') : newApiKey.customKey,
      secondaryKey: generateRandomKey('sk'),
      createdAt: new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short',
      }),
      usedInMethods: [],
    };

    setApiKeys([apiKey, ...apiKeys]);
    setNewApiKey({
      name: '',
      description: '',
      keyGeneration: 'auto',
      customKey: '',
    });
    setIsCreateModalOpen(false);
    toast.success('API Key가 생성되었습니다.');
  };

  const handleEditApiKey = (apiKey: ApiKey) => {
    setEditingApiKey({ ...apiKey });
    setIsEditModalOpen(true);
  };

  const handleUpdateApiKey = () => {
    if (!editingApiKey) return;

    setApiKeys(apiKeys.map((key) => (key.id === editingApiKey.id ? editingApiKey : key)));
    setIsEditModalOpen(false);
    setEditingApiKey(null);
    toast.success('API Key가 수정되었습니다.');
  };

  const handleDeleteApiKey = (apiKey: ApiKey) => {
    setDeletingApiKey(apiKey);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteApiKey = () => {
    if (!deletingApiKey) return;

    setApiKeys(apiKeys.filter((key) => key.id !== deletingApiKey.id));
    setIsDeleteModalOpen(false);
    setDeletingApiKey(null);
    toast.success('API Key가 삭제되었습니다.');
  };

  const handleBulkDeleteApiKeys = () => {
    if (selectedKeys.length === 0) {
      toast.error('삭제할 API Key를 선택해주세요.');
      return;
    }
    setIsBulkDeleteModalOpen(true);
  };

  const confirmBulkDeleteApiKeys = () => {
    setApiKeys(apiKeys.filter((key) => !selectedKeys.includes(key.id)));
    setSelectedKeys([]);
    setIsBulkDeleteModalOpen(false);
    toast.success(`${selectedKeys.length}개의 API Key가 삭제되었습니다.`);
  };

  const toggleShowApiKey = (keyId: string) => {
    setShowApiKey((prev) => ({
      ...prev,
      [keyId]: !prev[keyId],
    }));
  };

  const filteredApiKeys = apiKeys.filter(
    (apiKey) =>
      apiKey.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apiKey.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <AppLayout>
      <Toaster position="top-center" richColors expand={true} />

      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/vpc">VPC</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/infra-packages/gateway">API Gateway</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>API Keys</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">API Keys</h1>
          </div>
          <div className="flex items-center gap-1">
            <div className="flex items-center justify-between ">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="API Key 이름"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                {/* <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      20 개씩 보기
                      <ChevronDown className="h-4 w-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>10 개씩 보기</DropdownMenuItem>
                    <DropdownMenuItem>20 개씩 보기</DropdownMenuItem>
                    <DropdownMenuItem>50 개씩 보기</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu> */}
              </div>
            </div>
            <Button variant="outline" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 " />
            </Button>
            <Button variant="destructive" onClick={handleBulkDeleteApiKeys}>
              <Trash2 className="h-4 w-4" />
            </Button>
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  API Key 생성
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>API Key 생성</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium">
                      이름
                    </Label>
                    <Input
                      id="name"
                      value={newApiKey.name}
                      onChange={(e) => setNewApiKey({ ...newApiKey, name: e.target.value })}
                      placeholder=""
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description" className="text-sm font-medium">
                      설명 - 선택 사항
                    </Label>
                    <Textarea
                      id="description"
                      value={newApiKey.description}
                      onChange={(e) =>
                        setNewApiKey({
                          ...newApiKey,
                          description: e.target.value,
                        })
                      }
                      placeholder=""
                      className="mt-1 min-h-[80px]"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                      취소
                    </Button>
                    <Button
                      onClick={handleCreateApiKey}
                      className="bg-orange-500 hover:bg-orange-600 text-white"
                    >
                      발급
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Action Buttons and Search */}
        {/* <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 mb-6"> */}
        {/* API Keys Table */}
        <Card>
          <div className="pt-4"></div>
          <CardContent>
            <Table>
              <TableHeader className="hover:bg-white">
                <TableRow className="hover:bg-white">
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedKeys.length === apiKeys.length && apiKeys.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>API Key ID</TableHead>
                  <TableHead>API Key 이름</TableHead>
                  <TableHead>설명</TableHead>
                  <TableHead>사용여부</TableHead>
                  <TableHead className="text-center w-3">작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApiKeys.map((apiKey) => (
                  <>
                    <TableRow key={apiKey.id} className="dark:bg-blue-900/20 hover:cursor-pointer">
                      <TableCell>
                        <Checkbox
                          checked={selectedKeys.includes(apiKey.id)}
                          onCheckedChange={(checked) =>
                            handleSelectKey(apiKey.id, checked as boolean)
                          }
                        />
                      </TableCell>
                      <TableCell className="font-medium text-blue-600">{apiKey.id}</TableCell>
                      <TableCell>
                        <button
                          onClick={() => toggleExpanded(apiKey.id)}
                          className="flex items-center gap-2 text-left transition-colors"
                        >
                          <span className="font-medium">{apiKey.name}</span>
                        </button>
                      </TableCell>
                      <TableCell>{apiKey.description}</TableCell>
                      <TableCell>
                        <Badge variant={'outline'} className={getStatusColor(apiKey.status)}>
                          {/* {apiKey.status === 'active' ? '사용' : '미사용'} */}
                          {apiKey.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            className="text-white hover:text-white bg-slate-500 hover:bg-slate-500"
                            size="sm"
                            onClick={() => handleEditApiKey(apiKey)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteApiKey(apiKey)}
                            className="hover:bg-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    {expandedKeys.includes(apiKey.id) && (
                      <TableRow>
                        <TableCell colSpan={6} className="bg-gray-50 dark:bg-gray-900/50 p-6">
                          <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                              <div>
                                <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                  ID
                                </Label>
                                <div className="mt-1 text-sm font-medium">{apiKey.id}</div>
                              </div>
                              <div>
                                <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                  상태
                                </Label>
                                <div className="mt-1 flex items-center gap-2">
                                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                  <span className="text-sm">활성</span>
                                </div>
                              </div>
                            </div>

                            <div>
                              <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                설명
                              </Label>
                              <div className="mt-1 text-sm">{apiKey.description || '-'}</div>
                            </div>

                            <div>
                              <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                생성 날짜
                              </Label>
                              <div className="mt-1 text-sm">{apiKey.createdAt}</div>
                            </div>

                            <div>
                              <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                API 키
                              </Label>
                              <div className="mt-1 flex items-center gap-2">
                                <div className="flex items-center gap-1 text-blue-600">
                                  <span className="text-sm font-mono">
                                    {showApiKey[apiKey.id]
                                      ? apiKey.primaryKey
                                      : '••••••••••••••••••••••••••••••••••••••••••••••••'}
                                  </span>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleShowApiKey(apiKey.id)}
                                  className="text-blue-600 hover:text-blue-800 p-1 h-auto"
                                >
                                  {showApiKey[apiKey.id] ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    clipboard.copy(apiKey.primaryKey);
                                    toast.success('API 키가 복사되었습니다.');
                                  }}
                                  className="text-blue-600 hover:text-blue-800 p-1 h-auto"
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>

                            <div>
                              <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                사용 중인 메서드 ({apiKey.usedInMethods.length}개)
                              </Label>
                              <div className="mt-2 space-y-2">
                                {apiKey.usedInMethods.length > 0 ? (
                                  apiKey.usedInMethods.map((method, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center gap-2 p-2 bg-white dark:bg-gray-800 rounded border"
                                    >
                                      <Badge
                                        variant="outline"
                                        className={`text-xs ${
                                          method.startsWith('GET')
                                            ? 'text-green-600 border-green-600'
                                            : method.startsWith('POST')
                                              ? 'text-blue-600 border-blue-600'
                                              : method.startsWith('PUT')
                                                ? 'text-yellow-600 border-yellow-600'
                                                : method.startsWith('DELETE')
                                                  ? 'text-red-600 border-red-600'
                                                  : 'text-gray-600 border-gray-600'
                                        }`}
                                      >
                                        {method.split(' ')[0]}
                                      </Badge>
                                      <span className="text-sm font-mono">
                                        {method.split(' ')[1]}
                                      </span>
                                    </div>
                                  ))
                                ) : (
                                  <div className="text-sm text-gray-500 italic">
                                    현재 사용 중인 메서드가 없습니다.
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        {/* </div> */}

        {/* Pagination */}
        <Pagination />

        {/* Edit API Key Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>API Key 수정</DialogTitle>
            </DialogHeader>
            {editingApiKey && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="edit-id" className="text-sm font-medium">
                    ID
                  </Label>
                  <Input
                    id="edit-id"
                    value={editingApiKey.id}
                    readOnly
                    disabled
                    className="mt-1 bg-gray-50 dark:bg-gray-800"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-name" className="text-sm font-medium">
                    이름
                  </Label>
                  <Input
                    id="edit-name"
                    value={editingApiKey.name}
                    onChange={(e) =>
                      setEditingApiKey({
                        ...editingApiKey,
                        name: e.target.value,
                      })
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-description" className="text-sm font-medium">
                    설명 - 선택 사항
                  </Label>
                  <Textarea
                    id="edit-description"
                    value={editingApiKey.description}
                    onChange={(e) =>
                      setEditingApiKey({
                        ...editingApiKey,
                        description: e.target.value,
                      })
                    }
                    className="mt-1 min-h-[80px]"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-key" className="text-sm font-medium">
                    API 키
                  </Label>
                  <Input
                    id="edit-key"
                    value={editingApiKey.primaryKey}
                    disabled
                    onChange={(e) =>
                      setEditingApiKey({
                        ...editingApiKey,
                        primaryKey: e.target.value,
                      })
                    }
                    className="mt-1 font-mono text-sm"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                    취소
                  </Button>
                  <Button
                    onClick={handleUpdateApiKey}
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    수정
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Individual Delete Confirmation Modal */}
        <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                API Key 삭제 확인
              </AlertDialogTitle>
              <AlertDialogDescription className="space-y-3">
                {deletingApiKey && (
                  <>
                    <div className="text-gray-700 dark:text-gray-300">
                      <strong className="text-red-600">경고:</strong> 이 작업은 되돌릴 수 없습니다.
                    </div>
                    <div className="text-gray-700 dark:text-gray-300">
                      API Key <strong className="text-red-600">"{deletingApiKey.name}"</strong>이
                      영구적으로 삭제됩니다.
                    </div>
                    <div className="text-gray-700 dark:text-gray-300">
                      삭제된 API Key를 사용하는 모든 애플리케이션과 서비스는 즉시 액세스가
                      차단됩니다.
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-md border border-red-200 dark:border-red-800">
                      <div className="text-sm text-red-800 dark:text-red-200 font-medium">
                        삭제될 API Key:
                      </div>
                      <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                        <div className="flex items-center gap-2">
                          <span>•</span>
                          <span className="font-mono">{deletingApiKey.id}</span>
                          <span>({deletingApiKey.name})</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>취소</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDeleteApiKey}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                삭제
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Bulk Delete Confirmation Modal */}
        <AlertDialog open={isBulkDeleteModalOpen} onOpenChange={setIsBulkDeleteModalOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                API Key 삭제 확인
              </AlertDialogTitle>
              <AlertDialogDescription className="space-y-3">
                <div className="text-gray-700 dark:text-gray-300">
                  <strong className="text-red-600">경고:</strong> 이 작업은 되돌릴 수 없습니다.
                </div>
                <div className="text-gray-700 dark:text-gray-300">
                  선택된 <strong className="text-red-600">{selectedKeys.length}개</strong>의 API
                  Key가 영구적으로 삭제됩니다.
                </div>
                <div className="text-gray-700 dark:text-gray-300">
                  삭제된 API Key를 사용하는 모든 애플리케이션과 서비스는 즉시 액세스가 차단됩니다.
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-md border border-red-200 dark:border-red-800">
                  <div className="text-sm text-red-800 dark:text-red-200 font-medium">
                    삭제될 API Key 목록:
                  </div>
                  <ul className="mt-2 text-sm text-red-700 dark:text-red-300 space-y-1">
                    {selectedKeys.map((keyId) => {
                      const key = apiKeys.find((k) => k.id === keyId);
                      return (
                        <li key={keyId} className="flex items-center gap-2">
                          <span>•</span>
                          <span className="font-mono">{keyId}</span>
                          <span>({key?.name})</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>취소</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmBulkDeleteApiKeys}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                삭제
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppLayout>
  );
}
