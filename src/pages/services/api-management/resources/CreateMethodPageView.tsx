import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Copy,
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  Globe,
  Trash2,
  CheckCircle,
  DockIcon,
  HelpCircle,
  Dock,
  DiamondIcon,
  BellElectricIcon,
  ContainerIcon,
} from "lucide-react";
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@radix-ui/react-tooltip";
import { QueryParameter, Header } from "@/types/methods";
import RequestHeaderListSearch from "../models/components/RequestHeaderListSearch";
import { ModelData } from "@/apis/models.api";
import { EndpointsData } from "@/apis/route-endpoints.api";

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
}

interface OpenSections {
  methodRequest: boolean;
  urlQuery: boolean;
  httpHeaders: boolean;
  requestBody: boolean;
}

interface CreateMethodPageViewProps {
  resourcePath: string;
  endpointList: EndpointsData[];
  modelList: ModelData[];
  validatorList: Array<{ code: string; description: string }>;
  integrationTypeList: Array<{ code: string; description: string }>;
  availableMethodList: Array<{ id: number; label: string; value: string }>;
  methodForm: MethodForm;
  isDirectUrlInput: boolean;
  selectedApiKeyValue: string;
  apiKeyToggle: boolean;
  checkUrl: boolean;
  openSections: OpenSections;
  queryParameters: QueryParameter[];
  headers: Header[];
  bodyModelId: string;
  openId: string | null;
  isSubmitted: boolean;
  setBodyModelId: (id: string) => void;
  setOpenId: (id: string | null) => void;
  onBack: () => void;
  onCancel: () => void;
  onCreateMethod: () => void;
  onToggleSection: (section: keyof OpenSections) => void;
  onApiKeyToggle: (checked: boolean) => void;
  onAddQueryParameter: () => void;
  onUpdateQueryParameter: (
    id: string,
    field: keyof QueryParameter,
    value: unknown
  ) => void;
  onRemoveQueryParameter: (id: string) => void;
  onAddHeader: () => void;
  onUpdateHeader: (
    id: string | number,
    field: keyof Header,
    value: unknown
  ) => void;
  onRemoveHeader: (id: number) => void;
  onCopyAPIKey: (apiKey: string) => void;
  onMethodFormChange: (field: keyof MethodForm, value: string | boolean) => void;
  onCustomUrlChange: (value: string) => void;
  onDirectUrlToggle: (checked: boolean) => void;
}

