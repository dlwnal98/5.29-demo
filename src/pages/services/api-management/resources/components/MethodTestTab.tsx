import { useState, useEffect, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Play, RotateCcw } from 'lucide-react';
import { Code } from 'lucide-react';

interface MethodTestTabProps {
  selectedMethod: any;
  handleTest: (requestBody: any) => void;
  isTestLoading: boolean;
  testResponse: any;
}

export function MethodTestTab({
  selectedMethod,
  handleTest,
  isTestLoading,
  testResponse,
}: MethodTestTabProps) {


  // 파라미터 개수 계산
  const queryParams = selectedMethod.parameters?.filter((p: any) => p.in === 'query') || [];
  const pathParams = selectedMethod.parameters?.filter((p: any) => p.in === 'path') || [];


  // GET은 query/path 파라미터만, POST, PUT은 body 포함 가능
  const methodsWithBody = ['POST', 'PUT'];
  const methodsWithParamsOnly = ['GET'];

  // 기본 요청 예시 생성
  const getDefaultRequestBody = useMemo(() => {
    // GET: queryParameters 또는 pathParameters만 사용
    if (methodsWithParamsOnly.includes(selectedMethod.type)) {
      if (queryParams.length > 0) {
        const queryExample: Record<string, string> = {};
        queryParams.forEach((param: any) => {
          queryExample[param.name] = param.schema?.example || (param.schema?.type === 'integer' ? '0' : 'value');
        });
        return JSON.stringify({ queryParameters: queryExample }, null, 2);
      } else if (pathParams.length > 0) {
        const pathExample: Record<string, string> = {};
        pathParams.forEach((param: any) => {
          pathExample[param.name] = param.schema?.example || '123';
        });
        return JSON.stringify({ pathParameters: pathExample }, null, 2);
      }
      return JSON.stringify({ queryParameters: { page: '0', size: '20' } }, null, 2);
    }

    // POST, PUT: headers와 body 사용
    if (methodsWithBody.includes(selectedMethod.type)) {
      return JSON.stringify({
        headers: {
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
        },
        body: '{"name": "John Doe", "email": "john@example.com"}'
      }, null, 2);
    }

    return '{}';
  }, [selectedMethod.type, queryParams, pathParams]);

  // 편집 가능한 요청 본문 상태
  const [requestBodyText, setRequestBodyText] = useState(getDefaultRequestBody);

  // 메서드 변경 시 기본값으로 리셋
  useEffect(() => {
    setRequestBodyText(getDefaultRequestBody);
  }, [selectedMethod?.info?.['x-method-id'], getDefaultRequestBody]);

  // 기본값으로 리셋하는 함수
  const handleResetRequestBody = () => {
    setRequestBodyText(getDefaultRequestBody);
  };

  // Send 버튼 클릭 시 요청 본문 파싱하여 전달
  const handleSendTest = () => {
    try {
      const parsedBody = JSON.parse(requestBodyText);
      handleTest(parsedBody);
    } catch (error) {
      // JSON 파싱 실패 시 문자열 그대로 전달
      handleTest(requestBodyText);
    }
  };

  return (
    <div className="space-y-6">
      {/* Request Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 !text-lg font-bold">요청 설정</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Method and URL */}
          <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <span
              className={`px-3 py-1 rounded text-sm font-mono font-bold ${selectedMethod.type === 'GET'
                ? 'bg-green-100 text-green-800'
                : selectedMethod.type === 'POST'
                  ? 'bg-blue-100 text-blue-800'
                  : selectedMethod.type === 'PUT'
                    ? 'bg-yellow-100 text-yellow-800'
                    : selectedMethod.type === 'DELETE'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                }`}>
              {selectedMethod.type}
            </span>
            <code className="flex-1 text-sm bg-white dark:bg-gray-700 px-3 py-2 rounded border">
              {`/api/v1/invoke/${selectedMethod?.info['x-method-id']}`}
            </code>
            <Button
              className="bg-orange-500 hover:bg-orange-600 text-white px-6"
              onClick={handleSendTest}
              disabled={isTestLoading}>
              {isTestLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  테스트 중...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  API 요청
                </>
              )}
            </Button>
          </div>



          {/* Request Body Section */}
          <div className="">
            <div className="flex items-center justify-between mb-3">
              <Label className="text-base font-medium text-gray-900 dark:text-white">
                요청 본문
              </Label>
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetRequestBody}
                className="text-xs">
                <RotateCcw className="h-3 w-3 mr-1" />
                기본값으로 리셋
              </Button>
            </div>
            <Textarea
              value={requestBodyText}
              onChange={(e) => setRequestBodyText(e.target.value)}
              className="min-h-[200px] font-mono text-sm bg-gray-900 text-green-400 border-gray-700"
              placeholder="JSON 형식의 요청 본문을 입력해주세요..."
            />
            <p className="text-xs text-gray-500 mt-2">
              {methodsWithParamsOnly.includes(selectedMethod.type) && queryParams.length > 0 &&
                `${selectedMethod.type} 요청의 경우 쿼리 파라미터(Query parameters)는 URL 쿼리 스트링으로 전송됩니다.`}

              {methodsWithParamsOnly.includes(selectedMethod.type) && pathParams.length > 0 && queryParams.length === 0 &&
                `${selectedMethod.type} 요청의 경우 경로 파라미터(Path parameters)는 URL 경로의 일부로 전송됩니다.`}

              {methodsWithBody.includes(selectedMethod.type) &&
                `헤더(Headers)와 본문(Body)이 ${selectedMethod.type} 요청과 함께 전송됩니다.`}

              {methodsWithParamsOnly.includes(selectedMethod.type) && queryParams.length === 0 && pathParams.length === 0 &&
                `${selectedMethod.type} 요청에 대한 기본 쿼리 파라미터 예시입니다.`}     </p>
          </div>
        </CardContent>
      </Card>

      {/* Response Section */}
      {testResponse && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 !text-lg font-bold">
              응답 결과
              {testResponse.error ? (
                <span className="ml-2 px-2 py-0.5 text-xs rounded bg-red-100 text-red-800">
                  에러
                </span>
              ) : (
                <span className="ml-2 px-2 py-0.5 text-xs rounded bg-green-100 text-green-800">
                  성공
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Status Info */}
              {testResponse.status && (
                <div className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">상태:</span>
                    <span
                      className={`px-2 py-1 rounded text-sm font-mono ${!testResponse.error
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                        }`}>
                      {testResponse.status}
                    </span>
                  </div>
                </div>
              )}

              {/* Response Body */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  응답 본문
                </Label>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 max-h-96 overflow-auto border">
                  <pre className="text-sm font-mono text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {(() => {
                      try {
                        // testResponse가 직접 데이터인 경우
                        if (testResponse.error) {
                          return JSON.stringify(testResponse, null, 2);
                        }
                        // 응답 데이터를 그대로 표시
                        return JSON.stringify(testResponse, null, 2);
                      } catch {
                        return String(testResponse);
                      }
                    })()}
                  </pre>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State when no response */}
      {!testResponse && (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
          <Code className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 mb-2">응답 대기 중</p>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            API 테스트를 위해 Send 버튼을 클릭해주세요.
          </p>
        </div>
      )}
    </div>
  );
}
