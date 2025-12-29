import { requestPost, requestPatch } from '../lib/apiClient';

// 유저 생성
export const createUser = async (
  organizationName: string,
  userId: string,
  password: string,
  fullName: string,
  email: string
) => {
  const res = await requestPost(`/api/v1/users`, {
    body: {
      organizationName,
      userId,
      password,
      fullName,
      email,
    },
  });

  console.log(res);
  return res;
};

// 멤버 생성 + 회원가입
export const createMemberInit = async (
  userId: string,
  password: string,
  name: string,
  email: string
) => {
  const res = await requestPatch(`/api/v1/users/${userId}/init`, {
    body: {
      password,
      name,
      email,
    },
  });
  console.log(res);
  return res;
};
