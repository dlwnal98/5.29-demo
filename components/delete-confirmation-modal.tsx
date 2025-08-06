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
import { AlertTriangle, Trash2 } from "lucide-react";
import { useDeleteFile } from "@/hooks/use-config-data";
import { goToBaseProjectUrl } from "@/lib/etc";

interface fileDataProps {
  owner: string;
  repo: string;
  branch: string;
  path: string;
  sha: string;
  message: string;
}

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileName: string;
  fileData: fileDataProps;
}

export function DeleteConfirmationModal({
  isOpen,
  onClose,
  fileName,
  fileData,
}: DeleteConfirmationModalProps) {
  const [deleteCommitComment, setDeleteCommitComment] = useState("");

  const handleDelete = async () => {
    try {
      await deleteFileMutate();
    } finally {
      onClose();
      goToBaseProjectUrl();
    }
  };

  const handleClose = () => {
    setDeleteCommitComment("");
    onClose();
  };

  const { mutate: deleteFileMutate } = useDeleteFile(
    "admin",
    "configs_repo",
    fileData.branch,
    fileData.path,
    fileData.sha, // 최신 버전 sha
    fileData.message // 커밋메세지1
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-4">
          <DialogTitle className="flex items-center text-red-600">
            <AlertTriangle className="h-5 w-5 mr-2" />
            파일 삭제
          </DialogTitle>
          <DialogDescription className="text-left space-y-3">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="font-semibold text-red-800 mb-2">
                ⚠️ 이 작업은 실행 취소할 수 없습니다.
              </p>
              <p className="text-red-700 text-sm">
                저장소에서
                <strong> {fileName}</strong> 파일이 영구적으로 삭제됩니다.
                <br />
                모든 기록과 내용이 영원히 사라집니다.
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label
              htmlFor="deleteCommitComment"
              className="text-sm font-medium"
            >
              커밋 메세지
            </Label>
            <Input
              id="deleteCommitComment"
              value={deleteCommitComment}
              onChange={(e) => setDeleteCommitComment(e.target.value)}
              placeholder={`내용을 입력하세요`}
              className="mt-1"
            />
          </div>
        </div>

        <DialogFooter className="flex space-x-2">
          <Button variant="outline" onClick={handleClose}>
            취소
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteCommitComment.length == 0}
            className="bg-red-600 hover:bg-red-700"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            삭제
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
