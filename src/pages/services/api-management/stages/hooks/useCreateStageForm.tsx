import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useCreateStage, useGetDeployHistoryData } from '@/hooks/use-stages';

interface UseCreateStageFormProps {
  open: boolean;
  tenantId: string;
  userKey: string;
  apiId: string;
  onOpenChange: (open: boolean) => void;
}

/**
 * CreateStageDialog의 폼 상태 및 비즈니스 로직을 관리하는 hook
 */
export function useCreateStageForm({
  open,
  tenantId,
  userKey,
  apiId,
  onOpenChange,
}: UseCreateStageFormProps) {
  const [createStageForm, setCreateStageForm] = useState({
    name: '',
    description: '',
  });

  const [selectedDeploymentRecord, setSelectedDeploymentRecord] = useState('');

  // 배포 기록 데이터 가져오기
  const { data: deploymentHistoryData } = useGetDeployHistoryData(
    tenantId || '',
    0,
    20
  );

  // 모달이 열릴 때마다 폼 초기화
  useEffect(() => {
    if (open) {
      setCreateStageForm({ name: '', description: '' });
      setSelectedDeploymentRecord('');
    }
  }, [open]);

  // 스테이지 생성 mutation
  const { mutate: createStage } = useCreateStage({
    onSuccess: () => {
      setCreateStageForm({ name: '', description: '' });
      setSelectedDeploymentRecord('');
      toast.success('스테이지가 생성되었습니다.');
      onOpenChange(false);
    },
    onError: (error: any) => {
      setCreateStageForm({ name: '', description: '' });
      setSelectedDeploymentRecord('');
      const serverMessage =
        error?.response?.data?.message ?? '스테이지가 생성에 실패하였습니다.';
      toast.error(serverMessage);
    },
  });

  // 스테이지 생성 핸들러
  const handleCreateStage = () => {
    createStage({
      stageName: createStageForm.name,
      description: createStageForm.description,
      deploymentId: selectedDeploymentRecord || '',
      createdBy: userKey,
      apiId,
    });
  };

  // 폼 초기화 핸들러
  const handleResetForm = () => {
    setCreateStageForm({ name: '', description: '' });
    setSelectedDeploymentRecord('');
  };

  return {
    // 폼 상태
    createStageForm,
    setCreateStageForm,
    selectedDeploymentRecord,
    setSelectedDeploymentRecord,
    deploymentHistoryData,

    // 핸들러
    handleCreateStage,
    handleResetForm,

    // 검증
    isValid: !!selectedDeploymentRecord && !!createStageForm.name,
  };
}
