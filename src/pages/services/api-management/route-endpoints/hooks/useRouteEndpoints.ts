import { useAuthStore } from "@/stores/store";
import { useState } from "react";
import { useGetEndpointsList } from "@/hooks/use-endpoints";
import { EndpointsData } from "@/apis/route-endpoints.api"

interface FormData {
  id: string;
  routeName: string;
  routeUrl: string;
  description: string;
}

export function useRouteEndpoints() {

  const userData = useAuthStore((state) => state.user);
  const tenantId = userData?.organizationId || "kwwwksAsvmas"

  const { data: endpoints = [] } = useGetEndpointsList(
    tenantId
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEndpoint, setSelectedEndpoint] = useState<{
    id: string;
    routeName: string;
    routeUrl: string;
    description: string;
  }>({ id: "", routeName: "", routeUrl: "", description: "" });
  const [formData, setFormData] = useState<FormData>({
    id: "",
    routeName: "",
    routeUrl: "",
    description: "",
  });

  const filteredEndpoints = endpoints?.filter(
    (endpoint) =>
      endpoint.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      endpoint.routeUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
      endpoint.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    setFormData({ id: "", routeName: "", routeUrl: "", description: "" });
    setIsCreateModalOpen(true);
  };

  const handleEdit = (endpoint: EndpointsData) => {
    setFormData({
      id: endpoint.id,
      routeName: endpoint.routeName,
      routeUrl: endpoint.routeUrl,
      description: endpoint.description,
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = (endpoint: EndpointsData) => {
    setSelectedEndpoint({
      id: endpoint.id,
      routeName: endpoint.routeName,
      routeUrl: endpoint.routeUrl,
      description: endpoint.description,
    });
    setIsDeleteModalOpen(true);
  };

  const closeModals = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setFormData({ id: "", routeName: "", routeUrl: "", description: "" });
    setSelectedEndpoint({ id: "", routeName: "", routeUrl: "", description: "" });
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
    tenantId,
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
