import { useState, useMemo, useEffect } from "react";
import { toast } from "sonner";
import { useClipboard } from "use-clipboard-copy";
import { useAuthStore } from "@/stores/store";
import {
  useGetAPIKeyList,
  useCreateAPIKey,
  useModifyAPIKey,
  useDeleteAPIKey,

} from "@/hooks/use-apiKeys";
import {
  ApiKey,
  getAPIKeyDetail,
} from "@/apis/api-keys.api";


interface NewApiKeyForm {
  keyName: string;
  description: string;
}

export function useApiKeysPage() {
  const userData = useAuthStore((state) => state.user);
  // const { data: apiKeyData } = useGetAPIKeyList(userData?.tenantId || "");

  const tenantId = userData?.organizationId ?? "kwwwksAsvmas"
  const { data: apiKeyData } = useGetAPIKeyList(tenantId);

  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);
  const [editingApiKey, setEditingApiKey] = useState<ApiKey | null>(null);
  const [deletingApiKey, setDeletingApiKey] = useState<ApiKey | null>(null);
  const [copyApiKey, setCopyApiKey] = useState("");
  const [newApiKey, setNewApiKey] = useState<NewApiKeyForm>({
    keyName: "",
    description: "",
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const clipboard = useClipboard();

  // API Key 생성
  const { mutate: createAPIKey } = useCreateAPIKey({
    onSuccess: () => {
      setIsCreateModalOpen(false);
      setNewApiKey({ keyName: "", description: "" });
      toast.success("API키가 생성되었습니다.");
    },
  });

  // API Key 수정
  const { mutate: modifyAPIKey } = useModifyAPIKey({
    onSuccess: () => {
      setIsEditModalOpen(false);
      toast.success("API키가 수정되었습니다.");
    },
  });

  // API Key 삭제
  const { mutate: deleteAPIKey } = useDeleteAPIKey({
    onSuccess: () => {
      setIsDeleteModalOpen(false);
      toast.success("API키가 삭제되었습니다.");
    }, onError: (error: any) => {
      const errorMessage = error?.response?.data?.message
        || error?.response?.data?.detail
        || error?.message
        || 'API키 삭제 중 오류가 발생했습니다.';
      toast.error(errorMessage);
    },
  });

  // 검색 필터링
  const filteredApiKeys = useMemo(() => {
    if (!apiKeyData) return [];
    return apiKeyData.filter(
      (apiKey) =>
        apiKey.keyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apiKey.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [apiKeyData, searchTerm]);

  // 페이지네이션
  const totalPages = Math.ceil(filteredApiKeys.length / usersPerPage);
  const currentApiKeys = useMemo(() => {
    const startIndex = (currentPage - 1) * usersPerPage;
    const endIndex = startIndex + usersPerPage;
    return filteredApiKeys.slice(startIndex, endIndex);
  }, [filteredApiKeys, currentPage]);


  // 검색 시 페이지 초기화
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Handlers
  const handleCreate = () => {
    console.log(tenantId, newApiKey, userData?.userKey)
    createAPIKey({
      tenantId: tenantId ?? "",
      keyName: newApiKey.keyName,
      description: newApiKey.description,
      createdBy: userData?.userKey ?? "",
    });
  };

  const handleRefresh = () => {
    toast.success("페이지가 새로고침되었습니다.");
    window.location.reload();
  };

  const handleEdit = (apiKey: ApiKey) => {
    setEditingApiKey({ ...apiKey });
    setIsEditModalOpen(true);
  };

  const handleUpdate = (apiKeyId: string, keyName: string, description: string) => {
    modifyAPIKey({ apiKeyId, keyName, description, expiresAt: new Date().toISOString(), updatedBy: userData?.userKey ?? "" });
  };

  const handleDeleteClick = (apiKey: ApiKey) => {
    setDeletingApiKey(apiKey);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = (keyId: string) => {
    deleteAPIKey(keyId);
  };

  const handleCopyApiKey = async (apiKeyName: string, keyId: string) => {
    const res = await getAPIKeyDetail(keyId)
    setCopyApiKey(res.keyValue);
    clipboard.copy(res.keyValue);
    toast.success(
      <>
        [{apiKeyName}] API Key가 복사되었습니다. <br />
        http(s) 헤더에 <b>X-API-Key</b> 항목을 추가하여 <br />
        복사된 키 값을 넣어 요청하면 됩니다.
      </>
    );
  };

  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    setNewApiKey({ keyName: "", description: "" });
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingApiKey(null);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingApiKey(null);
  };

  const closeCopyModal = () => setIsCopyModalOpen(false);

  return {
    // Data
    currentApiKeys,
    filteredApiKeys,
    editingApiKey,
    deletingApiKey,
    copyApiKey,
    newApiKey,

    // State
    searchTerm,
    currentPage,
    totalPages,
    isCreateModalOpen,
    isEditModalOpen,
    isDeleteModalOpen,
    isCopyModalOpen,

    // Setters for forms
    setSearchTerm,
    setCurrentPage,
    setNewApiKey,
    setEditingApiKey,

    // Handlers
    handleCreate,
    handleRefresh,
    handleEdit,
    handleUpdate,
    handleDeleteClick,
    handleDeleteConfirm,
    handleCopyApiKey,
    openCreateModal,
    closeCreateModal,
    closeEditModal,
    closeDeleteModal,
    closeCopyModal,
  };
}
