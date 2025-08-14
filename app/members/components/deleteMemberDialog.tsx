import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Trash2 } from 'lucide-react';

interface DeleteMemberProps {
  isDeleteAccountModalOpen: boolean;
  setIsDeleteAccountModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  userId: string;
  organizationId: string;
  userKey: string;
  handleDeleteAccount: any;
}

export default function DeleteMemberDialog({
  isDeleteAccountModalOpen,
  setIsDeleteAccountModalOpen,
  handleDeleteAccount,
  userId,
  userKey,
  organizationId,
}: DeleteMemberProps) {
  return (
    <Dialog open={isDeleteAccountModalOpen} onOpenChange={setIsDeleteAccountModalOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center text-red-600 mb-2">
            <AlertTriangle className="h-5 w-5 mr-2" />
            조직 멤버 삭제
          </DialogTitle>
          <DialogDescription className="text-left space-y-3">
            <p className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="font-semibold text-red-800 mb-2">
                ⚠️ 이 작업은 실행 취소할 수 없습니다.
              </p>
              <p className="text-red-700 text-sm">
                <span className="font-bold underline">{userId}</span> 사용자가 조직에서 삭제됩니다.
                <br />• 조직 관련한 사용자의 모든 권한이 제거됩니다
                <br />• 관련된 모든 활동 기록이 삭제됩니다
                <br />
                <br />
                <span className="font-semibold">정말로 이 멤버를 삭제하시겠습니까?</span>
              </p>
            </p>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex space-x-2">
          <Button variant="outline" onClick={() => setIsDeleteAccountModalOpen(false)}>
            취소
          </Button>
          <Button
            variant="destructive"
            onClick={() => handleDeleteAccount(organizationId, userKey)}
            className="bg-red-600 hover:bg-red-700"
          >
            <Trash2 className="h-4 w-4" />
            삭제
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
