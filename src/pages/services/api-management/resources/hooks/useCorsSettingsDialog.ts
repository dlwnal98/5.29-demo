import { useState, useEffect } from 'react';
import { useModifyResourceCorsSettings } from '@/hooks/use-resources';
import { toast } from 'sonner';
import type { Resource } from '@/types/resource';

export interface CorsForm {
  allowMethods: string[];
  allowHeaders: string[];
  allowOrigins: string[];
  exposeHeaders: string[];
  maxAge: number;
  allowCredentials: boolean;
}

interface UseCorsSettingsDialogProps {
  open: boolean;
  resourceId: string;
  userKey: string;
  selectedResource: Resource;
  onOpenChange: (open: boolean) => void;
  onCorsSettingsSaved?: () => void;
}

export function useCorsSettingsDialog({
  open,
  resourceId,
  userKey,
  selectedResource,
  onOpenChange,
  onCorsSettingsSaved,
}: UseCorsSettingsDialogProps) {
  const [corsForm, setCorsForm] = useState<CorsForm>({
    allowMethods: [],
    allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    allowOrigins: ['*'],
    exposeHeaders: ['X-Total-Count', 'X-Request-Id'],
    maxAge: 3600,
    allowCredentials: true,
  });

  useEffect(() => {
    if (!selectedResource?.cors) return;

    const cors = selectedResource.cors;

    setCorsForm({
      allowMethods: [],
      allowHeaders: Array.isArray(cors.allowHeaders)
        ? cors.allowHeaders
        : cors.allowHeaders
          ? cors.allowHeaders.split(',').map((s: string) => s.trim())
          : [],
      allowOrigins: Array.isArray(cors.allowOrigins)
        ? cors.allowOrigins
        : cors.allowOrigins
          ? cors.allowOrigins.split(',').map((s: string) => s.trim())
          : [],
      exposeHeaders: Array.isArray(cors.exposeHeaders)
        ? cors.exposeHeaders
        : cors.exposeHeaders
          ? cors.exposeHeaders.split(',').map((s: string) => s.trim())
          : [],
      maxAge: cors.maxAge ?? 3600,
      allowCredentials: cors.allowCredentials ?? true,
    });
  }, [selectedResource]);

  const { mutate: modifyCORSMutate, isPending } = useModifyResourceCorsSettings({
    onSuccess: () => {
      toast.success('리소스의 CORS 설정이 변경되었습니다.');
      onCorsSettingsSaved?.();
      onOpenChange(false);
    },
  });

  const handleSaveCorsSettings = () => {
    modifyCORSMutate({
      resourceId: resourceId,
      data: {
        allowedOrigins: corsForm.allowOrigins,
        allowedHeaders: corsForm.allowHeaders,
        allowedMethods: corsForm.allowMethods,
        exposedHeaders: corsForm.exposeHeaders,
        maxAge: corsForm.maxAge,
        allowCredentials: corsForm.allowCredentials,
        updatedBy: userKey,
      },
    });
  };

  const handleMethodToggle = (methodType: string, checked: boolean) => {
    setCorsForm((prev) => ({
      ...prev,
      allowMethods: checked
        ? [...new Set([...prev.allowMethods, methodType])]
        : prev.allowMethods.filter((m) => m !== methodType),
    }));
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

  return {
    corsForm,
    isPending,
    onSaveCorsSettings: handleSaveCorsSettings,
    onMethodToggle: handleMethodToggle,
    onCommaSeparatedInputChange: handleCommaSeparatedInputChange,
    onMaxAgeChange: handleMaxAgeChange,
    onAllowCredentialsChange: handleAllowCredentialsChange,
  };
}
