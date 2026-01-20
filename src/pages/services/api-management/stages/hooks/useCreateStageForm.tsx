import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useCreateStage } from '@/hooks/use-stages';

interface UseCreateStageFormProps {
  open: boolean;
  tenantId: string;
  userKey: string;
  apiId: string;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  deploymentHistoryData: any;
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
  onSuccess,
  deploymentHistoryData,
}: UseCreateStageFormProps) {
  const [createStageForm, setCreateStageForm] = useState({
    name: '',
    description: '',
  });

  const [selectedDeploymentRecord, setSelectedDeploymentRecord] = useState('');

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
      toast.success('Stage created successfully.');
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (error: any) => {
      setCreateStageForm({ name: '', description: '' });
      setSelectedDeploymentRecord('');
      const serverMessage =
        error?.response?.data?.message ?? 'Stage creation failed.';
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
