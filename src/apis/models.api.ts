import { requestDelete, requestGet, requestPatch, requestPost, requestPut } from '@/libs/apiClient';


export interface ModelData {
    modelId: string;
    apiId: string;
    modelName: string;
    description: string;
    version: string;
    jsonSchema: {
        type: string;
        properties: any;
    };
    properties?: any;
    examples?: any[];
    createdAt: string;
    createdBy: string;
    updatedAt?: string;
    updatedBy?: string;
    planId?: string;
}

// API 계획의 모델 목록 조회
export const getModelList = async (apiId: string): Promise<ModelData[]> => {
    const res = await requestGet(`/api/v1/models/plan/${apiId}`);

    return res;
};

export interface CreateModelProps {
    apiId: string;
    modelName: string;
    description: string;
    jsonSchema: {
        type: string;
        properties: {};
    };
    examples: {}[];
    createdBy: string;
}

// 모델 생성
export const createModel = async (data: CreateModelProps) => {
    const res = await requestPost(`/api/v1/models`, {
        body: data,
    });

    return res;
};

export interface ModifyModelProps {
    modelName: string;
    description: string;
    version: string;
    jsonSchema: {
        type: string;
        properties: {};
    };
    properties: {};
    examples: {}[];
    updatedBy: string;
}

// 모델 수정
export const modifyModel = async (modelId: string, data: ModifyModelProps) => {
    const res = await requestPut(`/api/v1/models/${modelId}`, {
        body: data,
    });

    return res;
};
// 모델 삭제
export const deleteModel = async (modelId: string, userKey: string) => {
    const res = await requestDelete(`/api/v1/models/${modelId}`, {
        headers: {
            'X-User-Id': userKey,
        },
    });

    return res;
};
