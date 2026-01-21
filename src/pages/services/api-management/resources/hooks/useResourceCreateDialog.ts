import { useState, useEffect } from 'react';
import { useCreateResource } from '@/hooks/use-resources';
import { toast } from 'sonner';
import { isValidInput } from '@/libs/etc';
import { getResourcePaths } from '@/apis/resources.api';
export interface CreateResourceForm {
  resourceName: string;
  description: string;
  parentPath: string;
  corsEnabled: boolean;
  parentResourceId: string;
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
    resourceName: '',
    description: '',
    parentPath: '/',
    corsEnabled: false,
    parentResourceId: '',
    createdBy: userKey ?? '',
  });

  const [resourcePaths, setResourcePaths] = useState<string[]>([]);
  const [resourcePathData, setResourcePathData] = useState<string[]>([]);
  const [pathPattern, setPathPattern] = useState('/');
  const [checkUrl, setCheckUrl] = useState(false);

  useEffect(() => {
    if (open) {
      setCreateResourceForm({
        resourceName: '',
        description: '',
        parentPath: '/',
        corsEnabled: false,
        parentResourceId: '',
        createdBy: userKey ?? '',
      });
      setPathPattern('/');
      setCheckUrl(false);
      arrangeResourcePaths();
    }
  }, [open, apiId, userKey]);

  const arrangeResourcePaths = async () => {
    try {
      const res = await getResourcePaths(apiId);
      if (res) {
        const paths = res.map((path: any) => path.resourcePath);
        setResourcePaths(paths);
        const pathData = res.map((data: any) => {
          return { resourcePath: data.resourcePath, resourceName: data.resourceName, parentResourceId: data.resourceId }
        });
        setResourcePathData(pathData);
      }
    } catch (err) {
      console.error(err);
    }
  };


  const { mutate: createResourceMutate, isPending } = useCreateResource(apiId, {
    onSuccess: () => {
      const resourcePath =
        pathPattern === '/'
          ? `${pathPattern}${createResourceForm.resourceName}`
          : `${pathPattern}/${createResourceForm.resourceName}`;
      setCreatedResourceId(`node-${resourcePath}`);
      toast.success('Resource가 성공적으로 생성되었습니다.');
      onOpenChange(false);
    },
    onError: (error: any) => {
      const serverMessage = error?.response?.data?.message ?? 'Resource 생성 중 오류가 발생했습니다.';
      toast.error(serverMessage);
    },
  });

  const handleCreateResource = () => {
    const parentResource = resourcePathData.find((data) => data?.resourcePath === pathPattern);

    if (isValidInput(createResourceForm.resourceName)) {
      createResourceMutate({ ...createResourceForm, parentPath: pathPattern, parentResourceId: parentResource?.parentResourceId });
    } else {
      toast.error('유효하지 않은 resource 이름 입니다.');
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
    setCreateResourceForm((prev) => ({ ...prev, corsEnabled: checked }));
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
