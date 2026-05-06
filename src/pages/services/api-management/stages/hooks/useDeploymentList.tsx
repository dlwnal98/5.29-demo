import { useState, useMemo } from 'react';
import { useAuthStore } from '@/stores/store';

export interface ColumnVisibility {
  deployedAt: boolean;
  status: boolean;
  description: boolean;
  deploymentId: boolean;
}

interface UseDeploymentListProps {
  deploymentHistoryData: any;
  deploymentPage: number;
  setDeploymentPage: (page: number) => void;
  deploymentSize: number;
  setDeploymentSize: (size: number) => void;
}

/**
 * DeploymentList의 상태 및 비즈니스 로직을 관리하는 hook
 */
export function useDeploymentList({
  deploymentHistoryData,
  deploymentPage,
  setDeploymentPage,
  deploymentSize,
  setDeploymentSize,
}: UseDeploymentListProps) {
  const userData = useAuthStore((state) => state.user);
  const tenantId = userData?.organizationId ?? "kwwwksAsvmas";

  // 상태 관리
  const [selectedDeploymentId, setSelectedDeploymentId] = useState<string | null>(null);
  const [deploymentSearchTerm, setDeploymentSearchTerm] = useState('');
  const [isActiveDeploymentModalOpen, setIsActiveDeploymentModalOpen] = useState(false);
  const [isDeploymentResourceTreeOpen, setIsDeploymentResourceTreeOpen] = useState(false);
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);

  // 설정 상태 (열 표시만 내부 관리, 페이지 크기는 외부에서 관리)
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    deployedAt: true,
    status: true,
    description: true,
    deploymentId: true,
  });

  // 배포 기록 필터링
  const filteredDeployments = useMemo(
    () =>
      deploymentHistoryData?.content?.filter(
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

  // 서버 측 페이지네이션 정보 (API 응답에서 가져옴)
  const totalElements = deploymentHistoryData?.totalElements || 0;
  const totalPages = deploymentHistoryData?.totalPages || Math.ceil(totalElements / deploymentSize);
  const currentPage = deploymentPage + 1; // UI에서는 1-based로 표시
  const startIndex = deploymentPage * deploymentSize;

  // 서버에서 이미 페이지네이션된 데이터를 반환하므로 content를 그대로 사용
  const paginatedDeployments = sortedDeployments;

  // 현재 활성 배포
  const currentActiveDeployment = useMemo(
    () => deploymentHistoryData?.content?.find((d: any) => d.status === 'ACTIVE'),
    [deploymentHistoryData]
  );

  // 선택된 배포 데이터
  const selectedDeploymentData = useMemo(
    () =>
      selectedDeploymentId
        ? deploymentHistoryData?.content?.find((d: any) => d.deploymentId === selectedDeploymentId)
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
    if (deploymentPage > 0) {
      setDeploymentPage(deploymentPage - 1);
    }
  };

  // 다음 페이지로
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setDeploymentPage(deploymentPage + 1);
    }
  };

  // 설정 다이얼로그 열기
  const handleOpenSettings = () => {
    setIsSettingsDialogOpen(true);
  };

  // 페이지 크기 변경 시 현재 페이지 리셋
  const handleItemsPerPageChange = (value: number) => {
    setDeploymentSize(value);
    setDeploymentPage(0); // 0-based로 리셋
  };

  return {
    // 사용자 데이터
    userData,
    tenantId,

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
    totalElements,
    startIndex,
    itemsPerPage: deploymentSize,

    // 설정 상태
    isSettingsDialogOpen,
    setIsSettingsDialogOpen,
    columnVisibility,
    setColumnVisibility,

    // 핸들러
    handleDeploymentSelect,
    handleActiveDeploymentChange,
    handleDetailDeployment,
    handlePreviousPage,
    handleNextPage,
    handleOpenSettings,
    handleItemsPerPageChange,
  };
}
