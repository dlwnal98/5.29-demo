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

  // displayMethods: 서버에서 가져온 원본 데이터 (UI 표시 참조용, 변경 안 함)
  const [displayMethods, setDisplayMethods] = useState<string[]>([]);
  // selectedMethods: 사용자가 선택한 값 (체크박스 상태, API 전송용)
  const [selectedMethods, setSelectedMethods] = useState<string[]>([]);

  useEffect(() => {
    // 다이얼로그가 닫혀있으면 초기화하지 않음
    if (!open) return;

    // 1. 체크박스 목록: selectedResource의 methods + OPTIONS (고정)
    const resourceMethods = selectedResource?.methods?.map((method) => method?.type) || [];
    const availableMethods = ['OPTIONS', ...resourceMethods.filter(m => m !== 'OPTIONS')];

    // 2. 서버 데이터 가져오기
    // corsSettings가 배열일 수 있으므로 처리
    const serverData = Array.isArray(corsSettings) ? corsSettings[0] : corsSettings;

    // 3. 체크 상태: CORS가 활성화된 경우에만 서버 값 사용
    // cors 객체가 존재하면 CORS가 활성화된 것으로 간주
    const isCorEnabled = !!selectedResource?.cors;

    // API 응답 프로퍼티명이 allowMethods 또는 allowedMethods일 수 있음
    const serverAllowMethods = (serverData as any)?.allowMethods
      || (serverData as any)?.allowedMethods
      || [];
    const serverAllowHeaders = (serverData as any)?.allowHeaders
      || (serverData as any)?.allowedHeaders
      || [];
    const serverAllowOrigins = (serverData as any)?.allowOrigins
      || (serverData as any)?.allowedOrigins
      || ['*'];
    const serverExposeHeaders = (serverData as any)?.exposeHeaders
      || (serverData as any)?.exposedHeaders
      || [];

    const checkedFromServer = isCorEnabled ? serverAllowMethods : [];

    // displayMethods: 서버 원본 데이터 저장 (참조용)
    setDisplayMethods(checkedFromServer);
    // selectedMethods: 사용자 선택용으로 초기화 (이후 사용자가 변경)
    setSelectedMethods(checkedFromServer);
    setCorsForm({
      allowMethods: availableMethods,
      allowHeaders: serverAllowHeaders,
      allowOrigins: Array.isArray(serverAllowOrigins) ? serverAllowOrigins : [serverAllowOrigins],
      exposeHeaders: serverExposeHeaders,
      maxAge: serverData?.maxAge || 3600,
      allowCredentials: serverData?.allowCredentials || false,
      corsEnabled: isCorEnabled,
    });
  }, [open, corsSettings, selectedResource]);


  const { mutate: modifyCORSMutate, isPending } = useModifyResourceCorsSettings({
    onSuccess: () => {
      toast.success('CORS 설정이 성공적으로 수정되었습니다.');
      onCorsSettingsSaved?.();
      onOpenChange(false);
    }, onError: (error: any) => {
      toast.error(error?.response?.data?.errors?.[0]?.detail || 'CORS 설정 수정 중 오류가 발생했습니다.');
    }
  });

  const handleSaveCorsSettings = () => {
    // CORS 비활성화 시 필수값 고정
    const dataToSend = corsForm.corsEnabled
      ? {
        // CORS 활성화: 사용자가 선택한 값 사용
        allowedOrigins: corsForm.allowOrigins,
        allowedHeaders: corsForm.allowHeaders,
        allowedMethods: selectedMethods,  // 사용자가 선택한 메서드 전송
        exposedHeaders: corsForm.exposeHeaders,
        maxAge: corsForm.maxAge,
        allowCredentials: corsForm.allowCredentials,
        corsEnabled: true,
      }
      : {
        // CORS 비활성화: 필수값 고정 (빈값 허용 안함)
        allowedOrigins: ['*'],
        allowedHeaders: [],
        allowedMethods: ['OPTIONS'],
        exposedHeaders: [],
        maxAge: 3600,
        allowCredentials: false,
        corsEnabled: false,
      };

    modifyCORSMutate({
      apiId: apiId,
      resourceId: selectedResource?.resourceId || resourceId,
      data: dataToSend,
    });
  };



  const handleMethodToggle = (methodType: string, checked: boolean) => {
    // 사용자가 체크박스를 클릭하면 selectedMethods 업데이트
    setSelectedMethods((prev) => {
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
    setCorsForm((prev) => ({
      ...prev,
      corsEnabled: checked,
    }));
  };


  return {
    corsForm,
    displayMethods,    // 서버 원본 데이터 (참조용)
    selectedMethods,   // 사용자가 선택한 값 (체크박스 상태, API 전송용)
    isPending,
    onSaveCorsSettings: handleSaveCorsSettings,
    onMethodToggle: handleMethodToggle,
    onCommaSeparatedInputChange: handleCommaSeparatedInputChange,
    onMaxAgeChange: handleMaxAgeChange,
    onAllowCredentialsChange: handleAllowCredentialsChange,
    onCorsEnabledChange: handleCorsEnabledChange,
  };
}
