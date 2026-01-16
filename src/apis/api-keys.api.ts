
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

// API Key 상세 정보 타입
export interface ApiKeyMethodUsage {
    apiId: string;
    resourceId: string;
    methodId: string;
    resourcePath: string;
    httpMethod: string;
}

export interface ApiKeyDeployedUsage {
    apiId: string;
    stageId: string;
    stageName: string;
    deploymentId: string;
    methods: ApiKeyMethodUsage[];
}

export interface ApiKeyQuota {
    enabled: boolean;
    period: 'DAILY' | 'MONTHLY';
    requestLimit: number;
}

export interface ApiKeyRateLimit {
    enabled: boolean;
    requestsPerSecond: number;
    burstCapacity: number;
    requestsPerMinute: number;
    requestsPerHour: number;
}

export interface ApiKeyExpirationInfo {
    expiresAt: string;
    status: string;
    statusDescription: string;
    serverTime: string;
    remainingSeconds: number;
    remainingTimeFormatted: string;
}

export interface ApiKeyDetail {
    apiKeyId: string;
    tenantId: string;
    keyName: string;
    keyValue?: string;
    description: string;
    expiresAt: string;
    quotaInfo?: ApiKeyQuota;
    rateLimitInfo?: ApiKeyRateLimit;
    expirationInfo?: ApiKeyExpirationInfo;
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string;
}

export type CreateAPIKeyVariables = {
    tenantId: string;
    keyName: string;
    expiresAt?: string;
    description: string;
    createdBy: string;
};


// 전체 API Key 조회
export const getAPIKeyList = async (tenantId: string) => {
    const res = await requestGet(`/api/v1/api-keys?tenantId=${tenantId}`);

    return res;
};

// API Key 상세 조회1 (Quota, Rate-Limit)
export const getAPIKeyDetail = async (apiKeyId: string) => {
    const res = await requestGet(`/api/v1/api-keys/${apiKeyId}`);

    return res;
};

// API Key 상세 조회2 (사용처)
export const getAPIKeyDetail2 = async (apiKeyId: string) => {
    const res = await requestGet(`/api/v1/api-keys/${apiKeyId}/detail`);

    return res;
};

export const createAPIKey = async ({
    createdBy,
    keyName,
    description,
    expiresAt,
    tenantId,
}: CreateAPIKeyVariables) => {
    const res = await requestPost(`/api/v1/api-keys`, {
        body: {
            createdBy,
            keyName,
            description,
            expiresAt,
            tenantId,
        },
    });

    return res;
};


export type ModifyAPIKeyVariables = {
    apiKeyId: string;
    keyName: string;
    description: string;
    expiresAt?: string;
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

export type ModifyAPIKeyQuotaVariables = {
    apiKeyId: string;
    enabled: boolean;
    period: 'DAILY' | 'MONTHLY';
    requestLimit: number;
    updatedBy: string;
};

// Api-key Quota 설정
export const modifyAPIKeyQuota = async ({ apiKeyId, enabled, period, requestLimit, updatedBy }: ModifyAPIKeyQuotaVariables) => {
    const res = await requestPut(`/api/v1/api-keys/${apiKeyId}/quota`, {
        body: {
            enabled,
            period,
            requestLimit,
            updatedBy,
        },
    });

    return res;

};


export type ModifyAPIKeyRateLimitVariables = {
    apiKeyId: string;
    enabled: boolean;
    requestsPerSecond: number;
    burstCapacity: number;
    requestsPerMinute: number;
    requestsPerHour: number;
    updatedBy: string;
};

// Api-key Rate-Limit 설정
export const modifyAPIKeyRateLimit = async ({ apiKeyId, enabled, requestsPerSecond, burstCapacity, requestsPerMinute, requestsPerHour, updatedBy }: ModifyAPIKeyRateLimitVariables) => {
    const res = await requestPut(`/api/v1/api-keys/${apiKeyId}/rate-limit`, {
        body: {
            enabled,
            requestsPerSecond,
            burstCapacity,
            requestsPerMinute,
            requestsPerHour,
            updatedBy,
        },
    });

    return res;

};



