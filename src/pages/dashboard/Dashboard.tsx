'use client';

import { AppLayout } from '@/components/layout/AppLayout';
import InfraPackageGrid from './components/InfraPackageGrid';
import ResourceMonitoringSection from './components/ResourceMonitoringSection';

export default function Dashboard() {

    return (
        <>
            <div className="bg-transparent">
                <div className="container mx-auto px-4 py-4 space-y-3.5">
                    {/* Apps Grid */}
                    <InfraPackageGrid />

                    {/* Server Monitoring Section */}
                    <ResourceMonitoringSection />
                </div>
            </div>
        </>

    );
}
