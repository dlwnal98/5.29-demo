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
    tenantId,
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
        tenantId={tenantId}
        createdBy={userKey}
      />

      {/* Endpoint 수정 */}
      <ModifyEndpointDialog
        isEditModalOpen={isEditModalOpen}
        formData={formData}
        handleModalClose={closeModals}
        updatedBy={userKey}
        id={formData.id}
      />

      {/* Endpoint 삭제 */}
      <DeleteEndpointDialog
        isDeleteModalOpen={isDeleteModalOpen}
        handleModalClose={closeModals}
        id={selectedEndpoint.id}
        routeUrl={selectedEndpoint.routeUrl}
      />
    </>
  );
}
