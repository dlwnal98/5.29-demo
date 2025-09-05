'use client';
import React, { useEffect } from 'react';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { requestGet } from '@/lib/apiClient';
import { CreateResourceProps, getResourceList, useCreateResource } from '@/hooks/use-resources';
import { toast } from 'sonner';

interface ResourceCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  apiId: string;
  userKey: string;
}

export function ResourceCreateDialog({
  open,
  onOpenChange,
  apiId,
  userKey,
}: ResourceCreateDialogProps) {
  const [createResourceForm, setCreateResourceForm] = useState({
    apiId: apiId,
    resourceName: '',
    description: '',
    resourceType: 'REST',
    initialPaths: [
      {
        pathPattern: '/',
        description: '', // 없애기로
      },
    ],
    securitySettings: {
      corsPolicy: {
        policyId: 'COR123456789',
        allowedOrigins: '*',
        allowedMethods: 'GET,POST,PUT,DELETE',
        allowedHeaders: 'Content-Type,Authorization',
        exposedHeaders: 'X-Total-Count',
        allowCredentials: true,
        maxAgeSeconds: 3600,
        enabled: true,
      },
      allowedOrigins: ['https://example.com', 'https://app.example.com'],
      blockedIps: ['192.168.1.100', '10.0.0.50'],
      httpsOnly: true,
      securityHeaders: {
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
      },
    },
    cachingSettings: {
      enableCaching: false,
      cacheStrategy: 'TIME_BASED',
      defaultTtlSeconds: 300,
      methodSpecificTtl: {
        GET: 600,
        POST: 0,
      },
      cacheKeys: ['user_id', 'resource_path', 'query_params'],
      varyHeaders: ['Accept-Language', 'Accept-Encoding'],
    },
    createdBy: userKey,
    metadata: {
      version: '1.0',
      team: 'backend',
    },
  });

  // const [resourcePaths, setResourcePaths] = useState<string[]>([]);

  // const getResourcePaths = async () => {
  //   const res = await getResourceList(apiId);

  //   setResourcePaths(['/', ...res]);
  // };

  // useEffect(() => {
  //   getResourcePaths();
  // },[])

  useEffect(() => {
    if (userKey) setCreateResourceForm({ ...createResourceForm, createdBy: userKey });
  }, [userKey]);

  const availableResourcePaths = ['/', '/api', '/users', '/products', '/orders'];

  const { mutate: createResourceMutate } = useCreateResource({
    onSuccess: () => {
      toast.success('리소스가 생성되었습니다.');
      onOpenChange(false);
    },
  });

  const createResource = async (data: CreateResourceProps) => {
    const resourcePath =
      data.initialPaths[0].pathPattern === '/'
        ? data.initialPaths[0].pathPattern + data.resourceName
        : data.initialPaths[0].pathPattern + '/' + data.resourceName;
    //resource 경로 검증
    const res = await requestGet(
      `/api/v1/resources/validate-path?apiId=${data.apiId}&resourcePath=${resourcePath}`
    );

    if (res) {
      createResourceMutate(data);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    setCreateResourceForm({
      apiId: apiId,
      resourceName: '',
      description: '',
      resourceType: 'REST',
      initialPaths: [
        {
          pathPattern: '',
          description: '', // 없애기로
        },
      ],
      securitySettings: {
        corsPolicy: {
          policyId: 'COR123456789',
          allowedOrigins: '*',
          allowedMethods: 'GET,POST,PUT,DELETE',
          allowedHeaders: 'Content-Type,Authorization',
          exposedHeaders: 'X-Total-Count',
          allowCredentials: true,
          maxAgeSeconds: 3600,
          enabled: true,
        },
        allowedOrigins: ['https://example.com', 'https://app.example.com'],
        blockedIps: ['192.168.1.100', '10.0.0.50'],
        httpsOnly: true,
        securityHeaders: {
          'X-Frame-Options': 'DENY',
          'X-Content-Type-Options': 'nosniff',
        },
      },
      cachingSettings: {
        enableCaching: false,
        cacheStrategy: 'TIME_BASED',
        defaultTtlSeconds: 300,
        methodSpecificTtl: {
          GET: 600,
          POST: 0,
        },
        cacheKeys: ['user_id', 'resource_path', 'query_params'],
        varyHeaders: ['Accept-Language', 'Accept-Encoding'],
      },
      createdBy: userKey,
      metadata: {
        version: '1.0',
        team: 'backend',
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-blue-600">Resource 생성</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {/* Resource Path and Name - Side by Side */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label
                htmlFor="resource-path"
                className="text-sm font-medium text-gray-700 mb-2 block">
                리소스 경로
              </Label>
              <Select
                value={
                  createResourceForm.initialPaths[0].pathPattern
                    ? createResourceForm.initialPaths[0].pathPattern
                    : '/'
                }
                onValueChange={(value) =>
                  setCreateResourceForm({
                    ...createResourceForm,
                    initialPaths: [
                      {
                        ...createResourceForm.initialPaths[0],
                        pathPattern: value,
                      },
                    ],
                  })
                }>
                <SelectTrigger>
                  <SelectValue placeholder="경로를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {/* {resourcePaths.map((path) => ( */}
                  {availableResourcePaths.map((path) => (
                    <SelectItem key={path} value={path}>
                      {path}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label
                htmlFor="resource-name"
                className="text-sm font-medium text-gray-700 mb-2 block">
                리소스 이름
              </Label>
              <Input
                id="resource-name"
                placeholder=""
                value={createResourceForm.resourceName}
                onChange={(e) =>
                  setCreateResourceForm({ ...createResourceForm, resourceName: e.target.value })
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-4">
              <Label
                htmlFor="resource-description"
                className="text-sm font-medium text-gray-700 mb-2 block">
                리소스 설명
              </Label>
              <Textarea
                id="resource-description"
                placeholder=""
                value={createResourceForm.description}
                onChange={(e) => {
                  setCreateResourceForm({ ...createResourceForm, description: e.target.value });
                }}
                className="min-h-[50px] text-sm resize-none"
              />
            </div>
          </div>
          {/* CORS Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div>
              <Label
                htmlFor="cors-toggle"
                className="text-sm font-medium text-gray-700 dark:text-gray-300">
                원본에서 CORS
              </Label>
              <p className="text-xs text-gray-500 mt-1">
                모든 오리진, 모든 메서드 및 몇 가지 공통 헤더를 허용하는 OPTIONS 메서드를
                생성합니다.
              </p>
            </div>
            <Switch
              id="cors-toggle"
              checked={createResourceForm.securitySettings.corsPolicy.enabled}
              onCheckedChange={(checked) =>
                setCreateResourceForm({
                  ...createResourceForm,
                  securitySettings: {
                    ...createResourceForm.securitySettings,
                    corsPolicy: {
                      ...createResourceForm.securitySettings?.corsPolicy,
                      enabled: checked,
                    },
                  },
                })
              }
            />
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleCancel}>
            취소
          </Button>
          <Button
            onClick={() => createResource(createResourceForm)}
            className="bg-blue-500 hover:bg-blue-600 text-white">
            생성
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
