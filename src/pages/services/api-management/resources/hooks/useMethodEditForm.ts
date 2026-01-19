import { useState, useEffect } from 'react';
import { Method } from '@/types/resource';
import { ModifyMethodProps } from '@/apis/methods.api';
import { getIntegrationTypeList, getValidatorList } from '@/apis/methods.api';

export interface MethodFormData {
  // 기본 정보
  summary: string;
  description: string;
  tags: string[];
  integrationType: string;
  routingEndpoint: string;

  // Direct Input 토글 관련 필드
  isDirectUrlInput: boolean;      // Direct Input 토글 상태
  selectedEndpointUrl: string;    // Select에서 선택한 Endpoint URL
  routingMode: string;            // "DIRECT" | "PATH_APPEND"

  // 요청 설정
  requestValidation: string;
  apiKeyRequired: boolean;
  apiKeyId: string;
  pathParameters: Array<{
    name: string;
    in: string;
    required: boolean;
    description: string;
    schema: { type: string };
  }>;
  queryParameters: Array<{
    name: string;
    in: string;
    required: boolean;
    description: string;
    schema: { type: string; default?: boolean };
  }>;
  headerParameters: Array<{
    name: string;
    in: string;
    required: boolean;
    description: string;
    schema: { type: string; format?: string };
  }>;
  requestBodyConfig: {
    modelId: string;
    required: boolean;
    description: string;
  };

  // 응답 설정
  responses: Array<{
    statusCode: string;
    description: string;
    modelId?: string;
    headers: Array<{
      name: string;
      description: string;
      required: boolean;
    }>;
  }>;

  updatedBy: string;
}

export interface IntegrationTypeOption {
  code: string;
  description: string;
}

export interface ValidatorOption {
  code: string;
  description: string;
}

export function useMethodEditForm(selectedMethod: Method | null, userKey: string) {
  const [formData, setFormData] = useState<MethodFormData>(() => getInitialFormData(selectedMethod, userKey));
  const [integrationTypeList, setIntegrationTypeList] = useState<IntegrationTypeOption[]>([]);
  const [validatorList, setValidatorList] = useState<ValidatorOption[]>([]);
  const [isDirty, setIsDirty] = useState(false);

  // 통합 유형 목록 조회
  useEffect(() => {
    const fetchIntegrationTypes = async () => {
      try {
        const res = await getIntegrationTypeList();
        setIntegrationTypeList(res);
      } catch (error) {
        console.error('Failed to fetch integration types:', error);
      }
    };
    fetchIntegrationTypes();
  }, []);

  // 요청 검사기 목록 조회
  useEffect(() => {
    const fetchValidators = async () => {
      try {
        const res = await getValidatorList();
        setValidatorList(res);
      } catch (error) {
        console.error('Failed to fetch validators:', error);
      }
    };
    fetchValidators();
  }, []);

  // selectedMethod가 변경되면 폼 데이터 초기화
  useEffect(() => {
    if (selectedMethod) {
      setFormData(getInitialFormData(selectedMethod, userKey));
      setIsDirty(false);
    }
  }, [selectedMethod, userKey]);

  const updateFormData = (updates: Partial<MethodFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
    setIsDirty(true);
  };

  const updateBasicInfo = (updates: Partial<Pick<MethodFormData, 'summary' | 'description' | 'tags' | 'integrationType' | 'routingEndpoint' | 'isDirectUrlInput' | 'selectedEndpointUrl' | 'routingMode'>>) => {
    updateFormData(updates);
  };

  const updateRequestSettings = (updates: Partial<Pick<MethodFormData, 'requestValidation' | 'apiKeyRequired' | 'apiKeyId' | 'pathParameters' | 'queryParameters' | 'headerParameters' | 'requestBodyConfig'>>) => {
    updateFormData(updates);
  };

  const updateResponseSettings = (updates: Partial<Pick<MethodFormData, 'responses'>>) => {
    updateFormData(updates);
  };

  const resetForm = () => {
    setFormData(getInitialFormData(selectedMethod, userKey));
    setIsDirty(false);
  };

  const getModifyMethodProps = (): ModifyMethodProps => {
    return {
      summary: formData.summary,
      description: formData.description,
      tags: formData.tags,
      integrationType: formData.integrationType,
      routingEndpoint: formData.routingEndpoint,
      routingMode: formData.routingMode,
      requestValidation: formData.requestValidation,
      apiKeyRequired: formData.apiKeyRequired,
      apiKeyId: formData.apiKeyId,
      pathParameters: formData.pathParameters as ModifyMethodProps['pathParameters'],
      queryParameters: formData.queryParameters as ModifyMethodProps['queryParameters'],
      headerParameters: formData.headerParameters as ModifyMethodProps['headerParameters'],
      requestBodyConfig: formData.requestBodyConfig,
      responses: formData.responses as ModifyMethodProps['responses'],
      updatedBy: formData.updatedBy,
    };
  };

  return {
    formData,
    setFormData,
    updateFormData,
    updateBasicInfo,
    updateRequestSettings,
    updateResponseSettings,
    resetForm,
    getModifyMethodProps,
    integrationTypeList,
    validatorList,
    isDirty,
  };
}

