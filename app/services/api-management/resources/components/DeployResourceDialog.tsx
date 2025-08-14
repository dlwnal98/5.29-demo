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

interface deployData {
  stage: string;
  version: string;
  description: string;
  newStageName: string;
  newStageDescription: string;
}

interface deployResourceProps {
  isDeployModalOpen: boolean;
  handleDeployModalClose: any;
  handleDeploySubmit: any;
  deploymentData: deployData;
  setDeploymentData: React.Dispatch<React.SetStateAction<deployData>>;
}

export default function DeployResourceDialog({
  isDeployModalOpen,
  handleDeployModalClose,
  handleDeploySubmit,
  deploymentData,
  setDeploymentData,
}: deployResourceProps) {
  return (
    <Dialog open={isDeployModalOpen} onOpenChange={handleDeployModalClose}>
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
              <div>
                <Label htmlFor="new-stage-description" className="text-sm font-medium">
                  스테이지 설명
                </Label>
                <Textarea
                  id="new-stage-description"
                  value={deploymentData.newStageDescription}
                  onChange={(e) =>
                    setDeploymentData({
                      ...deploymentData,
                      newStageDescription: e.target.value,
                    })
                  }
                  placeholder="스테이지 설명을 입력하세요 (선택사항)"
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
