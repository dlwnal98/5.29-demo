import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
  ConfigFileListProps,
  BranchListProps,
  OriginFileDetailProps,
  ConfigFileInfoProps,
  FileCommitListProps,
} from '@/types/config';
import { useMutation, useQueryClient } from '@tanstack/react-query';

// config 파일 목록 조회
const fetchConfigFileList = async (owner: string, repo: string, branch?: string, dir?: string) => {
  const { data } = await axios.get(
    `/v1/api/git/file/list?owner=${owner}&repo=${repo}&branch=${branch}&dir=${dir}`
  );
  return data;
};

export function useFetchConfigFileList(owner: string, repo: string, branch?: string, dir?: string) {
  return useQuery<ConfigFileListProps[]>({
    queryKey: ['fetchConfigFileList', owner, repo, branch, dir],
    queryFn: () => fetchConfigFileList(owner, repo, branch, dir),
    // enabled: !!instanceId, // instanceId가 있을 때만 실행
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}

// config 파일 단건 조회
const fetchConfigFileInfo = async (owner: string, repo: string, branch: string, path: string) => {
  const { data } = await axios.get(
    `/v1/api/git/file/info?owner=${owner}&repo=${repo}&branch=${branch}&path=${path}`
  );
  return data;
};

export function useFetchConfigFileInfo(owner: string, repo: string, branch?: string, dir?: string) {
  return useQuery<ConfigFileInfoProps>({
    queryKey: ['fetchConfigFileInfo', owner, repo, branch, dir],
    queryFn: () => fetchConfigFileInfo(owner, repo, branch, dir),
    // enabled: !!instanceId, // instanceId가 있을 때만 실행
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}

// config 레포 브랜치 목록 조회
const fetchBranchList = async (owner: string, repo: string) => {
  const { data } = await axios.get(`/v1/api/git/seach/branches?owner=${owner}&repo=${repo}`);

  return data;
};

export function useFetchBranchList(owner: string, repo: string) {
  return useQuery<BranchListProps[]>({
    queryKey: ['fetchBranchList', owner, repo],
    queryFn: () => fetchBranchList(owner, repo),
    // enabled: !!instanceId, // instanceId가 있을 때만 실행
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}

//config 레포 브랜치 생성 + 실시간 목록 생성
const createBranch = async (
  owner: string,
  repo: string,
  newBranchName: string,
  fromBranchOrSha = 'main'
) => {
  const { data } = await axios.post(
    `/v1/api/git/branch/info`,
    null, // body 없이 보내야 하므로 null
    {
      params: {
        owner,
        repo,
        newBranchName,
        fromBranchOrSha,
      },
    }
  );

  return data;
};

export function useCreateBranch(owner: string, repo: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ newBranchName }: { newBranchName: string }) =>
      createBranch(owner, repo, newBranchName),
    onSuccess: () => {
      // 브랜치 생성 성공 시 목록 invalidate
      queryClient.invalidateQueries({
        queryKey: ['fetchBranchList', owner, repo],
      });
    },
  });
}

//config 레포 브랜치 삭제 + 실시간 목록 생성
const deleteBranch = async (owner: string, repo: string, branchName: string) => {
  const { data } = await axios.delete(`/v1/api/git/branch`, {
    params: {
      owner,
      repo,
      branchName,
    },
  });

  return data;
};

export function useDeleteBranch(owner: string, repo: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ branchName }: { branchName: string }) => deleteBranch(owner, repo, branchName),
    onSuccess: () => {
      // 브랜치 생성 성공 시 목록 invalidate
      // queryClient.invalidateQueries({
      //   queryKey: ["fetchBranchList", owner, repo],
      // });
      window.location.href = '/infra-packages/config/projects?branch=main';
    },
  });
}

// 원본 파일 상세 조회
const fetchOriginFileDetail = async (owner: string, repo: string, ref: string, path: string) => {
  const { data } = await axios.get(
    `/v1/api/git/file/content/detail?owner=${owner}&repo=${repo}&ref=${ref}&path=${path}`
  );

  return data;
};

export function useFetchOriginFileDetail(owner: string, repo: string, ref: string, path: string) {
  return useQuery<OriginFileDetailProps>({
    queryKey: ['fetchOriginFileDetail', owner, repo, ref, path],
    queryFn: () => fetchOriginFileDetail(owner, repo, ref, path),
    // enabled: !!instanceId, // instanceId가 있을 때만 실행
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}

//신규 파일 생성 및 업로드
const createUploadFile = async (
  owner: string,
  repo: string,
  branch: string,
  path: string,
  message: string,
  formData: FormData
) => {
  const { data } = await axios.post(`/v1/api/git/upload/new/file`, formData, {
    params: {
      owner,
      repo,
      branch,
      path,
      message,
    },
  });

  return data;
};

export function useCreateUploadFile(
  owner: string,
  repo: string,
  branch: string,
  path: string,
  message: string
) {
  return useMutation({
    mutationFn: ({ formData }: { formData: FormData }) =>
      createUploadFile(owner, repo, branch, path, message, formData),
    onSuccess: () => {
      // 브랜치 생성 성공 시 목록 invalidate
      window.history.back();
    },
  });
}

//파일 삭제
const deleteFile = async (
  owner: string,
  repo: string,
  branch: string,
  path: string,
  sha: string,
  message: string
) => {
  const { data } = await axios.delete(`/v1/api/git/delete/file`, {
    params: {
      owner,
      repo,
      branch,
      path,
      sha,
      message,
    },
  });

  return data;
};

export function useDeleteFile(
  owner: string,
  repo: string,
  branch: string,
  path: string,
  sha: string,
  message: string
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteFile(owner, repo, branch, path, sha, message),
    onSuccess: () => {
      // 브랜치 생성 성공 시 목록 invalidate
      // window.history.back();
    },
  });
}

