import {
  Dialog,
  DialogDescription,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface policyProps {
  isTermAndPolicyModalOpen: boolean;
  setIsTermAndPolicyModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setAgreeTerms: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function PolicyDialog({
  isTermAndPolicyModalOpen,
  setIsTermAndPolicyModalOpen,
  setAgreeTerms,
}: policyProps) {
  return (
    <Dialog open={isTermAndPolicyModalOpen} onOpenChange={setIsTermAndPolicyModalOpen}>
      <DialogContent className="sm:max-w-[500px] sm:max-h-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center  mb-2">서비스 약관 및 개인정보처리방침</DialogTitle>
          <DialogDescription className="text-left space-y-3">
            <div className="bg-blue-50 border border-gray-200 rounded-lg p-4">
              <p className="font-semibold text-gray-800 mb-2">서비스 약관 및 개인정보 처리 방침</p>
              <p className="text-gray-700 text-sm">
                <span className="font-bold underline">{}</span> 사용자가 조직에서 삭제됩니다.
                <br />• 조직 관련한 사용자의 모든 권한이 제거됩니다
                <br />• 관련된 모든 활동 기록이 삭제됩니다
                <br />
                <br />
                <span className="font-semibold">정말로 이 멤버를 삭제하시겠습니까?</span>
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex !justify-center space-x-2">
          <Button
            type="button"
            variant="destructive"
            onClick={() => {
              setIsTermAndPolicyModalOpen(false);
              setAgreeTerms(false);
            }}>
            취소
          </Button>
          <Button
            type="button"
            variant="default"
            onClick={() => {
              setIsTermAndPolicyModalOpen(false);
              setAgreeTerms(true);
            }}>
            동의
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
