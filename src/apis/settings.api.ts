import axios from 'axios';


export interface OrganizationList {
    organizationId: string;
    organizationName: string;
    desciption: string | null;
    createdAt: string;
    updatedAt: string;
    ownerId: string; // 조직 admin userKey 같은데..
}

// 모든 조직 조회
export const getOrganizationList = async () => {
    const { data } = await axios.get(`/api/v1/organizations`);

    return data;
};


// 특정 조직 조회
export const getSpecificOrganizationData = async (organizationName: string) => {
    const { data } = await axios.get(`/api/v1/organizations/name/${organizationName}`);

    return data;
};
// 조직 삭제
export const deleteOrganization = async (organizationId: string) => {
    const { data } = await axios.delete(`/api/v1/organizations/${organizationId}`);

    return data;
};
// 조직 수정
export const modifyOrganization = async (
    organizationId: string,
    organizationName: string,
    description: string
) => {
    const { data } = await axios.put(`/api/v1/organizations/${organizationId}`, {
        organizationName: organizationName,
        description: description,
    });

    return data;
};
