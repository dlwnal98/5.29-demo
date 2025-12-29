export interface UserList {
    userKey: string;
    lastLoginAt: string | null;
    userId: string;
    password: string;
    fullName: string;
    email: string;
    enabled: number;
    createdAt: string;
    updatedAt: string;
    role: string;
    organizationId: string;
}

export interface MemberList {
    userKey: string;
    lastLoginAt: string | null;
    userId: string;
    password: string;
    fullName?: string;
    email?: string;
    enabled: number;
    createdAt: string;
    updatedAt: string;
    role: string;
    organizationId: string;
}

export interface handleStatusVariables {
    userKey: string;
    active: boolean;
}

export interface DeleteMemberVariables {
    organizationId: string;
    userKey: string;
}

export interface AddMemberVariables {
    organizationId: string;
    userId: string;
}