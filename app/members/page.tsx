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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
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

export default function UsersPage() {
  // Mock user data with extended details

  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('tenant');
  // const [statusFilter, setStatusFilter] = useState('all');
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  // userListData를 실제 데이터로 사용

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const { data: userListData, refetch: allUserRefetch } = useGetUserList();
  const { data: tenantUserListData, refetch } = useGetUserByTenantList(searchTerm);

  const basedData = userListData?.filter((user) => {
    const searchValue = searchType === 'email' ? user.email : user.tenantId;
    const matchesSearch = searchValue.toLowerCase().includes(searchTerm.toLowerCase());
    // const matchesStatus =
    //   statusFilter === 'all' || (statusFilter === 'active' ? user.active : !user.active);
    // return matchesSearch && matchesStatus;
  });

  // Filter users based on search term and status
  const filteredUsers = tenantUserListData ? tenantUserListData : userListData;

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
  const [editingUser, setEditingUser] = useState<(typeof userListData)[0] | null>(null);
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

  const handleUserEdit = (user: (typeof userListData)[0]) => {
    setEditingUser(user);
    setIsEditDialogOpen(true);
  };

  const handleAction = (action: string, userId: string, userName: string) => {
    if (action === 'resetPassword') {
      setIsResetPasswordModalOpen(true);
      setResetPasswordUser(userId);
    } else if (action === 'deleteAccount') {
      setIsDeleteAccountModalOpen(true);
      setDeleteAccountUser(userId);
    }
  };

  const handleSaveUser = () => {
    console.log('Saving user:', editingUser);
    setIsEditDialogOpen(false);
    setEditingUser(null);
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
      <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700">
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
              {/* Users Table with Collapsible Details */}
              <div className="space-y-0">
                {currentUsers?.map((user) => (
                  <Collapsible
                    key={user.userId}
                    open={expandedUser === user.userId}
                    onOpenChange={(open) => setExpandedUser(open ? user.userId : null)}
                  >
                    <CollapsibleTrigger asChild>
                      <div className="w-full p-4 hover:bg-muted/50 border-b border-border cursor-pointer transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 flex-1">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-sm font-medium text-primary">
                                {user.name
                                  .split(' ')
                                  .map((n: string) => n[0])
                                  .join('')}
                              </span>
                            </div>
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                              <div>
                                <div className="font-medium text-foreground">{user.name}</div>
                                <div className="text-sm text-muted-foreground">{user.email}</div>
                              </div>
                              <div>
                                <div className="text-sm text-muted-foreground">Tenant</div>
                                <div className="font-medium text-foreground">{user.tenantId}</div>
                              </div>
                              <div>{getStatusBadge(user.active)}</div>
                              <div className="text-sm text-muted-foreground">
                                {new Date(user.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {expandedUser === user.userId ? (
                              <ChevronUp className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                        </div>
                      </div>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <div className="border-b border-border bg-muted/20 p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* User Details */}
                          <Card className="border-border">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-lg font-semibold text-foreground flex items-center">
                                <User className="h-5 w-5 mr-2" />
                                User Details
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-sm font-medium text-muted-foreground">
                                    Email
                                  </Label>
                                  <p className="text-foreground">{user.email}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-muted-foreground">
                                    Phone
                                  </Label>
                                  <p className="text-foreground">-</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-muted-foreground">
                                    Location
                                  </Label>
                                  <p className="text-foreground">-</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-muted-foreground">
                                    Last Update
                                  </Label>
                                  <p className="text-foreground">
                                    {new Date(user.updatedAt).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>

                              {/* Status Toggle */}
                              <div className="flex items-center justify-between pt-4 border-t border-border">
                                <div className="flex items-center space-x-2">
                                  <UserCheck className="h-4 w-4 text-muted-foreground" />
                                  <Label className="text-sm font-medium">Account Status</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm text-muted-foreground">Inactive</span>
                                  <Switch
                                    checked={user.active}
                                    onCheckedChange={(checked) =>
                                      handleStatusToggle(user.userId, checked, user.active)
                                    }
                                  />
                                  <span className="text-sm text-muted-foreground">Active</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          {/* Actions */}
                          <Card className="border-border">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-lg font-semibold text-foreground flex items-center">
                                <Settings className="h-5 w-5 mr-2" />
                                Actions
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              {/* <Button
                                variant="outline"
                                className="w-full justify-start bg-transparent"
                                onClick={() => handleUserEdit(user)}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit User Information
                              </Button> */}

                              <Button
                                variant="outline"
                                className="w-full justify-start border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-900/20 bg-transparent"
                                onClick={() =>
                                  handleAction('resetPassword', user.userId, user.name)
                                }
                              >
                                <RotateCcw className="h-4 w-4 mr-2" />
                                Reset Password
                              </Button>

                              {/* <Button
                                variant="outline"
                                className="w-full justify-start border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-300 dark:hover:bg-amber-900/20 bg-transparent"
                                onClick={() =>
                                  handleAction('changePassword', user.userId, user.name)
                                }
                              >
                                <Key className="h-4 w-4 mr-2" />
                                Change Password
                              </Button> */}

                              <Button
                                variant="outline"
                                className="w-full justify-start border-red-200 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-900/20 bg-transparent"
                                onClick={() =>
                                  handleAction('deleteAccount', user.userId, user.name)
                                }
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Account
                              </Button>
                            </CardContent>
                          </Card>
                        </div>

                        {/* Permissions - userListData에는 없으므로 대체 */}
                        <Card className="border-border mt-6">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-lg font-semibold text-foreground flex items-center">
                              <Shield className="h-5 w-5 mr-2" />
                              Permissions
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3 text-muted-foreground">권한 정보 없음</div>
                          </CardContent>
                        </Card>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>

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

          {editingUser && (
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
                    onCheckedChange={(checked) =>
                      setEditingUser({ ...editingUser, active: checked })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="createdAt">Created At</Label>
                <Input id="createdAt" value={editingUser.createdAt} disabled />
              </div>
            </div>
          )}

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
