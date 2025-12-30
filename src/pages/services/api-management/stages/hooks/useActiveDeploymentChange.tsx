import { toast } from 'sonner';
import { useActivatePreviousDeployment } from '@/hooks/use-stages';

interface UseActiveDeploymentChangeProps {
  userKey: string;
  selectedStage: {
    stageId?: string;
    name?: string;
  };
  selectedDeploymentId: string | null;
  onOpenChange: (open: boolean) => void;
  setSelectedDeploymentId: (value: string | null) => void;
}

/**
 * ActiveDeploymentChangeDialog의 비즈니스 로직을 관리하는 hook
 */
export function useActiveDeploymentChange({
  userKey,
  selectedStage,
  selectedDeploymentId,
  onOpenChange,
  setSelectedDeploymentId,
}: UseActiveDeploymentChangeProps) {
  // 배포 활성화 mutation
  const { mutate: changeDeployment } = useActivatePreviousDeployment({
    onSuccess: () => {
      toast.success('배포가 성공적으로 변경되었습니다.');
      onOpenChange(false);
      setSelectedDeploymentId(null);
    },
    onError: () => {
      toast.error('배포 변경에 실패하였습니다.');
    },
  });

  // 활성 배포 변경 핸들러
  const confirmActiveDeploymentChange = () => {
    if (selectedStage.stageId && selectedDeploymentId) {
      changeDeployment({
        stageId: selectedStage.stageId,
        targetDeploymentId: selectedDeploymentId,
        activatedBy: userKey || '',
      });
    }
  };

  return {
    confirmActiveDeploymentChange,
  };
}
