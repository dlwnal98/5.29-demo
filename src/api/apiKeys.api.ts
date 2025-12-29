
import { requestDelete, requestGet, requestPatch, requestPost } from '@/lib/apiClient';

export interface ApiKey {
    keyId: string;
    organizationId: string;
    name: string;
    key: string;
    keySecret?: string;
    enabled?: string | null;
    expiredAt: string;
    rateLimit: string | null;
    createdAt: string | null;
    updatedAt: string | null;
    createdBy: string;
    description: string;
}

export type CreateAPIKeyVariables = {
    userKey: string;
    keyName: string;
    description: string;
    organizationId: string;
};


// 전체 API Key 조회
export const getAPIKeyList = async (organizationId: string) => {
    const res = await requestGet(`/api/v1/apikey/${organizationId}`);
    if (res.code == 200) {
        return res.data;
    }
};

export const createAPIKey = async ({
    userKey,
    keyName,
    description,
    organizationId,
}: CreateAPIKeyVariables) => {
    const res = await requestPost(`/api/v1/apiKey`, {
        body: {
            userKey,
            keyName,
            description,
            organizationId,
        },
    });

    if (res.code == 200) {
        return res.data;
    }
    return res.data;
};


export type ModifyAPIKeyVariables = {
    keyId: string;
    keyName: string;
    description: string;
};

// API Key 수정
export const modifyAPIKey = async ({ keyId, keyName, description }: ModifyAPIKeyVariables) => {
    const res = await requestPatch(`/api/v1/apiKey/${keyId}`, {
        body: {
            keyName,
            description,
        },
    });

    if (res.code == 200) {
        return res.data;
    }
};


// API Key 삭제
export const deleteAPIKey = async (keyId: string) => {
    const res = await requestDelete(`/api/v1/apiKey/${keyId}`);

    if (res.code == 200) {
        return res.data;
    }
};
