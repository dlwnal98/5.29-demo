'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  Search,
  User,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronRight,
  Users,
  Shield,
  Calendar,
  Phone,
  MapPin,
} from 'lucide-react';

// Mock data
const mockUserSearchResult = {
  id: 1,
  name: 'John Doe',
  email: 'john.doe@example.com',
  status: 'active',
  role: 'Admin',
  lastLogin: '2024-01-20',
  phone: '+1 (555) 123-4567',
  location: 'New York, NY',
  createdAt: '2024-01-15',
};

const mockTenantPermissions = [
  {
    tenantId: 1,
    tenantName: 'Acme Corporation',
    companyInitials: 'AC',
    users: [
      {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@acme.com',
        permissions: ['Admin', 'Write', 'Read'],
      },
      { id: 2, name: 'Jane Smith', email: 'jane.smith@acme.com', permissions: ['Write', 'Read'] },
      { id: 3, name: 'Mike Johnson', email: 'mike.johnson@acme.com', permissions: ['Read'] },
    ],
  },
  {
    tenantId: 2,
    tenantName: 'TechStart Inc',
    companyInitials: 'TS',
    users: [
      {
        id: 4,
        name: 'Sarah Wilson',
        email: 'sarah.wilson@techstart.com',
        permissions: ['Admin', 'Write', 'Read'],
      },
      {
        id: 5,
        name: 'David Brown',
        email: 'david.brown@techstart.com',
        permissions: ['Write', 'Read'],
      },
    ],
  },
  {
    tenantId: 3,
    tenantName: 'Global Solutions Ltd',
    companyInitials: 'GS',
    users: [
      {
        id: 6,
        name: 'Emily Davis',
        email: 'emily.davis@globalsolutions.com',
        permissions: ['Admin', 'Write', 'Read'],
      },
      {
        id: 7,
        name: 'Robert Miller',
        email: 'robert.miller@globalsolutions.com',
        permissions: ['Read'],
      },
      {
        id: 8,
        name: 'Lisa Anderson',
        email: 'lisa.anderson@globalsolutions.com',
        permissions: ['Write', 'Read'],
      },
    ],
  },
];

