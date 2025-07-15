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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from '@/components/ui/drawer';
import {
  Search,
  Plus,
  Eye,
  Edit,
  UserX,
  RotateCcw,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
  User,
  Shield,
  Calendar,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from '@/components/ui/pagination';
import { useGetUserList } from '@/hooks/use-members';

export default function UsersPage() {
  // const { data: userListData } = useGetUserList();
  // console.log(userListData);

  // Mock user data with extended details
  // Mock user data with extended details
  const mockUsers = [
    // ...userListData || [],
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      status: 'active',
      role: 'Admin',
      createdAt: '2024-01-15',
      lastLogin: '2024-01-20',
      phone: '+1 (555) 123-4567',
      location: 'New York, NY',
      avatar: '/placeholder-user.jpg',
      permissions: [
        { resource: 'Users', actions: ['read', 'write', 'delete'] },
        { resource: 'Projects', actions: ['read', 'write'] },
        { resource: 'Settings', actions: ['read', 'write'] },
      ],
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      status: 'inactive',
      role: 'Editor',
      createdAt: '2024-01-10',
      lastLogin: '2024-01-18',
      phone: '+1 (555) 234-5678',
      location: 'Los Angeles, CA',
      avatar: '/placeholder-user.jpg',
      permissions: [
        { resource: 'Projects', actions: ['read', 'write'] },
        { resource: 'Content', actions: ['read', 'write'] },
      ],
    },
  ];
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Filter users based on search term and status
  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<(typeof mockUsers)[0] | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const usersPerPage = 5;

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  const handleAction = (action: string, userId: number, userName: string) => {
    console.log(`${action} action for user ${userId} (${userName})`);
    // Here you would implement the actual action logic
  };

  const handleUserClick = (user: (typeof mockUsers)[0]) => {
    setSelectedUser(user);
    setIsDrawerOpen(true);
  };

  const getStatusBadge = (status: string) => {
    return status === 'active' ? (
      <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800">
        Active
      </Badge>
    ) : (
      <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700">
        Inactive
      </Badge>
    );
  };

  const getRoleBadge = (role: string) => {
    const roleColors = {
      Admin:
        'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800',
      Editor:
        'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400 border-amber-200 dark:border-amber-800',
      Viewer:
        'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 dark:border-blue-800',
    };
    return (
      <Badge className={roleColors[role as keyof typeof roleColors] || roleColors.Viewer}>
        {role}
      </Badge>
    );
  };

  const getPermissionBadge = (action: string) => {
    const actionColors = {
      read: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800',
      write:
        'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400 border-amber-200 dark:border-amber-800',
      delete:
        'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800',
    };
    return (
      <Badge
        variant="outline"
        className={actionColors[action as keyof typeof actionColors] || actionColors.read}
      >
        {action}
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
                Users ({filteredUsers.length})
              </CardTitle>

              {/* Top Bar Controls */}
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                {/* Search Input */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
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
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>

                {/* Create User Button */}
                <Button
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                  onClick={() => handleAction('create', 0, '')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create User
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {/* Users Table */}
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border">
                      <TableHead className="font-semibold text-muted-foreground">Name</TableHead>
                      <TableHead className="font-semibold text-muted-foreground">Email</TableHead>
                      <TableHead className="font-semibold text-muted-foreground">Status</TableHead>
                      <TableHead className="font-semibold text-muted-foreground">
                        Created At
                      </TableHead>
                      <TableHead className="font-semibold text-muted-foreground text-right">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentUsers.map((user) => (
                      <TableRow
                        key={user.id}
                        className="hover:bg-muted/50 border-border cursor-pointer"
                        onClick={() => handleUserClick(user)}
                      >
                        <TableCell className="py-4">
                          <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-sm font-medium text-primary">
                                {user.name
                                  .split(' ')
                                  .map((n: string) => n[0])
                                  .join('')}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium text-foreground">{user.name}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{user.email}</TableCell>
                        <TableCell>{getStatusBadge(user.status)}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAction('view', user.id, user.name);
                              }}
                              className="h-8 w-8 p-0 hover:bg-muted"
                            >
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAction('edit', user.id, user.name);
                              }}
                              className="h-8 w-8 p-0 hover:bg-muted"
                            >
                              <Edit className="h-4 w-4 text-muted-foreground" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAction('deactivate', user.id, user.name);
                              }}
                              className="h-8 w-8 p-0 hover:bg-amber-100 dark:hover:bg-amber-900/20"
                            >
                              <UserX className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAction('reset', user.id, user.name);
                              }}
                              className="h-8 w-8 p-0 hover:bg-blue-100 dark:hover:bg-blue-900/20"
                            >
                              <RotateCcw className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAction('delete', user.id, user.name);
                              }}
                              className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900/20"
                            >
                              <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Empty State */}
              {currentUsers.length === 0 && (
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
                      Showing {startIndex + 1} to {Math.min(endIndex, filteredUsers.length)} of{' '}
                      {filteredUsers.length} users
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

      {/* User Detail Drawer */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="h-[85vh] bg-background border-border">
          <DrawerHeader className="border-b border-border">
            <div className="flex items-center justify-between">
              <DrawerTitle className="text-xl font-semibold text-foreground">
                User Details
              </DrawerTitle>
              <DrawerClose asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <X className="h-4 w-4" />
                </Button>
              </DrawerClose>
            </div>
          </DrawerHeader>

          {selectedUser && (
            <div className="flex-1 overflow-y-auto p-6">
              {/* User Header */}
              <div className="flex items-start space-x-4 mb-6">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xl font-semibold text-primary">
                    {selectedUser.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </span>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-foreground mb-1">{selectedUser.name}</h2>
                  <p className="text-muted-foreground mb-2">{selectedUser.email}</p>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(selectedUser.status)}
                    {getRoleBadge(selectedUser.role)}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mb-6">
                <Button
                  variant="outline"
                  onClick={() => handleAction('reset', selectedUser.id, selectedUser.name)}
                  className="border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-900/20"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset Password
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleAction('deactivate', selectedUser.id, selectedUser.name)}
                  className="border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-300 dark:hover:bg-amber-900/20"
                >
                  <UserX className="h-4 w-4 mr-2" />
                  Deactivate
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleAction('delete', selectedUser.id, selectedUser.name)}
                  className="border-red-200 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>

              {/* Tabbed Content */}
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-muted">
                  <TabsTrigger
                    value="profile"
                    className="data-[state=active]:bg-background data-[state=active]:text-foreground"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </TabsTrigger>
                  <TabsTrigger
                    value="permissions"
                    className="data-[state=active]:bg-background data-[state=active]:text-foreground"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Permissions
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="mt-6">
                  <div className="space-y-6">
                    <Card className="border-border">
                      <CardHeader>
                        <CardTitle className="text-lg font-semibold text-foreground">
                          Basic Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center space-x-3">
                            <Mail className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium text-foreground">Email</p>
                              <p className="text-muted-foreground">{selectedUser.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Phone className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium text-foreground">Phone</p>
                              <p className="text-muted-foreground">{selectedUser.phone}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <MapPin className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium text-foreground">Location</p>
                              <p className="text-muted-foreground">{selectedUser.location}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Calendar className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium text-foreground">Last Login</p>
                              <p className="text-muted-foreground">
                                {new Date(selectedUser.lastLogin).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-border">
                      <CardHeader>
                        <CardTitle className="text-lg font-semibold text-foreground">
                          Account Details
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-foreground mb-1">Status</p>
                            {getStatusBadge(selectedUser.status)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground mb-1">Role</p>
                            {getRoleBadge(selectedUser.role)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground mb-1">Created</p>
                            <p className="text-muted-foreground">
                              {new Date(selectedUser.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground mb-1">User ID</p>
                            <p className="text-muted-foreground font-mono">#{selectedUser.id}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="permissions" className="mt-6">
                  <Card className="border-border">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-foreground">
                        Resource Permissions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {selectedUser.permissions.map((permission, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border"
                          >
                            <div>
                              <h4 className="font-medium text-foreground mb-1">
                                {permission.resource}
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {permission.actions.map((action) => (
                                  <span key={action}>{getPermissionBadge(action)}</span>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </DrawerContent>
      </Drawer>
    </AppLayout>
  );
}
