import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Method, QueryParameter, RequestHeader, RequestBodyModel } from '@/types/resource';

interface MethodRequestViewProps {
  selectedMethod: Method;
  queryParameters: QueryParameter[];
  requestHeaders: RequestHeader[];
  requestBodyModels: RequestBodyModel[];
  modelId: string;
}

export function MethodRequestView({
  selectedMethod,
  queryParameters,
  requestHeaders,
  requestBodyModels,
  modelId,
}: MethodRequestViewProps) {
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

  console.log(selectedMethod);

  return (
    <>
      {/* Method Request Settings */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Method Request Settings</h3>
        </div>
        <div>
          <div className="border-b pb-2 mb-2 grid grid-cols-5 gap-6">
            <div className="col-span-1">
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    API Key Registration
                  </Label>
                </div>
              </div>
            </div>
            <div className="col-span-2">
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    API Key ID
                  </Label>
                </div>
              </div>
            </div>
            <div className="col-span-2">
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Request Validator
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
                      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Required</Badge>
                    ) : (
                      <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
                        Optional
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
                    {selectedMethod?.info['x-api-key-id'] || 'None'}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-2">
              <div className="space-y-3">
                <div>
                  <div className="mt-1 text-sm text-gray-900 dark:text-white">
                    {convertValidator(selectedMethod?.info['x-request-validator']) || 'None'}
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
            URL Query String Parameters ({queryParameters.length})
          </h4>
          <div className="flex items-center gap-2">
            <ChevronLeft className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">1</span>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </div>
        </div>
        {queryParameters.length > 0 ? (
          <div className="space-y-2">
            <div className="grid grid-cols-5 gap-4 text-sm font-medium text-gray-600 dark:text-gray-400 border-b pb-2">
              <div className="col-span-4">Name</div>
              <div className="col-span-1">Required</div>
            </div>
            {queryParameters.map((param) => (
              <div
                key={param.id}
                className="grid grid-cols-5 gap-4 p-3 bg-white dark:bg-gray-800 rounded border">
                <div className="font-medium col-span-4">{param.name}</div>
                <div className="text-sm col-span-1">
                  {param.required ? (
                    <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Required</Badge>
                  ) : (
                    <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Optional</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-500 dark:text-gray-400 mb-2">No query string parameters</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              No query string parameters defined
            </p>
          </div>
        )}
      </div>
      {/* HTTP Request Headers */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-md font-semibold text-gray-900 dark:text-white">
            HTTP Request Headers ({requestHeaders.length})
          </h4>
          <div className="flex items-center gap-2">
            <ChevronLeft className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">1</span>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </div>
        </div>
        {requestHeaders.length > 0 ? (
          <div className="space-y-2">
            <div className="grid grid-cols-5 gap-4 text-sm font-medium text-gray-600 dark:text-gray-400 border-b pb-2">
              <div className="col-span-4">Name</div>
              <div className="col-span-1">Required</div>
            </div>

            {requestHeaders.map((header) => (
              <div
                key={header.id}
                className="grid grid-cols-5 gap-4 p-3 bg-white dark:bg-gray-800 rounded border">
                <div className="font-medium col-span-4">{header.name}</div>
                <div className="text-sm col-span-1">
                  {header.required ? (
                    <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Required</Badge>
                  ) : (
                    <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Optional</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-500 dark:text-gray-400 mb-2">No request headers</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">No request headers defined</p>
          </div>
        )}
      </div>
      {/* Request Body */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-md font-semibold text-gray-900 dark:text-white">Request Body</h4>
          <div className="flex items-center gap-2">
            <ChevronLeft className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">1</span>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </div>
        </div>
        {modelId ? (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-4 text-sm font-medium text-gray-600 dark:text-gray-400 border-b pb-2">
              <div>ID</div>
              <div>Content Type</div>
            </div>
            <div
              key={modelId}
              className="grid grid-cols-2 gap-4 p-3 bg-white dark:bg-gray-800 rounded border">
              <div className="font-medium ">{modelId || 'Empty'}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{'application/json'}</div>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-500 dark:text-gray-400 mb-2">No request body</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">No request body defined</p>
          </div>
        )}
      </div>
    </>
  );
}
