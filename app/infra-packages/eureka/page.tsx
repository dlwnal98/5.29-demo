'use client';

import { act, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import TabMenu from './components/common/TabMenu';
import EurekaDashboard from './components/eurekaDashboard/eurekaDashoboard';
import ServiceList from './components/serviceList/ServiceList';

export default function EurekaPage() {
  const [activeTab, setActiveTab] = useState('overview');

  // if (isLoading)
  //   return (
  //     <AppLayout>
  //       <Spinner />
  //     </AppLayout>
  //   );
  // if (isError)
  //   return (
  //     <AppLayout>
  //       <div>오류가 발견되었습니다.</div>
  //     </AppLayout>
  //   );

  // 예시
  // if (isFetching && !data) {
  //   return <LoadingSpinner />;
  //   // 아직 데이터 받아오는 중 (로딩 스피너 등 표시)
  // }

  // if (!data && !isLoading) {
  //   return <ErrorFallback />;
  //   // 데이터가 아예 존재하지 않음 (캐시도 없음)
  // }

  // if (isSuccess && !data) {
  //   return <NoDataFound />;
  //   // 서버 응답은 성공했지만 실제 데이터는 없음 (빈 배열 등)
  // }

  console.log(activeTab);

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Eureka</h1>
          <p className="text-gray-600 mt-1">Eureka Server를 관리하고 배포하세요.</p>
        </div>
        {/* 탭 메뉴 */}
        <TabMenu activeTab={activeTab} onTabChange={setActiveTab} />

        {/* 전역 대쉬보드 */}
        {activeTab === 'overview' && <EurekaDashboard onTabChange={setActiveTab} />}

        {/* 서비스 목록 */}
        {activeTab === 'services' && <ServiceList />}
      </div>
    </AppLayout>
  );
}
