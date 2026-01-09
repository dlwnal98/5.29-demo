import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useGetModelList } from "@/hooks/use-model";
import { ModelData } from "@/apis/models.api";
import { useAuthStore } from "@/stores/store";

export function useModelsPage() {
  const [selectedModel, setSelectedModel] = useState<ModelData | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [params] = useSearchParams();
  const apiId = params.get("apiId") || "";
  const userData = useAuthStore((state) => state.user);
  const userKey = userData?.userKey || "";

  const { data: models = [] } = useGetModelList(apiId);

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleOpenEditModal = (model: ModelData) => {
    setSelectedModel(model);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedModel(null);
  };

  const handleOpenDeleteModal = (model: ModelData) => {
    setSelectedModel(model);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedModel(null);
  };

  return {
    // Data
    models,
    selectedModel,
    apiId,
    userKey,
    userData,

    // Modal states
    isCreateModalOpen,
    isEditModalOpen,
    isDeleteModalOpen,

    setSelectedModel,
    setIsCreateModalOpen,
    setIsEditModalOpen,
    setIsDeleteModalOpen,

    // Handlers
    openCreateModal: handleOpenCreateModal,
    closeCreateModal: handleCloseCreateModal,
    openEditModal: handleOpenEditModal,
    closeEditModal: handleCloseEditModal,
    openDeleteModal: handleOpenDeleteModal,
    closeDeleteModal: handleCloseDeleteModal,
  };
}
