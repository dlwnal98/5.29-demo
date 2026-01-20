import { useModifyEndpointDialog } from "./hooks/useModifyEndpointDialog";
import ModifyEndpointDialogView from "./ModifyEndpointDialogView";

interface FormData {
  id: string;
  routeName: string;
  routeUrl: string;
  description: string;
}

interface ModifyEndpointDialogProps {
  isEditModalOpen: boolean;
  formData: FormData;
  handleModalClose: () => void;
  updatedBy: string;
  id: string;
}

export default function ModifyEndpointDialog({
  isEditModalOpen,
  formData,
  handleModalClose,
  updatedBy,
  id,
}: ModifyEndpointDialogProps) {
  const {
    routeName,
    routeUrl,
    description,
    hasUrlError,
    onRouteNameChange,
    onRouteUrlChange,
    onDescriptionChange,
    onSubmit,
  } = useModifyEndpointDialog({
    formData,
    id,
    updatedBy,
    onClose: handleModalClose,
  });

  return (
    <>
      <ModifyEndpointDialogView
        isOpen={isEditModalOpen}
        routeName={routeName}
        routeUrl={routeUrl}
        description={description}
        hasUrlError={hasUrlError}
        onClose={handleModalClose}
        onRouteNameChange={onRouteNameChange}
        onRouteUrlChange={onRouteUrlChange}
        onDescriptionChange={onDescriptionChange}
        onSubmit={onSubmit}
      />
    </>
  );
}
