"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle, Folder, GitBranch, FolderPlus } from "lucide-react"

interface CreateDirectoryModalProps {
  isOpen: boolean
  onClose: () => void
  projectSlug: string
  branch: string
  currentPath: string
  onDirectoryCreated: (directoryName: string) => void
}

export function CreateDirectoryModal({
  isOpen,
  onClose,
  projectSlug,
  branch,
  currentPath,
  onDirectoryCreated,
}: CreateDirectoryModalProps) {
  const [directoryName, setDirectoryName] = useState("")
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)

    if (!directoryName.trim()) {
      setError("Directory name is required")
      return
    }

    // 폴더명 유효성 검사
    const invalidChars = /[<>:"/\\|?*]/
    if (invalidChars.test(directoryName)) {
      setError("Directory name contains invalid characters")
      return
    }

    if (directoryName.startsWith(".")) {
      setError("Directory name cannot start with a dot")
      return
    }

    setIsLoading(true)

    try {
      // 여기서 실제 폴더 생성 API 호출
      await new Promise((resolve) => setTimeout(resolve, 1500)) // 시뮬레이션

      setSuccess(true)
      onDirectoryCreated(directoryName)

      setTimeout(() => {
        handleClose()
      }, 1000)
    } catch (err) {
      setError("Failed to create directory. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setDirectoryName("")
    setDescription("")
    setError("")
    setSuccess(false)
    setIsLoading(false)
    onClose()
  }

  const fullPath = currentPath ? `${currentPath}/${directoryName || "new-folder"}` : directoryName || "new-folder"

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center text-blue-900">
            <FolderPlus className="h-5 w-5 mr-2" />
            Create New Directory
          </DialogTitle>
          <DialogDescription>
            Create a new directory in your repository. Choose a descriptive name for better organization.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 현재 위치 정보 */}
          <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200/50">
            <div className="flex items-center space-x-2 text-sm">
              <Badge variant="outline" className="border-blue-200 text-blue-700">
                <GitBranch className="h-3 w-3 mr-1" />
                {branch}
              </Badge>
              <span className="text-blue-700">
                <Folder className="h-3 w-3 inline mr-1" />
                {currentPath || "root"}
              </span>
            </div>
          </div>

          {/* 폴더명 입력 */}
          <div className="space-y-2">
            <Label htmlFor="directoryName" className="text-sm font-medium">
              Directory Name *
            </Label>
            <div className="relative">
              <Folder className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                id="directoryName"
                value={directoryName}
                onChange={(e) => setDirectoryName(e.target.value)}
                placeholder="Enter directory name"
                className="pl-10 border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                disabled={isLoading}
              />
            </div>
            <p className="text-xs text-gray-500">Avoid special characters: {'< > : " / \\ | ? *'}</p>
          </div>

          {/* 설명 입력 (선택사항) */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description (Optional)
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of this directory's purpose"
              className="resize-none h-20 border-blue-200 focus:border-blue-400 focus:ring-blue-400"
              disabled={isLoading}
            />
          </div>

          {/* 생성될 경로 미리보기 */}
          <div className="p-3 bg-gray-50 rounded-lg border">
            <p className="text-xs text-gray-600 mb-1">Directory will be created at:</p>
            <code className="text-sm font-mono text-blue-700 bg-blue-50 px-2 py-1 rounded">{fullPath}</code>
          </div>

          {/* 에러/성공 메시지 */}
          {error && (
            <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-lg border border-green-200">
              <CheckCircle className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm">Directory created successfully!</span>
            </div>
          )}

          <DialogFooter className="flex space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="border-blue-200 hover:bg-blue-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !directoryName.trim()}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <FolderPlus className="h-4 w-4 mr-2" />
                  Create Directory
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
