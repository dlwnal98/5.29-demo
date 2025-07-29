'use client';

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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Search,
  Plus,
  RotateCcw,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  User,
  Shield,
  AlertTriangle,
  Wrench,
  LockKeyholeIcon,
  LockKeyholeOpenIcon,
  Copy,
} from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from '@/components/ui/pagination';
import {
  UserList,
  useGetUserList,
  useGetMemberByOrganizationList,
  issueTempPassword,
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

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('organzation');
  const [statusFilter, setStatusFilter] = useState<boolean | 'all'>('all');
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [memberId, setMemberId] = useState('');
  const [firstMemberPw, setFirstMemberPw] = useState('123jkhsdfskjdf23fdzs');
  const [adminPw, setAdminPw] = useState('');
  const [passwordOpenAuth, setPasswordOpenAuth] = useState(false);
  // const [active, setActive] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [passwordOpenDialogOpen, setPasswordOpenDialogOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [resetPasswordUser, setResetPasswordUser] = useState<string>('');
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false);
  const [deleteAccountUser, setDeleteAccountUser] = useState<string>('');
  const [nowPw, setNowPw] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  const organizationId = ''; // 로그인한 유저 정보에 담겨있어야함

  const {
    data: userListData,
    refetch: allUserRefetch,
    isLoading,
    isError,
  } = useGetUserList(statusFilter); // 역할 super 일 때

  const { data: memberByOrganizationListData, refetch: memberRefetch } =
    useGetMemberByOrganizationList(organizationId); //넥스프론 조직id

  console.log(userListData, memberByOrganizationListData);

  const filteredUsers = [
    {
      userKey: 'hCo3KADKAAAR',
      userId: 'user1234',
      password: '$2a$10$fnOJSvvC3xnsB9M5oxFgteal05fXQ.HWKGZgnXWad2fr/aR8ZHpG2',
      fullName: '김길동',
      email: 'kkd@nexfron.com',
      enabled: 1,
      lastLoginAt: null,
      createdAt: '2025-07-24T13:29:12',
      updatedAt: '2025-07-24T13:29:12',
      role: 'ADMIN',
      organizationId: 'haBagyDzAAA2',
    },
    {
      userKey: 'HDOs245LLksb',
      userId: 'super',
      password: '$2a$10$5MVQ2QUwyOveQzcAnFL0y.hVYHp85Zz5ocUsotJnU5oM9T5QVKH5m',
      fullName: '갤럭시',
      email: 'super@email.com',
      enabled: 1,
      lastLoginAt: null,
      createdAt: '2025-07-28T11:10:37',
      updatedAt: '2025-07-28T16:34:53',
      role: 'MEMBER',
      organizationId: 'haBagyDzAAA2',
    },
    {
      userKey: 'hCvORnDKAAAG',
      userId: 'user1',
      password: '$2a$10$dyOLmtbON.Qj59Xuxp19EuLg6Wno.O8pT8krV/ffNcf2PF1iLSvH.',
      fullName: '박기홍',
      email: 'pkh@nexfron.com',
      enabled: 1,
      lastLoginAt: null,
      createdAt: '2025-07-24T13:54:23',
      updatedAt: '2025-07-28T11:29:11',
      role: 'MEMBER',
      organizationId: 'haBagyDzAAA2',
    },
  ];
  // const filteredUsers = memberByOrganizationListData;
  // Pagination logic
  const totalPages = Math.ceil(filteredUsers?.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const currentUsers = filteredUsers?.slice(startIndex, endIndex);

  const { mutate: handleStatus } = useMemberHandleStatus({
    onSuccess: () => {
      toast.success('상태가 변경되었습니다.');
    },
  });

  const handleStatusToggle = (userKey: string, active?: boolean | 'all') => {
    handleStatus({ userKey, active });
  };

  const { mutate: userDelete } = useDeleteMember({
    onSuccess: () => {
      toast.success('유저가 삭제되었습니다.');
      setIsDeleteAccountModalOpen(false); // 모달 닫기
      allUserRefetch(); // 유저 목록 새로고침
    },
  });

  const handleAction = (action: string, userkey: string, userName: string) => {
    if (action === 'resetPassword') {
      setIsResetPasswordModalOpen(true);
      setResetPasswordUser(userkey);
    } else if (action === 'deleteAccount') {
      setIsDeleteAccountModalOpen(true);
      setDeleteAccountUser(userkey);
    } else if (action === 'create') {
      setIsAddDialogOpen(true);
    }
  };

  const { mutate: addMember } = useAddMember({
    onSuccess: (data) => {
      toast.success('멤버 계정이 생성되었습니다.');
      // setIsAddDialogOpen(false); // 모달 닫기
      // memberRefetch(); // 유저 목록 새로고침
      setFirstMemberPw(data);
    },
  });

  const handleAddMember = (organizationId: string, userId: string) => {
    addMember({ organizationId, userId });
  };

  const handleResetPassword = (resetPasswordUser: any) => {
    issueTempPassword(resetPasswordUser, () => setIsResetPasswordModalOpen(false));
  };

  const handleDeleteAccount = (organizationId: string, userKey: string) => {
    userDelete({ organizationId, userKey });
  };

  // active 필드로 상태 뱃지 표시
  const getStatusBadge = (active: boolean) => {
    return active ? (
      <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800">
        Active
      </Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200 border-red-200 dark:border-red-700">
        Inactive
      </Badge>
    );
  };

  function maskPasswordInResponse(response: any) {
    const maskedPassword = '*'.repeat(response.length);
    return maskedPassword;
  }

  const handleCopyPassword = (password: string) => {
    navigator.clipboard.writeText(password);
    // toast.success('ARN이 클립보드에 복사되었습니다.');
    toast.success('비밀번호가 복사되었습니다.');
  };

  if (isLoading) return <div> 로딩중</div>;
  if (isError || !userListData) return <div>에러확인</div>;
  return (
    <AppLayout>
      <Toaster position="bottom-center" richColors expand={true} />
      <div className="min-h-screen">
        <div className="container mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">User Management</h1>
            <p className="text-muted-foreground">Manage users, permissions, and account settings</p>
          </div>

          {/* Main Content Card */}
          <Card className="glass border-border">
            <CardHeader className="border-b border-border space-y-3">
              <CardTitle className="text-xl font-semibold text-foreground">
                Users ({filteredUsers?.length})
              </CardTitle>

              {/* Top Bar Controls */}
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                {/* Search Type Selector */}
                <Select value={searchType} onValueChange={setSearchType}>
                  <SelectTrigger className="w-full sm:w-[140px] border-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="organization">organization</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                  </SelectContent>
                </Select>

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
                    className="pl-10 border-input focus:border-primary"
                  />
                </div>

                {/* Status Filter */}
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[180px] border-input">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="true">Active Only</SelectItem>
                    <SelectItem value="false">Inactive Only</SelectItem>
                  </SelectContent>
                </Select>

                {/* Create User Button */}
                <Button
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                  onClick={() => handleAction('create', '', '')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create User
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {/* Users Table UI */}
              {currentUsers ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12"></TableHead>
                      <TableHead>이름</TableHead>
                      <TableHead>이메일</TableHead>
                      <TableHead>ID</TableHead>
                      <TableHead>역할</TableHead>
                      <TableHead className="w-4">상태</TableHead>
                      <TableHead>생성일</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentUsers.length > 0 ? (
                      currentUsers.map((user) => (
                        <>
                          <TableRow
                            key={user.userId}
                            className={`transition-colors ${
                              expandedUser === user.userId
                                ? 'bg-blue-50 border-l-4 border-b-0 border-blue-50ew0'
                                : 'hover:bg-muted/50'
                            }`}
                            onClick={() => {
                              setExpandedUser(expandedUser === user.userId ? null : user.userId);
                              setPasswordOpenAuth(false);
                            }}
                            style={{ cursor: 'pointer' }}
                          >
                            <TableCell></TableCell>
                            <TableCell className="flex items-center gap-3">
                              <Avatar className="h-7 w-7 ring-3 ring-blue-100 dark:ring-blue-900/50">
                                <AvatarImage src="/placeholder-user.jpg" />
                                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-semibold">
                                  {user.fullName.slice(0, 1)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium text-blue-600">{user.fullName}</span>
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.userId}</TableCell>
                            <TableCell>
                              <Badge variant={'outline'} className="bg-white">
                                {user.role}
                              </Badge>
                            </TableCell>
                            <TableCell>{getStatusBadge(user.enabled)}</TableCell>
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
                                className="h-8 w-8 p-0"
                              >
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
                            className={expandedUser === user.userId ? 'table-row' : 'hidden'}
                          >
                            <TableCell colSpan={8} className="p-0">
                              <div className="bg-muted/20 border-t p-6">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                  {/* User Details */}
                                  <Card className="border-border">
                                    <CardHeader className="flex-row items-center justify-between pb-3 ">
                                      <CardTitle className="text-lg font-semibold text-foreground flex items-center">
                                        <User className="h-5 w-5 mr-2" />
                                        유저 상세정보
                                      </CardTitle>
                                      <div className="flex items-center space-x-2">
                                        {/* <span className="text-sm font-medium">활성화</span> */}
                                        <Switch
                                          checked={user.enabled}
                                          onCheckedChange={(checked) =>
                                            handleStatusToggle(user.userKey, checked)
                                          }
                                          className="data-[state=checked]:bg-emerald-300 data-[state=unchecked]:bg-red-300"
                                        />
                                      </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <Label className="text-sm font-medium text-muted-foreground">
                                            ID
                                          </Label>
                                          <p className="text-foreground">{user.userId}</p>
                                        </div>
                                        <div>
                                          <Label className="text-sm font-medium text-muted-foreground">
                                            Email
                                          </Label>
                                          <p className="text-foreground">{user.email}</p>
                                        </div>

                                        <div>
                                          <Label className="text-sm font-medium text-muted-foreground">
                                            userKey
                                          </Label>
                                          <p className="text-foreground">{user.userKey}</p>
                                        </div>
                                        <div>
                                          <Label className="text-sm font-medium text-muted-foreground">
                                            Last Update
                                          </Label>
                                          <p className="text-foreground">
                                            {new Date(user.updatedAt).toLocaleDateString()}
                                          </p>
                                        </div>
                                        <div className="col-span-2 border-t border-t-gray-300">
                                          <div className="py-2 tracking-tight text-lg font-semibold text-foreground flex items-center">
                                            <Wrench className="h-4 w-4 mr-2" />
                                            작업
                                          </div>
                                          <div className="flex items-end justify-between space-x-2 w-[100%]">
                                            <div className="space-x-2">
                                              <Button
                                                variant="secondary"
                                                size="sm"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setNowPw(user.password);
                                                  setPasswordOpenAuth(false);
                                                  setPasswordOpenDialogOpen(true);
                                                }}
                                              >
                                                <LockKeyholeIcon className="h-4 w-4" />
                                                비밀번호 확인
                                              </Button>
                                              <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  handleAction(
                                                    'resetPassword',
                                                    user.userkey,
                                                    user.fullName
                                                  );
                                                }}
                                                className="border rounded-2 hover:text-blue-700 hover:bg-blue-50 hover:border-blue-300"
                                              >
                                                <RotateCcw className="h-4 w-4" />
                                                임시 비밀번호 발급
                                              </Button>
                                            </div>
                                            <div>
                                              <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  handleAction(
                                                    'deleteAccount',
                                                    user.userkey,
                                                    user.fullName
                                                  );
                                                }}
                                                className="border border-red-300 rounded-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                                              >
                                                <Trash2 className="h-4 w-4" />
                                                유저 삭제
                                              </Button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>

                                  <Card className="border-border">
                                    <CardHeader className="pb-3">
                                      <CardTitle className="text-lg font-semibold text-foreground flex items-center">
                                        <Shield className="h-5 w-5 mr-2" />
                                        권한
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">권한 정보 없음</CardContent>
                                  </Card>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        </>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                          검색 결과가 없습니다.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12"></TableHead>
                      <TableHead>이름</TableHead>
                      <TableHead>이메일</TableHead>
                      <TableHead>ID</TableHead>
                      <TableHead>상태</TableHead>
                      <TableHead>생성일</TableHead>
                      <TableHead className="text-right">작업</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                        사용자 데이터를 불러오는 중입니다.
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              )}

              {/* Empty State */}
              {currentUsers?.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-muted-foreground mb-2">
                    <Search className="h-12 w-12 mx-auto mb-4" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-2">No users found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="border-t border-border px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Showing {startIndex + 1} to {Math.min(endIndex, filteredUsers?.length)} of{' '}
                      {filteredUsers?.length} users
                    </div>

                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="hover:bg-muted"
                          >
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            Previous
                          </Button>
                        </PaginationItem>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <PaginationItem key={page}>
                            <PaginationLink
                              onClick={() => setCurrentPage(page)}
                              isActive={currentPage === page}
                              className={
                                currentPage === page
                                  ? 'bg-primary text-primary-foreground'
                                  : 'hover:bg-muted'
                              }
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        ))}

                        <PaginationItem>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className="hover:bg-muted"
                          >
                            Next
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Member Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        {firstMemberPw?.length === 0 ? (
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add Member</DialogTitle>
              <DialogDescription>Create organization member information.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Member ID</Label>
                  <Input
                    id="memberId"
                    value={memberId}
                    onChange={(e) => setMemberId(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                취소
              </Button>
              <Button onClick={() => handleAddMember(organizationId, memberId)}>생성</Button>
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
                    className="flex items-center hover:underline"
                    onClick={() => handleCopyPassword(firstMemberPw)}
                  >
                    <span>{firstMemberPw}</span>
                    <Copy className="h-4 w-4 ml-2" />
                  </button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="default" onClick={() => setIsAddDialogOpen(false)}>
                확인
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* Reset Password Modal */}
      <Dialog open={isResetPasswordModalOpen} onOpenChange={setIsResetPasswordModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center text-blue-600">
              <RotateCcw className="h-5 w-5 mr-2" />
              비밀번호 재설정
            </DialogTitle>
            <DialogDescription className="text-left space-y-3">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="font-semibold text-blue-800 mb-2">
                  임시 비밀번호를 발급하시겠습니까?
                </p>
                <p className="text-blue-700 text-sm">
                  <strong>{resetPasswordUser}</strong> 사용자에게 임시 비밀번호가 이메일로
                  전송됩니다.
                  <br />
                  사용자는 다음 로그인 시 비밀번호를 변경해야 합니다.
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex space-x-2">
            <Button variant="outline" onClick={() => setIsResetPasswordModalOpen(false)}>
              취소
            </Button>
            <Button
              onClick={() => handleResetPassword(resetPasswordUser)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              임시 비밀번호 발급
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Account Modal */}
      <Dialog open={isDeleteAccountModalOpen} onOpenChange={setIsDeleteAccountModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center text-red-600">
              <AlertTriangle className="h-5 w-5 mr-2" />
              계정 삭제
            </DialogTitle>
            <DialogDescription className="text-left space-y-3">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="font-semibold text-red-800 mb-2">
                  ⚠️ 이 작업은 실행 취소할 수 없습니다.
                </p>
                <p className="text-red-700 text-sm">
                  <strong>{deleteAccountUser}</strong> 계정이 영구적으로 삭제됩니다.
                  <br />• 모든 사용자 데이터가 삭제됩니다
                  <br />• 사용자의 모든 권한이 제거됩니다
                  <br />• 관련된 모든 활동 기록이 삭제됩니다
                  <br />
                  <br />
                  <span className="font-semibold">정말로 이 계정을 삭제하시겠습니까?</span>
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex space-x-2">
            <Button variant="outline" onClick={() => setIsDeleteAccountModalOpen(false)}>
              취소
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleDeleteAccount(organizationId, deleteAccountUser)}
              className="bg-red-600 hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              계정 삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Password Open Dialog */}
      <Dialog open={passwordOpenDialogOpen} onOpenChange={setPasswordOpenDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Password Auth</DialogTitle>
            <DialogDescription>Create organization member information.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Password</Label>
                <div className="text-foreground flex items-center text-sm">
                  {passwordOpenAuth ? (
                    <>
                      {nowPw}
                      <button onClick={() => handleCopyPassword(nowPw)} className="ml-2">
                        <Copy className="h-4 w-4 " />
                      </button>
                    </>
                  ) : (
                    <>{maskPasswordInResponse(nowPw)}</>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-muted-foreground">
                  Auth
                </Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="adminPw"
                    type="password"
                    value={adminPw}
                    onChange={(e) => setAdminPw(e.target.value)}
                  />
                  <Button
                    onClick={() => {
                      // setPasswordOpenDialogOpen(false);

                      //api 호출해서 성공하면 true로 변경
                      setPasswordOpenAuth(true);
                    }}
                  >
                    인증
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex !justify-center">
            <Button
              variant="default"
              onClick={() => {
                setPasswordOpenAuth(false);
                setPasswordOpenDialogOpen(false);
              }}
            >
              닫기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
