import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    ArrowLeft,
    ChevronDown,
    Search,
    Settings2,
    ExternalLink,
    Plus,
    Rocket,
    Download,
    Filter,
    Layers,
    ShieldCheck,
    ShieldOff,
    Zap,
    Shield
} from "lucide-react";
import type { Resource, Method } from "@/types/resource";
import { getMethodStyle, HttpMethod } from "@/libs/etc";
import { ResourceDetailCard } from "./components/ResourceDetailCard";
import MethodDetailCard from "./components/MethodDetailCard";
import { CorsSettingsDialog } from "./components/CorsSettingsDialog";
import { useCorsSettingsDialog } from "./hooks/useCorsSettingsDialog";
import { RefObject } from "react";

interface ResourcesGridPageViewProps {
    leftSidebarRef: RefObject<HTMLDivElement>;
    rightContentRef: RefObject<HTMLDivElement>;
    tree: Resource[];
    selectedResource: Resource | null;
    selectedMethod: Method | null;
    expandedResources: string[] | undefined;
    currentApiId: string;
    currentApiName: string;
    userKey: string;
    onNavigateBack: () => void;
    onResourceClick: (res: Resource) => void;
    onMethodClick: (method: Method, resource: Resource) => void;
    onToggleResourceExpansion: (id: string) => void;
    onOpenDeployModal: () => void;
    onOpenExportModal: () => void;
    onOpenCreateModal: () => void;
    setSelectedResource: (resource: Resource | null) => void;
    setCreatedResourceId: (id: string) => void;
    onMethodDeleted: () => void;
    onResourceDeleted: () => void;
    onCorsSettingsSaved: () => void;
}

