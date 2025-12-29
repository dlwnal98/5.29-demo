import { useDeleteResource } from '@/hooks/use-resources';
import { toast } from 'sonner';

interface UseDeleteResourceDialogProps {
  resourceId: string;
  onOpenChange: (open: boolean) => void;
  setCreatedResourceId: React.Dispatch<React.SetStateAction<string>>;
  onResourceDeleted?: () => void;
}

export function useDeleteResourceDialog({
  resourceId,
  onOpenChange,
  setCreatedResourceId,
  onResourceDeleted,
}: UseDeleteResourceDialogProps) {
  const { mutate: deleteResource, isPending } = useDeleteResource({
    onSuccess: () => {
      setCreatedResourceId('');
      onResourceDeleted?.();
      toast.success('리소스가 삭제되었습니다');
      onOpenChange(false);
    },
  });

  const handleDeleteResource = () => {
    deleteResource(resourceId);
  };

  return {
    isPending,
    onDeleteResource: handleDeleteResource,
  };
}
