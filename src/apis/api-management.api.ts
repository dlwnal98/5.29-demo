import { requestDelete, requestGet, requestPost, requestPut } from '@/libs/apiClient';


export interface APIListData {
    apiId: string;
    tenantId: string;
    name: string;
    description: string;
    version: string;
    enabled: boolean;
    createdAt?: string;
    updatedAt?: string;
}

// API List 조회
export const getAPIList = async (tenantId: string, page?: number, size?: number) => {
    const res = await requestGet(
        `/api/v1/plans?tenantId=${tenantId}&page=${page}&size=${size}`
    );

    return res;
};


export interface CreateAPIProps {
    tenantId: string;
    name: string;
    description?: string;
    createdBy: string;
}

//api 생성 + 실시간 목록 생성
export const createAPI = async (data: CreateAPIProps) => {
    const res = await requestPost(`/api/v1/plans`, {
        body: data,
    });

    return res;
};

export interface CloneCreateAPIProps {
    copyApiId: string;
    targetOrganizationId: string;
    newName: string;
    userKey: string;
    description?: string;
}

//api 복제하여 생성 + 실시간 목록 생성
export const cloneCreateAPI = async (data: CloneCreateAPIProps) => {
    console.log(data);
    const res = await requestPost(`/api/v1/plans/${data.copyApiId}/clone`, {
        body: {
            targetOrganizationId: data.targetOrganizationId,
            newName: data.newName,
            createdBy: data.userKey,
            description: data.description,
        },
    });

    return res;
};

export interface ModifyAPIProps {
    name: string;
    description: string;
    updatedBy: string; // userKey
}

//api 키 수정 + 실시간 목록 생성
export const modifyAPI = async (apiId: string, data: ModifyAPIProps) => {
    const res = await requestPut(`/api/v1/plans/${apiId}`, {
        body: data,
    });

    return res;
};

//api 키 삭제 + 실시간 목록 생성
export const deleteAPI = async (apiId: string) => {
    const res = await requestDelete(`/api/v1/plans/${apiId}`);

    return res;
};