//파일 수정
const modifyFile = async (
  owner: string,
  repo: string,
  branch: string,
  path: string,
  sha: string,
  message: string,
  content: string
) => {
  const { data } = await axios.post(`/v1/api/git/file/content/commit`, {
    owner: owner,
    repo: repo,
    branch: branch,
    path: path,
    sha: sha,
    message: message,
    content: content,
  });

  return data;
};

export function useModifyFile(
  owner: string,
  repo: string,
  branch: string,
  path: string,
  sha: string,
  message: string,
  content: string,
  options?: {
    onSuccess?: () => void;
  }
) {
  return useMutation({
    mutationFn: () => modifyFile(owner, repo, branch, path, sha, message, content),
    onSuccess: () => {
      // ✅ 외부 콜백 실행
      options?.onSuccess?.();

      // ✅ 기본 동작: 이전 페이지로 이동
      window.history.back();
    },
  });
}

// 파일 별 커밋 이력 조회
const fetchFileCommitList = async (owner: string, repo: string, branch: string, path: string) => {
  const { data } = await axios.get(
    `/v1/api/git/file/commit/history?owner=${owner}&repo=${repo}&branch=${branch}&path=${path}`
  );
  return data;
};

export function useFetchFileCommitList(owner: string, repo: string, branch: string, path: string) {
  return useQuery<FileCommitListProps[]>({
    queryKey: ['fetchFileCommitList', owner, repo, branch, path],
    queryFn: () => fetchFileCommitList(owner, repo, branch, path),
    // enabled: !!instanceId, // instanceId가 있을 때만 실행
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}

// 특정 파일 커밋 상세 내용 조회
const fetchFileCommitDetail = async (owner: string, repo: string, sha: string) => {
  const { data } = await axios.get(
    `/v1/api/git/commit/info?owner=${owner}&repo=${repo}&sha=${sha}`
  );
  return data;
};

export function useFetchFileCommitDetail(owner: string, repo: string, sha: string) {
  return useQuery<any>({
    queryKey: ['fetchFileCommitDetail', owner, repo, sha],
    queryFn: () => fetchFileCommitDetail(owner, repo, sha),
    // enabled: !!instanceId, // instanceId가 있을 때만 실행
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}

//커밋 롤백
const rollbackCommit = async (
  owner: string,
  repo: string,
  branch: string,
  path: string,
  commitSha: string,
  message: string
) => {
  const { data } = await axios.post(
    `/v1/api/git/rollback?owner=${owner}&repo=${repo}&branch=${branch}&path=${path}&commitSha=${commitSha}&message=${message}`
  );

  return data;
};

export function useRollbackCommit(
  owner: string,
  repo: string,
  branch: string,
  path: string,
  commitSha: string,
  message: string
) {
  return useMutation({
    mutationFn: () => rollbackCommit(owner, repo, branch, path, commitSha, message),
    onSuccess: () => {
      // 브랜치 생성 성공 시 목록 invalidate
      window.history.back();
    },
  });
}

// 롤백 시 두 커밋 간 파일 diff
const fetchFileDiff = async (
  owner: string,
  repo: string,
  path: string,
  oldSha: string,
  newSha: string
) => {
  const { data } = await axios.get(
    `/v1/api/git/diff?owner=${owner}&repo=${repo}&path=${path}&oldSha=${oldSha}&newSha=${newSha}`
  );
  return data;
};

export function useFetchFileDiff(
  owner: string,
  repo: string,
  path: string,
  oldSha: string,
  newSha: string
) {
  return useQuery<any>({
    queryKey: ['fetchFileDiff', owner, repo, path, oldSha, newSha],
    queryFn: () => fetchFileDiff(owner, repo, path, oldSha, newSha),
    // enabled: !!instanceId, // instanceId가 있을 때만 실행
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}

//Vault Key
// config 시크릿 키 값 조회
const fetchVaultKey = async () => {
  const { data } = await axios.get('/api/vault/key');

  return data;
};

export function useFetchVaultKey() {
  return useQuery<string>({
    queryKey: ['fetchVaultKey'],
    queryFn: () => fetchVaultKey(),
    // enabled: !!instanceId, // instanceId가 있을 때만 실행
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}

// //secret key 삭제
// // secret key는 삭제하면 config 서버 다 에러나서 관리자 만들 떄 사용할 거라서 쓰지 X
// const deleteVaultKey = async () => {
//   const { data } = await axios.delete(`/api/vault/key`);

//   return data;
// };

// export function useDeleteVaultKey() {
//   return useMutation({
//     mutationFn: () => deleteVaultKey(),
//     onSuccess: () => {
//       // 브랜치 생성 성공 시 목록 invalidate
//       // window.history.back();
//     },
//   });
// }

//secret key 저장 or 갱신
const saveVaultKey = async (secretKey: string) => {
  const { data } = await axios.post(`/api/vault/key`, secretKey);

  return data;
};

export function useSaveVaultKey(secretKey: string) {
  return useMutation({
    mutationFn: () => saveVaultKey(secretKey),
    onSuccess: () => {
      // 브랜치 생성 성공 시 목록 invalidate
      // window.history.back();
    },
  });
}
