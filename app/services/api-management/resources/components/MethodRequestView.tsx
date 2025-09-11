import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Edit, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Method, QueryParameter, RequestHeader, RequestBodyModel } from '@/types/resource';

interface MethodRequestViewProps {
  selectedMethod: Method;
  queryParameters: QueryParameter[];
  requestHeaders: RequestHeader[];
  requestBodyModels: RequestBodyModel[];
  handleEditMethod: () => void;
}

export function MethodRequestView({
  selectedMethod,
  queryParameters,
  requestHeaders,
  requestBodyModels,
  handleEditMethod,
}: MethodRequestViewProps) {
  console.log(selectedMethod);

  return (
    <>
      {/* Method Request Settings */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">메서드 요청 설정</h3>
          <Button variant="outline" size="sm" onClick={handleEditMethod}>
            <Edit className="h-4 w-4 mr-2" />
            편집
          </Button>
        </div>
        <div>
          <div className="border-b pb-2 grid grid-cols-5 gap-6">
            <div className="col-span-1">
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    API 키 등록 여부
                  </Label>
                </div>
              </div>
            </div>
            <div className="col-span-2">
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    API 키 ID
                  </Label>
                </div>
              </div>
            </div>
            <div className="col-span-2">
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
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
                    {selectedMethod?.info['x-api-key-required'] ? 'True' : 'False'}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-2">
              <div className="space-y-3">
                <div>
                  <div className="mt-1 text-sm text-gray-900 dark:text-white">
                    {selectedMethod?.info['x-api-key-id']}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-2">
              <div className="space-y-3">
                <div>
                  <div className="mt-1 text-sm text-gray-900 dark:text-white">
                    {selectedMethod.requestValidator || '없음'}
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
            URL 쿼리 문자열 파라미터 ({queryParameters.length})
          </h4>
          <div className="flex items-center gap-2">
            <ChevronLeft className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">1</span>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </div>
        </div>
        {queryParameters.length > 0 ? (
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-4 text-sm font-medium text-gray-600 dark:text-gray-400 border-b pb-2">
              <div className="col-span-2">이름</div>
              <div className="col-span-1">필수</div>
            </div>
            {queryParameters.map((param) => (
              <div
                key={param.id}
                className="grid grid-cols-3 gap-4 p-3 bg-white dark:bg-gray-800 rounded border">
                <div className="font-medium col-span-2">{param.name}</div>
                <div className="text-sm col-span-1">
                  {param.required ? (
                    <Badge className="bg-red-100 text-red-800 hover:bg-red-100">True</Badge>
                  ) : (
                    <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">False</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-500 dark:text-gray-400 mb-2">요청 쿼리 문자열 없음</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              정의된 요청 쿼리 문자열이 없습니다
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
          <div className="flex items-center gap-2">
            <ChevronLeft className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">1</span>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="grid grid-cols-3 gap-4 text-sm font-medium text-gray-600 dark:text-gray-400 border-b pb-2">
            <div className="col-span-2">이름</div>
            <div className="col-span-1">필수</div>
          </div>
          {requestHeaders.length > 0 ? (
            <>
              {requestHeaders.map((header) => (
                <div
                  key={header.id}
                  className="grid grid-cols-3 gap-4 p-3 bg-white dark:bg-gray-800 rounded border">
                  <div className="font-medium col-span-2">{header.name}</div>
                  <div className="text-sm col-span-1">
                    {header.required ? (
                      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">True</Badge>
                    ) : (
                      <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">False</Badge>
                    )}
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-500 dark:text-gray-400 mb-2">요청 헤더 없음</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                정의된 요청 헤더가 없습니다
              </p>
            </div>
          )}
        </div>
      </div>
      {/* Request Body */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-md font-semibold text-gray-900 dark:text-white">
            요청 본문 ({requestBodyModels.length})
          </h4>
          <div className="flex items-center gap-2">
            <ChevronLeft className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">1</span>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </div>
        </div>
        {requestBodyModels.length > 0 ? (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-4 text-sm font-medium text-gray-600 dark:text-gray-400 border-b pb-2">
              <div>콘텐츠 유형</div>
              <div>이름</div>
            </div>
            {requestBodyModels.map((model) => (
              <div
                key={model.id}
                className="grid grid-cols-2 gap-4 p-3 bg-white dark:bg-gray-800 rounded border">
                <div className="font-medium">{model.contentType}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {model.modelName || 'Empty'}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-500 dark:text-gray-400 mb-2">요청 본문 없음</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">정의된 요청 본문이 없습니다</p>
          </div>
        )}
      </div>
    </>
  );
}
