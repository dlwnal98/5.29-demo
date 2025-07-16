import axios from 'axios';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';

// 유저 생성
const createUser = async (
  tenantId: string,
  userId: string,
  password: string,
  name: string,
  email: string,
  roleIds: number[]
) => {
  const { data } = await axios.post(`/api/v1/users`, {
    tenantId: tenantId,
    userId: userId,
    password: password,
    name: name,
    email: email,
    roleIds: roleIds,
  });

  return data;
};

export function useCreateUser(
  tenantId: string,
  userId: string,
  password: string,
  name: string,
  email: string,
  roleIds: number[],
  options?: UseMutationOptions<any, Error>
) {
  return useMutation({
    mutationFn: () => createUser(tenantId, userId, password, name, email, roleIds),
    ...options,
  });
}
