import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Plus, Trash2, Search } from "lucide-react";
import { ModelData } from "@/api/models.api";

interface ModelsPageViewProps {
    models: ModelData[];
    onOpenCreateModal: () => void;
    onOpenEditModal: (model: ModelData) => void;
    onOpenDeleteModal: (model: ModelData) => void;
}

export default function ModelsPageView({
    models,
    onOpenCreateModal,
    onOpenEditModal,
    onOpenDeleteModal,
}: ModelsPageViewProps) {
    return (
        <div className="space-y-6 container px-4 py-6">
            {/* Breadcrumb */}
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/services">Services</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/services/api-management">
                            API Management
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Models</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        Models
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        모델을 사용하여 API에서 사용하는 다양한 요청 및 응답의 본문 형식을
                        정의합니다.
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        onClick={onOpenCreateModal}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        모델 생성
                    </Button>
                </div>
            </div>

            {/* Models Table */}
            <Card className="dark:border-gray-700">
                <div className="pt-4"></div>
                <CardContent>
                    <Table>
                        <TableHeader className="hover:bg-white dark:hover:bg-gray-800 dark:border-gray-700">
                            <TableRow className="hover:bg-white dark:hover:bg-gray-800 dark:border-gray-700">
                                <TableHead className="text-center w-[10%]">ID</TableHead>
                                <TableHead>이름</TableHead>
                                <TableHead>설명</TableHead>
                                <TableHead className="text-center w-[8%]">작업</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="[&_tr:nth-last-child(2)]:border-0">
                            {models.length > 0 ? (
                                models.map((model) => (
                                    <TableRow key={model.modelId}>
                                        <TableCell>
                                            <span className="font-mono font-medium text-blue-600">
                                                {model.modelId}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-medium">{model.modelName}</span>
                                        </TableCell>
                                        <TableCell className="max-w-md">
                                            <span className="text-gray-600 dark:text-gray-400 truncate block">
                                                {model.description}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center justify-end space-x-1">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onOpenEditModal(model);
                                                    }}
                                                    className="h-8 w-8 p-0"
                                                >
                                                    <Search className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onOpenDeleteModal(model);
                                                    }}
                                                    className="h-8 w-8 p-0 text-red-600 bg-white hover:text-red-700 hover:bg-red-50 border-red-200 dark:bg-gray-800 dark:hover:bg-red-900/20"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={4}
                                        className="text-center py-8 text-gray-500 dark:text-gray-400"
                                    >
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
