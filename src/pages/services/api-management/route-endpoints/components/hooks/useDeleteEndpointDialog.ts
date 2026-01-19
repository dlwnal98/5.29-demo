import { useDeleteEndpoint } from "@/hooks/use-endpoints";
import { toast } from "sonner";

interface UseDeleteEndpointDialogProps {
  id: string;
  onClose: () => void;
}

export function useDeleteEndpointDialog({
  id,
  onClose,
}: UseDeleteEndpointDialogProps) {
  const { mutate: deleteEndpoint } = useDeleteEndpoint({
    onSuccess: () => {
      toast.success("Endpoint deleted successfully.");
      onClose();
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message
        || error?.response?.data?.detail
        || error?.message
        || 'Endpoint deletion failed.';
      toast.error(errorMessage);
    },
  });

  const handleDelete = () => {
    if (id) {
      deleteEndpoint(id);
    }
  };

  return {
    onDelete: handleDelete,
  };
}
