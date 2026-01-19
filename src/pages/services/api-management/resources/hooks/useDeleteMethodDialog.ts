import { useDeleteMethod } from '@/hooks/use-methods';
import { toast } from 'sonner';
import type { Method, Resource } from '@/types/resource';

interface UseDeleteMethodDialogProps {
  methodToDelete: Method | null;
  userKey: string;
  onOpenChange: (open: boolean) => void;
  setSelectedResource: (resource: Resource | ((prev: Resource) => Resource)) => void;
  onMethodDeleted?: () => void;
}

export function useDeleteMethodDialog({
  methodToDelete,
  userKey,
  onOpenChange,
  setSelectedResource,
  onMethodDeleted,
}: UseDeleteMethodDialogProps) {
  const { mutate: deleteMethod, isPending } = useDeleteMethod({
    onSuccess: () => {
      if (methodToDelete) {
        toast.success(`Method '${methodToDelete.type} ${methodToDelete.resourcePath}' deleted successfully.`);
        setSelectedResource((prev: Resource) => {
          if (!prev) return prev;
          return {
            ...prev,
            methods: prev.methods.filter(
              (m) => m.info['x-method-id'] !== methodToDelete.info['x-method-id']
            ),
          };
        });
      }
      onMethodDeleted?.();
      onOpenChange(false);
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message
        || error?.response?.data?.detail
        || error?.message
        || 'Method deletion failed.';
      toast.error(errorMessage);
    },
  });

  const handleDeleteMethod = () => {
    if (methodToDelete) {
      deleteMethod({ methodId: methodToDelete.info['x-method-id'], userKey });
    }
  };

  return {
    isPending,
    onDeleteMethod: handleDeleteMethod,
  };
}
