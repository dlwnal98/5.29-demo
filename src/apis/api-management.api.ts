import { requestDelete, requestGet, requestPost, requestPut } from '@/libs/apiClient';
import axios from 'axios';


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
    name: string;
    description?: string;
    createdBy: string;
}

//api 복제하여 생성 + 실시간 목록 생성
export const cloneCreateAPI = async (sourcePlanId: string, data: CloneCreateAPIProps) => {
    const res = await requestPost(`/api/v1/plans/${sourcePlanId}/clone`, {
        body: data,
    });

    return res;
};



//api openapi 문서로 생성 + 실시간 목록 생성
export const uploadOpenAPIDocCreateAPI = async (tenantId: string, createdBy: string, data: string) => {
    const res = await axios.post(
        `/api/v1/plans/openapi?tenantId=${tenantId}&createdBy=${createdBy}`,
        data,
        {
            headers: {
                'Content-Type': 'text/plain',
            },
            transformRequest: [(data) => data],
        }
    );

    return res.data;
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



// API 내보내기 (파일 다운로드)
export const getAPIDocForExport = async (apiId: string, format?: 'OPENAPI_JSON' | 'OPENAPI_YAML' | 'POSTMAN', includeModels?: boolean, includeExtensions?: boolean) => {
    const res = await requestGet(
        `/api/v1/plans/${apiId}/export?format=${format}&includeModels=${includeModels}&includeExtensions=${includeExtensions}`
    );

    return res;
};


// API List 조회
export const getAPIDocForExportPreview = async (apiId: string, format?: 'OPENAPI_JSON' | 'OPENAPI_YAML' | 'POSTMAN', includeModels?: boolean, includeExtensions?: boolean) => {
    const res = await requestGet(
        `/api/v1/plans/${apiId}/export/preview?format=${format}&includeModels=${includeModels}&includeExtensions=${includeExtensions}`
    );

    return res;
};
