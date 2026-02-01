import { requestDelete, requestGet, requestPatch, requestPost, requestPut } from '@/libs/apiClient';


export interface ModelData {
    content: [
        {
            modelId: string,
            apiId: string,
            tenantId: string,
            modelName: string,
            description: string,
            schema: {
                type: string,
                properties: {
                    name: {
                        type: string
                    },
                    email: {
                        type: string,
                        format: string
                    }
                }
            },
            createdAt: string,
            updatedAt: string,
            createdBy: string,
            updatedBy: string
        }
    ],
    page: {
        size: number,
        number: number,
        totalElements: number,
        totalPages: number
    }
}

// API 계획의 모델 목록 조회
export const getModelList = async (apiId: string, page?: number, size?: number): Promise<ModelData[]> => {
    const res = await requestGet(`/api/v1/models?apiId=${apiId}&page=${page}&size=${size}`);

    return res;
};

export interface CreateModelProps {
    modelName: string,
    description: string,
    schema: {};
    createdBy: string
}

// 모델 생성
export const createModel = async (apiId: string, tenantId: string, data: CreateModelProps) => {
    const res = await requestPost(`/api/v1/models?apiId=${apiId}&tenantId=${tenantId}`, {
        body: data,
    });

    return res;
};

export interface ModifyModelProps {
    modelName: string;
    description?: string;
    schema: {};
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
export const deleteModel = async (modelId: string) => {
    const res = await requestDelete(`/api/v1/models/${modelId}`);

    return res;
};
