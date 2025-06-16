"use client"

import { useState } from "react"
import { AppLayout } from "@/components/app-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Search, Plus, Edit, Trash2, Settings, Database, Globe, Shield, Zap, Minus, Save } from "lucide-react"
import { cn } from "@/lib/utils"

interface ConfigItem {
  id: string
  key: string
  value: string
  description?: string
  environment: "development" | "staging" | "production"
  category: "database" | "api" | "security" | "feature" | "general"
  lastModified: string
}

interface InputPair {
  id: string
  key: string
  value: string
}

const initialConfigs: ConfigItem[] = [
  {
    id: "1",
    key: "DATABASE_URL",
    value: "postgresql://localhost:5432/myapp",
    description: "메인 데이터베이스 연결 URL",
    environment: "development",
    category: "database",
    lastModified: "2024-01-15",
  },
  {
    id: "2",
    key: "API_BASE_URL",
    value: "https://api.example.com/v1",
    description: "API 서버 기본 URL",
    environment: "production",
    category: "api",
    lastModified: "2024-01-14",
  },
  {
    id: "3",
    key: "JWT_SECRET",
    value: "***hidden***",
    description: "JWT 토큰 암호화 키",
    environment: "production",
    category: "security",
    lastModified: "2024-01-13",
  },
  {
    id: "4",
    key: "FEATURE_NEW_UI",
    value: "true",
    description: "새로운 UI 기능 활성화",
    environment: "staging",
    category: "feature",
    lastModified: "2024-01-12",
  },
  {
    id: "5",
    key: "MAX_FILE_SIZE",
    value: "10485760",
    description: "최대 파일 업로드 크기 (bytes)",
    environment: "production",
    category: "general",
    lastModified: "2024-01-11",
  },
]

const categoryIcons = {
  database: Database,
  api: Globe,
  security: Shield,
  feature: Zap,
  general: Settings,
}

const environmentColors = {
  development: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  staging: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  production: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
}