export default function UserToolsPage() {
  const [emailSearch, setEmailSearch] = useState('');
  const [usernameCheck, setUsernameCheck] = useState('');
  const [searchResult, setSearchResult] = useState<typeof mockUserSearchResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [expandedTenants, setExpandedTenants] = useState<number[]>([]);

  const handleEmailSearch = async () => {
    if (!emailSearch.trim()) return;

    setIsSearching(true);
    setSearchError('');
    setSearchResult(null);

    // Simulate API call
    setTimeout(() => {
      if (emailSearch.toLowerCase() === 'john.doe@example.com') {
        setSearchResult(mockUserSearchResult);
      } else {
        setSearchError('User not found');
      }
      setIsSearching(false);
    }, 1000);
  };

  const handleUsernameCheck = async (username: string) => {
    if (!username.trim()) {
      setUsernameAvailable(null);
      return;
    }

    setIsCheckingUsername(true);

    // Simulate API call
    setTimeout(() => {
      // Mock logic: usernames starting with 'a' are taken
      setUsernameAvailable(!username.toLowerCase().startsWith('a'));
      setIsCheckingUsername(false);
    }, 500);
  };

  const toggleTenant = (tenantId: number) => {
    setExpandedTenants((prev) =>
      prev.includes(tenantId) ? prev.filter((id) => id !== tenantId) : [...prev, tenantId]
    );
  };

  const getPermissionBadge = (permission: string) => {
    const permissionColors = {
      Admin:
        'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800',
      Write:
        'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400 border-amber-200 dark:border-amber-800',
      Read: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800',
    };
    return (
      <Badge
        className={
          permissionColors[permission as keyof typeof permissionColors] || permissionColors.Read
        }
      >
        {permission}
      </Badge>
    );
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

  return (
    <AppLayout>
      <div className="min-h-screen">
        <div className="container mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">User Utility Tools</h1>
            <p className="text-muted-foreground">
              Search users, check availability, and manage permissions
            </p>
          </div>

          <div className="space-y-8">
            {/* Section 1: Find User by Email */}
            <Card className="glass border-border">
              <CardHeader className="border-b border-border">
                <CardTitle className="text-xl font-semibold text-foreground flex items-center">
                  <Search className="h-5 w-5 mr-2 text-primary" />
                  Find User by Email
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <Input
                      placeholder="Enter email address..."
                      value={emailSearch}
                      onChange={(e) => setEmailSearch(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleEmailSearch()}
                      className="border-input focus:border-primary"
                    />
                  </div>
                  <Button
                    onClick={handleEmailSearch}
                    disabled={isSearching || !emailSearch.trim()}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                  >
                    {isSearching ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="h-4 w-4 mr-2" />
                        Search
                      </>
                    )}
                  </Button>
                </div>

                {/* Search Results */}
                {searchResult && (
                  <Card className="border-border bg-muted/50">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-lg font-semibold text-primary">
                            {searchResult.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-foreground mb-1">
                            {searchResult.name}
                          </h3>
                          <p className="text-muted-foreground mb-2">{searchResult.email}</p>
                          <div className="flex flex-wrap items-center gap-2 mb-3">
                            {getStatusBadge(searchResult.status)}
                            {getRoleBadge(searchResult.role)}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center space-x-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">{searchResult.phone}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">{searchResult.location}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">
                                Last login: {new Date(searchResult.lastLogin).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {searchError && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <div className="flex items-center">
                      <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
                      <span className="text-red-700 dark:text-red-300">{searchError}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Section 2: Check Username Availability */}
            <Card className="glass border-border">
              <CardHeader className="border-b border-border">
                <CardTitle className="text-xl font-semibold text-foreground flex items-center">
                  <User className="h-5 w-5 mr-2 text-primary" />
                  Check Username Availability
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  <div className="flex-1">
                    <Input
                      placeholder="Enter username..."
                      value={usernameCheck}
                      onChange={(e) => {
                        setUsernameCheck(e.target.value);
                        handleUsernameCheck(e.target.value);
                      }}
                      className="border-input focus:border-primary"
                    />
                  </div>
                  <div className="flex items-center">
                    {isCheckingUsername ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                        <span className="text-muted-foreground">Checking...</span>
                      </div>
                    ) : usernameAvailable !== null && usernameCheck.trim() ? (
                      usernameAvailable ? (
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Available
                        </Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800">
                          <XCircle className="h-4 w-4 mr-1" />
                          Taken
                        </Badge>
                      )
                    ) : null}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section 3: Tenant-wide User Permissions */}
            <Card className="glass border-border">
              <CardHeader className="border-b border-border">
                <CardTitle className="text-xl font-semibold text-foreground flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-primary" />
                  Tenant-wide User Permissions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {mockTenantPermissions.map((tenant) => (
                    <Collapsible
                      key={tenant.tenantId}
                      open={expandedTenants.includes(tenant.tenantId)}
                      onOpenChange={() => toggleTenant(tenant.tenantId)}
                    >
                      <CollapsibleTrigger asChild>
                        <Card className="cursor-pointer hover:bg-muted/50 transition-colors border-border">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                  <span className="text-sm font-semibold text-primary">
                                    {tenant.companyInitials}
                                  </span>
                                </div>
                                <div>
                                  <h3 className="font-semibold text-foreground">
                                    {tenant.tenantName}
                                  </h3>
                                  <p className="text-sm text-muted-foreground flex items-center">
                                    <Users className="h-4 w-4 mr-1" />
                                    {tenant.users.length} users
                                  </p>
                                </div>
                              </div>
                              {expandedTenants.includes(tenant.tenantId) ? (
                                <ChevronDown className="h-5 w-5 text-muted-foreground" />
                              ) : (
                                <ChevronRight className="h-5 w-5 text-muted-foreground" />
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-2">
                        <div className="ml-4 space-y-2">
                          {tenant.users.map((user) => (
                            <Card key={user.id} className="border-border bg-muted/30">
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3">
                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                      <span className="text-xs font-medium text-primary">
                                        {user.name
                                          .split(' ')
                                          .map((n) => n[0])
                                          .join('')}
                                      </span>
                                    </div>
                                    <div>
                                      <p className="font-medium text-foreground">{user.name}</p>
                                      <p className="text-sm text-muted-foreground">{user.email}</p>
                                    </div>
                                  </div>
                                  <div className="flex flex-wrap gap-1">
                                    {user.permissions.map((permission) => (
                                      <span key={permission}>{getPermissionBadge(permission)}</span>
                                    ))}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