function getInitialFormData(selectedMethod: Method | null, userKey: string): MethodFormData {
  if (!selectedMethod) {
    return {
      summary: '',
      description: '',
      tags: [],
      integrationType: 'HTTP',
      routingEndpoint: '',
      isDirectUrlInput: false,
      selectedEndpointUrl: '',
      routingMode: 'PATH_APPEND',
      requestValidation: 'NONE',
      apiKeyRequired: false,
      apiKeyId: '',
      pathParameters: [],
      queryParameters: [],
      headerParameters: [],
      requestBodyConfig: { modelId: '', required: false, description: '' },
      responses: [],
      updatedBy: userKey,
    };
  }

  const info = selectedMethod.info as any;
  const params = info?.parameters ?? [];

  // 쿼리 파라미터 추출
  const queryParams = params
    .filter((param: any) => param.in?.trim().toLowerCase() === 'query')
    .map((p: any) => ({
      name: p.name || '',
      in: 'query',
      required: p.required || false,
      description: p.description || '',
      schema: p.schema || { type: 'string' },
    }));

  // 헤더 파라미터 추출
  const headerParams = params
    .filter((param: any) => param.in?.trim().toLowerCase() === 'header')
    .map((p: any) => ({
      name: p.name || '',
      in: 'header',
      required: p.required || false,
      description: p.description || '',
      schema: p.schema || { type: 'string' },
    }));

  // 패스 파라미터 추출
  const pathParams = params
    .filter((param: any) => param.in?.trim().toLowerCase() === 'path')
    .map((p: any) => ({
      name: p.name || '',
      in: 'path',
      required: p.required || true,
      description: p.description || '',
      schema: p.schema || { type: 'string' },
    }));

  // 요청 본문 모델 ID 추출 (x-model-id 필드 사용)
  let requestModelId = '';
  // 1. 메서드 레벨에서 x-model-id 확인
  if (info?.['x-model-id']) {
    requestModelId = info['x-model-id'];
  }
  // 2. requestBody 레벨에서 x-model-id 확인
  else if (info?.requestBody?.['x-model-id']) {
    requestModelId = info.requestBody['x-model-id'];
  }
  // 3. requestBody에서 $ref 파싱
  else if (info?.requestBody) {
    const ref = info.requestBody?.content?.['application/json']?.schema?.$ref;
    if (ref) {
      const match = ref.match(/\/schemas\/([^\/]+)$/);
      requestModelId = match ? match[1] : '';
    }
  }
  // 응답 추출
  const responses: MethodFormData['responses'] = [];
  if (info.responses) {
    Object.entries(info.responses).forEach(([statusCode, response]: [string, any]) => {
      let modelId = '';
      if (response?.content?.['application/json']?.schema?.$ref) {
        const match = response.content['application/json'].schema.$ref.match(/\/schemas\/([^\/]+)$/);
        modelId = match ? match[1] : '';
      }
      // 응답 헤더 추출
      const headers: MethodFormData['responses'][0]['headers'] = [];
      if (response?.headers) {
        Object.entries(response.headers).forEach(([headerName, headerInfo]: [string, any]) => {
          headers.push({
            name: headerName,
            description: headerInfo?.description || '',
            required: headerInfo?.required || false,
          });
        });
      }
      responses.push({
        statusCode,
        description: response?.description || '',
        modelId,
        headers,
      });
    });
  }

  // x-append-path 기반으로 isDirectUrlInput 결정
  // x-append-path가 true면 isDirectUrlInput = false (Select 모드)
  // x-append-path가 false면 isDirectUrlInput = true (Direct Input 모드)
  const appendPath = info?.['x-append-path'] ?? true;  // 기본값 true
  const isDirectUrlInput = !appendPath;
  const routingMode = isDirectUrlInput ? 'DIRECT' : 'PATH_APPEND';
  const routingEndpoint = info?.['x-route-endpoint'] ?? '';

  return {
    summary: info?.summary ?? '',
    description: info?.description ?? '',
    tags: info?.tags ?? [],
    integrationType: info?.['x-integration-type'] ?? 'HTTP',
    routingEndpoint,
    isDirectUrlInput,
    selectedEndpointUrl: isDirectUrlInput ? '' : routingEndpoint,
    routingMode,
    requestValidation: info?.['x-request-validator'] ?? 'NONE',
    apiKeyRequired: info?.['x-api-key-required'] ?? false,
    apiKeyId: info?.['x-api-key-id'] ?? '',
    pathParameters: pathParams,
    queryParameters: queryParams,
    headerParameters: headerParams,
    requestBodyConfig: {
      modelId: requestModelId,
      required: info.requestBody?.required ?? false,
      description: info.requestBody?.description ?? '',
    },
    responses,
    updatedBy: userKey,
  };
}
