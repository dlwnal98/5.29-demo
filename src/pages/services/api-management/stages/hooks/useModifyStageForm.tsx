import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useModifyStage } from '@/hooks/use-stages';

interface UseModifyStageFormProps {
  stageDetailData: any;
  userKey: string;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

/**
 * ModifyStageDialog의 폼 상태 및 비즈니스 로직을 관리하는 hook
 */
export function useModifyStageForm({
  stageDetailData,
  userKey,
  onOpenChange,
  onSuccess,
}: UseModifyStageFormProps) {
  const [editForm, setEditForm] = useState({
    name: stageDetailData?.stageName,
    description: stageDetailData?.description,
  });

  // selectedStage가 변경될 때마다 폼 업데이트
  useEffect(() => {
    if (stageDetailData) {
      setEditForm((prev) => ({
        ...prev,
        name: stageDetailData.stageName,
        description: stageDetailData.description,
      }));
    }
  }, [stageDetailData]);

  // 스테이지 수정 mutation
  const { mutate: modifyStage } = useModifyStage({
    onSuccess: () => {
      toast.success('Stage가 성공적으로 수정되었습니다.');
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (error: any) => {
      // toast.error('Stage 수정 중 오류가 발생했습니다.');
      toast.error(error.message)

    },
  });

  // 스테이지 수정 핸들러
  const handleEditSave = () => {
    if (stageDetailData) {
      modifyStage({
        stageId: stageDetailData.stageId,
        data: {
          description: editForm.description,
          updatedBy: userKey,
        }
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
