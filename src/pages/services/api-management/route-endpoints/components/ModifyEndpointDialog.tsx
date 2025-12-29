import { Toaster } from "sonner";
import { useModifyEndpointDialog } from "./hooks/useModifyEndpointDialog";
import ModifyEndpointDialogView from "./ModifyEndpointDialogView";

interface FormData {
  targetId: string;
  url: string;
  description: string;
}

interface ModifyEndpointDialogProps {
  isEditModalOpen: boolean;
  formData: FormData;
  handleModalClose: () => void;
  updatedBy: string;
  targetId: string;
}

export default function ModifyEndpointDialog({
  isEditModalOpen,
  formData,
  handleModalClose,
  updatedBy,
  targetId,
}: ModifyEndpointDialogProps) {
  const {
    url,
    description,
    hasUrlError,
    onUrlChange,
    onDescriptionChange,
    onSubmit,
  } = useModifyEndpointDialog({
    formData,
    targetId,
    updatedBy,
    onClose: handleModalClose,
  });

  return (
    <>
      <Toaster position="bottom-center" richColors expand={true} />
      <ModifyEndpointDialogView
        isOpen={isEditModalOpen}
        url={url}
        description={description}
        hasUrlError={hasUrlError}
        onClose={handleModalClose}
        onUrlChange={onUrlChange}
        onDescriptionChange={onDescriptionChange}
        onSubmit={onSubmit}
      />
    </>
  );
}
