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
      toast.success("endpoint가 삭제되었습니다.");
      onClose();
    },
    onError: () => {
      toast.error("endpoint를 삭제하는 데 실패하였습니다.");
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
