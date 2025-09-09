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
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Plus, RefreshCw, Search, Edit, Trash2, Copy } from 'lucide-react';
import { useState } from 'react';
import { toast, Toaster } from 'sonner';
import { useClipboard } from 'use-clipboard-copy';
import { useAuthStore } from '@/store/store';
import {
  useGetAPIKeyList,
  useCreateAPIKey,
  ApiKey,
  useModifyAPIKey,
  useDeleteAPIKey,
} from '@/hooks/use-apiKeys';
import CommonPagination from '@/components/common-pagination';
import CreateAPIKeyDialog from './components/createAPIKeyDialog';
import ModifyAPIKeyDialog from './components/modifyAPIKeyDialog';
import DeleteAPIKeyDialog from './components/deleteAPIKeyDialog';
import CopyAPIKeyDialog from './components/copyAPIKeyDialog';

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

  // // 비밀번호 복사 함수
  const handleCopyApiKey = (apiKey: string) => {
    setCopyApiKey(apiKey);
    setIsCopyModalOpen(true);
  };

  // 페이지네이션
  const safeFilteredUsers = apiKeyData ?? [];

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const totalPages = Math.ceil(safeFilteredUsers.length / usersPerPage);

  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const currentUsers = safeFilteredUsers?.slice(startIndex, endIndex);

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

        {/* 페이지 헤더 */}
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
            <Button
              onClick={() => setIsCreateModalOpen(!isCreateModalOpen)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg">
              <Plus className="h-4 w-4 mr-2" />
              API Key 생성
            </Button>
          </div>
        </div>

        {/* API Keys 리스트 */}
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
                {filteredApiKeys?.length === 0 ? (
                  <>
                    <TableRow className="dark:bg-blue-900/20 hover:bg-white">
                      <TableCell colSpan={5} className="text-center">
                        생성된 API Key가 존재하지 않습니다.
                      </TableCell>
                    </TableRow>
                  </>
                ) : (
                  <>
                    {filteredApiKeys?.map((apiKey, index) => (
                      <>
                        <TableRow key={index} className="dark:bg-blue-900/20 hover:bg-white">
                          <TableCell className="font-medium text-blue-600">
                            {apiKey.keyId}
                          </TableCell>
                          <TableCell className="font-medium">{apiKey.name}</TableCell>
                          <TableCell>{apiKey.description}</TableCell>
                          <TableCell>{apiKey.updatedAt?.split('T')[0]}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                className="text-white hover:text-white bg-amber-500 hover:bg-amber-500"
                                size="sm"
                                onClick={() => handleCopyApiKey(apiKey.key)}>
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button
                                className="text-white hover:text-white bg-slate-500 hover:bg-slate-500"
                                size="sm"
                                onClick={() => handleEditApiKey(apiKey)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteApiKey(apiKey)}
                                className="hover:bg-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      </>
                    ))}
                  </>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <CommonPagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            groupSize={5}
          />
        )}

        {/* API key 생성 */}
        <CreateAPIKeyDialog
          isCreateModalOpen={isCreateModalOpen}
          setIsCreateModalOpen={setIsCreateModalOpen}
          keyName={newApiKey.keyName}
          newApiKey={newApiKey}
          setNewApiKey={setNewApiKey}
          description={newApiKey.description}
          handleCreateAPIKey={handleCreateAPIKey}
        />

        {/* API key 수정 */}
        <ModifyAPIKeyDialog
          isEditModalOpen={isEditModalOpen}
          setIsEditModalOpen={setIsEditModalOpen}
          setEditingApiKey={setEditingApiKey}
          editingApiKey={editingApiKey}
          handleUpdateApiKey={handleUpdateApiKey}
        />

        {/* API key 삭제 */}
        <DeleteAPIKeyDialog
          isDeleteModalOpen={isDeleteModalOpen}
          setIsDeleteModalOpen={setIsDeleteModalOpen}
          confirmDeleteApiKey={confirmDeleteApiKey}
          deletingApiKey={deletingApiKey}
        />

        {/* API key 복사 */}
        <CopyAPIKeyDialog
          isCopyModalOpen={isCopyModalOpen}
          setIsCopyModalOpen={setIsCopyModalOpen}
          copyApiKey={copyApiKey}
        />
      </div>
    </AppLayout>
  );
}
