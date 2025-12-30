import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useModifyStage } from '@/hooks/use-stages';

interface UseModifyStageFormProps {
  selectedStage: {
    name: string;
    description: string;
    stageId: string;
  };
  onOpenChange: (open: boolean) => void;
}

/**
 * ModifyStageDialog의 폼 상태 및 비즈니스 로직을 관리하는 hook
 */
export function useModifyStageForm({
  selectedStage,
  onOpenChange,
}: UseModifyStageFormProps) {
  const [editForm, setEditForm] = useState({
    name: selectedStage.name,
    description: selectedStage.description,
    apiCacheEnabled: false,
    methodLevelCacheEnabled: false,
    throttlingEnabled: false,
    wafProfile: '없음',
    clientCertificate: '없음',
  });

  // selectedStage가 변경될 때마다 폼 업데이트
  useEffect(() => {
    if (selectedStage) {
      setEditForm((prev) => ({
        ...prev,
        name: selectedStage.name,
        description: selectedStage.description,
      }));
    }
  }, [selectedStage]);

  // 스테이지 수정 mutation
  const { mutate: modifyStage } = useModifyStage({
    onSuccess: () => {
      toast.success('스테이지가 수정되었습니다.');
      onOpenChange(false);
    },
    onError: () => {
      toast.error('스테이지를 수정하는 데에 실패하였습니다.');
    },
  });

  // 스테이지 수정 핸들러
  const handleEditSave = () => {
    if (selectedStage) {
      modifyStage({
        stageId: selectedStage.stageId,
        description: editForm.description,
      });
    }
  };

  return {
    // 폼 상태
    editForm,
    setEditForm,

    // 핸들러
    handleEditSave,

    // 검증
    isValid: !!editForm.description,
  };
}
