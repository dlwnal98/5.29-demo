'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Rocket, Plus } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast, Toaster } from 'sonner';
import { createStage } from '@/hooks/use-stages';
import { useDeployAPI } from '@/hooks/use-resources';
import { useRouter } from 'next/navigation';
import { useGetStagesDocData } from '@/hooks/use-stages';

interface deployData {
  stage: string;
  version: string;
  description: string;
  newStageName: string;
}

interface deployResourceProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  apiId: string;
  userKey: string;
  organizationId: string;
}

export default function DeployResourceDialog({
  open,
  onOpenChange,
  apiId,
  userKey,
  organizationId,
}: deployResourceProps) {
  const { data: stagesDocData = [] } = useGetStagesDocData(apiId || '');
  const stageList = stagesDocData.map((data: any, i: number) => {
    return { id: i, label: data.name, value: data.stageId };
  });

  const [deploymentData, setDeploymentData] = useState<deployData>({
    stage: '',
    version: '',
    description: '',
    newStageName: '',
  });

  useEffect(() => {
    if (open) {
      setDeploymentData({
        stage: '',
        version: '',
        description: '',
        newStageName: '',
      });
    }
  }, [open]);

  const router = useRouter();

  const { mutate: handleDeploy } = useDeployAPI({
    onSuccess: () => {
      toast.success('성공적으로 배포되었습니다.');
      router.push(`/services/api-management/stages?apiId=${apiId}`);
    },
    onError: (error: any) => {
      const serverMessage = error?.response?.data?.message ?? '배포에 실패하였습니다.';
      toast.error(serverMessage);
    },
  });

  const handleCreateAndDeploy = async () => {
    const res = await createStage({
      organizationId: organizationId,
      stageName: deploymentData.newStageName,
      description: deploymentData.description,
      createdBy: userKey,
      enabled: true,
      deploymentSource: 'DRAFT',
      apiId: apiId,
      sourceDeploymentId: '',
    });

    if (res) {
      handleDeploy({
        apiId: apiId,
        stageId: res.stageId,
        version: '',
        deployedBy: userKey,
        description: deploymentData.description,
        metadata: {
          jiraTicket: '',
          reviewer: '',
        },
      });
    } else {
      toast.error('새로운 스테이지 생성에 실패하였습니다\n 재입력이 필요합니다.');
    }
  };

  const handleDeploySubmit = () => {
    if (deploymentData.stage === 'new') {
      if (!deploymentData.newStageName.trim()) {
        toast.error('새 스테이지 이름을 입력해주세요.');
        return;
      }
      // 새 스테이지 생성 로직
      handleCreateAndDeploy();
    } else {
      if (!deploymentData.stage) {
        toast.error('배포 스테이지를 선택해주세요.');
        return;
      }

      handleDeploy({
        apiId: apiId,
        stageId: deploymentData.stage,
        version: '',
        deployedBy: userKey,
        description: deploymentData.description,
        metadata: {
          jiraTicket: '',
          reviewer: '',
        },
      });
    }
  };

  const handleDeployModalClose = () => {
    onOpenChange(false);
    setDeploymentData({
      stage: '',
      version: '',
      description: '',
      newStageName: '',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            {/* <Rocket className="h-5 w-5 mr-2 text-orange-500" /> */}
            API 배포
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="deploy-stage" className="text-sm font-medium">
              배포 할 스테이지
            </Label>
            <Select
              value={deploymentData.stage}
              onValueChange={(value) =>
                setDeploymentData({
                  ...deploymentData,
                  stage: value,
                  description: '',
                  newStageName: '',
                })
              }>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="스테이지 선택" />
              </SelectTrigger>
              <SelectContent>
                {stageList.map((stage: any, i: number) => {
                  return <SelectItem value={stage.value}>{stage.label}</SelectItem>;
                })}
                <SelectItem value="new">
                  <div className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />새 스테이지 생성
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 새 스테이지 생성 필드들 */}
          {deploymentData.stage === 'new' && (
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <Plus className="h-4 w-4 text-orange-500" />
                <Label className="text-sm font-medium text-gray-700">새 스테이지 정보</Label>
              </div>
              <div>
                <Label htmlFor="new-stage-name" className="text-sm font-medium">
                  스테이지 이름 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="new-stage-name"
                  value={deploymentData.newStageName}
                  onChange={(e) =>
                    setDeploymentData({
                      ...deploymentData,
                      newStageName: e.target.value,
                    })
                  }
                  placeholder="새 스테이지 이름을 입력하세요"
                  className="mt-1"
                />
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="deploy-description" className="text-sm font-medium">
              배포 설명
            </Label>
            <Textarea
              id="deploy-description"
              value={deploymentData.description}
              onChange={(e) =>
                setDeploymentData({
                  ...deploymentData,
                  description: e.target.value,
                })
              }
              placeholder="배포에 대한 설명을 입력하세요"
              className="mt-1"
            />
          </div>
        </div>
        <DialogFooter className="flex space-x-2">
          <Button variant="outline" onClick={handleDeployModalClose}>
            취소
          </Button>
          <Button
            onClick={handleDeploySubmit}
            className="bg-orange-500 hover:bg-orange-600 text-white">
            {/* <Rocket className="h-4 w-4 mr-2" /> */}
            배포
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
