import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Play, RotateCcw, Plus, Trash2 } from 'lucide-react';
import { Code } from 'lucide-react';

interface MethodTestTabProps {
  selectedMethod: any;
  handleTest: (requestBody: any) => void;
  isTestLoading: boolean;
  testResponse: any;
}

interface KeyValuePair {
  key: string;
  value: string;
}

export function MethodTestTab({
  selectedMethod,
  handleTest,
  isTestLoading,
  testResponse,
}: MethodTestTabProps) {

  // resourcePath에서 {paramName} 패턴을 파싱하여 Path Parameter 추출
  const pathParams = [...(selectedMethod.resourcePath?.matchAll(/\{([^}]+)\}/g) || [])].map(match => match[1]);

  // POST, PUT은 body 포함 가능
  const methodsWithBody = ['POST', 'PUT', 'PATCH'];

  // 개별 상태 관리
  const [headers, setHeaders] = useState<KeyValuePair[]>([]);
  const [queryParameters, setQueryParameters] = useState<KeyValuePair[]>([]);
  const [body, setBody] = useState<string>('{"name": "John Doe", "email": "john@example.com"}');
  const [pathParamValues, setPathParamValues] = useState<Record<string, string>>({});

  // 메서드 변경 시 기본값으로 리셋
  useEffect(() => {
    // Path Parameters 기본값 설정
    const defaultPathParams: Record<string, string> = {};
    pathParams.forEach((paramName: string) => {
      defaultPathParams[paramName] = '';
    });
    setPathParamValues(defaultPathParams);

    // Headers 초기화
    setHeaders([]);

    // Query Parameters 초기화
    setQueryParameters([]);

    // Body 기본값 설정
    setBody('{"name": "John Doe", "email": "john@example.com"}');
  }, [selectedMethod?.info?.['x-method-id']]);

  // 기본값으로 리셋하는 함수
  const handleResetRequestBody = () => {
    // Path Parameters 기본값 설정
    const defaultPathParams: Record<string, string> = {};
    pathParams.forEach((paramName: string) => {
      defaultPathParams[paramName] = '';
    });
    setPathParamValues(defaultPathParams);

    // Headers 초기화
    setHeaders([]);

    // Query Parameters 초기화
    setQueryParameters([]);

    // Body 기본값 설정
    setBody('{"name": "John Doe", "email": "john@example.com"}');
  };

  // Header 추가
  const addHeader = () => {
    setHeaders([...headers, { key: '', value: '' }]);
  };

  // Header 삭제
  const removeHeader = (index: number) => {
    setHeaders(headers.filter((_, i) => i !== index));
  };

  // Header 값 변경
  const updateHeader = (index: number, field: 'key' | 'value', value: string) => {
    const newHeaders = [...headers];
    newHeaders[index][field] = value;
    setHeaders(newHeaders);
  };

  // Query Parameter 추가
  const addQueryParameter = () => {
    setQueryParameters([...queryParameters, { key: '', value: '' }]);
  };

  // Query Parameter 삭제
  const removeQueryParameter = (index: number) => {
    setQueryParameters(queryParameters.filter((_, i) => i !== index));
  };

  // Query Parameter 값 변경
  const updateQueryParameter = (index: number, field: 'key' | 'value', value: string) => {
    const newQueryParameters = [...queryParameters];
    newQueryParameters[index][field] = value;
    setQueryParameters(newQueryParameters);
  };

  // Send 버튼 클릭 시 요청 본문 파싱하여 전달
  const handleSendTest = () => {
    const requestBody: any = {};

    // Query Parameters를 객체로 변환 (모든 메서드에서 사용)
    const queryParamsObj: Record<string, string> = {};
    queryParameters.forEach(q => {
      if (q.key.trim()) {
        queryParamsObj[q.key] = q.value;
      }
    });
    if (Object.keys(queryParamsObj).length > 0) {
      requestBody.queryParameters = queryParamsObj;
    }

    // Path Parameters (모든 메서드에서 사용)
    if (Object.keys(pathParamValues).length > 0) {
      requestBody.pathParameters = pathParamValues;
    }

    // Headers를 객체로 변환 (모든 메서드에서 사용)
    const headersObj: Record<string, string> = {};
    headers.forEach(h => {
      if (h.key.trim()) {
        headersObj[h.key] = h.value;
      }
    });
    if (Object.keys(headersObj).length > 0) {
      requestBody.headers = headersObj;
    }

    // Body는 POST, PUT, PATCH에서만 사용
    if (methodsWithBody.includes(selectedMethod.type)) {
      requestBody.body = body;
    }

    handleTest(requestBody);
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
              {`${selectedMethod?.resourcePath}`}
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

          {/* Reset Button */}
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetRequestBody}
              className="text-xs">
              <RotateCcw className="h-3 w-3 mr-1" />
              기본값으로 리셋
            </Button>
          </div>

          {/* Path Parameters Section */}
          {pathParams.length > 0 && (
            <div className="space-y-3">
              <Label className="text-base font-medium text-gray-900 dark:text-white">
                Path Parameters
              </Label>
              <div className="space-y-2">
                {pathParams.map((paramName: string) => (
                  <div key={paramName} className="flex items-center gap-3">
                    <Label className="w-32 text-sm font-mono text-gray-600 dark:text-gray-400">
                      {paramName}
                      <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Input
                      value={pathParamValues[paramName] || ''}
                      onChange={(e) => setPathParamValues({ ...pathParamValues, [paramName]: e.target.value })}
                      placeholder="값을 입력하세요"
                      className="flex-1 font-mono text-sm"
                    />
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500">
                경로 파라미터(Path parameters)는 URL 경로의 일부로 전송됩니다.
              </p>
            </div>
          )}

          {/* Query Parameters Section - 항상 표시 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium text-gray-900 dark:text-white">
                Query Parameters
              </Label>
              <Button
                variant="outline"
                size="sm"
                onClick={addQueryParameter}
                className="text-xs">
                <Plus className="h-3 w-3 mr-1" />
                파라미터 추가
              </Button>
            </div>
            <div className="space-y-2">
              {queryParameters.map((param, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={param.key}
                    onChange={(e) => updateQueryParameter(index, 'key', e.target.value)}
                    placeholder="Parameter name"
                    className="w-40 font-mono text-sm"
                  />
                  <Input
                    value={param.value}
                    onChange={(e) => updateQueryParameter(index, 'value', e.target.value)}
                    placeholder="Parameter value"
                    className="flex-1 font-mono text-sm"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeQueryParameter(index)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 px-2">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500">
              쿼리 파라미터(Query parameters)는 URL 쿼리 스트링으로 전송됩니다.
            </p>
          </div>

          {/* Headers Section - 항상 표시 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium text-gray-900 dark:text-white">
                Headers
              </Label>
              <Button
                variant="outline"
                size="sm"
                onClick={addHeader}
                className="text-xs">
                <Plus className="h-3 w-3 mr-1" />
                헤더 추가
              </Button>
            </div>
            <div className="space-y-2">
              {headers.map((header, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={header.key}
                    onChange={(e) => updateHeader(index, 'key', e.target.value)}
                    placeholder="Header name"
                    className="w-40 font-mono text-sm"
                  />
                  <Input
                    value={header.value}
                    onChange={(e) => updateHeader(index, 'value', e.target.value)}
                    placeholder="Header value"
                    className="flex-1 font-mono text-sm"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeHeader(index)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 px-2">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500">
              요청 헤더(Headers)는 API 요청과 함께 전송됩니다.
            </p>
          </div>

          {/* Body Section (for POST, PUT, PATCH) */}
          {methodsWithBody.includes(selectedMethod.type) && (
            <div className="space-y-3">
              <Label className="text-base font-medium text-gray-900 dark:text-white">
                Request Body
              </Label>
              <Textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="min-h-[150px] font-mono text-sm bg-gray-900 text-green-400 border-gray-700"
                placeholder="JSON 형식의 요청 본문을 입력해주세요..."
              />
              <p className="text-xs text-gray-500">
                요청 본문(Body)은 {selectedMethod.type} 요청과 함께 전송됩니다.
              </p>
            </div>
          )}
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
              {testResponse.statusCode && (
                <div className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">상태:</span>
                    <span
                      className={`px-2 py-1 rounded text-sm font-mono ${!testResponse.error
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                        }`}>
                      {testResponse.statusCode} {testResponse.statusText}
                    </span>
                  </div>
                  {testResponse.responseTimeMs !== undefined && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">응답 시간:</span>
                      <span className="px-2 py-1 rounded text-sm font-mono bg-blue-100 text-blue-800">
                        {testResponse.responseTimeMs}ms
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Response Headers */}
              {testResponse.headers && Object.keys(testResponse.headers).length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    응답 헤더
                  </Label>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 max-h-48 overflow-auto border">
                    <div className="space-y-1">
                      {Object.entries(testResponse.headers).map(([key, value]) => (
                        <div key={key} className="flex gap-2 text-sm font-mono">
                          <span className="text-gray-500 dark:text-gray-400">{key}:</span>
                          <span className="text-gray-700 dark:text-gray-300">{String(value)}</span>
                        </div>
                      ))}
                    </div>
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
                        if (testResponse.error) {
                          return JSON.stringify(testResponse, null, 2);
                        }
                        // body 필드가 있으면 해당 값만 표시
                        if (testResponse.body !== undefined) {
                          // body가 JSON 문자열인 경우 파싱하여 포맷팅
                          try {
                            const parsedBody = JSON.parse(testResponse.body);
                            return JSON.stringify(parsedBody, null, 2);
                          } catch {
                            // JSON이 아닌 경우 그대로 표시
                            return testResponse.body;
                          }
                        }
                        // body 필드가 없으면 전체 응답 표시 (하위 호환성)
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