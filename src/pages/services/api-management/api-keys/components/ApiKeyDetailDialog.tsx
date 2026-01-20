import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import {
  ApiKeyDetail,
  ApiKeyDeployedUsage,
  modifyAPIKey,
  modifyAPIKeyQuota,
  modifyAPIKeyRateLimit,
  getAPIKeyDetail2,
} from '@/apis/api-keys.api';
import {
  Key,
  Calendar as CalendarIcon,
  User,
  Shield,
  Gauge,
  Server,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Edit,
  X,
  Save,
} from 'lucide-react';
import { getMethodStyle, HttpMethod } from '@/libs/etc';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/store';

interface ApiKeyDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  apiKeyDetail: ApiKeyDetail | null;
  isLoading: boolean;
  onRefresh?: () => void;
}

interface apiKeyStatusDataProps {
  apiKeyActive: boolean;
  apikeyCanDelete: boolean;
  apiKeyExpired: boolean;
}

export function ApiKeyDetailDialog({
  open,
  onOpenChange,
  apiKeyDetail,
  isLoading,
  onRefresh,
}: ApiKeyDetailDialogProps) {
  const userData = useAuthStore((state) => state.user);

  // 기본 정보 편집 상태
  const [isBasicInfoEditMode, setIsBasicInfoEditMode] = useState(false);
  const [basicInfoForm, setBasicInfoForm] = useState({
    keyName: '',
    description: '',
    expiresAt: '',
  });
  const [isBasicInfoSaving, setIsBasicInfoSaving] = useState(false);
  const [expiresAtDate, setExpiresAtDate] = useState<Date | undefined>(undefined);

  // 사용처 데이터 (getAPIKeyDetail2)
  const [usageData, setUsageData] = useState<{
    deployedUsages: ApiKeyDeployedUsage[];
  } | null>(null);
  const [statusData, setStatusData] = useState<apiKeyStatusDataProps>({
    apiKeyActive: false,
    apikeyCanDelete: false,
    apiKeyExpired: false,
  });
  const [isUsageLoading, setIsUsageLoading] = useState(false);

  // Quota 편집 상태
  const [isQuotaEditMode, setIsQuotaEditMode] = useState(false);
  const [quotaForm, setQuotaForm] = useState({
    enabled: false,
    period: 'DAILY' as 'DAILY' | 'MONTHLY',
    requestLimit: 10000,
  });
  const [isQuotaSaving, setIsQuotaSaving] = useState(false);

  // Rate Limit 편집 상태
  const [isRateLimitEditMode, setIsRateLimitEditMode] = useState(false);
  const [rateLimitForm, setRateLimitForm] = useState({
    enabled: false,
    requestsPerSecond: 10,
    burstCapacity: 20,
    requestsPerMinute: 0,
    requestsPerHour: 0,
  });
  const [isRateLimitSaving, setIsRateLimitSaving] = useState(false);
  const [rateLimitError, setRateLimitError] = useState('');

  // apiKeyDetail 변경 시 폼 초기화 및 사용처 데이터 로드
  useEffect(() => {
    if (apiKeyDetail) {
      setBasicInfoForm({
        keyName: apiKeyDetail.keyName || '',
        description: apiKeyDetail.description || '',
        expiresAt: apiKeyDetail.expirationInfo?.expiresAt || '',
      });
      // expiresAt Date 초기화
      if (apiKeyDetail.expirationInfo?.expiresAt) {
        setExpiresAtDate(new Date(apiKeyDetail.expirationInfo.expiresAt));
      } else {
        setExpiresAtDate(undefined);
      }
      setQuotaForm({
        enabled: apiKeyDetail.quotaInfo?.enabled || false,
        period: apiKeyDetail.quotaInfo?.period || 'DAILY',
        requestLimit: apiKeyDetail.quotaInfo?.requestLimit || 10000,
      });
      setRateLimitForm({
        enabled: apiKeyDetail.rateLimitInfo?.enabled || false,
        requestsPerSecond: apiKeyDetail.rateLimitInfo?.requestsPerSecond || 10,
        burstCapacity: apiKeyDetail.rateLimitInfo?.burstCapacity || 20,
        requestsPerMinute: apiKeyDetail.rateLimitInfo?.requestsPerMinute || 0,
        requestsPerHour: apiKeyDetail.rateLimitInfo?.requestsPerHour || 0,
      });
      setIsBasicInfoEditMode(false);
      setIsQuotaEditMode(false);
      setIsRateLimitEditMode(false);
      setRateLimitError('');

      // 사용처 데이터 로드
      const fetchUsageData = async () => {
        setIsUsageLoading(true);
        try {
          const res = await getAPIKeyDetail2(apiKeyDetail.apiKeyId);
          setUsageData({
            deployedUsages: res.deployedUsages || [],
          });
          setStatusData({
            apiKeyActive: res.active,
            apikeyCanDelete: res.canDelete,
            apiKeyExpired: res.expired,
          });
        } catch (error) {
          console.error('Failed to fetch usage data:', error);
          setUsageData({ deployedUsages: [] });
          setStatusData({
            apiKeyActive: false,
            apikeyCanDelete: false,
            apiKeyExpired: false,
          });
        } finally {
          setIsUsageLoading(false);
        }
      };
      fetchUsageData();
    }
  }, [apiKeyDetail]);

  // Rate Limit 유효성 검사
  useEffect(() => {
    if (rateLimitForm.burstCapacity < rateLimitForm.requestsPerSecond) {
      setRateLimitError('Burst capacity must be greater than or equal to requests per second.');
    } else {
      setRateLimitError('');
    }
  }, [rateLimitForm.burstCapacity, rateLimitForm.requestsPerSecond]);

  // 기본 정보 저장
  const handleBasicInfoSave = async () => {
    if (!apiKeyDetail) return;

    if (!basicInfoForm.keyName.trim()) {
      toast.error('Please enter the API Key name.');
      return;
    }

    setIsBasicInfoSaving(true);
    try {
      await modifyAPIKey({
        apiKeyId: apiKeyDetail.apiKeyId,
        keyName: basicInfoForm.keyName,
        description: basicInfoForm.description,
        expiresAt: basicInfoForm.expiresAt || undefined,
        updatedBy: userData?.userKey || '',
      });
      toast.success('API Key information has been updated.');
      setIsBasicInfoEditMode(false);
      onRefresh?.();
    } catch (error) {
      toast.error('Failed to update API Key information.');
    } finally {
      setIsBasicInfoSaving(false);
    }
  };

  const handleBasicInfoCancel = () => {
    if (apiKeyDetail) {
      setBasicInfoForm({
        keyName: apiKeyDetail.keyName || '',
        description: apiKeyDetail.description || '',
        expiresAt: apiKeyDetail.expirationInfo?.expiresAt || '',
      });
      if (apiKeyDetail.expirationInfo?.expiresAt) {
        setExpiresAtDate(new Date(apiKeyDetail.expirationInfo.expiresAt));
      } else {
        setExpiresAtDate(undefined);
      }
    }
    setIsBasicInfoEditMode(false);
  };

  const handleQuotaSave = async () => {
    if (!apiKeyDetail) return;

    setIsQuotaSaving(true);
    try {
      await modifyAPIKeyQuota({
        apiKeyId: apiKeyDetail.apiKeyId,
        enabled: quotaForm.enabled,
        period: quotaForm.period,
        requestLimit: quotaForm.requestLimit,
        updatedBy: userData?.userKey || '',
      });
      toast.success('Quota settings have been saved.');
      setIsQuotaEditMode(false);
      onRefresh?.();
    } catch (error) {
      toast.error('Failed to save Quota settings.');
    } finally {
      setIsQuotaSaving(false);
    }
  };

  const handleQuotaCancel = () => {
    if (apiKeyDetail) {
      setQuotaForm({
        enabled: apiKeyDetail.quotaInfo?.enabled || false,
        period: apiKeyDetail.quotaInfo?.period || 'DAILY',
        requestLimit: apiKeyDetail.quotaInfo?.requestLimit || 10000,
      });
    }
    setIsQuotaEditMode(false);
  };

  const handleRateLimitSave = async () => {
    if (!apiKeyDetail) return;

    if (rateLimitForm.burstCapacity < rateLimitForm.requestsPerSecond) {
      toast.error('Burst capacity must be greater than or equal to requests per second.');
      return;
    }

    setIsRateLimitSaving(true);
    try {
      await modifyAPIKeyRateLimit({
        apiKeyId: apiKeyDetail.apiKeyId,
        enabled: rateLimitForm.enabled,
        requestsPerSecond: rateLimitForm.requestsPerSecond,
        burstCapacity: rateLimitForm.burstCapacity,
        requestsPerMinute: rateLimitForm.requestsPerMinute,
        requestsPerHour: rateLimitForm.requestsPerHour,
        updatedBy: userData?.userKey || '',
      });
      toast.success('Rate Limit settings have been saved.');
      setIsRateLimitEditMode(false);
      onRefresh?.();
    } catch (error) {
      toast.error('Failed to save Rate Limit settings.');
    } finally {
      setIsRateLimitSaving(false);
    }
  };

  const handleRateLimitCancel = () => {
    if (apiKeyDetail) {
      setRateLimitForm({
        enabled: apiKeyDetail.rateLimitInfo?.enabled || false,
        requestsPerSecond: apiKeyDetail.rateLimitInfo?.requestsPerSecond || 10,
        burstCapacity: apiKeyDetail.rateLimitInfo?.burstCapacity || 20,
        requestsPerMinute: apiKeyDetail.rateLimitInfo?.requestsPerMinute || 0,
        requestsPerHour: apiKeyDetail.rateLimitInfo?.requestsPerHour || 0,
      });
    }
    setIsRateLimitEditMode(false);
    setRateLimitError('');
  };

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="ml-3 text-gray-500">Loading details...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!apiKeyDetail) {
    return null;
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  console.log(apiKeyDetail)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col overflow-hidden">
        <DialogHeader className="flex-shrink-0 border-b pb-4">
          <DialogTitle className="text-xl font-bold text-blue-600">
            API Key Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 overflow-y-auto flex-1 pr-2">
          {/* 기본 정보 */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  Basic Information
                </CardTitle>
                {!isBasicInfoEditMode ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsBasicInfoEditMode(true)}
                    className="h-7 px-2"
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                ) : (
                  <div className="flex gap-1">

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleBasicInfoSave}
                      disabled={isBasicInfoSaving}
                      className="h-7 px-2 text-blue-600 hover:text-blue-700"
                    >
                      {isBasicInfoSaving ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Save className="h-3.5 w-3.5" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleBasicInfoCancel}
                      disabled={isBasicInfoSaving}
                      className="h-7 px-2"
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {isBasicInfoEditMode ? (
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm text-gray-500">ID</Label>
                    <p className="font-mono text-sm bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded mt-1">
                      {apiKeyDetail.apiKeyId}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Name <span className="text-red-500">*</span></Label>
                    <Input
                      value={basicInfoForm.keyName}
                      onChange={(e) =>
                        setBasicInfoForm((prev) => ({ ...prev, keyName: e.target.value }))
                      }
                      className="h-8"
                      placeholder="Enter API Key name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Description</Label>
                    <Textarea
                      value={basicInfoForm.description}
                      onChange={(e) =>
                        setBasicInfoForm((prev) => ({ ...prev, description: e.target.value }))
                      }
                      className="min-h-[80px]"
                      placeholder="Enter description (optional)"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Expiration Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full h-8 justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {/* {expiresAtDate ? (
                            format(expiresAtDate, 'yyyy-MM-dd HH:mm', { locale: ko })
                          ) : (
                            <span className="text-gray-400">Select expiration date (optional)</span>
                          )} */}
                          {basicInfoForm.expiresAt ? (
                            format(basicInfoForm.expiresAt, 'yyyy-MM-dd HH:mm:ss', { locale: ko })
                          ) : (
                            <span className="text-gray-400">Select expiration date (optional)</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[300px] p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={expiresAtDate}
                          onSelect={(date) => {
                            setExpiresAtDate(date);
                            if (date) {
                              // 1. 날짜를 로컬 기준 'YYYY-MM-DD' 형식으로 추출
                              const year = date.getFullYear();
                              const month = String(date.getMonth() + 1).padStart(2, '0');
                              const day = String(date.getDate()).padStart(2, '0');

                              // 2. 원하는 시간 문자열 결합 (예: 2024-05-20T23:59:59)
                              // 뒤에 'Z'를 붙이면 UTC로 인식되고, 안 붙이면 로컬 시간으로 처리됩니다.
                              // 서버에서 어떤 형식을 받느냐에 따라 결정하세요.
                              const localExpiresAt = `${year}-${month}-${day}T23:59:59`;

                              console.log(localExpiresAt)

                              setBasicInfoForm((prev) => ({
                                ...prev,
                                expiresAt: localExpiresAt,
                              }));
                            } else {
                              setBasicInfoForm((prev) => ({
                                ...prev,
                                expiresAt: '',
                              }));
                            }
                          }}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <p className="text-xs text-gray-500">
                      If not set, the key will be valid indefinitely.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <span className="text-sm text-gray-500">Created:</span>
                    <span className="text-sm">{formatDate(apiKeyDetail.createdAt)}</span>
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-500">ID</span>
                      <p className="font-mono text-sm px-2 py-1 rounded mt-1">
                        {apiKeyDetail.apiKeyId}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Name</span>
                      <p className="font-medium mt-1">{apiKeyDetail.keyName}</p>
                    </div>

                  </div>

                  <div>
                    <span className="text-sm text-gray-500">Description</span>
                    <p className="text-sm mt-1">{apiKeyDetail.description || '-'}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 pt-2">
                      <span className="text-sm text-gray-500">Expiration:</span>
                      <span className="text-sm">{formatDate(apiKeyDetail.expirationInfo?.expiresAt)}</span>
                    </div>
                    <div className="flex items-center gap-2 pt-2">
                      <span className="text-sm text-gray-500">Created:</span>
                      <span className="text-sm">{formatDate(apiKeyDetail.createdAt)}</span>
                    </div>
                  </div>

                </>
              )}

              <div className="grid grid-cols-3 gap-4 pt-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Status:</span>
                  {statusData.apiKeyActive ? (
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
                  ) : (
                    <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">
                      <XCircle className="h-3 w-3 mr-1" />
                      Inactive
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Expired:</span>
                  {statusData.apiKeyExpired ? (
                    <Badge variant="destructive">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Expired
                    </Badge>
                  ) : (
                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                      <Clock className="h-3 w-3 mr-1" />
                      Valid
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Deletable:</span>
                  {statusData.apikeyCanDelete ? (
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Yes</Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-700 hover:bg-red-100">No</Badge>
                  )}
                </div>

              </div>
              {apiKeyDetail.expirationInfo?.expiresAt && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-500">Expiration:</span>
                  <span className="text-sm">{formatDate(apiKeyDetail.expirationInfo.expiresAt)}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quota & Rate Limit */}
          <div className="grid grid-cols-2 gap-4">
            {/* Quota */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    Quota Settings
                  </CardTitle>
                  {!isQuotaEditMode ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsQuotaEditMode(true)}
                      className="h-7 px-2"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                  ) : (
                    <div className="flex gap-1">

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleQuotaSave}
                        disabled={isQuotaSaving}
                        className="h-7 px-2 text-blue-600 hover:text-blue-700"
                      >
                        {isQuotaSaving ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Save className="h-3.5 w-3.5" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleQuotaCancel}
                        disabled={isQuotaSaving}
                        className="h-7 px-2"
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {isQuotaEditMode ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Enable</Label>
                      <Switch
                        checked={quotaForm.enabled}
                        onCheckedChange={(checked) =>
                          setQuotaForm((prev) => ({ ...prev, enabled: checked }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">Period</Label>
                      <RadioGroup
                        value={quotaForm.period}
                        onValueChange={(value: 'DAILY' | 'MONTHLY') =>
                          setQuotaForm((prev) => ({ ...prev, period: value }))
                        }
                        disabled={!quotaForm.enabled}
                        className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="DAILY" id="DAILY" />
                          <Label
                            htmlFor="DAILY"
                            className={`text-sm hover:cursor-pointer ${!quotaForm.enabled ? 'text-gray-500' : ''}`}
                          >
                            Daily (DAILY)
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="MONTHLY" id="MONTHLY" />
                          <Label
                            htmlFor="MONTHLY"
                            className={`text-sm  hover:cursor-pointer ${!quotaForm.enabled ? 'text-gray-500' : ''}`}
                          >
                            Monthly (MONTHLY)
                          </Label>
                        </div>
                      </RadioGroup>

                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">Request Limit</Label>
                      <Input
                        type="number"
                        value={quotaForm.requestLimit}
                        onChange={(e) =>
                          setQuotaForm((prev) => ({
                            ...prev,
                            requestLimit: parseInt(e.target.value) || 0,
                          }))
                        }
                        disabled={!quotaForm.enabled}
                        className="h-8"
                      />
                      <p className="text-xs text-gray-500">
                        Maximum number of requests allowed in the selected period
                      </p>
                    </div>
                  </div>
                ) : apiKeyDetail.quotaInfo?.enabled ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Status</span>
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                        Enabled
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Period</span>
                      <span className="text-sm font-medium">
                        {apiKeyDetail.quotaInfo.period === 'DAILY' ? 'Daily' : 'Monthly'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Request Limit</span>
                      <span className="text-sm font-medium font-mono">
                        {apiKeyDetail.quotaInfo.requestLimit.toLocaleString()} requests
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <Gauge className="h-8 w-8 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">Quota is <span className="font-medium text-red-600">disabled</span>.</p>
                    <p className="text-xs mt-1">Click the edit button to configure.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Rate Limit */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    Rate Limit Settings
                  </CardTitle>
                  {!isRateLimitEditMode ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsRateLimitEditMode(true)}
                      className="h-7 px-2"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                  ) : (
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleRateLimitSave}
                        disabled={isRateLimitSaving || !!rateLimitError}
                        className="h-7 px-2 text-blue-600 hover:text-blue-700"
                      >
                        {isRateLimitSaving ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Save className="h-3.5 w-3.5" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleRateLimitCancel}
                        disabled={isRateLimitSaving}
                        className="h-7 px-2"
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {isRateLimitEditMode ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Enable</Label>
                      <Switch
                        checked={rateLimitForm.enabled}
                        onCheckedChange={(checked) =>
                          setRateLimitForm((prev) => ({ ...prev, enabled: checked }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">Requests per Second (Token Refill Rate)</Label>
                      <Input
                        type="number"
                        value={rateLimitForm.requestsPerSecond}
                        onChange={(e) =>
                          setRateLimitForm((prev) => ({
                            ...prev,
                            requestsPerSecond: parseInt(e.target.value) || 0,
                          }))
                        }
                        disabled={!rateLimitForm.enabled}
                        className="h-8"
                      />
                      <p className="text-xs text-gray-500">Token refill rate per second</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">Burst Capacity (Bucket Capacity)</Label>
                      <Input
                        type="number"
                        value={rateLimitForm.burstCapacity}
                        onChange={(e) =>
                          setRateLimitForm((prev) => ({
                            ...prev,
                            burstCapacity: parseInt(e.target.value) || 0,
                          }))
                        }
                        disabled={!rateLimitForm.enabled}
                        className={`h-8 ${rateLimitError ? 'border-red-500' : ''}`}
                      />
                      <p className="text-xs text-gray-500">
                        Bucket capacity (maximum burst requests)
                      </p>
                      {rateLimitError && (
                        <p className="text-xs text-red-500">{rateLimitError}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">Requests per Minute</Label>
                      <Input
                        type="number"
                        value={rateLimitForm.requestsPerMinute}
                        onChange={(e) =>
                          setRateLimitForm((prev) => ({
                            ...prev,
                            requestsPerMinute: parseInt(e.target.value) || 0,
                          }))
                        }
                        disabled={!rateLimitForm.enabled}
                        className="h-8"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">Requests per Hour</Label>
                      <Input
                        type="number"
                        value={rateLimitForm.requestsPerHour}
                        onChange={(e) =>
                          setRateLimitForm((prev) => ({
                            ...prev,
                            requestsPerHour: parseInt(e.target.value) || 0,
                          }))
                        }
                        disabled={!rateLimitForm.enabled}
                        className="h-8"
                      />
                    </div>
                  </div>
                ) : apiKeyDetail.rateLimitInfo?.enabled ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Status</span>
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                        Enabled
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Requests/Second</span>
                      <span className="text-sm font-medium font-mono">
                        {apiKeyDetail.rateLimitInfo.requestsPerSecond}/sec
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Burst Capacity</span>
                      <span className="text-sm font-medium font-mono">
                        {apiKeyDetail.rateLimitInfo.burstCapacity}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Requests/Minute</span>
                      <span className="text-sm font-medium font-mono">
                        {apiKeyDetail.rateLimitInfo.requestsPerMinute}/min
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Requests/Hour</span>
                      <span className="text-sm font-medium font-mono">
                        {apiKeyDetail.rateLimitInfo.requestsPerHour}/hr
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <Clock className="h-8 w-8 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">Rate Limit is <span className="font-medium text-red-600">disabled</span>.</p>
                    <p className="text-xs mt-1">Click the edit button to configure.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* 사용처 (Usages) */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Server className="h-4 w-4" />
                Usage
                <Badge variant="secondary" className="ml-2">
                  {usageData?.deployedUsages?.length || 0}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className='max-h-[192px] overflow-y-auto'>
              {isUsageLoading ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                  <span className="ml-2 text-gray-500">Loading usage information...</span>
                </div>
              ) : usageData?.deployedUsages && usageData.deployedUsages.length > 0 ? (
                <div className="space-y-3">
                  {usageData.deployedUsages.map((usage, idx) => (
                    <div
                      key={`deployed-${idx}`}
                      className="border rounded-lg p-3 bg-gray-50 dark:bg-gray-800"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="font-mono text-xs">
                          {usage.stageName}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          Stage ID: {usage.stageId}
                        </span>
                      </div>
                      <div className="space-y-1">
                        {usage.methods.map((method, mIdx) => (
                          <div
                            key={`method-${mIdx}`}
                            className="flex items-center gap-2 text-sm bg-white dark:bg-gray-900 px-2 py-1 rounded"
                          >
                            <span
                              className={`${getMethodStyle(method.httpMethod as HttpMethod)} !text-xs !px-1.5 !py-0.5 rounded font-mono font-bold`}
                            >
                              {method.httpMethod}
                            </span>
                            <code className="text-gray-600 dark:text-gray-400">
                              {method.resourcePath}
                            </code>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <Server className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No deployed usages.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
