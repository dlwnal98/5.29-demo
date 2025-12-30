import { useState, useMemo } from 'react';
import { useAuthStore } from '@/store/store';
import { useGetDeployHistoryData } from '@/hooks/use-stages';

/**
 * DeploymentList의 상태 및 비즈니스 로직을 관리하는 hook
 */
export function useDeploymentList() {
  const userData = useAuthStore((state) => state.user);

  // 배포 기록 데이터 fetching
  const { data: deploymentHistoryData } = useGetDeployHistoryData(
    userData?.organizationId || '',
    0,
    20
  );

  // 상태 관리
  const [selectedDeploymentId, setSelectedDeploymentId] = useState<string | null>(null);
  const [deploymentSearchTerm, setDeploymentSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isActiveDeploymentModalOpen, setIsActiveDeploymentModalOpen] = useState(false);
  const [isDeploymentResourceTreeOpen, setIsDeploymentResourceTreeOpen] = useState(false);

  const itemsPerPage = 10;

  // 배포 기록 필터링
  const filteredDeployments = useMemo(
    () =>
      deploymentHistoryData?.filter(
        (deployment: any) =>
          deployment.deploymentId
            ?.toLowerCase()
            ?.includes(deploymentSearchTerm.toLowerCase()) ||
          deployment.description?.toLowerCase()?.includes(deploymentSearchTerm.toLowerCase())
      ),
    [deploymentHistoryData, deploymentSearchTerm]
  );

  // 최신순 정렬
  const sortedDeployments = useMemo(
    () =>
      filteredDeployments
        ?.slice()
        .sort((a: any, b: any) => new Date(b.deployedAt).getTime() - new Date(a.deployedAt).getTime()),
    [filteredDeployments]
  );

  // 페이지네이션
  const totalPages = Math.ceil(sortedDeployments?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDeployments = sortedDeployments?.slice(startIndex, startIndex + itemsPerPage);

  // 현재 활성 배포
  const currentActiveDeployment = useMemo(
    () => deploymentHistoryData?.find((d: any) => d.status === 'ACTIVE'),
    [deploymentHistoryData]
  );

  // 선택된 배포 데이터
  const selectedDeploymentData = useMemo(
    () =>
      selectedDeploymentId
        ? deploymentHistoryData?.find((d: any) => d.deploymentId === selectedDeploymentId)
        : null,
    [selectedDeploymentId, deploymentHistoryData]
  );

  // 배포 선택 핸들러
  const handleDeploymentSelect = (deploymentId: string) => {
    if (selectedDeploymentId === deploymentId) {
      setSelectedDeploymentId('');
    } else {
      setSelectedDeploymentId(deploymentId);
    }
  };

  // 활성 배포 변경 핸들러
  const handleActiveDeploymentChange = () => {
    if (!selectedDeploymentId) return;
    setIsActiveDeploymentModalOpen(true);
  };

  // 배포 상세 보기 핸들러
  const handleDetailDeployment = (deploymentId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedDeploymentId(deploymentId);
    setIsDeploymentResourceTreeOpen(true);
  };

  // 이전 페이지로
  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  // 다음 페이지로
  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  return {
    // 사용자 데이터
    userData,

    // 배포 데이터
    filteredDeployments,
    paginatedDeployments,
    currentActiveDeployment,
    selectedDeploymentData,

    // 상태
    selectedDeploymentId,
    setSelectedDeploymentId,
    deploymentSearchTerm,
    setDeploymentSearchTerm,
    currentPage,
    isActiveDeploymentModalOpen,
    setIsActiveDeploymentModalOpen,
    isDeploymentResourceTreeOpen,
    setIsDeploymentResourceTreeOpen,

    // 페이지네이션 정보
    totalPages,
    startIndex,
    itemsPerPage,

    // 핸들러
    handleDeploymentSelect,
    handleActiveDeploymentChange,
    handleDetailDeployment,
    handlePreviousPage,
    handleNextPage,
  };
}
