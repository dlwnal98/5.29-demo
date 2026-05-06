import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useDeployAPI } from '@/hooks/use-resources';
import { getStagesListData } from '@/apis/stages.api';

export interface DeployData {
  stageName: string;
  stageId: string;
  stageDescription: string;
  version: string;
  deploymentReason: string;
  newStageName: string;
}

export interface StageOption {
  id: number;
  label: string;
  value: string;
}

interface UseDeployResourceDialogProps {
  open: boolean;
  apiId: string;
  userKey: string;
  tenantId: string;
  onOpenChange: (open: boolean) => void;
}

export function useDeployResourceDialog({
  open,
  apiId,
  userKey,
  tenantId,
  onOpenChange,
}: UseDeployResourceDialogProps) {
  // const { data: stagesDocData = [] } = useGetStagesDocData(apiId || '', open);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [deploymentData, setDeploymentData] = useState<DeployData>({
    stageName: '',
    stageId: '',
    stageDescription: '',
    version: '1.1.0',
    deploymentReason: '',
    newStageName: '',
  });

  const [stageForDeployment, setStageForDeployment] = useState<StageOption[]>([]);

  const handleStagesListData = async (apiId: string) => {
    const res = await getStagesListData(apiId);
    if (res) {
      return setStageForDeployment(res);
    }
  }

  useEffect(() => {
    if (open) {
      setDeploymentData({
        stageName: '',
        stageId: '',
        stageDescription: '',
        version: '1.1.0',
        deploymentReason: '',
        newStageName: '',
      });
      handleStagesListData(apiId);

    }

  }, [open]);

  const handleNavigateStage = async (targetStageId?: string) => {
    onOpenChange(false);

    await toast.promise(
      (async () => {
        await queryClient.invalidateQueries({ queryKey: ['getStagesDocData', apiId] });
        await queryClient.refetchQueries({ queryKey: ['getStagesDocData', apiId] });

        await queryClient.invalidateQueries({ queryKey: ['getDeployHistoryData', tenantId] });
        await queryClient.refetchQueries({ queryKey: ['getDeployHistoryData', tenantId] });

        // StagesPage에서 사용하는 deployment history도 갱신
        await queryClient.invalidateQueries({ queryKey: ['getDeployHistoryDataByApiId', apiId] });
        await queryClient.refetchQueries({ queryKey: ['getDeployHistoryDataByApiId', apiId] });

        // Stages 페이지 목록 갱신
        await queryClient.invalidateQueries({ queryKey: ['getStagesListData', apiId] });
        await queryClient.refetchQueries({ queryKey: ['getStagesListData', apiId] });
      })(),
      {
        loading: '스테이지 생성 중...',
        success: '스테이지가 성공적으로 배포되었습니다.',
        error: '스테이지 배포에 실패하였습니다.',
      }
    );

    // stageId가 있으면 URL에 포함하여 해당 스테이지 선택
    const stageParam = targetStageId ? `&stageId=${targetStageId}` : '';
    navigate(`/services/api-management/stages?apiId=${apiId}${stageParam}`);
  };

  const { mutate: handleDeploy, isPending } = useDeployAPI({
    onSuccess: async (_data, variables) => {
      // 기존 스테이지에 배포한 경우 variables.stageId 사용
      if (variables?.stageId) {
        handleNavigateStage(variables.stageId);
        return;
      }

      // 새 스테이지 생성의 경우: 스테이지 목록에서 방금 생성한 스테이지 찾기
      if (variables?.stageName) {
        try {
          const stagesList = await getStagesListData(apiId);
          const newStage = stagesList?.find(
            (stage: any) => stage.label === variables.stageName || stage.stageName === variables.stageName
          );
          if (newStage) {
            handleNavigateStage(newStage.stageId || newStage.value);
            return;
          }
        } catch (error) {
          console.error('Failed to fetch stages list:', error);
        }
      }

      // fallback: stageId 없이 이동
      handleNavigateStage();
    },
    onError: (error: any) => {
      const serverMessage = error?.response?.data?.message ?? '배포에 실패하였습니다.';
      toast.error(serverMessage);
    },
  });


  const handleDeploySubmit = () => {
    if (deploymentData.stageId === 'new') {
      handleDeploy({
        apiId: apiId,
        version: '1.1.0',
        deploymentReason: deploymentData.deploymentReason,
        stageName: deploymentData.newStageName,
        stageDescription: deploymentData.stageDescription,
        deployedBy: userKey,
      });
      if (!deploymentData.newStageName.trim()) {
        toast.error('New stage name이 입력되지 않았습니다.');
        return;
      }

    } else if (deploymentData.stageId === 'snapshot') {
      handleDeploy({
        apiId: apiId,
        version: '1.1.0',
        deploymentReason: deploymentData.deploymentReason,
        deployedBy: userKey,
      });
    } else
      handleDeploy({
        apiId: apiId,
        version: '1.1.0',
        deploymentReason: deploymentData.deploymentReason,
        stageId: deploymentData.stageId,
        deployedBy: userKey,
      });
  }

  const handleStageChange = (value: string) => {
    setDeploymentData({
      ...deploymentData,
      stageId: value,
      deploymentReason: '',
      newStageName: '',
    });
  };

  const handleNewStageNameChange = (value: string) => {
    setDeploymentData({
      ...deploymentData,
      newStageName: value,
    });
  };

  const handleStageDescriptionChange = (value: string) => {
    setDeploymentData({
      ...deploymentData,
      stageDescription: value,
    });
  };

  const handleDescriptionChange = (value: string) => {
    setDeploymentData({
      ...deploymentData,
      deploymentReason: value,
    });
  };

  const handleDeployModalClose = () => {
    onOpenChange(false);
    setDeploymentData({
      stageName: '',
      stageId: '',
      version: '',
      stageDescription: '',
      deploymentReason: '',
      newStageName: '',
    });
  };

  const isValidDeploy = useMemo(() => {
    if (deploymentData.stageId === 'new') {
      return deploymentData.newStageName.trim().length > 0;
    }
    return deploymentData.stageId.trim().length > 0;
  }, [deploymentData]);

  return {
    deploymentData,
    stageForDeployment,
    isValidDeploy,
    isPending,
    onDeploySubmit: handleDeploySubmit,
    onStageChange: handleStageChange,
    onNewStageNameChange: handleNewStageNameChange,
    onStageDescriptionChange: handleStageDescriptionChange,
    onDescriptionChange: handleDescriptionChange,
    onDeployModalClose: handleDeployModalClose,
  };
}
