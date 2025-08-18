'use client';
import React from 'react';
import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Search,
  Plus,
  RotateCcw,
  Trash2,
  ChevronRight,
  ChevronDown,
  User,
  Wrench,
} from 'lucide-react';
import {
  useGetUserList,
  useGetMemberByOrganizationList,
  useDeleteMember,
  useMemberHandleStatus,
  useAddMember,
} from '@/hooks/use-members';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Toaster, toast } from 'sonner';
import { useAuthStore } from '@/store/store';
import { Skeleton } from '@/components/ui/skeleton';
import { userIdRegex } from '@/lib/etc';
import { useClipboard } from 'use-clipboard-copy';
import { requestPost } from '@/lib/apiClient';
import CommonPagination from '@/components/common-pagination';
import CreateMemberDialog from './components/createMemberDialog';
import ResetPasswordDialog from './components/resetPasswordDialog';
import DeleteMemberDialog from './components/deleteMemberDialog';

interface selectMemberInfo {
  userId: string;
  userKey: string;
}

export default function UsersPage() {
  // 유저 토큰 내 정보
  const userData = useAuthStore((state) => state.user);

  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('organzation');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [memberId, setMemberId] = useState('');
  const [firstMemberPw, setFirstMemberPw] = useState('');
  const [passwordOpenAuth, setPasswordOpenAuth] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [resetPasswordUser, setResetPasswordUser] = useState<selectMemberInfo>({
    userId: '',
    userKey: '',
  });
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false);
  const [deleteAccountUser, setDeleteAccountUser] = useState<selectMemberInfo>({
    userId: '',
    userKey: '',
  });
  const [tempPassword, setTempPassword] = useState('');
  const [idValid, setIdValid] = useState(false);
  const [idValidMsg, setIdValidMsg] = useState('');

  const isSuper = userData?.role === 'SUPER';
  const isAdmin = userData?.role === 'ADMIN';
  const orgId = userData?.organizationId ?? '';

  // SUPER 일 때, 전체 유저 목록 조회
  const { data: allUserData, isLoading: allUserIsLoading } = useGetUserList(statusFilter, isSuper); // 역할 super 일 때

  // ADMIN 일 때, 조직 내 멤버 목록 조회
  const { data: membersByOrganizationData, isLoading: membersByOrganizationIsLoading } =
    useGetMemberByOrganizationList(orgId, isAdmin);

  // 나를 제외한 멤버들만
  const exceptMeOrganizationData = membersByOrganizationData?.filter(
    (i) => i.userKey !== userData?.userKey
  );

  const filteredUsers = isSuper ? allUserData : exceptMeOrganizationData;
  const loadingUsers = isSuper ? allUserIsLoading : membersByOrganizationIsLoading;

  // 페이지네이션
  // const safeFilteredUsers = filteredUsers ?? [];

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const totalPages = Math.ceil((filteredUsers ?? []).length / usersPerPage);

  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const currentUsers = filteredUsers?.slice(startIndex, endIndex);

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
      setIsDeleteAccountModalOpen(false); // 모달 닫기
    },
  });

  // 조직 내 멤버 생성 mutate
  const { mutate: addMember } = useAddMember({
    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.message);
        setMemberId('');
        setIdValid(false);
        setIdValidMsg('');
      } else {
        toast.success('멤버 계정이 생성되었습니다.');
        setFirstMemberPw(data.data.password);
      }
    },
  });

  // 멤버 활성화 토글 함수
  const handleStatusToggle = (userKey: string, active: boolean) => {
    handleStatus({ userKey, active, role: userData?.role });
  };

  // 멤버 추가 함수
  const handleAddMember = (organizationId: string, userId: string) => {
    addMember({ organizationId, userId });
  };

  // 임시 비밀번호 발급 함수
  const handleResetPassword = async (resetPasswordUser: any) => {
    const res = await requestPost(`/api/v1/users/${resetPasswordUser}/password/reset`);

    if (res.code == 200) {
      toast.success('임시 비밀번호가 재발급되었습니다.');
      setTempPassword(res.data);
    }
  };

  // 멤버 제외 함수
  const handleDeleteAccount = (organizationId: string, userKey: string) => {
    userDelete({ organizationId, userKey });
  };

  const clipboard = useClipboard();

  // 비밀번호 복사 함수
  const handleCopyPassword = (password: string) => {
    clipboard.copy(password);
    toast.success('비밀번호가 복사되었습니다.');
  };

  // 액션 별 함수
  const handleAction = (action: string, userkey: string, userId?: string) => {
    if (action === 'resetPassword') {
      setIsResetPasswordModalOpen(true);
      setResetPasswordUser({
        userId: userId ?? '',
        userKey: userkey,
      });
      setTempPassword('');
    } else if (action === 'deleteAccount') {
      setIsDeleteAccountModalOpen(true);
      setDeleteAccountUser({
        userId: userId ?? '',
        userKey: userkey,
      });
    } else if (action === 'create') {
      setIsAddDialogOpen(true);
      setFirstMemberPw('');
      setMemberId('');
      setIdValid(false);
      setIdValidMsg('');
    }
  };

  // active 상태 뱃지 표시
  function getStatusBadge(active: number) {
    return active === 1 ? (
      <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800">
        ACTIVE
      </Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200 border-red-200 dark:border-red-700">
        INACTIVE
      </Badge>
    );
  }

  const validateUserId = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (userIdRegex.test(e.target.value)) {
      setIdValid(true);
      setIdValidMsg('유효한 아이디입니다.');
    } else {
      setIdValid(false);
      setIdValidMsg('아이디 형식이 맞지 않습니다.');
    }
  };

  return (
    <AppLayout>
      <Toaster position="bottom-center" richColors expand={true} />
      <div className="min-h-screen">
        <div className="space-y-6 container mx-auto px-4 py-6">
          {/* 페이지 헤더 */}
          <div className="flex justify-between sm:flex-row gap-4 mt-4">
            {/* {!loadingUsers || currentUsers.length !== 0 ? ( */}
            {currentUsers?.length !== 0 ? (
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Members ({filteredUsers?.length})
                </h1>
                <p className="text-gray-600 mt-1">Member들을 관리하세요</p>
              </div>
            ) : (
              <Skeleton className="h-6 w-[100px] bg-gray-200" />
            )}
            <div className="flex items-center space-x-2">
              {/* Search Input */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder={`Search by ${searchType}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyUp={(e) => {
                    if (e.key === 'Enter') {
                      // refetch(e.target.value);
                    }
                  }}
                  className="w-[250px] pl-10 border-input focus:border-primary"
                />
              </div>

              {/* 필터 */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[120px] border-input">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>

              {/* 멤버 생성 */}
              <Button
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                onClick={() => handleAction('create', '', '')}>
                <Plus className="h-4 w-4" />
                Create Member
              </Button>
            </div>
          </div>

          {/* 페이지 본문 테이블 */}
          <Card>
            <div className="pt-4"></div>
            <CardContent>
              <Table>
                <TableHeader className="hover:bg-white">
                  <TableRow className="hover:bg-white">
                    <TableHead>이름</TableHead>
                    <TableHead>이메일</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>역할</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>생성일</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="[&_tr:nth-last-child(2)]:border-0">
                  {/* {!loadingUsers || currentUsers?.length !== 0 */}
                  {currentUsers?.length !== 0
                    ? currentUsers?.map((user) => (
                        <React.Fragment key={user.userId}>
                          <TableRow
                            className={`transition-colors ${
                              expandedUser === user.userId
                                ? 'bg-blue-50 hover:bg-blue-50 border-l-4 border-b-0 border-blue-500'
                                : 'hover:bg-blue-50'
                            }`}
                            onClick={() => {
                              setExpandedUser(expandedUser === user.userId ? null : user.userId);
                              setPasswordOpenAuth(false);
                            }}
                            style={{ cursor: 'pointer' }}>
                            <TableCell className="flex items-center gap-3">
                              <Avatar className="h-7 w-7 ring-3 ring-blue-100 dark:ring-blue-900/50">
                                <AvatarImage src="/placeholder-user.jpg" />
                                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-semibold">
                                  {user?.fullName === null ? '' : user?.fullName?.slice(0, 1)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium text-blue-600">
                                {user?.fullName === null ? '없음' : user.fullName}
                              </span>
                            </TableCell>
                            <TableCell>
                              {user?.email === null ? '등록된 정보가 없습니다.' : user.email}
                            </TableCell>
                            <TableCell>{user.userId}</TableCell>
                            <TableCell>
                              <Badge variant={'outline'} className="bg-white">
                                {user.role}
                              </Badge>
                            </TableCell>
                            <TableCell>{getStatusBadge(user?.enabled)}</TableCell>
                            <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setExpandedUser(
                                    expandedUser === user.userId ? null : user.userId
                                  );
                                }}
                                className="h-8 w-8 p-0">
                                {expandedUser === user.userId ? (
                                  <ChevronDown className="h-4 w-4 text-gray-400" />
                                ) : (
                                  <ChevronRight className="h-4 w-4 text-gray-400" />
                                )}
                              </Button>
                            </TableCell>
                          </TableRow>

                          {/* 확장 상세 정보 */}
                          <TableRow
                            className={
                              expandedUser === user.userId
                                ? '!bg-muted/50 table-row'
                                : '!bg-muted/50 hidden'
                            }>
                            <TableCell colSpan={8} className="p-0">
                              <div className="bg-muted/20 border-t p-6">
                                {/* User Details */}
                                <Card className="border-border">
                                  <CardContent className="space-y-4 pt-6">
                                    <div className="grid xl:grid-cols-5 grid-cols-1 gap-4 ">
                                      <div className="col-span-3 xl:border-r xl:border-gray-300 border-b xl:border-b-0 pb-4 xl:pb-0">
                                        <div className="mb-3 tracking-tight text-lg font-semibold text-foreground flex items-center">
                                          <User className="h-5 w-5 mr-2" />
                                          유저 상세정보
                                          <div className="flex items-center space-x-2">
                                            <Switch
                                              checked={user.enabled === 1}
                                              onCheckedChange={(checked) => {
                                                handleStatusToggle(user.userKey, checked);
                                              }}
                                              className="ml-2 data-[state=checked]:bg-emerald-300 data-[state=unchecked]:bg-red-300"
                                            />
                                          </div>
                                        </div>
                                        <div className="grid grid-cols-4 gap-4">
                                          <div>
                                            <Label className="text-sm font-semibold text-muted-foreground">
                                              ID
                                            </Label>
                                            <p className="text-foreground">{user.userId}</p>
                                          </div>
                                          <div>
                                            <Label className="text-sm font-semibold text-muted-foreground">
                                              Email
                                            </Label>
                                            <p className="text-foreground">{user.email}</p>
                                          </div>

                                          <div>
                                            <Label className="text-sm font-semibold text-muted-foreground">
                                              userKey
                                            </Label>
                                            <p className="text-foreground">{user.userKey}</p>
                                          </div>
                                          <div>
                                            <Label className="text-sm font-semibold text-muted-foreground">
                                              Last Update
                                            </Label>
                                            <p className="text-foreground">
                                              {new Date(user.updatedAt).toLocaleDateString()}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="pl-15">
                                        <div className="mb-3 tracking-tight text-lg font-semibold text-foreground flex items-center">
                                          <Wrench className="h-4 w-4 mr-2" />
                                          작업
                                        </div>
                                        <div className="flex items-center justify-between space-x-2 sm:justify-start">
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleAction(
                                                'resetPassword',
                                                user?.userKey,
                                                user?.userId
                                              );
                                            }}
                                            className="border rounded-2 text-blue-700 hover:text-blue-700 hover:bg-blue-50 border-blue-300">
                                            <RotateCcw className="h-4 w-4" />
                                            임시 비밀번호 발급
                                          </Button>
                                          {!isSuper && (
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleAction(
                                                  'deleteAccount',
                                                  user?.userKey,
                                                  user?.userId
                                                );
                                              }}
                                              className="border border-red-300 rounded-2 text-red-600 hover:text-red-600 hover:bg-red-50">
                                              <Trash2 className="h-4 w-4" />
                                              멤버 제외
                                            </Button>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              </div>
                            </TableCell>
                          </TableRow>
                        </React.Fragment>
                      ))
                    : Array.from({ length: 5 }).map((_, index) => (
                        <TableRow
                          key={index}
                          className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200">
                          <TableCell className="w-12" colSpan={7}>
                            {/* <Skeleton className="h-6 w-full bg-gray-200" /> */}
                            현재 조직 내에 멤버가 존재하지 않습니다.
                          </TableCell>
                        </TableRow>
                      ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <CommonPagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
              groupSize={5}
            />
          )}
        </div>
      </div>

      {/* 멤버 생성 모달 */}
      <CreateMemberDialog
        isAddDialogOpen={isAddDialogOpen}
        setIsAddDialogOpen={setIsAddDialogOpen}
        firstMemberPw={firstMemberPw}
        memberId={memberId}
        organizationId={userData?.organizationId ?? ''}
        idValidMsg={idValidMsg}
        idValid={idValid}
        setMemberId={setMemberId}
        setTempPassword={setTempPassword}
        validateUserId={validateUserId}
        handleAddMember={handleAddMember}
        handleCopyPassword={handleCopyPassword}
      />

      {/* 임시 비밀번호 발급 모달 */}
      <ResetPasswordDialog
        isResetPasswordModalOpen={isResetPasswordModalOpen}
        setIsResetPasswordModalOpen={setIsResetPasswordModalOpen}
        tempPassword={tempPassword}
        userId={resetPasswordUser.userId}
        userKey={resetPasswordUser.userKey}
        handleResetPassword={handleResetPassword}
        handleCopyPassword={handleCopyPassword}
      />

      {/* 멤버 삭제 모달 */}
      <DeleteMemberDialog
        isDeleteAccountModalOpen={isDeleteAccountModalOpen}
        setIsDeleteAccountModalOpen={setIsDeleteAccountModalOpen}
        handleDeleteAccount={handleDeleteAccount}
        userId={deleteAccountUser.userId}
        userKey={deleteAccountUser.userKey}
        organizationId={userData?.organizationId ?? ''}
      />
    </AppLayout>
  );
}
