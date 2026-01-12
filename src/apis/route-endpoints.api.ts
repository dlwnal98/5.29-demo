import { requestGet, requestDelete, requestPost, requestPut } from '@/libs/apiClient';


export interface EndpointsData {
    id: string;
    tenantId: string;
    routeName: string;
    routeUrl: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    updatedBy: string;
}

export interface CreateEndpointProps {
    tenantId: string;
    routeName: string;
    routeUrl: string;
    description: string;
    createdBy: string;
}

// Endpoints List 조회
export const getEndpointsList = async (tenantId: string): Promise<EndpointsData[]> => {
    const res = await requestGet(`/api/v1/route-endpoints?tenantId=${tenantId}`);

    return res;
};

//Endpoints 생성
export const createEndpoint = async (data: CreateEndpointProps) => {
    const res = await requestPost(`/api/v1/route-endpoints`, {
        body: data,
    });

    return res;
};



export interface ModifyEndpointProps {
    routeName: string;
    routeUrl: string;
    description: string;
    updatedBy: string;
}

//Endpoints 수정
export const modifyEndpoint = async (id: string, data: ModifyEndpointProps) => {
    const res = await requestPut(`/api/v1/route-endpoints/${id}`, {
        body: data,
    });

    return res;
};


// Endpoints 삭제 (스테이지 삭제하면 엔드포인트도 다 삭제하게 만들어서 이거는 쓰지 말기)
export const deleteEndpoint = async (id: string) => {
    const res = await requestDelete(`/api/v1/route-endpoints/${id}`);

    return res;
};