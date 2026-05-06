'use client';

import {
    Monitor,
} from 'lucide-react';
import NetworkMonitoringSection from '../components/NetworkMonitoringSection';
import SystemLogSection from '../components/SystemLogSection';
import { RealTimeAreaChart } from './RealTimeAreaChart';
import { DiskUsage } from './DiskUsage';


// 툴팁 설명 데이터
export const tooltipDescriptions = {
    cpu: 'CPU 사용량은 서버의 프로세서 사용률을 나타냅니다. 높은 값은 서버가 과부하 상태일 수 있음을 의미합니다.',
    memory:
        '메모리 사용량은 서버의 RAM 사용률을 나타냅니다. 높은 값은 메모리 부족으로 성능 저하가 발생할 수 있음을 의미합니다.',
    disk: '디스크 사용량은 서버의 저장 공간 사용률을 나타냅니다. 높은 값은 디스크 공간이 부족할 수 있음을 의미합니다.',
    network:
        '네트워크 트래픽은 서버의 네트워크 인터페이스를 통한 데이터 전송량을 나타냅니다. BPS는 초당 바이트, PPS는 초당 패킷을 의미합니다.',
    events:
        '이벤트는 서버에서 발생한 중요한 알림, 경고 및 오류를 표시합니다. 시스템 상태를 모니터링하는 데 중요합니다.',
};

export default function ResourceMonitoringSection() {
    return (
        <div className="">
            {/* <h2 className="text-xl font-semibold text-blue-900 mb-4 flex items-center dark:text-[#92C4FD]">
                <Monitor className="h-5 w-5 mr-2" />
                Server Monitoring
            </h2> */}

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {/* CPU Chart */}
                <RealTimeAreaChart
                    title="CPU"
                    dataKey="cpu"
                    color="#3b82f6"
                    maxValue={100}
                    unit="%"
                    tooltipDescription={tooltipDescriptions.cpu}
                />

                {/* Memory Chart */}
                <RealTimeAreaChart
                    title="메모리"
                    dataKey="memory"
                    color="#7761F2"
                    maxValue={100}
                    unit="%"
                    tooltipDescription={tooltipDescriptions.memory}
                />
                <DiskUsage />

                {/* Network Chart - spans 2 columns */}
                <div className="lg:col-span-2">
                    <NetworkMonitoringSection />
                </div>

                {/* Events Section */}
                <SystemLogSection />
            </div>
        </div>
    )
}