export default function ConfigPage() {
  const [configs, setConfigs] = useState<ConfigItem[]>(initialConfigs)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedEnvironment, setSelectedEnvironment] = useState<string>("all")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [editingConfig, setEditingConfig] = useState<ConfigItem | null>(null)

  // 동적 입력 필드 관리
  const [inputPairs, setInputPairs] = useState<InputPair[]>([{ id: "1", key: "", value: "" }])
  const [defaultEnvironment, setDefaultEnvironment] = useState<"development" | "staging" | "production">("development")
  const [defaultCategory, setDefaultCategory] = useState<"database" | "api" | "security" | "feature" | "general">(
    "general",
  )

  const filteredConfigs = configs.filter((config) => {
    const matchesSearch =
      config.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      config.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (config.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
    const matchesEnvironment = selectedEnvironment === "all" || config.environment === selectedEnvironment
    const matchesCategory = selectedCategory === "all" || config.category === selectedCategory

    return matchesSearch && matchesEnvironment && matchesCategory
  })

  const addInputPair = () => {
    const newId = (Math.max(...inputPairs.map((p) => Number.parseInt(p.id))) + 1).toString()
    setInputPairs([...inputPairs, { id: newId, key: "", value: "" }])
  }

  const removeInputPair = (id: string) => {
    if (inputPairs.length > 1) {
      setInputPairs(inputPairs.filter((pair) => pair.id !== id))
    }
  }

  const updateInputPair = (id: string, field: "key" | "value", value: string) => {
    setInputPairs(inputPairs.map((pair) => (pair.id === id ? { ...pair, [field]: value } : pair)))
  }

  const saveConfigs = () => {
    const validPairs = inputPairs.filter((pair) => pair.key.trim() && pair.value.trim())

    if (validPairs.length === 0) {
      return
    }

    const newConfigs = validPairs.map((pair) => ({
      id: Date.now().toString() + pair.id,
      key: pair.key.trim(),
      value: pair.value.trim(),
      description: "",
      environment: defaultEnvironment,
      category: defaultCategory,
      lastModified: new Date().toISOString().split("T")[0],
    }))

    setConfigs([...configs, ...newConfigs])
    setInputPairs([{ id: "1", key: "", value: "" }])
  }

  const handleEditConfig = (config: ConfigItem) => {
    setEditingConfig(config)
  }

  const handleUpdateConfig = () => {
    if (editingConfig) {
      setConfigs(
        configs.map((config) =>
          config.id === editingConfig.id
            ? { ...editingConfig, lastModified: new Date().toISOString().split("T")[0] }
            : config,
        ),
      )
      setEditingConfig(null)
    }
  }

  const handleDeleteConfig = (id: string) => {
    setConfigs(configs.filter((config) => config.id !== id))
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <Settings className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Configuration Server</h1>
              <p className="text-gray-600 dark:text-gray-400">중앙 집중식 설정 관리 및 환경 변수 제어</p>
            </div>
          </div>
        </div>

        {/* Key-Value Input Section */}
        <Card className="border-2 border-dashed border-blue-200 dark:border-blue-800 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-blue-600" />새 설정 추가
            </CardTitle>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <Label htmlFor="default-env" className="text-sm font-medium">
                  기본 환경:
                </Label>
                <select
                  id="default-env"
                  value={defaultEnvironment}
                  onChange={(e) => setDefaultEnvironment(e.target.value as any)}
                  className="px-2 py-1 border border-input bg-background rounded text-sm"
                >
                  <option value="development">Development</option>
                  <option value="staging">Staging</option>
                  <option value="production">Production</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="default-cat" className="text-sm font-medium">
                  기본 카테고리:
                </Label>
                <select
                  id="default-cat"
                  value={defaultCategory}
                  onChange={(e) => setDefaultCategory(e.target.value as any)}
                  className="px-2 py-1 border border-input bg-background rounded text-sm"
                >
                  <option value="general">General</option>
                  <option value="database">Database</option>
                  <option value="api">API</option>
                  <option value="security">Security</option>
                  <option value="feature">Feature</option>
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {inputPairs.map((pair, index) => (
              <div
                key={pair.id}
                className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
              >
                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium">
                  {index + 1}
                </div>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor={`key-${pair.id}`} className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Key
                    </Label>
                    <Input
                      id={`key-${pair.id}`}
                      placeholder="예: DATABASE_URL"
                      value={pair.key}
                      onChange={(e) => updateInputPair(pair.id, "key", e.target.value)}
                      className="border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label
                      htmlFor={`value-${pair.id}`}
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Value
                    </Label>
                    <Input
                      id={`value-${pair.id}`}
                      placeholder="설정 값을 입력하세요"
                      value={pair.value}
                      onChange={(e) => updateInputPair(pair.id, "value", e.target.value)}
                      className="border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addInputPair}
                    className="h-8 w-8 p-0 border-green-300 text-green-600 hover:bg-green-50 hover:border-green-400 dark:border-green-700 dark:text-green-400 dark:hover:bg-green-950"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  {inputPairs.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeInputPair(pair.id)}
                      className="h-8 w-8 p-0 border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-950"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}

            <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                onClick={saveConfigs}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6"
                disabled={!inputPairs.some((pair) => pair.key.trim() && pair.value.trim())}
              >
                <Save className="h-4 w-4 mr-2" />
                설정 저장
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Search and Filter Controls */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="설정 키, 값, 설명으로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={selectedEnvironment}
              onChange={(e) => setSelectedEnvironment(e.target.value)}
              className="px-3 py-2 border border-input bg-background rounded-md text-sm"
            >
              <option value="all">모든 환경</option>
              <option value="development">Development</option>
              <option value="staging">Staging</option>
              <option value="production">Production</option>
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-input bg-background rounded-md text-sm"
            >
              <option value="all">모든 카테고리</option>
              <option value="database">Database</option>
              <option value="api">API</option>
              <option value="security">Security</option>
              <option value="feature">Feature</option>
              <option value="general">General</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">전체 설정</p>
                  <p className="text-2xl font-bold">{configs.length}</p>
                </div>
                <Settings className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Production</p>
                  <p className="text-2xl font-bold">{configs.filter((c) => c.environment === "production").length}</p>
                </div>
                <div className="h-8 w-8 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                  <div className="h-4 w-4 bg-red-500 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Staging</p>
                  <p className="text-2xl font-bold">{configs.filter((c) => c.environment === "staging").length}</p>
                </div>
                <div className="h-8 w-8 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                  <div className="h-4 w-4 bg-yellow-500 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Development</p>
                  <p className="text-2xl font-bold">{configs.filter((c) => c.environment === "development").length}</p>
                </div>
                <div className="h-8 w-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <div className="h-4 w-4 bg-green-500 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Config List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">저장된 설정</h2>
          <div className="grid gap-4">
            {filteredConfigs.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">설정이 없습니다</h3>
                  <p className="text-gray-500 dark:text-gray-400">검색 조건을 변경하거나 새 설정을 추가해보세요.</p>
                </CardContent>
              </Card>
            ) : (
              filteredConfigs.map((config) => {
                const CategoryIcon = categoryIcons[config.category]
                return (
                  <Card key={config.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                            <CategoryIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-gray-900 dark:text-white truncate">{config.key}</h3>
                              <Badge className={cn("text-xs", environmentColors[config.environment])}>
                                {config.environment}
                              </Badge>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-md p-3 mb-2">
                              <code className="text-sm text-gray-800 dark:text-gray-200 break-all">
                                {config.category === "security" && config.value.includes("***")
                                  ? config.value
                                  : config.value}
                              </code>
                            </div>
                            {config.description && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{config.description}</p>
                            )}
                            <p className="text-xs text-gray-500 dark:text-gray-500">
                              마지막 수정: {config.lastModified}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button variant="outline" size="sm" onClick={() => handleEditConfig(config)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteConfig(config.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>
        </div>

        {/* Edit Dialog */}
        <Dialog open={!!editingConfig} onOpenChange={() => setEditingConfig(null)}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>설정 수정</DialogTitle>
              <DialogDescription>기존 설정을 수정합니다.</DialogDescription>
            </DialogHeader>
            {editingConfig && (
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-key">키</Label>
                  <Input
                    id="edit-key"
                    value={editingConfig.key}
                    onChange={(e) => setEditingConfig({ ...editingConfig, key: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-value">값</Label>
                  <Textarea
                    id="edit-value"
                    value={editingConfig.value}
                    onChange={(e) => setEditingConfig({ ...editingConfig, value: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-description">설명</Label>
                  <Input
                    id="edit-description"
                    value={editingConfig.description || ""}
                    onChange={(e) => setEditingConfig({ ...editingConfig, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-environment">환경</Label>
                    <select
                      id="edit-environment"
                      value={editingConfig.environment}
                      onChange={(e) => setEditingConfig({ ...editingConfig, environment: e.target.value as any })}
                      className="px-3 py-2 border border-input bg-background rounded-md text-sm"
                    >
                      <option value="development">Development</option>
                      <option value="staging">Staging</option>
                      <option value="production">Production</option>
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-category">카테고리</Label>
                    <select
                      id="edit-category"
                      value={editingConfig.category}
                      onChange={(e) => setEditingConfig({ ...editingConfig, category: e.target.value as any })}
                      className="px-3 py-2 border border-input bg-background rounded-md text-sm"
                    >
                      <option value="general">General</option>
                      <option value="database">Database</option>
                      <option value="api">API</option>
                      <option value="security">Security</option>
                      <option value="feature">Feature</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingConfig(null)}>
                취소
              </Button>
              <Button onClick={handleUpdateConfig}>저장</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  )
}
