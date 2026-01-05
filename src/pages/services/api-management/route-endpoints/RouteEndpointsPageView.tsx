import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { EndpointsData } from '@/api/routeEndpoints.api';

interface RouteEndpointsPageViewProps {
    searchTerm: string;
    filteredEndpoints: EndpointsData[];
    onSearchTermChange: (value: string) => void;
    onCreate: () => void;
    onEdit: (endpoint: EndpointsData) => void;
    onDelete: (endpoint: EndpointsData) => void;
}

export default function RouteEndpointsPageView({
    searchTerm,
    filteredEndpoints,
    onSearchTermChange,
    onCreate,
    onEdit,
    onDelete,
}: RouteEndpointsPageViewProps) {
    return (
        <div className="container mx-auto px-4 py-6 space-y-6">
            {/* Breadcrumb */}
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/services">Services</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/services/api-management">API Management</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Route Endpoints</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            {/* 페이지 헤더 */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Route Endpoints</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">API 대상 Route Endpoint를 관리하세요.</p>
                </div>

                <div className="flex gap-2">
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            placeholder="Enpoint 검색..."
                            value={searchTerm}
                            onChange={(e) => onSearchTermChange(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    <Button
                        onClick={onCreate}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
                    >
                        <Plus className="h-4 w-4" />
                        Endpoint 생성
                    </Button>
                </div>
            </div>

            {/* Target Endpoints 리스트 */}
            <Card className='dark:border-gray-700'>
                <div className="pt-4"></div>
                <CardContent>
                    <Table>
                        <TableHeader className="hover:bg-white dark:hover:bg-transparent dark:border-gray-700">
                            <TableRow className="hover:bg-white dark:hover:bg-transparent dark:border-gray-700">
                                <TableHead className="w-[10%]">ID</TableHead>
                                <TableHead className="w-[30%]">URL</TableHead>
                                <TableHead>설명</TableHead>
                                <TableHead className="w-[10%]">생성일자</TableHead>
                                <TableHead className="w-[8%] text-center">수정</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredEndpoints?.length > 0 ? (
                                filteredEndpoints.map((endpoint) => (
                                    <TableRow key={endpoint.targetId} className="hover:bg-white dark:hover:bg-transparent dark:border-gray-700">
                                        <TableCell className="font-medium text-blue-600">
                                            {endpoint.targetId}
                                        </TableCell>
                                        <TableCell className="font-mono text-sm">
                                            {endpoint.routeEndpoint}
                                        </TableCell>
                                        <TableCell>{endpoint.description}</TableCell>
                                        <TableCell>
                                            {new Date(endpoint.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex gap-2 justify-end">
                                                <Button
                                                    className="text-white hover:text-white bg-slate-500 hover:bg-slate-500"
                                                    size="sm"
                                                    onClick={() => onEdit(endpoint)}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => onDelete(endpoint)}
                                                    className="bg-destructive"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow className="hover:bg-white dark:hover:bg-gray-800">
                                    <TableCell colSpan={6} className="text-center py-8 text-gray-500 dark:text-gray-400">
                                        검색 결과가 없습니다.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
