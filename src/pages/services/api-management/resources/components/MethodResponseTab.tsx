import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

interface ResponseHeader {
  id: string;
  name: string;
  value: string;
  required?: boolean;
}

interface ResponseBody {
  id: string;
  contentType: string;
  model: string;
}

interface MethodResponse {
  id: string;
  statusCode: string;
  description?: string;
  headers: ResponseHeader[];
  bodies: ResponseBody[];
}

interface MethodResponseTabProps {
  methodResponses: MethodResponse[];
}

const getStatusCodeColor = (code: string) => {
  if (code.startsWith('2')) return 'bg-green-100 text-green-800 border-green-200';
  if (code.startsWith('3')) return 'bg-blue-100 text-blue-800 border-blue-200';
  if (code.startsWith('4')) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  if (code.startsWith('5')) return 'bg-red-100 text-red-800 border-red-200';
  return 'bg-gray-100 text-gray-800 border-gray-200';
};

export function MethodResponseTab({
  methodResponses,
}: MethodResponseTabProps) {
  return (
    <>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Method Response</h3>
      </div>
      {methodResponses.length > 0 ? (
        <div className="space-y-4">
          {methodResponses.map((response) => (
            <Card key={response.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded text-sm font-mono font-bold border ${getStatusCodeColor(response.statusCode)}`}>
                    {response.statusCode}
                  </span>
                  {response.description && (
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {response.description}
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 응답 헤더 */}
                <div>
                  <Label className="text-sm font-medium">Response Header</Label>
                  {response.headers.length > 0 ? (
                    <div className="mt-2 space-y-1">
                      {response.headers.map((header) => (
                        <div
                          key={header.id}
                          className="flex items-center gap-2 text-sm bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded"
                        >
                          <code className="font-mono text-blue-600 dark:text-blue-400">
                            {header.name}
                          </code>
                          {header.required && (
                            <Badge variant="outline" className="text-xs bg-red-50 text-red-600 border-red-200">
                              Required
                            </Badge>
                          )}
                          {header.value && (
                            <span className="text-gray-500">- {header.value}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 mt-1">No defined response headers.</p>
                  )}
                </div>

                {/* 응답 본문 */}
                <div>
                  <Label className="text-sm font-medium">Response Body</Label>
                  {response.bodies.length > 0 ? (
                    <div className="mt-2 space-y-1">
                      {response.bodies.map((body) => (
                        <div
                          key={body.id}
                          className="flex items-center gap-2 text-sm bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded"
                        >
                          <Badge variant="outline" className="font-mono text-xs">
                            {body.contentType}
                          </Badge>
                          <span className="text-gray-600 dark:text-gray-400">
                            Model: <code className="font-mono text-purple-600 dark:text-purple-400">{body.model}</code>
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 mt-1">No defined response body.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-6">
          <p className="text-gray-500 dark:text-gray-400 mb-2">No defined response.</p>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Click the edit button at the top to add a response.
          </p>
        </div>
      )}
    </>
  );
}
