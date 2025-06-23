"use client"

import { AppLayout } from "@/components/layout/AppLayout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  ArrowLeft,
  Edit,
  Trash2,
  Download,
  Copy,
  GitCommit,
  User,
  Calendar,
  GitBranch,
  Folder,
  File,
  FileText,
  Code,
  ImageIcon,
  Archive,
  Menu,
} from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useState } from "react"
import { DeleteConfirmationModal } from "@/components/delete-confirmation-modal"

// 파일 아이콘 함수
function getFileIcon(extension?: string) {
  switch (extension) {
    case "md":
      return <FileText className="h-4 w-4 text-indigo-500" />
    case "json":
    case "js":
    case "ts":
    case "tsx":
    case "jsx":
      return <Code className="h-4 w-4 text-amber-500" />
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
    case "svg":
      return <ImageIcon className="h-4 w-4 text-green-500" />
    case "zip":
    case "tar":
    case "gz":
      return <Archive className="h-4 w-4 text-purple-500" />
    default:
      return <File className="h-4 w-4 text-gray-500" />
  }
}

// 샘플 파일 구조
const fileStructure = [
  { name: ".github", type: "folder", level: 0 },
  { name: "workflows", type: "folder", level: 1 },
  { name: "ci.yml", type: "file", level: 2, extension: "yml" },
  { name: "src", type: "folder", level: 0 },
  { name: "components", type: "folder", level: 1 },
  { name: "ui", type: "folder", level: 2 },
  { name: "button.tsx", type: "file", level: 3, extension: "tsx" },
  { name: "input.tsx", type: "file", level: 3, extension: "tsx" },
  { name: "layout", type: "folder", level: 1 },
  { name: "header.tsx", type: "file", level: 2, extension: "tsx" },
  { name: "public", type: "folder", level: 0 },
  { name: "images", type: "folder", level: 1 },
  { name: "logo.png", type: "file", level: 2, extension: "png" },
  { name: "package.json", type: "file", level: 0, extension: "json" },
  { name: "README.md", type: "file", level: 0, extension: "md" },
  { name: "next.config.js", type: "file", level: 0, extension: "js" },
]

// 샘플 파일 데이터
const fileData = {
  "README.md": {
    content: `# My Project

A modern web application built with Next.js and React.

## Features

- 🚀 Fast and responsive
- 🎨 Beautiful UI with Tailwind CSS
- 📱 Mobile-first design
- 🔒 Secure authentication
- 📊 Real-time analytics

## Getting Started

First, install the dependencies:

\`\`\`bash
npm install
# or
yarn install
\`\`\`

Then, run the development server:

\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

\`\`\`
├── src/
│   ├── components/
│   ├── pages/
│   └── styles/
├── public/
└── package.json
\`\`\`

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License.`,
    size: "4.2 KB",
    lastCommit: {
      hash: "a1b2c3d",
      message: "Update documentation",
      author: "jane-smith",
      time: "2 hours ago",
    },
  },
  "package.json": {
    content: `{
  "name": "my-project",
  "version": "1.0.0",
  "description": "A modern web application",
  "main": "index.js",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "tailwindcss": "^3.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "typescript": "^5.0.0"
  }
}`,
    size: "2.1 KB",
    lastCommit: {
      hash: "f6g7h8i",
      message: "Update dependencies",
      author: "john-doe",
      time: "1 day ago",
    },
  },
}

