import { useState, useMemo, ReactNode } from 'react'
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    flexRender,
    SortingState,
    ColumnDef
} from '@tanstack/react-table'
import { formatTime, getMethodColor, getStatusColor, truncate } from '@/libs/formatters'
import { LogEntry } from '../hooks/useUsageDashboard'

interface RequestLogsTableProps {
    data?: LogEntry[]
    totalElements?: number
    totalPages?: number
    currentPage?: number
    pageSize?: number
    onPageChange?: (page: number) => void
    isLoading?: boolean
}

const methodColors: Record<string, string> = {
    get: 'bg-blue-100 text-blue-700',
    post: 'bg-emerald-100 text-emerald-700',
    put: 'bg-amber-100 text-amber-700',
    delete: 'bg-red-100 text-red-700',
    patch: 'bg-purple-100 text-purple-700',
    default: 'bg-slate-100 text-slate-700'
}

const statusColors: Record<string, string> = {
    success: 'bg-emerald-50 text-emerald-600',
    info: 'bg-blue-50 text-blue-600',
    warning: 'bg-amber-50 text-amber-600',
    error: 'bg-red-50 text-red-600',
    default: 'bg-slate-50 text-slate-600'
}

function RequestLogsTable({
    data = [],
    totalElements = 0,
    totalPages = 1,
    currentPage = 0,
    pageSize = 10,
    onPageChange,
    isLoading = false
}: RequestLogsTableProps) {
    const [sorting, setSorting] = useState<SortingState>([])

    const columns: ColumnDef<LogEntry>[] = useMemo(() => [
        {
            accessorKey: 'timestamp',
            header: '시간',
            cell: ({ getValue }) => (
                <span className="text-slate-400 font-mono text-xs">
                    {formatTime(getValue() as string)}
                </span>
            ),
            size: 80,
        },
        {
            accessorKey: 'apiId',
            header: 'API',
            cell: ({ getValue }) => (
                <span className="font-medium text-slate-900">{getValue() as string}</span>
            ),
            size: 100,
        },
        {
            accessorKey: 'resourcePath',
            header: '경로',
            cell: ({ getValue }) => (
                <span className="font-mono text-slate-600 text-[0.8125rem]" title={getValue() as string}>
                    {truncate(getValue() as string, 25)}
                </span>
            ),
            size: 150,
        },
        {
            accessorKey: 'httpMethod',
            header: '메서드',
            cell: ({ getValue }) => {
                const method = getValue() as string
                const colorClass = methodColors[getMethodColor(method)] || methodColors.default
                return (
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${colorClass}`}>
                        {method}
                    </span>
                )
            },
            size: 80,
        },
        {
            accessorKey: 'statusCode',
            header: '상태',
            cell: ({ getValue }) => {
                const status = getValue() as number
                const statusType = getStatusColor(status)
                const colorClass = statusColors[statusType] || statusColors.default
                return (
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${colorClass}`}>
                        {status >= 200 && status < 300 && '\u2713 '}
                        {status >= 400 && '\u2717 '}
                        {status}
                    </span>
                )
            },
            size: 80,
        },
        {
            accessorKey: 'responseTimeMs',
            header: '응답시간',
            cell: ({ getValue }) => {
                const ms = getValue() as number
                let colorClass = 'text-emerald-500'
                let barColorClass = 'bg-emerald-500'
                if (ms >= 500) {
                    colorClass = 'text-red-500'
                    barColorClass = 'bg-red-500'
                } else if (ms >= 200) {
                    colorClass = 'text-amber-500'
                    barColorClass = 'bg-amber-500'
                }

                return (
                    <div className="flex flex-col gap-1">
                        <span className={`font-mono font-medium ${colorClass}`}>
                            {ms}ms
                        </span>
                        <div className="h-1 bg-slate-100 rounded-full overflow-hidden w-20">
                            <div
                                className={`h-full rounded-full transition-all duration-300 ${barColorClass}`}
                                style={{ width: `${Math.min(ms / 10, 100)}%` }}
                            />
                        </div>
                    </div>
                )
            },
            size: 120,
        },
        {
            accessorKey: 'clientIp',
            header: '클라이언트',
            cell: ({ getValue }) => (
                <span className="font-mono text-slate-400 text-xs">
                    {truncate(getValue() as string, 15)}
                </span>
            ),
            size: 120,
        },
    ], [])

    const table = useReactTable({
        data,
        columns,
        state: { sorting },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        manualPagination: true,
        pageCount: totalPages,
    })

    const handlePrevPage = () => {
        if (currentPage > 0 && onPageChange) {
            onPageChange(currentPage - 1)
        }
    }

    const handleNextPage = () => {
        if (currentPage < totalPages - 1 && onPageChange) {
            onPageChange(currentPage + 1)
        }
    }

    const renderPageNumbers = () => {
        const pages: ReactNode[] = []
        const maxVisible = 5
        let start = Math.max(0, currentPage - Math.floor(maxVisible / 2))
        let end = Math.min(totalPages, start + maxVisible)

        if (end - start < maxVisible) {
            start = Math.max(0, end - maxVisible)
        }

        if (start > 0) {
            pages.push(
                <button
                    key={0}
                    className="min-w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium text-slate-600 bg-transparent border border-transparent cursor-pointer transition-all duration-150 hover:bg-slate-100 hover:text-slate-900 hover:border-slate-200"
                    onClick={() => onPageChange?.(0)}
                >
                    1
                </button>
            )
            if (start > 1) {
                pages.push(<span key="start-ellipsis" className="text-slate-400 px-1">...</span>)
            }
        }

        for (let i = start; i < end; i++) {
            pages.push(
                <button
                    key={i}
                    className={`min-w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium cursor-pointer transition-all duration-150 ${
                        i === currentPage
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'text-slate-600 bg-transparent border border-transparent hover:bg-slate-100 hover:text-slate-900 hover:border-slate-200'
                    }`}
                    onClick={() => onPageChange?.(i)}
                >
                    {i + 1}
                </button>
            )
        }

        if (end < totalPages) {
            if (end < totalPages - 1) {
                pages.push(<span key="end-ellipsis" className="text-slate-400 px-1">...</span>)
            }
            pages.push(
                <button
                    key={totalPages - 1}
                    className="min-w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium text-slate-600 bg-transparent border border-transparent cursor-pointer transition-all duration-150 hover:bg-slate-100 hover:text-slate-900 hover:border-slate-200"
                    onClick={() => onPageChange?.(totalPages - 1)}
                >
                    {totalPages}
                </button>
            )
        }

        return pages
    }

    return (
        <div className="w-full">
            <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
                <table className="w-full border-collapse text-sm">
                    <thead>
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th
                                        key={header.id}
                                        style={{ width: header.getSize() }}
                                        onClick={header.column.getToggleSortingHandler()}
                                        className={`p-4 text-left border-b border-slate-200 bg-slate-50 font-semibold text-slate-600 uppercase text-xs tracking-wider sticky top-0 z-10 whitespace-nowrap ${
                                            header.column.getCanSort() ? 'cursor-pointer select-none hover:text-slate-900 hover:bg-slate-100' : ''
                                        }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                            {header.column.getIsSorted() && (
                                                <span className="text-blue-500">
                                                    {header.column.getIsSorted() === 'asc' ? '\u2191' : '\u2193'}
                                                </span>
                                            )}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={columns.length} className="text-center p-12 text-slate-400">
                                    <div className="w-6 h-6 border-3 border-slate-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-2" />
                                    로딩 중...
                                </td>
                            </tr>
                        ) : data.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="text-center p-12 text-slate-400">
                                    데이터가 없습니다
                                </td>
                            </tr>
                        ) : (
                            table.getRowModel().rows.map(row => (
                                <tr key={row.id} className="transition-colors duration-150 hover:bg-slate-50">
                                    {row.getVisibleCells().map(cell => (
                                        <td key={cell.id} className="p-4 border-b border-slate-200 whitespace-nowrap last:border-b-0">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex items-center justify-between p-4 border-t border-slate-200 bg-white">
                <div className="text-sm text-slate-400">
                    전체 {totalElements.toLocaleString()}건 중 {currentPage * pageSize + 1}-
                    {Math.min((currentPage + 1) * pageSize, totalElements)}
                </div>
                <div className="flex items-center gap-1">
                    <button
                        className="min-w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium text-slate-600 bg-transparent border border-transparent cursor-pointer transition-all duration-150 hover:bg-slate-100 hover:text-slate-900 hover:border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handlePrevPage}
                        disabled={currentPage === 0}
                    >
                        &lt;
                    </button>
                    {renderPageNumbers()}
                    <button
                        className="min-w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium text-slate-600 bg-transparent border border-transparent cursor-pointer transition-all duration-150 hover:bg-slate-100 hover:text-slate-900 hover:border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleNextPage}
                        disabled={currentPage >= totalPages - 1}
                    >
                        &gt;
                    </button>
                </div>
            </div>
        </div>
    )
}

export default RequestLogsTable
