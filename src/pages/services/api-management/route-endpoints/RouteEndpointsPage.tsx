import { AppLayout } from '@/components/layout/AppLayout';
import CreateEndpointDialog from './components/CreateEndpointDialog';
import ModifyEndpointDialog from './components/ModifyEndpointDialog';
import DeleteEndpointDialog from './components/DeleteEndpointDialog';
import { useRouteEndpoints } from './hooks/useRouteEndpoints';
import RouteEndpointsPageView from './RouteEndpointsPageView';

export default function RouteEndpointsPage() {
  const {
    filteredEndpoints,
    formData,
    selectedEndpoint,
    isCreateModalOpen,
    isEditModalOpen,
    isDeleteModalOpen,
    organizationId,
    userKey,
    searchTerm,
    setSearchTerm,
    handleCreate,
    handleEdit,
    handleDelete,
    closeModals,
  } = useRouteEndpoints();

  return (
    <>
      <RouteEndpointsPageView
        searchTerm={searchTerm}
        filteredEndpoints={filteredEndpoints}
        onSearchTermChange={setSearchTerm}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Endpoint 생성 */}
      <CreateEndpointDialog
        isCreateModalOpen={isCreateModalOpen}
        handleModalClose={closeModals}
        organizationId={organizationId}
        createdBy={userKey}
      />

      {/* Endpoint 수정 */}
      <ModifyEndpointDialog
        isEditModalOpen={isEditModalOpen}
        formData={formData}
        handleModalClose={closeModals}
        updatedBy={userKey}
        targetId={formData.targetId}
      />

      {/* Endpoint 삭제 */}
      <DeleteEndpointDialog
        isDeleteModalOpen={isDeleteModalOpen}
        handleModalClose={closeModals}
        targetId={selectedEndpoint.id}
        targetUrl={selectedEndpoint.url}
      />
    </>
  );
}
