import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/store";
import { setSelectedApiInfo } from "@/constants/app-layout-data";
import { useGetAPIList } from "@/hooks/use-apimanagement";
import { getAPIDocForExport } from "@/apis/api-management.api";
import { APIListData } from "@/apis/api-management.api";

interface ModifyApiForm {
  name: string;
  description: string;
}

export function useApiManagementPage() {
  const userData = useAuthStore((state) => state.user);
  const userKey = userData?.userKey || "";
  // const organizationId = userData?.organizationId || "";
  const tenantId = userData?.organizationId ?? "kwwwksAsvmas";

  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [selectedApiName, setSelectedApiName] = useState("");
  const [selectedAPIId, setSelectedAPIId] = useState("");
  const [modifyApiForm, setModifyApiForm] = useState<ModifyApiForm>({
    name: "",
    description: "",
  });

  const [currentPage, setCurrentPage] = useState(0);
  const usersPerPage = 20;

  const { data: apisData } = useGetAPIList(tenantId, currentPage, usersPerPage);
  console.log(apisData)
  const filteredPlans = useMemo(() => {
    return (apisData?.content ?? []).filter(
      (plan) =>
        plan?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        plan?.apiId?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        plan?.description?.toLowerCase()?.includes(searchTerm?.toLowerCase())
    );
  }, [apisData, searchTerm]);

  const totalPages = Math.ceil(filteredPlans.length / usersPerPage);

  const handleApiClick = useCallback(
    (api: APIListData) => {
      setSelectedApiInfo(api.name, api.apiId);
      setSelectedAPIId(api.apiId);
      navigate(
        `/services/api-management/resources?apiId=${api.apiId}&apiName=${api.name}`
      );
    },
    [navigate]
  );

  const handleOpenCreateModal = useCallback(() => {
    setIsCreateModalOpen(true);
  }, []);

  const handleCloseCreateModal = useCallback(() => {
    setIsCreateModalOpen(false);
  }, []);

  const handleOpenModifyModal = useCallback((api: APIListData) => {
    setIsModifyModalOpen(true);
    setModifyApiForm({
      name: api.name,
      description: api.description,
    });
    setSelectedAPIId(api.apiId);
  }, []);

  const handleCloseModifyModal = useCallback(() => {
    setIsModifyModalOpen(false);
  }, []);

  const handleOpenDeleteModal = useCallback((api: APIListData) => {
    setSelectedAPIId(api.apiId);
    setSelectedApiName(api.name);
    setIsDeleteModalOpen(true);
  }, []);

  const handleCloseDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(false);
  }, []);

  const handleOpenExportModal = useCallback((api: APIListData) => {
    setSelectedAPIId(api.apiId);
    setSelectedApiName(api.name);
    setIsExportModalOpen(true);
  }, []);

  const handleCloseExportModal = useCallback(() => {
    setIsExportModalOpen(false);
  }, []);

  const handleSearchTermChange = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  const handleApiExport = async (apiId: string, format?: 'OPENAPI_JSON' | 'OPENAPI_YAML' | 'POSTMAN', includeModels?: boolean, includeExtensions?: boolean) => {
    const res = await getAPIDocForExport(apiId, format, includeModels, includeExtensions);
    console.log(res);
    return res;
  }


  return {
    // Data
    userKey,
    tenantId,
    searchTerm,
    filteredPlans,
    currentPage,
    totalPages,
    selectedAPIId,
    selectedApiName,
    modifyApiForm,

    // Modal states
    isCreateModalOpen,
    isModifyModalOpen,
    isDeleteModalOpen,
    isExportModalOpen,

    // Setters
    setCurrentPage,

    // Handlers
    onApiClick: handleApiClick,
    onSearchTermChange: handleSearchTermChange,
    onOpenCreateModal: handleOpenCreateModal,
    onCloseCreateModal: handleCloseCreateModal,
    onOpenModifyModal: handleOpenModifyModal,
    onCloseModifyModal: handleCloseModifyModal,
    onOpenDeleteModal: handleOpenDeleteModal,
    onCloseDeleteModal: handleCloseDeleteModal,
    onAPIExport: handleApiExport,
    onOpenExportModal: handleOpenExportModal,
    onCloseExportModal: handleCloseExportModal,
  };
}