export default function FileViewPage() {
  const searchParams = useSearchParams()
  const branch = searchParams.get("branch") || "main"
  const path = searchParams.get("path") || ""
  const fileName = searchParams.get("file") || ""

  const [selectedStructureItem, setSelectedStructureItem] = useState(fileName)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const currentFile = fileData[fileName as keyof typeof fileData]
  const fileExtension = fileName.split(".").pop()

  const handleBack = () => {
    const params = new URLSearchParams()
    params.set("branch", branch)
    if (path) params.set("path", path)
    window.location.href = `/infra-packages/config?${params.toString()}`
  }

  const handleEdit = () => {
    const params = new URLSearchParams()
    params.set("branch", branch)
    if (path) params.set("path", path)
    params.set("file", fileName)
    window.location.href = `/infra-packages/config/edit?${params.toString()}`
  }

  const handleDelete = () => {
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = () => {
    // 실제 삭제 로직 구현
    alert("File deleted successfully!")
    handleBack()
  }

  const handleCommitClick = () => {
    if (currentFile?.lastCommit) {
      const params = new URLSearchParams()
      params.set("branch", branch)
      params.set("commit", currentFile.lastCommit.hash)
      if (path) params.set("path", path)
      window.location.href = `/infra-packages/config/commit?${params.toString()}`
    }
  }

  const renderFileContent = () => {
    if (!currentFile) return null

    switch (fileExtension) {
      case "md":
        return (
          <div className="prose prose-sm max-w-none">
            <pre className="whitespace-pre-wrap font-mono text-sm bg-gray-50 p-4 rounded-lg overflow-auto">
              {currentFile.content}
            </pre>
          </div>
        )
      case "json":
        return (
          <pre className="language-json bg-gray-50 p-4 rounded-lg overflow-auto text-sm font-mono">
            {currentFile.content}
          </pre>
        )
      case "js":
      case "ts":
      case "tsx":
      case "jsx":
        return (
          <pre className="language-javascript bg-gray-50 p-4 rounded-lg overflow-auto text-sm font-mono">
            {currentFile.content}
          </pre>
        )
      default:
        return (
          <div className="flex items-center justify-center h-32 text-muted-foreground">
            <div className="text-center">
              <File className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Preview not available for this file type</p>
            </div>
          </div>
        )
    }
  }

  const breadcrumbItems = [
    { name: "/", href: "/" },
    { name: "config", href: `/infra-packages/config` },
    { name: fileName, href: "" },
  ]

  return (
    <AppLayout projectSlug="config">
      <div className="bg-transparent">
        <div className="flex h-[calc(100vh-4rem)]">
          {/* Left Sidebar - File Structure */}
          {sidebarOpen && (
            <div className="w-80 border-r border-blue-200/50 bg-white/70 backdrop-blur-sm">
              <div className="p-4 border-b border-blue-100 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
                <h3 className="font-semibold text-blue-900 flex items-center">
                  <Folder className="h-4 w-4 mr-2" />
                  File Structure
                </h3>
              </div>
              <div className="p-4 overflow-y-auto h-full">
                <div className="space-y-1">
                  {fileStructure.map((item, index) => (
                    <div
                      key={index}
                      className={`flex items-center space-x-2 p-2 rounded cursor-pointer hover:bg-blue-50 ${
                        selectedStructureItem === item.name ? "bg-blue-100" : ""
                      }`}
                      style={{ paddingLeft: `${item.level * 16 + 8}px` }}
                      onClick={() => setSelectedStructureItem(item.name)}
                    >
                      {item.type === "folder" ? (
                        <Folder className="h-4 w-4 text-blue-500" />
                      ) : (
                        getFileIcon(item.extension)
                      )}
                      <span className="text-sm">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto">
              <div className="container mx-auto px-4 py-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSidebarOpen(!sidebarOpen)}
                      className="border-blue-200 hover:bg-blue-50"
                    >
                      <Menu className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" onClick={handleBack} className="border-blue-200 hover:bg-blue-50">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back
                    </Button>

                    <Breadcrumb>
                      <BreadcrumbList>
                        {breadcrumbItems.map((item, index) => (
                          <div key={item.name} className="flex items-center">
                            {index > 0 && <BreadcrumbSeparator />}
                            <BreadcrumbItem>
                              {index === breadcrumbItems.length - 1 ? (
                                <BreadcrumbPage className="text-blue-600">{item.name}</BreadcrumbPage>
                              ) : item.href ? (
                                <BreadcrumbLink href={item.href}>{item.name}</BreadcrumbLink>
                              ) : (
                                <span>{item.name}</span>
                              )}
                            </BreadcrumbItem>
                          </div>
                        ))}
                      </BreadcrumbList>
                    </Breadcrumb>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="border-blue-200 text-blue-700">
                      <GitBranch className="h-3 w-3 mr-1" />
                      {branch}
                    </Badge>
                  </div>
                </div>

                {/* Latest Commit Info */}
                {currentFile?.lastCommit && (
                  <div
                    className="mb-6 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200/50 cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200"
                    onClick={handleCommitClick}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">{currentFile.lastCommit.author}</span>
                          <span className="text-gray-600">{currentFile.lastCommit.message}</span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                          <span className="flex items-center">
                            <GitCommit className="h-3 w-3 mr-1" />
                            {currentFile.lastCommit.hash}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {currentFile.lastCommit.time}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* File Header */}
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200/50 mb-6">
                  <div className="flex items-center space-x-3">
                    {getFileIcon(fileExtension)}
                    <div>
                      <h1 className="text-xl font-semibold text-blue-900">{fileName}</h1>
                      <p className="text-sm text-muted-foreground">{currentFile?.size}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigator.clipboard.writeText(currentFile?.content || "")}
                      className="border-blue-200 hover:bg-blue-50"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm" className="border-blue-200 hover:bg-blue-50">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button onClick={handleEdit} className="bg-blue-600 hover:bg-blue-700 text-white">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="destructive" onClick={handleDelete}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>

                {/* File Content */}
                <div className="border border-blue-200/50 rounded-xl shadow-lg bg-white/70 backdrop-blur-sm">
                  <div className="p-4 border-b border-blue-100 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
                    <h2 className="font-medium text-blue-900">File Contents</h2>
                  </div>
                  <div className="p-6">{renderFileContent()}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        fileName={fileName}
      />
    </AppLayout>
  )
}
