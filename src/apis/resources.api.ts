import { requestGet, requestPatch, requestPost, requestDelete, requestPut } from '@/libs/apiClient';


export interface OpenAPIData {
    openapi: string;
    info: Record<string, any>;
    components: Record<string, any>;
    paths: Record<string, any>;
}

// open api 문서 조회
export const getOpenAPIDoc = async (apiId: string) => {
    // const res = await requestGet(`/api/v1/plans/${apiId}/openapi`);
    const res = await requestGet(`/api/v1/plans/${apiId}/openapi/extended`);
    return res;
};

//resource 생성 + 실시간 목록 생성
export interface CreateResourceProps {
    resourceName: string;
    parentPath: string;
    parentResourceId: string;
    description?: string;
    corsEnabled: boolean;
    createdBy: string;
}

export const createResource = async (apiId: string, data: CreateResourceProps) => {
    const res = await requestPost(`/api/v1/plans/${apiId}/resources`, {
        body: data,
    });

    return res;
};

// Resource별 CORS 정책 조회
export interface resourceCorsConfig {
    allowedOrigins: string[];
    allowedMethods: string[];
    allowedHeaders: string[];
    exposedHeaders: string[];
    allowCredentials: boolean;
    maxAge: number;
}

export interface resourceCorsSettingsData {
    allowMethods: string[];
    allowHeaders: string[];
    allowOrigins: string[];
    exposeHeaders: string[];
    maxAge: number;
    allowCredentials: boolean;
    standardCompliant?: boolean;
    validHttpMethods?: boolean;
    corsEnabled: boolean;
}

export const getResourceCorsSettings = async (apiId: string, resourceId: string) => {
    const res = await requestGet(`/api/v1/plans/${apiId}/resources/${resourceId}/cors`);

    return res;
};


// 리소스 생성 시 리소스 path 목록 불러오기
export const getResourcePaths = async (apiId: string) => {
    const res = await requestGet(`/api/v1/plans/${apiId}/resources`);

    return res;
};


//Resource CORS  수정
export interface ModifyResourceProps {
    allowedOrigins?: string[];
    allowedMethods?: string[];
    allowedHeaders?: string[];
    exposedHeaders?: string[];
    maxAge?: number;
    allowCredentials?: boolean;
    corsEnabled: boolean;
    standardCompliant?: boolean;
    validHttpMethods?: boolean;
}

export const modifyResourceCorsSettings = async (apiId: string, resourceId: string, data: ModifyResourceProps) => {
    const res = await requestPut(`/api/v1/plans/${apiId}/resources/${resourceId}/cors`, {
        body: data,
    });

    return res;
};
//리소스 삭제 + 리소스 목록 갱신
export const deleteResource = async (apiId: string, resourceId: string) => {
    const res = await requestDelete(`/api/v1/plans/${apiId}/resources/${resourceId}`);

    return res;
};
// API 배포 실행
export interface deploymentProps {
    apiId: string;
    stageId: string;
    version?: string;
    deployedBy: string;
    description?: string;
    metadata?: {
        jiraTicket?: string;
        reviewer?: string;
    };
}

export const deployAPI = async (data: deploymentProps) => {
    const res = await requestPost(`/api/v1/deployments`, {
        body: data,
    });

    return res;
};
