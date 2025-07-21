'use client';

import { act, useState } from 'react';
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
  Edit,
  RotateCcw,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  User,
  Shield,
  Key,
  Settings,
  UserCheck,
  AlertTriangle,
  Wrench,
} from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from '@/components/ui/pagination';
import {
  UserList,
  useUserActivate,
  useUserInactivate,
  useGetUserList,
  useGetUserByTenantList,
  issueTempPassword,
  useDeleteUser,
} from '@/hooks/use-members';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('tenant');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const { data: userListData, refetch: allUserRefetch } = useGetUserList();
  const { data: tenantUserListData, refetch } = useGetUserByTenantList(searchTerm);

  const filteredUsers = searchTerm === '' ? userListData : tenantUserListData;

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers?.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const currentUsers = filteredUsers?.slice(startIndex, endIndex);

  const { mutate: userActivate } = useUserActivate();
  const { mutate: userInactivate } = useUserInactivate();

  const handleStatusToggle = (userId: string, newStatus: boolean, userActive: boolean) => {
    if (!userActive) userActivate(userId);
    else userInactivate(userId);
  };

  // 편집 상태 타입도 users[0]으로 변경
  const [editingUser, setEditingUser] = useState({
    name: '',
    email: '',
    tenantId: '',
    active: false,
    createdAt: '',
    updatedAt: '',
  });
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  // Reset Password Modal States
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [resetPasswordUser, setResetPasswordUser] = useState<(typeof userListData)[0] | null>(null);

  // Delete Account Modal States
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false);
  const [deleteAccountUser, setDeleteAccountUser] = useState<string>('');

  const { mutate: userDelete } = useDeleteUser(deleteAccountUser, {
    onSuccess: () => {
      alert('유저가 삭제되었습니다.');
      setIsDeleteAccountModalOpen(false); // 모달 닫기
      allUserRefetch(); // 유저 목록 새로고침
      // 필요하다면 alert 등 추가
    },
  });

  const handleAction = (action: string, userId: string, userName: string) => {
    if (action === 'resetPassword') {
      setIsResetPasswordModalOpen(true);
      setResetPasswordUser(userId);
    } else if (action === 'deleteAccount') {
      setIsDeleteAccountModalOpen(true);
      setDeleteAccountUser(userId);
    } else if (action === 'create') {
      setIsEditDialogOpen(true);
    }
  };

  const handleSaveUser = () => {
    console.log('Saving user:', editingUser);
    setIsEditDialogOpen(false);
    // setEditingUser(null);
  };

  const handleResetPassword = () => {
    issueTempPassword(resetPasswordUser, 'temp1234!', () => setIsResetPasswordModalOpen(false));
  };

  const handleDeleteAccount = () => {
    userDelete();
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

  return (
    <AppLayout>
      <div className="min-h-screen">
        <div className="container mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">User Management</h1>
            <p className="text-muted-foreground">Manage users, permissions, and account settings</p>
          </div>

          {/* Main Content Card */}
          <Card className="glass border-border">
            <CardHeader className="border-b border-border">
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
                    <SelectItem value="tenant">Tenant</SelectItem>
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
                        refetch(e.target.value);
                      }
                    }}
                    className="pl-10 border-input focus:border-primary"
                  />
                </div>

                {/* Status Filter */}
                {/* <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[180px] border-input">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="true">Active Only</SelectItem>
                    <SelectItem value="false">Inactive Only</SelectItem>
                  </SelectContent>
                </Select> */}

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
                      <TableHead>테넌트</TableHead>
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
                                ? 'bg-blue-50 border-l-4 border-b-0 border-blue-500'
                                : 'hover:bg-muted/50'
                            }`}
                            onClick={() =>
                              setExpandedUser(expandedUser === user.userId ? null : user.userId)
                            }
                            style={{ cursor: 'pointer' }}
                          >
                            <TableCell></TableCell>
                            <TableCell className="flex items-center gap-3">
                              <Avatar className="h-7 w-7 ring-3 ring-blue-100 dark:ring-blue-900/50">
                                <AvatarImage src="/placeholder-user.jpg" />
                                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-semibold">
                                  {user.name.slice(0, 1)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium text-blue-600">{user.name}</span>
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.tenantId}</TableCell>
                            <TableCell>{getStatusBadge(user.active)}</TableCell>
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
                                          checked={user.active}
                                          onCheckedChange={(checked) =>
                                            handleStatusToggle(user.userId, checked, user.active)
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
                                            Tenant
                                          </Label>
                                          <p className="text-foreground">{user.tenantId}</p>
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
                                          <div className="flex items-center space-x-2">
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleAction(
                                                  'resetPassword',
                                                  user.userId,
                                                  user.name
                                                );
                                              }}
                                              // className="h-8 w-8 p-0"
                                              className="border rounded-2 hover:text-blue-700 hover:bg-blue-50 hover:border-blue-300"
                                            >
                                              <RotateCcw className="h-4 w-4" />
                                              임시 비밀번호 발급
                                            </Button>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleAction(
                                                  'deleteAccount',
                                                  user.userId,
                                                  user.name
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
                      <TableHead>테넌트</TableHead>
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

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit User Information</DialogTitle>
            <DialogDescription>Update user details and account information.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tenant">Tenant</Label>
                <Input
                  id="tenant"
                  value={editingUser.tenantId}
                  onChange={(e) => setEditingUser({ ...editingUser, tenantId: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="active">Active</Label>
                <Switch
                  checked={editingUser.active}
                  onCheckedChange={(checked) => setEditingUser({ ...editingUser, active: checked })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="createdAt">Created At</Label>
              <Input id="createdAt" value={editingUser.createdAt} disabled />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveUser}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
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
            <Button onClick={handleResetPassword} className="bg-blue-600 hover:bg-blue-700">
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
              onClick={handleDeleteAccount}
              className="bg-red-600 hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              계정 삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
