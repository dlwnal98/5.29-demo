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
      toast.success("Endpoint가 삭제되었습니다.");
      onClose();
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message
        || error?.response?.data?.detail
        || error?.message
        || 'Endpoint 삭제 중 오류가 발생했습니다.';
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
