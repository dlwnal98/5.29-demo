import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { createStage } from '@/apis/stages.api';
import { useDeployAPI } from '@/hooks/use-resources';
import { useGetStagesDocData } from '@/hooks/use-stages';
import { useGetStagesListData } from '@/hooks/use-stages';
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

  const { mutate: handleDeploy, isPending } = useDeployAPI({
    onSuccess: () => {
      handleNavigateStage();
    },
    onError: (error: any) => {
      const serverMessage = error?.response?.data?.message ?? '배포에 실패하였습니다.';
      toast.error(serverMessage);
    },
  });

  const handleNavigateStage = async () => {
    onOpenChange(false);

    await toast.promise(
      (async () => {
        await queryClient.invalidateQueries({ queryKey: ['getStagesDocData', apiId] });
        await queryClient.refetchQueries({ queryKey: ['getStagesDocData', apiId] });

        await queryClient.invalidateQueries({ queryKey: ['getDeployHistoryData', tenantId] });
        await queryClient.refetchQueries({ queryKey: ['getDeployHistoryData', tenantId] });

        // Stages 페이지 목록 갱신
        await queryClient.invalidateQueries({ queryKey: ['getStagesListData', apiId] });
        await queryClient.refetchQueries({ queryKey: ['getStagesListData', apiId] });
      })(),
      {
        loading: 'Stage creation in progress...',
        success: 'Stage successfully created and deployed.',
        error: 'Failed to deploy after stage creation.',
      }
    );

    navigate(`/services/api-management/stages?apiId=${apiId}`);
  };


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
        toast.error('New stage name is required.');
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
