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
    in: string;
    required: boolean;
    description: string;
    schema: {
        type: string;
        default: boolean;
    }
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
    in: string;
    required: boolean;
    description: string;
    schema: {
        type: string;
    }
}

// 메서드 생성 DTO
export interface CreateMethodProps {
    httpMethod: string;
    summary: string;
    description?: string;
    tags?: string[];
    integrationType: string;
    routingEndpoint: string;
    requestValidation?: string;
    apiKeyRequired?: boolean;
    apiKeyId?: string;
    mockResponse?: {
        statusCode: number;
        headers: {
            "Content-Type": "application/json"
        },
        body: string
    },
    pathParameters?: PathParameter[],
    queryParameters?: QueryParameter[],
    headerParameters?: HeaderParameter[],
    requestBodyConfig?: {
        modelId: string;
        required: boolean;
    },
    responses?: [
        {
            statusCode: string;
            description: string;
            modelId: string;
        },
        {
            statusCode: string;
            description: string;
        }
    ],
    createdBy: string;
}

// ✅ API 요청 함수
export const createMethod = async (data: CreateMethodProps, apiId: string, resourceId: string) => {
    const res = await requestPost(`/api/v1/plans/${apiId}/resources/${resourceId}/methods`, {
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

export interface DeleteMethodProps {
    methodId: string;
    userKey: string;
}

export const deleteMethod = async (data: DeleteMethodProps) => {
    const res = await requestDelete(`/api/v1/methods/${data.methodId}`, {
        body: {
            headers: { 'X-User-Id': data.userKey },
        },
    });

    return res;
};


// 요청검사기 데이터
export interface ValidatorListProps {
    code: string;
    description: string;
}

// 요청검사기 목록 조회 API
export const getValidatorList = async (): Promise<ValidatorListProps[]> => {
    const res = await requestGet(`/api/v1/methods/validation-types`);

    return res;
};


// 통합 유형 목록 조회
export interface IntegrationTypeListProps {
    code: string;
    description: string;
}

// 통합 유형 목록 조회 API
export const getIntegrationTypeList = async (): Promise<IntegrationTypeListProps[]> => {
    const res = await requestGet(`/api/v1/methods/integration-types`);

    return res;
};

