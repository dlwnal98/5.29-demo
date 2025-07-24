import axios from 'axios';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';

// 유저 생성
const createUser = async (
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

export function useCreateUser(
  organizationName: string,
  userId: string,
  password: string,
  fullName: string,
  email: string,
  options?: UseMutationOptions<any, Error>
) {
  return useMutation({
    mutationFn: () => createUser(organizationName, userId, password, fullName, email),
    ...options,
  });
}
