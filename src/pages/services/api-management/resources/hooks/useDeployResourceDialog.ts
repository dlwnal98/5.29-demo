import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { createStage } from '@/apis/stages.api';
import { useDeployAPI } from '@/hooks/use-resources';
import { useGetStagesDocData } from '@/hooks/use-stages';

export interface DeployData {
  stage: string;
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
  organizationId: string;
  onOpenChange: (open: boolean) => void;
}

export function useDeployResourceDialog({
  open,
  apiId,
  userKey,
  organizationId,
  onOpenChange,
}: UseDeployResourceDialogProps) {
  const { data: stagesDocData = [] } = useGetStagesDocData(apiId || '');
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [deploymentData, setDeploymentData] = useState<DeployData>({
    stage: '',
    stageDescription: '',
    version: '1.1.0',
    deploymentReason: '',
    newStageName: '',
  });

  const [stageForDeployment, setStageForDeployment] = useState<StageOption[]>([]);

  useEffect(() => {
    if (open && stagesDocData.length) {
      setDeploymentData({
        stage: '',
        stageDescription: '',
        version: '1.1.0',
        deploymentReason: '',
        newStageName: '',
      });

      const stageList = stagesDocData.map((data: any, i: number) => ({
        id: i,
        label: data.name,
        value: data.stageId,
      }));

      setStageForDeployment(stageList);
    }
  }, [open, stagesDocData]);

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
        await queryClient.invalidateQueries({ queryKey: ['getStatesDocData', apiId] });
        await queryClient.refetchQueries({ queryKey: ['getStatesDocData', apiId] });

        await queryClient.invalidateQueries({ queryKey: ['getDeployHistoryData', organizationId] });
        await queryClient.refetchQueries({ queryKey: ['getDeployHistoryData', organizationId] });
      })(),
      {
        loading: '스테이지 생성 중...',
        success: '스테이지가 성공적으로 생성되어 배포되었습니다.',
        error: '스테이지 생성 후 배포에 실패했습니다.',
      }
    );

    navigate(`/services/api-management/stages?apiId=${apiId}`);
  };

  const handleCreateAndDeploy = async () => {
    // try {
    //   const res = await createStage({
    //     organizationId: organizationId,
    //     stageName: deploymentData.newStageName,
    //     description: deploymentData.stageDescription,
    //     createdBy: userKey,
    //     enabled: true,
    //     deploymentSource: 'DRAFT',
    //     apiId: apiId,
    //     sourceDeploymentId: '',
    //   });
    //   if (res) {
    //     handleDeploy({
    //       apiId: apiId,
    //       stageId: res.stageId,
    //       version: '1.1.0',
    //       deployedBy: userKey,
    //       deploymentReason: deploymentData.deploymentReason,
    //       stageDescription: deploymentData.stageDescription,
    //       gatewayCode: '',
    //       baseUrl: '',
    //     });
    //   } else if ((res as any).statusCode == 400) {
    //     toast.error((res as any).message);
    //   } else {
    //     toast.error('새로운 스테이지 생성에 실패하였습니다\n 재입력이 필요합니다.');
    //   }
    // } catch (e) {
    //   const err = e as AxiosError<{ fieldErrors?: { stageName?: string } }>;
    //   toast.error(err.response?.data?.fieldErrors?.stageName);
    // }
    try {
      await handleDeploy({
        apiId: apiId,
        version: '1.1.0',
        deploymentReason: deploymentData.deploymentReason,
        stageName: deploymentData.newStageName,
        stageDescription: deploymentData.stageDescription,
        gatewayCode: '',
        baseUrl: '',
        deployedBy: userKey,
      });
    } catch (e) {
      const err = e as AxiosError<{ fieldErrors?: { stageName?: string } }>;
      toast.error(err.response?.data?.fieldErrors?.stageName);
    }
  };

  const handleDeploySubmit = () => {
    if (deploymentData.stage === 'new') {
      if (!deploymentData.newStageName.trim()) {
        toast.error('새 스테이지 이름을 입력해주세요.');
        return;
      }
      handleCreateAndDeploy();
    } else {
      if (!deploymentData.stage) {
        toast.error('배포 스테이지를 선택해주세요.');
        return;
      }

      handleDeploy({
        apiId: apiId,
        version: '1.1.0',
        deploymentReason: deploymentData.deploymentReason,
        stageId: deploymentData.stage,
        deployedBy: userKey,
      });
    }
  };

  const handleStageChange = (value: string) => {
    setDeploymentData({
      ...deploymentData,
      stage: value,
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
      stage: '',
      version: '',
      stageDescription: '',
      deploymentReason: '',
      newStageName: '',
    });
  };

  const isValidDeploy = useMemo(() => {
    if (deploymentData.stage === 'new') {
      return deploymentData.newStageName.trim().length > 0;
    }
    return deploymentData.stage.trim().length > 0;
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
