import { useState, useRef, useMemo, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { QueryParameter, Header } from "@/types/methods";
import { useAuthStore } from "@/stores/store";
import { useGetAPIKeyList } from "@/hooks/use-apiKeys";
import { useCreateMethod } from "@/hooks/use-methods";
import { useGetModelList } from "@/hooks/use-model";
import { useGetEndpointsList } from "@/hooks/use-endpoints";
import { useGetOpenAPIDoc } from "@/hooks/use-resources";
import { useClipboard } from "use-clipboard-copy";
import { onInputChange, onSave, resoureceBuildTree } from "@/libs/etc";
import { useQueryClient } from "@tanstack/react-query";
import { getValidatorList, getIntegrationTypeList } from "@/apis/methods.api";
import { getAPIKeyDetail } from "@/apis/api-keys.api";
import { exampleMethodList } from "@/constants/data";

interface MethodForm {
  summary: string;
  description: string;
  methodType: string;
  integrationType: string;
  apiKeyRequired: boolean;
  selectedApiKeyValue: string;
  endpointUrl: string;
  additionalParameter: string;
  customEndpointUrl: string;
  requestValidator: string;
  routingMode: string;
}

interface OpenSections {
  methodRequest: boolean;
  urlQuery: boolean;
  httpHeaders: boolean;
  requestBody: boolean;
}

interface NewApiKeyForm {
  name: string;
  description: string;
}

export function useCreateMethodPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const resourceId = searchParams.get("resourceId") || "";
  const resourcePath = searchParams.get("resourcePath") || "";
  const userData = useAuthStore((state) => state.user);
  const userKey = userData?.userKey || "";
  const apiId = sessionStorage.getItem("selectedApiId") || "";
  const apiName = sessionStorage.getItem("selectedApiName") || "";
  const clipboard = useClipboard();
  const tenantId = userData?.organizationId ?? "kwwwksAsvmas";


  const { data: apiKeyList = [] } = useGetAPIKeyList(tenantId);
  const { data: endpointList = [] } = useGetEndpointsList(tenantId);
  const { data: modelList } = useGetModelList(apiId, 0, 20);
  const { data: openAPIDocData } = useGetOpenAPIDoc(apiId);

  const queryClient = useQueryClient();

  // 현재 리소스의 기존 메서드 목록 계산
  const availableMethodList = useMemo(() => {
    if (!openAPIDocData?.paths || !resourceId) {
      return exampleMethodList;
    }

    const tree = resoureceBuildTree(openAPIDocData.paths);

    // 트리에서 해당 resourceId를 가진 리소스 찾기
    const findResourceById = (nodes: any[]): any | null => {
      for (const node of nodes) {
        if (node.resourceId === resourceId) {
          return node;
        }
        if (node.children && node.children.length > 0) {
          const found = findResourceById(node.children);
          if (found) return found;
        }
      }
      return null;
    };

    const currentResource = findResourceById(tree);
    const existingMethods = currentResource?.methods?.map((m: any) => m.type?.toUpperCase()) || [];

    // 기존 메서드를 제외한 사용 가능한 메서드 목록 반환
    return exampleMethodList.filter(
      (method) => !existingMethods.includes(method.value.toUpperCase())
    );
  }, [openAPIDocData?.paths, resourceId]);

  const [methodForm, setMethodForm] = useState<MethodForm>({
    summary: "",
    description: "",
    methodType: "",
    integrationType: "HTTP",
    apiKeyRequired: false,
    selectedApiKeyValue: "",
    endpointUrl: "",
    additionalParameter: "",
    customEndpointUrl: "",
    requestValidator: "NONE",
    routingMode: "PATH_APPEND"
  });

  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isDirectUrlInput, setIsDirectUrlInput] = useState(false);
  const [selectedApiKeyId, setSelectedApiKeyId] = useState("");
  const [selectedApiKeyValue, setSelectedApiKeyValue] = useState("");
  const [apiKeyToggle, setApiKeyToggle] = useState(false);
  const [isCreatingNewApiKey, setIsCreatingNewApiKey] = useState(false);
  const [newApiKeyForm, setNewApiKeyForm] = useState<NewApiKeyForm>({
    name: "",
    description: "",
  });
  const [checkUrl, setCheckUrl] = useState(false);

  const [openSections, setOpenSections] = useState<OpenSections>({
    methodRequest: false,
    urlQuery: false,
    httpHeaders: false,
    requestBody: false,
  });

  const [queryParameters, setQueryParameters] = useState<QueryParameter[]>([]);
  const [headers, setHeaders] = useState<Header[]>([]);
  const [bodyModelId, setBodyModelId] = useState<string>("");
  const [validatorList, setValidatorList] = useState<
    Array<{ code: string; description: string }>
  >([]);
  const [integrationTypeList, setIntegrationTypeList] = useState<
    Array<{ code: string; description: string }>
  >([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [paramCounter, setParamCounter] = useState(0);
  const nextHeaderIdRef = useRef<number>(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleGetValidatorList = async () => {
    const res = await getValidatorList();
    return setValidatorList(res);
  };

  const handleGetIntegrationTypeList = async () => {
    const res = await getIntegrationTypeList();
    return setIntegrationTypeList(res);
  };

  useEffect(() => {
    handleGetValidatorList();
    handleGetIntegrationTypeList();
  }, []);

  const handleCancel = useCallback(() => {
    navigate(`/services/api-management/resources?apiId=${apiId}&apiName=${apiName}`);
  }, [apiId, apiName, navigate]);

  const handleBack = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ["getOpenAPIDoc", apiId] });
    await queryClient.refetchQueries({ queryKey: ["getOpenAPIDoc", apiId] });
    navigate(`/services/api-management/resources?apiId=${apiId}&apiName=${apiName}`);
  }, [apiId, apiName, navigate, queryClient]);

  const { mutate: createMethod } = useCreateMethod({
    onSuccess: (data) => {
      if (data?.methodId || data?.id) {
        sessionStorage.setItem("createdMethodId", data.methodId || data.id);
      }
      handleBack();
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message
        || error?.response?.data?.detail
        || error?.message
        || 'Method 생성 중 오류가 발생했습니다.';
      toast.error(errorMessage);
    },
  });

  const handleCreateMethod = useCallback(() => {
    setIsSubmitted(true);

    if (!methodForm.summary) {
      toast.error("요약을 입력해주세요.");
      return;
    }

    if (!methodForm.methodType) {
      toast.error("메소드 유형을 선택해주세요.");
      return;
    }

    if (methodForm.integrationType === "HTTP") {
      const finalUrl = isDirectUrlInput
        ? methodForm.customEndpointUrl
        : methodForm.endpointUrl;
      if (!finalUrl) {
        toast.error("Endpoint URL을 입력해주세요.");
        return;
      }
    }

    if (resourceId) {
      if (isDirectUrlInput) {
        if (onSave(methodForm.customEndpointUrl)) {
          createMethod({
            data: {
              createdBy: userKey,
              httpMethod: methodForm.methodType,
              summary: methodForm.summary,
              description: methodForm.description,
              integrationType: methodForm.integrationType,
              apiKeyId: selectedApiKeyId,
              apiKeyRequired: apiKeyToggle,
              routingEndpoint: methodForm.customEndpointUrl || methodForm.endpointUrl,
              routingMode: methodForm.routingMode,
              requestBodyConfig: bodyModelId ? {
                modelId: bodyModelId,
                required: false,
              } : undefined,
              queryParameters,
              headerParameters: headers,
              requestValidation: methodForm.requestValidator,
            },
            apiId,
            resourceId
          });
        } else {
          toast.error("유효하지 않은 endpoint URL입니다.");
        }
      } else {
        createMethod({
          data: {
            createdBy: userKey,
            httpMethod: methodForm.methodType,
            summary: methodForm.summary,
            description: methodForm.description,
            integrationType: methodForm.integrationType,
            apiKeyId: selectedApiKeyId,
            apiKeyRequired: apiKeyToggle,
            routingEndpoint: methodForm.customEndpointUrl || methodForm.endpointUrl,
            routingMode: methodForm.routingMode,
            requestBodyConfig: bodyModelId ? {
              modelId: bodyModelId,
              required: false,
            } : undefined,
            queryParameters,
            headerParameters: headers,
            requestValidation: methodForm.requestValidator,
          },
          apiId,
          resourceId
        });
      }
    }
  }, [
    methodForm,
    isDirectUrlInput,
    resourceId,
    userKey,
    selectedApiKeyId,
    apiKeyToggle,
    bodyModelId,
    queryParameters,
    headers,
    createMethod,
  ]);

  const toggleSection = useCallback((section: keyof OpenSections) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  }, []);


  const handleApiKeyToggle = useCallback((checked: boolean) => {
    setIsCreatingNewApiKey(false);
    setNewApiKeyForm({ name: "", description: "" });
    if (checked) {
      setIsApiKeyModalOpen(true);
    } else {
      setApiKeyToggle(false);
    }
  }, []);

  const addQueryParameter = useCallback(() => {
    const newParam: QueryParameter = {
      id: (paramCounter + 1).toString(),
      name: "",
      required: false,
    };
    setQueryParameters((prev) => [...prev, newParam]);
    setParamCounter((prev) => prev + 1);
  }, [paramCounter]);

  const updateQueryParameter = useCallback(
    (id: string, field: keyof QueryParameter, value: unknown) => {
      setQueryParameters((prev) =>
        prev.map((param) => (param.id === id ? { ...param, [field]: value } : param))
      );
    },
    []
  );

  const removeQueryParameter = useCallback((id: string) => {
    setQueryParameters((prev) => prev.filter((param) => param.id !== id));
  }, []);

  const addHeader = useCallback(() => {
    const id = nextHeaderIdRef.current++;
    const newHeader: Header = {
      id,
      name: "",
      required: false,
    };
    setHeaders((prev) => [...prev, newHeader]);
  }, []);

  const updateHeader = useCallback(
    (id: string | number, field: keyof Header, value: unknown) => {
      setHeaders((prev) =>
        prev.map((header) =>
          header.id === id ? { ...header, [field]: value } : header
        )
      );
    },
    []
  );

  const removeHeader = useCallback((id: number) => {
    setHeaders((prev) => prev.filter((h) => h.id !== id));
  }, []);

  const handleCopyAPIKey = useCallback(
    (apiKey: string) => {
      clipboard.copy(apiKey);
      toast.success("API Key가 클립보드에 복사되었습니다.");
    },
    [clipboard]
  );

  const handleMethodFormChange = useCallback(
    (field: keyof MethodForm, value: string | boolean) => {
      setMethodForm((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleCustomUrlChange = useCallback((value: string) => {
    if (onInputChange(value)) {
      setCheckUrl(false);
      setMethodForm((prev) => ({ ...prev, customEndpointUrl: value }));
    } else {
      setCheckUrl(true);
    }
  }, []);

  const handleDirectUrlToggle = useCallback((checked: boolean) => {
    if (checked) {
      setMethodForm((prev) => ({
        ...prev,
        routingMode: "DIRECT",
      }));
    } else {
      setMethodForm((prev) => ({
        ...prev,
        routingMode: "PATH_APPEND",
      }));
    }
    setMethodForm((prev) => ({
      ...prev,
      customEndpointUrl: "",
      endpointUrl: "",
    }));
    setIsDirectUrlInput(checked);
  }, []);

  return {
    // Data
    resourcePath,
    userKey,
    tenantId,
    apiKeyList,
    endpointList,
    modelList: modelList?.content,
    validatorList,
    integrationTypeList,
    availableMethodList,

    // Form state
    methodForm,
    isDirectUrlInput,
    selectedApiKeyValue,
    selectedApiKeyId,
    apiKeyToggle,
    checkUrl,
    openSections,
    queryParameters,
    headers,
    bodyModelId,
    openId,
    isApiKeyModalOpen,
    isCreatingNewApiKey,
    newApiKeyForm,
    isSubmitted,

    // Setters
    setMethodForm,
    setSelectedApiKeyValue,
    setSelectedApiKeyId,
    setApiKeyToggle,
    setIsApiKeyModalOpen,
    setIsCreatingNewApiKey,
    setNewApiKeyForm,
    setBodyModelId,
    setOpenId,

    // Handlers
    onBack: handleBack,
    onCancel: handleCancel,
    onCreateMethod: handleCreateMethod,
    onToggleSection: toggleSection,
    onApiKeyToggle: handleApiKeyToggle,
    onAddQueryParameter: addQueryParameter,
    onUpdateQueryParameter: updateQueryParameter,
    onRemoveQueryParameter: removeQueryParameter,
    onAddHeader: addHeader,
    onUpdateHeader: updateHeader,
    onRemoveHeader: removeHeader,
    onCopyAPIKey: handleCopyAPIKey,
    onMethodFormChange: handleMethodFormChange,
    onCustomUrlChange: handleCustomUrlChange,
    onDirectUrlToggle: handleDirectUrlToggle,
  };
}
