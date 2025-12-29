import { useState, useEffect } from 'react';
import { requestGet } from '@/lib/apiClient';
import { CreateResourceProps, useCreateResource } from '@/hooks/use-resources';
import { toast } from 'sonner';
import { isValidInput } from '@/lib/etc';

export interface CreateResourceForm {
  apiId: string;
  resourceName: string;
  description: string;
  path: string;
  enableCors: boolean;
  resourceType: string;
  createdBy: string;
}

interface UseResourceCreateDialogProps {
  open: boolean;
  apiId: string;
  userKey: string;
  onOpenChange: (open: boolean) => void;
  setCreatedResourceId: React.Dispatch<React.SetStateAction<string>>;
}

export function useResourceCreateDialog({
  open,
  apiId,
  userKey,
  onOpenChange,
  setCreatedResourceId,
}: UseResourceCreateDialogProps) {
  const [createResourceForm, setCreateResourceForm] = useState<CreateResourceForm>({
    apiId,
    resourceName: '',
    description: '',
    path: '/',
    enableCors: false,
    resourceType: 'REST',
    createdBy: userKey ?? '',
  });

  const [resourcePaths, setResourcePaths] = useState<string[]>([]);
  const [pathPattern, setPathPattern] = useState('/');
  const [checkUrl, setCheckUrl] = useState(false);

  useEffect(() => {
    if (open) {
      setCreateResourceForm({
        apiId,
        resourceName: '',
        description: '',
        path: '/',
        enableCors: false,
        resourceType: 'REST',
        createdBy: userKey ?? '',
      });
      setPathPattern('/');
      setCheckUrl(false);
      fetchResourcePaths();
    }
  }, [open, apiId, userKey]);

  const fetchResourcePaths = async () => {
    try {
      const res = await requestGet(`/api/v1/resources/api/${apiId}/paths`);
      if (res) setResourcePaths(res);
    } catch (err) {
      console.error(err);
    }
  };

  const { mutate: createResourceMutate, isPending } = useCreateResource({
    onSuccess: () => {
      const resourcePath =
        pathPattern === '/'
          ? `${pathPattern}${createResourceForm.resourceName}`
          : `${pathPattern}/${createResourceForm.resourceName}`;
      setCreatedResourceId(`node-${resourcePath}`);
      toast.success('리소스가 생성되었습니다.');
      onOpenChange(false);
    },
    onError: (error: any) => {
      const serverMessage = error?.response?.data?.message ?? '리소스 생성에 실패하였습니다.';
      toast.error(serverMessage);
    },
  });

  const handleCreateResource = () => {
    const resourcePath =
      pathPattern === '/'
        ? `${pathPattern}${createResourceForm.resourceName}`
        : `${pathPattern}/${createResourceForm.resourceName}`;

    if (isValidInput(createResourceForm.resourceName)) {
      createResourceMutate({ ...createResourceForm, path: resourcePath });
    } else {
      toast.error('유효하지 않은 리소스 이름입니다.');
    }
  };

  const handleResourceNameChange = (value: string) => {
    if (isValidInput(value)) {
      setCheckUrl(false);
      setCreateResourceForm((prev) => ({ ...prev, resourceName: value }));
    } else {
      setCheckUrl(true);
    }
  };

  const handleDescriptionChange = (value: string) => {
    setCreateResourceForm((prev) => ({ ...prev, description: value }));
  };

  const handleEnableCorsChange = (checked: boolean) => {
    setCreateResourceForm((prev) => ({ ...prev, enableCors: checked }));
  };

  const handlePathPatternChange = (value: string) => {
    setPathPattern(value);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return {
    createResourceForm,
    resourcePaths,
    pathPattern,
    checkUrl,
    isPending,
    onCreateResource: handleCreateResource,
    onResourceNameChange: handleResourceNameChange,
    onDescriptionChange: handleDescriptionChange,
    onEnableCorsChange: handleEnableCorsChange,
    onPathPatternChange: handlePathPatternChange,
    onCancel: handleCancel,
  };
}
