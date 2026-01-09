import { useState, useEffect } from 'react';
import { useModifyResourceCorsSettings } from '@/hooks/use-resources';
import { toast } from 'sonner';
import type { Resource } from '@/types/resource';
import { useGetResourceCorsSettings } from '@/hooks/use-resources';

export interface CorsForm {
  allowMethods: string[];
  allowHeaders: string[];
  allowOrigins: string[];
  exposeHeaders: string[];
  maxAge: number;
  allowCredentials: boolean;
  standardCompliant?: boolean;
  validHttpMethods?: boolean;
  corsEnabled: boolean;
}

interface UseCorsSettingsDialogProps {
  apiId: string;
  open: boolean;
  resourceId: string;
  userKey: string;
  selectedResource: Resource;
  onOpenChange: (open: boolean) => void;
  onCorsSettingsSaved?: () => void;
}

export function useCorsSettingsDialog({
  apiId,
  open,
  resourceId,
  userKey,
  selectedResource,
  onOpenChange,
  onCorsSettingsSaved,
}: UseCorsSettingsDialogProps) {

  const { data: corsSettings } = useGetResourceCorsSettings(apiId, selectedResource?.resourceId || '');

  const [corsForm, setCorsForm] = useState<CorsForm>({
    allowMethods: ['OPTIONS'],
    allowHeaders: [],
    allowOrigins: ['*'],
    exposeHeaders: [],
    maxAge: 3600,
    allowCredentials: false,
    corsEnabled: false,
  });
  const [checkedMethod, setCheckedMethod] = useState<string[]>([]);
  const [methodCheckList, setMethodCheckList] = useState<string[]>([]);

  console.log(corsSettings)
  console.log(selectedResource?.methods)


  useEffect(() => {
    // 체크박스 목록: selectedResource의 methods + OPTIONS (고정)
    const resourceMethods = selectedResource?.methods?.map((method) => method?.type) || [];
    const availableMethods = ['OPTIONS', ...resourceMethods.filter(m => m !== 'OPTIONS')];

    // 체크 상태: corsSettings에서 가져온 메서드들
    const checkedFromServer = corsSettings?.allowedMethods || [];

    setCheckedMethod(checkedFromServer);
    setMethodCheckList(availableMethods);
    setCorsForm({
      allowMethods: availableMethods,
      allowHeaders: corsSettings?.allowedHeaders || [],
      allowOrigins: corsSettings?.allowedOrigins || ['*'],
      exposeHeaders: corsSettings?.exposedHeaders || [],
      maxAge: corsSettings?.maxAge || 3600,
      allowCredentials: corsSettings?.allowCredentials || false,
      corsEnabled: selectedResource?.cors
    });
  }, [open, corsSettings, selectedResource]);

  console.log(checkedMethod, methodCheckList)


  const { mutate: modifyCORSMutate, isPending } = useModifyResourceCorsSettings({
    onSuccess: () => {
      toast.success('리소스의 CORS 설정이 변경되었습니다.');
      onCorsSettingsSaved?.();
      onOpenChange(false);
    }, onError: (data) => {
      console.log(data)
      toast.error(data?.response?.data?.errors?.[0]?.detail);
    }
  });

  const handleSaveCorsSettings = () => {
    modifyCORSMutate({
      apiId: apiId,
      resourceId: resourceId,
      data: {
        allowedOrigins: corsForm.allowOrigins,
        allowedHeaders: corsForm.allowHeaders,
        allowedMethods: corsForm.corsEnabled ? checkedMethod : corsForm.allowMethods,
        exposedHeaders: corsForm.exposeHeaders,
        maxAge: corsForm.maxAge,
        allowCredentials: corsForm.allowCredentials,
        corsEnabled: corsForm.corsEnabled,
      },
    });
  };

  const handleMethodToggle = (methodType: string, checked: boolean) => {
    // OPTIONS는 항상 포함되어야 함 (필수)
    if (methodType === 'OPTIONS') return;

    setCheckedMethod((prev) => {
      if (checked) {
        return prev.includes(methodType) ? prev : [...prev, methodType];
      } else {
        return prev.filter((m) => m !== methodType);
      }
    });
  };



  const handleCommaSeparatedInputChange = (
    value: string,
    key: 'allowHeaders' | 'allowOrigins' | 'exposeHeaders'
  ) => {
    const items = value.split(',').map((s) => s.trim());
    let newArray = items.filter(Boolean);

    if (value.endsWith(',')) {
      newArray.push('');
    }

    if (newArray.length > 0 && newArray[newArray.length - 1] === '' && !value.endsWith(',')) {
      newArray.pop();
    }

    setCorsForm((prev) => ({
      ...prev,
      [key]: newArray,
    }));
  };

  const handleMaxAgeChange = (value: string) => {
    setCorsForm((prev) => ({
      ...prev,
      maxAge: parseInt(value) || 0,
    }));
  };

  const handleAllowCredentialsChange = (checked: boolean) => {
    setCorsForm((prev) => ({
      ...prev,
      allowCredentials: checked,
    }));
  };


  const handleCorsEnabledChange = (checked: boolean) => {
    console.log(checked)
    setCorsForm((prev) => ({
      ...prev,
      corsEnabled: checked,
    }));
  };


  return {
    corsForm,
    checkedMethod,
    methodCheckList,
    isPending,
    onSaveCorsSettings: handleSaveCorsSettings,
    onMethodToggle: handleMethodToggle,
    onCommaSeparatedInputChange: handleCommaSeparatedInputChange,
    onMaxAgeChange: handleMaxAgeChange,
    onAllowCredentialsChange: handleAllowCredentialsChange,
    onCorsEnabledChange: handleCorsEnabledChange,
  };
}
