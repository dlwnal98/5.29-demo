import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useCreateStage } from '@/hooks/use-stages';
import { useQueryClient } from '@tanstack/react-query';
import { useDeployAPI } from '@/hooks/use-resources';
import { getStagesListData } from '@/apis/stages.api';

interface UseCreateStageFormProps {
  open: boolean;
  tenantId: string;
  userKey: string;
  apiId: string;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (stageId?: string) => void;
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
  const queryClient = useQueryClient();

  const [createStageForm, setCreateStageForm] = useState({
    name: '',
    description: '',
    deploymentReason: '',
  });

  const [selectedDeploymentRecord, setSelectedDeploymentRecord] = useState('');

  // 모달이 열릴 때마다 폼 초기화
  useEffect(() => {
    if (open) {
      setCreateStageForm({ name: '', description: '', deploymentReason: '' });
      setSelectedDeploymentRecord('');
    }
  }, [open]);

  // 스테이지 생성 mutation
  const { mutate: createStage } = useCreateStage({
    onSuccess: async (_data, variables) => {
      setCreateStageForm({ name: '', description: '', deploymentReason: '' });
      setSelectedDeploymentRecord('');
      toast.success('Stage가 성공적으로 생성되었습니다.');
      onOpenChange(false);

      // 스테이지 목록을 직접 API 호출로 가져옴
      if (variables?.stageName) {
        try {
          const stagesList = await getStagesListData(apiId);
          const newStage = stagesList?.find(
            (stage: any) => stage.stageName === variables.stageName || stage.label === variables.stageName
          );
          if (newStage) {
            onSuccess?.(newStage.stageId || newStage.value);
            return;
          }
        } catch (error) {
          console.error('Failed to fetch stages list:', error);
        }
      }
      onSuccess?.();
    },
    onError: (error: any) => {
      setCreateStageForm({ name: '', description: '', deploymentReason: '' });
      setSelectedDeploymentRecord('');
      console.log(error)
      // const serverMessage =
      //   error?.response?.data?.message ?? 'Stage 생성 중 오류가 발생했습니다. 필수 입력값을 확인해주세요';
      // toast.error(serverMessage);
      toast.error(error.message)

    },
  });
  const handleDeploySuccess = async (stageName?: string, responseStageId?: string) => {
    onOpenChange(false);

    let newStageId: string | undefined = responseStageId;

    // 1. 먼저 스테이지 ID 검색 (toast 밖에서 수행)
    if (!newStageId && stageName) {
      for (let retry = 0; retry < 3; retry++) {
        try {
          const stagesList = await getStagesListData(apiId);
          const newStage = stagesList?.find(
            (stage: any) => stage.stageName === stageName || stage.label === stageName
          );
          if (newStage) {
            newStageId = newStage.stageId || newStage.value;
            break;
          }
          // 못 찾으면 500ms 대기 후 재시도
          if (retry < 2) {
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        } catch (error) {
          console.error('Failed to fetch stages list:', error);
        }
      }
    }

    // 2. 쿼리 캐시 무효화 (toast와 함께)
    await toast.promise(
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ['getStagesListData', apiId] }),
        queryClient.invalidateQueries({ queryKey: ['getStagesDocData', apiId] }),
        queryClient.invalidateQueries({ queryKey: ['getDeployHistoryData', tenantId] }),
        queryClient.invalidateQueries({ queryKey: ['getDeployHistoryDataByApiId', apiId] }),
      ]),
      {
        loading: '스테이지 생성 중...',
        success: '스테이지가 성공적으로 배포되었습니다.',
        error: '스테이지 배포에 실패하였습니다.',
      }
    );

    // 3. stageId를 전달하여 부모에서 해당 스테이지 직접 선택
    onSuccess?.(newStageId);
  };

  const { mutate: handleDeploy } = useDeployAPI({
    onSuccess: async (data, variables) => {
      setCreateStageForm({ name: '', description: '', deploymentReason: '' });
      setSelectedDeploymentRecord('');
      // 배포 API 응답에서 stageId 확인, 없으면 stageName으로 검색
      const responseStageId = data?.stageId || data?.data?.stageId;
      handleDeploySuccess(variables?.stageName, responseStageId);
    },
    onError: (error: any) => {
      // const serverMessage = error?.response?.data?.message ?? '배포에 실패하였습니다.';
      // toast.error(serverMessage);
      toast.error(error.message)

    },
  });

  // 스테이지 생성 핸들러
  const handleCreateStage = () => {
    if (selectedDeploymentRecord === 'new') {
      handleDeploy({
        apiId: apiId,
        version: '1.1.0',
        deploymentReason: createStageForm.deploymentReason,
        stageName: createStageForm.name,
        stageDescription: createStageForm.description,
        deployedBy: userKey,
      });
    } else {
      createStage({
        stageName: createStageForm.name,
        description: createStageForm.description,
        deploymentId: selectedDeploymentRecord || '',
        createdBy: userKey,
        apiId,
      });
    }
  };

  // 폼 초기화 핸들러
  const handleResetForm = () => {
    setCreateStageForm({ name: '', description: '', deploymentReason: '' });
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
