// import axios from 'axios';
// import { useQueryClient, useMutation } from '@tanstack/react-query';

// //api 키 생성 + 실시간 목록 생성
// const createAPIKey = async (
//   userId: string,
//   tenantId: string,
//   keyName: string,
//   description: string
// ) => {
//   const { data } = await axios.post(`/api/v1/apikey/issue`, {
//     userId: userId,
//     tenantId: tenantId,
//     keyName: keyName,
//     description: description,
//   });

//   return data;
// };

// export function useCreateAPIKey(
//   userId: string,
//   tenantId: string,
//   keyName: string,
//   description: string
// ) {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({ keyName, description }: { keyName: string; description: string }) =>
//       createAPIKey(userId, tenantId, keyName, description),
//     onSuccess: () => {
//       // 브랜치 생성 성공 시 목록 invalidate
//       //   queryClient.invalidateQueries({
//       //     queryKey: ['fetchBranchList', owner, repo],
//       //   });
//     },
//   });
// }
