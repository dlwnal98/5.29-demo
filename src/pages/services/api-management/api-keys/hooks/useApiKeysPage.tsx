import { useState, useMemo, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useClipboard } from "use-clipboard-copy";
import { useAuthStore } from "@/stores/store";
import {
  useGetAPIKeyList,
  useCreateAPIKey,
  useDeleteAPIKey,
} from "@/hooks/use-apiKeys";
import {
  ApiKey,
  ApiKeyDetail,
  getAPIKeyDetail,
} from "@/apis/api-keys.api";


interface NewApiKeyForm {
  keyName: string;
  expiresAt?: string;
  description: string;
}

export function useApiKeysPage() {
  const userData = useAuthStore((state) => state.user);
  // const { data: apiKeyData } = useGetAPIKeyList(userData?.tenantId || "");

  const tenantId = userData?.organizationId ?? "kwwwksAsvmas"
  const { data: apiKeyData } = useGetAPIKeyList(tenantId);

  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [deletingApiKey, setDeletingApiKey] = useState<ApiKey | null>(null);
  const [apiKeyDetail, setApiKeyDetail] = useState<ApiKeyDetail | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [copyApiKey, setCopyApiKey] = useState("");
  const [newApiKey, setNewApiKey] = useState<NewApiKeyForm>({
    keyName: "",
    expiresAt: "",
    description: "",
  });
  console.log(newApiKey)

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const clipboard = useClipboard();

  // Flag to navigate to last page after creation
  const pendingNavigateToLastPageRef = useRef(false);

  // API Key 생성
  const { mutate: createAPIKey } = useCreateAPIKey({
    onSuccess: () => {
      setIsCreateModalOpen(false);
      setNewApiKey({ keyName: "", description: "" });
      pendingNavigateToLastPageRef.current = true;
      toast.success("API키가 생성되었습니다.");
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
    // Auto-adjust page range (prevent empty page rendering after deletion)
    const maxPage = Math.max(1, Math.ceil(filteredApiKeys.length / usersPerPage));
    const safePage = Math.min(currentPage, maxPage);
    const startIndex = (safePage - 1) * usersPerPage;
    const endIndex = startIndex + usersPerPage;
    return filteredApiKeys.slice(startIndex, endIndex);
  }, [filteredApiKeys, currentPage]);


  // 검색 시 페이지 초기화
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Validate page range on data change (prevent empty page after deletion)
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  // Navigate to last page after creation
  useEffect(() => {
    if (pendingNavigateToLastPageRef.current && filteredApiKeys.length > 0) {
      pendingNavigateToLastPageRef.current = false;
      const lastPage = Math.ceil(filteredApiKeys.length / usersPerPage);
      setCurrentPage(lastPage);
    }
  }, [filteredApiKeys.length]);

  // Handlers
  const handleCreate = () => {
    console.log(newApiKey)
    createAPIKey({
      tenantId: tenantId ?? "",
      keyName: newApiKey.keyName,
      expiresAt: newApiKey.expiresAt,
      description: newApiKey.description,
      createdBy: userData?.userKey ?? "",
    });
  };

  const handleRefresh = () => {
    toast.success("페이지가 새로고침되었습니다.");
    window.location.reload();
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

  const handleViewDetail = async (apiKey: ApiKey) => {
    setIsDetailModalOpen(true);
    setIsDetailLoading(true);
    setApiKeyDetail(null);
    try {
      const res = await getAPIKeyDetail(apiKey.apiKeyId);
      setApiKeyDetail(res);
    } catch (error) {
      toast.error("API Key 상세 정보를 불러오는데 실패했습니다.");
      setIsDetailModalOpen(false);
    } finally {
      setIsDetailLoading(false);
    }
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setApiKeyDetail(null);
  };

  // 현재 보고 있는 API Key 상세 정보 새로고침
  const handleRefreshDetail = async () => {
    if (!apiKeyDetail) return;

    setIsDetailLoading(true);
    try {
      const res = await getAPIKeyDetail(apiKeyDetail.apiKeyId);
      setApiKeyDetail(res);
    } catch (error) {
      toast.error("API Key 상세 정보를 불러오는데 실패했습니다.");
    } finally {
      setIsDetailLoading(false);
    }
  };

  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    setNewApiKey({ keyName: "", description: "" });
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
    deletingApiKey,
    copyApiKey,
    newApiKey,
    apiKeyDetail,

    // State
    searchTerm,
    currentPage,
    totalPages,
    isCreateModalOpen,
    isDeleteModalOpen,
    isCopyModalOpen,
    isDetailModalOpen,
    isDetailLoading,

    // Setters for forms
    setSearchTerm,
    setCurrentPage,
    setNewApiKey,

    // Handlers
    handleCreate,
    handleRefresh,
    handleDeleteClick,
    handleDeleteConfirm,
    handleCopyApiKey,
    handleViewDetail,
    openCreateModal,
    closeCreateModal,
    closeDeleteModal,
    closeCopyModal,
    closeDetailModal,
    handleRefreshDetail,
  };
}
