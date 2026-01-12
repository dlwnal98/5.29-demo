
import { requestDelete, requestGet, requestPatch, requestPost, requestPut } from '@/libs/apiClient';

export interface ApiKey {
    apiKeyId: string;
    tenantId: string;
    keyName: string;
    keyValue: string;
    expiresAt: string;
    createdAt: string | null;
    createdBy: string;
    description: string;
}

export type CreateAPIKeyVariables = {
    tenantId: string;
    keyName: string;
    description: string;
    createdBy: string;
};


// 전체 API Key 조회
export const getAPIKeyList = async (tenantId: string) => {
    const res = await requestGet(`/api/v1/api-keys?tenantId=${tenantId}`);

    return res;
};

// API Key 상세 조회
export const getAPIKeyDetail = async (apiKeyId: string) => {
    const res = await requestGet(`/api/v1/api-keys/${apiKeyId}`);

    return res;
};

export const createAPIKey = async ({
    createdBy,
    keyName,
    description,
    tenantId,
}: CreateAPIKeyVariables) => {
    const res = await requestPost(`/api/v1/api-keys`, {
        body: {
            createdBy,
            keyName,
            description,
            tenantId,
        },
    });

    return res;
};


export type ModifyAPIKeyVariables = {
    apiKeyId: string;
    keyName: string;
    description: string;
    expiresAt: string;
    updatedBy: string;
};

// API Key 수정
export const modifyAPIKey = async ({ apiKeyId, keyName, description, expiresAt, updatedBy }: ModifyAPIKeyVariables) => {
    const res = await requestPut(`/api/v1/api-keys/${apiKeyId}`, {
        body: {
            keyName,
            description,
            expiresAt,
            updatedBy,
        },
    });

    return res;

};


// API Key 삭제
export const deleteAPIKey = async (apiKeyId: string) => {
    const res = await requestDelete(`/api/v1/api-keys/${apiKeyId}`);

    return res;
};
