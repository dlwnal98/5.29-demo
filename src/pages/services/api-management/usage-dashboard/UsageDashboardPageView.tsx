// import SummaryCard from './components/SummaryCard'
// import RealtimeTrafficChart from './components/RealtimeTrafficChart'
// import ErrorRateChart from './components/ErrorRateChart'
// import TopApisChart from './components/TopApisChart'
// import ResponseTimeDistribution from './components/ResponseTimeDistribution'
// import RequestLogsTable from './components/RequestLogsTable'
// import {
//     SummaryData,
//     RealtimeDataPoint,
//     TopApiData,
//     HistoryData,
//     ResponseTimeData
// } from './hooks/useUsageDashboard'

// interface UsageDashboardPageViewProps {
//     summary: SummaryData | null
//     realtimeData: RealtimeDataPoint[]
//     topApis: TopApiData[]
//     historyData: HistoryData
//     currentPage: number
//     responseTimeData: ResponseTimeData | null
//     onPageChange: (page: number) => void
//     calculateChange: (current: number, previous: number) => number
// }

// function UsageDashboardPageView({
//     summary,
//     realtimeData,
//     topApis,
//     historyData,
//     currentPage,
//     responseTimeData,
//     onPageChange,
//     calculateChange
// }: UsageDashboardPageViewProps) {
//     return (
//         <div className="flex flex-col gap-8 p-8 bg-slate-50 min-h-screen font-sans">
//             <div className="mb-6 p-4 bg-blue-50 border border-blue-500 rounded-lg text-blue-600 text-sm flex items-center gap-2">
//                 <strong>Sample Mode:</strong> This dashboard is displaying mock data for demonstration purposes.
//             </div>

//             {/* Summary Cards Row */}
//             <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
//                 <SummaryCard
//                     type="requests"
//                     label="Total Requests"
//                     value={summary?.totalRequests || 0}
//                     change={calculateChange(summary?.totalRequests || 0, (summary?.totalRequests || 0) * 0.9)}
//                     accentColor="primary"
//                 />
//                 <SummaryCard
//                     type="today"
//                     label="Today's Traffic"
//                     value={summary?.todayRequests || 0}
//                     change={calculateChange(summary?.todayRequests || 0, summary?.yesterdayRequests || 0)}
//                     accentColor="success"
//                 />
//                 <SummaryCard
//                     type="success"
//                     label="Success Rate"
//                     value={summary?.successRate || 0}
//                     format="percent"
//                     change={calculateChange(summary?.successRate || 0, summary?.yesterdaySuccessRate || 0)}
//                     accentColor="warning"
//                 />
//                 <SummaryCard
//                     type="time"
//                     label="Avg Latency"
//                     value={summary?.avgResponseTimeMs || 0}
//                     format="time"
//                     change={calculateChange(summary?.avgResponseTimeMs || 0, summary?.yesterdayAvgResponseTime || 0)}
//                     changeDirection={(summary?.avgResponseTimeMs || 0) < (summary?.yesterdayAvgResponseTime || 0) ? 'down' : 'up'}
//                     accentColor="error"
//                 />
//             </section>

//             {/* Charts Row 1: Traffic & Errors */}
//             <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 transition-all duration-150 hover:shadow-md">
//                     <div className="flex items-center justify-between mb-6 pb-2">
//                         <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
//                             Realtime Traffic (RPS)
//                         </h3>
//                         <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-lg">
//                             <span
//                                 className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_0_2px_rgba(59,130,246,0.2)]"
//                                 style={{ animation: 'pulse 2s infinite' }}
//                             />
//                             <span className="text-xs font-medium text-blue-500">Simulated</span>
//                         </div>
//                     </div>
//                     <div className="h-[300px] w-full">
//                         <RealtimeTrafficChart data={realtimeData} height={300} />
//                     </div>
//                 </div>

//                 <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 transition-all duration-150 hover:shadow-md">
//                     <div className="flex items-center justify-between mb-6 pb-2">
//                         <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
//                             Error Rate Trend
//                         </h3>
//                     </div>
//                     <div className="h-[300px] w-full">
//                         <ErrorRateChart data={realtimeData} height={300} />
//                     </div>
//                 </div>
//             </section>

//             {/* Charts Row 2: Top APIs & Response Time */}
//             <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 transition-all duration-150 hover:shadow-md">
//                     <div className="flex items-center justify-between mb-6 pb-2">
//                         <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
//                             Top APIs Usage
//                         </h3>
//                     </div>
//                     <div className="h-[300px] w-full">
//                         <TopApisChart data={topApis} height={300} />
//                     </div>
//                 </div>

//                 <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 transition-all duration-150 hover:shadow-md">
//                     <div className="flex items-center justify-between mb-6 pb-2">
//                         <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
//                             Response Time Distribution
//                         </h3>
//                     </div>
//                     <ResponseTimeDistribution data={responseTimeData || undefined} />
//                 </div>
//             </section>

//             {/* Request Logs (Full Width) */}
//             <section className="w-full">
//                 <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 transition-all duration-150 hover:shadow-md">
//                     <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 pb-2 gap-4">
//                         <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
//                             Recent System Logs
//                         </h3>
//                         <div className="flex items-center gap-2 w-full md:w-auto justify-end">
//                             <button className="px-3 py-1 rounded-lg text-xs font-medium text-slate-600 bg-transparent hover:bg-slate-100 hover:text-slate-900 transition-all duration-150">
//                                 Filter
//                             </button>
//                             <button className="px-3 py-1 rounded-lg text-xs font-medium text-slate-600 bg-transparent hover:bg-slate-100 hover:text-slate-900 transition-all duration-150">
//                                 Export
//                             </button>
//                         </div>
//                     </div>
//                     <RequestLogsTable
//                         data={historyData.content}
//                         totalElements={historyData.totalElements}
//                         totalPages={historyData.totalPages}
//                         currentPage={currentPage}
//                         pageSize={10}
//                         onPageChange={onPageChange}
//                     />
//                 </div>
//             </section>

//             {/* Pulse animation keyframes - added via style tag for the status indicator */}
//             <style>{`
//                 @keyframes pulse {
//                     0% {
//                         transform: scale(0.95);
//                         box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
//                     }
//                     70% {
//                         transform: scale(1);
//                         box-shadow: 0 0 0 6px rgba(59, 130, 246, 0);
//                     }
//                     100% {
//                         transform: scale(0.95);
//                         box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
//                     }
//                 }
//             `}</style>
//         </div>
//     )
// }

// export default UsageDashboardPageView

const GrafanaDashboard = () => {
    // const grafanaUrl = "http://1.224.162.188:51428";
    const grafanaUrl = "http://1.224.162.188:51428/public-dashboards/b10ca50ccadb498ba729ec99fef94fd9";
    // const dashboardUid = "b10ca50ccadb498ba729ec99fef94fd9";

    // // 옵션 파라미터
    const optionSrc = `from=now-6h&to=now&timezone=browser&kiosk&theme=light`;

    // // 대시보드 전체 임베드
    const dashboardSrc = `${grafanaUrl}?${optionSrc}`;

    return (
        <iframe
            src={dashboardSrc}
            width="100%"
            height="800px"
            frameBorder="0"
            style={{ border: 'none' }}
        />
    );
};

export default function UsageDashboardPageView() {
    return (
        <div className="bg-transparent">
            <div className="container mx-auto px-4 py-4 space-y-3.5">
                <GrafanaDashboard />
            </div>
        </div>
    )
}
