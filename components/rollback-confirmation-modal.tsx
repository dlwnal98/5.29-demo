"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, RotateCcw, X, GitCommit } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useRollbackCommit } from "@/hooks/use-config-data";

interface RollbackConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  branch: string;
  fileName: string;
  commitHash: string;
  commitMessage: string;
}

export function RollbackConfirmationModal({
  isOpen,
  onClose,
  branch,
  fileName,
  commitHash,
  commitMessage,
}: RollbackConfirmationModalProps) {
  const [rollbackMessage, setRollbackMessage] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);
  const { mutate: rollbackCommitMutate } = useRollbackCommit(
    "admin",
    "configs_repo",
    branch,
    fileName,
    commitHash,
    rollbackMessage
  );

  const handleConfirm = async () => {
    rollbackCommitMutate();
  };

  const handleClose = () => {
    setRollbackMessage("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] bg-white border-2 border-red-200/50 shadow-2xl">
        <DialogHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <div className="p-2 bg-red-100 rounded-full">
                <RotateCcw className="h-5 w-5 text-red-600" />
              </div>
              Rollback Commit
            </DialogTitle>
          </div>
          <DialogDescription className="text-gray-600">
            다음 커밋을 롤백하려고 합니다.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Commit Info */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200/50">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-mono text-xs">
                  <GitCommit className="h-3 w-3 mr-1" />

                  {commitHash}
                </Badge>
              </div>
              <p className="text-sm text-gray-700 font-medium">
                {commitMessage}
              </p>
            </div>
          </div>

          {/* Warning Alert */}
          <Alert className="border-red-200 bg-red-50">
            {/* <AlertTriangle className="h-5 w-5 text-red-600" /> */}
            <AlertDescription className="text-red-800 font-medium">
              <div className="space-y-2">
                <p className="font-semibold">⚠️ WARNING</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>
                    이 작업을 수행하면 이 커밋의 모든 변경 사항이 영구적으로
                    되돌려집니다.
                  </li>
                  <li>이 작업은 확인 후 취소할 수 없습니다.</li>
                  <li>이 커밋의 모든 수정 사항은 영구적으로 손실됩니다.</li>
                  <li>중요한 변경 사항을 백업했는지 확인하세요.</li>
                </ul>
              </div>
            </AlertDescription>
          </Alert>

          {/* Rollback Message Input */}
          <div className="space-y-2">
            <Label
              htmlFor="rollback-message"
              className="text-sm font-semibold text-gray-900"
            >
              Rollback Commit Message *
            </Label>
            <Input
              id="rollback-message"
              placeholder="커밋할 내용을 입력해주세요."
              value={rollbackMessage}
              onChange={(e) => setRollbackMessage(e.target.value)}
              className="border-gray-300 focus:border-red-500 focus:ring-red-500"
            />
          </div>
        </div>

        <DialogFooter className="flex gap-3 pt-6">
          <Button
            variant="outline"
            onClick={handleConfirm}
            disabled={!rollbackMessage.trim() || isConfirming}
            className="flex-1 border-gray-300 hover:bg-gray-50"
          >
            확인
          </Button>
          <Button
            onClick={handleClose}
            disabled={isConfirming}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold shadow-lg"
          >
            {isConfirming ? (
              <div className="flex items-center gap-2">
                {/* <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> */}
                Rolling back...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {/* <RotateCcw className="h-4 w-4" /> */}
                취소
              </div>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
