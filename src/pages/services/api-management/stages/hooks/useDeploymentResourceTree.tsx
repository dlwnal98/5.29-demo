import { useMemo } from 'react';
import { useGetDeploymentResourceTreeData } from '@/hooks/use-stages';
import { resoureceBuildTree } from '@/libs/etc';

/**
 * DeploymentResourceTreeDialog의 데이터 fetching 로직을 관리하는 hook
 */
export function useDeploymentResourceTree(selectedDeploymentId: string, open: boolean) {
  const { data: deploymentResourceTree, isLoading, isFetched } = useGetDeploymentResourceTreeData(
    selectedDeploymentId,
    open
  );

  const resourceTree = useMemo(() => {
    if (!deploymentResourceTree?.openApiDocument?.paths) return [];
    return resoureceBuildTree(deploymentResourceTree.openApiDocument.paths);
  }, [deploymentResourceTree]);

  return {
    resourceTree,
    isLoading,
    isReady: isFetched && !isLoading,
  };
}
