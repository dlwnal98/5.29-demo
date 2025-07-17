import axios from 'axios';
import { useQuery, useMutation } from '@tanstack/react-query';

interface UserList {
  tenantId: string;
  userId: string;
  password: string;
  name: string;
  email: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

// 전체 유저 목록 조회
const getUserList = async () => {
  const { data } = await axios.get('/api/v1/users');

  return data;
};

export function useGetUserList() {
  return useQuery<UserList[]>({
    queryKey: ['getUserList'],
    queryFn: () => getUserList(),
    // enabled: !!instanceId, // instanceId가 있을 때만 실행
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}
