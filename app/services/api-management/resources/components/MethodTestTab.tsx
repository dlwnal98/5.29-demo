import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Send, Play, FileText, CheckCircle, Code } from 'lucide-react';

interface MethodTestTabProps {
  selectedMethod: any;
  testSettings: any;
  setTestSettings: (settings: any) => void;
  handleTest: () => void;
  isTestLoading: boolean;
  testResponse: any;
}

export function MethodTestTab({
  selectedMethod,
  testSettings,
  setTestSettings,
  handleTest,
  isTestLoading,
  testResponse,
}: MethodTestTabProps) {
  return (
    <div className="space-y-6">
      {/* Request Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            요청 설정
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Method and URL */}
          <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <span
              className={`px-3 py-1 rounded text-sm font-mono font-bold ${
                selectedMethod.type === 'GET'
                  ? 'bg-green-100 text-green-800'
                  : selectedMethod.type === 'POST'
                    ? 'bg-blue-100 text-blue-800'
                    : selectedMethod.type === 'PUT'
                      ? 'bg-yellow-100 text-yellow-800'
                      : selectedMethod.type === 'DELETE'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
              }`}
            >
              {selectedMethod.type}
            </span>
            <code className="flex-1 text-sm bg-white dark:bg-gray-700 px-3 py-2 rounded border">
              {selectedMethod.endpointUrl}
            </code>
            <Button
              className="bg-orange-500 hover:bg-orange-600 text-white px-6"
              onClick={handleTest}
              disabled={isTestLoading}
            >
              {isTestLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  테스트 중...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Send
                </>
              )}
            </Button>
          </div>

          {/* Query Parameters */}
          {selectedMethod.parameters?.filter((p: any) => p.in === 'query').length > 0 && (
            <div>
              <Label className="text-base font-medium text-gray-900 dark:text-white mb-3 block">
                Query Parameters
              </Label>
              <div className="space-y-2">
                {selectedMethod.parameters
                  .filter((param: any) => param.in === 'query')
                  .map((param: any, index: number) => (
                    <div key={param.name} className="grid grid-cols-12 gap-3 items-center">
                      <div className="col-span-1 flex justify-center">
                        <input
                          type="checkbox"
                          defaultChecked={param.required}
                          className="rounded border-gray-300"
                        />
                      </div>
                      <div className="col-span-3">
                        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {param.name}
                          {param.required && <span className="text-red-500 ml-1">*</span>}
                        </div>
                        <div className="text-xs text-gray-500">
                          {param.schema?.type || 'string'}
                        </div>
                      </div>
                      <div className="col-span-8">
                        <Input placeholder={`Enter ${param.name}`} className="w-full" />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Path Parameters */}
          {selectedMethod.parameters?.filter((p: any) => p.in === 'path').length > 0 && (
            <div>
              <Label className="text-base font-medium text-gray-900 dark:text-white mb-3 block">
                Path Parameters
              </Label>
              <div className="space-y-2">
                {selectedMethod.parameters
                  .filter((param: any) => param.in === 'path')
                  .map((param: any) => (
                    <div key={param.name} className="grid grid-cols-12 gap-3 items-center">
                      <div className="col-span-1 flex justify-center">
                        <input
                          type="checkbox"
                          defaultChecked={true}
                          disabled
                          className="rounded border-gray-300"
                        />
                      </div>
                      <div className="col-span-3">
                        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {param.name}
                          <span className="text-red-500 ml-1">*</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {param.schema?.type || 'string'}
                        </div>
                      </div>
                      <div className="col-span-8">
                        <Input placeholder={`Enter ${param.name}`} className="w-full" required />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Headers */}
          <div>
            <Label className="text-base font-medium text-gray-900 dark:text-white mb-3 block">
              Headers
            </Label>
            <div className="space-y-2">
              {/* Common Headers */}
              <div className="grid grid-cols-12 gap-3 items-center">
                <div className="col-span-1 flex justify-center">
                  <input
                    type="checkbox"
                    defaultChecked={selectedMethod.apiKey !== '-'}
                    className="rounded border-gray-300"
                  />
                </div>
                <div className="col-span-3">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Authorization
                  </div>
                  <div className="text-xs text-gray-500">Authentication</div>
                </div>
                <div className="col-span-8">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select auth type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bearer">Bearer Token</SelectItem>
                      <SelectItem value="basic">Basic Auth</SelectItem>
                      <SelectItem value="apikey">API Key</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-12 gap-3 items-center">
                <div className="col-span-1 flex justify-center">
                  <input
                    type="checkbox"
                    defaultChecked={['POST', 'PUT', 'PATCH'].includes(selectedMethod.type)}
                    className="rounded border-gray-300"
                  />
                </div>
                <div className="col-span-3">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Content-Type
                  </div>
                  <div className="text-xs text-gray-500">Media type</div>
                </div>
                <div className="col-span-8">
                  <Select defaultValue="application/json">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="application/json">application/json</SelectItem>
                      <SelectItem value="application/xml">application/xml</SelectItem>
                      <SelectItem value="text/plain">text/plain</SelectItem>
                      <SelectItem value="application/x-www-form-urlencoded">
                        application/x-www-form-urlencoded
                      </SelectItem>
                      <SelectItem value="multipart/form-data">multipart/form-data</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-12 gap-3 items-center">
                <div className="col-span-1 flex justify-center">
                  <input type="checkbox" className="rounded border-gray-300" />
                </div>
                <div className="col-span-3">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Accept</div>
                  <div className="text-xs text-gray-500">Response type</div>
                </div>
                <div className="col-span-8">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select accept type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="application/json">application/json</SelectItem>
                      <SelectItem value="application/xml">application/xml</SelectItem>
                      <SelectItem value="text/html">text/html</SelectItem>
                      <SelectItem value="*/*">*/*</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-12 gap-3 items-center">
                <div className="col-span-1 flex justify-center">
                  <input type="checkbox" className="rounded border-gray-300" />
                </div>
                <div className="col-span-3">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    User-Agent
                  </div>
                  <div className="text-xs text-gray-500">Client info</div>
                </div>
                <div className="col-span-8">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select user agent" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="postman">Postman Runtime/7.29.2</SelectItem>
                      <SelectItem value="chrome">Mozilla/5.0 (Chrome)</SelectItem>
                      <SelectItem value="firefox">Mozilla/5.0 (Firefox)</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Request Body (for POST, PUT, PATCH) */}
          {['POST', 'PUT', 'PATCH'].includes(selectedMethod.type) && (
            <div>
              <Label className="text-base font-medium text-gray-900 dark:text-white mb-3 block">
                Request Body
              </Label>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="bg-blue-50 text-blue-600">
                    JSON
                  </Button>
                  <Button variant="outline" size="sm">
                    XML
                  </Button>
                  <Button variant="outline" size="sm">
                    Form Data
                  </Button>
                  <Button variant="outline" size="sm">
                    Raw
                  </Button>
                </div>
                <Textarea
                  value={testSettings.requestBody}
                  onChange={(e) =>
                    setTestSettings({
                      ...testSettings,
                      requestBody: e.target.value,
                    })
                  }
                  placeholder={`{
  "name": "John Doe",
  "email": "john@example.com"
}`}
                  className="min-h-[150px] font-mono text-sm"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Response Section */}
      {testResponse && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              응답 결과
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Status and Time */}
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Status:</span>
                    <span
                      className={`px-2 py-1 rounded text-sm font-mono ${
                        testResponse.status >= 200 && testResponse.status < 300
                          ? 'bg-green-100 text-green-800'
                          : testResponse.status >= 400
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {testResponse.status} {testResponse.statusText}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Time:</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {testResponse.responseTime}ms
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Size:</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {new Blob([testResponse.body]).size} bytes
                    </span>
                  </div>
                </div>
              </div>

              {/* Response Tabs */}
              <Tabs defaultValue="body" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="body">Body</TabsTrigger>
                  <TabsTrigger value="headers">
                    Headers ({Object.keys(testResponse.headers).length})
                  </TabsTrigger>
                  <TabsTrigger value="test-results">Test Results</TabsTrigger>
                </TabsList>

                <TabsContent value="body" className="mt-4">
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="bg-blue-50 text-blue-600">
                        Pretty
                      </Button>
                      <Button variant="outline" size="sm">
                        Raw
                      </Button>
                      <Button variant="outline" size="sm">
                        Preview
                      </Button>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 max-h-96 overflow-auto">
                      <pre className="text-sm font-mono text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {JSON.stringify(JSON.parse(testResponse.body), null, 2)}
                      </pre>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="headers" className="mt-4">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <div className="space-y-2">
                      {Object.entries(testResponse.headers).map(([key, value]) => (
                        <div
                          key={key}
                          className="grid grid-cols-3 gap-4 py-2 border-b border-gray-200 dark:border-gray-600 last:border-b-0"
                        >
                          <div className="font-medium text-sm text-gray-700 dark:text-gray-300">
                            {key}
                          </div>
                          <div className="col-span-2 text-sm text-gray-600 dark:text-gray-400 font-mono">
                            {value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="test-results" className="mt-4">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Status code is 200</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Response time is less than 2000ms</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Content-Type header is present</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
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
            Send 버튼을 클릭하여 API를 테스트하세요
          </p>
        </div>
      )}
    </div>
  );
}
