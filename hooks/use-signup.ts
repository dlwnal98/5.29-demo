import axios from 'axios';

// 유저 생성
export const createUser = async (
  organizationName: string,
  userId: string,
  password: string,
  fullName: string,
  email: string
) => {
  const { data } = await axios.post(`/api/v1/users`, {
    organizationName: organizationName,
    userId: userId,
    password: password,
    fullName: fullName,
    email: email,
  });

  return data;
};

// 멤버 생성 + 회원가입
export const createMemberInit = async (
  userId: string,
  password: string,
  name: string,
  email: string
) => {
  const { data } = await axios.patch(`/api/v1/users/${userId}/init`, {
    password: password,
    name: name,
    email: email,
  });

  return data;
};
