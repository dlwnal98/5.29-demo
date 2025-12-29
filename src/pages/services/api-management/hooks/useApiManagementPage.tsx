import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/store";
import { setSelectedApiInfo } from "@/constants/app-layout-data";
import { useGetAPIList, APIListData } from "@/hooks/use-apimanagement";

interface ModifyApiForm {
  name: string;
  description: string;
}

export function useApiManagementPage() {
  const userData = useAuthStore((state) => state.user);
  const userKey = userData?.userKey || "";
  const organizationId = userData?.organizationId || "";
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedApiName, setSelectedApiName] = useState("");
  const [selectedAPIId, setSelectedAPIId] = useState("");
  const [modifyApiForm, setModifyApiForm] = useState<ModifyApiForm>({
    name: "",
    description: "",
  });

  const [currentPage, setCurrentPage] = useState(0);
  const usersPerPage = 20;

  const { data: apisData } = useGetAPIList(organizationId, currentPage, usersPerPage);

  const filteredPlans = useMemo(() => {
    return (apisData ?? []).filter(
      (plan) =>
        plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.apiId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.description.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleSearchTermChange = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  return {
    // Data
    userKey,
    organizationId,
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
  };
}
