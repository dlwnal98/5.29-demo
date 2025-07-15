"use client"

import { useState } from "react"
import { AppLayout } from "@/components/layout/AppLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Shield, Users, Building, Plus, Edit, Trash2 } from "lucide-react"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("permissions")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [dialogType, setDialogType] = useState<"permission" | "role" | "tenant">("permission")

  // Mock data
  const mockPermissions = [
    {
      id: 1,
      name: "user.read",
      description: "Read user information",
      resource: "Users",
      action: "read",
      createdAt: "2024-01-15",
    },
    {
      id: 2,
      name: "user.write",
      description: "Create and update users",
      resource: "Users",
      action: "write",
      createdAt: "2024-01-15",
    },
    {
      id: 3,
      name: "project.admin",
      description: "Full project administration",
      resource: "Projects",
      action: "admin",
      createdAt: "2024-01-16",
    },
  ]

  const mockRoles = [
    {
      id: 1,
      name: "Super Admin",
      description: "Full system access with all permissions",
      permissions: ["user.read", "user.write", "project.admin", "system.admin"],
      userCount: 2,
      createdAt: "2024-01-10",
      isActive: true,
    },
    {
      id: 2,
      name: "Project Manager",
      description: "Manage projects and team members",
      permissions: ["user.read", "project.admin"],
      userCount: 5,
      createdAt: "2024-01-12",
      isActive: true,
    },
    {
      id: 3,
      name: "Developer",
      description: "Access to development resources",
      permissions: ["user.read", "project.read"],
      userCount: 12,
      createdAt: "2024-01-14",
      isActive: true,
    },
  ]

  const mockTenants = [
    {
      id: 1,
      name: "acme-corp",
      displayName: "ACME Corporation",
      description: "Main corporate tenant",
      domain: "acme-corp.com",
      userCount: 45,
      isActive: true,
      createdAt: "2024-01-01",
      settings: {
        maxUsers: 100,
        features: ["sso", "audit-logs", "custom-branding"],
      },
    },
    {
      id: 2,
      name: "tech-solutions",
      displayName: "Tech Solutions Inc.",
      description: "Technology consulting tenant",
      domain: "techsolutions.com",
      userCount: 23,
      isActive: true,
      createdAt: "2024-01-05",
      settings: {
        maxUsers: 50,
        features: ["sso", "audit-logs"],
      },
    },
    {
      id: 3,
      name: "startup-demo",
      displayName: "Startup Demo",
      description: "Demo tenant for startups",
      domain: "startup-demo.com",
      userCount: 8,
      isActive: false,
      createdAt: "2024-01-10",
      settings: {
        maxUsers: 25,
        features: ["basic"],
      },
    },
  ]

  const handleCreate = (type: "permission" | "role" | "tenant") => {
    setDialogType(type)
    setIsCreateDialogOpen(true)
  }

  const handleEdit = (type: string, id: number) => {
    console.log(`Edit ${type} with id:`, id)
  }

  const handleDelete = (type: string, id: number) => {
    console.log(`Delete ${type} with id:`, id)
  }

  const getPermissionBadge = (action: string) => {
    const actionColors = {
      read: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800",
      write:
        "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400 border-amber-200 dark:border-amber-800",
      admin: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800",
    }
    return <Badge className={actionColors[action as keyof typeof actionColors] || actionColors.read}>{action}</Badge>
  }

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800">
        Active
      </Badge>
    ) : (
      <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700">
        Inactive
      </Badge>
    )
  }

  return (
    <AppLayout>
      <div className="min-h-screen">
        <div className="container mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
            <p className="text-muted-foreground">Manage permissions, roles, and tenant configurations</p>
          </div>

          {/* Main Content */}
          <Card className="glass border-border">
            <CardContent className="p-0">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="border-b border-border px-6 pt-6">
                  <TabsList className="grid w-full grid-cols-3 bg-muted">
                    <TabsTrigger
                      value="permissions"
                      className="data-[state=active]:bg-background data-[state=active]:text-foreground"
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Permissions
                    </TabsTrigger>
                    <TabsTrigger
                      value="roles"
                      className="data-[state=active]:bg-background data-[state=active]:text-foreground"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Roles
                    </TabsTrigger>
                    <TabsTrigger
                      value="tenants"
                      className="data-[state=active]:bg-background data-[state=active]:text-foreground"
                    >
                      <Building className="h-4 w-4 mr-2" />
                      Tenants
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* Permissions Tab */}
                <TabsContent value="permissions" className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className="text-xl font-semibold text-foreground">Permission Management</h2>
                      <p className="text-muted-foreground">Define and manage system permissions</p>
                    </div>
                    <Button onClick={() => handleCreate("permission")} className="bg-primary hover:bg-primary/90">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Permission
                    </Button>
                  </div>

                  <div className="border border-border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-border">
                          <TableHead className="font-semibold">Name</TableHead>
                          <TableHead className="font-semibold">Description</TableHead>
                          <TableHead className="font-semibold">Resource</TableHead>
                          <TableHead className="font-semibold">Action</TableHead>
                          <TableHead className="font-semibold">Created</TableHead>
                          <TableHead className="font-semibold text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockPermissions.map((permission) => (
                          <TableRow key={permission.id} className="border-border">
                            <TableCell className="font-medium">{permission.name}</TableCell>
                            <TableCell className="text-muted-foreground">{permission.description}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{permission.resource}</Badge>
                            </TableCell>
                            <TableCell>{getPermissionBadge(permission.action)}</TableCell>
                            <TableCell className="text-muted-foreground">
                              {new Date(permission.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center justify-end space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEdit("permission", permission.id)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDelete("permission", permission.id)}
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
                </TabsContent>

                {/* Roles Tab */}
                <TabsContent value="roles" className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className="text-xl font-semibold text-foreground">Role Management</h2>
                      <p className="text-muted-foreground">Create and manage user roles with permission sets</p>
                    </div>
                    <Button onClick={() => handleCreate("role")} className="bg-primary hover:bg-primary/90">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Role
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mockRoles.map((role) => (
                      <Card key={role.id} className="border-border">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-lg font-semibold text-foreground">{role.name}</CardTitle>
                              <p className="text-sm text-muted-foreground mt-1">{role.description}</p>
                            </div>
                            {getStatusBadge(role.isActive)}
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">
                              Permissions ({role.permissions.length})
                            </Label>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {role.permissions.slice(0, 3).map((permission) => (
                                <Badge key={permission} variant="outline" className="text-xs">
                                  {permission}
                                </Badge>
                              ))}
                              {role.permissions.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{role.permissions.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Users assigned:</span>
                            <span className="font-medium text-foreground">{role.userCount}</span>
                          </div>

                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Created:</span>
                            <span className="text-foreground">{new Date(role.createdAt).toLocaleDateString()}</span>
                          </div>

                          <div className="flex space-x-2 pt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit("role", role.id)}
                              className="flex-1"
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete("role", role.id)}
                              className="border-red-200 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-900/20"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Tenants Tab */}
                <TabsContent value="tenants" className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className="text-xl font-semibold text-foreground">Tenant Management</h2>
                      <p className="text-muted-foreground">Manage tenant organizations and their configurations</p>
                    </div>
                    <Button onClick={() => handleCreate("tenant")} className="bg-primary hover:bg-primary/90">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Tenant
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {mockTenants.map((tenant) => (
                      <Card key={tenant.id} className="border-border">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-start space-x-4">
                              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Building className="h-6 w-6 text-primary" />
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-foreground">{tenant.displayName}</h3>
                                <p className="text-sm text-muted-foreground">{tenant.name}</p>
                                <p className="text-sm text-muted-foreground mt-1">{tenant.description}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {getStatusBadge(tenant.isActive)}
                              <Button variant="ghost" size="sm" onClick={() => handleEdit("tenant", tenant.id)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete("tenant", tenant.id)}
                                className="hover:bg-red-100 dark:hover:bg-red-900/20"
                              >
                                <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                              </Button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">Domain</Label>
                              <p className="text-foreground">{tenant.domain}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">Users</Label>
                              <p className="text-foreground">
                                {tenant.userCount} / {tenant.settings.maxUsers}
                              </p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">Created</Label>
                              <p className="text-foreground">{new Date(tenant.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">Features</Label>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {tenant.settings.features.map((feature) => (
                                  <Badge key={feature} variant="outline" className="text-xs">
                                    {feature}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New {dialogType.charAt(0).toUpperCase() + dialogType.slice(1)}</DialogTitle>
            <DialogDescription>
              {dialogType === "permission" && "Define a new system permission"}
              {dialogType === "role" && "Create a new user role with permission sets"}
              {dialogType === "tenant" && "Set up a new tenant organization"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {dialogType === "permission" && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="permission-name">Permission Name</Label>
                    <Input id="permission-name" placeholder="e.g., user.read" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="permission-resource">Resource</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select resource" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="users">Users</SelectItem>
                        <SelectItem value="projects">Projects</SelectItem>
                        <SelectItem value="settings">Settings</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="permission-description">Description</Label>
                  <Textarea id="permission-description" placeholder="Describe what this permission allows" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="permission-action">Action Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select action" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="read">Read</SelectItem>
                      <SelectItem value="write">Write</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {dialogType === "role" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="role-name">Role Name</Label>
                  <Input id="role-name" placeholder="e.g., Project Manager" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role-description">Description</Label>
                  <Textarea id="role-description" placeholder="Describe the role responsibilities" />
                </div>
                <div className="space-y-2">
                  <Label>Permissions</Label>
                  <div className="border border-border rounded-lg p-4 max-h-40 overflow-y-auto">
                    {mockPermissions.map((permission) => (
                      <div key={permission.id} className="flex items-center space-x-2 py-1">
                        <input type="checkbox" id={`perm-${permission.id}`} />
                        <Label htmlFor={`perm-${permission.id}`} className="text-sm">
                          {permission.name} - {permission.description}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="role-active" defaultChecked />
                  <Label htmlFor="role-active">Active</Label>
                </div>
              </>
            )}

            {dialogType === "tenant" && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tenant-name">Tenant ID</Label>
                    <Input id="tenant-name" placeholder="e.g., acme-corp" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tenant-display">Display Name</Label>
                    <Input id="tenant-display" placeholder="e.g., ACME Corporation" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tenant-description">Description</Label>
                  <Textarea id="tenant-description" placeholder="Brief description of the tenant" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tenant-domain">Domain</Label>
                    <Input id="tenant-domain" placeholder="e.g., acme-corp.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tenant-max-users">Max Users</Label>
                    <Input id="tenant-max-users" type="number" placeholder="100" />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="tenant-active" defaultChecked />
                  <Label htmlFor="tenant-active">Active</Label>
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsCreateDialogOpen(false)}>
              Create {dialogType.charAt(0).toUpperCase() + dialogType.slice(1)}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  )
}
