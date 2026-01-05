

import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import TabMenu from './eureka/common/TabMenu';
import EurekaDashboard from './eureka/eurekaDashboard/eurekaDashboard';
import ServiceList from './eureka/serviceList/ServiceList';

export default function EurekaPage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <>
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Eureka</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Eureka Server를 관리하고 배포하세요.</p>
        </div>
        {/* 탭 메뉴 */}
        <TabMenu activeTab={activeTab} onTabChange={setActiveTab} />

        {/* 전역 대쉬보드 */}
        {activeTab === 'overview' && <EurekaDashboard onTabChange={setActiveTab} />}

        {/* 서비스 목록 */}
        {activeTab === 'services' && <ServiceList />}
      </div>
    </>
  );
}
