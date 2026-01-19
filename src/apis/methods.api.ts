import { requestDelete, requestGet, requestPatch, requestPost, requestPut } from '@/libs/apiClient';


// 메서드 리스트 타입
export interface MethodsDetailDataProps {
    methodId: string;
    httpMethod: string;
    operationId: string;
    summary: string;
    description: string;
    tags: string[];
    integrationType: string;
    routingEndpoint: string;
    mockResponse: {
        statusCode: number;
        contentType: string;
        body: string;
        headers: {}
    },
    requestValidation: string;
    apiKeyRequired: boolean;
    apiKeyId: string;
    pathParameters: [
        {
            name: string;
            description: string;
            required: boolean;
            type: string;
            format: string;
            defaultValue: string;
            example: string;
            schema: {},
            deprecated: boolean
        }
    ],
    queryParameters: [
        {
            name: string;
            description: string;
            required: boolean;
            type: string;
            format: string;
            defaultValue: string;
            example: string;
            schema: {},
            deprecated: boolean
        }
    ],
    headerParameters: [
        {
            name: string;
            description: string;
            required: boolean;
            type: string;
            format: string;
            defaultValue: string;
            example: string;
            schema: {},
            deprecated: boolean
        }
    ],
    requestBodyConfig: {
        modelId: string;
        required: boolean;
        contentType: string;
        description: string;
        contentTypeOrDefault: string;
    },
    responses: [
        {
            statusCode: number;
            description: string;
            headers: [
                {
                    name: string;
                    description: string;
                    required: boolean;
                    type: string;
                    format: string;
                    example: string;
                    schema: {},
                    deprecated: boolean
                }
            ],
            content: {
                modelId: string;
                contentType: string;
                contentTypeOrDefault: string;
            },
            successStatus: boolean;
            errorStatus: boolean;
        }
    ],
    createdAt: string,
    createdBy: string,
    updatedAt: string,
    updatedBy: string
}



// 메서드 상세 조회 API
export const getMethodsDetailData = async (methodId: string): Promise<MethodsDetailDataProps> => {
    const res = await requestGet(`/api/v1/methods/${methodId}`);

    return res;
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
    routingMode: string;
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
    summary: string;
    description: string;
    tags: string[];
    integrationType: string;
    routingEndpoint: string;
    routingMode: string;  // "DIRECT" | "PATH_APPEND"
    requestValidation: string;
    apiKeyRequired: boolean;
    apiKeyId: string;
    pathParameters: [
        {
            name: string,
            in: string,
            required: boolean,
            description: string,
            schema: {
                type: string
            }
        }
    ],
    queryParameters: [
        {
            name: string,
            in: string,
            required: boolean,
            description: string,
            schema: {
                type: string,
                default?: boolean
            }
        },

    ],
    headerParameters: [
        {
            name: string,
            in: string,
            required: boolean,
            description: string,
            schema: {
                type: string,
                format?: string
            }
        },
    ],
    requestBodyConfig: {
        modelId: string,
        required: boolean,
        description: string
    },
    responses: [
        {
            statusCode: string,
            description: string,
            modelId?: string
        },
    ],
    updatedBy: string
}

// ✅ API 요청 함수
export const modifyMethod = async (methodId: string, data: ModifyMethodProps) => {
    const res = await requestPut(`/api/v1/methods/${methodId}`, {
        body: data,
    });

    return res;
};


export const deleteMethod = async (methodId: string) => {
    const res = await requestDelete(`/api/v1/methods/${methodId}`);

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

// 요청검사기 데이터
export interface TestMethodProps {
    queryParameters: {},
    pathParameters: {},
    headers: {},
    body: string;
}



// ✅ API 메서드 요청 테스트
export const testMethod = async (methodId: string, data: TestMethodProps) => {
    const res = await requestPost(`/api/v1/invoke/${methodId}`, {
        body: data,
    });

    return res;
};

