import { Toaster } from "sonner";
import { useCreateEndpointDialog } from "./hooks/useCreateEndpointDialog";
import CreateEndpointDialogView from "./CreateEndpointDialogView";

interface CreateEndpointDialogProps {
  isCreateModalOpen: boolean;
  handleModalClose: () => void;
  organizationId: string;
  createdBy: string;
}

export default function CreateEndpointDialog({
  isCreateModalOpen,
  handleModalClose,
  organizationId,
  createdBy,
}: CreateEndpointDialogProps) {
  const {
    url,
    description,
    hasUrlError,
    isSubmitDisabled,
    onUrlChange,
    onDescriptionChange,
    onSubmit,
  } = useCreateEndpointDialog({
    organizationId,
    createdBy,
    onClose: handleModalClose,
  });

  return (
    <>
      <CreateEndpointDialogView
        isOpen={isCreateModalOpen}
        url={url}
        description={description}
        hasUrlError={hasUrlError}
        isSubmitDisabled={isSubmitDisabled}
        onClose={handleModalClose}
        onUrlChange={onUrlChange}
        onDescriptionChange={onDescriptionChange}
        onSubmit={onSubmit}
      />
    </>
  );
}
