'use client';

import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Plus, RefreshCw, Search, Edit, Trash2, Copy, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { toast, Toaster } from 'sonner';
import Pagination from '@/components/Pagination';
import { useClipboard } from 'use-clipboard-copy';
import { useAuthStore } from '@/store/store';
import {
  useGetAPIKeyList,
  useCreateAPIKey,
  ApiKey,
  useModifyAPIKey,
  useDeleteAPIKey,
} from '@/hooks/use-apiKeys';

export default function ApiKeysPage() {
  const userData = useAuthStore((state) => state.user);

  const { data: apiKeyData } = useGetAPIKeyList(userData?.organizationId);

  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);
  const [editingApiKey, setEditingApiKey] = useState<ApiKey | null>(null);
  const [deletingApiKey, setDeletingApiKey] = useState<ApiKey | null>(null);
  const [copyApiKey, setCopyApiKey] = useState('');
  const [newApiKey, setNewApiKey] = useState({
    keyName: '',
    description: '',
  });

  const { keyName, description } = newApiKey;

  // apikey 생성 mutate
  const { mutate: createAPIKey } = useCreateAPIKey({
    onSuccess: () => {
      setIsCreateModalOpen(false);
      toast.success('API키가 생성되었습니다.');
    },
  });

  // apikey 생성
  const handleCreateAPIKey = () => {
    createAPIKey({
      userKey: userData?.userKey ?? '',
      keyName,
      description,
      organizationId: userData?.organizationId ?? '',
    });
  };

  const handleRefresh = () => {
    toast.success('페이지가 새로고침되었습니다.');
    window.location.reload();
  };

  // apikey 수정 mutate
  const { mutate: modifyAPIKey } = useModifyAPIKey({
    onSuccess: () => {
      toast.success('API키가 수정되었습니다.');
    },
  });

  // apikey 삭제 mutate
  const { mutate: deleteAPIKey } = useDeleteAPIKey({
    onSuccess: () => {
      toast.success('API키가 삭제되었습니다.');
    },
  });

  const handleEditApiKey = (apiKey: ApiKey) => {
    setEditingApiKey({ ...apiKey });
    setIsEditModalOpen(true);
  };

  const handleUpdateApiKey = (keyId: string, keyName: string, description: string) => {
    if (!editingApiKey) return;

    modifyAPIKey({ keyId, keyName, description });
  };

  const handleDeleteApiKey = (apiKey: ApiKey) => {
    setDeletingApiKey(apiKey);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteApiKey = (keyId: string) => {
    if (!deletingApiKey) return;

    deleteAPIKey(keyId);
    setIsDeleteModalOpen(false);
  };

  //프론트에서 검색기능 처리
  const filteredApiKeys = apiKeyData?.filter(
    (apiKey) =>
      apiKey.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apiKey.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const clipboard = useClipboard();

  // 비밀번호 복사 함수
  const handleCopyApiKey = (apiKey: string) => {
    setCopyApiKey(apiKey);
    setIsCopyModalOpen(true);
  };

  return (
    <AppLayout>
      <Toaster position="bottom-center" richColors expand={true} />

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
              </div>
            </div>
            <Button variant="outline" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 " />
            </Button>

            {/* API KEY 생성 */}
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
                    <Label htmlFor="keyName" className="text-sm font-medium">
                      이름
                    </Label>
                    <Input
                      id="keyName"
                      value={newApiKey.keyName}
                      onChange={(e) => setNewApiKey({ ...newApiKey, keyName: e.target.value })}
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
                      onClick={() => handleCreateAPIKey()}
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

        {/* API Keys Table */}
        <Card>
          <div className="pt-4"></div>
          <CardContent>
            <Table>
              <TableHeader className="hover:bg-white">
                <TableRow className="hover:bg-white">
                  <TableHead className="w-12">ID</TableHead>
                  <TableHead>이름</TableHead>
                  <TableHead>설명</TableHead>
                  <TableHead>수정일</TableHead>
                  <TableHead className="text-center w-3">작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApiKeys?.map((apiKey, index) => (
                  <>
                    <TableRow key={index} className="dark:bg-blue-900/20 ">
                      <TableCell className="font-medium text-blue-600">{apiKey.keyId}</TableCell>
                      <TableCell className="font-medium">{apiKey.name}</TableCell>
                      <TableCell>{apiKey.description}</TableCell>
                      <TableCell>{apiKey.updatedAt?.split('T')[0]}</TableCell>

                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            className="text-white hover:text-white bg-amber-500 hover:bg-amber-500"
                            size="sm"
                            onClick={() => handleCopyApiKey(apiKey.key)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
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
                    value={editingApiKey.keyId}
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

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                    취소
                  </Button>
                  <Button
                    onClick={() =>
                      handleUpdateApiKey(
                        editingApiKey.keyId,
                        editingApiKey.name,
                        editingApiKey.description
                      )
                    }
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
                          <span className="font-mono">{deletingApiKey.keyId}</span>
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
                onClick={() => confirmDeleteApiKey(deletingApiKey.keyId)}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                삭제
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Dialog open={isCopyModalOpen} onOpenChange={setIsCopyModalOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>발급된 API Key</DialogTitle>
              <DialogDescription>발급된 API Key를 복사할 수 있습니다.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <button
                    className=" w-[100%] flex justify-between items-center hover:underline"
                    onClick={() => {
                      clipboard.copy(copyApiKey);
                      toast.success('API Key가 복사되었습니다.');
                    }}
                  >
                    <span className="block w-[90%] whitespace-normal break-words text-left">
                      {copyApiKey}
                    </span>

                    <Copy className="h-4 w-4 ml-2" />
                  </button>
                </div>
              </div>
            </div>
            <DialogFooter className="!flex !justify-center">
              <Button
                variant="default"
                className="bg-amber-400 hover:bg-amber-500"
                onClick={() => {
                  setIsCopyModalOpen(false);
                }}
              >
                확인
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
