'use client';

import { AppLayout } from '@/components/layout/AppLayout';
import InfraPackageGrid from './components/InfraPackageGrid';
import ResourceMonitoringSection from './components/ResourceMonitoringSection';

const GrafanaDashboard = () => {
    // const grafanaUrl = "http://1.224.162.188:51428";
    const grafanaUrl = "http://1.224.162.188:51428/public-dashboards/b10ca50ccadb498ba729ec99fef94fd9?from=now-6h&to=now&timezone=browser";
    // const dashboardUid = "b10ca50ccadb498ba729ec99fef94fd9";

    // // 패널 단위로도 임베드 가능
    // const panelSrc = `${grafanaUrl}/d-solo/${dashboardUid}?orgId=1&panelId=2&theme=light`;

    // // 대시보드 전체 임베드
    // const dashboardSrc = `${grafanaUrl}/d/${dashboardUid}?orgId=1&kiosk&theme=light`;

    return (
        <iframe
            src={grafanaUrl}
            width="100%"
            height="800px"
            frameBorder="0"
            style={{ border: 'none' }}
        />
    );
};

export default function Dashboard() {

    return (
        <>
            <div className="bg-transparent">
                <div className="container mx-auto px-4 py-4 space-y-3.5">
                    <InfraPackageGrid />
                    <ResourceMonitoringSection />
                </div>
            </div>

        </>

    );
}
