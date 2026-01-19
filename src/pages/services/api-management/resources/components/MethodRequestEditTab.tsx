import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Copy, Trash2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import RequestHeaderListSearch from '../../models/components/RequestHeaderListSearch';
import { SelectAPIKeyModal } from '../methods/components/SelectAPIKeyModal';
import { useAuthStore } from '@/stores/store';
import { useGetAPIKeyList } from '@/hooks/use-apiKeys';
import { useClipboard } from 'use-clipboard-copy';
import { MethodFormData, ValidatorOption } from '../hooks/useMethodEditForm';

interface ModelItem {
  modelId: string;
  modelName: string;
  description?: string;
}

interface MethodRequestEditTabProps {
  formData: MethodFormData;
  validatorList: ValidatorOption[];
  modelList: ModelItem[];
  onChange: (updates: Partial<MethodFormData>) => void;
  httpMethod: string;
}

// 요청 본문이 필요하지 않은 HTTP 메서드
const METHODS_WITHOUT_BODY = ['GET', 'DELETE', 'HEAD', 'OPTIONS'];

export function MethodRequestEditTab({
  formData,
  validatorList,
  modelList,
  onChange,
  httpMethod,
}: MethodRequestEditTabProps) {
  // 요청 본문이 필요한지 확인
  const isBodyRequired = !METHODS_WITHOUT_BODY.includes(httpMethod?.toUpperCase());
  const userData = useAuthStore((state) => state.user);
  const clipboard = useClipboard();
  const tenantId = userData?.organizationId || 'kvwwwksAsvmas';

  const { data: apiKeyList } = useGetAPIKeyList(tenantId);

  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [selectedApiKeyId, setSelectedApiKeyId] = useState(formData.apiKeyId || '');
  const [isCreatingNewApiKey, setIsCreatingNewApiKey] = useState(false);
  const [newApiKeyForm, setNewApiKeyForm] = useState({
    name: '',
    description: '',
  });
  const [apiKeyContent, setApiKeyContent] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);

  const nextHeaderIdRef = useRef<number>(formData.headerParameters.length);
  const [paramCounter, setParamCounter] = useState(formData.queryParameters.length);

  const handleApiKeyToggle = (checked: boolean) => {
    if (checked) {
      setIsApiKeyModalOpen(true);
    } else {
      onChange({ apiKeyRequired: false, apiKeyId: '' });
    }
  };

  const addQueryParameter = () => {
    const newParam = {
      name: '',
      in: 'query' as const,
      required: false,
      description: '',
      schema: { type: 'string' },
    };
    onChange({
      queryParameters: [...formData.queryParameters, newParam],
    });
    setParamCounter((prev) => prev + 1);
  };

  const updateQueryParameter = (
    index: number,
    field: 'name' | 'required' | 'description',
    value: any
  ) => {
    const updated = formData.queryParameters.map((param, idx) =>
      idx === index ? { ...param, [field]: value } : param
    );
    onChange({ queryParameters: updated });
  };

  const removeQueryParameter = (index: number) => {
    const updated = formData.queryParameters.filter((_, idx) => idx !== index);
    onChange({ queryParameters: updated });
  };

  const addRequestHeader = () => {
    const newHeader = {
      name: '',
      in: 'header' as const,
      required: false,
      description: '',
      schema: { type: 'string' },
    };
    onChange({
      headerParameters: [...formData.headerParameters, newHeader],
    });
    nextHeaderIdRef.current++;
  };

  const updateRequestHeader = (
    index: number,
    field: 'name' | 'required' | 'description',
    value: any
  ) => {
    const updated = formData.headerParameters.map((header, idx) =>
      idx === index ? { ...header, [field]: value } : header
    );
    onChange({ headerParameters: updated });
  };

  const removeRequestHeader = (index: number) => {
    const updated = formData.headerParameters.filter((_, idx) => idx !== index);
    onChange({ headerParameters: updated });
  };

  const handleCopyAPIKey = (apiKey: string) => {
    clipboard.copy(apiKey);
    toast.success('API Key copied to clipboard.');
  };

  const handleApiKeySelected = (keyId: string, keyValue: string) => {
    setSelectedApiKeyId(keyId);
    setApiKeyContent(keyValue);
    onChange({ apiKeyRequired: true, apiKeyId: keyId });
  };

  return (
    <>
      <div className="space-y-6">
        {/* Method Request Settings Edit */}
        <Card className="!mt-3">
          <CardHeader>
            <CardTitle className="!text-lg">Method Request Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Label className="text-sm font-medium">API Key Required</Label>
              <Switch checked={formData.apiKeyRequired} onCheckedChange={handleApiKeyToggle} />
            </div>
            {formData.apiKeyRequired && (
              <div className="mt-4 p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-green-900 dark:text-green-100">
                        Selected API Key
                      </h4>
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs rounded-full font-medium">
                        Enabled
                      </span>
                      {apiKeyContent && (
                        <button
                          className="hover:underline"
                          onClick={() => handleCopyAPIKey(apiKeyContent)}>
                          <Copy className="h-4 w-4 ml-2" />
                        </button>
                      )}
                    </div>
                    <p className="text-red-500 text-xs mb-2">
                      Add the X-API-Key field to your HTTP(S) header and include the copied key value in your request.
                    </p>
                  </div>
                </div>
              </div>
            )}
            <div>
              <div>
                <Label className="text-sm font-medium">Request Validator</Label>
                <Select
                  value={formData.requestValidation}
                  onValueChange={(value) => onChange({ requestValidation: value })}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {validatorList.map((validator, i) => (
                      <SelectItem key={i} value={validator?.code} className="hover:cursor-pointer">
                        {validator?.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* URL Query String Parameters Edit */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center !text-lg gap-3">
              URL Query String Parameters
              <Button
                size="sm"
                variant={'outline'}
                className="h-[25px] !gap-1 border-2 border-blue-500 text-blue-700 hover:text-blue-700 hover:bg-blue-50"
                onClick={addQueryParameter}>
                <span className="font-bold">Add</span>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {formData.queryParameters.map((param, index) => (
                <div key={`query-${index}`} className="grid grid-cols-12 gap-4 items-center mb-3">
                  <div className="col-span-10">
                    <Input
                      value={param.name}
                      onChange={(e) => updateQueryParameter(index, 'name', e.target.value)}
                      placeholder="Parameter Name"
                    />
                  </div>
                  <div className="col-span-2 gap-1 flex items-center">
                    <div className="flex items-center space-x-2">
                      <Label className="text-xs">Required</Label>
                      <Switch
                        checked={param.required}
                        onCheckedChange={(checked) =>
                          updateQueryParameter(index, 'required', checked)
                        }
                      />
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-0 hover:bg-transparent bg-transparent cursor-pointer"
                      onClick={() => removeQueryParameter(index)}>
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              ))}
              {formData.queryParameters.length === 0 && (
                <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                  No query parameters. Click the Add button to add a new parameter.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* HTTP Request Headers Edit */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3 !text-lg">
              HTTP Request Headers
              <Button
                size="sm"
                variant={'outline'}
                className="h-[25px] !gap-1 border-2 border-blue-500 text-blue-700 hover:text-blue-700 hover:bg-blue-50"
                onClick={addRequestHeader}>
                <span className="font-bold">Add</span>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {formData.headerParameters.map((header, index) => (
                <div
                  key={`header-${index}`}
                  className={`grid grid-cols-12 gap-3 mt-3 ${openId === `header-${index}` ? 'items-start' : 'items-center mb-3'
                    }`}>
                  <div className="col-span-10">
                    <RequestHeaderListSearch
                      updateHeader={(field: 'name' | 'required' | 'value', value: string | boolean) => {
                        if (field === 'name' && typeof value === 'string') {
                          updateRequestHeader(index, 'name', value);
                        } else if (field === 'required' && typeof value === 'boolean') {
                          updateRequestHeader(index, 'required', value);
                        }
                      }}
                      key={`header-search-${index}`}
                      isOpen={openId === `header-${index}`}
                      setIsOpen={(val) => setOpenId(val ? `header-${index}` : null)}
                      existingSearch={header.name}
                    />
                  </div>
                  <div
                    className={`col-span-2 gap-1 flex items-center ${openId === `header-${index}` ? 'mt-1' : ''
                      }`}>
                    <div className="flex items-center space-x-2">
                      <Label className="text-xs">Required</Label>
                      <Switch
                        checked={header.required}
                        onCheckedChange={(checked) =>
                          updateRequestHeader(index, 'required', checked)
                        }
                      />
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeRequestHeader(index)}
                      className="border-0 hover:bg-transparent bg-transparent cursor-pointer">
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              ))}
              {formData.headerParameters.length === 0 && (
                <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                  No request headers. Click the Add button to add a new request header.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Request Body Edit */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3 !text-lg">Request Body</CardTitle>
          </CardHeader>
          <CardContent>
            {!isBodyRequired ? (
              <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                <p className="mb-2">{httpMethod} method does not support request body.</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  POST, PUT, PATCH methods can set request body.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-12 gap-3 items-center mb-3">
                  <div className="col-span-10">
                    <Select
                      value={formData.requestBodyConfig.modelId}
                      disabled={modelList?.length === 0}
                      onValueChange={(value) => {
                        onChange({
                          requestBodyConfig: {
                            ...formData.requestBodyConfig,
                            modelId: value,
                          },
                        });
                      }}>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            modelList?.length > 0 ? 'Select Model' : 'No models created.'
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {modelList?.map((model) => (
                          <SelectItem key={model.modelId} value={model.modelId}>
                            {model.modelName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2 flex justify-start">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-0 hover:bg-transparent bg-transparent cursor-pointer"
                      disabled={modelList?.length === 0}
                      onClick={() =>
                        onChange({
                          requestBodyConfig: {
                            ...formData.requestBodyConfig,
                            modelId: '',
                          },
                        })
                      }>
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <SelectAPIKeyModal
          open={isApiKeyModalOpen}
          onOpenChange={setIsApiKeyModalOpen}
          isCreatingNewApiKey={isCreatingNewApiKey}
          setIsCreatingNewApiKey={setIsCreatingNewApiKey}
          apiKeyList={apiKeyList || []}
          setSelectedApiKeyId={(id: string) => {
            setSelectedApiKeyId(id);
            // 기존 목록에서 찾거나, 새로 생성된 경우 id만으로 업데이트
            const selectedKey = apiKeyList?.find((k) => k.apiKeyId === id || k.keyId === id);
            if (selectedKey) {
              handleApiKeySelected(id, selectedKey.keyValue);
            } else {
              // 새로 생성된 API Key의 경우 - apiKeyList에 아직 없으므로 직접 업데이트
              onChange({ apiKeyRequired: true, apiKeyId: id });
            }
          }}
          newApiKeyForm={newApiKeyForm}
          setNewApiKeyForm={setNewApiKeyForm}
          userKey={userData?.userKey || ''}
          tenantId={tenantId}
          setApiKeyToggle={(val: boolean) => onChange({ apiKeyRequired: val })}
          setSelectedApiKeyValue={setApiKeyContent}
        />
      </div>
    </>
  );
}
