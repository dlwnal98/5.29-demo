'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Plus, AlertCircle, Key, Settings } from 'lucide-react';
import { SetStateAction } from 'react';
import { ApiKey } from '@/hooks/use-apiKeys';
import { useCreateAPIKey } from '@/hooks/use-apiKeys';
import { useState } from 'react';
import { toast, Toaster } from 'sonner';

interface SeleceAPIKeyProps {
  open: boolean;
  onOpenChange: React.Dispatch<SetStateAction<boolean>>;
  isCreatingNewApiKey: boolean;
  setIsCreatingNewApiKey: React.Dispatch<SetStateAction<boolean>>;
  apiKeyList: ApiKey[];
  selectedApiKeyId: string;
  setSelectedApiKeyId: React.Dispatch<SetStateAction<string>>;
  setSelectedApiKey: React.Dispatch<SetStateAction<string>>;
  newApiKeyForm: { name: string; description: string };
  setNewApiKeyForm: React.Dispatch<SetStateAction<any>>;
  setApiKeyToggle: React.Dispatch<SetStateAction<boolean>>;
  userKey: string;
  organizationId: string;
}

export function SelectAPIKeyModal({
  open,
  onOpenChange,
  isCreatingNewApiKey,
  setIsCreatingNewApiKey,
  selectedApiKeyId,
  setSelectedApiKeyId,
  setSelectedApiKey,
  apiKeyList,
  newApiKeyForm,
  setNewApiKeyForm,
  userKey,
  organizationId,
  setApiKeyToggle,
}: SeleceAPIKeyProps) {
  const [selectApiKey, setSelectApiKey] = useState('');

  const { mutate: createAPIKey } = useCreateAPIKey({
    onSuccess: (data) => {
      toast.success('성공');
      onOpenChange(false);
      // setNewApiKeyForm({ name: '', description: '' });
      console.log(data);
      setApiKeyToggle(true);
      setSelectedApiKey(data.key);
      // setSelectedApiKeyId('');
    },
    onError: () => {
      toast.error('실패');
      setApiKeyToggle(false);
    },
  });

  const handleCreateAPIKey = () => {
    if (isCreatingNewApiKey) {
      createAPIKey({
        userKey,
        keyName: newApiKeyForm.name,
        description: newApiKeyForm.description,
        organizationId,
      });
    } else {
      setSelectedApiKeyId(selectApiKey);
      setApiKeyToggle(true);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto overflow-x-hidden">
        <DialogHeader className="w-full">
          <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Key className="h-5 w-5" />
            API 키 설정
          </DialogTitle>
        </DialogHeader>

        <div className="w-full py-4">
          {/* Toggle between existing and new API key */}
          <div className="flex items-center gap-4 mb-6 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg box-border">
            <Button
              variant={!isCreatingNewApiKey ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setIsCreatingNewApiKey(false);
                setNewApiKeyForm({ name: '', description: '' });
              }}
              className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              기존 API 키 선택
            </Button>
            <Button
              variant={isCreatingNewApiKey ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setIsCreatingNewApiKey(true);
                setNewApiKeyForm({ name: '', description: '' });
              }}
              className="flex items-center gap-2">
              <Plus className="h-4 w-4" />새 API 키 생성
            </Button>
          </div>

          {!isCreatingNewApiKey ? (
            // Existing API Keys Selection
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                사용할 API 키를 선택하세요.
              </p>

              {apiKeyList?.length > 0 ? (
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {apiKeyList?.map((apiKey, i) => (
                    <div
                      key={i}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        selectApiKey === apiKey.keyId
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                      onClick={() => {
                        setSelectApiKey(apiKey.keyId);
                        setNewApiKeyForm({
                          ...newApiKeyForm,
                          name: apiKey.name,
                          description: apiKey.description,
                        });
                        setSelectedApiKey(apiKey.key);
                      }}>
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="apiKey"
                          value={apiKey.keyId}
                          checked={selectApiKey === apiKey.keyId}
                          onChange={() => {
                            setSelectApiKey(apiKey.keyId);
                            setNewApiKeyForm({
                              ...newApiKeyForm,
                              name: apiKey.name,
                              description: apiKey.description,
                            });
                            setSelectedApiKey(apiKey.key);
                          }}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {apiKey.name}
                            </h4>
                            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs rounded-full font-medium">
                              ID: {apiKey.keyId}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {apiKey.description}
                          </p>
                          <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded text-xs font-mono text-gray-700 dark:text-gray-300 break-all">
                            {apiKey.key}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Key className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>등록된 API 키가 없습니다.</p>
                  <p className="text-sm">새 API 키를 생성해주세요.</p>
                </div>
              )}
            </div>
          ) : (
            // New API Key Creation Form
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                새로운 API 키를 생성합니다.
              </p>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="new-api-key-name" className="text-sm font-medium">
                    API 키 이름 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="new-api-key-name"
                    placeholder="예: Production API Key"
                    value={newApiKeyForm.name}
                    onChange={(e) => setNewApiKeyForm({ ...newApiKeyForm, name: e.target.value })}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="new-api-key-description" className="text-sm font-medium">
                    설명
                  </Label>
                  <Textarea
                    id="new-api-key-description"
                    placeholder="API 키에 대한 설명을 입력하세요"
                    value={newApiKeyForm.description}
                    onChange={(e) =>
                      setNewApiKeyForm({ ...newApiKeyForm, description: e.target.value })
                    }
                    className="mt-1 min-h-[80px]"
                  />
                </div>

                <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-800 dark:text-blue-200">
                      <p className="font-medium mb-1">참고사항</p>
                      <p>API 키는 자동으로 생성되며, 생성된 해당 API키로 설정됩니다.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="w-full gap-2">
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
            }}>
            취소
          </Button>
          <Button
            onClick={handleCreateAPIKey}
            className="bg-blue-600 hover:bg-blue-700 text-white"
            // disabled={
            //   isCreatingNewApiKey
            //     ? !newApiKeyForm.name.trim()
            //     : !selectedApiKeyId && apiKeyList?.length > 0
            // }
          >
            {isCreatingNewApiKey ? '생성 및 선택' : '선택'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
