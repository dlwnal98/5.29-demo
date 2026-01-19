import { format, formatDistanceToNow, parseISO } from 'date-fns'
import { ko } from 'date-fns/locale'

/**
 * Format large numbers with K, M, B suffixes
 */
export function formatNumber(num, decimals = 1) {
    if (num === null || num === undefined) return '-'

    if (num >= 1000000000) {
        return (num / 1000000000).toFixed(decimals) + 'B'
    }
    if (num >= 1000000) {
        return (num / 1000000).toFixed(decimals) + 'M'
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(decimals) + 'K'
    }
    return num.toLocaleString()
}

/**
 * Format number with comma separators
 */
export function formatNumberWithCommas(num) {
    if (num === null || num === undefined) return '-'
    return num.toLocaleString('ko-KR')
}

/**
 * Format percentage
 */
export function formatPercent(value, decimals = 2) {
    if (value === null || value === undefined) return '-'
    return value.toFixed(decimals) + '%'
}

/**
 * Format response time in ms
 */
export function formatResponseTime(ms) {
    if (ms === null || ms === undefined) return '-'
    if (ms >= 1000) {
        return (ms / 1000).toFixed(2) + 's'
    }
    return Math.round(ms) + 'ms'
}

/**
 * Format timestamp to time only (HH:mm:ss)
 */
export function formatTime(timestamp) {
    if (!timestamp) return '-'
    try {
        const date = typeof timestamp === 'string' ? parseISO(timestamp) : timestamp
        return format(date, 'HH:mm:ss')
    } catch {
        return '-'
    }
}

/**
 * Format timestamp to date and time
 */
export function formatDateTime(timestamp) {
    if (!timestamp) return '-'
    try {
        const date = typeof timestamp === 'string' ? parseISO(timestamp) : timestamp
        return format(date, 'yyyy-MM-dd HH:mm:ss')
    } catch {
        return '-'
    }
}

/**
 * Format timestamp for chart axis (HH:mm)
 */
export function formatChartTime(timestamp) {
    if (!timestamp) return ''
    try {
        const date = typeof timestamp === 'string' ? parseISO(timestamp) : timestamp
        return format(date, 'HH:mm')
    } catch {
        return ''
    }
}

/**
 * Format relative time (e.g., "2분 전")
 */
export function formatRelativeTime(timestamp) {
    if (!timestamp) return '-'
    try {
        const date = typeof timestamp === 'string' ? parseISO(timestamp) : timestamp
        return formatDistanceToNow(date, { addSuffix: true, locale: ko })
    } catch {
        return '-'
    }
}

/**
 * Calculate percentage change between two values
 */
export function calculateChange(current, previous) {
    if (!previous || previous === 0) return null
    return ((current - previous) / previous) * 100
}

/**
 * Format change value for display
 */
export function formatChange(change) {
    if (change === null || change === undefined) return null
    const prefix = change >= 0 ? '↑' : '↓'
    const absChange = Math.abs(change).toFixed(1)
    return `${prefix} ${absChange}%`
}

/**
 * Get status code color class
 */
export function getStatusColor(statusCode) {
    if (statusCode >= 200 && statusCode < 300) return 'success'
    if (statusCode >= 300 && statusCode < 400) return 'info'
    if (statusCode >= 400 && statusCode < 500) return 'warning'
    if (statusCode >= 500) return 'error'
    return 'default'
}

/**
 * Get HTTP method color class
 */
export function getMethodColor(method) {
    const methodColors = {
        GET: 'get',
        POST: 'post',
        PUT: 'put',
        DELETE: 'delete',
        PATCH: 'patch'
    }
    return methodColors[method?.toUpperCase()] || 'default'
}

/**
 * Get response time status based on thresholds
 */
export function getResponseTimeStatus(ms) {
    if (ms < 100) return 'excellent'
    if (ms < 300) return 'good'
    if (ms < 1000) return 'warning'
    return 'critical'
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text, maxLength = 20) {
    if (!text) return ''
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
}

/**
 * Format bytes to human readable size
 */
export function formatBytes(bytes) {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
