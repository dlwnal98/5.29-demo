import { toast } from 'sonner';
import { useClipboard } from 'use-clipboard-copy';
import {
  useGetUserList,
  useGetMemberByOrganizationList,
  useDeleteMember,
  useMemberHandleStatus,
  useAddMember,
} from '@/hooks/use-members';
import { useAuthStore } from '@/store/store';
import { requestPost } from '@/lib/apiClient';
import { UserList, MemberList } from '@/types/member';

export interface UseMembersDataReturn {
  // Auth
  userData: ReturnType<typeof useAuthStore>['user'];
  isSuper: boolean;
  isAdmin: boolean;
  orgId: string;

  // Data
  filteredUsers: (UserList | MemberList)[] | undefined;
  loadingUsers: boolean;

  // Handlers
  handleStatusToggle: (userKey: string, active: boolean) => void;
  handleAddMember: (organizationId: string, userId: string) => void;
  handleResetPassword: (userKey: string) => Promise<string | null>;
  handleDeleteAccount: (organizationId: string, userKey: string) => void;
  handleCopyPassword: (password: string) => void;
}

interface UseMembersDataOptions {
  statusFilter: string;
  onAddMemberSuccess: (password: string) => void;
  onAddMemberError: () => void;
  onDeleteMemberSuccess: () => void;
}

export function useMembersData(options: UseMembersDataOptions): UseMembersDataReturn {
  const { statusFilter, onAddMemberSuccess, onAddMemberError, onDeleteMemberSuccess } = options;

  // 유저 토큰 내 정보
  const userData = useAuthStore((state) => state.user);

  const isSuper = userData?.role === 'SUPER';
  const isAdmin = userData?.role === 'ADMIN';
  const orgId = userData?.organizationId ?? '';

  // SUPER 일 때, 전체 유저 목록 조회
  const { data: allUserData, isLoading: allUserIsLoading } = useGetUserList(statusFilter, isSuper);

  // ADMIN 일 때, 조직 내 멤버 목록 조회
  const { data: membersByOrganizationData, isLoading: membersByOrganizationIsLoading } =
    useGetMemberByOrganizationList(orgId, isAdmin);

  // 나를 제외한 멤버들만
  const exceptMeOrganizationData = membersByOrganizationData?.filter(
    (i) => i.userKey !== userData?.userKey
  );

  const filteredUsers = isSuper ? allUserData : exceptMeOrganizationData;
  const loadingUsers = isSuper ? allUserIsLoading : membersByOrganizationIsLoading;

  // 상태 변경 mutate
  const { mutate: handleStatus } = useMemberHandleStatus({
    onSuccess: () => {
      toast.success('상태가 변경되었습니다.');
    },
  });

  // 조직 내 멤버 제외 mutate
  const { mutate: userDelete } = useDeleteMember({
    onSuccess: () => {
      toast.success('조직에서 제외되었습니다.');
      onDeleteMemberSuccess();
    },
  });

  // 조직 내 멤버 생성 mutate
  const { mutate: addMember } = useAddMember({
    onSuccess: (data) => {
      toast.success('멤버 계정이 생성되었습니다.');
      onAddMemberSuccess(data.data.password);
    },
    onError: () => {
      toast.error('멤버 계정 생성에 실패하였습니다.');
      onAddMemberError();
    },
  });

  const clipboard = useClipboard();

  // 멤버 활성화 토글 함수
  const handleStatusToggle = (userKey: string, active: boolean) => {
    handleStatus({ userKey, active, role: userData?.role });
  };

  // 멤버 추가 함수
  const handleAddMember = (organizationId: string, userId: string) => {
    addMember({ organizationId, userId });
  };

  // 임시 비밀번호 발급 함수
  const handleResetPassword = async (userKey: string): Promise<string | null> => {
    const res = await requestPost(`/api/v1/users/${userKey}/password/reset`);

    if (res.code == 200) {
      toast.success('임시 비밀번호가 재발급되었습니다.');
      return res.data;
    }
    return null;
  };

  // 멤버 제외 함수
  const handleDeleteAccount = (organizationId: string, userKey: string) => {
    userDelete({ organizationId, userKey });
  };

  // 비밀번호 복사 함수
  const handleCopyPassword = (password: string) => {
    clipboard.copy(password);
    toast.success('비밀번호가 복사되었습니다.');
  };

  return {
    userData,
    isSuper,
    isAdmin,
    orgId,
    filteredUsers,
    loadingUsers,
    handleStatusToggle,
    handleAddMember,
    handleResetPassword,
    handleDeleteAccount,
    handleCopyPassword,
  };
}
