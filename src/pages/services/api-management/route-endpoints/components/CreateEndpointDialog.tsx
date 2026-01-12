import { Toaster } from "sonner";
import { useCreateEndpointDialog } from "./hooks/useCreateEndpointDialog";
import CreateEndpointDialogView from "./CreateEndpointDialogView";

interface CreateEndpointDialogProps {
  isCreateModalOpen: boolean;
  handleModalClose: () => void;
  tenantId: string;
  createdBy: string;
}

export default function CreateEndpointDialog({
  isCreateModalOpen,
  handleModalClose,
  tenantId,
  createdBy,
}: CreateEndpointDialogProps) {
  const {
    routeUrl,
    routeName,
    description,
    hasUrlError,
    isSubmitDisabled,
    onRouteUrlChange,
    onRouteNameChange,
    onDescriptionChange,
    onSubmit,
  } = useCreateEndpointDialog({
    tenantId,
    createdBy,
    onClose: handleModalClose,
  });

  return (
    <>
      <CreateEndpointDialogView
        isOpen={isCreateModalOpen}
        routeUrl={routeUrl}
        routeName={routeName}
        description={description}
        hasUrlError={hasUrlError}
        isSubmitDisabled={isSubmitDisabled}
        onClose={handleModalClose}
        onRouteUrlChange={onRouteUrlChange}
        onRouteNameChange={onRouteNameChange}
        onDescriptionChange={onDescriptionChange}
        onSubmit={onSubmit}
      />
    </>
  );
}
