import { useAuthStore } from "@/store/store";
import { useState } from "react";
import { useGetEndpointsList, EndpointsData } from "@/hooks/use-endpoints";

interface FormData {
  targetId: string;
  url: string;
  description: string;
}

export function useRouteEndpoints() {
  const userData = useAuthStore((state) => state.user);
  const { data: endpoints = [] } = useGetEndpointsList(
    userData?.organizationId || ""
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEndpoint, setSelectedEndpoint] = useState<{
    id: string;
    url: string;
  }>({ id: "", url: "" });
  const [formData, setFormData] = useState<FormData>({
    targetId: "",
    url: "",
    description: "",
  });

  const filteredEndpoints = endpoints?.filter(
    (endpoint) =>
      endpoint.targetId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      endpoint.routeEndpoint.toLowerCase().includes(searchTerm.toLowerCase()) ||
      endpoint.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    setFormData({ targetId: "", url: "", description: "" });
    setIsCreateModalOpen(true);
  };

  const handleEdit = (endpoint: EndpointsData) => {
    setFormData({
      targetId: endpoint.targetId,
      url: endpoint.routeEndpoint,
      description: endpoint.description,
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = (endpoint: EndpointsData) => {
    setSelectedEndpoint({
      id: endpoint.targetId,
      url: endpoint.routeEndpoint,
    });
    setIsDeleteModalOpen(true);
  };

  const closeModals = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setFormData({ targetId: "", url: "", description: "" });
    setSelectedEndpoint({ id: "", url: "" });
  };

  return {
    // Data
    filteredEndpoints,
    formData,
    selectedEndpoint,

    // Modal states (read-only)
    isCreateModalOpen,
    isEditModalOpen,
    isDeleteModalOpen,

    // User data for dialogs
    organizationId: userData?.organizationId || "",
    userKey: userData?.userKey || "",

    // Handlers
    searchTerm,
    setSearchTerm,
    handleCreate,
    handleEdit,
    handleDelete,
    closeModals,
  };
}
