import { useMemo } from 'react';
import { useGetDeploymentResourceTreeData } from '@/hooks/use-stages';
import { resoureceBuildTree } from '@/libs/etc';

/**
 * DeploymentResourceTreeDialog의 데이터 fetching 로직을 관리하는 hook
 */
export function useDeploymentResourceTree(selectedDeploymentId: string) {
  const { data: deploymentResourceTree } = useGetDeploymentResourceTreeData(selectedDeploymentId);

  const resourceTree = useMemo(() =>
    resoureceBuildTree(deploymentResourceTree?.openApiDocument?.paths ?? {}),
    [deploymentResourceTree]
  );

  return {
    resourceTree,
  };
}
