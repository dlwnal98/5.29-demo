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
      toast.success('Resource deleted successfully.');
      onOpenChange(false);
    }, onError: (error: any) => {
      const serverMessage = error?.response?.data?.detail ?? 'Resource deletion failed.';
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
