"use client"

import { useState } from "react"
import { AppLayout } from "@/components/layout/AppLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
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
} from "lucide-react"
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination"

export default function UsersPage() {
  // Mock user data with extended details
  const mockUsers = [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      tenant: "acme-corp",
      status: "active",
      role: "Admin",
      createdAt: "2024-01-15",
      lastLogin: "2024-01-20",
      phone: "+1 (555) 123-4567",
      location: "New York, NY",
      avatar: "/placeholder-user.jpg",
      permissions: [
        { resource: "Users", actions: ["read", "write", "delete"] },
        { resource: "Projects", actions: ["read", "write"] },
        { resource: "Settings", actions: ["read", "write"] },
      ],
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      tenant: "tech-solutions",
      status: "inactive",
      role: "Editor",
      createdAt: "2024-01-10",
      lastLogin: "2024-01-18",
      phone: "+1 (555) 234-5678",
      location: "Los Angeles, CA",
      avatar: "/placeholder-user.jpg",
      permissions: [
        { resource: "Projects", actions: ["read", "write"] },
        { resource: "Content", actions: ["read", "write"] },
      ],
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike.johnson@example.com",
      tenant: "acme-corp",
      status: "active",
      role: "Viewer",
      createdAt: "2024-01-12",
      lastLogin: "2024-01-19",
      phone: "+1 (555) 345-6789",
      location: "Chicago, IL",
      avatar: "/placeholder-user.jpg",
      permissions: [{ resource: "Projects", actions: ["read"] }],
    },
  ]

  const [searchTerm, setSearchTerm] = useState("")
  const [searchType, setSearchType] = useState("email")
  const [statusFilter, setStatusFilter] = useState("all")
  const [expandedUser, setExpandedUser] = useState<number | null>(null)
  const [editingUser, setEditingUser] = useState<(typeof mockUsers)[0] | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  // Filter users based on search term and status
  const filteredUsers = mockUsers.filter((user) => {
    const searchValue = searchType === "email" ? user.email : user.tenant
    const matchesSearch = searchValue.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const [currentPage, setCurrentPage] = useState(1)
  const usersPerPage = 10

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)
  const startIndex = (currentPage - 1) * usersPerPage
  const endIndex = startIndex + usersPerPage
  const currentUsers = filteredUsers.slice(startIndex, endIndex)

  const handleAction = (action: string, userId: number, userName: string) => {
    console.log(`${action} action for user ${userId} (${userName})`)
    // Here you would implement the actual action logic
  }

  const handleStatusToggle = (userId: number, newStatus: boolean) => {
    console.log(`Toggle status for user ${userId} to ${newStatus ? "active" : "inactive"}`)
    // Here you would implement the actual status toggle logic
  }

  const handleUserEdit = (user: (typeof mockUsers)[0]) => {
    setEditingUser(user)
    setIsEditDialogOpen(true)
  }

  const handleSaveUser = () => {
    console.log("Saving user:", editingUser)
    setIsEditDialogOpen(false)
    setEditingUser(null)
  }

  const getStatusBadge = (status: string) => {
    return status === "active" ? (
      <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800">
        Active
      </Badge>
    ) : (
      <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700">
        Inactive
      </Badge>
    )
  }

  const getRoleBadge = (role: string) => {
    const roleColors = {
      Admin: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800",
      Editor:
        "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400 border-amber-200 dark:border-amber-800",
      Viewer: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 dark:border-blue-800",
    }
    return <Badge className={roleColors[role as keyof typeof roleColors] || roleColors.Viewer}>{role}</Badge>
  }

  const getPermissionBadge = (action: string) => {
    const actionColors = {
      read: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800",
      write:
        "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400 border-amber-200 dark:border-amber-800",
      delete: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800",
    }
    return (
      <Badge variant="outline" className={actionColors[action as keyof typeof actionColors] || actionColors.read}>
        {action}
      </Badge>
    )
  }

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
              <CardTitle className="text-xl font-semibold text-foreground">Users ({filteredUsers.length})</CardTitle>

              {/* Top Bar Controls */}
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                {/* Search Type Selector */}
                <Select value={searchType} onValueChange={setSearchType}>
                  <SelectTrigger className="w-full sm:w-[140px] border-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="tenant">Tenant</SelectItem>
                  </SelectContent>
                </Select>

                {/* Search Input */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder={`Search by ${searchType}...`}
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
                    <SelectItem value="active">Active Only</SelectItem>
                    <SelectItem value="inactive">Inactive Only</SelectItem>
                  </SelectContent>
                </Select>

                {/* Create User Button */}
                <Button
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                  onClick={() => handleAction("create", 0, "")}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create User
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {/* Users Table with Collapsible Details */}
              <div className="space-y-0">
                {currentUsers.map((user) => (
                  <Collapsible
                    key={user.id}
                    open={expandedUser === user.id}
                    onOpenChange={(open) => setExpandedUser(open ? user.id : null)}
                  >
                    <CollapsibleTrigger asChild>
                      <div className="w-full p-4 hover:bg-muted/50 border-b border-border cursor-pointer transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 flex-1">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-sm font-medium text-primary">
                                {user.name
                                  .split(" ")
                                  .map((n: string) => n[0])
                                  .join("")}
                              </span>
                            </div>
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                              <div>
                                <div className="font-medium text-foreground">{user.name}</div>
                                <div className="text-sm text-muted-foreground">{user.email}</div>
                              </div>
                              <div>
                                <div className="text-sm text-muted-foreground">Tenant</div>
                                <div className="font-medium text-foreground">{user.tenant}</div>
                              </div>
                              <div>{getStatusBadge(user.status)}</div>
                              <div className="text-sm text-muted-foreground">
                                {new Date(user.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {expandedUser === user.id ? (
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
                                  <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                                  <p className="text-foreground">{user.email}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-muted-foreground">Phone</Label>
                                  <p className="text-foreground">{user.phone}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-muted-foreground">Location</Label>
                                  <p className="text-foreground">{user.location}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-muted-foreground">Last Login</Label>
                                  <p className="text-foreground">{new Date(user.lastLogin).toLocaleDateString()}</p>
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
                                    checked={user.status === "active"}
                                    onCheckedChange={(checked) => handleStatusToggle(user.id, checked)}
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
                              <Button
                                variant="outline"
                                className="w-full justify-start bg-transparent"
                                onClick={() => handleUserEdit(user)}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit User Information
                              </Button>

                              <Button
                                variant="outline"
                                className="w-full justify-start border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-900/20 bg-transparent"
                                onClick={() => handleAction("reset", user.id, user.name)}
                              >
                                <RotateCcw className="h-4 w-4 mr-2" />
                                Reset Password
                              </Button>

                              <Button
                                variant="outline"
                                className="w-full justify-start border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-300 dark:hover:bg-amber-900/20 bg-transparent"
                                onClick={() => handleAction("changePassword", user.id, user.name)}
                              >
                                <Key className="h-4 w-4 mr-2" />
                                Change Password
                              </Button>

                              <Button
                                variant="outline"
                                className="w-full justify-start border-red-200 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-900/20 bg-transparent"
                                onClick={() => handleAction("delete", user.id, user.name)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Account
                              </Button>
                            </CardContent>
                          </Card>
                        </div>

                        {/* Permissions */}
                        <Card className="border-border mt-6">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-lg font-semibold text-foreground flex items-center">
                              <Shield className="h-5 w-5 mr-2" />
                              Permissions
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              {user.permissions.map((permission, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border"
                                >
                                  <div>
                                    <h4 className="font-medium text-foreground mb-1">{permission.resource}</h4>
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
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>

              {/* Empty State */}
              {currentUsers.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-muted-foreground mb-2">
                    <Search className="h-12 w-12 mx-auto mb-4" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-2">No users found</h3>
                  <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="border-t border-border px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Showing {startIndex + 1} to {Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length}{" "}
                      users
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
                              className={currentPage === page ? "bg-primary text-primary-foreground" : "hover:bg-muted"}
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
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={editingUser.phone}
                    onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tenant">Tenant</Label>
                  <Input
                    id="tenant"
                    value={editingUser.tenant}
                    onChange={(e) => setEditingUser({ ...editingUser, tenant: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={editingUser.location}
                  onChange={(e) => setEditingUser({ ...editingUser, location: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={editingUser.role}
                  onValueChange={(value) => setEditingUser({ ...editingUser, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Editor">Editor</SelectItem>
                    <SelectItem value="Viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
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
    </AppLayout>
  )
}
