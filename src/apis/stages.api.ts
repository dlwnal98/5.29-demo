import { requestDelete, requestGet, requestPatch, requestPost, requestPut } from '@/libs/apiClient';

// 전체 스테이지 목록 조회 Open API문서
export const getStatesDocData = async (apiId: string, path?: string) => {
    const res = await requestGet(`/api/v1/stages/api/${apiId}`);

    return res;
};

// 조직별 전체 배포이력 조회
export const getDeployHistoryData = async (organizationId: string, page?: number, size?: number) => {
    const res = await requestGet(
        `/api/v1/deployments/history?organizationId=${organizationId}&page=${page}&size=${size}`
    );
    return res;
};

// 특정 배포 이력 Open API문서 (스냅샷 리소스 트리 조회)
export const getDeploymentResourceTreeData = async (deploymentId: string) => {
    const res = await requestGet(`/api/v1/deployments/${deploymentId}/snapshot`);

    return res;
};

export interface CreateStageProps {
    organizationId: string;
    stageName: string;
    description?: string;
    createdBy: string;
    enabled: true;
    deploymentSource: 'DRAFT' | 'PREVIOUS_DEVELOPMENT'; // 새 스테이지 생성시 'DRAFT', 옵션에서 스테이지 선택시 'PREVIOUS_DEVELOPMENT'
    apiId: string;
    sourceDeploymentId: string; // draft일 때는 없어도 됨
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
export const deleteStage = async (stageId: string, deletedBy: string) => {
    const res = await requestDelete(`/api/v1/stages/${stageId}?deletedBy=${deletedBy}`);

    return res;
};
// 스테이지 수정(설명만)
export const modifyStage = async (stageId: string, description: string) => {
    const res = await requestPut(`/api/v1/stages/${stageId}/config`, {
        body: {
            description: description,
        },
    });

    return res;
};

export interface PreviousDeploymentProps {
    stageId: string;
    targetDeploymentId: string;
    activatedBy?: string | null;
}

// 이전 배포 활성화
export const activatePreviousDeployment = async (data: PreviousDeploymentProps) => {
    const res = await requestPost(
        `/api/v1/deployments/stages/${data.stageId}/activate-previous?targetDeploymentId=${data.targetDeploymentId}&activatedBy=${data.activatedBy}`
    );

    return res;
};
