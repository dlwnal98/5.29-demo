import { ResponseTimeData } from '../hooks/useUsageDashboard'

interface ResponseTimeDistributionProps {
    data?: Partial<ResponseTimeData>
}

type StatusColor = 'success' | 'warning' | 'error'

interface Thresholds {
    good: number
    warning: number
}

interface Metric {
    label: string
    value: number
    description: string
    thresholds: Thresholds
}

const statusStyles: Record<StatusColor, { value: string; indicator: string }> = {
    success: {
        value: 'text-emerald-500',
        indicator: 'bg-emerald-500'
    },
    warning: {
        value: 'text-amber-500',
        indicator: 'bg-amber-500'
    },
    error: {
        value: 'text-red-500',
        indicator: 'bg-red-500'
    }
}

function ResponseTimeDistribution({ data = {} }: ResponseTimeDistributionProps) {
    const {
        avgResponseTime = 142,
        minResponseTime = 12,
        maxResponseTime = 2340,
        p50 = 89,
        p95 = 245,
        p99 = 520
    } = data

    const getStatusColor = (value: number, thresholds: Thresholds): StatusColor => {
        if (value < thresholds.good) return 'success'
        if (value < thresholds.warning) return 'warning'
        return 'error'
    }

    const metrics: Metric[] = [
        {
            label: 'P50',
            value: p50,
            description: '중앙값 (50%)',
            thresholds: { good: 100, warning: 300 }
        },
        {
            label: 'P95',
            value: p95,
            description: '95번째 백분위수',
            thresholds: { good: 300, warning: 1000 }
        },
        {
            label: 'P99',
            value: p99,
            description: '99번째 백분위수',
            thresholds: { good: 1000, warning: 3000 }
        },
        {
            label: 'Max',
            value: maxResponseTime,
            description: '최대값',
            thresholds: { good: 2000, warning: 5000 }
        }
    ]

    return (
        <div className="p-0">
            <div className="grid grid-cols-2 gap-4 mb-4">
                {metrics.map((metric, index) => {
                    const status = getStatusColor(metric.value, metric.thresholds)
                    const styles = statusStyles[status]
                    return (
                        <div
                            key={index}
                            className="bg-slate-50 rounded-lg p-4 relative overflow-hidden transition-transform duration-200 hover:-translate-y-0.5"
                        >
                            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                                {metric.label}
                            </div>
                            <div className={`text-2xl font-bold mb-1 leading-tight ${styles.value}`}>
                                {metric.value >= 1000
                                    ? `${(metric.value / 1000).toFixed(2)}s`
                                    : `${Math.round(metric.value)}ms`
                                }
                            </div>
                            <div className="text-xs text-slate-400">
                                {metric.description}
                            </div>
                            <div className={`absolute bottom-0 left-0 right-0 h-1 ${styles.indicator}`} />
                        </div>
                    )
                })}
            </div>

            <div className="flex items-center justify-center gap-6 p-4 bg-slate-50 rounded-lg mt-4">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-400">평균</span>
                    <span className="text-sm font-semibold text-slate-900">{Math.round(avgResponseTime)}ms</span>
                </div>
                <div className="w-px h-6 bg-slate-200" />
                <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-400">최소</span>
                    <span className="text-sm font-semibold text-slate-900">{minResponseTime}ms</span>
                </div>
            </div>
        </div>
    )
}

export default ResponseTimeDistribution
