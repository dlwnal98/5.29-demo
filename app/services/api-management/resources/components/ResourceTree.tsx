import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Method } from '@/types/resource';

interface ResourceTreeProps {
  mockData2: any;
  selectedPath: string | null;
  setSelectedPath: (path: string | null) => void;
  selectedMethod: Method | null;
  setSelectedMethod: (method: Method | null) => void;
  getMethodStyle: (method: string) => string;
  HttpMethod: any;
  setActiveTab: (tab: string) => void;
  setIsEditMode: (edit: boolean) => void;
}

export function ResourceTree({
  mockData2,
  selectedPath,
  setSelectedPath,
  selectedMethod,
  setSelectedMethod,
  getMethodStyle,
  HttpMethod,
  setActiveTab,
  setIsEditMode,
}: ResourceTreeProps) {
  const renderResourcePaths = Object.entries((mockData2?.spec?.paths || {}) as Record<string, any>);
  return (
    <div>
      <div className="font-mono pl-1">/</div>
      {renderResourcePaths.map(([path, methods]) => {
        const isPathSelected = selectedPath === path && !selectedMethod;
        return (
          <div key={path}>
            <div
              className={`flex items-center gap-2 py-1 px-2 mb-1 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md ${
                isPathSelected
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                  : ''
              }`}
              style={{ paddingLeft: `0` }}
              onClick={() => {
                setSelectedPath(path);
                setSelectedMethod(null);
              }}
            >
              <div className="pl-3" />
              <span className="font-mono font-medium text-[15px]">{path}</span>
            </div>
            {selectedPath === path && (
              <ul>
                {Object.keys(methods).map((method) => {
                  const isMethodSelected = selectedMethod?.id === method;
                  return (
                    <li
                      key={method}
                      className={`flex items-center gap-2 py-1 px-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-green-900/20 rounded-md ${
                        isMethodSelected
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                          : 'text-gray-600 dark:text-gray-400'
                      }`}
                      style={{ paddingLeft: `10px` }}
                      onClick={() => {
                        const openApiMethod = (methods as any)[method];
                        const convertedMethod: Method = {
                          id: `method-${path}-${method}`,
                          type: method.toUpperCase(),
                          permissions: openApiMethod['x-permissions'] || '-',
                          apiKey: openApiMethod['x-apiKeyId'] || '-',
                          resourcePath: path,
                          endpointUrl: (mockData2.spec.servers?.[0]?.url || '') + path,
                          summary: openApiMethod.summary || '',
                          description: openApiMethod.description || '',
                          parameters: openApiMethod.parameters || [],
                          requestBody: openApiMethod.requestBody || null,
                          responses: openApiMethod.responses || {},
                          security: openApiMethod.security || null,
                          requestValidator: '없음',
                        };
                        setSelectedMethod(convertedMethod);
                        setActiveTab('method-request');
                        setIsEditMode(false);
                      }}
                    >
                      <div className="w-4" />
                      <span className={`${getMethodStyle(method?.toUpperCase())}`}>
                        {method.toUpperCase()}
                      </span>
                      <span className=" text-[12px]">- {(methods as any)[method].summary}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
