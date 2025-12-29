import { Toaster } from "sonner";
import { useDeleteEndpointDialog } from "./hooks/useDeleteEndpointDialog";
import DeleteEndpointDialogView from "./DeleteEndpointDialogView";

interface DeleteEndpointDialogProps {
  isDeleteModalOpen: boolean;
  handleModalClose: () => void;
  targetId: string;
  targetUrl: string;
}

export default function DeleteEndpointDialog({
  isDeleteModalOpen,
  handleModalClose,
  targetId,
  targetUrl,
}: DeleteEndpointDialogProps) {
  const { onDelete } = useDeleteEndpointDialog({
    targetId,
    onClose: handleModalClose,
  });

  return (
    <>
      <Toaster position="bottom-center" richColors expand={true} />
      <DeleteEndpointDialogView
        isOpen={isDeleteModalOpen}
        targetUrl={targetUrl}
        onClose={handleModalClose}
        onDelete={onDelete}
      />
    </>
  );
}
