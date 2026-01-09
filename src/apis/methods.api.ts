import { requestDelete, requestGet, requestPatch, requestPost, requestPut } from '@/libs/apiClient';


// 메서드 리스트 타입
export interface MethodsListProps {
    methodId: string;
    resourceId: string;
    pathId: string;
    httpMethod: string;
    methodName: string;
    description: string;
    routeEndpoint: string;
    requiresAuthentication: boolean;
    apiKeyRequired: boolean;
    integrationType: string;
    requestValidator: string;
    enabled: boolean;
    createdAt: string;
    createdBy: string;
}

// ✅ 리소스 경로의 메서드 목록 조회 API
export const getMethodsList = async (pathId: string): Promise<MethodsListProps[]> => {
    const res = await requestGet(`/api/v1/methods/path/${pathId}`);
    if (res.code === 200) {
        return res.data;
    }
    throw new Error(res.message || '메서드 목록 조회 실패');
};

// 공통 파라미터 타입
export interface QueryParameter {
    name: string;
    type: string;
    description: string;
    required: boolean;
    example?: string;
}

export interface HeaderParameter {
    name: string;
    type: string;
    description: string;
    required: boolean;
    defaultValue?: string;
    example: string;
    schema?: {};
}

export interface PathParameter {
    name: string;
    type: string;
    description: string;
    required: boolean;
    example?: string;
    schema?: {
        type: string;
        pattern: string;
    };
}

// 메서드 생성 DTO
export interface CreateMethodProps {
    resourceId: string;
    httpMethod: string;
    methodName: string;
    description?: string;
    backendServiceUrl: string;
    requestModelId?: string;
    responseModelId?: string;
    queryParameters: {
        name: string;
        type: string;
        required: boolean;
    }[];
    headerParameters: {
        name: string;
        type: string;
        required: boolean;
    }[];
    apiKeyId?: string;
    requiresApiKey?: boolean;
    requestValidator: string;
    createdBy: string;
}

// ✅ API 요청 함수
export const createMethod = async (data: CreateMethodProps) => {
    const res = await requestPost(`/api/v1/methods`, {
        body: data,
    });

    return res;
};

export interface ModifyMethodProps {
    methodName: string;
    description: string;
    backendServiceUrl: string;
    responseModelId?: string;
    requestModelId?: string;
    queryParameters?: [
        {
            name?: string;
            required?: boolean;
        },
    ];
    headerParameters?: [
        {
            name?: string;
            required?: boolean;
        },
    ];
    pathParameters?: [
        {
            name?: string;
            required?: boolean;
        },
    ];
    enabled: boolean;
    requestValidator: string;
    apiKeyRequired: boolean;
    apiKeyId: string;
    updatedBy: string;
}

// ✅ API 요청 함수
export const modifyMethod = async (methodId: string, data: ModifyMethodProps) => {
    const res = await requestPut(`/api/v1/methods/${methodId}`, {
        body: data,
    });

    return res;
};

// 요청검사기 데이터
export interface MethodsListProps {
    codeType: string;
    code: string;
    codeName: string;
    description: string;
    isActive: boolean;
}

// 요청검사기 목록 조회 API
export const getValidatorList = async (codeType = 'REQUEST_VALIDATOR'): Promise<MethodsListProps[]> => {
    const res = await requestGet(`/api/v1/common-codes/${codeType}`);

    return res;
};

export interface DeleteMethodProps {
    methodId: string;
    userKey: string;
}

// ✅ API 요청 함수
export const deleteMethod = async (data: DeleteMethodProps) => {
    const res = await requestDelete(`/api/v1/methods/${data.methodId}`, {
        body: {
            headers: { 'X-User-Id': data.userKey },
        },
    });

    return res;
};