export default function ResourcesGridPageView({
    leftSidebarRef,
    rightContentRef,
    tree,
    selectedResource,
    selectedMethod,
    expandedResources,
    currentApiId,
    currentApiName,
    userKey,
    onNavigateBack,
    onResourceClick,
    onMethodClick,
    onToggleResourceExpansion,
    onOpenDeployModal,
    onOpenExportModal,
    onOpenCreateModal,
    setSelectedResource,
    setCreatedResourceId,
    onMethodDeleted,
    onResourceDeleted,
    onCorsSettingsSaved,
}: ResourcesGridPageViewProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [viewMode, setViewMode] = useState<"grid" | "detail">("grid");
    const [isCorsModalOpen, setIsCorsModalOpen] = useState(false);
    const [corsResource, setCorsResource] = useState<Resource | null>(null);

    // Flatten the resource tree for the table view (Resources only)
    const flattenedResources = useMemo(() => {
        const result: { resource: Resource }[] = [];

        const flatten = (list: Resource[]) => {
            list.forEach((res) => {
                result.push({ resource: res });
                if (res.children && res.children.length > 0) {
                    flatten(res.children);
                }
            });
        };

        flatten(tree);
        return result;
    }, [tree]);

    // Filter based on search term
    const filteredData = useMemo(() => {
        if (!searchTerm) return flattenedResources;

        const term = searchTerm.toLowerCase();
        return flattenedResources.filter((item) => {
            const pathMatch = item.resource.path.toLowerCase().includes(term);
            const nameMatch = item.resource.name.toLowerCase().includes(term);
            const idMatch = item.resource.resourceId?.toLowerCase().includes(term) || false;
            const descMatch = (item.resource.description || "").toLowerCase().includes(term);

            return pathMatch || nameMatch || idMatch || descMatch;
        });
    }, [flattenedResources, searchTerm]);

    const corsDialog = useCorsSettingsDialog({
        apiId: currentApiId,
        open: isCorsModalOpen,
        resourceId: corsResource?.resourceId || "",
        userKey,
        selectedResource: corsResource as Resource,
        onOpenChange: setIsCorsModalOpen,
        onCorsSettingsSaved,
    });

    const handleRowClick = (item: { resource: Resource }) => {
        onResourceClick(item.resource);
        setViewMode("detail");
    };

    const handleOpenCors = (e: React.MouseEvent, res: Resource) => {
        e.stopPropagation();
        setCorsResource(res);
        setIsCorsModalOpen(true);
    };

    const handleBack = () => {
        if (viewMode === "detail") {
            if (selectedMethod) {
                // If in Method Detail, go back to Resource Detail
                onResourceClick(selectedResource!);
            } else {
                // If in Resource Detail, go back to Grid
                setViewMode("grid");
            }
        } else {
            // If in Grid, go back to previous page
            onNavigateBack();
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-800/30 dark:text-green-300 dark:border-green-700';
            case 'inactive':
                return 'bg-gray-100 text-gray-500 border-gray-200 dark:bg-gray-800/30 dark:text-gray-400 dark:border-gray-700';
            default:
                return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-800/30 dark:text-amber-200 dark:border-amber-700';
        }
    };

    return (
        <div className="container mx-auto px-6 py-8 animate-in fade-in duration-500">
            <div className="flex flex-col gap-1 mb-8">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/services/api-management" className="transition-colors hover:text-blue-600">
                                Services
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/services/api-management" className="transition-colors hover:text-blue-600">
                                API Management
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage className="font-semibold">Resource : {currentApiName}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-5">
                <div className="flex items-center gap-5">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={handleBack}
                        className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 active:scale-95"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                            {viewMode === "grid" ? "API Resources" : (selectedMethod ? "Method Details" : "Resource Details")}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
                            {viewMode === "grid"
                                ? "API 게이트웨이 내에서 엔드포인트 경로(URI)를 한눈에 파악하고 관리하세요."
                                : (selectedMethod ? `Method: ${selectedMethod.type} ${selectedResource?.path}` : `Resource: ${selectedResource?.path}`)}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="default"
                                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl px-6 py-5 transition-all duration-300 shadow-lg shadow-orange-500/20 active:scale-95 flex gap-2"
                            >
                                <Layers className="h-4 w-4" />
                                API 작업
                                <ChevronDown className="h-4 w-4 opacity-70" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 p-1 rounded-xl shadow-xl border-gray-100 dark:border-gray-800">
                            <DropdownMenuItem
                                className="cursor-pointer rounded-lg px-3 py-2.5 focus:bg-orange-50 dark:focus:bg-orange-900/20 flex gap-2"
                                onClick={onOpenDeployModal}
                            >
                                <Rocket className="h-4 w-4 text-orange-500" />
                                <span>API 배포</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="cursor-pointer rounded-lg px-3 py-2.5 focus:bg-orange-50 dark:focus:bg-orange-900/20 flex gap-2"
                                onClick={onOpenExportModal}
                            >
                                <Download className="h-4 w-4 text-orange-500" />
                                <span>API 내보내기</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {viewMode === "grid" ? (
                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                        <div className="relative w-full sm:w-96 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                            <Input
                                placeholder="이름, 경로, ID, 메소드, 설명으로 검색..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-11 h-11 bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800 rounded-xl focus-visible:ring-blue-500/20 focus-visible:border-blue-500 transition-all shadow-none"
                            />
                        </div>

                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <Button
                                variant="outline"
                                className="h-11 rounded-xl flex gap-2 border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 w-full sm:w-auto"
                            >
                                <Filter className="h-4 w-4" />
                                필터
                            </Button>
                            <Button
                                onClick={onOpenCreateModal}
                                className="h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl flex gap-2 px-6 transition-all shadow-lg shadow-blue-500/20 active:scale-95 w-full sm:w-auto"
                            >
                                <Plus className="h-4 w-4" />
                                Resource 생성
                            </Button>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xl shadow-gray-200/20 dark:shadow-none">
                        <Table>
                            <TableHeader className="bg-gray-50/50 dark:bg-gray-800/50">
                                <TableRow className="hover:bg-transparent border-gray-100 dark:border-gray-800">
                                    <TableHead className="w-[200px] font-bold text-center text-gray-700 dark:text-gray-300 py-5">리소스 이름</TableHead>
                                    <TableHead className="w-[250px] font-bold text-center text-gray-700 dark:text-gray-300">엔드포인트 경로</TableHead>
                                    <TableHead className="w-[150px] font-bold text-center text-gray-700 dark:text-gray-300">리소스 ID</TableHead>
                                    <TableHead className="w-[480px] font-bold text-center text-gray-700 dark:text-gray-300">설명</TableHead>
                                    <TableHead className="w-[150px] font-bold text-center text-gray-700 dark:text-gray-300">CORS</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredData.length > 0 ? (
                                    filteredData.map((item, idx) => (
                                        <TableRow
                                            key={`${item.resource.id}-${idx}`}
                                            onClick={() => handleRowClick(item)}
                                            className="group cursor-pointer hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors border-gray-100 dark:border-gray-800"
                                        >
                                            <TableCell className="py-4 font-medium text-center text-gray-900 dark:text-white">
                                                {item.resource.name === "/" ? "/" : item.resource.name}
                                            </TableCell>
                                            <TableCell className="py-4 text-center">
                                                <code className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-blue-600 dark:text-blue-400 font-mono">
                                                    {item.resource.path}
                                                </code>
                                            </TableCell>
                                            <TableCell className="py-4 text-xs text-center font-mono text-gray-500 dark:text-gray-400">
                                                {item.resource.resourceId}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <span className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                                                    {item.resource.description || "-"}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Badge variant="outline" className={`${getStatusColor(item.resource.cors ? 'active' : 'inactive')} font-medium`}>
                                                        {item.resource.cors ? 'Active' : 'Inactive'}
                                                    </Badge>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                                                        onClick={(e) => handleOpenCors(e, item.resource)}
                                                        title="CORS 설정"
                                                    >
                                                        <Shield className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-64 text-center">
                                            <div className="flex flex-col items-center justify-center gap-3 text-gray-400">
                                                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-full">
                                                    <Search className="h-8 w-8" />
                                                </div>
                                                <p className="text-lg font-medium">검색 결과가 없습니다</p>
                                                <p className="text-sm">다른 검색어를 입력하거나 필터를 조정해보세요.</p>
                                                <Button
                                                    variant="ghost"
                                                    onClick={() => setSearchTerm("")}
                                                    className="mt-2 text-blue-500 hover:text-blue-600"
                                                >
                                                    검색어 초기화
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            ) : (
                <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                    {selectedMethod ? (
                        <div ref={rightContentRef} className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden">
                            <MethodDetailCard selectedMethod={selectedMethod} noBorder={true} />
                        </div>
                    ) : selectedResource ? (
                        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl overflow-hidden">
                            <ResourceDetailCard
                                selectedResource={selectedResource}
                                setSelectedResource={setSelectedResource as any}
                                handleMethodClick={(m, r) => {
                                    onMethodClick(m, r);
                                    setViewMode("detail");
                                }}
                                apiId={currentApiId}
                                setCreatedResourceId={setCreatedResourceId}
                                onMethodDeleted={onMethodDeleted}
                                onResourceDeleted={() => {
                                    onResourceDeleted();
                                    setViewMode("grid");
                                }}
                                onCorsSettingsSaved={onCorsSettingsSaved}
                                noBorder={true}
                            />
                        </div>
                    ) : null}
                </div>
            )}
            <CorsSettingsDialog
                open={isCorsModalOpen}
                onOpenChange={setIsCorsModalOpen}
                corsForm={corsDialog.corsForm}
                selectedMethods={corsDialog.selectedMethods}
                isPending={corsDialog.isPending}
                onSaveCorsSettings={corsDialog.onSaveCorsSettings}
                onMethodToggle={corsDialog.onMethodToggle}
                onCommaSeparatedInputChange={corsDialog.onCommaSeparatedInputChange}
                onMaxAgeChange={corsDialog.onMaxAgeChange}
                onAllowCredentialsChange={corsDialog.onAllowCredentialsChange}
                onCorsEnabledChange={corsDialog.onCorsEnabledChange}
            />
        </div>
    );
}
