import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
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
import type { DeployData, StageOption } from '../hooks/useDeployResourceDialog';

interface DeployResourceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deploymentData: DeployData;
  stageForDeployment: StageOption[];
  isValidDeploy: boolean;
  isPending?: boolean;
  onDeploySubmit: () => void;
  onStageChange: (value: string) => void;
  onNewStageNameChange: (value: string) => void;
  onStageDescriptionChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onDeployModalClose: () => void;
}

export default function DeployResourceDialog({
  open,
  onOpenChange,
  deploymentData,
  stageForDeployment,
  isValidDeploy,
  isPending,
  onDeploySubmit,
  onStageChange,
  onNewStageNameChange,
  onStageDescriptionChange,
  onDescriptionChange,
  onDeployModalClose,
}: DeployResourceDialogProps) {


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center text-orange-600">
            API 배포
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="deploy-stage" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              배포 스테이지 <span className="text-red-500">*</span>
            </Label>
            <Select
              value={deploymentData.stageId}
              onValueChange={onStageChange}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Stage Selection" />
              </SelectTrigger>
              <SelectContent>
                {stageForDeployment.map((stage) => (
                  <SelectItem key={stage.id} value={stage.stageId} className="cursor-pointer">
                    {stage?.stageName}
                  </SelectItem>
                ))}
                <SelectItem value="new" className="cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />새 스테이지 생성
                  </div>
                </SelectItem>
                <SelectItem value="snapshot" className="cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />새 스냅샷 생성
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 새 스테이지 생성 필드들 */}
          {deploymentData.stageId === 'new' && (
            <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border dark:border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <Plus className="h-4 w-4 text-orange-500" />
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">새 스테이지 정보</Label>
              </div>
              <div>
                <Label htmlFor="new-stage-name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  스테이지 이름 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="new-stage-name"
                  value={deploymentData.newStageName}
                  onChange={(e) => onNewStageNameChange(e.target.value)}
                  placeholder="스테이지 이름을 입력해주세요."
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="stage-description" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  스테이지 설명
                </Label>
                <Textarea
                  id="stage-description"
                  value={deploymentData.stageDescription}
                  onChange={(e) => onStageDescriptionChange(e.target.value)}
                  placeholder="스테이지 설명을 입력해주세요."
                  className="mt-1"
                />
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="deploy-description" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              배포 설명
            </Label>
            <Textarea
              id="deploy-description"
              value={deploymentData.deploymentReason}
              onChange={(e) => onDescriptionChange(e.target.value)}
              placeholder="배포 설명을 입력해주세요."
              className="mt-1"
            />
          </div>
        </div>
        <DialogFooter className="flex space-x-2">
          <Button variant="outline" onClick={onDeployModalClose}>
            취소
          </Button>
          <Button
            onClick={onDeploySubmit}
            disabled={!isValidDeploy || isPending}
            className="bg-orange-500 hover:bg-orange-600 text-white">
            {isPending ? '배포중...' : '배포'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
