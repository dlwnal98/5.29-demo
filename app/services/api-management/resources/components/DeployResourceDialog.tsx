'use client';

import { useState } from 'react';
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

interface deployData {
  stage: string;
  version: string;
  description: string;
  newStageName: string;
}

interface deployResourceProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DeployResourceDialog({ open, onOpenChange }: deployResourceProps) {
  const [deploymentData, setDeploymentData] = useState<deployData>({
    stage: '',
    version: '',
    description: '',
    newStageName: '',
  });

  const handleDeploySubmit = () => {
    if (deploymentData.stage === 'new') {
      if (!deploymentData.newStageName.trim()) {
        toast.error('새 스테이지 이름을 입력해주세요.');
        return;
      }
      // 새 스테이지 생성 로직
      toast.success(
        `새 스테이지 '${deploymentData.newStageName}'가 생성되고 이(가) 성공적으로 배포되었습니다.`
      );
    } else {
      if (!deploymentData.stage) {
        toast.error('배포 스테이지를 선택해주세요.');
        return;
      }
      toast.success(`이(가) ${deploymentData.stage} 스테이지에 성공적으로 배포되었습니다.`);
    }

    onOpenChange(false);
    setDeploymentData({
      stage: '',
      version: '',
      description: '',
      newStageName: '',
    });
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
            <Rocket className="h-5 w-5 mr-2 text-orange-500" />
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
              onValueChange={(value) => setDeploymentData({ ...deploymentData, stage: value })}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="스테이지 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dev">Development</SelectItem>
                <SelectItem value="staging">Staging</SelectItem>
                <SelectItem value="prod">Production</SelectItem>
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
                  스테이지 이름 *
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
            <Rocket className="h-4 w-4 mr-2" />
            배포
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
