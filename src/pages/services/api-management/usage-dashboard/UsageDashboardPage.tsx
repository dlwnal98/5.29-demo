import { useUsageDashboard } from './hooks/useUsageDashboard'
import UsageDashboardPageView from './UsageDashboardPageView'

function UsageDashboardPage() {
    const {
        summary,
        realtimeData,
        topApis,
        historyData,
        currentPage,
        isLoading,
        responseTimeData,
        setCurrentPage,
        calculateChange
    } = useUsageDashboard()

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-400">
                <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin mb-4" />
                <p>Loading Sample Data...</p>
            </div>
        )
    }

    return (
        <UsageDashboardPageView
            summary={summary}
            realtimeData={realtimeData}
            topApis={topApis}
            historyData={historyData}
            currentPage={currentPage}
            responseTimeData={responseTimeData}
            onPageChange={setCurrentPage}
            calculateChange={calculateChange}
        />
    )
}

export default UsageDashboardPage
