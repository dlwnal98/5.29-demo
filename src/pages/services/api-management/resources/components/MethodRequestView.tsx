import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ChevronLeft, ChevronRight, Copy } from 'lucide-react';
import type { Method, QueryParameter, RequestHeader } from '@/types/resource';
import { getAPIKeyDetail } from '@/apis/api-keys.api';
import { toast } from 'sonner';

interface MethodRequestViewProps {
  selectedMethod: Method;
  queryParameters: QueryParameter[];
  requestHeaders: RequestHeader[];
  modelId: string;
}

const ITEMS_PER_PAGE = 5;

export function MethodRequestView({
  selectedMethod,
  queryParameters,
  requestHeaders,
  modelId,
}: MethodRequestViewProps) {
  const [queryPage, setQueryPage] = useState(1);
  const [headerPage, setHeaderPage] = useState(1);

  // 쿼리 파라미터 페이징
  const queryTotalPages = Math.ceil(queryParameters.length / ITEMS_PER_PAGE);
  const paginatedQueryParams = queryParameters.slice(
    (queryPage - 1) * ITEMS_PER_PAGE,
    queryPage * ITEMS_PER_PAGE
  );

  // 요청 헤더 페이징
  const headerTotalPages = Math.ceil(requestHeaders.length / ITEMS_PER_PAGE);
  const paginatedHeaders = requestHeaders.slice(
    (headerPage - 1) * ITEMS_PER_PAGE,
    headerPage * ITEMS_PER_PAGE
  );

  const convertValidator = (data: string) => {
    switch (data) {
      case 'ALL':
        return 'All elements validation';
      case 'BODY_ONLY':
        return 'Body only validation';
      case 'NONE':
        return 'No validation';
      case 'PARAMS_ONLY':
        return 'Parameters only validation';
      default:
        return '';
    }
  };

  console.log(selectedMethod)

  const copyToClipboard = async (apiKeyId?: string) => {
    if (!apiKeyId) return;
    const res = await getAPIKeyDetail(apiKeyId);
    navigator.clipboard.writeText(res.keyValue);
    toast.success('API Key 값이 복사되었습니다.');
  };

  return (
    <>
      {/* Method Request Settings */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Method 요청 설정</h3>
        </div>
        <div>
          <div className="border-b pb-2 mb-2 grid grid-cols-5 gap-6">
            <div className="col-span-1">
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground dark:text-gray-300">
                    필수 여부
                  </Label>
                </div>
              </div>
            </div>
            <div className="col-span-2">
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground dark:text-gray-300">
                    API Key ID

                  </Label>
                </div>
              </div>
            </div>
            <div className="col-span-2">
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground dark:text-gray-300">
                    요청 검사기
                  </Label>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-5 gap-6">
            <div className="col-span-1">
              <div className="space-y-3">
                <div>
                  <div className="mt-1 text-sm text-gray-900 dark:text-white">
                    {selectedMethod?.info['x-api-key-required'] ? (
                      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">필수</Badge>
                    ) : (
                      <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
                        선택
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-2">
              <div className="space-y-3">
                <div>
                  <div className="mt-1 text-sm text-gray-900 dark:text-white">
                    {selectedMethod?.info['x-api-key-id'] || '없음'}
                    {selectedMethod?.info['x-api-key-id'] && (
                      <button className="ml-2" onClick={() => copyToClipboard(selectedMethod?.info['x-api-key-id'] || '')}>
                        <Copy className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-2">
              <div className="space-y-3">
                <div>
                  <div className="mt-1 text-sm text-gray-900 dark:text-white">
                    {convertValidator(selectedMethod?.info['x-request-validator']) || '없음'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* URL Query String Parameters */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-md font-semibold text-gray-900 dark:text-white">
            URL 쿼리 스트링 파라미터 ({queryParameters.length})
          </h4>
          {queryParameters.length > ITEMS_PER_PAGE && (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setQueryPage((prev) => Math.max(prev - 1, 1))}
                disabled={queryPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[60px] text-center">
                {queryPage} / {queryTotalPages}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setQueryPage((prev) => Math.min(prev + 1, queryTotalPages))}
                disabled={queryPage === queryTotalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        {queryParameters.length > 0 ? (
          <div className="rounded-md border bg-white dark:bg-gray-800">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80%]">이름</TableHead>
                  <TableHead className="w-[20%] text-center">필수 여부</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedQueryParams.map((param) => (
                  <TableRow key={param.id}>
                    <TableCell className="font-medium">{param.name}</TableCell>
                    <TableCell className="text-center">
                      {param.required ? (
                        <Badge className="bg-red-100 text-red-800 hover:bg-red-100">필수</Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">선택</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-500 dark:text-gray-400 mb-2">쿼리 스트링 파라미터 없음</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              쿼리 스트링 파라미터 정의 없음
            </p>
          </div>
        )}
      </div>

      {/* HTTP Request Headers */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-md font-semibold text-gray-900 dark:text-white">
            HTTP 요청 헤더 ({requestHeaders.length})
          </h4>
          {requestHeaders.length > ITEMS_PER_PAGE && (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setHeaderPage((prev) => Math.max(prev - 1, 1))}
                disabled={headerPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[60px] text-center">
                {headerPage} / {headerTotalPages}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setHeaderPage((prev) => Math.min(prev + 1, headerTotalPages))}
                disabled={headerPage === headerTotalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        {requestHeaders.length > 0 ? (
          <div className="rounded-md border bg-white dark:bg-gray-800">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80%]">이름</TableHead>
                  <TableHead className="w-[20%] text-center">필수 여부</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedHeaders.map((header) => (
                  <TableRow key={header.id}>
                    <TableCell className="font-medium">{header.name}</TableCell>
                    <TableCell className="text-center">
                      {header.required ? (
                        <Badge className="bg-red-100 text-red-800 hover:bg-red-100">필수</Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">선택</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-500 dark:text-gray-400 mb-2">요청 헤더 없음</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">요청 헤더 정의 없음</p>
          </div>
        )}
      </div>

      {/* Request Body */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-md font-semibold text-gray-900 dark:text-white">요청 바디</h4>
        </div>
        {modelId ? (
          <div className="rounded-md border bg-white dark:bg-gray-800">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50%]">ID</TableHead>
                  <TableHead className="w-[50%] text-center">콘텐츠 유형</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">{modelId || 'Empty'}</TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400 text-center">application/json</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-500 dark:text-gray-400 mb-2">요청 바디 없음</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">요청 바디 정의 없음</p>
          </div>
        )}
      </div>
    </>
  );
}
