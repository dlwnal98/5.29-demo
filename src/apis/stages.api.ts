import { requestDelete, requestGet, requestPatch, requestPost, requestPut } from '@/libs/apiClient';


// 전체 스테이지 목록
export const getStagesListData = async (apiId: string) => {
    const res = await requestGet(`/api/v1/stages?apiId=${apiId}`);

    return res;
};

// 스테이지 목록 조회 Open API문서
export const getStagesOpenApiDocData = async (stageId: string) => {
    const res = await requestGet(`/api/v1/stages/${stageId}/openapi/extended`);

    return res;
};

// 스테이지 상세 조회
export const getStageDetailData = async (stageId: string) => {
    const res = await requestGet(`/api/v1/stages/${stageId}`);

    return res;
};


// 조직별 전체 배포이력 조회
export const getDeployHistoryData = async (tenantId: string, page?: number, size?: number) => {
    const res = await requestGet(
        `/api/v1/deployments?tenantId=${tenantId}&page=${page}&size=${size}`
    );
    return res;
};

// 특정 배포 이력 Open API문서 (스냅샷 리소스 트리 조회)
export const getDeploymentResourceTreeData = async (deploymentId: string) => {
    const res = await requestGet(`/api/v1/deployments/${deploymentId}/snapshot`);

    return res;
};

export interface CreateStageProps {
    apiId: string;
    stageName: string;
    description?: string;
    deploymentId: string;
    createdBy: string;
}

// 스테이지 생성
export const createStage = async (data: CreateStageProps) => {
    const res = await requestPost(`/api/v1/stages`, {
        body: data,
    });

    if (res) return res;
    else throw new Error();
};

// 스테이지 삭제
export const deleteStage = async (stageId: string) => {
    const res = await requestDelete(`/api/v1/stages/${stageId}`);

    return res;
};
// 스테이지 수정(설명만)
export const modifyStage = async (stageId: string, data: { description: string; updatedBy: string }) => {
    const res = await requestPut(`/api/v1/stages/${stageId}`, {
        body: data,
    });

    return res;
};

export interface PreviousDeploymentProps {
    deploymentId: string;
    updatedBy: string;
}

// 이전 배포 활성화
export const activatePreviousDeployment = async (stageId: string, data: PreviousDeploymentProps) => {
    const res = await requestPost(
        `/api/v1/stages/${stageId}/deployment`, {
        body: data,
    }
    );

    return res;
};


// Stage 내보내기 (파일 다운로드)
export const getStageDocForExport = async (stageId: string, format?: 'OPENAPI_JSON' | 'OPENAPI_YAML' | 'POSTMAN', includeExtensions?: boolean) => {
    const res = await requestGet(
        `/api/v1/stages/${stageId}/export?format=${format}&includeExtensions=${includeExtensions}`
    );

    return res;
};


// Stage 내보내기 미리보기
export const getStageDocForExportPreview = async (stageId: string, format?: 'OPENAPI_JSON' | 'OPENAPI_YAML' | 'POSTMAN', includeExtensions?: boolean) => {
    const res = await requestGet(
        `/api/v1/stages/${stageId}/export/preview?format=${format}&includeExtensions=${includeExtensions}`
    );

    return res;
};
