import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Plus, RefreshCw, Search, Edit, Trash2, Copy } from "lucide-react";
import CommonPagination from "@/components/common-pagination";
import { ApiKey } from "@/hooks/use-apiKeys";
import React from "react";

interface ApiKeysPageViewProps {
  currentApiKeys: ApiKey[];
  searchTerm: string;
  currentPage: number;
  totalPages: number;
  onSearchTermChange: (value: string) => void;
  onPageChange: React.Dispatch<React.SetStateAction<number>>;
  onRefresh: () => void;
  onCreateClick: () => void;
  onEdit: (apiKey: ApiKey) => void;
  onDelete: (apiKey: ApiKey) => void;
  onCopy: (apiKeyName: string, apiKey: string) => void;
}

export default function ApiKeysPageView({
  currentApiKeys,
  searchTerm,
  currentPage,
  totalPages,
  onSearchTermChange,
  onPageChange,
  onRefresh,
  onCreateClick,
  onEdit,
  onDelete,
  onCopy,
}: ApiKeysPageViewProps) {
  return (
    <div className="container mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/vpc">VPC</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/infra-packages/gateway">API Gateway</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>API Keys</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div className="gap-2">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">API Keys</h1>
          <p className="text-gray-600 mt-1">API Key들을 관리하세요</p>
        </div>
        <div className="flex items-center gap-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="API Key 이름"
                  value={searchTerm}
                  onChange={(e) => onSearchTermChange(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </div>
          <Button variant="outline" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button
            onClick={onCreateClick}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
          >
            <Plus className="h-4 w-4 mr-2" />
            API Key 생성
          </Button>
        </div>
      </div>

      {/* API Keys 리스트 */}
      <Card className="mb-4">
        <div className="pt-4"></div>
        <CardContent>
          <Table>
            <TableHeader className="hover:bg-white">
              <TableRow className="hover:bg-white">
                <TableHead className="w-[10%]">ID</TableHead>
                <TableHead className="w-[30%]">이름</TableHead>
                <TableHead className="w-[auto]">설명</TableHead>
                <TableHead className="w-[10%]">생성일자</TableHead>
                <TableHead className="text-center w-[8%]">작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentApiKeys?.length === 0 ? (
                <TableRow className="dark:bg-blue-900/20 hover:bg-white">
                  <TableCell colSpan={5} className="text-center !py-8 text-gray-500">
                    생성된 API Key가 존재하지 않습니다.
                  </TableCell>
                </TableRow>
              ) : (
                currentApiKeys?.map((apiKey) => (
                  <TableRow
                    key={apiKey.keyId}
                    className="dark:bg-blue-900/20 hover:bg-white"
                  >
                    <TableCell className="font-medium text-blue-600">
                      {apiKey.keyId}
                    </TableCell>
                    <TableCell className="font-medium">{apiKey.name}</TableCell>
                    <TableCell>{apiKey.description}</TableCell>
                    <TableCell>
                      {apiKey.createdAt
                        ? new Date(apiKey.createdAt).toLocaleDateString()
                        : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          className="text-white hover:text-white bg-amber-500 hover:bg-amber-500"
                          size="sm"
                          onClick={() => onCopy(apiKey.name, apiKey.key)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          className="text-white hover:text-white bg-slate-500 hover:bg-slate-500"
                          size="sm"
                          onClick={() => onEdit(apiKey)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => onDelete(apiKey)}
                          className="hover:bg-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <CommonPagination
          currentPage={currentPage}
          setCurrentPage={onPageChange}
          totalPages={totalPages}
          groupSize={5}
        />
      )}
    </div>
  );
}
