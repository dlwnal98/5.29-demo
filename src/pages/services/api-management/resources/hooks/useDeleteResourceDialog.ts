import { useDeleteResource } from '@/hooks/use-resources';
import { toast } from 'sonner';

interface UseDeleteResourceDialogProps {
  apiId: string;
  resourceId: string;
  onOpenChange: (open: boolean) => void;
  setCreatedResourceId: React.Dispatch<React.SetStateAction<string>>;
  onResourceDeleted?: () => void;
}

export function useDeleteResourceDialog({
  apiId,
  resourceId,
  onOpenChange,
  setCreatedResourceId,
  onResourceDeleted,
}: UseDeleteResourceDialogProps) {
  const { mutate: deleteResource, isPending } = useDeleteResource({
    onSuccess: () => {
      setCreatedResourceId('');
      onResourceDeleted?.();
      toast.success('Resource가 삭제되었습니다.');
      onOpenChange(false);
    }, onError: (error: any) => {
      const serverMessage = error?.response?.data?.detail ?? 'Resource 삭제 중 오류가 발생했습니다.';
      toast.error(serverMessage);
    },
  });

  const handleDeleteResource = () => {
    deleteResource({ apiId, resourceId });
  };

  return {
    isPending,
    onDeleteResource: handleDeleteResource,
  };
}