export default function CreateMethodPageView({
  resourcePath,
  endpointList,
  modelList,
  validatorList,
  integrationTypeList,
  availableMethodList,
  methodForm,
  isDirectUrlInput,
  selectedApiKeyValue,
  apiKeyToggle,
  checkUrl,
  openSections,
  queryParameters,
  headers,
  bodyModelId,
  openId,
  isSubmitted,
  setBodyModelId,
  setOpenId,
  onBack,
  onCancel,
  onCreateMethod,
  onToggleSection,
  onApiKeyToggle,
  onAddQueryParameter,
  onUpdateQueryParameter,
  onRemoveQueryParameter,
  onAddHeader,
  onUpdateHeader,
  onRemoveHeader,
  onCopyAPIKey,
  onMethodFormChange,
  onCustomUrlChange,
  onDirectUrlToggle,
}: CreateMethodPageViewProps) {


  return (
    <div className="container mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/services">Services</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/services/api-management">
              API Management
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/services/api-management/resources">
              Resources
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Method 생성</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Method 생성</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Resource: <span className="font-mono text-blue-600">{resourcePath}</span>
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            취소
          </Button>
          <Button onClick={onCreateMethod}>
            생성
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="space-y-6">
          <Card>
            <div className="pt-7"></div>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="new-method-name" className="text-[16px] font-semibold mb-4">
                    요약 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="new-method-name"
                    placeholder="e.g. 사용자 정보 조회"
                    type="text"
                    value={methodForm.summary}
                    onChange={(e) => onMethodFormChange("summary", e.target.value)}
                    className={`mt-1 lg:w-2/3 ${isSubmitted && !methodForm.summary ? 'border-red-500' : ''}`}
                  />
                </div>


              </div>
              <div>
                <div>
                  <Label
                    htmlFor="new-method-description"
                    className="text-[16px] font-semibold mb-4"
                  >
                    설명
                  </Label>
                  <Textarea
                    id="new-method-description"
                    placeholder="Method 설명을 입력해주세요."
                    value={methodForm.description}
                    onChange={(e) => onMethodFormChange("description", e.target.value)}
                    className="mt-1 min-h-[80px] lg:w-2/3"
                  />
                </div>
              </div>
              <div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="method-type" className="text-[16px] font-semibold mb-4">
                      유형 <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={methodForm.methodType}
                      onValueChange={(value) => onMethodFormChange("methodType", value)}
                    >
                      <SelectTrigger className={`mt-2 w-full lg:w-2/3 ${isSubmitted && !methodForm.methodType ? 'border-red-500' : ''}`}>
                        <SelectValue placeholder="Method 유형" />
                      </SelectTrigger>
                      <SelectContent className="hover:cursor-pointer">
                        {availableMethodList.map((method) => (
                          <SelectItem
                            key={method.value}
                            className="hover:cursor-pointer"
                            value={method.value}
                          >
                            {method.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-[16px] font-semibold mb-4">
                  통합 유형 <span className="text-red-500">*</span>
                </h3>
                <RadioGroup
                  value={methodForm.integrationType}
                  onValueChange={(value) => onMethodFormChange("integrationType", value)}
                  // 1. space-y-4 대신 gap을 사용하고, items-stretch로 자식 높이를 통일합니다.
                  className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 space-y-0"
                >
                  {integrationTypeList?.map((integration) => (
                    <div
                      className={`border rounded-lg p-4 transition-all h-full flex flex-col justify-center ${ // 2. h-full 및 중앙 정렬 추가
                        integration.code === "HTTP"
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                          : integration.code === "MOCK"
                            ? "border-purple-500 bg-purple-50 dark:bg-purple-950/20"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                    >
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value={integration.code} id={integration.code} />
                        <Label htmlFor={integration.code} className="flex-1 cursor-pointer font-normal">
                          <div className="flex items-center gap-3">
                            {
                              integration.code === "HTTP"
                                ? <Globe className="h-8 w-8 text-blue-500" />
                                : integration.code === "MOCK"
                                  ? <DiamondIcon className="h-8 w-8 text-purple-500" />
                                  : <Globe className="h-8 w-8 text-gray-500" />
                            }

                            <div>
                              <div className="text-base font-medium text-foreground">{integration.code}</div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {integration.description}
                              </p>
                            </div>
                          </div>
                        </Label>
                      </div>
                    </div>
                  ))}

                </RadioGroup>
              </div>

              {methodForm.integrationType === "HTTP" && (
                <div className="space-y-6">
                  {/* API Key Toggle */}
                  <div>
                    <div className="flex items-center mb-3 gap-3">
                      <div>
                        <Label className="text-[16px] font-semibold mb-4">API Key 설정</Label>
                      </div>
                      <Switch checked={apiKeyToggle} onCheckedChange={onApiKeyToggle} />
                    </div>

                    {apiKeyToggle && (
                      <div className="mt-4 p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 rounded-lg">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold text-green-900 dark:text-green-100">
                                선택된 API Key
                              </h4>
                              <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs rounded-full font-medium">
                                Activated
                              </span>
                              <button
                                className="hover:underline"
                                onClick={() => onCopyAPIKey(selectedApiKeyValue)}
                              >
                                <Copy className="h-4 w-4 ml-2" />
                              </button>
                            </div>
                            <p className="text-red-500 text-xs mb-2">
                              HTTP(S) 헤더에 <strong>X-API-Key</strong> 필드를 추가하고,
                              복사한 키 값을 요청에 포함하세요.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <Label className="text-[16px] font-semibold">
                        Route Endpoint URL <span className="text-red-500">*</span>
                      </Label>
                      <div className="flex items-center gap-2">
                        <Label className="text-sm text-gray-600">직접 입력</Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent side="top" className=" relative top-[-10px] left-[60px] w-80 p-3 bg-slate-900 text-slate-50 shadow-xl border-none">
                              <div className="space-y-2 text-xs leading-relaxed">
                                <p className="font-semibold text-blue-400 border-b border-slate-700 pb-1 mb-2">
                                  Route Endpoint URL 가이드
                                </p>
                                <div className="flex gap-2">
                                  <span className="text-blue-400">•</span>
                                  <p>
                                    <strong>활성화 시:</strong> Routing Endpoint를 수정 없이 그대로 백엔드에 전달합니다.
                                  </p>
                                </div>
                                <div className="flex gap-2">
                                  <span className="text-blue-400">•</span>
                                  <p>
                                    <strong>비활성화 시:</strong> Routing Endpoint와 리소스 경로가 자동으로 조합되어 적용됩니다.
                                  </p>
                                </div>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <Switch checked={isDirectUrlInput} onCheckedChange={onDirectUrlToggle} />
                      </div>
                    </div>

                    {isDirectUrlInput ? (
                      <Input
                        className={`w-full lg:w-2/3 ${isSubmitted && !methodForm.customEndpointUrl ? 'border-red-500' : ''}`}
                        placeholder="https://your-api-endpoint.com"
                        value={methodForm.customEndpointUrl}
                        onChange={(e) => onCustomUrlChange(e.target.value)}
                      />
                    ) : (
                      <div className="grid">
                        <Select
                          value={methodForm.endpointUrl}
                          onValueChange={(value) => onMethodFormChange("endpointUrl", value)}
                        >
                          <SelectTrigger className={`w-full lg:w-2/3 ${isSubmitted && !methodForm.endpointUrl ? 'border-red-500' : ''}`}>
                            <SelectValue
                              placeholder={
                                endpointList?.length > 0
                                  ? "Endpoint URL 선택"
                                  : "Endpoint URL이 없습니다."
                              }
                            />
                          </SelectTrigger>
                          {endpointList?.length > 0 && (
                            <SelectContent>
                              {endpointList?.map((url) => (
                                <SelectItem
                                  key={url.id}
                                  value={url.routeUrl}
                                  className="hover:cursor-pointer"
                                >
                                  {url.routeUrl}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          )}
                        </Select>
                      </div>
                    )}
                    {checkUrl && (
                      <span className="text-xs mt-2 ml-2 text-red-500">
                        한글은 입력되지 않습니다.
                      </span>
                    )}
                  </div>

                  {/* Request Validator */}
                  <div>
                    <Label className="text-[16px] font-semibold mb-4m">요청 검사기</Label>
                    <Select
                      value={methodForm.requestValidator}
                      onValueChange={(value) => onMethodFormChange("requestValidator", value)}
                    >
                      <SelectTrigger className="w-full lg:w-2/3 mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {validatorList.map((checker) => (
                          <SelectItem
                            key={checker.code}
                            className="hover:cursor-pointer"
                            value={checker.code}
                          >
                            {checker.description}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {/* URL Query String Parameters */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <Collapsible
              open={openSections.urlQuery}
              onOpenChange={() => onToggleSection("urlQuery")}
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-between p-4 h-auto bg-green-50 hover:bg-green-100 dark:bg-green-950/20 dark:hover:bg-green-950/30 border-0 rounded-none"
                >
                  <span className="text-lg font-semibold text-green-900 dark:text-green-100">
                    URL 쿼리 스트링 파라미터
                  </span>
                  {openSections.urlQuery ? (
                    <ChevronDown className="h-5 w-5 text-green-700" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-green-700" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="p-6 bg-white dark:bg-gray-900">
                  <div className="space-y-4">
                    <div className="dark:bg-blue-950/20 rounded-lg">
                      <h4 className="flex items-center gap-3 font-semibold text-gray-900 dark:text-blue-100 mb-4">
                        쿼리 스트링 파라미터
                        <Button
                          size="sm"
                          variant={"outline"}
                          className="h-[25px] !gap-1 border-2 border-blue-500 text-blue-700 hover:text-blue-700 hover:bg-blue-50"
                          onClick={onAddQueryParameter}
                        >
                          <span className="font-bold">추가</span>
                        </Button>
                      </h4>
                      {queryParameters.length === 0 ? (
                        <p className="text-sm text-gray-500 dark:text-gray-400">쿼리 스트링 파라미터가 없습니다.</p>
                      ) : (
                        <>
                          {queryParameters.map((param) => (
                            <div
                              key={param.id}
                              className="grid grid-cols-12 gap-4 items-center mb-3"
                            >
                              <div className="col-span-10">
                                <Input
                                  className="w-full"
                                  placeholder="이름"
                                  value={param.name}
                                  onChange={(e) =>
                                    onUpdateQueryParameter(param.id, "name", e.target.value)
                                  }
                                />
                              </div>
                              <div className="col-span-2 gap-1 flex items-center">
                                <div className="flex items-center space-x-2">
                                  <Label className="text-xs">필수</Label>
                                  <Switch
                                    checked={param.required}
                                    onCheckedChange={(checked) =>
                                      onUpdateQueryParameter(param.id, "required", checked)
                                    }
                                  />
                                </div>

                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-0 hover:bg-transparent cursor-pointer"
                                  onClick={() => onRemoveQueryParameter(param.id)}
                                >
                                  <Trash2 className="h-5 w-5" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* HTTP Request Headers */}
          <div className="border border-gray-200 rounded-lg">
            <Collapsible
              open={openSections.httpHeaders}
              onOpenChange={() => onToggleSection("httpHeaders")}
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-between p-4 h-auto bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/20 dark:hover:bg-purple-950/30 border-0 rounded-none"
                >
                  <span className="text-lg font-semibold text-purple-900 dark:text-purple-100">
                    HTTP 요청 헤더
                  </span>
                  {openSections.httpHeaders ? (
                    <ChevronDown className="h-5 w-5 text-purple-700" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-purple-700" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="p-6 bg-white dark:bg-gray-900">
                  <div className="space-y-4">
                    <div className="dark:bg-green-950/20 rounded-lg">
                      <h4 className="flex items-center gap-3 font-semibold text-gray-900 dark:text-green-100 mb-4">
                        헤더
                        <Button
                          size="sm"
                          variant={"outline"}
                          className="h-[25px] !gap-1 border-2 border-blue-500 text-blue-700 hover:text-blue-700 hover:bg-blue-50"
                          onClick={onAddHeader}
                        >
                          <span className="font-bold">추가</span>
                        </Button>
                      </h4>
                      {headers.length === 0 ? (
                        <p className="text-sm text-gray-500 dark:text-gray-400">헤더가 없습니다.</p>
                      ) : (
                        <>
                          {headers.map((header) => (
                            <div
                              key={header.id}
                              className={`grid grid-cols-12 gap-3 mt-3 ${openId === String(header.id) ? "items-start" : "items-center mb-3"
                                }`}
                            >
                              <div className="col-span-10">
                                <RequestHeaderListSearch
                                  isOpen={openId === String(header.id)}
                                  setIsOpen={(val) => setOpenId(val ? String(header.id) : null)}
                                  updateHeader={(field, value) =>
                                    onUpdateHeader(header.id, field, value)
                                  }
                                  existingSearch={header.name}
                                  openUpward={!openSections.requestBody}
                                />
                              </div>

                              <div
                                className={`col-span-2 gap-1 flex items-center ${openId === String(header.id) ? "mt-1" : ""
                                  }`}
                              >
                                <div className="flex items-center space-x-2">
                                  <Label className="text-xs">필수</Label>
                                  <Switch
                                    checked={header.required}
                                    onCheckedChange={(checked) =>
                                      onUpdateHeader(header.id, "required", checked)
                                    }
                                  />
                                </div>

                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-0 hover:bg-transparent cursor-pointer"
                                  onClick={() => onRemoveHeader(header.id as number)}
                                >
                                  <Trash2 className="h-5 w-5" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* Request Body */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <Collapsible
              open={openSections.requestBody}
              onOpenChange={() => onToggleSection("requestBody")}
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-between p-4 h-auto bg-orange-50 hover:bg-orange-100 dark:bg-orange-950/20 dark:hover:bg-orange-950/30 border-0 rounded-none"
                >
                  <span className="text-lg font-semibold text-orange-900 dark:text-orange-100">
                    요청 바디
                  </span>
                  {openSections.requestBody ? (
                    <ChevronDown className="h-5 w-5 text-orange-700" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-orange-700" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="p-6 bg-white dark:bg-gray-900 space-y-6">
                  <div className="dark:bg-orange-950/20 rounded-lg">
                    <h4 className="flex items-center gap-3 font-semibold text-gray-900 dark:text-green-100 mb-4">
                      요청 모델
                    </h4>

                    <div className="grid grid-cols-12 gap-3 items-center mb-3">
                      <div className="col-span-10">
                        <Select value={bodyModelId} onValueChange={(value) => setBodyModelId(value)}
                          disabled={!modelList || modelList.length === 0}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue
                              placeholder={
                                modelList && modelList.length > 0
                                  ? "모델을 선택해주세요."
                                  : "모델이 없습니다."
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {modelList?.map((model) => (
                              <SelectItem className="cursor-pointer" key={model.modelId} value={model.modelId}>
                                {model.modelName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-2 flex justify-start">
                        {modelList && modelList.length > 0 &&
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-0 hover:bg-transparent cursor-pointer"
                            onClick={() => setBodyModelId("")}
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      </div>
    </div>
  );
}
