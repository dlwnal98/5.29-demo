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
        toast.success(`메서드 '${methodToDelete.type} ${methodToDelete.resourcePath}' 삭제됨.`);
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
