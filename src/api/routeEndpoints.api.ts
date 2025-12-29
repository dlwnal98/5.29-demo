import { requestGet, requestDelete, requestPost, requestPut } from '@/lib/apiClient';


export interface EndpointsData {
    targetId: string;
    organizationId: string;
    routeEndpoint: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    isValidUrl: boolean;
}

export interface CreateEndpointProps {
    organizationId: string;
    routeEndpoint: string;
    description: string;
    createdBy: string;
}

// Endpoints List 조회
export const getEndpointsList = async (organizationId: string): Promise<EndpointsData[]> => {
    const res = await requestGet(`/api/v1/target-endpoints/organizations/${organizationId}`);

    return res;
};

//Endpoints 생성
export const createEndpoint = async (data: CreateEndpointProps) => {
    const res = await requestPost(`/api/v1/target-endpoints`, {
        body: data,
    });

    return res;
};



export interface ModifyEndpointProps {
    routeEndpoint: string;
    description: string;
    updatedBy: string;
}

//Endpoints 수정
export const modifyEndpoint = async (targetId: string, data: ModifyEndpointProps) => {
    const res = await requestPut(`/api/v1/target-endpoints/${targetId}`, {
        body: data,
    });

    return res;
};


// Endpoints 삭제 (스테이지 삭제하면 엔드포인트도 다 삭제하게 만들어서 이거는 쓰지 말기)
export const deleteEndpoint = async (targetId: string) => {
    const res = await requestDelete(`/api/v1/target-endpoints/${targetId}`);

    return res;
};