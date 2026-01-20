import { useDeleteEndpointDialog } from "./hooks/useDeleteEndpointDialog";
import DeleteEndpointDialogView from "./DeleteEndpointDialogView";

interface DeleteEndpointDialogProps {
  isDeleteModalOpen: boolean;
  handleModalClose: () => void;
  id: string;
  routeUrl: string;
}

export default function DeleteEndpointDialog({
  isDeleteModalOpen,
  handleModalClose,
  id,
  routeUrl,
}: DeleteEndpointDialogProps) {
  const { onDelete } = useDeleteEndpointDialog({
    id,
    onClose: handleModalClose,
  });

  return (
    <>
      <DeleteEndpointDialogView
        isOpen={isDeleteModalOpen}
        routeUrl={routeUrl}
        onClose={handleModalClose}
        onDelete={onDelete}
      />
    </>
  );
}
