
import { requestDelete, requestGet, requestPatch, requestPost } from '@/libs/request';


// 전체 유저 목록 조회 (super)
export const getUserList = async (active: string) => {
    let requestUrl = '';

    if (active === 'all') {
        requestUrl = '/api/v1/users';
    } else {
        const activeBoolean = active === 'active';
        requestUrl = `/api/v1/users?active=${activeBoolean}`;
    }

    const res = await requestGet(requestUrl);

    if (res.code == 200) {
        return res.data;
    } else throw new Error(res.message ?? '전체 유저 목록 조회 실패');
};

// 조직 멤버 조회 (admin)
export const getMemberByOrganizationList = async (organizationId: string) => {
    const res = await requestGet(`/api/v1/organizations/${organizationId}/members`);
    if (res.code == 200) {
        return res.data;
    } else throw new Error(res.message ?? '조직 멤버 목록 조회 실패');
};

//조직 멤버 활성화 or 비활성화
export const memberHandleStatus = async (userKey: string, active: boolean) => {
    const res = await requestPatch(`/api/v1/users/${userKey}?active=${active}`);

    return res;
};


//조직 멤버 삭제
export const deleteMember = async (organizationId: string, userKey: string) => {
    const res = await requestDelete(`/api/v1/organizations/${organizationId}/members/${userKey}`);

    return res;
};

//조직 멤버 추가
export const AddMember = async (organizationId: string, userId: string) => {
    const res = await requestPost(`/api/v1/organizations/${organizationId}/members`, {
        body: {
            userId,
        },
    });

    return res;
};