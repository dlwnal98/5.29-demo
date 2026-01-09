import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { Plus, Search, Settings, Trash2 } from "lucide-react";
import CommonPagination from "@/components/CommonPagination";
import { APIListData } from "@/hooks/use-apimanagement";
import { Dispatch, SetStateAction } from "react";

interface ApiManagementPageViewProps {
  searchTerm: string;
  filteredPlans: APIListData[];
  currentPage: number;
  totalPages: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  onApiClick: (api: APIListData) => void;
  onSearchTermChange: (term: string) => void;
  onOpenCreateModal: () => void;
  onOpenModifyModal: (api: APIListData) => void;
  onOpenDeleteModal: (api: APIListData) => void;
}

export default function ApiManagementPageView({
  searchTerm,
  filteredPlans,
  currentPage,
  totalPages,
  setCurrentPage,
  onApiClick,
  onSearchTermChange,
  onOpenCreateModal,
  onOpenModifyModal,
  onOpenDeleteModal,
}: ApiManagementPageViewProps) {
  return (
    <div className="space-y-6 container px-4 py-6 mx-auto">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/services/api-management">Services</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>API Management</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            APIs
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            API 계획을 관리하고 배포하세요.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="검색어를 입력하세요."
              value={searchTerm}
              onChange={(e) => onSearchTermChange(e.target.value)}
              className="pl-10"
            />
          </div>

          <Button
            onClick={onOpenCreateModal}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
          >
            <Plus className="h-4 w-4" />
            API 생성
          </Button>
        </div>
      </div>

      {/* API List */}
      <Card className="dark:border-gray-700">
        <div className="pt-4"></div>
        <CardContent>
          <Table>
            <TableHeader className="hover:bg-white dark:hover:bg-transparent">
              <TableRow className="hover:bg-white dark:hover:bg-transparent dark:border-gray-700">
                <TableHead className="w-[10%]">ID</TableHead>
                <TableHead className="w-[25%]">이름</TableHead>
                <TableHead className="w-auto">설명</TableHead>
                <TableHead className="w-[10%]">수정일자</TableHead>
                <TableHead className="w-[8%] text-center">작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPlans?.length > 0 ? (
                filteredPlans?.map((plan) => (
                  <TableRow
                    key={plan.apiId}
                    onClick={() => onApiClick(plan)}
                    className="hover:cursor-pointer dark:hover:bg-gradient-to-r dark:hover:from-gray-700 dark:hover:to-gray-600 "
                  >
                    <TableCell className="font-mono text-sm text-blue-600">
                      {plan.apiId}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium hover:cursor-pointer">
                          {plan.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {plan.description}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {plan.updatedAt
                        ? new Date(plan.updatedAt).toLocaleDateString()
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          className="text-white hover:text-white bg-slate-500 hover:bg-slate-500"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenModifyModal(plan);
                          }}
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="hover:bg-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenDeleteModal(plan);
                          }}
                        >
                          <Trash2 />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-gray-500"
                  >
                    검색 결과가 없습니다.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <CommonPagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
          groupSize={5}
        />
      )}
    </div>
  );
}
