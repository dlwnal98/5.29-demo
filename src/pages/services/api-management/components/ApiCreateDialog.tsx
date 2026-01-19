import React, { useEffect, useState, useMemo } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@/components/ui/select';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';
import { sampleApiData } from '@/constants/sample-api-data';
import { useCloneCreateAPI, useCreateAPI, useUploadOpenAPIDocCreateAPI } from '@/hooks/use-apimanagement';
import { APIListData } from '@/apis/api-management.api';

interface ApiCreateModalProps {
    userKey: string;
    tenantId: string;
    open: boolean;
    apiList: APIListData[];
    onOpenChange: (open: boolean) => void;
    onAfterCreate?: () => void;
}

const ApiCreateDialog = ({
    userKey,
    tenantId,
    open,
    apiList,
    onOpenChange,
    onAfterCreate,
}: ApiCreateModalProps) => {
    const [createApiForm, setCreateApiForm] = useState({
        tenantId: tenantId,
        name: '',
        description: '',
        createdBy: userKey,
        swaggerContent: '',
    });
    const [apiType, setApiType] = useState('new');
    const [swaggerFile, setSwaggerFile] = useState<File | null>(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const [sourcePlanId, setSourcePlanId] = useState('');

    useEffect(() => {
        if (tenantId && userKey) {
            setCreateApiForm((prev) => ({ ...prev, tenantId: tenantId, createdBy: userKey }));
        }
    }, [tenantId, userKey]);

    // 파일 드래그/업로드 핸들러
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };
    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    };
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (
                file?.type === 'application/json' ||
                file?.name?.endsWith('.json') ||
                file?.name?.endsWith('.yaml') ||
                file?.name?.endsWith('.yml')
            ) {
                setSwaggerFile(file);
                const reader = new FileReader();
                reader.onload = (e) => {
                    const content = e.target?.result as string;
                    setCreateApiForm((prev) => ({ ...prev, swaggerContent: content }));
                };
                reader.readAsText(file);
            } else {
                toast.error('Only JSON and YAML files can be uploaded.');
            }
        }
    };
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSwaggerFile(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target?.result as string;
                setCreateApiForm((prev) => ({ ...prev, swaggerContent: content }));
            };
            reader.readAsText(file);
        }

    };

    const resetForm = () => {
        setApiType('new');
        setSwaggerFile(null);
        setCreateApiForm((prev) => ({ ...prev, name: '', description: '', swaggerContent: '' }));
        setSourcePlanId('');
    };

    // API 직접입력 생성
    const { mutate: createAPI } = useCreateAPI({
        onSuccess: () => {
            onOpenChange(false);
            resetForm();
            onAfterCreate?.();
            toast.success(`API '${createApiForm.name}' has been created.`);
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message
                || error?.response?.data?.detail
                || error?.message
                || 'An error occurred while creating API.';
            toast.error(errorMessage);
        },
    });

    //API 복제 생성
    const { mutate: cloneCreateAPI } = useCloneCreateAPI({
        onSuccess: () => {
            onOpenChange(false);
            resetForm();
            onAfterCreate?.();
            toast.success(`API '${createApiForm.name}' has been created.`);
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message
                || error?.response?.data?.detail
                || error?.message
                || 'An error occurred while creating API.';
            toast.error(errorMessage);
        },
    });

    // OpenAPI API 생성
    const { mutate: uploadOpenAPIDoc } = useUploadOpenAPIDocCreateAPI({
        onSuccess: () => {
            onOpenChange(false);
            resetForm();
            onAfterCreate?.();
            toast.success('API has been created from Swagger document.');
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message
                || error?.response?.data?.errors?.[0]?.detail
                || error?.message
                || 'An error occurred while creating API.';
            toast.error(errorMessage);
        },
    });

    // 생성 버튼 클릭
    const handleCreateApi = () => {
        if (apiType === 'new') {
            if (!createApiForm.name.trim()) {
                toast.error('Please enter the API name.');
                return;
            }
            if (tenantId && userKey) {
                const { swaggerContent, ...apiData } = createApiForm;
                createAPI(apiData);
            }
        }

        if (apiType === 'copy') {
            if (!createApiForm.name.trim()) {
                toast.error('Please enter the API name.');
                return;
            }
            if (!sourcePlanId) {
                toast.error('Please select an API to copy.');
                return;
            }
            cloneCreateAPI({
                sourcePlanId,
                data: {
                    name: createApiForm.name,
                    description: createApiForm.description,
                    createdBy: userKey,
                }
            });
        }

        if (apiType === 'swagger') {
            if (!createApiForm.swaggerContent.trim()) {
                toast.error('Please enter Swagger content or upload a file.');
                return;
            }
            uploadOpenAPIDoc({
                tenantId,
                createdBy: userKey,
                data: createApiForm.swaggerContent,
            });
        }
    };

    // 취소 버튼 클릭
    const handleCancel = () => {
        onOpenChange(false);
        resetForm();
    };

    const isValidCreateApi = useMemo(() => {
        switch (apiType) {
            case 'new':
                return createApiForm.name.trim().length > 0;
            case 'copy':
                return createApiForm.name.trim().length > 0 && Boolean(sourcePlanId);
            case 'swagger':
                return createApiForm.swaggerContent.trim().length > 0;
            default:
                return false;
        }
    }, [apiType, createApiForm.name, createApiForm.swaggerContent, sourcePlanId]);

    // 타입별 입력 UI
    const renderCreateApiContent = () => {
        switch (apiType) {
            case 'copy':
                return (
                    <div className="space-y-4">
                        <div>
                            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                                Select API to Copy <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={sourcePlanId ? sourcePlanId : ''}
                                onValueChange={(value) => setSourcePlanId(value)}>
                                <SelectTrigger className="!h-[50px]">
                                    <SelectValue placeholder="Select API to copy" />
                                </SelectTrigger>
                                <SelectContent>
                                    {apiList?.map((api) => (
                                        <SelectItem key={api.apiId} value={api.apiId}>
                                            <div className="flex flex-col items-start">
                                                <span className="font-medium">{api.name}</span>
                                                <span className="text-xs text-gray-500">{api.apiId}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                );
            case 'swagger':
                return (
                    <div className="space-y-4">
                        <Tabs defaultValue="swagger" className="w-full">
                            <TabsContent value="swagger" className="space-y-4">
                                <input
                                    type="file"
                                    accept=".json,.yaml,.yml"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                    id="swagger-upload"
                                />
                                {!swaggerFile ? (
                                    <div
                                        className={`border-2 border-dashed rounded-lg text-center transition-colors ${isDragOver ? 'border-blue-500 bg-blue-100' : 'border-blue-300 bg-blue-50'
                                            }`}
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}>
                                        <label
                                            htmlFor="swagger-upload"
                                            className="flex flex-col items-center space-y-3 w-full h-full cursor-pointer mb-2 text-blue-600 p-8 ">
                                            <Upload className="h-8 w-8 text-blue-600 mx-auto" />
                                            <p className="text-gray-600">
                                                Drag file here or click to upload
                                            </p>
                                        </label>
                                    </div>
                                ) : (
                                    <div className="flex items-center">
                                        <label
                                            htmlFor="swagger-upload"
                                            className="flex items-center text-[12px] font-medium cursor-pointer text-blue-600 hover:text-blue-700 px-4 py-2 border border-blue-300 rounded-md hover:bg-blue-50 transition-colors">
                                            <Upload className="h-4 w-4 text-blue-600 mx-auto mr-2" /> Select File
                                        </label>
                                        <p className="ml-3 text-sm text-green-600 font-medium">
                                            Selected file: {swaggerFile?.name}
                                        </p>
                                    </div>
                                )}
                                <div className="grid grid-cols-4 gap-4">
                                    <div className="col-span-4">
                                        <Textarea
                                            placeholder="Enter Swagger JSON or YAML content..."
                                            value={createApiForm.swaggerContent}
                                            onChange={(e) => {
                                                setCreateApiForm((prev) => ({ ...prev, swaggerContent: e.target.value }));
                                            }}
                                            className="min-h-[300px] font-mono text-sm resize-none"
                                        />
                                    </div>
                                </div>
                            </TabsContent>
                            <TabsContent value="preview" className="space-y-4">
                                {createApiForm.swaggerContent ? (
                                    <div className="border rounded-lg bg-gray-50">
                                        <div className="p-3 border-b bg-white">
                                            <Label className="text-sm font-medium text-gray-700">Swagger Preview</Label>
                                        </div>
                                        <div className="p-4">
                                            <pre className="text-xs bg-white p-4 rounded border max-h-96 overflow-auto font-mono">
                                                {createApiForm.swaggerContent}
                                            </pre>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-12 text-gray-500">
                                        <p>No content to preview.</p>
                                        <p className="text-sm">Please enter content in the Swagger tab.</p>
                                    </div>
                                )}
                            </TabsContent>
                        </Tabs>
                    </div>
                );
            // case 'example':
            //     return (
            //         <div className="grid grid-cols-4 gap-4">
            //             <div className="col-span-4">
            //                 <Textarea
            //                     value={sampleApiData}
            //                     disabled
            //                     className="min-h-[300px] font-mono text-sm resize-none"
            //                 />
            //             </div>
            //         </div>
            //     );
            default:
                return null;
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto overflow-x-hidden">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-blue-600">Create API Plan</DialogTitle>
                    <DialogDescription className="text-gray-600 dark:text-gray-400">
                        APIs can be created in 3 ways. (<span className="text-red-500">*</span> Required fields)
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                    {/* API 생성 유형 */}
                    <div>
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
                            API Creation Type <span className="text-red-500">*</span>
                        </Label>
                        <RadioGroup
                            value={apiType}
                            onValueChange={(value) => {
                                setApiType(value);
                                setSwaggerFile(null);
                                setCreateApiForm((prev) => ({ ...prev, name: '', description: '', swaggerContent: '' }));
                                setSourcePlanId('');
                            }}
                            className="grid grid-cols-3 gap-4">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="new" id="new" />
                                <Label
                                    htmlFor="new"
                                    className={`text-sm ${apiType === 'new' ? 'text-blue-600 font-medium' : ''} hover:cursor-pointer`}>
                                    New API
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="copy" id="copy" />
                                <Label
                                    htmlFor="copy"
                                    className={`text-sm ${apiType === 'copy' ? 'text-blue-600 font-medium' : ''} hover:cursor-pointer`}>
                                    Copy API
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="swagger" id="swagger" />
                                <Label
                                    htmlFor="swagger"
                                    className={`text-sm ${apiType === 'swagger' ? 'text-blue-600 font-medium' : ''} hover:cursor-pointer`}>
                                    Import from OpenAPI
                                </Label>
                            </div>
                            {/* <div className="flex items-center space-x-2">
                                <RadioGroupItem value="example" id="example" />
                                <Label
                                    htmlFor="example"
                                    className={`text-sm ${apiType === 'example' ? 'text-blue-600 font-medium' : ''} hover:cursor-pointer`}>
                                    API 예제
                                </Label>
                            </div> */}
                        </RadioGroup>
                    </div>
                    {apiType !== 'swagger' && (
                        <>
                            {/* API 이름 */}

                            <div>
                                <Label htmlFor="api-name" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                                    API Name <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="api-name"
                                    placeholder="Enter API name"
                                    value={createApiForm.name}
                                    onChange={(e) => setCreateApiForm((prev) => ({ ...prev, name: e.target.value }))}
                                    className="w-full"
                                />
                            </div>
                            {/* 설명 */}
                            <div>
                                <Label htmlFor="description" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                                    Description
                                </Label>
                                <Textarea
                                    id="description"
                                    placeholder="Enter description"
                                    value={createApiForm.description}
                                    onChange={(e) =>
                                        setCreateApiForm((prev) => ({ ...prev, description: e.target.value }))
                                    }
                                    className="w-full min-h-[100px] resize-none"
                                    maxLength={300}
                                />
                                <div className="text-right text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    {createApiForm.description.length}/300 characters
                                </div>
                            </div>

                        </>
                    )}
                    {/* 타입별 추가 입력 */}
                    {renderCreateApiContent()}
                </div>
                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleCreateApi}
                        disabled={!isValidCreateApi}
                        className="bg-blue-500 hover:bg-blue-600 text-white">
                        Create
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ApiCreateDialog;
