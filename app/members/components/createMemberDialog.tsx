import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Copy, XCircle, CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface CreateMemberProps {
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  firstMemberPw: string;
  memberId: string;
  organizationId: string;
  idValidMsg: string;
  idValid: boolean;
  setMemberId: React.Dispatch<React.SetStateAction<string>>;
  setTempPassword: React.Dispatch<React.SetStateAction<string>>;
  validateUserId: any;
  handleAddMember: any;
  handleCopyPassword: any;
}

export default function CreateMemberDialog({
  isAddDialogOpen,
  setIsAddDialogOpen,
  firstMemberPw,
  memberId,
  organizationId,
  idValidMsg,
  idValid,
  setMemberId,
  setTempPassword,
  validateUserId,
  handleAddMember,
  handleCopyPassword,
}: CreateMemberProps) {
  return (
    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
      {firstMemberPw?.length === 0 ? (
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-blue-600">Member 생성</DialogTitle>
            <DialogDescription>Member ID를 생성합니다.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Member ID</Label>
                <Input
                  id="memberId"
                  value={memberId}
                  onChange={(e) => setMemberId(e.target.value.replace(/\s+/g, ''))}
                  onKeyUp={(e) => validateUserId(e)}
                />
              </div>
              {idValidMsg && (
                <div className="flex items-center space-x-2 mt-1">
                  {idValid ? (
                    <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                      <CheckCircle className="h-3 w-3" />
                      <span className="text-xs">{idValidMsg}</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1 text-red-600 dark:text-red-400">
                      <XCircle className="h-3 w-3" />
                      <span className="text-xs">{idValidMsg}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              취소
            </Button>
            <Button disabled={!idValid} onClick={() => handleAddMember(organizationId, memberId)}>
              생성
            </Button>
          </DialogFooter>
        </DialogContent>
      ) : (
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>멤버 임시 비밀번호</DialogTitle>
            <DialogDescription>
              임의로 발급된 비밀번호를 복사하여 다시 로그인해주세요.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <button
                  className=" w-[100%] flex justify-between items-center hover:underline"
                  onClick={() => handleCopyPassword(firstMemberPw)}>
                  {/* {firstMemberPw} */}

                  <span className="block w-[90%] whitespace-normal break-words text-left">
                    {firstMemberPw}
                  </span>
                  <Copy className="h-4 w-4 ml-2" />
                </button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="default"
              onClick={() => {
                setTempPassword('');
                setIsAddDialogOpen(false);
              }}>
              확인
            </Button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
}
