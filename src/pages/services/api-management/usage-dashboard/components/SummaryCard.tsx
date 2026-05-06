import { ReactNode } from 'react'
import { formatNumber, formatPercent, formatResponseTime } from '@/libs/formatters'

type CardType = 'requests' | 'today' | 'success' | 'time'
type AccentColor = 'primary' | 'success' | 'warning' | 'error'
type FormatType = 'number' | 'percent' | 'time'

interface SummaryCardProps {
    type?: CardType
    label: string
    value: number
    change?: number | null
    changeDirection?: 'up' | 'down'
    accentColor?: AccentColor
    format?: FormatType
}

const iconMap: Record<CardType, ReactNode> = {
    requests: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
    ),
    today: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
    ),
    success: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
    ),
    time: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </svg>
    )
}

const iconWrapperStyles: Record<AccentColor, string> = {
    primary: 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-500/20',
    success: 'bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-emerald-500/20',
    warning: 'bg-gradient-to-br from-amber-500 to-amber-600 shadow-amber-500/20',
    error: 'bg-gradient-to-br from-red-500 to-red-600 shadow-red-500/20'
}

const accentColors: Record<AccentColor, string> = {
    primary: 'text-blue-500',
    success: 'text-emerald-500',
    warning: 'text-amber-500',
    error: 'text-red-500'
}

function SummaryCard({
    type = 'requests',
    label,
    value,
    change,
    changeDirection,
    accentColor = 'primary',
    format = 'number'
}: SummaryCardProps) {
    const formatValue = () => {
        switch (format) {
            case 'percent':
                return formatPercent(value)
            case 'time':
                return formatResponseTime(value)
            default:
                return formatNumber(value)
        }
    }

    const isPositiveChange = changeDirection === 'up' || (changeDirection === undefined && change !== null && change !== undefined && change > 0)
    const isNegativeChange = changeDirection === 'down' || (changeDirection === undefined && change !== null && change !== undefined && change < 0)

    // For response time, down is good (green), up is bad (red)
    // For others, up is good (green), down is bad (red)
    let badgeStyles = 'bg-slate-100 text-slate-600'
    if (type === 'time') {
        badgeStyles = isNegativeChange
            ? 'bg-emerald-50 text-emerald-600'
            : 'bg-red-50 text-red-600'
    } else {
        badgeStyles = isPositiveChange
            ? 'bg-emerald-50 text-emerald-600'
            : 'bg-red-50 text-red-600'
    }

    return (
        <div className={`bg-white rounded-2xl p-6 flex flex-col items-start justify-between shadow-sm border border-slate-100 transition-all duration-300 h-full relative overflow-hidden hover:-translate-y-1 hover:shadow-lg hover:border-slate-300 ${accentColors[accentColor]}`}>
            {/* Background decoration circle */}
            <div
                className="absolute -top-5 -right-5 w-24 h-24 rounded-full opacity-5"
                style={{ backgroundColor: 'currentColor' }}
            />

            <div className="flex items-center justify-between w-full mb-4 z-10">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg ${iconWrapperStyles[accentColor]}`}>
                    {iconMap[type]}
                </div>
                {change !== null && change !== undefined && (
                    <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${badgeStyles}`}>
                        {change > 0 ? '\u2191' : '\u2193'} {Math.abs(change).toFixed(1)}%
                    </div>
                )}
            </div>

            <div className="flex flex-col items-start gap-1 z-10">
                <h3 className="text-sm font-medium text-slate-500">{label}</h3>
                <div className="text-3xl font-bold text-slate-900 leading-tight tracking-tight">
                    {formatValue()}
                </div>
            </div>
        </div>
    )
}

export default SummaryCard
